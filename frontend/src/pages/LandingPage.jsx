import { useState } from "react";
import {
  ArrowRight,
  Bot,
  ChartNoAxesCombined,
  MessageSquare,
  Moon,
  ShieldCheck,
  Sparkles,
  Command,
  Sun,
  Users,
  FileText,
  LogIn,
  LogOut,
  Mail,
} from "lucide-react";
import QuoteModal from "../components/QuoteModal";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function LandingPage({ navigate, theme, setTheme }) {
  const { user, logout, isAdmin } = useAuth();
  const [quoteOpen, setQuoteOpen] = useState(false);

  const features = [
    [
      Bot,
      "AI work companion",
      "Get instant help with planning, writing, and daily priorities.",
    ],
    [
      Users,
      "Connected teams",
      "Find the right teammate and make collaboration effortless.",
    ],
    [
      ChartNoAxesCombined,
      "Clear insights",
      "Understand your workforce with simple, useful analytics.",
    ],
    [
      ShieldCheck,
      "Thoughtful by design",
      "Built around focus, privacy, and a calm workday.",
    ],
  ];

  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="brand">
          <div className="brand-mark">
            <Command size={21} />
          </div>
          <b>
            orbit<span>works</span>
          </b>
        </div>
        <div className="landing-actions">
          <button
            className="landing-theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>

          <button
            className="landing-theme"
            onClick={() => navigate("/contact")}
            title="Contact Us"
          >
            <Mail size={16} />
            <span>Contact</span>
          </button>

          {user ? (
            <>
              {isAdmin && (
                <button
                  className="landing-theme"
                  onClick={() => navigate("/admin")}
                  style={{ color: "var(--purple)", borderColor: "var(--purple)" }}
                >
                  <ShieldCheck size={16} />
                  <span>Admin</span>
                </button>
              )}
              <button
                className="landing-theme"
                onClick={logout}
                title="Logout"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
              <button
                className="primary landing-cta"
                onClick={() => navigate("/dashboard")}
              >
                Open dashboard <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                className="landing-theme"
                onClick={() => navigate("/login")}
              >
                <LogIn size={16} />
                <span>Sign in</span>
              </button>
              <button
                className="primary landing-cta"
                onClick={() => navigate("/login")}
              >
                Sign in <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      </header>

      <section className="landing-hero">
        <span className="eyebrow">
          <Sparkles size={14} /> THE INTELLIGENT WORKPLACE
        </span>
        <h1>
          Work, made more
          <br />
          <i>human.</i>
        </h1>
        <p>
          Orbit brings your people, priorities, and AI assistant into one calm
          workspace.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
          <button
            className="primary"
            onClick={() => navigate(user ? "/assistant" : "/login")}
          >
            Meet Orbit AI <ArrowRight size={16} />
          </button>
          <button
            className="secondary"
            onClick={() => setQuoteOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <FileText size={16} />
            Get a Free Quote
          </button>
          <button
            className="landing-text"
            onClick={() => navigate(user ? "/dashboard" : "/login")}
          >
            Explore the workspace
          </button>
        </div>
        <div className="landing-orb">
          <div />
          <div />
          <div />
          <span>
            <Sparkles size={34} />
          </span>
          <b>
            <MessageSquare size={15} /> I can help with that
          </b>
        </div>
      </section>

      <section className="feature-section">
        <div>
          <span className="eyebrow">BUILT FOR BETTER WORK</span>
          <h2>
            Everything your team
            <br />
            needs to move forward.
          </h2>
        </div>
        <div className="landing-features">
          {features.map(([Icon, title, text]) => (
            <article key={title}>
              <span>
                <Icon size={21} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-banner">
        <div>
          <span className="eyebrow">START TODAY</span>
          <h2>One workspace. More momentum.</h2>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            className="secondary"
            onClick={() => setQuoteOpen(true)}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              color: "#fff",
              borderColor: "rgba(255, 255, 255, 0.3)",
            }}
          >
            Get a Free Quote
          </button>
          <button
            className="primary"
            onClick={() => navigate(user ? "/dashboard" : "/login")}
          >
            {user ? "Go to dashboard" : "Sign in to get started"} <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <Footer navigate={navigate} />

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
