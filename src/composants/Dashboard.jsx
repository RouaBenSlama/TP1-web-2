import React, { useEffect } from "react";
import Navbar from "./Navbar";
import "./Dashboard.css";
import List from "./list/List"
import Chat from "./chat/Chat";
import Details from "./details/Details";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
import PageConnexion from "./PageConnexion"
import { useUserStore } from "../UserStore";

const Dashboard = () => {

    const {currentUser, isLoading, fetchUserInfo} = useUserStore()

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
            fetchUserInfo(user.uid)
        })

        return() =>{
            unSub()
        }
    }, [fetchUserInfo]);

    if(isLoading) return <div className="loading">Loading ...</div>
        
    return (
        <div>
            {currentUser ? (
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
                            <Chat />

                        </div>
                        <div className="chat-container">
                            <h2>Chat</h2>
                            {/* Contenu de la fenêtre de chat */}
                            <Details />

                        </div>
                    </div>
                </div>
            ) :(
                <PageConnexion />
            )}
        </div>
    );
};

export default Dashboard;
