import { Link } from "react-router-dom";
import "./Dashboard.css";

function StudentDashboard({ user }) {
  const modules = [
    { title: "Profile", link: "/profile" },
    { title: "Attendance", link: "/attendance" },
    { title: "Apply Leave", link: "/apply" },
    { title: "My Leaves", link: "/list" },
    { title: "Apply OD", link: "/onduty" },
    { title: "Notifications", link: "/notifications" },

  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
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

export default StudentDashboard;
