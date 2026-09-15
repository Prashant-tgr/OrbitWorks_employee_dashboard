import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import AssistantPage from "./pages/AssistantPage";
import DirectoryPage from "./pages/DirectoryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

const routes = {
  "/": LandingPage,
  "/dashboard": DashboardPage,
  "/assistant": AssistantPage,
  "/directory": DirectoryPage,
  "/analytics": AnalyticsPage,
  "/settings": SettingsPage,
  "/contact": ContactPage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/admin": AdminPage,
};

function AppContent() {
  const { user, loading } = useAuth();
  const [path, setPath] = useState(() =>
    routes[location.pathname] ? location.pathname : "/",
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("orbit-theme") || "light",
  );

  useEffect(() => {
    const update = () =>
      setPath(routes[location.pathname] ? location.pathname : "/");
    addEventListener("popstate", update);
    return () => removeEventListener("popstate", update);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("orbit-theme", theme);
  }, [theme]);

  const navigate = (to) => {
    history.pushState({}, "", to);
    setPath(to);
    scrollTo({ top: 0, behavior: "smooth" });
  };

  const publicRoutes = ["/", "/login", "/register", "/contact"];
  const isPublicRoute = publicRoutes.includes(path);

  // If initial auth session is still checking, show subtle loading state
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg, #f8f8fc)" }}>
        <div style={{ color: "var(--purple, #7659ea)", fontWeight: 600, fontFamily: "sans-serif" }}>
          Loading Orbit Works...
        </div>
      </div>
    );
  }

  // Route Protection: Unauthenticated users cannot view dashboard or protected pages without login
  if (!user && !isPublicRoute) {
    return <LoginPage {...{ navigate, theme, setTheme }} />;
  }

  const Current = routes[path] || LandingPage;

  // Standalone pages outside main sidebar layout
  if (path === "/" || path === "/login" || path === "/register") {
    return <Current {...{ navigate, theme, setTheme }} />;
  }

  // Application pages inside main dashboard layout (protected or contact)
  return (
    <Layout {...{ path, navigate, theme, setTheme }}>
      <Current {...{ navigate, theme, setTheme }} />
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
