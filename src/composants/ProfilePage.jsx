import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./ProfilePage.css";
import { auth, storage } from "../Firebase";
import {
    updateEmail,
    updatePassword,
    sendEmailVerification,
    deleteUser,
    updateProfile,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ProfilePage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setEmail(user.email);
            setCurrentUser(user);
            setIsVerified(user.emailVerified);
        }
    }, []);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setAuthError(""); // Clear error when user starts typing
    };

    const reauthenticateUser = async () => {
        if (!currentPassword) {
            setAuthError("Veuillez entrer votre mot de passe actuel.");
            return;
        }
        const credential = EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
        );
        await reauthenticateWithCredential(currentUser, credential);
    };

    const handleUpdateEmail = async () => {
        if (currentUser) {
            try {
                await reauthenticateUser();
                await updateEmail(currentUser, newEmail);
                alert("Email mis à jour avec succès !");
            } catch (error) {
                setAuthError("Erreur lors de la mise à jour de l'email : " + error.message);
            }
        }
    };

    const handleUpdatePassword = async () => {
        if (currentUser) {
            try {
                await reauthenticateUser();
                await updatePassword(currentUser, newPassword);
                alert("Mot de passe mis à jour avec succès !");
            } catch (error) {
                setAuthError("Erreur lors de la mise à jour du mot de passe : " + error.message);
            }
        }
    };

    const handleDeleteUser = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
            if (currentUser) {
                try {
                    await deleteUser(currentUser);
                    window.location.href = "/connexion";
                } catch (error) {
                    setAuthError("Erreur lors de la suppression du compte : " + error.message);
                }
            }
        }
    };

    const handleImageChange = (e) => setProfileImage(e.target.files[0]);

    const handleSubmitProfileImage = async () => {
        if (profileImage && currentUser) {
            try {
                const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
                const uploadTask = uploadBytesResumable(storageRef, profileImage);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Optional: track upload progress
                    },
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
                setAuthError("Erreur lors de l'upload de l'image : " + error.message);
            }
        }
    };

    const sendVerificationEmail = async () => {
        if (currentUser) {
            try {
                await sendEmailVerification(currentUser);
                alert("Un email de vérification a été envoyé. Veuillez vérifier votre email.");
            } catch (error) {
                setAuthError("Erreur lors de l'envoi de l'email de vérification : " + error.message);
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
                            onClick={handleSubmitProfileImage}
                        >
                            Mettre à jour la photo
                        </button>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email :</label>
                        <input
                            type="email"
                            id="email"
                            value={newEmail}
                            onChange={handleInputChange(setNewEmail)}
                            placeholder="Entrez votre nouvel email"
                        />
                        <button
                            type="button"
                            className="button is-link"
                            onClick={handleUpdateEmail}
                            disabled={!isVerified}
                        >
                            Mettre à jour l'email
                        </button>
                        {!isVerified && (
                            <button
                                type="button"
                                className="button is-warning"
                                onClick={sendVerificationEmail}
                            >
                                Vérifier l'email
                            </button>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="currentPassword">Mot de passe actuel :</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={handleInputChange(setCurrentPassword)}
                            placeholder="Entrez votre mot de passe actuel"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Nouveau mot de passe :</label>
                        <input
                            type="password"
                            id="password"
                            value={newPassword}
                            onChange={handleInputChange(setNewPassword)}
                            placeholder="Entrez un nouveau mot de passe (facultatif)"
                        />
                        <button
                            type="button"
                            className="button is-link"
                            onClick={handleUpdatePassword}
                        >
                            Mettre à jour le mot de passe
                        </button>
                    </div>

                    <button
                        type="button"
                        className="button is-danger"
                        onClick={handleDeleteUser}
                    >
                        Supprimer le compte
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
