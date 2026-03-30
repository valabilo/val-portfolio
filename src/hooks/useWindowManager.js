// src/hooks/useWindowManager.js
import { useState, useCallback, useRef } from 'react'
import { WINDOW_DEFAULTS } from '../data'

const INITIAL_STATE = {}
const WIN_IDS = ['welcome','about','skills','experience','projects','contact']
WIN_IDS.forEach(id => {
  INITIAL_STATE[id] = { open: false, minimized: false, x: null, y: null }
})

export function useWindowManager() {
  const [wins, setWins]     = useState(INITIAL_STATE)
  const [zTop, setZTop]     = useState(100)
  const [zMap, setZMap]     = useState({})    // id → zIndex
  const [activeId, setActiveId] = useState(null)
  const initializedRef      = useRef({})      // track first-open positioning

  // ── Bring a window to the front ──────────────────────────────
  const bringToFront = useCallback((id) => {
    setZTop(prev => {
      const next = prev + 1
      setZMap(m => ({ ...m, [id]: next }))
      return next
    })
    setActiveId(id)
  }, [])

  // ── Open a window ─────────────────────────────────────────────
  const openWindow = useCallback((id) => {
    setWins(prev => ({ ...prev, [id]: { ...prev[id], open: true, minimized: false } }))
    bringToFront(id)

    // Set default position on first open
    if (!initializedRef.current[id]) {
      initializedRef.current[id] = true
      const def = WINDOW_DEFAULTS[id]
      if (def) {
        const centerX = typeof window !== 'undefined'
          ? Math.max(20, (window.innerWidth  - def.width)  / 2)
          : 200
        const centerY = typeof window !== 'undefined'
          ? Math.max(20, (window.innerHeight - 50 - (def.height === 'auto' ? 420 : def.height)) / 2)
          : 100
        const x = def.x !== null ? def.x : centerX
        const y = def.y !== null ? def.y : centerY
        setWins(prev => ({ ...prev, [id]: { ...prev[id], x, y } }))
      }
    }
  }, [bringToFront])

  // ── Close a window ────────────────────────────────────────────
  const closeWindow = useCallback((id) => {
    setWins(prev => ({ ...prev, [id]: { ...prev[id], open: false, minimized: false } }))
    setActiveId(a => a === id ? null : a)
  }, [])

  // ── Minimize a window ─────────────────────────────────────────
  const minimizeWindow = useCallback((id) => {
    setWins(prev => ({ ...prev, [id]: { ...prev[id], minimized: true } }))
    setActiveId(a => a === id ? null : a)
  }, [])

  // ── Taskbar click ─────────────────────────────────────────────
  const taskbarClick = useCallback((id) => {
    const win = wins[id]
    if (!win.open || win.minimized) {
      openWindow(id)
    } else {
      minimizeWindow(id)
    }
  }, [wins, openWindow, minimizeWindow])

  // ── Update position (from drag) ───────────────────────────────
  const setPosition = useCallback((id, x, y) => {
    setWins(prev => ({ ...prev, [id]: { ...prev[id], x, y } }))
  }, [])

  return {
    wins,
    zMap,
    activeId,
    openWindow,
    closeWindow,
    minimizeWindow,
    taskbarClick,
    bringToFront,
    setPosition,
  }
}
