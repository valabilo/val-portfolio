// src/components/ThemeToggle.jsx
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 4,
        border: "1px solid var(--border)",
        background: "var(--toggle-bg)",
        color: "var(--text-dim)",
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "0.06em",
        cursor: "pointer",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--cyan)";
        e.currentTarget.style.color = "var(--cyan)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--text-dim)";
      }}>
      <span style={{ fontSize: 12 }}>{isDark ? "☀️" : "🌙"}</span>
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
