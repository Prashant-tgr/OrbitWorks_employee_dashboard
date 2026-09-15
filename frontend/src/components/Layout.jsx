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
  Mail,
  ShieldCheck,
  LogOut,
  LogIn,
} from "lucide-react";
import { employees } from "../data/employees";
import { useAuth } from "../context/AuthContext";

export function Avatar({ person = null, user = null, size = "" }) {
  if (user) {
    const initials = user.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "U";
    return (
      <div
        className={`avatar ${size}`}
        style={{ background: user.role === "admin" ? "#7c4dff" : "#5c6bc0", color: "#fff" }}
      >
        {initials}
      </div>
    );
  }

  const p = person || employees[0];
  return (
    <div className={`avatar ${size}`} style={{ background: p.color }}>
      {p.initials}
    </div>
  );
}

const baseLinks = [
  ["/", "Landing page", Home],
  ["/dashboard", "Overview", LayoutDashboard],
  ["/assistant", "AI Assistant", Sparkles],
  ["/directory", "Employee Directory", Users],
  ["/analytics", "Analytics", BarChart3],
  ["/contact", "Contact Us", Mail],
  ["/settings", "Settings", Settings],
];

export default function Layout({ children, path, navigate, theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  const navLinks = [...baseLinks];
  if (isAdmin) {
    navLinks.splice(6, 0, ["/admin", "Admin Portal", ShieldCheck]);
  }

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
          {navLinks.map(([href, label, Icon]) => (
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
              {label === "Admin Portal" && (
                <em style={{ background: "rgba(124, 77, 255, 0.15)", color: "var(--purple)" }}>
                  Admin
                </em>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="workspace">
            <div className="workspace-logo">O</div>

            <span>
              <b>Orbit Inc.</b>
              <small>{isAdmin ? "Admin Console" : "Enterprise plan"}</small>
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

            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>

            {user ? (
              <>
                <Avatar user={user} />
                <span className="user-mini" title={user.email}>
                  {user.name}
                  {user.role === "admin" && (
                    <span
                      style={{
                        marginLeft: "6px",
                        fontSize: "10px",
                        padding: "2px 6px",
                        background: "rgba(124, 77, 255, 0.15)",
                        color: "var(--purple)",
                        borderRadius: "4px",
                        fontWeight: 700,
                      }}
                    >
                      ADMIN
                    </span>
                  )}
                </span>
                <button
                  className="bare"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  title="Logout"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    cursor: "pointer",
                    color: "var(--muted)",
                    border: "1px solid var(--line)",
                    background: "var(--card)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  className="bare"
                  onClick={() => navigate("/login")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    color: "var(--purple)",
                    border: "1px solid var(--line)",
                    background: "var(--card)",
                  }}
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>
                <button
                  className="primary"
                  onClick={() => navigate("/register")}
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    borderRadius: "8px",
                  }}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
