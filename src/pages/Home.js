// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import SearchBar from '../components/searchbar';
import api from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.fetchProducts().then(setProducts);
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 pt-24 pb-32">
      <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-center mb-12 animate-fade-in">
        Welcome to GikiFy!
      </h1>

      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Conditionally render no-results message or product grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-600 mt-16 text-xl font-light animate-fade-in">
          No products match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {filtered.map((product, index) => (
            <div
              key={product.id}
              className="group bg-white backdrop-blur-sm bg-opacity-80 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
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
              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-300 hover:shadow-lg">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
