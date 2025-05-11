// src/services/api.js

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
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

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  fetchProducts: async () => {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },

  addToCart: async (productId, quantity) => {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      throw new Error('Failed to add to cart');
    }

    return response.json();
  },

  getCart: async () => {
    const response = await fetch(`${API_URL}/cart`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }

    return response.json();
  },

  createOrder: async (orderData) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return response.json();
  },

  fetchOrders: async () => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  },

  updateProductPrice: async (productId, newPrice) => {
    const response = await fetch(`${API_URL}/products/${productId}/price`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ price: newPrice }),
    });
    if (!response.ok) {
      throw new Error('Failed to update product price');
    }
    return response.json();
  },

  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  },

  getOrderDetails: async (orderId) => {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch order details');
    }
    return response.json();
  },

  addProduct: async (productData) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add product');
    }
    return response.json();
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update order status');
    }
    return response.json();
  },
};

export default api;
  