import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const WebSocketContext = createContext()

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider')
  }
  return context
}

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [sensorData, setSensorData] = useState(null)
  const [dataHistory, setDataHistory] = useState([])

  useEffect(() => {
    const newSocket = io({
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server')
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
      setIsConnected(false)
    })

    newSocket.on('sensor_data', (data) => {
      console.log('Received sensor data:', data)
      setSensorData(data)
      setDataHistory(prev => {
        const newHistory = [data, ...prev.slice(0, 49)] // Keep last 50 records
        return newHistory
      })
    })

    newSocket.on('connected', (data) => {
      console.log('WebSocket connection established:', data)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const requestLatestData = () => {
    if (socket && isConnected) {
      socket.emit('request_latest_data')
    }
  }

  const value = {
    socket,
    isConnected,
    sensorData,
    dataHistory,
    requestLatestData
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}