import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./FormStyles.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    pageLoaded();
  }, []);

  function pageLoaded() {
    
  }

  function validateForm() {
    let valid = true;
    let newErrors = {};

    let namePattern = /^[A-Za-z]{3,}$/;

    if (!namePattern.test(username)) {
      newErrors.nameError = "Invalid name";
      valid = false;
    }

    if (password.length < 6) {
      newErrors.passwordError = "Min 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful. Please login.");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSignup} className="glass-form">
        <h2 className="form-title">Student Course Registration</h2>

        <div className="input-group">
          <label>Name:</label>
          <input
            id="name"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span id="nameError" style={{ color: 'red', fontSize: '12px' }}>{errors.nameError}</span>
        </div>

        <div className="input-group">
          <label>Password:</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span id="passwordError" style={{ color: 'red', fontSize: '12px' }}>{errors.passwordError}</span>
        </div>

        <div className="input-group">
          <label>Account Type:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Staff</option>
          </select>
        </div>

        <button type="submit" className="primary-btn">Register</button>

        <p className="form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
