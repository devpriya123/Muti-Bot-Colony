import { useState } from "react";
import { BOTS } from "../data/bots.js";

export default function CityScreen({ user, chats, onEnter, onLogout }) {
  const [hovered, setHovered] = useState(null);

  const totalMessages = Object.values(chats).reduce((sum, msgs) => sum + msgs.length, 0);
  const visitedCount  = Object.values(chats).filter(m => m.length > 0).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", fontFamily: "var(--font-sans)" }}>

      {/* ── Top bar ── */}
      <header style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 0 var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>🏙️</span>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text-primary)", margin: 0 }}>
              Chatbot Colony
            </p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>
              {BOTS.length} residents • always open
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Stats pills */}
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{
              background: "#EEF2FF", color: "#2D4A8A",
              fontSize: 12, fontWeight: 600,
              padding: "4px 10px", borderRadius: 20,
            }}>
              💬 {totalMessages} msgs
            </span>
            <span style={{
              background: "#ECFDF5", color: "#065F46",
              fontSize: 12, fontWeight: 600,
              padding: "4px 10px", borderRadius: 20,
            }}>
              🏠 {visitedCount}/{BOTS.length} visited
            </span>
          </div>

          {/* User badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--bg-secondary)",
            borderRadius: 24, padding: "6px 14px 6px 10px",
          }}>
            <span style={{ fontSize: 22 }}>{user.avatar}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{user.username}</span>
          </div>

          <button
            onClick={onLogout}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "7px 14px",
              color: "var(--text-secondary)",
              fontSize: 13,
            }}
            onMouseOver={e => e.currentTarget.style.background = "var(--bg-secondary)"}
            onMouseOut={e => e.currentTarget.style.background = "none"}
          >
            Leave
          </button>
        </div>
      </header>

      {/* ── Welcome banner ── */}
      <div style={{ padding: "24px 24px 0" }}>
        <div className="fade-in" style={{
          background: "linear-gradient(135deg, #1E3A8A 0%, #3B5BA5 60%, #4F6FBF 100%)",
          borderRadius: 18,
          padding: "22px 24px",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, margin: "0 0 5px" }}>
              Welcome back, {user.avatar} {user.username}!
            </p>
            <p style={{ fontSize: 14, opacity: 0.85, margin: 0 }}>
              6 AI residents are waiting to chat. Pick a building and explore.
            </p>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "Residents", value: BOTS.length, emoji: "🤖" },
              { label: "Messages",  value: totalMessages, emoji: "💬" },
              { label: "Visited",   value: `${visitedCount}/${BOTS.length}`, emoji: "🗺️" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 16px", minWidth: 72 }}>
                <p style={{ fontSize: 22, margin: "0 0 2px" }}>{s.emoji}</p>
                <p style={{ fontWeight: 700, fontSize: 18, margin: "0 0 2px" }}>{s.value}</p>
                <p style={{ fontSize: 11, opacity: 0.75, margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── City grid ── */}
      <main style={{ padding: "24px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.08em", marginBottom: 16, textTransform: "uppercase" }}>
          🗺️ City Map — tap a building to enter
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}>
          {BOTS.map((bot, i) => {
            const msgCount = (chats[bot.id] || []).length;
            const isHovered = hovered === bot.id;
            const hasVisited = msgCount > 0;

            return (
              <div
                key={bot.id}
                className="fade-in"
                onMouseEnter={() => setHovered(bot.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onEnter(bot)}
                style={{
                  background: "var(--bg-card)",
                  borderRadius: 18,
                  border: isHovered ? `2px solid ${bot.accent}` : "1px solid var(--border)",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform: isHovered ? "translateY(-3px)" : "none",
                  boxShadow: isHovered ? `0 8px 28px ${bot.accent}22` : "var(--shadow-sm)",
                  animationDelay: `${i * 0.05}s`,
                  animationFillMode: "both",
                }}
              >
                {/* Building header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                  <div style={{
                    background: bot.accentLight,
                    borderRadius: 16,
                    width: 60,
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 30,
                    flexShrink: 0,
                  }}>
                    {bot.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                      <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-display)" }}>
                        {bot.name}
                      </h2>
                      {hasVisited && (
                        <span style={{
                          background: bot.accentLight,
                          color: bot.accentDark,
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: 20,
                          flexShrink: 0,
                        }}>
                          {msgCount} msgs
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>{bot.tagline}</p>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 14 }}>
                  {bot.description}
                </p>

                {/* Bot tag + enter CTA */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background: bot.accentLight,
                    borderRadius: 20,
                    padding: "5px 12px",
                  }}>
                    <span style={{ fontSize: 18 }}>{bot.botAvatar}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: bot.accentDark }}>{bot.botName}</span>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
                  </div>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: isHovered ? bot.accent : "var(--text-tertiary)",
                    transition: "color 0.2s",
                  }}>
                    Enter →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
