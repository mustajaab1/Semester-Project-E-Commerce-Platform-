import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header'; // Import Header
import Home from './pages/Home';  // Create Home page component
import Cart from './pages/Cart';  // Create Cart page component
import Profile from './pages/Profile';  // Create Profile page component

function App() {
  return (
    <Router>
      <Header />  {/* Add Header to all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
