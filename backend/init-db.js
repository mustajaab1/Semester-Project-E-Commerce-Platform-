const { initializeDatabase } = require('./db');

const init = async () => {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

init();
