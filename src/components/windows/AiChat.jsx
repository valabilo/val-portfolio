// src/components/windows/AiChat.jsx
// "Ask Val" — AI chat window powered by Anthropic Claude via Laravel API
// The AI knows everything about Val from the database and answers as Val.

import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// ── Suggested starter questions ──────────────────────────────
const SUGGESTIONS = [
  "What's your strongest QA skill?",
  "Have you done test automation before?",
  "Tell me about your experience with AI testing.",
  "What testing tools do you use daily?",
  "Are you available for freelance projects?",
  "What makes you a good QA Engineer?",
  "Describe your work at 1902 Software.",
  "Do you have experience with mobile testing?",
];

// ── Single chat bubble ────────────────────────────────────────
// Defined outside the parent component (React 19 rule)
function ChatBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 12,
      }}>
      {/* Avatar — only for assistant */}
      {!isUser && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(0,229,255,0.1)",
            border: "1px solid rgba(0,229,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            flexShrink: 0,
            marginRight: 8,
            marginTop: 2,
          }}>
          ⚡
        </div>
      )}

      <div
        style={{
          maxWidth: "75%",
          padding: "10px 14px",
          borderRadius: isUser ? "12px 12px 2px 12px" : "2px 12px 12px 12px",
          background: isUser
            ? "rgba(0,229,255,0.12)"
            : "rgba(255,255,255,0.04)",
          border: `1px solid ${
            isUser ? "rgba(0,229,255,0.25)" : "rgba(255,255,255,0.08)"
          }`,
          fontSize: 12,
          lineHeight: 1.7,
          color: isUser ? "var(--cyan)" : "var(--text)",
          fontFamily: "var(--mono)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}>
        {msg.content}
      </div>
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────
function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
      }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(0,229,255,0.1)",
          border: "1px solid rgba(0,229,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          flexShrink: 0,
        }}>
        ⚡
      </div>
      <div
        style={{
          padding: "10px 14px",
          borderRadius: "2px 12px 12px 12px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          gap: 5,
          alignItems: "center",
        }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--cyan)",
              animation: "dotPulse 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export function AiChatContent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggs, setShowSuggs] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Show greeting on first mount
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I'm Val's AI representative.\n\nAsk me anything about Val's experience, skills, projects, or availability — I'll answer as Val would. What would you like to know?",
      },
    ]);
  }, []);

  const send = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || loading) return;

    setInput("");
    setError("");
    setShowSuggs(false);

    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Send full conversation history so Claude has context
      const { data } = await axios.post(`${API}/api/chat`, {
        messages: newMessages,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (err) {
      const msg =
        err.response?.data?.error ??
        "Connection failed. Make sure the API is running.";
      setError(msg);
      // Remove the user message on error so they can retry
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared. Feel free to ask me anything about Val!",
      },
    ]);
    setShowSuggs(true);
    setError("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
        background: "#020209",
      }}>
      {/* ── Toolbar ── */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid var(--border)",
          background: "rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--green)",
              animation: "pulse 2s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "var(--text-dim)",
              letterSpacing: "0.06em",
            }}>
            AI powered by <span style={{ color: "var(--cyan)" }}>Gemini</span>
            &nbsp;·&nbsp;
            <span style={{ color: "var(--green)" }}>Live portfolio data</span>
          </span>
        </div>
        <button
          onClick={handleClear}
          style={{
            background: "none",
            border: "1px solid var(--border)",
            color: "var(--text-dim)",
            fontFamily: "var(--mono)",
            fontSize: 10,
            padding: "3px 10px",
            borderRadius: 4,
            cursor: "pointer",
            letterSpacing: "0.06em",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "var(--red)";
            e.target.style.color = "var(--red)";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.color = "var(--text-dim)";
          }}>
          ↺ Clear
        </button>
      </div>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 8px" }}>
        {messages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} />
        ))}

        {loading && <TypingIndicator />}

        {error && (
          <div
            style={{
              margin: "8px 0 12px",
              padding: "10px 14px",
              background: "var(--red-dim)",
              border: "1px solid rgba(255,68,102,0.3)",
              borderRadius: 6,
              fontSize: 11,
              color: "var(--red)",
              fontFamily: "var(--mono)",
            }}>
            ⚠ {error}
          </div>
        )}

        {/* Suggested questions — shown initially */}
        {showSuggs && messages.length <= 1 && (
          <div style={{ marginTop: 8 }}>
            <div
              style={{
                fontSize: 10,
                color: "var(--text-dim)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}>
              Suggested questions
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    background: "rgba(0,229,255,0.05)",
                    border: "1px solid rgba(0,229,255,0.2)",
                    borderRadius: 4,
                    padding: "5px 10px",
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--cyan)",
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(0,229,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(0,229,255,0.05)";
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input area ── */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--border)",
          background: "rgba(0,0,0,0.2)",
          flexShrink: 0,
        }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "8px 12px",
            transition: "border-color 0.2s",
          }}
          onFocusCapture={(e) =>
            (e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)")
          }
          onBlurCapture={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about Val's experience, skills, or availability..."
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--mono)",
              fontSize: 12,
              color: "var(--text)",
              resize: "none",
              lineHeight: 1.6,
              maxHeight: 80,
              overflow: "auto",
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 80) + "px";
            }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            style={{
              background:
                input.trim() && !loading
                  ? "var(--cyan)"
                  : "rgba(0,229,255,0.1)",
              border: "none",
              borderRadius: 4,
              padding: "6px 14px",
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 700,
              color:
                input.trim() && !loading ? "var(--os-bg)" : "var(--text-dim)",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              flexShrink: 0,
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
            }}>
            {loading ? "···" : "↑ Send"}
          </button>
        </div>
        <div
          style={{
            fontSize: 9,
            color: "var(--text-dim)",
            marginTop: 6,
            textAlign: "center",
            letterSpacing: "0.06em",
          }}>
          Press Enter to send · Shift+Enter for new line · Answers are
          AI-generated from Val's real data
        </div>
      </div>

      {/* Dot pulse keyframes injected once */}
      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
