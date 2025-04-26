import React from 'react';

function Cart() {
  return (
    <div className="p-4 mt-20 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-6">Your Cart</h1>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Items in Your Cart</h2>

          <div className="space-y-4">
            {/* Cart Item */}
            <div className="flex justify-between items-center">
              <span className="text-xl text-gray-700">Product 1</span>
              <span className="text-gray-600">Qty: 1</span>
              <span className="text-gray-800 font-semibold">$50.00</span>
            </div>

            {/* Cart Item */}
            <div className="flex justify-between items-center">
              <span className="text-xl text-gray-700">Product 2</span>
              <span className="text-gray-600">Qty: 2</span>
              <span className="text-gray-800 font-semibold">$100.00</span>
            </div>

            {/* Cart Item */}
            <div className="flex justify-between items-center">
              <span className="text-xl text-gray-700">Product 3</span>
              <span className="text-gray-600">Qty: 1</span>
              <span className="text-gray-800 font-semibold">$30.00</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Total: $180.00</h2>
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
