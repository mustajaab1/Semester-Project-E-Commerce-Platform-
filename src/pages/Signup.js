import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      window.location.href = '/';
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e9f3ff 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '10px',
          background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}>
          Create Account
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#6B7280',
          marginBottom: '30px',
          fontSize: '15px'
        }}>
          Join GikiFy today
        </p>

        {error && (
          <div style={{
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div style={{ marginBottom: '20px' }}>
            <label className="input-label" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontSize: '15px',
                boxShadow: isHovered === 'name' ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                borderColor: isHovered === 'name' ? '#3B82F6' : '#E5E7EB'
              }}
              onFocus={() => setIsHovered('name')}
              onBlur={() => setIsHovered('')}
              required
            />
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontSize: '15px',
                boxShadow: isHovered === 'email' ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                borderColor: isHovered === 'email' ? '#3B82F6' : '#E5E7EB'
              }}
              onFocus={() => setIsHovered('email')}
              onBlur={() => setIsHovered('')}
              required
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '15px',
                  boxShadow: isHovered === 'password' ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                  borderColor: isHovered === 'password' ? '#3B82F6' : '#E5E7EB'
                }}
                onFocus={() => setIsHovered('password')}
                onBlur={() => setIsHovered('')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontSize: '15px',
                boxShadow: isHovered === 'confirm' ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                borderColor: isHovered === 'confirm' ? '#3B82F6' : '#E5E7EB'
              }}
              onFocus={() => setIsHovered('confirm')}
              onBlur={() => setIsHovered('')}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            onMouseEnter={() => setIsHovered('submit')}
            onMouseLeave={() => setIsHovered('')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: isHovered === 'submit'
                ? 'linear-gradient(to right, #2563eb, #4F46E5)'
                : 'linear-gradient(to right, #3B82F6, #6366F1)',
              color: 'white',
              fontWeight: '600',
              cursor: isLoading ? 'default' : 'pointer',
              transition: 'all 0.3s ease',
              transform: isHovered === 'submit' && !isLoading ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: isHovered === 'submit' && !isLoading
                ? '0 10px 20px -10px rgba(59, 130, 246, 0.5)'
                : '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{
          marginTop: '24px',
          textAlign: 'center',
          color: '#6B7280',
          fontSize: '14px'
        }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#3B82F6',
              textDecoration: 'none',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.color = '#2563eb'}
            onMouseLeave={(e) => e.target.style.color = '#3B82F6'}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}