import React from "react";
import "./Dashboard.css";

function AcademicCalendar() {
  const events = [
    { date: "August 15", event: "Fall Semester Begins" },
    { date: "October 15-20", event: "Mid-Term Examinations" },
    { date: "November 25-28", event: "Thanksgiving Break" },
    { date: "December 10", event: "Last Day of Classes" },
    { date: "December 15-22", event: "Final Examinations" },
  ];

  return (
    <div className="dashboard-container" style={{ maxWidth: "800px" }}>
      <header className="dashboard-header">
        <h1>Academic Calendar</h1>
        <p>Important dates for the academic year.</p>
      </header>

      <div style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", color: "#333" }}>
              <th style={{ padding: "15px", borderBottom: "2px solid #ddd" }}>Date</th>
              <th style={{ padding: "15px", borderBottom: "2px solid #ddd" }}>Event</th>
            </tr>
          </thead>
          <tbody>
            {events.map((item, idx) => (
              <tr key={idx}>
                <td style={{ padding: "15px", borderBottom: "1px solid #eee", fontWeight: "bold", color: "#4a90e2" }}>{item.date}</td>
                <td style={{ padding: "15px", borderBottom: "1px solid #eee", color: "#555" }}>{item.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AcademicCalendar;
