import React, { useState } from "react";
import Navbar from "./Navbar";
import "./ProfilePage.css";

const Profile = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState(null);

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleImageChange = (e) => setProfileImage(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique pour soumettre les modifications
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Profile Image:", profileImage);
    };

    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-content">
                <h2>Mon Profil</h2>
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label htmlFor="profileImage">Photo de profil :</label>
                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email :</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Entrez votre email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe :</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Entrez un nouveau mot de passe"
                            required
                        />
                    </div>
                    <button type="submit" className="save-button">Enregistrer</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
