// src/components/windows/AboutContent.jsx
import { useState, useEffect, useRef } from "react";

/* ── Helpers ─────────────────────────────────────────────────── */
function chunkText(text, width = 48) {
  if (!text) return [];
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    if ((line + word).length > width) {
      lines.push(line.trim());
      line = "";
    }
    line += word + " ";
  });
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function buildTerminalLines(profile, education, awards) {
  const lines = [
    { type: "cmd", text: "val@portfolio:~ $ ./about.sh" },
    { type: "blank" },
    {
      type: "section",
      text: "┌─ IDENTITY ─────────────────────────────────────┐",
    },
    { type: "kv", k: "  name       ", v: profile?.name ?? "" },
    { type: "kv", k: "  role       ", v: profile?.role ?? "" },
    { type: "kv", k: "  location   ", v: profile?.location ?? "" },
    { type: "kv", k: "  email      ", v: profile?.email ?? "" },
    { type: "kv", k: "  phone      ", v: profile?.phone ?? "" },
    { type: "kv", k: "  linkedin   ", v: profile?.linkedin_url ?? "" },
    { type: "kv", k: "  github     ", v: profile?.github_url ?? "" },
    {
      type: "section",
      text: "└────────────────────────────────────────────────┘",
    },
    { type: "blank" },

    {
      type: "section",
      text: "┌─ EDUCATION ────────────────────────────────────┐",
    },
  ];

  (education ?? []).forEach((edu, i) => {
    const key = `  ${edu.type === "degree" ? "degree    " : `cert-${i}    `} `;
    const val = `${edu.title}${
      edu.year ? ` · ${edu.institution}, ${edu.year}` : ` · ${edu.institution}`
    }`;
    lines.push({ type: "kv", k: key.slice(0, 14), v: val });
  });

  lines.push({
    type: "section",
    text: "└────────────────────────────────────────────────┘",
  });
  lines.push({ type: "blank" });

  lines.push({
    type: "section",
    text: "┌─ AWARDS ───────────────────────────────────────┐",
  });
  (awards ?? []).forEach((award) => {
    lines.push({ type: "kv", k: "  🏆 award   ", v: award.title });
  });
  lines.push({
    type: "section",
    text: "└────────────────────────────────────────────────┘",
  });
  lines.push({ type: "blank" });

  lines.push({
    type: "section",
    text: "┌─ SUMMARY ──────────────────────────────────────┐",
  });
  chunkText(profile?.bio ?? "", 48).forEach((chunk) => {
    lines.push({ type: "text", text: `  ${chunk}` });
  });
  lines.push({
    type: "section",
    text: "└────────────────────────────────────────────────┘",
  });
  lines.push({ type: "blank" });
  lines.push({
    type: "muted",
    text: "// exit code 0 — all data loaded from database",
  });

  return lines;
}

function TermLine({ l, idx }) {
  if (l.type === "blank") return <span key={idx} className="t-blank" />;

  if (l.type === "cmd")
    return (
      <div key={idx} className="t-line">
        <span className="t-prompt">val@portfolio</span>
        <span style={{ color: "var(--text-dim)" }}>:~ $ </span>
        <span className="t-cmd">{l.text.split("$ ")[1]}</span>
      </div>
    );

  if (l.type === "section")
    return (
      <div key={idx} className="t-line">
        <span className="t-section">{l.text}</span>
      </div>
    );

  if (l.type === "kv")
    return (
      <div key={idx} className="t-line">
        <span className="t-key">{l.k}</span>
        <span className="t-val">{l.v}</span>
      </div>
    );

  if (l.type === "text")
    return (
      <div key={idx} className="t-line">
        <span className="t-val">{l.text}</span>
      </div>
    );

  if (l.type === "muted")
    return (
      <div key={idx} className="t-line">
        <span className="t-muted">{l.text}</span>
      </div>
    );

  return null;
}

/* ── Component ───────────────────────────────────────────────── */
export function AboutContent({ profile, education, awards, initialized }) {
  const [lines, setLines] = useState([]);
  const outputRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!initialized || startedRef.current) return;
    if (!profile || !education || !awards) return;
    startedRef.current = true;

    const terminalLines = buildTerminalLines(profile, education, awards);
    let i = 0;

    function addLine() {
      if (i >= terminalLines.length) return;
      const l = terminalLines[i++];
      setLines((prev) => [...prev, l]);
      setTimeout(addLine, l.type === "blank" ? 80 : 40);
    }

    setTimeout(addLine, 200);
  }, [initialized, profile, education, awards]);

  useEffect(() => {
    if (outputRef.current)
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [lines]);

  return (
    <div className="terminal" ref={outputRef}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {lines.map((l, idx) => (
          <TermLine key={idx} l={l} idx={idx} />
        ))}
      </div>
      <div style={{ paddingTop: 4 }}>
        <span className="t-prompt">val@portfolio</span>
        <span style={{ color: "var(--text-dim)" }}>:</span>
        <span style={{ color: "var(--cyan)" }}>~</span>
        <span style={{ color: "var(--text-dim)" }}> $ </span>
        <span className="t-cursor" />
      </div>
    </div>
  );
}
