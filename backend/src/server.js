const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

console.log('Loading database configuration...');
const { testConnection } = require('./config/database');
console.log('Database configuration loaded');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Serve uploaded files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
try {
  console.log('Loading routes...');
  app.use('/api/auth', require('./routes/auth'));
  console.log('✓ Auth routes loaded');
  app.use('/api/students', require('./routes/students'));
  console.log('✓ Students routes loaded');
  app.use('/api/lessons', require('./routes/lessons'));
  console.log('✓ Lessons routes loaded');
  app.use('/api/analytics', require('./routes/analytics'));
  console.log('✓ Analytics routes loaded');
  app.use('/api/homework', require('./routes/homework'));
  console.log('✓ Homework routes loaded');
  app.use('/api/materials', require('./routes/materials'));
  console.log('✓ Materials routes loaded');
  app.use('/api/payments', require('./routes/payments'));
  console.log('✓ Payments routes loaded');
  app.use('/api/admin', require('./routes/admin'));
  console.log('✓ Admin routes loaded');
  app.use('/api/migrate', require('./routes/migrate'));
  console.log('✓ Migrate routes loaded');
  console.log('All routes loaded successfully!');
} catch (error) {
  console.error('Error loading routes:', error);
  console.error('Error stack:', error.stack);
  process.exit(1);
}

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    console.log('Starting server...');
    console.log(`PORT: ${PORT}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    
    // В production ждем подключения к БД с повторными попытками
    if (process.env.NODE_ENV === 'production') {
      console.log('Waiting for database connection...');
      let retries = 5;
      while (retries > 0) {
        try {
          await testConnection();
          console.log('Database connection established!');
          break;
        } catch (error) {
          retries--;
          if (retries === 0) {
            console.error('Failed to connect to database after all retries:', error);
            throw error;
          }
          console.log(`Database connection failed, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    } else {
      console.log('Testing database connection...');
      await testConnection();
      console.log('Database connection established!');
    }
    
    console.log(`Starting HTTP server on 0.0.0.0:${PORT}...`);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server is running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ Health check available at http://0.0.0.0:${PORT}/health`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
};

startServer();

module.exports = app;

