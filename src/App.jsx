// src/App.jsx
import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import MobileFallback from "./components/MobileFallback";
import { usePortfolioData } from "./hooks/usePortfolioData";

function AppContent() {
  const [booted, setBooted] = useState(false);
  const { data } = usePortfolioData();

  return (
    <>
      <div
        className="desktop-container"
        style={{ width: "100%", height: "100%" }}>
        {!booted && <BootScreen onComplete={() => setBooted(true)} />}
        {booted && <Desktop data={data} />}
      </div>

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
