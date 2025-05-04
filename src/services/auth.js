export const auth = {
    // Test users database
    testUsers: [
      {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'user'
      },
      {
        id: 2,
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      },
      {
        id: 3,
        email: 'seller@example.com',
        password: 'seller123',
        name: 'Seller User',
        role: 'seller'
      },
      {
        id: 4,
        email: 'mustajaabx@gmail.com',
        password: 'giki2023',
        name: 'Mustajaab',
        role: 'user'
      }
    ],

    login: async (email, password) => {
      try {
        const user = auth.testUsers.find(
          user => user.email === email && user.password === password
        );

        if (user) {
          const mockResponse = {
            token: `fake-jwt-token-${user.id}`,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            }
          };
          localStorage.setItem('token', mockResponse.token);
          localStorage.setItem('user', JSON.stringify(mockResponse.user));
          return mockResponse;
        }
        throw new Error('Invalid credentials');
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
  
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  
    isAuthenticated: () => {
      const token = localStorage.getItem('token');
      console.log('Checking token:', token); // Debug line
      return !!token;
    },

    getCurrentUser: () => {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
  };
  
  export default auth;