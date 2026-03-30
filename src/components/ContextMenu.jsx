// src/components/ContextMenu.jsx
export default function ContextMenu({ x, y, visible, onClose, onOpenAll, openWindow }) {
  if (!visible) return null
  return (
    <div className="ctx-menu" style={{ left: x, top: y }}>
      <div className="ctx-item" onClick={() => { onOpenAll(); onClose(); }}>
        <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>⊞</span> Open All Apps
      </div>
      <div className="ctx-sep" />
      <div className="ctx-item" onClick={() => { openWindow('contact'); onClose(); }}>
        <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>📧</span> Hire Val
      </div>
      <div className="ctx-item" onClick={() => { window.open('https://linkedin.com/in/valkrystoper-abilo-a5b88a236','_blank'); onClose(); }}>
        <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>🔗</span> LinkedIn Profile
      </div>
      <div className="ctx-item" onClick={() => { window.open('https://github.com/YOUR_USERNAME','_blank'); onClose(); }}>
        <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>🐙</span> GitHub Repos
      </div>
      <div className="ctx-sep" />
      <div className="ctx-item" onClick={onClose}>
        <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>✕</span> Close Menu
      </div>
    </div>
  )
}
