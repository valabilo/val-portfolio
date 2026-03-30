// src/components/BootScreen.jsx
import { useState, useEffect, useRef } from 'react'
import { BOOT_MESSAGES } from '../data'

export default function BootScreen({ onComplete }) {
  const [lines,    setLines]    = useState([])
  const [barWidth, setBarWidth] = useState(0)
  const [fading,   setFading]   = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    if (doneRef.current) return
    doneRef.current = true

    BOOT_MESSAGES.forEach((msg, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, msg])
        setBarWidth(((i + 1) / BOOT_MESSAGES.length) * 100)
      }, msg.delay)
    })

    // Fade out and signal complete
    const lastDelay = BOOT_MESSAGES[BOOT_MESSAGES.length - 1].delay
    setTimeout(() => setFading(true), lastDelay + 500)
    setTimeout(() => onComplete(),    lastDelay + 1300)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center gap-8 ${fading ? 'boot-fade-out' : ''}`}
    >
      <div className="boot-logo">ValOS</div>
      <div
        className="text-xs letter-spacing-widest"
        style={{ color: 'var(--text-dim)', letterSpacing: '0.2em' }}
      >
        QA Engineering Suite v2.025
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 320, height: 2,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 2, overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${barWidth}%`,
            background: 'linear-gradient(90deg, var(--cyan), var(--green))',
            borderRadius: 2,
            transition: 'width 0.15s linear',
            boxShadow: '0 0 10px var(--cyan)',
          }}
        />
      </div>

      {/* Log lines */}
      <div style={{ height: 140, width: 520, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {lines.map((msg, i) => (
          <div
            key={i}
            className="boot-line"
            style={{ animationDelay: '0s' }}
          >
            <span className={msg.cls}>{msg.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
