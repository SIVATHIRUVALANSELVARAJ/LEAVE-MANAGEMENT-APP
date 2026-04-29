import React from "react";
import "./Dashboard.css";

function Notifications() {
  const notifications = [
    { title: "Exam Schedule Released", date: "Oct 15", desc: "The mid-term exam schedule has been updated on the portal." },
    { title: "Holiday Announcement", date: "Oct 10", desc: "College will remain closed on Friday due to a public holiday." },
    { title: "Fee Payment Deadline", date: "Oct 05", desc: "Last date to pay the semester fee is October 20th." },
  ];

  return (
    <div className="dashboard-container" style={{ maxWidth: "800px" }}>
      <header className="dashboard-header">
        <h1>Notifications</h1>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {notifications.map((note, idx) => (
          <div key={idx} style={{ background: "white", padding: "20px", borderRadius: "10px", borderLeft: "5px solid #4a90e2", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <h3 style={{ margin: 0, color: "#333" }}>{note.title}</h3>
              <span style={{ color: "#888", fontSize: "14px" }}>{note.date}</span>
            </div>
            <p style={{ margin: 0, color: "#666" }}>{note.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
