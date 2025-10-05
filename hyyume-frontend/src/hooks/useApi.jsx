import React, { createContext, useContext, useState, useCallback } from 'react'
import { api } from '../services/api'

const ApiContext = createContext()

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within ApiProvider')
  }
  return context
}

export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getAllData = useCallback(async (page = 1, limit = 50) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/data?page=${page}&limit=${limit}`)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getLatestData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/data/latest')
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch latest data')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/data/stats')
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stats')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getDataById = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/data/${id}`)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const value = {
    loading,
    error,
    getAllData,
    getLatestData,
    getStats,
    getDataById,
    clearError: () => setError(null)
  }

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  )
}