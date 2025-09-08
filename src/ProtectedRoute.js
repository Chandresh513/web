import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {}
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute;
