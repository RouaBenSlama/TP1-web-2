import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../Firebase';
import { Link } from 'react-router-dom';
import "./PageConnexion.css";
import Logo from "./5932535.png";

const Connexion = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [resetPasswordMode, setResetPasswordMode] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('rememberedEmail') || sessionStorage.getItem('rememberedEmail');
        if (storedEmail) {
            setEmail(storedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                    sessionStorage.setItem('rememberedEmail', email);
                }
                window.location.href = "/dashboard";
            })
            .catch((err) => {
                setError('Identifiants incorrects');
                console.error(err);
            });
    };

    const handleGoogleLogin = () => {
        signInWithPopup(auth, googleProvider)
            .then(() => {
                localStorage.setItem('loginTime', new Date().getTime());
                window.location.href = "/dashboard";
            })
            .catch((err) => console.error(err));
    };

    const handleFacebookLogin = () => {
        signInWithPopup(auth, facebookProvider)
            .then(() => {
                localStorage.setItem('loginTime', new Date().getTime());
                window.location.href = "/dashboard";
            })
            .catch((err) => console.error(err));
    };

    const handleResetPassword = () => {
        if (!email) {
            setError('Veuillez entrer votre email avant de réinitialiser votre mot de passe.');
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert('Un email de réinitialisation a été envoyé à votre adresse email.');
                setResetPasswordMode(false);
            })
            .catch((err) => {
                setError('Erreur lors de l\'envoi de l\'email de réinitialisation.');
                console.error(err);
            });
    };

    return (
        <div className="login-container">
            <div className="login-box box">
                <img src={Logo} alt="Logo" className="logo" />
                <h2 className="title is-4">Connexion</h2>
                <form onSubmit={handleLogin}>
                    <div className="field">
                        <label className="label">Email</label>
                        <div className="control">
                            <input
                                className="input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    {!resetPasswordMode && (
                        <>
                            <div className="field">
                                <label className="label">Mot de passe</label>
                                <div className="control has-icons-right">
                                    <input
                                        className="input"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span
                                        className="icon is-small is-right password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field is-flex is-align-items-center remember-me">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="rememberMe">Se souvenir de moi</label>
                            </div>
                            {error && <p className="has-text-danger">{error}</p>}
                            <button className="button is-primary is-fullwidth mb-3">Se connecter</button>
                            <p className="forgot-password-link">
                                <button type="button" className="button is-text" onClick={handleResetPassword}>Mot de passe oublié ?</button>
                            </p>
                        </>
                    )}
                    {resetPasswordMode && (
                        <>
                            <p>Entrez votre email pour réinitialiser votre mot de passe.</p>
                            {error && <p className="has-text-danger">{error}</p>}
                            <button
                                type="button"
                                className="button is-primary is-fullwidth mb-3"
                                onClick={handleResetPassword}
                            >
                                Envoyer un email de réinitialisation
                            </button>
                            <button
                                type="button"
                                className="button is-text cancel-btn"
                                onClick={() => setResetPasswordMode(false)}
                            >
                                Annuler
                            </button>
                        </>
                    )}
                </form>
                {!resetPasswordMode && (
                    <>
                        <p className="register-link">
                            Pas encore inscrit? <Link to="/register"> S'inscrire ici</Link>
                        </p>
                        <hr />
                        <div className="social-login">
                            <button className="button is-google is-fullwidth" onClick={handleGoogleLogin}>Se connecter avec Google</button>
                            <button className="button is-facebook is-fullwidth" onClick={handleFacebookLogin}>Se connecter avec Facebook</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Connexion;
