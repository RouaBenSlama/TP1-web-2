import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase";
import "./Navbar.css";

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [courriel, setCourriel] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        // Récupérer les informations de l'utilisateur connecté
        const user = auth.currentUser;
        console.log(user)
        if (user) {
            setProfileImage(user.photoURL || "https://via.placeholder.com/40");
            setCourriel(user.email)
        }
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                // Rediriger l'utilisateur vers la page de connexion après la déconnexion
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
                            src={profileImage}
                            alt="Profile"
                            className="profile-icon"
                        />
                        <h4 id='courriel'>{courriel}</h4>
                    </Link>
                    {dropdownOpen && (
                        <div className="navbar-dropdown">
                            <Link to="/profile" className="navbar-item"> Mon Profil</Link>
                            <Link to="/settings" className="navbar-item">Paramètres</Link>
                            <hr className="navbar-divider" />
                            <button onClick={handleLogout} className="navbar-item">Déconnexion</button>
                        </div>
                    )}
                </div>

                {/* Navigation items */}
                <div className="navbar-items">
                    <Link to="/contacts" className="navbar-link"><i class="fas fa-address-book fa-lg" style={{marginRight: '5px'}}></i> Contacts</Link>
                    <Link to="/dashboard" className="navbar-link"><i class="fas fa-comment-dots fa-lg" style={{marginRight: '5px'}}></i> Chat</Link>
                </div>

                {/* Logout button */}
                <div className="logout-container">
                    <button onClick={handleLogout} className="logout-button">Déconnexion <i class="fas fa-arrow-right-from-bracket"></i></button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
