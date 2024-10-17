import { BrowserRouter, Routes, Route } from "react-router-dom";
import Connexion from "./composants/PageConnexion";
import Home from "./composants/Home";
import Register from "./composants/PageRegister"
import Dashboard from "./composants/Dashboard";



function App() {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    </>
}

export default App
