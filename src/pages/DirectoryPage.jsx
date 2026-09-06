import {
  Building2,
  FileText,
  MoreHorizontal,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import Card from "../components/Card";
import Page from "../components/Page";
import { Avatar } from "../components/Layout";
import { employees } from "../data/employees";
export default function DirectoryPage() {
  const [query, setQuery] = useState(""),
    [department, setDepartment] = useState("All");
  const result = useMemo(
    () =>
      employees.filter(
        (e) =>
          (department === "All" || e.dept === department) &&
          `${e.name} ${e.role} ${e.email}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, department],
  );
  return (
    <Page
      title="Employee directory"
      subtitle="Find and connect with everyone across Orbit."
    >
      <div className="directory-tools">
        <div className="searchbox">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, teams, or roles"
          />
        </div>
        <div className="selectbox">
          <Building2 size={17} />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option>All</option>
            {[...new Set(employees.map((e) => e.dept))].map((dept) => (
              <option key={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="result-count">{result.length} people</p>
      {result.length ? (
        <div className="employee-grid">
          {result.map((person) => (
            <Card className="employee" key={person.email}>
              <div className="employee-top">
                <Avatar person={person} size="xl" />
                <button className="more">
                  <MoreHorizontal size={19} />
                </button>
              </div>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
              <span className="dept-pill">{person.dept}</span>
              <div className="email">
                <FileText size={15} />
                {person.email}
              </div>
              <button className="contact">Send message</button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="empty">
          <Users size={32} />
          <h3>No people found</h3>
          <p>Try adjusting your search or department filter.</p>
        </div>
      )}
    </Page>
  );
}
