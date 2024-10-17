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
            <nav className="navbar is-flex is-flex-direction-column is-justify-content-space-between">
                <div>
                    <div className="navbar-item">
                        <Link to="/" className="navbar-link">Home</Link>
                    </div>
                    <div className="navbar-item">
                        <Link to="/contacts" className="navbar-link">Contacts</Link>
                    </div>
                    <div className="navbar-item">
                        <Link to="/chat" className="navbar-link">Chat</Link>
                    </div>
                </div>

                {/* Profile section pinned at the bottom */}
                <div className="navbar-item profile-section" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                    <div className="profile-icon">
                        <img
                            src="https://via.placeholder.com/40"
                            alt="Profile"
                            className="is-rounded"
                        />
                    </div>
                    {dropdownOpen && (
                        <div className="navbar-dropdown is-active">
                            <Link to="/profile" className="navbar-item">Mon Profil</Link>
                            <Link to="/settings" className="navbar-item">Paramètres</Link>
                            <hr className="navbar-divider" />
                            <Link to="/logout" className="navbar-item">Déconnexion</Link>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
