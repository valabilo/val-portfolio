// src/components/windows/ExperienceContent.jsx
import { useState } from "react";

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
      <div className="jira-toolbar">
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
        <span className="badge cyan">EPIC: QA CAREER</span>
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
      <div className="jira-board-body">
        {items.map((exp) => {
          const isOpen = expandedKey === exp.key;
          return (
            <div
              key={exp.key}
              className={`jira-issue${isOpen ? " expanded" : ""}`}
              onClick={() => toggle(exp.key)}>
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span className="issue-key">{exp.key}</span>
                <div style={{ flex: 1 }}>
                  <div className="issue-title">{exp.title}</div>
                  <div className="issue-sub">{exp.sub}</div>
                  <div className="issue-meta">
                    <span className={`issue-status ${exp.status}`}>
                      {exp.status === "progress" ? "IN PROGRESS" : "DONE"}
                    </span>
                    <span className="issue-type">{exp.type}</span>
                    <span className="issue-date">{exp.date}</span>
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className="issue-expanded">
                  {exp.bullets.map((b, i) => (
                    <div key={i} className="issue-bullet">
                      <span className="issue-bullet-icon">▸</span>
                      <span className="issue-bullet-text">{b}</span>
                    </div>
                  ))}
                  <div className="issue-tags">
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
