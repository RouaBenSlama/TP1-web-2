import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./ProfilePage.css";
import { auth, storage } from "../Firebase";
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ProfilePage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setEmail(user.email);
            setCurrentUser(user);
        }
    }, []);


    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleImageChange = (e) => setProfileImage(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            console.error("Utilisateur non authentifié");
            return;
        }

        try {
            // Mettre à jour l'email si celui-ci a changé
            if (email !== currentUser.email) {
                await updateEmail(currentUser, email);
                console.log("Email mis à jour :", email);
            }

            // Mettre à jour le mot de passe si un nouveau mot de passe a été fourni
            if (password) {
                await updatePassword(currentUser, password);
                console.log("Mot de passe mis à jour");
            }

            // Mettre à jour l'image de profil si un nouveau fichier a été sélectionné
            if (profileImage) {
                const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
                const uploadTask = uploadBytesResumable(storageRef, profileImage);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Progression de l'upload si nécessaire
                    },
                    (error) => {
                        console.error("Erreur lors de l'upload de l'image : ", error);
                    },
                    async () => {
                        // Récupérer l'URL de l'image après l'upload
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("Photo de profil mise à jour :", downloadURL);

                        // Mettre à jour le profil de l'utilisateur avec l'URL de la photo
                        await updateProfile(currentUser, {
                            photoURL: downloadURL,
                        });

                        alert("Profil mis à jour avec succès !");
                    }
                );
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            alert("Erreur lors de la mise à jour de votre profil.");
        }
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
                            placeholder="Entrez un nouveau mot de passe (facultatif)"
                        />
                    </div>
                    <button type="submit" className="save-button">Enregistrer</button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
