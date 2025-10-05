const SensorData = require('../models/SensorData');

// Get all sensor data with pagination
const getAllSensorData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const data = await SensorData.findAll({ page, limit, sort: 'timestamp DESC' });
    const total = await SensorData.countDocuments();
    const totalPages = Math.ceil(total / limit);

    // Add virtual fields to each data item
    const enhancedData = data.map(item => ({
      ...item,
      isOptimal: SensorData.isOptimal(item),
      status: SensorData.getStatus(item)
    }));

    res.json({
      success: true,
      data: enhancedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sensor data',
      error: error.message
    });
  }
};

// Get latest sensor data
const getLatestSensorData = async (req, res) => {
  try {
    const data = await SensorData.findOne({ sort: 'timestamp DESC' });
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'No sensor data found'
      });
    }

    // Add virtual fields
    const enhancedData = {
      ...data,
      isOptimal: SensorData.isOptimal(data),
      status: SensorData.getStatus(data)
    };

    res.json({
      success: true,
      data: enhancedData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching latest sensor data',
      error: error.message
    });
  }
};

// Get sensor data by ID
const getSensorDataById = async (req, res) => {
  try {
    const data = await SensorData.findById(req.params.id);
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Sensor data not found'
      });
    }

    // Add virtual fields
    const enhancedData = {
      ...data,
      isOptimal: SensorData.isOptimal(data),
      status: SensorData.getStatus(data)
    };

    res.json({
      success: true,
      data: enhancedData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sensor data',
      error: error.message
    });
  }
};

// Get sensor data statistics
const getSensorStats = async (req, res) => {
  try {
    const stats = await SensorData.getStats24h();
    const latestData = await SensorData.findOne({ sort: 'timestamp DESC' });

    res.json({
      success: true,
      data: {
        stats: stats,
        latest: latestData ? {
          ...latestData,
          isOptimal: SensorData.isOptimal(latestData),
          status: SensorData.getStatus(latestData)
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sensor statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllSensorData,
  getLatestSensorData,
  getSensorDataById,
  getSensorStats
};