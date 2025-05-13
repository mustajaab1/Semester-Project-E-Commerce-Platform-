import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [notification, setNotification] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [addProductForm, setAddProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock_quantity: '',
    image_url: ''
  });

  useEffect(() => {
    // Check if user is admin
    if (!api.isAdmin()) {
      navigate('/');
      return;
    }
    // Fetch categories
    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setCategories([]);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // In a real application, this would be handled by a secure backend
    // For demo purposes, we're using a simple password check
    if (adminPassword === 'admin123') {
      setIsAuthenticated(true);
      setError('');
      loadData();
    } else {
      setError('Invalid admin password');
    }
  };

  const loadData = async () => {
    try {
      const [productsData, ordersData] = await Promise.all([
        api.fetchProducts(),
        api.fetchOrders()
      ]);
      // Ensure price is a number for all products and normalize id
      setProducts(productsData.map(p => ({
        ...p,
        id: p.id || p.product_id, // normalize id
        price: typeof p.price === 'string' ? parseFloat(p.price) : p.price
      })));
      setOrders(ordersData);
    } catch (error) {
      setNotification({
        message: 'Failed to load data. Please try again.',
        type: 'error'
      });
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewPrice(product.price.toString());
  };

  const handleSavePrice = async () => {
    if (!editingProduct || !newPrice) return;

    try {
      const updatedProduct = await api.updateProductPrice(editingProduct.id, newPrice);
      setProducts(products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ));
      setNotification({
        message: 'Price updated successfully!',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Failed to update price. Please try again.',
        type: 'error'
      });
    }

    setEditingProduct(null);
    setNewPrice('');
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      setNotification({
        message: 'Order status updated successfully!',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Failed to update order status. Please try again.',
        type: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const handleAddProductChange = (e) => {
    setAddProductForm({
      ...addProductForm,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.addProduct({
        name: addProductForm.name,
        description: addProductForm.description,
        price: parseFloat(addProductForm.price),
        category_id: parseInt(addProductForm.category_id),
        stock_quantity: parseInt(addProductForm.stock_quantity),
        image_url: addProductForm.image_url
      });
      setNotification({ message: 'Product added successfully!', type: 'success' });
      setAddProductForm({ name: '', description: '', price: '', category_id: '', stock_quantity: '', image_url: '' });
      loadData();
    } catch (error) {
      setNotification({ message: error.message || 'Failed to add product', type: 'error' });
    }
  };

  if (!api.isAdmin()) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Dashboard Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please enter the admin password to continue
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleAdminLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="admin-password" className="sr-only">Admin Password</label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Admin Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Access Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 mt-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Lock Dashboard
          </button>
        </div>

        {notification && (
          <div className={`mb-4 p-4 rounded-md ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Orders
            </button>
          </div>
        </div>

        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Product Management</h2>
            {/* Add Product Form */}
            <form onSubmit={handleAddProduct} className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={addProductForm.name}
                    onChange={handleAddProductChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={addProductForm.price}
                    onChange={handleAddProductChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category_id"
                    value={addProductForm.category_id}
                    onChange={handleAddProductChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.category_id} value={category.category_id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={addProductForm.stock_quantity}
                    onChange={handleAddProductChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={addProductForm.description}
                    onChange={handleAddProductChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={addProductForm.image_url}
                    onChange={handleAddProductChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Product
                </button>
              </div>
            </form>

            {/* Products List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.product_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-10 w-10 rounded-full object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingProduct?.id === product.product_id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              min="0"
                              step="0.01"
                            />
                            <button
                              onClick={handleSavePrice}
                              className="text-green-600 hover:text-green-900"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-900">${product.price.toFixed(2)}</span>
                            <button
                              onClick={() => handleEditClick(product)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stock_quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.order_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{order.order_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.username}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.order_id, e.target.value)}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{selectedProduct.name}</h3>
                {selectedProduct.image_url && (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500 mb-2">Category: {selectedProduct.category_name}</p>
                  <p className="text-sm text-gray-500 mb-2">Price: ${selectedProduct.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 mb-2">Stock: {selectedProduct.stock_quantity}</p>
                  <p className="text-sm text-gray-500">{selectedProduct.description}</p>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    onClick={closeProductModal}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 