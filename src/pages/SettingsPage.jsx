import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import Card from "../components/Card";
import Page from "../components/Page";
import { Avatar } from "../components/Layout";
export default function SettingsPage({ theme, setTheme }) {
  const [saved, setSaved] = useState(false);
  return (
    <Page
      title="Profile settings"
      subtitle="Manage your account and preferences."
    >
      <Card className="settings-card">
        <div className="section-title">
          <div>
            <h3>Personal information</h3>
            <p>Update the details visible to your teammates.</p>
          </div>
        </div>
        <div className="profile-line">
          <Avatar size="xl" />
          <button className="secondary">Change photo</button>
          <button className="bare">Remove</button>
        </div>
        <form
          className="profile-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
        >
          <label>
            Full name
            <input defaultValue="Olivia Chen" />
          </label>
          <label>
            Email address
            <input defaultValue="olivia.chen@orbit.com" type="email" />
          </label>
          <label>
            Role
            <input defaultValue="Product Designer" />
          </label>
          <label>
            Department
            <select defaultValue="Design">
              <option>Design</option>
              <option>Engineering</option>
              <option>Marketing</option>
            </select>
          </label>
          <button className="primary">
            {saved ? "Saved!" : "Save changes"}
          </button>
        </form>
      </Card>
      <Card className="settings-card preference">
        <div>
          <h3>Appearance</h3>
          <p>Choose how Orbit looks for you.</p>
        </div>
        <button
          className="appearance"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <span>
            {theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}
          </span>
          <b>{theme === "dark" ? "Dark mode" : "Light mode"}</b>
          <i className={theme === "dark" ? "on" : ""} />
        </button>
      </Card>
      <Card className="settings-card preference">
        <div>
          <h3>Notifications</h3>
          <p>Receive a daily focus summary every morning.</p>
        </div>
        <label className="toggle">
          <input type="checkbox" defaultChecked />
          <i />
        </label>
      </Card>
    </Page>
  );
}
