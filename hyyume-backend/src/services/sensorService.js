const SensorData = require('../models/SensorData');

class SensorService {
  // Get data within time range
  async getDataByTimeRange(startTime, endTime) {
    return await SensorData.getByTimeRange(startTime, endTime);
  }

  // Get optimal condition percentage
  async getOptimalConditionsPercentage(hours = 24) {
    return await SensorData.getOptimalPercentage(hours);
  }

  // Clean up old data (keep last 30 days)
  async cleanupOldData() {
    const result = await SensorData.deleteOldData(30);
    console.log(`🧹 Cleaned up ${result.affectedRows} old sensor records`);
    return result;
  }

  // Create new sensor data
  async createSensorData(data) {
    return await SensorData.create(data);
  }
}

module.exports = new SensorService();