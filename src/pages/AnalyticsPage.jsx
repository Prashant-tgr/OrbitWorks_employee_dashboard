import { Building2, Clock3, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../components/Card";
import Page from "../components/Page";
import { activity, departments } from "../data/employees";
export default function AnalyticsPage() {
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const renderActiveShape = (props) => {
        const {
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        } = props;

        // Push the selected slice slightly outward
        const RADIAN = Math.PI / 180;
        const lift = 5;

        const dx = Math.cos(-midAngle * RADIAN) * lift;
        const dy = Math.sin(-midAngle * RADIAN) * lift;

        return (
        <g
            transform={`translate(${dx}, ${dy})`}
            style={{
            filter: `drop-shadow(0 6px 7px ${fill}55)`,
            }}
        >
            <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius + 5}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
            style={{ outline: "none" }}
            />
        </g>
        );
    };



  return (
    <Page
      title="People analytics"
      subtitle="A clear picture of your team and workplace."
    >
      <div className="stats">
        {[
          ["142", "Total employees", Users],
          ["128", "Active employees", Clock3],
          ["8", "Departments", Building2],
          ["12", "New this month", Sparkles],
        ].map(([n, l, Icon], i) => (
          <Card className="stat" key={l}>
            <div className={`stat-icon i${i}`}>
              <Icon size={19} />
            </div>
            <div>
              <b>{n}</b>
              <span>{l}</span>
            </div>
          </Card>
        ))}
      </div>
      <div className="analytics-grid">
        <Card className="chart-card">
          <div className="section-title">
            <div>
              <h3>Team growth</h3>
              <p>New employees joined this year</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={activity}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#7659ea" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="pie-card">
          <div className="section-title">
            <div>
              <h3>Department mix</h3>
              <p>People by team</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={departments}
                dataKey="value"
                innerRadius={58}
                outerRadius={86}
                paddingAngle={4}
                activeIndex={
                    selectedDepartment !== null ? departments.findIndex(
                        (d) => d.name ===selectedDepartment
                    ) : undefined
                }
                activeShape={renderActiveShape}
                onClick={(data) => {
                    setSelectedDepartment(
                    data?.name === selectedDepartment ? null : data?.name
                    );
                }}

              >
                {departments.map((d) => (
                  <Cell fill={d.color} key={d.name}  style={{outline: "none", cursor: "pointer"}}/>
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend">
            {departments.map((d) => (
                <button
                key={d.name}
                className={selectedDepartment === d.name ? "selected" : ""}
                onClick={() =>
                    setSelectedDepartment(
                    selectedDepartment === d.name ? null : d.name
                    )
                }
                >
                <i style={{ background: d.color }} />
                {d.name}
                <b>{d.value}%</b>
                </button>
            ))}
            </div>
        </Card>
      </div>
    </Page>
  );
}