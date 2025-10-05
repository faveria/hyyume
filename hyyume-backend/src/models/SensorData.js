const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  suhu: {
    type: Number,
    required: true,
    min: -10,
    max: 100
  },
  ph: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  },
  tds: {
    type: Number,
    required: true,
    min: 0,
    max: 2000
  },
  kelembaban: {
    type: Number,
    min: 0,
    max: 100
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
sensorDataSchema.index({ timestamp: -1 });

// Virtual for ideal conditions check
sensorDataSchema.virtual('isOptimal').get(function() {
  const optimalPH = this.ph >= 5.5 && this.ph <= 6.5;
  const optimalSuhu = this.suhu >= 22 && this.suhu <= 25;
  const optimalTDS = this.tds >= 560 && this.tds <= 840;
  
  return optimalPH && optimalSuhu && optimalTDS;
});

// Instance method to get status
sensorDataSchema.methods.getStatus = function() {
  if (this.isOptimal) {
    return 'optimal';
  }
  
  const issues = [];
  if (this.ph < 5.5 || this.ph > 6.5) issues.push('pH tidak optimal');
  if (this.suhu < 22 || this.suhu > 25) issues.push('Suhu tidak optimal');
  if (this.tds < 560 || this.tds > 840) issues.push('Nutrisi tidak optimal');
  
  return issues.length > 0 ? issues.join(', ') : 'unknown';
};

module.exports = mongoose.model('SensorData', sensorDataSchema);