import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleMouseEnter = () => {
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        setDropdownOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/contacts" className="nav-link">Contacts</Link>
                <Link to="/chat" className="nav-link">Chat</Link>
            </div>
            <div className="navbar-right" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="profile-icon">
                    <img
                        src="https://via.placeholder.com/40" 
                        alt="Profile"
                    />
                </div>
                {dropdownOpen && (
                    <ul className="dropdown">
                        <li><Link to="/profile">Mon Profil</Link></li>
                        <li><Link to="/settings">Paramètres</Link></li>
                        <li><Link to="/logout">Déconnexion</Link></li>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
