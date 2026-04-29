import { Link } from "react-router-dom";
import "./Dashboard.css";

function TeacherDashboard({ user }) {
  const modules = [
    { title: "Manage Attendance", link: "/attendance" },
    { title: "Leave Requests", link: "/list" },
    { title: "OD Requests", link: "/onduty" },
    { title: "Academic Calendar", link: "/calendar" },
    { title: "Notifications", link: "/notifications" },

  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, Professor {user?.username}</h1>
        <p>Manage your Academic Portal activities below.</p>
      </header>

      <div className="module-grid">
        {modules.map((mod, index) => (
          <Link to={mod.link} key={index} className="module-card">
            <h3>{mod.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TeacherDashboard;
