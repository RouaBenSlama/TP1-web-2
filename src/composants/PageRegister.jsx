import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../Firebase";
import "./PageRegister.css";

const Register = () => {
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        setError(""); // Reset error message

        // Vérifie si les emails correspondent
        if (email !== confirmEmail) {
            setError("Les emails ne correspondent pas. Veuillez vérifier.");
            return;
        }

        // Création du compte si les emails correspondent
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Envoyer un email de vérification
                sendEmailVerification(userCredential.user)
                    .then(() => {
                        alert("Un email de vérification a été envoyé. Veuillez vérifier votre email avant de vous connecter.");
                        window.location.href = "/connexion"; // Rediriger vers la page de connexion après l'inscription
                    })
                    .catch((err) => {
                        setError("Erreur lors de l'envoi de l'email de vérification : " + err.message);
                    });
            })
            .catch((err) => {
                setError("Erreur lors de l'inscription : " + err.message);
            });
    };

    return (
        <div className="auth-container">
            <h2>Inscription</h2>
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
                <button type="submit">Inscrire</button>
            </form>
        </div>
    );
};

export default Register;
