require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Import konfigurasi
const connectDB = require('./config/database');
const mqttClient = require('./config/mqtt');
const { initializeSocket } = require('./config/socket');

// Import routes
const sensorRoutes = require('./routes/sensorRoutes');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', sensorRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'HY.YUME Monitor Backend API',
    version: '1.0.0',
    endpoints: {
      sensorData: '/api/data',
      latestData: '/api/data/latest',
      specificData: '/api/data/:id'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Initialize services
const initializeApp = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Initialize MQTT
    mqttClient.initialize();
    console.log('✅ MQTT Client initialized');

    // Initialize Socket.IO
    initializeSocket(server);
    console.log('✅ Socket.IO initialized');

    // Start server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 HY.YUME Monitor Backend running on port ${PORT}`);
      console.log(`📊 API Documentation: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    process.exit(1);
  }
};

initializeApp();