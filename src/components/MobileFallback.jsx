// src/components/MobileFallback.jsx
// 100% database-driven — zero hardcoded content.
// Career section mirrors the desktop Jira-board UX with expandable cards.
// Includes light/dark theme toggle via ThemeContext.

import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

/* ══════════════════════════════════════════════════════════════
   SECTION WRAPPER
══════════════════════════════════════════════════════════════ */
function Section({ title, children }) {
  return (
    <div
      style={{
        padding: "24px 20px",
        borderBottom: "1px solid var(--border)",
      }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 9,
          color: "var(--cyan)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontFamily: "var(--font-mono)",
          marginBottom: 14,
          paddingBottom: 10,
          borderBottom: "1px solid var(--border)",
        }}>
        <span
          style={{
            width: 3,
            height: 12,
            background: "var(--cyan)",
            borderRadius: 2,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        {title}
      </div>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   JIRA TOOLBAR  (mirrors desktop ExperienceContent toolbar)
══════════════════════════════════════════════════════════════ */
function JiraToolbar({ count, name }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
        flexWrap: "wrap",
        padding: "8px 12px",
        background: "rgba(0,0,0,0.08)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
      }}>
      <span
        style={{
          fontSize: 10,
          color: "var(--text-dim)",
          letterSpacing: "0.06em",
        }}>
        Projects / <span style={{ color: "var(--cyan)" }}>{name}</span> / Board
      </span>
      <span
        style={{
          fontSize: 9,
          padding: "2px 8px",
          borderRadius: "var(--radius-sm)",
          background: "var(--cyan-dim)",
          color: "var(--cyan)",
          border: "1px solid rgba(0,229,255,0.2)",
          letterSpacing: "0.08em",
          fontWeight: 600,
        }}>
        EPIC: QA CAREER
      </span>
      <span
        style={{ marginLeft: "auto", fontSize: 9, color: "var(--text-dim)" }}>
        {count} issues · Tap to expand
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EXPERIENCE CARD  (mirrors desktop jira-issue)
══════════════════════════════════════════════════════════════ */
function ExperienceCard({ exp }) {
  const [open, setOpen] = useState(false);

  const isInProgress = exp.status === "progress";

  return (
    <div
      onClick={() => setOpen((o) => !o)}
      style={{
        background: open ? "var(--cyan-glow)" : "var(--border-sub)",
        border: `1px solid ${open ? "var(--border-act)" : "var(--border)"}`,
        borderRadius: "var(--radius-md)",
        padding: "14px 16px",
        cursor: "pointer",
        transition: "border-color var(--dur-base), background var(--dur-base)",
        userSelect: "none",
      }}>
      {/* ── Header row ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        {/* Issue key */}
        <span
          style={{
            fontSize: 9,
            color: "var(--cyan)",
            letterSpacing: "0.08em",
            flexShrink: 0,
            marginTop: 3,
            fontFamily: "var(--font-mono)",
          }}>
          {exp.key}
        </span>

        {/* Title + sub + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-bright)",
              fontWeight: 500,
              marginBottom: 3,
              lineHeight: 1.4,
            }}>
            {exp.title}
          </div>

          {exp.sub && (
            <div
              style={{
                fontSize: 10,
                color: "var(--text-dim)",
                marginBottom: 8,
                lineHeight: 1.4,
              }}>
              {exp.sub}
            </div>
          )}

          {/* Status + type + date badges */}
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              flexWrap: "wrap",
            }}>
            <span
              style={{
                fontSize: 9,
                padding: "2px 8px",
                borderRadius: "var(--radius-sm)",
                letterSpacing: "0.08em",
                fontWeight: 600,
                background: isInProgress
                  ? "var(--cyan-dim)"
                  : "var(--green-dim)",
                color: isInProgress ? "var(--cyan)" : "var(--green)",
                border: isInProgress
                  ? "1px solid rgba(0,229,255,0.2)"
                  : "1px solid rgba(0,255,136,0.2)",
              }}>
              {isInProgress ? "IN PROGRESS" : "DONE"}
            </span>

            <span
              style={{
                fontSize: 9,
                padding: "2px 8px",
                borderRadius: "var(--radius-sm)",
                background: "var(--border-sub)",
                color: "var(--text-dim)",
                border: "1px solid var(--border)",
              }}>
              {exp.type}
            </span>

            <span
              style={{
                fontSize: 9,
                color: "var(--text-dim)",
                marginLeft: "auto",
              }}>
              {exp.date}
            </span>
          </div>
        </div>

        {/* Animated chevron */}
        <span
          style={{
            fontSize: 9,
            color: open ? "var(--cyan)" : "var(--text-dim)",
            flexShrink: 0,
            marginTop: 4,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform var(--dur-base), color var(--dur-base)",
            display: "inline-block",
          }}>
          ▶
        </span>
      </div>

      {/* ── Expanded details ── */}
      {open && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            animation: "mfFadeSlideIn 0.18s ease",
          }}>
          {/* Bullet points */}
          {exp.bullets?.map((b, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span
                style={{ color: "var(--cyan)", flexShrink: 0, marginTop: 1 }}>
                ▸
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-dim)",
                  lineHeight: 1.7,
                  fontFamily: "var(--font-mono)",
                }}>
                {b}
              </span>
            </div>
          ))}

          {/* Skill tags */}
          {exp.tags?.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 6,
              }}>
              {exp.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 9,
                    padding: "2px 8px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--win-bar)",
                    color: "var(--text-dim)",
                    border: "1px solid var(--border)",
                    fontFamily: "var(--font-mono)",
                  }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SKILL PILL
