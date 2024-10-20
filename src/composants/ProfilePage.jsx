import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./ProfilePage.css";
import { useUserStore } from "../UserStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";

const ProfilePage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState(null);

    const {currentUser, isLoading, fetchUserInfo} = useUserStore()

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
            fetchUserInfo(user.uid)
        })

        return() =>{
            unSub()
        }
    }, [fetchUserInfo]);

    if(isLoading) return <div className="loading">Loading ...</div>

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleImageChange = (e) => setProfileImage(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to submit changes
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
                            value={email || (currentUser && currentUser.email) || ""}
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

export default ProfilePage;
