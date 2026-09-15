import { Mic, Send, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Page from "../components/Page";
import { askGemini } from "../services/gemini";

const initial = [
  {
    from: "ai",
    text: "Hi Olivia! I’m Orbit, your Gemini-powered work assistant. What can I help you make progress on today?",
    time: "Now",
  },
];
const prompts = [
  "Summarize my schedule",
  "Draft a team update",
  "What needs my attention?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orbit-chat")) || initial;
    } catch {
      return initial;
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryStatus, setRetryStatus] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const end = useRef();
  const recognitionRef = useRef(null);
  useEffect(() => {
    localStorage.setItem("orbit-chat", JSON.stringify(messages));
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, retryStatus]);

  async function send(text = input) {
    if (!text.trim() || loading) return;
    const question = text.trim(),
      history = messages.slice(-8);
    setMessages((current) => [
      ...current,
      { from: "user", text: question, time: "Just now" },
    ]);
    setInput("");
    setLoading(true);
    setRetryStatus("");
    try {
      const reply = await askGemini(
        question,
        history,
        ({ attempt, maxRetries, delay }) =>
          setRetryStatus(
            `Gemini is busy — retrying ${attempt}/${maxRetries} in ${Math.ceil(delay / 1000)}s…`,
          ),
      );
      setMessages((current) => [
        ...current,
        { from: "ai", text: reply, time: "Just now" },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          from: "ai",
          text: `I’m sorry — ${error.message} Please try again in a moment.`,
          time: "Just now",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
      setRetryStatus("");
    }
  }
  function clearHistory() {
    if (loading) return;
    setMessages(initial);
    localStorage.setItem("orbit-chat", JSON.stringify(initial));
  }
  const voiceInput = () => {
    if (listening) {
      recognitionRef.current?.abort();
      return;
    }
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceStatus("Voice input is not supported by this browser.");
      return;
    }
    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setListening(true);
      setVoiceStatus("Listening… speak your question now.");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript.trim();
      if (!transcript) return;
      setInput(transcript);
      setVoiceStatus("Voice captured — asking Gemini…");
      void send(transcript);
    };
    recognition.onerror = (event) => {
      const errors = {
        not_allowed: "Microphone permission was denied.",
        no_speech: "I could not hear anything. Please try again.",
        audio_capture: "No microphone was found.",
        network: "Speech recognition network error. Please try again.",
      };
      setVoiceStatus(
        errors[event.error] || "Voice input could not start. Please try again.",
      );
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    try {
      recognition.start();
    } catch {
      setVoiceStatus("Voice input is already starting. Please try again.");
    }
  };
  return (
    <Page
      title="AI Assistant"
      subtitle="Your always-on partner for more productive work."
    >
      <div className="chat-shell chat-page">
        <div className="chat-head">
          <div className="orbit-avatar">
            <Sparkles size={20} />
          </div>
          <div>
            <b>Orbit Assistant</b>
            <p>
              <i /> Gemini AI · ready to help
            </p>
          </div>
          <button
            className="chat-clear"
            disabled={loading}
            onClick={clearHistory}
            title="Clear chat history"
            aria-label="Clear chat history"
            type="button"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div className="messages">
          {messages.map((message, index) => (
            <div
              className={`message ${message.from}`}
              key={`${message.time}-${index}`}
            >
              {message.from === "ai" && (
                <div className="bot-small">
                  <Sparkles size={14} />
                </div>
              )}
              <div>
                <div className={`bubble ${message.error ? "error" : ""}`}>
                  {message.text}
                </div>
                <small>{message.time}</small>
              </div>
            </div>
          ))}
          {loading && (
            <div className="message ai">
              <div className="bot-small">
                <Sparkles size={14} />
              </div>
              <div>
                <div className="bubble typing">
                  <i />
                  <i />
                  <i />
                </div>
                {retryStatus && (
                  <small className="retry-status">{retryStatus}</small>
                )}
              </div>
            </div>
          )}
          <div ref={end} />
        </div>
        <div className="suggestions">
          {prompts.map((prompt) => (
            <button
              disabled={loading || listening}
              onClick={() => send(prompt)}
              key={prompt}
            >
              {prompt}
            </button>
          ))}
        </div>
        {voiceStatus && (
          <div className={`voice-status ${listening ? "listening" : ""}`}>
            <span />
            <p>{voiceStatus}</p>
          </div>
        )}
        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <button
            className={`icon-button microphone ${listening ? "listening" : ""}`}
            disabled={loading}
            type="button"
            onClick={voiceInput}
            title={listening ? "Stop listening" : "Dictate your message"}
            aria-label={listening ? "Stop listening" : "Start voice input"}
          >
            <Mic size={19} />
          </button>
          <input
            disabled={loading || listening}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask Gemini anything…"
          />
          <button
            className="send"
            disabled={loading || listening}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="chat-foot">
          Gemini can make mistakes. Check important information.
        </p>
      </div>
    </Page>
  );
}
