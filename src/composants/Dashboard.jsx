import React from "react";
import Navbar from "./Navbar";
import "./Dashboard.css";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <Navbar />
            <div className="content">
                <div className="messages-container">
                    <h2>Messages</h2>
                    {/* Contenu des messages */}
                </div>
                <div className="chat-container">
                    <h2>Chat</h2>
                    {/* Contenu de la fenêtre de chat */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
