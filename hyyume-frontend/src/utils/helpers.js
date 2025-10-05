import { SENSOR_RANGES, STATUS_TYPES, STATUS_CONFIG } from '../styles/constants'

export const getSensorStatus = (type, value) => {
  if (value === null || value === undefined) {
    return STATUS_TYPES.UNKNOWN
  }

  const range = SENSOR_RANGES[type]
  if (!range) return STATUS_TYPES.UNKNOWN

  const [min, max] = range.optimal

  if (value >= min && value <= max) {
    return STATUS_TYPES.OPTIMAL
  } else if (value < min * 0.8 || value > max * 1.2) {
    return STATUS_TYPES.DANGER
  } else {
    return STATUS_TYPES.WARNING
  }
}

export const getOverallStatus = (data) => {
  if (!data) return STATUS_TYPES.UNKNOWN

  const statuses = [
    getSensorStatus('suhu', data.suhu),
    getSensorStatus('ph', data.ph),
    getSensorStatus('tds', data.tds)
  ]

  if (data.kelembaban !== null && data.kelembaban !== undefined) {
    statuses.push(getSensorStatus('kelembaban', data.kelembaban))
  }

  if (statuses.includes(STATUS_TYPES.DANGER)) {
    return STATUS_TYPES.DANGER
  } else if (statuses.includes(STATUS_TYPES.WARNING)) {
    return STATUS_TYPES.WARNING
  } else if (statuses.every(status => status === STATUS_TYPES.OPTIMAL)) {
    return STATUS_TYPES.OPTIMAL
  } else {
    return STATUS_TYPES.UNKNOWN
  }
}

export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export const formatValue = (value, type) => {
  if (value === null || value === undefined) return '--'
  
  const range = SENSOR_RANGES[type]
  const unit = range ? range.unit : ''
  
  return `${value}${unit}`
}

export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG[STATUS_TYPES.UNKNOWN]
}