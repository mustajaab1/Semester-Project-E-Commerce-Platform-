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
    <div className="p-4 mt-20 bg-gray-100 min-h-screen">
      <h1 className="text-5xl font-extrabold text-blue-800 text-center mb-6">
        Welcome to E-Shop!
      </h1>

      {/* Search bar */}
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {/* Conditionally render no-results message or product grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No products match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
