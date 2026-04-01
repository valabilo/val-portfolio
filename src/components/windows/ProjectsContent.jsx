// src/components/windows/ProjectsContent.jsx
import { useState, useEffect } from "react";

const FOLDER_ITEMS = [
  "test-cases",
  "bug-reports",
  "api-testing",
  "automation",
  "docs",
];

export function ProjectsContent({ projects }) {
  const items = projects ?? [];
  const [activeId, setActiveId] = useState(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length && !activeId) setActiveId(items[0].id);
  }, [items, activeId]);

  const active = items.find((p) => p.id === activeId);

  return (
    <div className="file-explorer">
      {/* Sidebar */}
      <div className="fe-sidebar">
        <div className="fe-section-label">FAVOURITES</div>
        {items.map((p) => (
          <div
            key={p.id}
            className={`fe-item${activeId === p.id ? " active" : ""}`}
            onClick={() => setActiveId(p.id)}>
            <span className="fe-item-icon">{p.icon}</span>
            {p.label}
          </div>
        ))}

        <div className="fe-section-label">FOLDERS</div>
        {FOLDER_ITEMS.map((f) => (
          <div key={f} className="fe-item">
            <span className="fe-item-icon">📁</span>
            {f}
          </div>
        ))}
      </div>

      {/* Detail */}
      <div className="fe-detail">
        <div className="fe-path-bar">
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
          <div className="fe-detail-body">
            {/* Header */}
            <div className="proj-header">
              <div className="proj-icon">{active.icon}</div>
              <div>
                <div className="proj-name">{active.name}</div>
                <div className="proj-type">{active.type}</div>
              </div>
            </div>

            {/* Meta grid */}
            <div className="proj-meta">
              {active.meta.map(([k, v, hi]) => [
                <span key={`k-${k}`} className="proj-meta-k">
                  {k}
                </span>,
                <span
                  key={`v-${k}`}
                  className={`proj-meta-v${hi ? " pass" : ""}`}>
                  {v}
                </span>,
              ])}
            </div>

            {/* Description */}
            <p className="proj-desc">{active.desc}</p>

            {/* Tags */}
            <div className="proj-tags">
              {active.tags.map((tag) => (
                <span key={tag} className="proj-tag-item">
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="proj-actions">
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
