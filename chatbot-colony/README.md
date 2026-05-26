# 🏙️ Chatbot Colony

A cozy AI-powered city where every building houses a unique chatbot resident with its own personality. Create an account, explore the city, and have real conversations with 6 distinct AI characters.

---

## 🤖 Meet the Residents

| Building | Bot | Personality |
|---|---|---|
| 📚 Grand Library | **Sage** 🦉 | Wise, scholarly, knows everything |
| ☕ Cozy Café | **Mocha** 😊 | Warm, empathetic, great listener |
| ⚡ Tech Lab | **Volt** 🤖 | Sharp, precise, coding expert |
| 🌿 Wellness Spa | **Flora** 🌸 | Calm, caring, health & mindfulness |
| 🏦 City Bank | **Sterling** 💼 | Professional, financial advisor |
| 🎨 Creative Studio | **Nova** ✨ | Imaginative, helps with writing & art |

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Add your API key

```bash
cp .env.example .env
```

Open `.env` and replace `your_api_key_here` with your Anthropic API key.
Get one at: https://console.anthropic.com

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run the app

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

---

## 🏗️ Project Structure

```
chatbot-colony/
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Root component, screen routing, state
│   ├── index.css                # Global styles & CSS variables
│   ├── data/
│   │   └── bots.js              # All 6 bot definitions & starter messages
│   ├── utils/
│   │   ├── api.js               # Anthropic API helper (askBot function)
│   │   └── storage.js           # localStorage wrapper for accounts & chats
│   └── components/
│       ├── LandingScreen.jsx    # Sign up / Log in page
│       ├── CityScreen.jsx       # City map with building grid
│       └── ChatScreen.jsx       # Chat interface for each bot
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── README.md
```

---

## ✨ Features

- **User accounts** — sign up with a username and emoji avatar, log back in anytime
- **Persistent chat history** — conversations are saved per user per building in localStorage
- **6 unique AI personalities** — each bot has a distinct system prompt and character
- **Starter messages** — helpful prompts when entering a building for the first time
- **Live typing indicator** — animated dots while the bot is thinking
- **Responsive design** — works on desktop and mobile

---

## 🛠️ Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy to Vercel, Netlify, or any static host.

---

## 💡 Ideas to Extend

- Add more buildings / bot personalities
- Shared public chat rooms per building (use a backend like Supabase)
- Leaderboard showing who has sent the most messages
- User profiles with visit history and achievements
- Bot memory across sessions using the Anthropic API's context
- Sound effects and animations for entering buildings

---

## 🔑 API Key Security

This project is designed for **local development** or **personal use**. The API key is stored in `.env` and included in the Vite build. For a public-facing app, move the API calls to a backend server to keep your key secure.

---

## 📦 Tech Stack

- **React 18** + **Vite** — fast development and build
- **Anthropic Claude API** — powers all 6 bot personalities
- **localStorage** — persists user accounts and chat histories
- **Pure CSS** — no UI framework dependencies
