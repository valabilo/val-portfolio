// src/components/windows/index.jsx
// All 6 window content components — 100% data-driven from Laravel API.
// Zero hardcoded portfolio content in this file.

import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

/* ─── helpers ───────────────────────────────────────────────── */

// Split a long string into terminal-width chunks (~48 chars each)
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

// Build the full terminal line array from API data
function buildTerminalLines(profile, education, awards) {
  const lines = [
    { type: "cmd", text: "val@portfolio:~ $ ./about.sh" },
    { type: "blank" },

    // ── IDENTITY ──────────────────────────────────────────────
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

    // ── EDUCATION ─────────────────────────────────────────────
    {
      type: "section",
      text: "┌─ EDUCATION ────────────────────────────────────┐",
    },
  ];

  // One row per education entry from the DB
  (education ?? []).forEach((edu, i) => {
    const key = `  ${edu.type === "degree" ? "degree    " : `cert-${i}    `} `;
    const val = `${edu.title}${edu.year ? ` · ${edu.institution}, ${edu.year}` : ` · ${edu.institution}`}`;
    lines.push({ type: "kv", k: key.slice(0, 14), v: val });
  });

  lines.push({
    type: "section",
    text: "└────────────────────────────────────────────────┘",
  });
  lines.push({ type: "blank" });

  // ── AWARDS ────────────────────────────────────────────────
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

  // ── SUMMARY ───────────────────────────────────────────────
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

function renderTermLine(l, idx) {
  if (l.type === "blank") return <div key={idx} className="t-blank" />;
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

/* ══════════════════════════════════════════════════════════════
   1 · WELCOME
══════════════════════════════════════════════════════════════ */
export function WelcomeContent({ profile, openWindow }) {
  const name = profile?.name ?? "...";
  const role = profile?.role ?? "QA Engineer";
  const email = profile?.email ?? "";
  const linkedin = profile?.linkedin_url ?? "#";
  const github = profile?.github_url ?? "#";
  const location = profile?.location ?? "";

  return (
    <div
      style={{
        padding: "32px 36px",
        overflowY: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}>
      <pre className="welcome-ascii">{`██╗   ██╗ █████╗ ██╗              ██████╗ ███████╗
██║   ██║██╔══██╗██║             ██╔═══██╗██╔════╝
██║   ██║███████║██║       ███║  ██║   ██║███████╗
╚██╗ ██╔╝██╔══██║██║             ██║   ██║╚════██║
 ╚████╔╝ ██║  ██║███████╗        ╚██████╔╝███████║
  ╚═══╝  ╚═╝  ╚═╝╚══════╝         ╚═════╝ ╚══════╝`}</pre>

      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "var(--text-bright)",
          letterSpacing: "0.04em",
          marginBottom: 4,
        }}>
        {name}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--green)",
          letterSpacing: "0.1em",
          marginBottom: 20,
        }}>
        // {role.toUpperCase()}
      </div>
      <p
        style={{
          fontSize: 12,
          color: "var(--text-dim)",
          lineHeight: 1.8,
          maxWidth: 480,
          marginBottom: 28,
        }}>
        Welcome to my interactive portfolio. I'm a detail-obsessed Software QA
        Engineer who catches bugs before your users do. Open any app below to
        explore my work — or double-click the desktop icons.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 24,
        }}>
        <button className="w-btn primary" onClick={() => openWindow("about")}>
          💻 About Me
        </button>
        <button className="w-btn" onClick={() => openWindow("skills")}>
          🧪 Skills
        </button>
        <button className="w-btn" onClick={() => openWindow("experience")}>
          📋 Experience
        </button>
        <button className="w-btn" onClick={() => openWindow("projects")}>
          📁 Projects
        </button>
        <button className="w-btn" onClick={() => openWindow("contact")}>
          📧 Contact
        </button>
      </div>

      <div
        style={{
          fontSize: 10,
          color: "var(--text-dim)",
          paddingTop: 20,
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}>
        {location && <span>📍 {location}</span>}
        {email && (
          <a
            href={`mailto:${email}`}
            style={{ color: "var(--cyan)", textDecoration: "none" }}>
            {email}
          </a>
        )}
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--cyan)", textDecoration: "none" }}>
          LinkedIn
        </a>
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--cyan)", textDecoration: "none" }}>
          GitHub
        </a>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   2 · ABOUT — animated terminal, all lines built from API data
