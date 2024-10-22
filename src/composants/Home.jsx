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

    // Fonction pour animate 
    const animateText = (text) => {
        return text.split("").map((char, index) => {
            const style = { animationDelay: `${index / 10}s` };
            return (
                <span aria-hidden="true" key={index} style={style}>
                    {char}
                </span>
            );
        });
    };

    return (
        <div className="home-container">
            <h1 className="home-title">
                {animateText("Site Web de Chat Transactionnel ")}
                <span className="icon-container"> 
                    <i className="fas fa-comment-dollar"></i>
                </span>
            </h1>
            <div className="button-card">
                <div className="button-container">
                    <button className="home-btn" onClick={handleBtnConnexion}>
                        Connexion
                    </button>
                    <button className="home-btn" onClick={handleBtnInscription}>
                        Inscription
                    </button>
                </div>
                <p>TP1 par: David Chiu, Daniel To, Judith Andrasko & Roua Ben Slama</p>
            </div>
        </div>
    );
}

export default Home;
