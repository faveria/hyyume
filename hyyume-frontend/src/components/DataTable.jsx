import React, { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { formatTimestamp, getOverallStatus, getStatusConfig } from '../utils/helpers'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'

const DataTable = () => {
  const { getAllData, loading, error } = useApi()
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const fetchData = async (page = 1) => {
    try {
      const response = await getAllData(page, pagination.limit)
      setData(response.data)
      setPagination(response.pagination)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    }
  }

  useEffect(() => {
    fetchData(1)
  }, [])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchData(newPage)
    }
  }

  if (loading && data.length === 0) {
    return (
      <div className="data-table">
        <div className="loading">Memuat data...</div>
      </div>
    )
  }

  return (
    <div className="data-table">
      <div className="table-header">
        <h3>📋 Riwayat Data Sensor</h3>
        <button 
          className="refresh-btn"
          onClick={() => fetchData(pagination.page)}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Suhu (°C)</th>
              <th>pH</th>
              <th>TDS (ppm)</th>
              <th>Kelembaban (%)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const overallStatus = getOverallStatus(item)
              const statusConfig = getStatusConfig(overallStatus)
              
              return (
                <tr key={item._id}>
                  <td className="timestamp">
                    {formatTimestamp(item.timestamp)}
                  </td>
                  <td>{item.suhu}</td>
                  <td>{item.ph}</td>
                  <td>{item.tds}</td>
                  <td>{item.kelembaban || '--'}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{
                        backgroundColor: statusConfig.bgColor,
                        color: statusConfig.textColor
                      }}
                    >
                      {statusConfig.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {data.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev || loading}
          >
            <ChevronLeft size={16} />
            Sebelumnya
          </button>
          
          <span className="page-info">
            Halaman {pagination.page} dari {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNext || loading}
          >
            Selanjutnya
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {data.length === 0 && !loading && (
        <div className="no-data">
          <p>Tidak ada data sensor yang tersedia</p>
        </div>
      )}
    </div>
  )
}

export default DataTable