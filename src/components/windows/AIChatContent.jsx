// src/components/windows/AiChatContent.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

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

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hi! I'm Val's AI representative.\n\nAsk me anything about Val's experience, skills, projects, or availability — I'll answer as Val would. What would you like to know?",
};

/* ── Sub-components ──────────────────────────────────────────── */
function ChatBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`chat-bubble-wrap ${isUser ? "user" : "assistant"}`}>
      {!isUser && <div className="chat-avatar">⚡</div>}
      <div className={`chat-bubble ${isUser ? "user" : "assistant"}`}>
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="chat-typing">
      <div className="chat-avatar">⚡</div>
      <div className="chat-typing-dots">
        <div className="chat-dot" />
        <div className="chat-dot" />
        <div className="chat-dot" />
      </div>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────── */
export function AIChatContent() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggs, setShowSuggs] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
      const { data } = await axios.post(`${API}/api/chat`, {
        messages: newMessages,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      const msg =
        err.response?.data?.error ??
        "Connection failed. Make sure the API is running.";
      setError(msg);
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
        ...INITIAL_MESSAGE,
        content: "Chat cleared. Feel free to ask me anything about Val!",
      },
    ]);
    setShowSuggs(true);
    setError("");
  };

  return (
    <div className="ai-chat">
      {/* Toolbar */}
      <div className="ai-chat-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <div className="tb-status-dot" />
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
        <button className="ai-clear-btn" onClick={handleClear}>
          ↺ Clear
        </button>
      </div>

      {/* Messages */}
      <div className="ai-chat-messages">
        {messages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}

        {error && <div className="ai-chat-error">⚠ {error}</div>}

        {/* Suggestions */}
        {showSuggs && messages.length <= 1 && (
          <div className="chat-suggestions">
            <div className="chat-suggestions-label">Suggested questions</div>
            <div className="chat-suggestions-grid">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="chat-suggestion-btn"
                  onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="ai-chat-input-area">
        <div className="ai-chat-input-row">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about Val's experience, skills, or availability..."
            rows={1}
            className="ai-chat-textarea"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 80) + "px";
            }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className={`ai-chat-send-btn${input.trim() && !loading ? " ready" : ""}`}>
            {loading ? "···" : "↑ Send"}
          </button>
        </div>
        <div className="ai-chat-hint">
          Press Enter to send · Shift+Enter for new line · Answers are
          AI-generated from Val's real data
        </div>
      </div>
    </div>
  );
}
