import React from 'react'
import { Sprout, Users } from 'lucide-react'

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Sprout className="logo-icon" />
          <div className="logo-text">
            <h1>HY.YUME Monitor</h1>
            <span>Sistem Monitoring Hidroponik Berbasis IoT</span>
          </div>
        </div>
        
        <div className="team-info">
          <Users size={18} />
          <span>Tim HY.YUME</span>
        </div>
      </div>
    </header>
  )
}

export default Header