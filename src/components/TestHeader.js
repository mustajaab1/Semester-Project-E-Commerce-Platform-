import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

export default function TestHeader() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isHovered, setIsHovered] = useState('');
  const { cartItems } = useCart();
  const isAdmin = api.isAdmin();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/cart', label: 'Cart', showCount: true },
    { path: '/profile', label: 'Profile' },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin Dashboard' }] : [])
  ];

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '16px 24px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
    }}>
      {/* Left section: Logo and nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
        {/* Logo with animation */}
        <Link 
          to="/" 
          style={{ 
            fontSize: '28px', 
            fontWeight: '800', 
            background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            transform: isHovered === 'logo' ? 'scale(1.05)' : 'scale(1)',
            filter: isHovered === 'logo' ? 'brightness(1.2)' : 'brightness(1)'
          }}
          onMouseEnter={() => setIsHovered('logo')}
          onMouseLeave={() => setIsHovered('')}
        >
          GikiFy
        </Link>

        {/* Navigation - Only show when logged in */}
        {token && (
          <div style={{ display: 'flex', gap: '32px' }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{ 
                  color: isHovered === item.label ? '#3B82F6' : '#4B5563',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  padding: '4px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={() => setIsHovered(item.label)}
                onMouseLeave={() => setIsHovered('')}
              >
                {item.label}
                {item.showCount && cartItems.length > 0 && (
                  <span style={{
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 8px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'bounce 0.5s ease-in-out'
                  }}>
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  width: isHovered === item.label ? '100%' : '0%',
                  height: '2px',
                  background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
                  transition: 'all 0.3s ease',
                  transform: 'translateX(-50%)'
                }} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Right section: Auth button */}
      <div>
        {token ? (
          <button
            onClick={handleLogout}
            onMouseEnter={() => setIsHovered('logout')}
            onMouseLeave={() => setIsHovered('')}
            style={{
              background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: isHovered === 'logout' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isHovered === 'logout' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
            }}
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            onMouseEnter={() => setIsHovered('login')}
            onMouseLeave={() => setIsHovered('')}
            style={{
              background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: isHovered === 'login' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isHovered === 'login' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
            }}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
} 