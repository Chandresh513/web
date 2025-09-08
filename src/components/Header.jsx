import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import "../styles/header.css";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Simple redirect to login page
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">🎮 GameHub</div>
        <nav className="nav">
          <ul>
            <li>
              <ScrollLink
                to="hero"
                smooth={true}
                duration={600}
                offset={-80}
                className="nav-link"
              >
                Home
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="free"
                smooth={true}
                duration={600}
                offset={-80}
                className="nav-link"
              >
                Free Games
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="expensive"
                smooth={true}
                duration={600}
                offset={-80}
                className="nav-link"
              >
                Premium
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="about"
                smooth={true}
                duration={600}
                offset={-80}
                className="nav-link"
              >
                About
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                to="contact"
                smooth={true}
                duration={600}
                offset={-80}
                className="nav-link"
              >
                Contact
              </ScrollLink>
            </li><li>
               <li><Link className="nav-link" to="/store">Store</Link></li> {/* ✅ Store Nav */}
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
