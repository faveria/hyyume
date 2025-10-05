import React from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import ConnectionStatus from './components/ConnectionStatus'
import { WebSocketProvider } from './hooks/useWebSocket'
import { ApiProvider } from './hooks/useApi'

function App() {
  return (
    <WebSocketProvider>
      <ApiProvider>
        <div className="app">
          <Header />
          <ConnectionStatus />
          <main className="main-content">
            <Dashboard />
          </main>
        </div>
      </ApiProvider>
    </WebSocketProvider>
  )
}

export default App