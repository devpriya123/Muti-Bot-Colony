const PREFIX = "colony_";

export const storage = {
  get(key) {
    try {
      const val = localStorage.getItem(PREFIX + key);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch {
      return false;
    }
  },

  /** Save / load chat history per user per bot */
  getChat(username, botId) {
    return this.get(`chat_${username}_${botId}`) ?? [];
  },

  saveChat(username, botId, messages) {
    return this.set(`chat_${username}_${botId}`, messages);
  },

  /** User accounts */
  getUser(username) {
    return this.get(`user_${username.toLowerCase()}`);
  },

  saveUser(user) {
    return this.set(`user_${user.username.toLowerCase()}`, user);
  },

  /** Session */
  getSession() {
    return this.get("session");
  },

  saveSession(user) {
    return this.set("session", user);
  },

  clearSession() {
    return this.remove("session");
  },
};
