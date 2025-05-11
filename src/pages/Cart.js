import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../services/api';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.createOrder({
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping_address: address
      });
      clearCart();
      setNotification({ type: 'success', message: 'Order placed successfully!' });
      setShowCheckout(false);
      setAddress({ fullName: '', street: '', city: '', state: '', zip: '', country: '' });
    } catch (error) {
      setNotification({ type: 'error', message: error.message || 'Failed to place order' });
    } finally {
      setIsLoading(false);
    }
  };

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
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all mb-4"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? 'Placing Order...' : 'Proceed to Checkout'}
            </button>
            {showCheckout && (
              <form onSubmit={handlePlaceOrder} className="space-y-3 bg-gray-50 p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                <input
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleAddressChange}
                  placeholder="Full Name"
                  className="border rounded px-3 py-2 w-full"
                  required
                />
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  placeholder="Street Address"
                  className="border rounded px-3 py-2 w-full"
                  required
                />
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                  className="border rounded px-3 py-2 w-full"
                  required
                />
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  placeholder="State/Province"
                  className="border rounded px-3 py-2 w-full"
                  required
                />
                <input
                  type="text"
                  name="zip"
                  value={address.zip}
                  onChange={handleAddressChange}
                  placeholder="ZIP/Postal Code"
                  className="border rounded px-3 py-2 w-full"
                  required
                />
                <input
                  type="text"
                  name="country"
                  value={address.country}
                  onChange={handleAddressChange}
                  placeholder="Country"
                  className="border rounded px-3 py-2 w-full"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            )}
            {notification && (
              <div className={`mt-4 p-3 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {notification.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
