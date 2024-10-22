import React, { useEffect, useRef, useState } from "react";
import "./chat.css"
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../Firebase"; // Make sure storage is imported
import { useChatStore } from "../../chatStore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import storage functions

const Chat = () => {
    const [openEmoji, setOpenEmoji] = useState(false);
    const [text, setText] = useState("");
    const [chat, setChat] = useState();
    const [img, setImg] = useState({
        file: null,
        url: "",
    });
    const [showHover, setShowHover] = useState(false); // New state for hover visibility
    const [receiver, setReceiver] = useState(null); // State to hold receiver info


    const endRef = useRef(null);
    const { chatId, user } = useChatStore();
    const userCurrent = auth.currentUser;

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // Fetch receiver user info
    useEffect(() => {
        const fetchReceiver = async () => {
            if (user && user.receiverId) {
                const receiverDoc = await getDoc(doc(db, "users", user.receiverId));
                if (receiverDoc.exists()) {
                    setReceiver(receiverDoc.data());
                } else {
                    console.error("No such user!");
                }
            }
        };

        fetchReceiver();
    }, [user]);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        });

        return () => {
            unsub();
        };
    }, [chatId]);

    const handleEmoji = (e) => {
        setText(prev => prev + e.emoji);
        setOpenEmoji(false);
    };

    const handleImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
            setShowHover(true); // Show hover when an image is selected
        }
    };

    const handleSend = async () => {
        // Prevent sending if both text and image are empty
        if (text === "" && !img.file) return;
    
        let imgUrl = null;
    
        try {
            // Log chatId to check its value
            console.log("chatId before sending message:", chatId);
    
            if (img.file) {
                // Create a storage reference for the image
                const storageRef = ref(storage, `chatImages/${chatId}/${img.file.name}`);
    
                // Upload the image
                await uploadBytes(storageRef, img.file);
    
                // Get the URL of the uploaded image
                imgUrl = await getDownloadURL(storageRef);
            }
    
            // Ensure chatId is defined
            if (!chatId) {
                throw new Error("Chat ID is undefined. Unable to send message.");
            }
    
            // Create a reference to the chat document
            const chatRef = doc(db, "chats", chatId);
    
            // Prepare the message object
            const message = {
                senderId: userCurrent.uid,
                createAt: new Date(),
                ...(imgUrl && { img: imgUrl }), // Save image URL if present
                ...(text && { text }), // Save text if present
            };
    
            // Only update the chat document if there's a valid message
            if (text || imgUrl) {
                await updateDoc(chatRef, {
                    messages: arrayUnion(message),
                });
            }
    
            console.log(user);
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
                                userChatData.chats[chatIndex].lastMessage = text || "Image sent"; // Update last message if text is empty
                                userChatData.chats[chatIndex].isSeen = id === userCurrent.uid ? true : false;
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
    
        // Reset image and text after sending
        setImg({
            file: null,
            url: "",
        });
        setText("");
        setShowHover(false); // Hide hover after sending
    };
    
    

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src={receiver?.avatar || "/avatar.jpg"} alt="" /> {/* Use receiver avatar */}
                    <div className="texts">
                        <span>{receiver?.email || "Loading..."}</span> {/* Display receiver email */}
                        <p> Hi my email is {receiver?.email || "Loading..."} nice to meet you</p> {/* Display receiver info */}
                    </div>
                </div>
                <div className="icons">
                    <img src="/phone.png" alt="phone" />
                    <img src="/video.png" alt="video" />
                    <img src="/info.png" alt="info" />
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map((message, index) => (
                    <div className={message.senderId === userCurrent?.uid ? "message owner" : "message"} key={message?.createAt || index}>
                        <div className="texts">
                            {/* Render the image if it exists */}
                            {message.img && <img src={message.img} alt="" />}
                            {/* Render the text only if it exists */}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}

                {img.url && (
                    <div className="message own" onMouseEnter={() => setShowHover(true)} onMouseLeave={() => setShowHover(false)}>
                        <div className="texts">
                            {showHover && ( // Hover box showing the message status
                                <div className="hoverBox" style={{ background: "red" }}>
                                    <span>Image not sent yet</span>
                                </div>
                            )}
                            <img src={img.url} alt="" />
                        </div>
                    </div>
                )}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="/img.png" alt="galerie" />
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
                    <img src="/camera.png" alt="camera" />
                    <img src="/mic.png" alt="microphone" />
                </div>
                <input
                    type="text"
                    placeholder="Type a message ... "
                    value={text}
                    onChange={(e) => setText(e.target.value)} />
                <div className="emoji">
                    <img src="/emoji.png" alt="emoji" onClick={() => setOpenEmoji((prev) => !prev)} />
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
