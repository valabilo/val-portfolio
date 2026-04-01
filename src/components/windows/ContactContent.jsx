// src/components/windows/ContactContent.jsx
import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function validateForm(form) {
  const e = {};
  if (!form.name.trim()) e.name = true;
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    e.email = true;
  if (!form.subject.trim()) e.subject = true;
  if (!form.message.trim()) e.message = true;
  return e;
}

const FOLDERS = [
  { icon: "✉️", label: "Compose", id: "compose", badge: 1 },
  { icon: "📥", label: "Inbox", id: "inbox" },
  { icon: "📤", label: "Sent", id: "sent" },
];

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

  return (
    <div className="mail-client">
      {/* Sidebar */}
      <div className="mail-sidebar">
        {FOLDERS.map((f) => (
          <div
            key={f.id}
            className={`mail-folder${f.id === "compose" ? " active" : ""}`}>
            <span style={{ fontSize: 14 }}>{f.icon}</span>
            {f.label}
            {f.badge && (
              <div
                style={{
                  marginLeft: "auto",
                  fontSize: 9,
                  background: "var(--cyan)",
                  color: "var(--os-bg)",
                  width: 16,
                  height: 16,
                  borderRadius: "var(--radius-full)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}>
                {f.badge}
              </div>
            )}
          </div>
        ))}

        {/* Contact info */}
        <div className="mail-sidebar-info">
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
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
            <a href={github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
          </div>
        </div>
      </div>

      {/* Compose area */}
      <div className="mail-compose">
        {/* Header */}
        <div className="mail-compose-header">
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
            <div className="mail-form-area">
              {apiErr && <div className="mail-error-banner">⚠ {apiErr}</div>}

              {[
                {
                  label: "To:",
                  value: toEmail,
                  key: null,
                  readOnly: true,
                  style: { color: "var(--cyan)" },
                },
                {
                  label: "From:",
                  value: form.email,
                  key: "email",
                  type: "email",
                  placeholder: "your@email.com",
                },
                {
                  label: "Name:",
                  value: form.name,
                  key: "name",
                  placeholder: "Your name",
                },
                {
                  label: "Re:",
                  value: form.subject,
                  key: "subject",
                  placeholder: "Job opportunity / Project / Let's talk...",
                },
              ].map((field) => (
                <div key={field.label} className="mail-field-row">
                  <span className="mail-field-label">{field.label}</span>
                  <input
                    className={`mail-input${errors[field.key] ? " error" : ""}`}
                    value={field.value}
                    onChange={field.key ? update(field.key) : undefined}
                    readOnly={field.readOnly}
                    type={field.type}
                    placeholder={field.placeholder}
                    style={field.style}
                  />
                </div>
              ))}

              <textarea
                className={`mail-body${errors.message ? " error" : ""}`}
                placeholder={
                  "Hi Val,\n\nI'd like to discuss...\n\nBest regards,"
                }
                value={form.message}
                onChange={update("message")}
                style={{ flex: 1, marginTop: 12 }}
              />
            </div>

            <div className="mail-footer">
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
