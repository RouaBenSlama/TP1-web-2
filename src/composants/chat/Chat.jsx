import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../Firebase";
import { useChatStore } from "../../chatStore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Chat = () => {
    const [openEmoji, setOpenEmoji] = useState(false);
    const [text, setText] = useState("");
    const [chat, setChat] = useState();
    const [img, setImg] = useState({
        file: null,
        url: "",
    });
    const [showHover, setShowHover] = useState(false);
    const [receiver, setReceiver] = useState(null);

    const endRef = useRef(null);
    const { chatId, user } = useChatStore();
    const userCurrent = auth.currentUser;

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

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
            setShowHover(true);
        }
    };

    const handleSend = async () => {
        if (text === "" && !img.file) return;

        let imgUrl = null;

        try {
            if (img.file) {
                const storageRef = ref(storage, `chatImages/${chatId}/${img.file.name}`);
                await uploadBytes(storageRef, img.file);
                imgUrl = await getDownloadURL(storageRef);
            }

            if (!chatId) {
                throw new Error("Chat ID is undefined. Unable to send message.");
            }

            const chatRef = doc(db, "chats", chatId);

            const message = {
                senderId: userCurrent.uid,
                createAt: new Date(),
                ...(imgUrl && { img: imgUrl }),
                ...(text && { text }),
            };

            if (text || imgUrl) {
                await updateDoc(chatRef, {
                    messages: arrayUnion(message),
                });
            }

            const userIDs = [userCurrent.uid, user.receiverId];

            await Promise.all(
                userIDs.map(async (id) => {
                    const userChatRef = doc(db, "userChats", id);
                    const userChatSnapshot = await getDoc(userChatRef);

                    if (userChatSnapshot.exists()) {
                        const userChatData = userChatSnapshot.data();
                        const chatIndex = userChatData.chats.findIndex(c => c.chatId === chatId);

                        if (chatIndex !== -1) {
                            userChatData.chats[chatIndex].lastMessage = text || "Image sent";
                            userChatData.chats[chatIndex].isSeen = id === userCurrent.uid ? true : false;
                            userChatData.chats[chatIndex].updateAt = Date.now();

                            await updateDoc(userChatRef, {
                                chats: userChatData.chats,
                            });
                        } else {
                            console.error("Chat not found in userChats for ID:", chatId);
                        }
                    } else {
                        console.error("User chat document does not exist for user ID:", id);
                    }
                })
            );
        } catch (error) {
            console.error("Error sending message:", error);
        }

        setImg({
            file: null,
            url: "",
        });
        setText("");
        setShowHover(false);
    };

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src={receiver?.photoURL || "/avatar.jpg"} alt="Profile" />
                    <div className="texts">
                        <span>{receiver?.email || "Loading..."}</span>
                        <p>Hi, my email is {receiver?.email || "Loading..."} nice to meet you!</p>
                    </div>
                </div>
                <div className="icons">
                    <i className="fas fa-phone" aria-hidden="true"></i>
                    <i className="fas fa-video" aria-hidden="true"></i>
                    <i className="fas fa-info-circle" aria-hidden="true"></i>
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map((message, index) => (
                    <div className={message.senderId === userCurrent?.uid ? "message owner" : "message"} key={message?.createAt || index}>
                        <div className="texts">
                            {message.img && <img src={message.img} alt="" />}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}

                {img.url && (
                    <div className="message own" onMouseEnter={() => setShowHover(true)} onMouseLeave={() => setShowHover(false)}>
                        <div className="texts">
                            {showHover && (
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
                        <i className="fas fa-image" aria-hidden="true"></i>
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
                    <i className="fas fa-camera" aria-hidden="true"></i>
                    <i className="fas fa-microphone" aria-hidden="true"></i>
                </div>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <div className="emoji">
                    <i className="fas fa-smile" onClick={() => setOpenEmoji((prev) => !prev)}></i>
                    <div className="picker" style={{ display: openEmoji ? "block" : "none", position: "absolute" }}>
                        <EmojiPicker onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button className="sendButton" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
