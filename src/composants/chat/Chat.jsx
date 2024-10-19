import React, { useState } from "react";
import "./chat.css"
import EmojiPicker from "emoji-picker-react"

const Chat = () => {
    const [openEmoji, setOpenEmoji] = useState(false)
    const [text, setText] = useState("")

    const handleEmoji = (e) => {
        setText(prev => prev+e.emoji)
        setOpenEmoji(false)
    }
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
            <div className="center">
                <div className="message">
                    <img src="/avatar.jpg" alt="pp" />
                    <div className="texts">
                        <p>Hello hoew are you today?</p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message owner">
                    <div className="texts">
                        <p>Good what about you ?</p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message">
                    <img src="/avatar.jpg" alt="pp" />
                    <div className="texts">
                        <p>Good tahnks</p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message owner">
                    <div className="texts">
                        <p>What are you doin?</p>
                        <span>1 min ago</span>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <img src="/img.png" alt="galerie" />
                    <img src="/camera.png" alt="camera" />
                    <img src="/mic.png" alt="microphone" />
                </div>
                <input 
                    type="text" 
                    placeholder="Type a message ... " 
                    value={text}
                    onChange={(e) => setText(e.target.value)} />
                <div className="emoji">
                    <img src="/emoji.png" alt="emoji" onClick={() => setOpenEmoji((prev) => !prev)}/>
                    <div className="picker" style={{ display: openEmoji ? "block" : "none", position: "absolute" }}>
                        <EmojiPicker onEmojiClick={handleEmoji} />
                    </div>

                </div>
                <button className="sendButon">Envoyé</button>
            </div>
           
        </div>
    );
};

export default Chat;

