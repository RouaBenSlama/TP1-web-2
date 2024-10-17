import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="navbar-container">
            <nav className="navbar">
                {/* Profile section */}
                <div className="navbar-profile" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Profile"
                        className="profile-icon"
                    />
                    {dropdownOpen && (
                        <div className="navbar-dropdown">
                            <Link to="/profile" className="navbar-item">Mon Profil</Link>
                            <Link to="/settings" className="navbar-item">Paramètres</Link>
                            <hr className="navbar-divider" />
                            <Link to="/logout" className="navbar-item">Déconnexion</Link>
                        </div>
                    )}
                </div>

                {/* Navigation items */}
                <div className="navbar-items">
                    <Link to="/contacts" className="navbar-link">Contacts</Link>
                    <Link to="/chat" className="navbar-link">Chat</Link>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
