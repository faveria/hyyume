import React from 'react'
import { useWebSocket } from '../hooks/useWebSocket'
import SensorCard from './SensorCard'
import Charts from './Charts'
import DataTable from './DataTable'
import { getOverallStatus, getStatusConfig } from '../utils/helpers'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

const SystemStatus = ({ data }) => {
  if (!data) {
    return (
      <div className="system-status unknown">
        <div className="status-content">
          <AlertTriangle size={24} />
          <div>
            <h3>Status Sistem: Tidak Diketahui</h3>
            <p>Menunggu data dari sensor...</p>
          </div>
        </div>
      </div>
    )
  }

  const overallStatus = getOverallStatus(data)
  const statusConfig = getStatusConfig(overallStatus)

  const getStatusMessage = () => {
    switch (overallStatus) {
      case 'optimal':
        return 'Semua parameter dalam kondisi optimal untuk pertumbuhan tanaman'
      case 'warning':
        return 'Beberapa parameter memerlukan perhatian'
      case 'danger':
        return 'Beberapa parameter dalam kondisi kritis, perlu penanganan segera'
      default:
        return 'Status sistem tidak dapat ditentukan'
    }
  }

  return (
    <div 
      className="system-status"
      style={{
        backgroundColor: statusConfig.bgColor,
        color: statusConfig.textColor,
        borderColor: statusConfig.color
      }}
    >
      <div className="status-content">
        {overallStatus === 'optimal' ? (
          <CheckCircle2 size={24} />
        ) : (
          <AlertTriangle size={24} />
        )}
        <div>
          <h3>Status Sistem: {statusConfig.label}</h3>
          <p>{getStatusMessage()}</p>
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { sensorData, dataHistory } = useWebSocket()

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Monitoring Real-time</h2>
        <div className="stats">
          <span className="stat-item">
            Data Terima: <strong>{dataHistory.length}</strong>
          </span>
          <span className="stat-item">
            Terakhir: <strong>
              {sensorData ? new Date(sensorData.timestamp).toLocaleTimeString('id-ID') : '--'}
            </strong>
          </span>
        </div>
      </div>

      <SystemStatus data={sensorData} />

      <div className="sensors-grid">
        <SensorCard 
          type="suhu" 
          value={sensorData?.suhu} 
          timestamp={sensorData?.timestamp}
        />
        <SensorCard 
          type="ph" 
          value={sensorData?.ph} 
          timestamp={sensorData?.timestamp}
        />
        <SensorCard 
          type="tds" 
          value={sensorData?.tds} 
          timestamp={sensorData?.timestamp}
        />
        <SensorCard 
          type="kelembaban" 
          value={sensorData?.kelembaban} 
          timestamp={sensorData?.timestamp}
        />
      </div>

      <Charts />
      <DataTable />
    </div>
  )
}

export default Dashboard