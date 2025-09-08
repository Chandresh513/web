import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin, onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();

      if (res.ok) {
        setMessage("✅ Login successful!");
        if (onLogin) onLogin({ email, password });

        setTimeout(() => {
          if (email === "admin@gmail.com") {
            navigate("/AdminDashboard"); // ✅ admin goes to dashboard
          } else {
            navigate("/home"); // ✅ normal user goes to home
          }
        }, 800);
      } else {
        setMessage(`❌ ${text}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>

      {message && <p>{message}</p>}

      <div className="switch-link">
        <span>
          Don’t have an account?{" "}
          <span onClick={onSwitch} className="switch-btn">
            Register here
          </span>
        </span>
      </div>
    </form>
  );
};

export default Login;
