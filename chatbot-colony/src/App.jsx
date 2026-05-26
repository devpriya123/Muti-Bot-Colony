import { useState, useEffect } from "react";
import { storage } from "./utils/storage.js";
import { BOTS } from "./data/bots.js";
import LandingScreen from "./components/LandingScreen.jsx";
import CityScreen    from "./components/CityScreen.jsx";
import ChatScreen    from "./components/ChatScreen.jsx";

export default function App() {
  const [screen,      setScreen]      = useState("loading"); // loading | landing | city | chat
  const [user,        setUser]        = useState(null);
  const [activeBot,   setActiveBot]   = useState(null);
  const [chats,       setChats]       = useState({});        // { botId: [{role, content}] }

  /* ── Restore session on mount ── */
  useEffect(() => {
    const saved = storage.getSession();
    if (saved) {
      setUser(saved);
      // Load all chat histories for this user
      const loaded = {};
      BOTS.forEach(b => {
        const history = storage.getChat(saved.username, b.id);
        if (history.length) loaded[b.id] = history;
      });
      setChats(loaded);
      setScreen("city");
    } else {
      setScreen("landing");
    }
  }, []);

  /* ── Auth handlers ── */
  function handleJoin(newUser) {
    storage.saveUser(newUser);
    storage.saveSession(newUser);
    setUser(newUser);
    setChats({});
    setScreen("city");
  }

  function handleLogin(existingUser) {
    storage.saveSession(existingUser);
    setUser(existingUser);
    // Restore this user's chats
    const loaded = {};
    BOTS.forEach(b => {
      const history = storage.getChat(existingUser.username, b.id);
      if (history.length) loaded[b.id] = history;
    });
    setChats(loaded);
    setScreen("city");
  }

  function handleLogout() {
    storage.clearSession();
    setUser(null);
    setChats({});
    setActiveBot(null);
    setScreen("landing");
  }

  /* ── City / Chat navigation ── */
  function enterBuilding(bot) {
    setActiveBot(bot);
    setScreen("chat");
  }

  function exitBuilding() {
    setScreen("city");
  }

  /* ── Chat message handler ── */
  function updateChat(botId, messages) {
    setChats(prev => ({ ...prev, [botId]: messages }));
    storage.saveChat(user.username, botId, messages);
  }

  /* ── Loading splash ── */
  if (screen === "loading") {
    return (
      <div style={{
        height: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16,
      }}>
        <span style={{ fontSize: 56 }}>🏙️</span>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Loading Chatbot Colony…
        </p>
      </div>
    );
  }

  return (
    <>
      {screen === "landing" && (
        <LandingScreen onJoin={handleJoin} onLogin={handleLogin} />
      )}
      {screen === "city" && (
        <CityScreen
          user={user}
          chats={chats}
          onEnter={enterBuilding}
          onLogout={handleLogout}
        />
      )}
      {screen === "chat" && activeBot && (
        <ChatScreen
          user={user}
          bot={activeBot}
          messages={chats[activeBot.id] || []}
          onUpdateMessages={(msgs) => updateChat(activeBot.id, msgs)}
          onBack={exitBuilding}
        />
      )}
    </>
  );
}
