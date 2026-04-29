import { useState } from "react";
import "./FormStyles.css";

function LeaveForm({ user }) {
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim() || !startDate || !endDate) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          reason,
          startDate,
          endDate,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to apply for leave");
      }

      alert("Leave applied successfully!");
      setReason("");
      setStartDate("");
      setEndDate("");

    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="glass-form">
        <h2 className="form-title">Apply for Leave</h2>

        <div className="input-group">
          <label>Reason for Leave</label>
          <input
            type="text"
            placeholder="e.g. Medical, Personal"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button type="submit" className="primary-btn">Submit Request</button>
      </form>
    </div>
  );
}

export default LeaveForm;
