import { useState, useEffect, useRef } from "react";
import { askBot } from "../utils/api.js";
import { STARTER_MESSAGES } from "../data/bots.js";

export default function ChatScreen({ user, bot, messages, onUpdateMessages, onBack }) {
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const chatEndRef = useRef(null);
  const inputRef   = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  async function sendMessage(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    setError("");
    const userMsg  = { role: "user", content };
    const updated  = [...messages, userMsg];
    onUpdateMessages(updated);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const reply = await askBot(bot.system, updated);
      onUpdateMessages([...updated, { role: "assistant", content: reply }]);
    } catch (err) {
      if (err.message === "NO_API_KEY") {
        setError("⚠️ No API key set. Copy .env.example → .env and add your VITE_ANTHROPIC_API_KEY.");
      } else {
        setError(`Error: ${err.message}`);
      }
      // Remove the user message on failure so they can retry
      onUpdateMessages(messages);
    }
    setLoading(false);
    inputRef.current?.focus();
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const starters = STARTER_MESSAGES[bot.id] ?? [];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "var(--bg-page)",
      fontFamily: "var(--font-sans)",
    }}>

      {/* ── Header ── */}
      <header style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        padding: "0 16px",
        height: 64,
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexShrink: 0,
        boxShadow: "0 1px 0 var(--border)",
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "7px 13px",
            fontSize: 13,
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}
          onMouseOver={e => e.currentTarget.style.background = "var(--bg-secondary)"}
          onMouseOut={e => e.currentTarget.style.background = "none"}
        >
          ← City
        </button>

        <div style={{
          background: bot.accentLight,
          borderRadius: 12,
          width: 42, height: 42,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0,
        }}>
          {bot.botAvatar}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-display)" }}>
            {bot.botName}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>
            {bot.name} · {bot.tagline}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#16A34A", fontWeight: 600, flexShrink: 0 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
          Online
        </div>
      </header>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="fade-in" style={{ textAlign: "center", padding: "40px 20px", maxWidth: 420, margin: "0 auto" }}>
            <div style={{ fontSize: 56, marginBottom: 14 }}>{bot.icon}</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)", marginBottom: 8 }}>
              You're inside {bot.name}
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
              {bot.description}. Say hello to {bot.botName}!
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {starters.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    background: bot.accentLight,
                    border: `1px solid ${bot.accent}33`,
                    borderRadius: 24,
                    padding: "10px 18px",
                    fontSize: 14,
                    color: bot.accentDark,
                    fontWeight: 500,
                    transition: "all 0.15s",
                  }}
                  onMouseOver={e => e.currentTarget.style.background = bot.accentLight}
                  onMouseOut={e => e.currentTarget.style.background = bot.accentLight}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages list */}
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <div
              key={i}
              className="fade-in"
              style={{
                display: "flex",
                flexDirection: isUser ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: 10,
                animationDelay: "0s",
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 34, height: 34,
                borderRadius: 10,
                background: isUser ? "#1E3A8A" : bot.accentLight,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}>
                {isUser ? user.avatar : bot.botAvatar}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: "72%",
                padding: "11px 15px",
                borderRadius: 16,
                borderBottomRightRadius: isUser ? 4 : 16,
                borderBottomLeftRadius:  isUser ? 16 : 4,
                background: isUser ? "#1E3A8A" : "var(--bg-card)",
                color: isUser ? "#fff" : "var(--text-primary)",
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                border: isUser ? "none" : "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}>
                {m.content}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }} className="fade-in">
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: bot.accentLight,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>
              {bot.botAvatar}
            </div>
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16, borderBottomLeftRadius: 4,
              padding: "12px 18px",
              display: "flex", gap: 4, alignItems: "center",
            }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <span key={i} style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: bot.accent,
                  display: "inline-block",
                  animation: `pulse 1.2s ease-in-out ${delay}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FECACA",
            borderRadius: 10, padding: "10px 14px",
            fontSize: 13, color: "#B91C1C", lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Input bar ── */}
      <div style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
        padding: "12px 16px",
        display: "flex",
        gap: 10,
        alignItems: "flex-end",
        flexShrink: 0,
      }}>
        <textarea
          ref={el => { textareaRef.current = el; inputRef.current = el; }}
          value={input}
          onChange={e => { setInput(e.target.value); autoResize(); setError(""); }}
          onKeyDown={handleKey}
          placeholder={`Message ${bot.botName}…`}
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 14,
            lineHeight: 1.5,
            maxHeight: 120,
            overflowY: "auto",
            border: "1px solid var(--border)",
            background: "var(--bg-page)",
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim() ? "var(--bg-secondary)" : bot.accent,
            color: loading || !input.trim() ? "var(--text-tertiary)" : "#fff",
            borderRadius: 12,
            width: 46,
            height: 46,
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
