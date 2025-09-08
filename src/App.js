import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthWrapper from "./AuthWrapper";
import Register from "./Register";
import Home from "./Home/Home";
import AdminDashboard from "./Home/AdminDashboard";
import './styles/Auth.css'
import GameDetail from "./Home/GameDetail";
import Store from "./components/Store"; // adjust path



function App() {
  // Keep a very light auth state here (synced with localStorage)
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("gh_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const isAdmin = useMemo(
    () => user && user.email === "admin@gmail.com",
    [user]
  );

  const handleLogin = (u) => {
    setUser(u);
    try {
      localStorage.setItem("gh_user", JSON.stringify(u));
    } catch { }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem("gh_user");
    } catch { }
  };

  // optional: keep user in sync if another tab logs out
  useEffect(() => {
    const onStorage = () => {
      try {
        const raw = localStorage.getItem("gh_user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch { }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<AuthWrapper onLogin={handleLogin} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<AuthWrapper onLogin={handleLogin} />} />
<Route path="/store" element={<Store />} />
      <Route path="/home" element={<Home />} />
      <Route
        path="/admindashboard"
        element={<AdminDashboard onLogout={handleLogout} />}
      />
      <Route path="/game/:id" element={<GameDetail />} />
    </Routes>
  );
}

export default App;