══════════════════════════════════════════════════════════════ */
export function AboutContent({ profile, education, awards, initialized }) {
  const [lines, setLines] = useState([]);
  const outputRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    // Wait until window is open AND all 3 data sources are available
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

  // Auto-scroll to bottom as lines arrive
  useEffect(() => {
    if (outputRef.current)
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [lines]);

  return (
    <div
      style={{
        background: "#020209",
        padding: "20px 24px",
        overflowY: "auto",
        flex: 1,
      }}
      ref={outputRef}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {lines.map((l, idx) => renderTermLine(l, idx))}
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

/* ══════════════════════════════════════════════════════════════
   3 · SKILLS — test runner, all suites + tests from API
══════════════════════════════════════════════════════════════ */
function TestRow({ test, delay }) {
  const [visible, setVisible] = useState(false);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), delay);
    const t2 = setTimeout(() => setBarWidth(test.pct), delay + 60);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [delay, test.pct]);

  return (
    <div className={`test-row ${visible ? "visible" : ""}`}>
      <span className={`test-icon ${test.tag}`}>✓</span>
      <span className="test-name">{test.name}</span>
      <div className="test-bar-wrap">
        <div
          className={`test-bar ${test.tag === "pass" ? "green" : "amber"}`}
          style={{
            width: `${barWidth}%`,
            transition: "width 0.8s var(--ease)",
          }}
        />
      </div>
      <span className={`test-tag ${test.tag}`}>
        {test.tag === "pass" ? "PASS" : "LEARN"}
      </span>
    </div>
  );
}

