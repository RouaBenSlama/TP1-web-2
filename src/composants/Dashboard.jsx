import React, { useEffect } from "react";
import Navbar from "./Navbar";
import "./Dashboard.css";
import List from "./list/List"
import Chat from "./chat/Chat";
import Details from "./details/Details";
import { useChatStore } from "../chatStore";


const Dashboard = () => {
    const {chatId} = useChatStore()

    return (
        <div className="dashboard">
            <Navbar />
            <div className="content">
                <div className="messages-container">
                    <h2>Messages</h2>
                    <List />
                </div>
                <div className="chat-container">
                    <h2>Chat</h2>
                    {/* Contenu de la fenêtre de chat */}
                    {chatId && <Chat />}

                </div>
                <div className="chat-container">
                    <h2>Detail</h2>
                    {/* Contenu de la fenêtre de chat */}
                    {chatId && <Details />}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
