import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import AssistantPage from "./pages/AssistantPage";
import DirectoryPage from "./pages/DirectoryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
const routes = {
  "/": LandingPage,
  "/dashboard": DashboardPage,
  "/assistant": AssistantPage,
  "/directory": DirectoryPage,
  "/analytics": AnalyticsPage,
  "/settings": SettingsPage,
};
export default function App() {
  const [path, setPath] = useState(() =>
      routes[location.pathname] ? location.pathname : "/",
    ),
    [theme, setTheme] = useState(
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
  const Current = routes[path] || LandingPage;
  if (path === "/") return <Current {...{ navigate, theme, setTheme }} />;
  return (
    <Layout {...{ path, navigate, theme, setTheme }}>
      <Current {...{ navigate, theme, setTheme }} />
    </Layout>
  );
}