══════════════════════════════════════════════════════════════ */
function SkillPill({ name }) {
  return (
    <span
      style={{
        fontSize: 10,
        padding: "4px 10px",
        borderRadius: "var(--radius-sm)",
        background: "var(--border-sub)",
        color: "var(--text-dim)",
        border: "1px solid var(--border)",
        fontFamily: "var(--font-mono)",
      }}>
      {name}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   CONTACT ROW
══════════════════════════════════════════════════════════════ */
function ContactRow({ icon, value, href }) {
  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        textDecoration: "none",
        color: "var(--text)",
        fontSize: 12,
        background: "var(--border-sub)",
        fontFamily: "var(--font-mono)",
        transition: "border-color var(--dur-fast), background var(--dur-fast)",
      }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
      {value}
    </a>
  );
}

/* ══════════════════════════════════════════════════════════════
   STICKY NAV BAR
══════════════════════════════════════════════════════════════ */
function MobileNav({ theme, onToggleTheme }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--taskbar-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 20px",
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
      {/* Logo */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--cyan)",
          letterSpacing: "0.12em",
          fontFamily: "var(--font-mono)",
        }}>
        ⚡ ValOS
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Available indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 10,
            color: "var(--green)",
            fontFamily: "var(--font-mono)",
          }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--green)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          Available
        </div>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          style={{
            width: 30,
            height: 30,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            background: "var(--input-bg)",
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════ */
export default function MobileFallback({ profile, experiences, skillSuites }) {
  const { theme, toggle } = useTheme();

  const name = profile?.name ?? "Val Krystoper Abilo";
  const role = profile?.role ?? "QA Engineer II";
  const bio = profile?.bio ?? "";
  const email = profile?.email ?? "abilovalkrystoper@gmail.com";
  const phone = profile?.phone ?? "";
  const linkedin =
    profile?.linkedin_url ??
    "https://linkedin.com/in/valkrystoper-abilo-a5b88a236";
  const github = profile?.github_url ?? "https://github.com/YOUR_USERNAME";
  const exps = experiences ?? [];
  const allSkills = (skillSuites ?? []).flatMap((suite) =>
    suite.tests.map((t) => t.name),
  );

  return (
    <div className="mobile-fallback">
      {/* Sticky nav with theme toggle */}
      <MobileNav theme={theme} onToggleTheme={toggle} />

      {/* ── Hero ── */}
      <div
        style={{
          padding: "40px 20px 28px",
          textAlign: "center",
          borderBottom: "1px solid var(--border)",
          background:
            "linear-gradient(180deg, var(--desktop-grad-1) 0%, transparent 100%)",
        }}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "var(--text-bright)",
            marginBottom: 4,
            letterSpacing: "0.02em",
            fontFamily: "var(--font-mono)",
          }}>
          {name}
        </div>

        <div
          style={{
            fontSize: 11,
            color: "var(--green)",
            letterSpacing: "0.12em",
            marginBottom: 16,
            fontFamily: "var(--font-mono)",
          }}>
          // {role.toUpperCase()}
        </div>

        {bio && (
          <p
            style={{
              fontSize: 11,
              color: "var(--text-dim)",
              lineHeight: 1.8,
              maxWidth: 360,
              margin: "0 auto 20px",
              fontFamily: "var(--font-mono)",
            }}>
            {bio}
          </p>
        )}

        {/* Desktop notice */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 10,
            color: "var(--amber)",
            background: "var(--amber-dim)",
            border: "1px solid rgba(255,184,0,0.2)",
            padding: "7px 14px",
            borderRadius: "var(--radius-md)",
            marginBottom: 20,
            fontFamily: "var(--font-mono)",
          }}>
          ⚠ Full interactive OS experience on desktop.
        </div>

        {/* Quick links */}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
          {[
            { label: "📧 Email", href: `mailto:${email}` },
            { label: "LinkedIn ↗", href: linkedin },
            { label: "GitHub ↗", href: github },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              style={{
                color: "var(--cyan)",
                fontSize: 11,
                textDecoration: "none",
                fontFamily: "var(--font-mono)",
              }}>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Career / Experience ── */}
      <Section title="Career">
        {exps.length === 0 ? (
          <div
            style={{
              fontSize: 12,
              color: "var(--text-dim)",
              textAlign: "center",
              padding: 20,
              fontFamily: "var(--font-mono)",
            }}>
            Loading...
          </div>
        ) : (
          <>
            <JiraToolbar count={exps.length} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {exps.map((exp) => (
                <ExperienceCard key={exp.key} exp={exp} />
              ))}
            </div>
          </>
        )}
      </Section>

      {/* ── Skills ── */}
      <Section title="Skills">
        {allSkills.length === 0 ? (
          <div
            style={{
              fontSize: 12,
              color: "var(--text-dim)",
              fontFamily: "var(--font-mono)",
            }}>
            Loading...
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {allSkills.map((skill) => (
              <SkillPill key={skill} name={skill} />
            ))}
          </div>
        )}
      </Section>

      {/* ── Contact ── */}
      <Section title="Contact">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <ContactRow icon="📧" value={email} href={`mailto:${email}`} />
          {phone && (
            <ContactRow
              icon="📞"
              value={phone}
              href={`tel:${phone.replace(/\s/g, "")}`}
            />
          )}
          <ContactRow icon="🔗" value="LinkedIn" href={linkedin} />
          <ContactRow icon="🐙" value="GitHub" href={github} />
        </div>
      </Section>

      {/* ── Footer ── */}
      <div
        style={{
          padding: "24px 20px",
          textAlign: "center",
          fontSize: 10,
          color: "var(--text-muted)",
          letterSpacing: "0.06em",
          fontFamily: "var(--font-mono)",
        }}>
        © {new Date().getFullYear()} Val Krystoper Abilo · QA Engineer II
      </div>

      {/* Expand animation keyframe */}
      <style>{`
        @keyframes mfFadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
