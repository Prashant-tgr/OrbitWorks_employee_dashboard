const endpoint =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent";
const maxRetries = 3;
const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
const isRetryable = (status) =>
  status === 408 || status === 429 || status >= 500;

export async function askGemini(prompt, history = [], onRetry = () => {}) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key)
    throw new Error(
      "Add VITE_GEMINI_API_KEY to your .env file to enable Gemini.",
    );
  const contents = [
    ...history.map((m) => ({
      role: m.from === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
    { role: "user", parts: [{ text: prompt }] },
  ];
  const payload = {
    systemInstruction: {
      parts: [
        {
          text: "You are Orbit, a concise, warm workplace assistant for employees.",
        },
      ],
    },
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
  };
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${endpoint}?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        const error = new Error(
          detail?.error?.message || "Gemini is unavailable right now.",
        );
        error.status = response.status;
        error.retryAfter = response.headers.get("retry-after");
        throw error;
      }
      const data = await response.json(),
        text = data.candidates?.[0]?.content?.parts
          ?.map((p) => p.text)
          .join("");
      if (!text) throw new Error("Gemini returned an empty response.");
      return text;
    } catch (error) {
      const retryable = error.status === undefined || isRetryable(error.status);
      if (!retryable || attempt === maxRetries) throw error;
      const serverDelay = Number(error.retryAfter) * 1000;
      const delay =
        Number.isFinite(serverDelay) && serverDelay > 0
          ? serverDelay
          : 1000 * 2 ** attempt + Math.floor(Math.random() * 300);
      onRetry({ attempt: attempt + 1, maxRetries, delay });
      await wait(delay);
    }
  }
}
