import { useNavigate } from "react-router-dom";



function Home() {

    const navigate = useNavigate()

    const handleBtnConnexion = () => {
        navigate("/connexion")
    }

    const handleBtnInscription = () => {
        navigate("/register")
    }
    return(
        <div>
            <label> <h1>TP1 site web transactionel et chat </h1></label>
            <div>
                <button onClick={handleBtnConnexion}> Connexion </button>
                <br />
                <button onClick={handleBtnInscription}> Incription </button>
            </div>
        </div>
    ) 
}
export default Home;