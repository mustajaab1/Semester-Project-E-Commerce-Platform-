// src/services/api.js

// A simple list of products for demo purposes
const products = [
    {
      id: 1,
      name: 'Product 1',
      price: 50.00,
      image_url: 'https://via.placeholder.com/300',
      description: 'Description for product 1'
    },
    {
      id: 2,
      name: 'Product 2',
      price: 75.00,
      image_url: 'https://via.placeholder.com/300',
      description: 'Description for product 2'
    },
    {
      id: 3,
      name: 'Product 3',
      price: 30.00,
      image_url: 'https://via.placeholder.com/300',
      description: 'Description for product 3'
    }
  ];
  
  // Simulate an asynchronous API call
  export default {
    fetchProducts: () =>
      new Promise((resolve) => {
        setTimeout(() => resolve(products), 500);
      }),
  
    fetchProductById: (id) =>
      new Promise((resolve) => {
        const product = products.find((p) => p.id === Number(id));
        setTimeout(() => resolve(product), 500);
      })
  };
  