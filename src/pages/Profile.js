import React, { useState } from "react";
import "./Dashboard.css";

function Profile({ user }) {
  const [profileImg, setProfileImg] = useState(null);

  const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234a90e2"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

  function display(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        setProfileImg(event.target.result);
      };
      reader.readAsDataURL(file);
      uploadFile(file);
    }
  }

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", user.username);

    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Profile image updated");
      }
    } catch (err) {
      console.error(err);
    }
  }

  const currentImg = profileImg || (user?.profileImg ? `http://localhost:3000/uploads/${user.profileImg}` : defaultAvatar);

  return (
    <div style={{ padding: "40px 20px", display: "flex", justifyContent: "center" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", textAlign: "center", width: "100%", maxWidth: "400px", border: "1px solid #f0f0f0" }}>
        <div style={{ position: "relative", width: "150px", height: "150px", margin: "0 auto 25px" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: "4px solid #4a90e2", padding: "5px", background: "#f8f9fa" }}>
            <img
              id="displayImage"
              src={currentImg}
              alt=""
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
          <label htmlFor="fileInput" style={{ position: "absolute", bottom: "5px", right: "5px", background: "#4a90e2", color: "white", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", boxShadow: "0 4px 12px rgba(74, 144, 226, 0.4)", border: "3px solid white" }}>
            +
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={display}
            accept="image/*"
          />
        </div>

        <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#2c3e50", margin: "0" }}>{user?.username}</h2>
        <div style={{ display: "inline-block", padding: "6px 16px", background: "#eef5ff", color: "#4a90e2", borderRadius: "20px", fontSize: "14px", fontWeight: "700", marginTop: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
          {user?.role}
        </div>

        <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #eee", textAlign: "left" }}>
          <p style={{ margin: "10px 0", color: "#666" }}><strong>Status:</strong> Active</p>
          <p style={{ margin: "10px 0", color: "#666" }}><strong>ID:</strong> {user?.username?.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}


export default Profile;
