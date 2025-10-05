import React from 'react'
import { Thermometer, Droplets, Gauge, Waves } from 'lucide-react'
import { getSensorStatus, getStatusConfig, formatValue } from '../utils/helpers'

const iconMap = {
  suhu: Thermometer,
  ph: Droplets,
  tds: Gauge,
  kelembaban: Waves
}

const labelMap = {
  suhu: 'Suhu Air',
  ph: 'pH Air',
  tds: 'Nutrisi (TDS)',
  kelembaban: 'Kelembaban'
}

const SensorCard = ({ type, value, timestamp }) => {
  const IconComponent = iconMap[type]
  const status = getSensorStatus(type, value)
  const statusConfig = getStatusConfig(status)

  return (
    <div className="sensor-card">
      <div className="sensor-header">
        <div className="sensor-icon">
          <IconComponent size={24} color={statusConfig.color} />
        </div>
        <div className="sensor-info">
          <h3>{labelMap[type]}</h3>
          <span className="sensor-value">
            {formatValue(value, type)}
          </span>
        </div>
      </div>
      
      <div 
        className="sensor-status"
        style={{
          backgroundColor: statusConfig.bgColor,
          color: statusConfig.textColor
        }}
      >
        {statusConfig.label}
      </div>

      {timestamp && (
        <div className="sensor-timestamp">
          Diperbarui: {new Date(timestamp).toLocaleTimeString('id-ID')}
        </div>
      )}
    </div>
  )
}

export default SensorCard