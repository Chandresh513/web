import React, { useState } from "react";
import './styles/Auth.css'

const Register = ({ onSwitch }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await res.text();

      if (res.ok) {
        setMessage("✅ Registered successfully!");
        setName("");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          onSwitch(); // 👈 switch back to Login
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
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

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

      <button type="submit">Register</button>

      {message && <p>{message}</p>}

      <div className="switch-link">
        <span>
          Already have an account?{" "}
          <span onClick={onSwitch} className="switch-btn">
            Login here
          </span>
        </span>
      </div>
    </form>
  );
};

export default Register;
