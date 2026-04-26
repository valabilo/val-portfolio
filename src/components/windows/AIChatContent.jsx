// src/components/windows/AIChatContent.jsx
import { useState, useEffect, useRef } from "react";
import portfolioData from "../../data/portfolio.json";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;
const GEMINI_MODEL =
  import.meta.env.VITE_GEMINI_MODEL ?? "gemini-3.1-pro-preview";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;

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

function buildSystemPrompt() {
  const { profile, education, awards, experiences, skillSuites, projects } =
    portfolioData;

  const eduBlock = education
    .map(
      (e) =>
        `- [${e.type}] ${e.title} — ${e.institution}${e.year ? `, ${e.year}` : ""}`,
    )
    .join("\n");

  const awardsBlock = awards
    .map(
      (a) =>
        `- ${a.title}${a.issuer ? ` (${a.issuer})` : ""}${a.year ? `, ${a.year}` : ""}`,
    )
    .join("\n");

  const expBlock = experiences
    .map((exp) => {
      const bullets = exp.bullets.map((b) => `  • ${b}`).join("\n");
      const tags = exp.tags.join(", ");
      const status =
        exp.status === "progress" ? "CURRENT ROLE" : "PREVIOUS ROLE";
      return `[${status}] ${exp.title}\nPeriod: ${exp.date} | Type: ${exp.type}\nLocation: ${exp.sub}\nKey achievements:\n${bullets}\nSkills used: ${tags}`;
    })
    .join("\n\n");

  const skillsBlock = skillSuites
    .map((suite) => {
      const skills = suite.tests
        .map(
          (s) =>
            `  - ${s.name} (${s.pct}%)${s.tag === "warn" ? " [actively learning]" : ""}`,
        )
        .join("\n");
      return `${suite.label}:\n${skills}`;
    })
    .join("\n\n");

  const projectsBlock = projects
    .map(
      (p) => `- ${p.name} [${p.type}]: ${p.desc} | Tools: ${p.tags.join(", ")}`,
    )
    .join("\n");

  return `You are the AI representative of ${profile.name}, a professional QA Tester.
Your role is to answer questions from recruiters, hiring managers, clients, and collaborators visiting Val's interactive portfolio website (ValOS).

Speak on Val's behalf — use first person ("I", "my", "I have") as if you ARE Val.
Be professional, concise, confident, and honest.
Only use the data provided below — do not invent any information.
If you don't know the answer, say "I don't have that information. You can email me at ${profile.email} and I'll get back to you as soon as possible."
Keep answers under 150 words unless a detailed explanation is genuinely needed.
Do not mention that you are an AI or that you are reading from a data file.
Do not use closing sign-offs like "Best regards" or "Feel free to ask".
For salary/rate questions: say you are open to discussing based on the role.

═══════════════════════════════════════════════════
VAL'S PORTFOLIO DATA
═══════════════════════════════════════════════════

IDENTITY
Name: ${profile.name}
Role: ${profile.role}
Location: ${profile.location}
Email: ${profile.email}
Phone: ${profile.phone}
LinkedIn: ${profile.linkedin_url}
GitHub: ${profile.github_url}
Available for work: ${profile.available ? "Yes" : "No"}

BIO
${profile.bio}

EDUCATION
${eduBlock}

AWARDS & RECOGNITION
${awardsBlock}

WORK EXPERIENCE
${expBlock}

TECHNICAL SKILLS
${skillsBlock}

QA PROJECTS & PORTFOLIO
${projectsBlock}`;
}

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
      if (!GEMINI_KEY) throw new Error("VITE_GEMINI_KEY is not set in .env");

      const geminiMessages = newMessages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: buildSystemPrompt() }],
          },
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE",
            },
          ],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message ?? "Gemini API error");
      }

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "Sorry, I could not generate a response. Please try again.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message ?? "Connection failed. Please try again.");
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

      <div className="ai-chat-messages">
        {messages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}

        {error && <div className="ai-chat-error">⚠ {error}</div>}

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
