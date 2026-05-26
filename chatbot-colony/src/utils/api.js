const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

/**
 * Send messages to a bot and get a reply.
 * @param {string} system - The bot's system prompt
 * @param {Array}  messages - Array of {role, content} objects
 * @returns {Promise<string>} - The bot's reply text
 */
export async function askBot(system, messages) {
  if (!API_KEY || API_KEY === "your_api_key_here") {
    throw new Error("NO_API_KEY");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: system },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "No response received.";
}
