import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./ProfilePage.css";
import { auth, storage } from "../Firebase";
import {
    updateEmail,
    updatePassword,
    updateProfile,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ProfilePage = () => {
    const [currentEmail, setCurrentEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [authError, setAuthError] = useState("");

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setCurrentEmail(user.email);
            setCurrentUser(user);
        }
    }, []);

    const handleNewEmailChange = (e) => setNewEmail(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
    const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
    const handleImageChange = (e) => setProfileImage(e.target.files[0]);

    const reauthenticateUser = async () => {
        if (!currentUser) return;

        const credential = EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
        );

        try {
            await reauthenticateWithCredential(currentUser, credential);
            console.log("Ré-authentification réussie");
        } catch (error) {
            console.error("Erreur lors de la ré-authentification :", error);
            throw new Error("Échec de la ré-authentification. Veuillez vérifier votre email et mot de passe actuels.");
        }
    };

    const handleUpdateProfile = async () => {
        try {
            await reauthenticateUser();

            // Mettre à jour l'email si un nouveau email est fourni
            if (newEmail) {
                await updateEmail(currentUser, newEmail);
                alert("Email mis à jour avec succès ! Veuillez vérifier votre nouvel email.");
            }

            // Mettre à jour le mot de passe si un nouveau mot de passe est fourni
            if (newPassword) {
                await updatePassword(currentUser, newPassword);
                alert("Mot de passe mis à jour avec succès !");
            }

            if (!newEmail && !newPassword) {
                alert("Aucune modification à apporter.");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour des informations :", error);
            setAuthError("Erreur lors de la mise à jour : " + error.message);
        }
    };

    const handleUpdateProfileImage = async () => {
        if (profileImage && currentUser) {
            try {
                const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
                const uploadTask = uploadBytesResumable(storageRef, profileImage);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {},
                    (error) => {
                        console.error("Erreur lors de l'upload de l'image : ", error);
                        setAuthError("Erreur lors de l'upload de l'image.");
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("Photo de profil mise à jour :", downloadURL);

                        await updateProfile(currentUser, {
                            photoURL: downloadURL,
                        });
                        alert("Photo de profil mise à jour avec succès !");
                    }
                );
            } catch (error) {
                console.error("Erreur lors de la mise à jour de la photo de profil :", error);
                setAuthError("Erreur lors de la mise à jour de la photo de profil.");
            }
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
            try {
                await reauthenticateUser();
                await deleteUser(currentUser);
                alert("Compte supprimé avec succès.");
                window.location.href = "/"; // Redirection après suppression
            } catch (error) {
                console.error("Erreur lors de la suppression du compte :", error);
                setAuthError("Erreur lors de la suppression du compte : " + error.message);
            }
        }
    };

    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-content">
                <h2>Mon Profil</h2>

                {authError && <div className="notification is-danger">{authError}</div>}

                <form className="profile-form">
                    <div className="form-group">
                        <label htmlFor="profileImage">Photo de profil :</label>
                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <button
                            type="button"
                            className="button is-link"
                            onClick={handleUpdateProfileImage}
                        >
                            Mettre à jour la photo
                        </button>
                    </div>

                    <div className="form-group">
                        <label htmlFor="currentEmail">Email actuel :</label>
                        <input
                            type="email"
                            id="currentEmail"
                            value={currentEmail}
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newEmail">Nouveau email (facultatif) :</label>
                        <input
                            type="email"
                            id="newEmail"
                            value={newEmail}
                            onChange={handleNewEmailChange}
                            placeholder="Entrez votre nouvel email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="currentPassword">Mot de passe actuel :</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={handleCurrentPasswordChange}
                            placeholder="Entrez votre mot de passe actuel"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">Nouveau mot de passe (facultatif) :</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            placeholder="Entrez un nouveau mot de passe"
                        />
                    </div>

                    <button
                        type="button"
                        className="button is-link"
                        onClick={handleUpdateProfile}
                    >
                        Enregistrer les modifications
                    </button>

                    <button
                        type="button"
                        className="button is-danger"
                        onClick={handleDeleteAccount}
                    >
                        Supprimer le compte
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
