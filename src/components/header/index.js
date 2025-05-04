import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '16px 24px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      {/* Left section: Logo and nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link to="/" style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          background: 'linear-gradient(to right, #2563eb, #4f46e5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none'
        }}>
          GikiFy
        </Link>

        {token && (
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link to="/" style={{ 
              color: '#4B5563', 
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Home
            </Link>
            <Link to="/cart" style={{ 
              color: '#4B5563', 
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Cart
            </Link>
            <Link to="/profile" style={{ 
              color: '#4B5563', 
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Profile
            </Link>
          </div>
        )}
      </div>

      {/* Right section: Auth button */}
      <div>
        {token ? (
          <button
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(to right, #DC2626, #EF4444)',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
            }}
            onMouseOver={e => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 6px rgba(239, 68, 68, 0.3)';
            }}
            onMouseOut={e => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.2)';
            }}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            style={{
              background: 'linear-gradient(to right, #2563eb, #4f46e5)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'inline-block',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
            }}
            onMouseOver={e => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 6px rgba(37, 99, 235, 0.3)';
            }}
            onMouseOut={e => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(37, 99, 235, 0.2)';
            }}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
} 