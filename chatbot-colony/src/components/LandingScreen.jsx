import { useState } from "react";
import { AVATARS, BOTS } from "../data/bots.js";
import { storage } from "../utils/storage.js";

export default function LandingScreen({ onJoin, onLogin }) {
  const [mode,     setMode]     = useState("signup"); // signup | login
  const [username, setUsername] = useState("");
  const [avatar,   setAvatar]   = useState(AVATARS[0]);
  const [error,    setError]    = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const clean = username.trim();
    if (!clean || clean.length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }
    if (clean.length > 18) {
      setError("Username must be 18 characters or less");
      return;
    }

    if (mode === "signup") {
      const existing = storage.getUser(clean);
      if (existing) { setError("Username taken — try logging in instead"); return; }
      onJoin({ username: clean, avatar, joinedAt: new Date().toLocaleDateString() });
    } else {
      const found = storage.getUser(clean);
      if (!found) { setError("User not found — sign up first"); return; }
      onLogin(found);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-page)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
    }}>

      {/* ── Hero ── */}
      <div className="fade-in" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ fontSize: 72, marginBottom: 16, lineHeight: 1 }}>🏙️</div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 6vw, 40px)",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "-1px",
          marginBottom: 10,
        }}>
          Chatbot Colony
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 360, lineHeight: 1.5, margin: "0 auto 24px" }}>
          A cozy AI city. Every building, a different character. Explore, chat, discover.
        </p>

        {/* Bot previews */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 440, margin: "0 auto" }}>
          {BOTS.map(b => (
            <span key={b.id} style={{
              background: b.accentLight,
              color: b.accentDark,
              borderRadius: 20,
              padding: "5px 12px",
              fontSize: 13,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}>
              {b.icon} {b.botName}
            </span>
          ))}
        </div>
      </div>

      {/* ── Auth card ── */}
      <div className="fade-in" style={{
        background: "var(--bg-card)",
        borderRadius: 20,
        border: "1px solid var(--border)",
        padding: "2rem",
        width: "100%",
        maxWidth: 400,
        boxShadow: "var(--shadow-md)",
      }}>

        {/* Mode toggle */}
        <div style={{
          display: "flex",
          background: "var(--bg-secondary)",
          borderRadius: 12,
          padding: 4,
          marginBottom: "1.75rem",
        }}>
          {["signup", "login"].map(m => (
            <button key={m}
              onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 9,
                fontSize: 14,
                fontWeight: mode === m ? 600 : 400,
                background: mode === m ? "var(--bg-card)" : "transparent",
                color: mode === m ? "var(--text-primary)" : "var(--text-secondary)",
                boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.2s",
              }}>
              {m === "signup" ? "🏡 Join Colony" : "🔑 Log In"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
            Username
          </label>
          <input
            value={username}
            onChange={e => { setUsername(e.target.value); setError(""); }}
            placeholder="Enter your username…"
            maxLength={18}
            autoFocus
            style={{ marginBottom: "1.25rem" }}
          />

          {mode === "signup" && (
            <>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>
                Choose your avatar
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.5rem" }}>
                {AVATARS.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    style={{
                      fontSize: 24,
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      border: avatar === a ? "2px solid #2D4A8A" : "1px solid var(--border)",
                      background: avatar === a ? "#EEF2FF" : "var(--bg-card)",
                      transition: "all 0.15s",
                    }}>
                    {a}
                  </button>
                ))}
              </div>
            </>
          )}

          {error && (
            <p style={{ fontSize: 13, color: "#B91C1C", marginBottom: 12, background: "#FEF2F2", borderRadius: 8, padding: "8px 12px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 0",
              background: "#1E3A8A",
              color: "#fff",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "0.01em",
            }}
            onMouseOver={e => e.currentTarget.style.background = "#1E3370"}
            onMouseOut={e => e.currentTarget.style.background = "#1E3A8A"}
          >
            {mode === "signup"
              ? `Join as ${avatar} ${username || "Citizen"} →`
              : "Enter the City →"}
          </button>
        </form>
      </div>

      {/* Skyline decoration */}
      <p style={{ marginTop: "2.5rem", fontSize: 28, letterSpacing: 6, opacity: 0.18 }}>
        🏢🏛️🏬🏦🏪🏗️🏢
      </p>
    </div>
  );
}
