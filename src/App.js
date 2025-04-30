import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header'; // Import Header
import Home from './pages/Home';  // Create Home page component
import Cart from './pages/Cart';  // Create Cart page component
import Profile from './pages/Profile';  // Create Profile page component
import Login from './pages/Login'; // Add this import
import ProtectedRoute from './components/ProtectedRoute'; // Add this import

function App() {
  return (
    <Router>
      <Header />  {/* Add Header to all pages */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
