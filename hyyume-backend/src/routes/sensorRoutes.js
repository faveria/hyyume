const express = require('express');
const router = express.Router();
const {
  getAllSensorData,
  getLatestSensorData,
  getSensorDataById,
  getSensorStats
} = require('../controllers/sensorDataController');

// GET /api/data - Get all sensor data with pagination
router.get('/data', getAllSensorData);

// GET /api/data/latest - Get latest sensor data
router.get('/data/latest', getLatestSensorData);

// GET /api/data/stats - Get sensor data statistics
router.get('/data/stats', getSensorStats);

// GET /api/data/:id - Get sensor data by ID
router.get('/data/:id', getSensorDataById);

module.exports = router;