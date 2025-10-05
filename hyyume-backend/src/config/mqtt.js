const mqtt = require('mqtt');
const SensorData = require('../models/SensorData');
const { broadcastSensorData } = require('./socket');

class MQTTService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  initialize() {
    try {
      this.client = mqtt.connect(process.env.MQTT_BROKER_URL);

      this.client.on('connect', () => {
        this.isConnected = true;
        console.log('✅ Connected to MQTT Broker');
        
        // Subscribe to sensor data topic
        this.client.subscribe(process.env.MQTT_TOPIC, (err) => {
          if (err) {
            console.error('❌ MQTT Subscription error:', err);
          } else {
            console.log(`📡 Subscribed to topic: ${process.env.MQTT_TOPIC}`);
          }
        });
      });

      this.client.on('message', async (topic, message) => {
        try {
          if (topic === process.env.MQTT_TOPIC) {
            await this.handleSensorData(message.toString());
          }
        } catch (error) {
          console.error('Error processing MQTT message:', error);
        }
      });

      this.client.on('error', (error) => {
        console.error('❌ MQTT Client error:', error);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        console.log('🔌 MQTT Connection closed');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ MQTT Initialization error:', error);
    }
  }

  async handleSensorData(message) {
    try {
      const sensorData = JSON.parse(message);
      
      // Validate required fields
      if (!sensorData.suhu || !sensorData.ph || !sensorData.tds) {
        throw new Error('Invalid sensor data: missing required fields');
      }

      // Create new sensor data document
      const newData = new SensorData({
        suhu: parseFloat(sensorData.suhu),
        ph: parseFloat(sensorData.ph),
        tds: parseFloat(sensorData.tds),
        kelembaban: sensorData.kelembaban ? parseFloat(sensorData.kelembaban) : null,
        timestamp: new Date()
      });

      const savedData = await newData.save();
      console.log('📊 Sensor data saved:', savedData._id);

      // Broadcast to connected WebSocket clients
      broadcastSensorData(savedData);

    } catch (error) {
      console.error('Error handling sensor data:', error);
    }
  }

  publish(topic, message) {
    if (this.isConnected && this.client) {
      this.client.publish(topic, JSON.stringify(message));
    }
  }
}

module.exports = new MQTTService();