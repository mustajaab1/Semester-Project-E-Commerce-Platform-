import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    api.fetchProducts().then(setProducts);
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewPrice(product.price.toString());
  };

  const handleSavePrice = () => {
    if (!editingProduct || !newPrice) return;

    const updatedProduct = {
      ...editingProduct,
      price: parseFloat(newPrice)
    };

    // Update the product in the products array
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));

    // Reset editing state
    setEditingProduct(null);
    setNewPrice('');
  };

  return (
    <div className="p-4 mt-20 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-6">Product Management</h1>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Products</h2>
          
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center border-b pb-4">
                <div className="flex-1">
                  <h3 className="text-xl text-gray-700">{product.name}</h3>
                  <p className="text-gray-500">{product.description}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  {editingProduct?.id === product.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-24 p-2 border rounded"
                        step="0.01"
                        min="0"
                      />
                      <button
                        onClick={handleSavePrice}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingProduct(null);
                          setNewPrice('');
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-xl font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleEditClick(product)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Edit Price
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 