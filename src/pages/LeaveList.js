import { useState, useEffect } from "react";
import "./Dashboard.css";

function LeaveList({ user }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`http://localhost:3000/leaves?role=${user.role}&username=${user.username}`);
      const data = await res.json();
      setLeaves(data);
      setLoading(false);
    } catch (err) {
      alert("Failed to fetch leaves");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3000/leaves/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert(`Leave ${status} successfully!`);
        fetchLeaves();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading leaves...</p>;

  return (
    <div className="dashboard-container" style={{ maxWidth: "800px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        {user.role === 'teacher' ? 'All Leave Requests' : 'My Leave Requests'}
      </h2>

      {leaves.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No leaves found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {leaves.map((leave) => (
            <div
              key={leave._id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>{leave.username}</h4>
                <p style={{ margin: "0 0 5px 0", color: "#666" }}><strong>Reason:</strong> {leave.reason}</p>
                <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "14px" }}>
                  {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                </p>
                <p style={{ margin: "0", fontWeight: "bold", color: leave.status === 'Approved' ? 'green' : leave.status === 'Rejected' ? 'red' : 'orange' }}>
                  Status: {leave.status}
                </p>
              </div>

              {user.role === 'teacher' && leave.status === 'Pending' && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                    style={{ background: "#2ecc71", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                    style={{ background: "#e74c3c", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LeaveList;
