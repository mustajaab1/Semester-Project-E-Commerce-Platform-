// src/services/api.js

const API_URL = 'http://localhost:5000/api';

// Initial mock products data
const initialProducts = [
  {
    id: 1,
    name: "Laptop Pro X",
    description: "High-performance laptop with 16GB RAM and 512GB SSD",
    price: 1299.99,
    image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    category: "Electronics"
  },
  {
    id: 2,
    name: "Wireless Headphones",
    description: "Premium noise-canceling wireless headphones",
    price: 199.99,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    category: "Electronics"
  },
  {
    id: 3,
    name: "Smart Watch",
    description: "Fitness tracking smartwatch with heart rate monitor",
    price: 249.99,
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    category: "Electronics"
  },
  {
    id: 4,
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe",
    price: 79.99,
    image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    category: "Appliances"
  },
  {
    id: 5,
    name: "Professional Camera",
    description: "24MP DSLR camera with 4K video recording",
    price: 899.99,
    image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    category: "Electronics"
  },
  {
    id: 6,
    name: "Yoga Mat",
    description: "Premium eco-friendly yoga mat with carrying strap",
    price: 29.99,
    image_url: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&q=80",
    category: "Sports"
  },
  {
    id: 7,
    name: "Blender",
    description: "High-speed blender with multiple settings",
    price: 89.99,
    image_url: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80",
    category: "Appliances"
  },
  {
    id: 8,
    name: "Running Shoes",
    description: "Lightweight running shoes with cushioned soles",
    price: 119.99,
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    category: "Sports"
  },
  {
    id: 9,
    name: "Desk Lamp",
    description: "Adjustable LED desk lamp with multiple brightness levels",
    price: 39.99,
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    category: "Home"
  },
  {
    id: 10,
    name: "Backpack",
    description: "Water-resistant backpack with laptop compartment",
    price: 59.99,
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    category: "Accessories"
  },
  {
    id: 11,
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with long battery life",
    price: 49.99,
    image_url: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
    category: "Electronics"
  },
  {
    id: 12,
    name: "Plant Pot Set",
    description: "Set of 3 ceramic plant pots with drainage holes",
    price: 34.99,
    image_url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
    category: "Home"
  }
];

// Initial mock orders data
const initialOrders = [
  {
    id: 1,
    userId: 1,
    items: [
      { productId: 1, quantity: 1, price: 1299.99 },
      { productId: 2, quantity: 2, price: 199.99 }
    ],
    total: 1699.97,
    status: 'delivered',
    createdAt: '2024-03-15T10:30:00Z',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    }
  },
  {
    id: 2,
    userId: 1,
    items: [
      { productId: 3, quantity: 1, price: 249.99 }
    ],
    total: 249.99,
    status: 'processing',
    createdAt: '2024-03-20T15:45:00Z',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    }
  }
];

// Get products from localStorage or use initial data
const getProducts = () => {
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    return JSON.parse(storedProducts);
  }
  localStorage.setItem('products', JSON.stringify(initialProducts));
  return initialProducts;
};

// Get orders from localStorage or use initial data
const getOrders = () => {
  const storedOrders = localStorage.getItem('orders');
  if (storedOrders) {
    return JSON.parse(storedOrders);
  }
  localStorage.setItem('orders', JSON.stringify(initialOrders));
  return initialOrders;
};

export const api = {
  signup: async (userData) => {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  fetchProducts: async () => {
    // Return products from localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getProducts());
      }, 500); // Simulate network delay
    });
  },

  updateProductPrice: async (productId, newPrice) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = getProducts();
        const updatedProducts = products.map(product => 
          product.id === productId 
            ? { ...product, price: parseFloat(newPrice) }
            : product
        );
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        resolve(updatedProducts.find(p => p.id === productId));
      }, 500);
    });
  },

  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  },

  // Order Management
  fetchOrders: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = getOrders();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // If not admin, throw error
        if (user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        // Only return orders if user is admin
        resolve(orders);
      }, 500);
    });
  },

  createOrder: async (orderData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = getOrders();
        const newOrder = {
          id: orders.length + 1,
          ...orderData,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        const updatedOrders = [...orders, newOrder];
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        resolve(newOrder);
      }, 500);
    });
  },

  updateOrderStatus: async (orderId, newStatus) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = getOrders();
        const updatedOrders = orders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        );
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        resolve(updatedOrders.find(o => o.id === orderId));
      }, 500);
    });
  },

  getOrderDetails: async (orderId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = getOrders();
        const order = orders.find(o => o.id === orderId);
        if (!order) {
          throw new Error('Order not found');
        }
        resolve(order);
      }, 500);
    });
  }
};

export default api;
  