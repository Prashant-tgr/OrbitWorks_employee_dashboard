import { useState } from "react";
import {
  BarChart3,
  Bell,
  Sun,
  Moon,
  Command,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { employees } from "../data/employees";

export function Avatar({ person = employees[0], size = "" }) {
  return (
    <div className={`avatar ${size}`} style={{ background: person.color }}>
      {person.initials}
    </div>
  );
}

const links = [
  ["/", "Landing page", Home],
  ["/dashboard", "Overview", LayoutDashboard],
  ["/assistant", "AI Assistant", Sparkles],
  ["/directory", "Employee Directory", Users],
  ["/analytics", "Analytics", BarChart3],
  ["/settings", "Settings", Settings],
];

export default function Layout({ children, path, navigate, theme, setTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Command size={21} />
          </div>

          <b>
            orbit<span>works</span>
          </b>

          <button
            className="close-menu"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="main-nav">
          {links.map(([href, label, Icon]) => (
            <button
              key={href}
              className={path === href ? "active" : ""}
              onClick={() => {
                navigate(href);
                setOpen(false);
              }}
            >
              <Icon size={19} />

              <span>{label}</span>

              {label === "AI Assistant" && <em>New</em>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="workspace">
            <div className="workspace-logo">O</div>

            <span>
              <b>Orbit Inc.</b>
              <small>Enterprise plan</small>
            </span>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>

          <div className="topbar-title">
            <h1>{children.props.title}</h1>
            <p>{children.props.subtitle}</p>
          </div>

          <div className="top-actions">
            {/* Mobile/tablet theme control */}

            <button
              className="theme-switch"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <span>
                {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
              </span>

              <b>{theme === "dark" ? "Dark" : "Light"} mode</b>

              <i className={theme === "dark" ? "on" : ""} />
            </button>

            <button className="icon-button">
              <Bell size={19} />
            </button>

            <Avatar />

            <span className="user-mini">Olivia Chen</span>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
