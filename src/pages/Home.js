// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/searchbar';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import Notification from '../components/Notification';

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api.fetchProducts().then(setProducts);
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent navigation when clicking the add to cart button
    addToCart(product);
    setNotification({
      message: `${product.name} added to cart!`,
      onClose: () => setNotification(null)
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="p-4 mt-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-6">Our Products</h1>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, index) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="group bg-white backdrop-blur-sm bg-opacity-80 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">${product.price}</span>
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notification && <Notification {...notification} />}
    </div>
  );
}
