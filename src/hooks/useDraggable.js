// src/hooks/useDraggable.js
import { useRef, useCallback } from 'react'

/**
 * Returns a ref to attach to a drag handle element and a handler
 * to call onMouseDown / onTouchStart on that handle.
 *
 * Usage:
 *   const { handleDragStart } = useDraggable({ x, y, onMove, onFocus })
 *   <div onMouseDown={handleDragStart} onTouchStart={handleDragStart}>
 */
export function useDraggable({ x, y, onMove, onFocus }) {
  const dragging = useRef(false)
  const origin   = useRef({ mx: 0, my: 0, wx: 0, wy: 0 })

  const move = useCallback((clientX, clientY) => {
    if (!dragging.current) return
    const dx = clientX - origin.current.mx
    const dy = clientY - origin.current.my
    const nx = Math.max(0, Math.min(origin.current.wx + dx, window.innerWidth  - 80))
    const ny = Math.max(0, Math.min(origin.current.wy + dy, window.innerHeight - 50 - 30))
    onMove(nx, ny)
  }, [onMove])

  const stop = useCallback(() => { dragging.current = false }, [])

  const handleDragStart = useCallback((e) => {
    // Don't drag when clicking window control buttons
    if (e.target.closest('.win-controls')) return
    onFocus?.()
    dragging.current = true
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    origin.current = { mx: clientX, my: clientY, wx: x, wy: y }

    const onMouseMove = (ev) => move(ev.clientX, ev.clientY)
    const onTouchMove = (ev) => move(ev.touches[0].clientX, ev.touches[0].clientY)
    const onEnd       = () => {
      stop()
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup',   onEnd)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend',  onEnd)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup',   onEnd)
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend',  onEnd)
  }, [x, y, move, stop, onFocus])

  return { handleDragStart }
}
