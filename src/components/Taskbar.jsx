// src/components/Taskbar.jsx
import { useState, useEffect } from 'react'
import { TASKBAR_APPS } from '../data'

export default function Taskbar({ wins, onTaskbarClick }) {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true }))
      setDate(now.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }))
    }
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="taskbar">
      <div className="tb-logo">⚡ ValOS</div>
      <div className="tb-divider" />

      {/* App buttons */}
      <div style={{ display: 'flex', gap: 4, flex: 1, overflow: 'hidden' }}>
        {TASKBAR_APPS.map(app => {
          const win = wins[app.id] || {}
          const isOpen      = win.open && !win.minimized
          const isMinimized = win.open && win.minimized
          return (
            <div
              key={app.id}
              className={`tb-app ${isOpen ? 'open' : ''} ${isMinimized ? 'minimized' : ''}`}
              onClick={() => onTaskbarClick(app.id)}
            >
              <span className="tb-app-ico">{app.icon}</span>
              <span className="tb-app-name">{app.name}</span>
              {(isOpen || isMinimized) && <div className="tb-app-dot" />}
            </div>
          )
        })}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div className="tb-status">
          <div className="tb-status-dot" />
          Available
        </div>
        <div className="tb-divider" />
        <div style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'right', lineHeight: 1.4, letterSpacing: '0.05em' }}>
          <div>{time}</div>
          <div style={{ fontSize: 9 }}>{date}</div>
        </div>
      </div>
    </div>
  )
}
