import { BrowserRouter, Routes, Route } from "react-router-dom";
import Connexion from "./composants/PageConnexion";
import Home from "./composants/Home";
import Register from "./composants/PageRegister"
import Dashboard from "./composants/Dashboard";
import Contact from "./composants/Contact";
import Messenger from "./composants/chat/Chat.jsx";
//import Chat from "./composants/chat/Chat.jsx";
import ProfilePage from "./composants/ProfilePage.jsx";

function App() {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contacts" element={<Contact />} />
                <Route path="/chat" element={<Messenger />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </BrowserRouter>
    </>
}

export default App
