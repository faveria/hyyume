const mysql = require('mysql2/promise');

let connection;

const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hy_yume_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ MySQL Connected');
    
    // Create table if not exists
    await createTableIfNotExists();
    
    return connection;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

const createTableIfNotExists = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS sensor_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      suhu DECIMAL(5,2) NOT NULL,
      ph DECIMAL(4,2) NOT NULL,
      tds INT NOT NULL,
      kelembaban DECIMAL(5,2),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_timestamp (timestamp)
    )
  `;
  
  await connection.execute(createTableQuery);
  console.log('✅ Sensor data table ready');
};

const getConnection = () => {
  if (!connection) {
    throw new Error('Database not connected');
  }
  return connection;
};

module.exports = { connectDB, getConnection };