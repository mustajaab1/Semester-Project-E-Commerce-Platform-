import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-blue-900 text-white p-4 shadow-lg fixed w-full z-10 top-0 left-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-white hover:text-blue-400 transition-all duration-300">E-Shop</Link>
        <nav>
          <Link to="/" className="mr-6 hover:text-blue-400 transition-all duration-300">Home</Link>
          <Link to="/cart" className="mr-6 hover:text-blue-400 transition-all duration-300">Cart</Link>
          <Link to="/profile" className="hover:text-blue-400 transition-all duration-300">Profile</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
