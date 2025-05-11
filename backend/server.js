const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool, testConnection, initializeDatabase } = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Initialize database schema
    const isInitialized = await initializeDatabase();
    if (!isInitialized) {
      throw new Error('Database initialization failed');
    }

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
};

// Auth endpoints
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, role',
      [username, email, passwordHash, 'user']
    );

    // Generate JWT
    const token = jwt.sign(
      { userId: result.rows[0].user_id, role: result.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: result.rows[0],
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Category endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY category_name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/categories', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { category_name } = req.body;
    const result = await pool.query(
      'INSERT INTO categories (category_name) VALUES ($1) RETURNING *',
      [category_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Product endpoints
app.get('/api/products', async (req, res) => {
  try {
    const { category_id, search } = req.query;
    let query = `
      SELECT p.*, c.category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.category_id
      WHERE 1=1
    `;
    const params = [];

    if (category_id) {
      query += ' AND p.category_id = $1';
      params.push(category_id);
    }

    if (search) {
      query += ` AND (p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, description, price, category_id, stock_quantity, image_url } = req.body;
    const result = await pool.query(
      'INSERT INTO products (name, description, price, category_id, stock_quantity, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, category_id, stock_quantity, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cart endpoints
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sc.*, p.name, p.price, p.image_url 
       FROM shopping_cart sc 
       JOIN products p ON sc.product_id = p.product_id 
       WHERE sc.user_id = $1`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    
    // Check if product exists in cart
    const existingItem = await pool.query(
      'SELECT * FROM shopping_cart WHERE user_id = $1 AND product_id = $2',
      [req.user.userId, product_id]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      const result = await pool.query(
        'UPDATE shopping_cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [quantity, req.user.userId, product_id]
      );
      res.json(result.rows[0]);
    } else {
      // Add new item
      const result = await pool.query(
        'INSERT INTO shopping_cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [req.user.userId, product_id, quantity]
      );
      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Order endpoints
app.post('/api/orders', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { items, shipping_address } = req.body;
    const userId = req.user.userId;

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total, status, shipping_address) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, total, 'pending', shipping_address]
    );

    const orderId = orderResult.rows[0].order_id;

    // Add order items
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_time_of_order) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Update product stock
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE product_id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Clear user's cart
    await client.query('DELETE FROM shopping_cart WHERE user_id = $1', [userId]);

    await client.query('COMMIT');

    res.status(201).json(orderResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? `
        SELECT o.*, u.username, u.email,
        json_agg(json_build_object(
          'order_item_id', oi.order_item_id,
          'product_id', p.product_id,
          'product_name', p.name,
          'quantity', oi.quantity,
          'price', oi.price_at_time_of_order
        )) as items
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.product_id
        GROUP BY o.order_id, u.username, u.email
        ORDER BY o.created_at DESC
      `
      : `
        SELECT o.*,
        json_agg(json_build_object(
          'order_item_id', oi.order_item_id,
          'product_id', p.product_id,
          'product_name', p.name,
          'quantity', oi.quantity,
          'price', oi.price_at_time_of_order
        )) as items
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE o.user_id = $1
        GROUP BY o.order_id
        ORDER BY o.created_at DESC
      `;
    
    const params = req.user.role === 'admin' ? [] : [req.user.userId];
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Review endpoints
app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    const result = await pool.query(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.userId, product_id, rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.username 
       FROM reviews r 
       JOIN users u ON r.user_id = u.user_id 
       WHERE r.product_id = $1 
       ORDER BY r.created_at DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0]);
  }
});

startServer(); 