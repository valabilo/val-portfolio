// src/App.jsx
import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import MobileFallback from "./components/MobileFallback";
import { usePortfolioData } from "./hooks/usePortfolioData";

function AppContent() {
  const [booted, setBooted] = useState(false);
  const { data, loading, error } = usePortfolioData();

  const ready = booted && !loading;

  return (
    <>
      {/* Desktop experience */}
      <div
        className="desktop-container"
        style={{ width: "100%", height: "100%" }}>
        {/* Boot screen */}
        {(!booted || loading) && (
          <BootScreen onComplete={() => setBooted(true)} />
        )}

        {/* API error fallback */}
        {ready && error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              background: "var(--os-bg)",
            }}>
            <div style={{ fontSize: 32 }}>⚠️</div>
            <div
              style={{
                color: "var(--amber)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
              }}>
              API connection failed
            </div>
            <div
              style={{
                color: "var(--text-dim)",
                fontSize: 11,
                textAlign: "center",
              }}>
              Make sure <code>php artisan serve</code> is running and XAMPP is
              on.
            </div>
            <div style={{ color: "var(--text-dim)", fontSize: 10 }}>
              {error}
            </div>
          </div>
        )}

        {/* Main desktop */}
        {ready && !error && data && <Desktop data={data} />}
      </div>

      {/* Mobile fallback */}
      <MobileFallback
        profile={data?.profile}
        experiences={data?.experiences}
        skillSuites={data?.skillSuites}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