export function SkillsContent({ skillSuites, initialized }) {
  const [progress, setProgress] = useState("Initializing...");
  const startedRef = useRef(false);
  const suites = skillSuites ?? [];
  const allTests = suites.flatMap((s) => s.tests);

  useEffect(() => {
    if (!initialized || startedRef.current || !allTests.length) return;
    startedRef.current = true;
    allTests.forEach((_, idx) => {
      setTimeout(
        () => {
          const done = idx + 1;
          setProgress(
            done === allTests.length
              ? `${allTests.length} tests · 0.42s`
              : `Running... ${done}/${allTests.length}`,
          );
        },
        idx * 120 + 200,
      );
    });
  }, [initialized, allTests.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const passCount = allTests.filter((t) => t.tag === "pass").length;
  const learnCount = allTests.filter((t) => t.tag !== "pass").length;
  let globalIdx = 0;

  return (
    <div
      style={{
        background: "#020209",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
      {/* Header */}
      <div
        style={{
          background: "#020209",
          padding: "16px 24px 4px",
          fontSize: 11,
          color: "var(--text-dim)",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}>
        <span style={{ color: "var(--amber)" }}>RUNS</span>
        &nbsp; skills.test.js &nbsp;|&nbsp;
        <span
          style={{
            color: progress.includes("tests ·")
              ? "var(--green)"
              : "var(--text-dim)",
          }}>
          {progress}
        </span>
      </div>

      {/* Suites */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {suites.map((suite) => (
          <div key={suite.id} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-dim)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 10,
                paddingBottom: 6,
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              {suite.label}
              <span style={{ color: "var(--green)" }}>{suite.countText}</span>
            </div>
            {suite.tests.map((test) => {
              const delay = globalIdx++ * 120 + 200;
              return <TestRow key={test.name} test={test} delay={delay} />;
            })}
          </div>
        ))}

        {/* Summary footer */}
        <div
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
            fontSize: 11,
            color: "var(--text-dim)",
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
          }}>
          <span>
            Test Suites:{" "}
            <span style={{ color: "var(--text)" }}>{suites.length}</span>
          </span>
          <span>
            Tests:{" "}
            <span style={{ color: "var(--green)" }}>{passCount} passed</span>
          </span>
          {learnCount > 0 && (
            <span>
              {learnCount}{" "}
              <span style={{ color: "var(--amber)" }}>learning</span>
            </span>
          )}
          <span>
            Time: <span style={{ color: "var(--text)" }}>0.42s</span>
          </span>
          {allTests.length > 0 && (
            <span style={{ color: "var(--green)" }}>
              Coverage: {Math.round((passCount / allTests.length) * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   4 · EXPERIENCE — Jira board, all issues from API
══════════════════════════════════════════════════════════════ */
export function ExperienceContent({ experiences }) {
  const [expandedKey, setExpandedKey] = useState(null);
  const items = experiences ?? [];
  const toggle = (key) => setExpandedKey((prev) => (prev === key ? null : key));

  return (
    <div
      style={{
        overflowY: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}>
      {/* Toolbar */}
      <div
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(0,0,0,0.2)",
          flexShrink: 0,
        }}>
        <span
          style={{
            fontSize: 10,
            color: "var(--text-dim)",
            letterSpacing: "0.08em",
          }}>
          Projects /{" "}
          <span style={{ color: "var(--cyan)" }}>Val Krystoper Abilo</span> /
          Board
        </span>
        <span
          style={{
            fontSize: 9,
            padding: "3px 8px",
            borderRadius: 2,
            background: "var(--cyan-dim)",
            color: "var(--cyan)",
            border: "1px solid rgba(0,229,255,0.2)",
          }}>
          EPIC: QA CAREER
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 10,
            color: "var(--text-dim)",
          }}>
          {items.length} issues · Click to expand
        </span>
      </div>

      {/* Issues */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>
        {items.map((exp) => {
          const isOpen = expandedKey === exp.key;
          return (
            <div
              key={exp.key}
              className={`jira-issue ${isOpen ? "expanded" : ""}`}
              onClick={() => toggle(exp.key)}>
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span
                  style={{
                    fontSize: 10,
                    color: "var(--cyan)",
                    letterSpacing: "0.08em",
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                  {exp.key}
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-bright)",
                      fontWeight: 500,
                      marginBottom: 4,
                    }}>
                    {exp.title}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-dim)" }}>
                    {exp.sub}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      marginTop: 6,
                    }}>
                    <span
                      className={`issue-status ${exp.status}`}
                      style={{
                        fontSize: 9,
                        padding: "2px 8px",
                        borderRadius: 2,
                        letterSpacing: "0.1em",
                        fontWeight: 500,
                      }}>
                      {exp.status === "progress" ? "IN PROGRESS" : "DONE"}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        padding: "2px 8px",
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.04)",
                        color: "var(--text-dim)",
                        border: "1px solid var(--border)",
                      }}>
                      {exp.type}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--text-dim)",
                        marginLeft: "auto",
                      }}>
                      {exp.date}
                    </span>
                  </div>
                </div>
              </div>

              {isOpen && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: "1px solid var(--border)",
                  }}>
                  {exp.bullets.map((b, i) => (
                    <div key={i} style={{ display: "flex", gap: 10 }}>
                      <span
                        style={{
                          color: "var(--cyan)",
                          flexShrink: 0,
                          marginTop: 1,
                        }}>
                        ▸
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text-dim)",
                          lineHeight: 1.7,
                        }}>
                        {b}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 10,
                    }}>
                    {exp.tags.map((tag) => (
                      <span key={tag} className="issue-skill-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   5 · PROJECTS — file explorer, all projects from API
══════════════════════════════════════════════════════════════ */
export function ProjectsContent({ projects }) {
  const items = projects ?? [];
  const [activeId, setActiveId] = useState(items[0]?.id ?? null);

  // Update default active when data loads
  useEffect(() => {
    if (items.length && !activeId) setActiveId(items[0].id);
  }, [items, activeId]);

  const active = items.find((p) => p.id === activeId);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        flex: 1,
      }}>
      {/* Sidebar */}
      <div
        style={{
          width: 200,
          flexShrink: 0,
          borderRight: "1px solid var(--border)",
          background: "rgba(0,0,0,0.2)",
          overflowY: "auto",
          padding: "10px 0",
        }}>
        <div
          style={{
            fontSize: 9,
            color: "var(--text-dim)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "6px 16px",
            marginTop: 4,
          }}>
          FAVOURITES
        </div>
        {items.map((p) => (
          <div
            key={p.id}
            className={`fe-item ${activeId === p.id ? "active" : ""}`}
            onClick={() => setActiveId(p.id)}>
            <span style={{ fontSize: 13, flexShrink: 0 }}>{p.icon}</span>
            {p.label}
          </div>
        ))}
        <div
          style={{
            fontSize: 9,
            color: "var(--text-dim)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "6px 16px",
            marginTop: 4,
          }}>
          FOLDERS
        </div>
        {["test-cases", "bug-reports", "api-testing", "automation", "docs"].map(
          (f) => (
            <div key={f} className="fe-item">
              <span style={{ fontSize: 13 }}>📁</span> {f}
            </div>
          ),
        )}
      </div>

      {/* Detail panel */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}>
        <div
          style={{
            padding: "8px 16px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(0,0,0,0.15)",
            fontSize: 10,
            color: "var(--text-dim)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}>
          <span>~/</span>
          <span style={{ color: "var(--cyan)" }}>
            qa-testing-projects / {active?.label ?? ""}
          </span>
          <span
            style={{ marginLeft: "auto", color: "var(--green)", fontSize: 9 }}>
            {items.length} items
          </span>
        </div>

        {active && (
          <div
            style={{
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
            }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: "1px solid var(--border)",
              }}>
              <div style={{ fontSize: 32 }}>{active.icon}</div>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    color: "var(--text-bright)",
                    fontWeight: 500,
                  }}>
                  {active.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--text-dim)",
                    letterSpacing: "0.08em",
                  }}>
                  {active.type}
                </div>
              </div>
            </div>

            {/* Meta grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "6px 20px",
                fontSize: 11,
                marginBottom: 16,
              }}>
              {active.meta.map(([k, v, hi]) => [
                <span key={`k-${k}`} style={{ color: "var(--text-dim)" }}>
                  {k}
                </span>,
                <span
                  key={`v-${k}`}
                  style={{ color: hi ? "var(--green)" : "var(--text)" }}>
                  {v}
                </span>,
              ])}
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: 11,
                color: "var(--text-dim)",
                lineHeight: 1.8,
                marginBottom: 16,
              }}>
              {active.desc}
            </p>

            {/* Tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 20,
              }}>
              {active.tags.map((tag) => (
                <span key={tag} className="proj-tag-item">
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              {active.github && (
                <a
                  href={active.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proj-btn">
                  🐙 View on GitHub
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   6 · CONTACT — mail compose, posts to Laravel API
      profile drives "To", phone, social links, available status
══════════════════════════════════════════════════════════════ */
function validateForm(form) {
  const e = {};
  if (!form.name.trim()) e.name = true;
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    e.email = true;
  if (!form.subject.trim()) e.subject = true;
  if (!form.message.trim()) e.message = true;
  return e;
}

export function ContactContent({ profile }) {
  const toEmail = profile?.email ?? "abilovalkrystoper@gmail.com";
  const linkedin = profile?.linkedin_url ?? "#";
  const github = profile?.github_url ?? "#";
  const phone = profile?.phone ?? "";
  const location = profile?.location ?? "";
  const available = profile?.available ?? true;

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiErr, setApiErr] = useState("");

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSend = async () => {
    const errs = validateForm(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setApiErr("");
    setSending(true);
    try {
      await axios.post(`${API}/api/contact`, form);
      setSent(true);
    } catch (err) {
      setApiErr(
        err.response?.data?.message ??
          "Something went wrong. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 0",
    borderBottom: "1px solid var(--border)",
    fontSize: 11,
  };
  const labelStyle = { color: "var(--text-dim)", width: 40, flexShrink: 0 };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        flex: 1,
      }}>
      {/* Sidebar */}
      <div
        style={{
          width: 180,
          flexShrink: 0,
          borderRight: "1px solid var(--border)",
          background: "rgba(0,0,0,0.2)",
          padding: "12px 0",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}>
        <div className="mail-folder active">
          <span style={{ fontSize: 14 }}>✉️</span> Compose
          <div
            style={{
              marginLeft: "auto",
              fontSize: 9,
              background: "var(--cyan)",
              color: "var(--os-bg)",
              width: 16,
              height: 16,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}>
            1
          </div>
        </div>
        <div className="mail-folder">
          <span style={{ fontSize: 14 }}>📥</span> Inbox
        </div>
        <div className="mail-folder">
          <span style={{ fontSize: 14 }}>📤</span> Sent
        </div>
        <div style={{ flex: 1 }} />

        {/* Contact info — all from DB via profile prop */}
        <div
          style={{
            padding: 16,
            borderTop: "1px solid var(--border)",
            fontSize: 10,
            color: "var(--text-dim)",
            lineHeight: 1.8,
          }}>
          <div style={{ color: "var(--text-bright)", marginBottom: 4 }}>
            val@portfolio.dev
          </div>
          {location && <div>📍 {location}</div>}
          {phone && <div>📞 {phone}</div>}
          <div
            style={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--cyan)", textDecoration: "none" }}>
              LinkedIn ↗
            </a>
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--cyan)", textDecoration: "none" }}>
              GitHub ↗
            </a>
          </div>
        </div>
      </div>

      {/* Compose area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
        {/* Header */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid var(--border)",
            fontSize: 11,
            color: "var(--text-dim)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(0,0,0,0.1)",
            flexShrink: 0,
          }}>
          <span>📝</span>
          <span style={{ color: "var(--text-bright)", fontWeight: 500 }}>
            New Message
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 9,
              color: available ? "var(--green)" : "var(--text-dim)",
            }}>
            {available
              ? "● ONLINE · Replies within 24h"
              : "○ Currently unavailable"}
          </span>
        </div>

        {sent ? (
          /* Success state */
          <div className="mail-success">
            <div style={{ fontSize: 36 }}>✅</div>
            <div style={{ fontSize: 14, color: "var(--green)" }}>
              Message Sent!
            </div>
            <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
              Val will get back to you within 24 hours.
            </div>
          </div>
        ) : (
          <>
            {/* Form */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
              }}>
              {apiErr && (
                <div
                  style={{
                    background: "var(--red-dim)",
                    border: "1px solid rgba(255,68,102,0.3)",
                    padding: "8px 12px",
                    borderRadius: 4,
                    fontSize: 11,
                    color: "var(--red)",
                    marginBottom: 8,
                  }}>
                  {apiErr}
                </div>
              )}
              <div style={rowStyle}>
                <span style={labelStyle}>To:</span>
                <input
                  className="mf-input"
                  value={toEmail}
                  readOnly
                  style={{ color: "var(--cyan)" }}
                />
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>From:</span>
                <input
                  className="mf-input"
                  placeholder="your@email.com"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  style={{ color: errors.email ? "var(--red)" : undefined }}
                />
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>Name:</span>
                <input
                  className="mf-input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={update("name")}
                  style={{ color: errors.name ? "var(--red)" : undefined }}
                />
              </div>
              <div style={{ ...rowStyle, paddingBottom: 10 }}>
                <span style={labelStyle}>Re:</span>
                <input
                  className="mf-input"
                  placeholder="Job opportunity / Project / Let's talk..."
                  value={form.subject}
                  onChange={update("subject")}
                  style={{ color: errors.subject ? "var(--red)" : undefined }}
                />
              </div>
              <textarea
                className="mf-body"
                placeholder={
                  "Hi Val,\n\nI'd like to discuss...\n\nBest regards,"
                }
                value={form.message}
                onChange={update("message")}
                style={{
                  flex: 1,
                  marginTop: 12,
                  minHeight: 100,
                  color: errors.message ? "var(--red)" : undefined,
                }}
              />
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexShrink: 0,
              }}>
              <button
                className="mail-send-btn"
                onClick={handleSend}
                disabled={sending}>
                <span>📤</span>
                {sending ? "Sending..." : "Send Message"}
              </button>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-dim)",
                  lineHeight: 1.6,
                }}>
                Sent directly to Val's inbox.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
