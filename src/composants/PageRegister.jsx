import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../Firebase"; // Import 'db' from your Firebase setup for Firestore
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import "./PageRegister.css";

const Register = () => {
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(""); // Reset error message

        // Vérifie si les emails correspondent
        if (email !== confirmEmail) {
            setError("Les emails ne correspondent pas. Veuillez vérifier.");
            return;
        }

        try {
            // Création du compte si les emails correspondent
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Envoyer un email de vérification
            await sendEmailVerification(user);
            alert("Un email de vérification a été envoyé. Veuillez vérifier votre email avant de vous connecter.");

            // Obtenez la date de création du compte
            const creationDate = new Date().toISOString(); // Format de la date en ISO

            // Enregistrer les informations de l'utilisateur dans Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                creationDate: creationDate,
            });

            // Rediriger vers la page de connexion après l'inscription
            window.location.href = "/connexion";
        } catch (err) {
            setError("Erreur lors de l'inscription ou de l'envoi de l'email de vérification : " + err.message);
        }
    };

    return (
        <div className="auth-container">
            <h1>SignUp</h1>
            <form onSubmit={handleRegister}>
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Confirmez l'Email</label>
                    <input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="signup-button">SignUp</button>
            </form>
        </div>
    );
};

export default Register;
