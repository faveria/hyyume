const SensorData = require('../models/SensorData');

// Get all sensor data with pagination
const getAllSensorData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const data = await SensorData.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SensorData.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data,
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
    const data = await SensorData.findOne().sort({ timestamp: -1 });
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'No sensor data found'
      });
    }

    res.json({
      success: true,
      data
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

    res.json({
      success: true,
      data
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
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stats = await SensorData.aggregate([
      {
        $match: {
          timestamp: { $gte: twentyFourHoursAgo }
        }
      },
      {
        $group: {
          _id: null,
          avgSuhu: { $avg: '$suhu' },
          avgPH: { $avg: '$ph' },
          avgTDS: { $avg: '$tds' },
          avgKelembaban: { $avg: '$kelembaban' },
          maxSuhu: { $max: '$suhu' },
          minSuhu: { $min: '$suhu' },
          count: { $sum: 1 }
        }
      }
    ]);

    const latestData = await SensorData.findOne().sort({ timestamp: -1 });

    res.json({
      success: true,
      data: {
        stats: stats[0] || {},
        latest: latestData
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