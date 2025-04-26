import React from 'react';

function Home() {
  return (
    <div className="p-4 mt-20 bg-gray-100 min-h-screen">
      <h1 className="text-5xl font-extrabold text-blue-800 text-center mb-6">Welcome to E-Shop!</h1>
      <p className="text-xl text-gray-700 text-center mb-12">Find the best products for your needs</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Product Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all">
          <img src="https://via.placeholder.com/300" alt="Product" className="w-full h-48 object-cover rounded-md mb-4" />
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Product 1</h3>
          <p className="text-gray-600 mb-4">Description of the product goes here.</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all">Add to Cart</button>
        </div>

        {/* Product Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all">
          <img src="https://via.placeholder.com/300" alt="Product" className="w-full h-48 object-cover rounded-md mb-4" />
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Product 2</h3>
          <p className="text-gray-600 mb-4">Description of the product goes here.</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all">Add to Cart</button>
        </div>

        {/* Product Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all">
          <img src="https://via.placeholder.com/300" alt="Product" className="w-full h-48 object-cover rounded-md mb-4" />
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Product 3</h3>
          <p className="text-gray-600 mb-4">Description of the product goes here.</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
