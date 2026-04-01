// src/components/Taskbar.jsx
import { useState, useEffect } from "react";
import { TASKBAR_APPS } from "../data";
import { useTheme } from "../context/ThemeContext";

export default function Taskbar({ wins, onTaskbarClick }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-PH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
      setDate(
        now.toLocaleDateString("en-PH", {
          month: "short",
          day: "numeric",
        }),
      );
    };
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="taskbar">
      <div className="tb-logo">⚡ ValOS</div>
      <div className="tb-divider" />

      {/* App buttons */}
      <div className="tb-apps">
        {TASKBAR_APPS.map((app) => {
          const win = wins[app.id] ?? {};
          const isOpen = win.open && !win.minimized;
          const isMinimized = win.open && win.minimized;

          return (
            <div
              key={app.id}
              className={`tb-app${isOpen ? " open" : ""}${isMinimized ? " minimized" : ""}`}
              onClick={() => onTaskbarClick(app.id)}
              title={app.name}>
              <span className="tb-app-ico">{app.icon}</span>
              <span className="tb-app-name">{app.name}</span>
              {(isOpen || isMinimized) && <div className="tb-app-dot" />}
            </div>
          );
        })}
      </div>

      {/* Right side */}
      <div className="tb-right">
        {/* Theme toggle */}
        <button
          className="tb-theme-btn"
          onClick={toggle}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label="Toggle theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <div className="tb-divider" />

        <div className="tb-status">
          <div className="tb-status-dot" />
          Available
        </div>

        <div className="tb-divider" />

        <div className="tb-clock">
          <div className="tb-clock-time">{time}</div>
          <div className="tb-clock-date">{date}</div>
        </div>
      </div>
    </div>
  );
}
