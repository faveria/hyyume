const SensorData = require('../models/SensorData');

class SensorService {
  // Get data within time range
  async getDataByTimeRange(startTime, endTime) {
    return await SensorData.find({
      timestamp: {
        $gte: new Date(startTime),
        $lte: new Date(endTime)
      }
    }).sort({ timestamp: 1 });
  }

  // Get optimal condition percentage
  async getOptimalConditionsPercentage(hours = 24) {
    const timeAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const total = await SensorData.countDocuments({
      timestamp: { $gte: timeAgo }
    });

    const optimal = await SensorData.countDocuments({
      timestamp: { $gte: timeAgo },
      ph: { $gte: 5.5, $lte: 6.5 },
      suhu: { $gte: 22, $lte: 25 },
      tds: { $gte: 560, $lte: 840 }
    });

    return total > 0 ? (optimal / total) * 100 : 0;
  }

  // Clean up old data (keep last 30 days)
  async cleanupOldData() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const result = await SensorData.deleteMany({
      timestamp: { $lt: thirtyDaysAgo }
    });

    console.log(`🧹 Cleaned up ${result.deletedCount} old sensor records`);
    return result;
  }
}

module.exports = new SensorService();