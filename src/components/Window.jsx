// src/components/Window.jsx
import { useDraggable } from "../hooks/useDraggable";

export default function Window({
  id,
  title,
  icon,
  width,
  height,
  x,
  y,
  isActive,
  isOpen,
  isMinimized,
  zIndex,
  onClose,
  onMinimize,
  onFocus,
  onMove,
  children,
  bodyStyle = {},
}) {
  const { handleDragStart } = useDraggable({
    x: x ?? 0,
    y: y ?? 0,
    onMove,
    onFocus,
  });

  if (!isOpen || isMinimized) return null;

  return (
    <div
      className={`os-window${isActive ? " active-win" : ""}`}
      style={{
        width,
        height: height === "auto" ? "auto" : height,
        left: x ?? 0,
        top: y ?? 0,
        zIndex,
      }}
      onMouseDown={onFocus}>
      {/* Title bar */}
      <div
        className="win-titlebar"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}>
        <div className="win-controls">
          <button
            className="win-btn close"
            onClick={() => onClose(id)}
            aria-label="Close"
          />
          <button
            className="win-btn minimize"
            onClick={() => onMinimize(id)}
            aria-label="Minimize"
          />
          <button className="win-btn maximize" aria-label="Maximize" />
        </div>
        <div className="win-title-center">
          <span className="win-ico">{icon}</span>
          {title}
        </div>
      </div>

      {/* Body */}
      <div className="win-body" style={bodyStyle}>
        {children}
      </div>
    </div>
  );
}
