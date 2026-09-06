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
} from "lucide-react";
export default function LandingPage({ navigate, theme, setTheme }) {
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
            className="primary landing-cta"
            onClick={() => navigate("/dashboard")}
          >
            Open dashboard <ArrowRight size={16} />
          </button>
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
        <div>
          <button className="primary" onClick={() => navigate("/assistant")}>
            Meet Orbit AI <ArrowRight size={16} />
          </button>
          <button
            className="landing-text"
            onClick={() => navigate("/dashboard")}
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
        <button className="primary" onClick={() => navigate("/dashboard")}>
          Get started <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
}
