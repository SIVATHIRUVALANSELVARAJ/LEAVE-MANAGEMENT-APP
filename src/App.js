import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";

import "./App.css";

import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import LeaveForm from "./pages/LeaveForm";
import LeaveList from "./pages/LeaveList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import AcademicCalendar from "./pages/AcademicCalendar";
import OnDuty from "./pages/OnDuty";
import Notifications from "./pages/Notifications";


function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="app-wrapper">
      {user && (
        <nav className="navbar">
          <div className="nav-left">
            <h2 className="logo">Academic Portal</h2>
            <span style={{ fontSize: "12px", color: "#888", display: "block", marginTop: "2px" }}>
              Manage your academic activities in one place.
            </span>
          </div>

          <div className="nav-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Notifications
            </NavLink>


          </div>

          <div className="nav-right">
            <span className="user-badge">{user.role}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      )}

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.role === "teacher" ? <TeacherDashboard user={user} /> : <StudentDashboard user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/apply" element={user ? <LeaveForm user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/list" element={user ? <LeaveList user={user} /> : <Navigate to="/login" replace />} />

          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/attendance" element={user ? <Attendance user={user} /> : <Navigate to="/login" replace />} />

          <Route path="/calendar" element={user ? <AcademicCalendar user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/onduty" element={user ? <OnDuty user={user} /> : <Navigate to="/login" replace />} />
          <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" replace />} />


        </Routes>
      </main>
    </div>
  );
}

export default App;
