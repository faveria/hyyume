import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useWebSocket } from '../hooks/useWebSocket'

const Charts = () => {
  const { dataHistory } = useWebSocket()

  const chartData = dataHistory.slice(0, 20).reverse().map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    suhu: item.suhu,
    ph: item.ph,
    tds: item.tds,
    kelembaban: item.kelembaban || 0
  }))

  if (dataHistory.length === 0) {
    return (
      <div className="charts-container">
        <h3>📈 Grafik Data Sensor</h3>
        <div className="no-data">
          <p>Menunggu data sensor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="charts-container">
      <h3>📈 Grafik Data Sensor (20 Data Terakhir)</h3>
      
      <div className="charts-grid">
        <div className="chart-card">
          <h4>🌡️ Suhu Air</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[20, 30]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="suhu" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>🧪 pH Air</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[5, 8]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="ph" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>💧 Nutrisi (TDS)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[400, 1000]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="tds" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>💨 Kelembaban</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="kelembaban" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Charts