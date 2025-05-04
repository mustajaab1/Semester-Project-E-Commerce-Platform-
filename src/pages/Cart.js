import React from 'react';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  return (
    <div className="p-4 mt-20 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-6">Your Cart</h1>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Items in Your Cart</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-600 text-center py-4">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  <div className="flex-1">
                    <h3 className="text-xl text-gray-700">{item.name}</h3>
                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">
              Total: ${getCartTotal().toFixed(2)}
            </h2>
            <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
