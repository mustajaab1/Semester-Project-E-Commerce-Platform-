import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

function Profile() {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [form, setForm] = useState({
    username: user.username || '',
    email: user.email || '',
    password: '',
  });
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          ...(form.password ? { password: form.password } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      setNotification({ type: 'success', message: 'Profile updated successfully!' });
      setForm({ ...form, password: '' });
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mt-20 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-800 text-center mb-6">Your Profile</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        {/* User emoji avatar */}
        <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-6 border-4 border-blue-200 shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-20 h-20 text-blue-400"
          >
            <circle cx="12" cy="8" r="4" fill="#60A5FA" />
            <path
              d="M4 20c0-3.314 3.134-6 7-6s7 2.686 7 6"
              fill="#BFDBFE"
            />
          </svg>
        </div>
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">New Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave blank to keep current password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-all"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          {notification && (
            <div className={`mt-4 p-3 rounded text-center ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {notification.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;
