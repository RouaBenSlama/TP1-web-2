import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageConnexion from "./composants/PageConnexion";
import Home from "./composants/Home";

function App() {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/connexion" element={<PageConnexion />} />
            </Routes>
        </BrowserRouter>
    </>
}

export default App
