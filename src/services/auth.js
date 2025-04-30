import api from './api';

// Temporary test credentials (REMOVE IN PRODUCTION)
const TEST_CREDENTIALS = {
  email: 'mustajaabx@gmail.com',
  password: 'password123'
};

export const auth = {
  login: async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For testing purposes only - replace with real API call
    if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
      const fakeToken = 'fake-jwt-token';
      localStorage.setItem('token', fakeToken);
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default auth;