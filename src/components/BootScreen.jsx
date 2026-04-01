// src/components/BootScreen.jsx
import { useState, useEffect, useRef } from "react";
import { BOOT_MESSAGES } from "../data";

export default function BootScreen({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [barWidth, setBarWidth] = useState(0);
  const [fading, setFading] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    BOOT_MESSAGES.forEach((msg, i) => {
      setTimeout(() => {
        setLines((prev) => [...prev, msg]);
        setBarWidth(((i + 1) / BOOT_MESSAGES.length) * 100);
      }, msg.delay);
    });

    const lastDelay = BOOT_MESSAGES[BOOT_MESSAGES.length - 1].delay;
    setTimeout(() => setFading(true), lastDelay + 500);
    setTimeout(() => onComplete(), lastDelay + 1300);
  }, [onComplete]);

  return (
    <div className={`boot-screen${fading ? " boot-fade-out" : ""}`}>
      <div className="boot-logo">ValOS</div>
      <div className="boot-sub">QA Engineering Suite v2.025</div>

      {/* Progress bar */}
      <div className="boot-bar-track">
        <div className="boot-bar-fill" style={{ width: `${barWidth}%` }} />
      </div>

      {/* Log lines */}
      <div className="boot-log">
        {lines.map((msg, i) => (
          <div key={i} className="boot-line" style={{ animationDelay: "0s" }}>
            <span className={msg.cls}>{msg.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
