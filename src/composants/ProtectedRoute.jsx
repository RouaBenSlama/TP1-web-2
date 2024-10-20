import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../Firebase';

const ProtectedRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const loginTime = localStorage.getItem('loginTime');
                const currentTime = new Date().getTime();
                const maxSessionDuration = 10 * 60 * 1000; // 10 minutes en millisecondes

                if (loginTime && currentTime - loginTime > maxSessionDuration) {
                    // Si le temps écoulé dépasse 10 minutes, déconnecte l'utilisateur
                    auth.signOut();
                    localStorage.removeItem('loginTime');
                    setUser(null);
                } else {
                    // Si la session est encore valide, on met à jour l'utilisateur
                    setUser(user);
                    setLoading(false);
                }
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        // Afficher un indicateur de chargement ou un écran vide pendant que la vérification se fait
        return <div>Chargement...</div>;
    }

    if (!user) {
        // Si l'utilisateur n'est pas authentifié ou si la session a expiré, redirection vers la page de connexion
        return <Navigate to="/connexion" />;
    }

    // Sinon, on affiche la route protégée
    return children;
};

export default ProtectedRoute;
