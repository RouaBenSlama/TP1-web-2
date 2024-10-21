import React, { useEffect, useRef, useState } from "react";
import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import { arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase";
import { useChatStore } from "../../chatStore";

const Chat = () => {
    const [openEmoji, setOpenEmoji] = useState(false)
    const [text, setText] = useState("")
    const [chat, setChat] = useState()

    const endRef = useRef(null)
    const {chatId, user} = useChatStore()
    const userCurrent = auth.currentUser;

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior:"smooth"})
    },[])

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "chats", chatId), (res) =>{
            setChat(res.data())
        })

        return () => {
            unsub()
        }
    },[chatId])


    const handleEmoji = (e) => {
        setText(prev => prev+e.emoji)
        setOpenEmoji(false)
    }

    const handleSend = async () => {
        if (text === "") return;
    
        try {
            // Log chatId to check its value
            console.log("chatId before sending message:", chatId);
    
            // Ensure chatId is defined
            if (!chatId) {
                throw new Error("Chat ID is undefined. Unable to send message.");
            }
    
            // Create a reference to the chat document
            const chatRef = doc(db, "chats", chatId);
    
            // Update the chat document with the new message
            await updateDoc(chatRef, {
                messages: arrayUnion({
                    senderId: userCurrent.uid,
                    text,
                    createAt: new Date(),
                }),
            });
            console.log(user)
            const userIDs = [userCurrent.uid, user.receiverId];
    
            await Promise.all(
                userIDs.map(async (id) => {
                    const userChatRef = doc(db, "userChats", id);
                    const userChatSnapshot = await getDoc(userChatRef);
    
                    if (userChatSnapshot.exists()) {
                        const userChatData = userChatSnapshot.data();
    
                        // Ensure userChatData has a chats array
                        if (userChatData.chats && Array.isArray(userChatData.chats)) {
                            const chatIndex = userChatData.chats.findIndex(c => c.chatId === chatId);
    
                            if (chatIndex !== -1) {
                                userChatData.chats[chatIndex].lastMessage = text;
                                userChatData.chats[chatIndex].isSeen = id === userCurrent.uid ? true: false
                                userChatData.chats[chatIndex].updateAt = Date.now();
    
                                await updateDoc(userChatRef, {
                                    chats: userChatData.chats,
                                });
                            } else {
                                console.error("Chat not found in userChats for ID:", chatId);
                            }
                        } else {
                            console.error("No chats found in userChatData for user ID:", id);
                            console.log("userChatData:", userChatData); // Debugging log
                        }
                    } else {
                        console.error("User chat document does not exist for user ID:", id);
                    }
                })
            );
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    
    
    
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
                { chat?.messages?.map(message => (

                    <div className="message owner" key={message?.createAt}>
                        <div className="texts">
                            {message.img && <img 
                                src={message.img} 
                                alt="" />
                            }
                            <p>{message.text}</p>
                            {/*<span>{message}</span> */}
                        </div>
                    </div>
                ))}
                <div ref={endRef}></div>
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
                <button className="sendButon" onClick={handleSend}>Envoyé</button>
            </div>
           
        </div>
    );
};

export default Chat;

