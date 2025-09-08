import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./Login";
import Register from "./Register";
import "./styles/Auth.css";

const AuthWrapper = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left side image animation */}
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200 }}
              transition={{ duration: 0.6 }}
              className="auth-image login-image"
            />
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200 }}
              transition={{ duration: 0.6 }}
              className="auth-image register-image"
            />
          )}
        </AnimatePresence>

        {/* Right side form animation */}
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ duration: 0.6 }}
              className="auth-form"
            >
              <Login onLogin={onLogin} onSwitch={() => setIsLogin(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="register-form"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ duration: 0.6 }}
              className="auth-form"
            >
              <Register onSwitch={() => setIsLogin(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthWrapper;
