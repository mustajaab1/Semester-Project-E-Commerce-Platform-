const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// Test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
};

// Initialize database schema
const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Read and execute schema.sql
    const fs = require('fs');
    const path = require('path');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    await client.query(schema);
    console.log('Database schema initialized successfully');
    
    client.release();
    return true;
  } catch (err) {
    console.error('Database initialization error:', err);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase
};
