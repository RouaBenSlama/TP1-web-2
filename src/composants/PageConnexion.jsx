import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../Firebase';
import { Link } from 'react-router-dom';
import "./PageConnexion.css";
import Logo from "./5932535.png";

const Connexion = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                // Enregistrer l'heure de connexion
                localStorage.setItem('loginTime', new Date().getTime());
                window.location.href = "/dashboard"; // Redirect to dashboard
            })
            .catch((err) => {
                setError('Identifiants incorrects');
                console.error(err);
            });
    };

    const handleGoogleLogin = () => {
        signInWithPopup(auth, googleProvider)
            .then(() => {
                // Enregistrer l'heure de connexion
                localStorage.setItem('loginTime', new Date().getTime());
                window.location.href = "/dashboard";
            })
            .catch((err) => console.error(err));
    };

    const handleFacebookLogin = () => {
        signInWithPopup(auth, facebookProvider)
            .then(() => {
                // Enregistrer l'heure de connexion
                localStorage.setItem('loginTime', new Date().getTime());
                window.location.href = "/dashboard";
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src={Logo} alt="Logo" className="logo" />
                <h2>Connexion</h2>
                <form onSubmit={handleLogin}>
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
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="rememberMe">Se souvenir de moi</label>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Se connecter</button>
                </form>
                <p>
                    Pas encore inscrit? <Link to="/register"> S'inscrire ici</Link>
                </p>
                <div className="social-login">
                    <button className="google-btn" onClick={handleGoogleLogin}>Se connecter avec Google</button>
                    <button className="facebook-btn" onClick={handleFacebookLogin}>Se connecter avec Facebook</button>
                </div>
            </div>
        </div>
    );
}

export default Connexion;
