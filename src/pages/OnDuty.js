import { useState, useEffect } from "react";
import "./Dashboard.css";

function OnDuty({ user }) {
  const [event, setEvent] = useState("");
  const [date, setDate] = useState("");
  const [odList, setOdList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [proofPreview, setProofPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => { fetchODs(); }, []);

  const fetchODs = async () => {
    try {
      const res = await fetch(`http://localhost:3000/od?role=${user.role}&username=${user.username}`);
      setOdList(await res.json());
    } catch (err) {
      alert("Failed to fetch OD requests");
    }
  };

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = function(event) {
        setProofPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event.trim() || !date || !selectedFile) {
      alert("Event name, date, and proof file are required");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("event", event);
    formData.append("date", date);
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:3000/od", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("OD request submitted successfully with proof!");
        setEvent(""); setDate(""); setProofPreview(null); setSelectedFile(null);
        fetchODs();
      } else {
        alert("Failed to submit");
      }
    } catch (err) {
      alert("Server error");
    }
    setSubmitting(false);
  };

  const handleStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3000/od/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        alert(`OD request ${status} successfully!`);
        fetchODs();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const statusColor = (s) =>
    s === "Approved" ? "green" : s === "Rejected" ? "red" : "orange";

  if (user?.role === "teacher") {
    return (
      <div className="dashboard-container" style={{ maxWidth: "850px" }}>
        <header className="dashboard-header">
          <h1>OD Requests (Staff View)</h1>
        </header>

        {odList.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>No OD requests found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {odList.map((od) => (
              <div key={od._id} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: "0 0 5px 0" }}>Student: {od.username}</h3>
                  <p><strong>Event:</strong> {od.event}</p>
                  <p>Date: {new Date(od.date).toLocaleDateString()}</p>
                  <p style={{ fontWeight: "bold", color: statusColor(od.status) }}>Status: {od.status}</p>
                  {od.proofFile && (
                    <a href={`http://localhost:3000/uploads/${od.proofFile}`} target="_blank" rel="noreferrer" style={{ color: "#4a90e2", fontSize: "14px", display: "block", marginTop: "10px" }}>View Proof</a>
                  )}
                </div>
                {od.status === "Pending" && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleStatus(od._id, "Approved")} style={{ background: "#2ecc71", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px" }}>Approve</button>
                    <button onClick={() => handleStatus(od._id, "Rejected")} style={{ background: "#e74c3c", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px" }}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ maxWidth: "650px" }}>
      <h1>Apply On Duty (OD)</h1>
      <form onSubmit={handleSubmit} style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
        <div className="input-group" style={{ marginBottom: '15px' }}>
          <label>Event Name</label>
          <input type="text" value={event} onChange={(e) => setEvent(e.target.value)} placeholder="e.g. Workshop, Symposium" style={{ width: "100%", padding: "10px" }} />
        </div>
        <div className="input-group" style={{ marginBottom: '15px' }}>
          <label>Event Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", padding: "10px" }} />
        </div>
        <div className="input-group" style={{ marginBottom: '15px' }}>
          <label>Upload Proof (Image)</label>
          <input type="file" onChange={handleFileChange} style={{ width: "100%", padding: "10px" }} />
          {proofPreview && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '12px', color: '#666' }}>Preview:</p>
              <img src={proofPreview} alt="Proof" style={{ width: "100px", borderRadius: "5px", border: "1px solid #ddd" }} />
            </div>
          )}
        </div>
        <button type="submit" disabled={submitting} style={{ width: "100%", padding: "12px", background: "#4a90e2", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          {submitting ? "Submitting..." : "Submit OD Request"}
        </button>
      </form>
      
      <h3 style={{ marginTop: '30px' }}>My OD Requests</h3>
      {odList.map((od) => (
        <div key={od._id} style={{ background: "white", padding: "15px", marginBottom: "10px", borderLeft: `5px solid ${statusColor(od.status)}`, borderRadius: "5px" }}>
          <p><strong>{od.event}</strong></p>
          <p>{new Date(od.date).toLocaleDateString()}</p>
          <p style={{ color: statusColor(od.status) }}>{od.status}</p>
        </div>
      ))}
    </div>
  );
}

export default OnDuty;
