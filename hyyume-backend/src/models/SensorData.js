const { getConnection } = require('../config/database');

class SensorData {
  // Create new sensor data
  static async create(data) {
    const connection = getConnection();
    const query = `
      INSERT INTO sensor_data (suhu, ph, tds, kelembaban, timestamp) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result] = await connection.execute(query, [
      data.suhu,
      data.ph,
      data.tds,
      data.kelembaban || null,
      data.timestamp || new Date()
    ]);
    
    return this.findById(result.insertId);
  }

  // Find all with pagination
  static async findAll(options = {}) {
    const connection = getConnection();
    const { page = 1, limit = 50, sort = 'timestamp DESC' } = options;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM sensor_data 
      ORDER BY ${sort} 
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await connection.execute(query, [limit, offset]);
    return rows;
  }

  // Find by ID
  static async findById(id) {
    const connection = getConnection();
    const query = 'SELECT * FROM sensor_data WHERE id = ?';
    const [rows] = await connection.execute(query, [id]);
    return rows[0] || null;
  }

  // Find one with sorting
  static async findOne(options = {}) {
    const connection = getConnection();
    const { sort = 'timestamp DESC' } = options;
    
    const query = `SELECT * FROM sensor_data ORDER BY ${sort} LIMIT 1`;
    const [rows] = await connection.execute(query);
    return rows[0] || null;
  }

  // Count total records
  static async countDocuments() {
    const connection = getConnection();
    const query = 'SELECT COUNT(*) as total FROM sensor_data';
    const [rows] = await connection.execute(query);
    return rows[0].total;
  }

  // Get statistics (24 hours)
  static async getStats24h() {
    const connection = getConnection();
    const query = `
      SELECT 
        AVG(suhu) as avgSuhu,
        AVG(ph) as avgPH,
        AVG(tds) as avgTDS,
        AVG(kelembaban) as avgKelembaban,
        MAX(suhu) as maxSuhu,
        MIN(suhu) as minSuhu,
        COUNT(*) as count
      FROM sensor_data 
      WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    `;
    
    const [rows] = await connection.execute(query);
    return rows[0] || {};
  }

  // Delete old data (30 days)
  static async deleteOldData(days = 30) {
    const connection = getConnection();
    const query = 'DELETE FROM sensor_data WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)';
    const [result] = await connection.execute(query, [days]);
    return result;
  }

  // Check if conditions are optimal
  static isOptimal(data) {
    const optimalPH = data.ph >= 5.5 && data.ph <= 6.5;
    const optimalSuhu = data.suhu >= 22 && data.suhu <= 25;
    const optimalTDS = data.tds >= 560 && data.tds <= 840;
    
    return optimalPH && optimalSuhu && optimalTDS;
  }

  // Get status text
  static getStatus(data) {
    if (this.isOptimal(data)) {
      return 'optimal';
    }
    
    const issues = [];
    if (data.ph < 5.5 || data.ph > 6.5) issues.push('pH tidak optimal');
    if (data.suhu < 22 || data.suhu > 25) issues.push('Suhu tidak optimal');
    if (data.tds < 560 || data.tds > 840) issues.push('Nutrisi tidak optimal');
    
    return issues.length > 0 ? issues.join(', ') : 'unknown';
  }

  // Get data by time range
  static async getByTimeRange(startTime, endTime) {
    const connection = getConnection();
    const query = `
      SELECT * FROM sensor_data 
      WHERE timestamp BETWEEN ? AND ? 
      ORDER BY timestamp ASC
    `;
    
    const [rows] = await connection.execute(query, [startTime, endTime]);
    return rows;
  }

  // Get optimal conditions percentage
  static async getOptimalPercentage(hours = 24) {
    const connection = getConnection();
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(
          CASE WHEN ph BETWEEN 5.5 AND 6.5 
          AND suhu BETWEEN 22 AND 25 
          AND tds BETWEEN 560 AND 840 
          THEN 1 ELSE 0 END
        ) as optimal
      FROM sensor_data 
      WHERE timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR)
    `;
    
    const [rows] = await connection.execute(query, [hours]);
    const { total, optimal } = rows[0];
    
    return total > 0 ? (optimal / total) * 100 : 0;
  }
}

module.exports = SensorData;