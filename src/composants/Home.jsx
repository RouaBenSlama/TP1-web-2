import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    const handleBtnConnexion = () => {
        navigate("/connexion");
    };

    const handleBtnInscription = () => {
        navigate("/register");
    };

    return (
        <div className="home-container">
            <h1 className="home-title">TP1 Site Web Transactionnel et Chat</h1>
            <div className="button-container">
                <button className="home-btn" onClick={handleBtnConnexion}>
                    Connexion
                </button>
                <button className="home-btn" onClick={handleBtnInscription}>
                    Inscription
                </button>
            </div>
        </div>
    );
}

export default Home;
