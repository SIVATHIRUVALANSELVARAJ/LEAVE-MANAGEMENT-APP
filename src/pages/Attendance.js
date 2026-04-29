import { useState, useEffect } from "react";
import "./Dashboard.css";

function Attendance({ user }) {
  const [students, setStudents] = useState([]);
  const [todayRecords, setTodayRecords] = useState({});
  const [attendanceStats, setAttendanceStats] = useState(null);

  useEffect(() => {
    if (user?.role === "teacher") {
      fetchStudents();
      fetchTodayRecords();
    } else {
      fetchMyAttendance();
    }
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:3000/students");
      setStudents(await res.json());
    } catch (err) {
      alert("Failed to fetch students");
    }
  };

  const fetchTodayRecords = async () => {
    try {
      const res = await fetch("http://localhost:3000/attendance/today");
      const data = await res.json();
      const map = {};
      data.forEach(r => { map[r.username] = r.status; });
      setTodayRecords(map);
    } catch (err) {
      alert("Failed to fetch today's records");
    }
  };

  const fetchMyAttendance = async () => {
    try {
      const res = await fetch(`http://localhost:3000/attendance/${user.username}`);
      setAttendanceStats(await res.json());
    } catch (err) {
      alert("Failed to fetch attendance");
    }
  };

  const markAttendance = async (username, status) => {
    try {
      await fetch("http://localhost:3000/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, status }),
      });
      setTodayRecords(prev => ({ ...prev, [username]: status }));
      alert(`Marked ${username} as ${status}`);
    } catch (err) {
      alert("Failed to mark attendance");
    }
  };



  function deleteRow(username) {
    setTodayRecords(prev => {
      const newMap = { ...prev };
      delete newMap[username];
      return newMap;
    });
    alert("Row deleted for " + username);
  }

  if (user?.role === "teacher") {
    return (
      <div className="dashboard-container" style={{ maxWidth: "800px" }}>
        <header className="dashboard-header">
          <h1>Manage Attendance</h1>
          <p>To create and delete a row from the table</p>
        </header>

        <table id="myTable" style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
          <thead>
            <tr>
              <th style={{ border: "2px solid black" }}>Roll No</th>
              <th style={{ border: "2px solid black" }}>Name</th>
              <th style={{ border: "2px solid black" }}>Class</th>
              <th style={{ border: "2px solid black" }}>Contact</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => {
              const status = todayRecords[s.username];
              return (
                <tr key={s.username}>
                  <td style={{ border: "2px solid black", padding: "10px" }}>{2500 + index}</td>
                  <td style={{ border: "2px solid black", padding: "10px" }}>{s.username}</td>
                  <td style={{ border: "2px solid black", padding: "10px", textAlign: "center" }}>
                    {status || "None"}
                  </td>
                  <td style={{ border: "2px solid black", padding: "10px", textAlign: "center" }}>
                    <button onClick={() => markAttendance(s.username, "Present")} style={{ marginRight: '5px' }}>Mark Present</button>
                    <button onClick={() => deleteRow(s.username)}>Delete Row</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

      </div>
    );
  }

  const pct = attendanceStats?.percentage ?? 0;
  return (
    <div className="dashboard-container" style={{ maxWidth: "600px" }}>
      <h1>My Attendance</h1>
      <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "10px" }}>
        <h2 style={{ fontSize: "48px", color: pct >= 75 ? "green" : "red" }}>{pct}%</h2>
        <p>Overall Attendance</p>
      </div>
    </div>
  );
}

export default Attendance;
