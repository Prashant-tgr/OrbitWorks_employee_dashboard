import { ArrowUpRight, Building2, Clock3, Sparkles, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../components/Card";
import Page from "../components/Page";
import { Avatar } from "../components/Layout";
import { activity, employees } from "../data/employees";
export default function DashboardPage({ navigate }) {
  return (
    <Page
      title="Good morning, Olivia 👋"
      subtitle="Here’s what’s happening across your workspace today."
    >
      <div className="welcome">
        <div>
          <span className="eyebrow">
            <Sparkles size={14} /> YOUR AI WORKSPACE
          </span>
          <h2>
            Make work feel
            <br />
            <i>effortless.</i>
          </h2>
          <p>
            Meet Orbit, your intelligent teammate for the work that matters
            most.
          </p>
          <button className="primary" onClick={() => navigate("/assistant")}>
            Start a conversation <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="orb-wrap">
          <div className="orb o1" />
          <div className="orb o2" />
          <div className="orb o3" />
          <div className="orb-core">
            <Sparkles size={34} />
          </div>
        </div>
      </div>
      <div className="stats">
        {[
          ["142", "Total employees", Users],
          ["128", "Active today", Clock3],
          ["8", "Departments", Building2],
          ["89%", "Engagement", Sparkles],
        ].map(([n, l, Icon], i) => (
          <Card className="stat" key={l}>
            <div className={`stat-icon i${i}`}>
              <Icon size={19} />
            </div>
            <div>
              <b>{n}</b>
              <span>{l}</span>
            </div>
            <small className="trend">+12%</small>
          </Card>
        ))}
      </div>
      <div className="overview-grid">
        <Card className="chart-card">
          <div className="section-title">
            <div>
              <h3>Team activity</h3>
              <p>Active employees over the past 7 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={activity}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" fill="#7659ea" radius={[6, 6, 6, 6]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="today">
          <div className="section-title">
            <div>
              <h3>Today’s focus</h3>
              <p>Keep moving forward</p>
            </div>
          </div>
          {[
            "Review Q3 hiring plan",
            "Design sync with team",
            "Submit expense report",
          ].map((task, i) => (
            <div className="task" key={task}>
              <div className={`check ${i === 0 ? "checked" : ""}`}>
                {i === 0 && "✓"}
              </div>
              <span>{task}</span>
              <small>{["10:00 AM", "1:30 PM", "4:00 PM"][i]}</small>
            </div>
          ))}
        </Card>
      </div>
      <Card className="team-card">
        <div className="section-title">
          <div>
            <h3>People you work with</h3>
            <p>Recently active teammates</p>
          </div>
          <button
            className="text-button"
            onClick={() => navigate("/directory")}
          >
            View directory <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="people-row">
          {employees.slice(0, 5).map((p) => (
            <div className="person" key={p.email}>
              <Avatar person={p} size="large" />
              <b>{p.name}</b>
              <small>{p.role}</small>
              <span className="online" />
            </div>
          ))}
        </div>
      </Card>
    </Page>
  );
}