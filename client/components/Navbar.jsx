import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/navbar.css'
import { PiSignOutBold } from "react-icons/pi";
import { IoMdPersonAdd } from "react-icons/io";

function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignOut = () => {
    axios
      .post("http://localhost:8000/user/signout", {}, { withCredentials: true })
      .then(() => {
        navigate("/");
        setIsAuthenticated(false); // Reset authentication state
      })
      .catch((error) => console.error("Error signing out:", error));
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/user/verify", { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  },);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-link">
          Chatify
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="nav-items">
        {!isAuthenticated ? (
          <>
            <Link to="/user/signin" className="nav-link">
              Sign In
            </Link>
            <Link to="/user/signup" className="nav-link">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <button onClick={handleSignOut} className="sign-out-button">
              Sign Out<PiSignOutBold style={{
                fontSize: "22px",
                cursor: "pointer",
                
              }} />
            </button>
            <Link to="/createContact">
              <button className="add-contact-button">
                Add contact<IoMdPersonAdd style={{
                   fontSize: "22px",
                   cursor: "pointer",
                }}/>
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

