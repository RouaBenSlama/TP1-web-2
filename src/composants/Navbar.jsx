import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase";
import "./Navbar.css";
import { useUserStore } from "../UserStore";

const Navbar = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const { currentUser } = useUserStore();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                // Redirect the user to the login page after logging out
                navigate("/connexion");
            })
            .catch((error) => {
                console.error("Erreur lors de la déconnexion : ", error);
            });
    };

    return (
        <div className="navbar-container">
            <nav className="navbar">
                {/* Profile section */}
                <div className="navbar-profile" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                    <Link to="/profile">
                        <img
                            src={currentUser ? currentUser.avatar : "/40.png"}
                            alt="Profile"
                            className="profile-icon"
                        />
                    </Link>
                    {/* Conditionally render email if currentUser is not null */}
                    {currentUser ? <h2>{currentUser.email}</h2> : <h2>Loading...</h2>}

                    {dropdownOpen && (
                        <div className="navbar-dropdown">
                            <Link to="/profile" className="navbar-item">Mon Profil</Link>
                            <Link to="/settings" className="navbar-item">Paramètres</Link>
                            <hr className="navbar-divider" />
                            <button onClick={handleLogout} className="navbar-item">Déconnexion</button>
                        </div>
                    )}
                </div>

                {/* Navigation items */}
                <div className="navbar-items">
                    <Link to="/contacts" className="navbar-link">Contacts</Link>
                    <Link to="/dashboard" className="navbar-link">Chat</Link>
                </div>

                {/* Logout button */}
                <div className="logout-container">
                    <button onClick={handleLogout} className="logout-button">Déconnexion</button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
