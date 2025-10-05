import React from 'react'
import { useWebSocket } from '../hooks/useWebSocket'
import { Wifi, WifiOff } from 'lucide-react'

const ConnectionStatus = () => {
  const { isConnected } = useWebSocket()

  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      {isConnected ? (
        <>
          <Wifi size={16} />
          <span>Terhubung Real-time</span>
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span>Terputus - Mencoba menghubungkan...</span>
        </>
      )}
    </div>
  )
}

export default ConnectionStatus