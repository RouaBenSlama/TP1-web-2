import React from "react";
import "./chat.css"

const Chat = () => {
    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src="/avatar.jpg" alt="" />
                    <div className="texts">
                        <span>Pochaco</span>
                        <p> Hi my name is Pochaco nice to meet you</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="/phone.png" alt="phone" />
                    <img src="/video.png" alt="video" />
                    <img src="/info.png" alt="info" />
                </div>

            </div>
            <div className="center"></div>
            <div className="bottom"></div>
           
        </div>
    );
};

export default Chat;

