import React from "react";
import Navbar from "./Navbar";
import "./Dashboard.css";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <Navbar />
            <div className="content">
                <h1>Welcome to your Dashboard</h1>
                <p>This is where your main content will go.</p>
            </div>
        </div>
    );
};

export default Dashboard;
