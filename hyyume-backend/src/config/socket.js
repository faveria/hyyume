const { Server } = require('socket.io');

let io = null;
let connectedClients = 0;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    connectedClients++;
    console.log(`🔌 Client connected: ${socket.id} (Total: ${connectedClients})`);

    socket.emit('connected', { 
      message: 'Connected to HY.YUME Monitor WebSocket',
      clientId: socket.id
    });

    socket.on('disconnect', () => {
      connectedClients--;
      console.log(`🔌 Client disconnected: ${socket.id} (Total: ${connectedClients})`);
    });

    socket.on('request_latest_data', async () => {
      try {
        const SensorData = require('../models/SensorData');
        const latestData = await SensorData.findOne().sort({ timestamp: -1 });
        
        if (latestData) {
          socket.emit('sensor_data', latestData);
        }
      } catch (error) {
        console.error('Error sending latest data:', error);
      }
    });
  });

  return io;
};

const broadcastSensorData = (data) => {
  if (io) {
    io.emit('sensor_data', data);
    console.log(`📢 Broadcasted sensor data to ${connectedClients} clients`);
  }
};

const getConnectedClients = () => connectedClients;

module.exports = {
  initializeSocket,
  broadcastSensorData,
  getConnectedClients
};