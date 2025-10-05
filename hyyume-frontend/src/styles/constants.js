export const SENSOR_RANGES = {
  suhu: { min: 22, max: 25, unit: '°C', optimal: [22, 25] },
  ph: { min: 5.5, max: 6.5, unit: '', optimal: [5.5, 6.5] },
  tds: { min: 560, max: 840, unit: 'ppm', optimal: [560, 840] },
  kelembaban: { min: 40, max: 80, unit: '%', optimal: [40, 80] }
}

export const STATUS_TYPES = {
  OPTIMAL: 'optimal',
  WARNING: 'warning',
  DANGER: 'danger',
  UNKNOWN: 'unknown'
}

export const STATUS_CONFIG = {
  [STATUS_TYPES.OPTIMAL]: {
    label: 'Optimal',
    color: '#10b981',
    bgColor: '#d1fae5',
    textColor: '#065f46'
  },
  [STATUS_TYPES.WARNING]: {
    label: 'Perhatian',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    textColor: '#92400e'
  },
  [STATUS_TYPES.DANGER]: {
    label: 'Kritis',
    color: '#ef4444',
    bgColor: '#fee2e2',
    textColor: '#991b1b'
  },
  [STATUS_TYPES.UNKNOWN]: {
    label: 'Tidak Diketahui',
    color: '#6b7280',
    bgColor: '#f3f4f6',
    textColor: '#374151'
  }
}