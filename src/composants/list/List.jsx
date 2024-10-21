import React, { useEffect, useState } from "react";
import "./list.css";
import AddUser from "./addUser/AddUser";
import { auth, db } from "../../Firebase";
import { arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../chatStore";

const List = () => {
    const [addUser, setAddUser] = useState(false);
    const [chats, setChats] = useState([]);

    const user = auth.currentUser;
    const { changeChat } = useChatStore();
    console.log(user.uid);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "userChats", user.uid), async (res) => {
            const items = res.data().chats;
    
            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);
                
                const user = userDocSnap.data();
    
                // Check if user data exists
                if (!user) {
                    console.error(`User with ID ${item.receiverId} not found`);
                    return null; // Handle missing user case
                }
    
                // Make sure to add chatId to the chat object
                return { ...item, user, chatId: item.chatId };
            });
    
            const chatData = await Promise.all(promises);
            setChats(chatData.filter(chat => chat !== null).sort((a, b) => b.updatedAt - a.updatedAt));
        });
    
        return () => {
            unsub();
        };
    }, [user.uid]);
    

    const handleSelect = async (chat) => {
        const userChats = chats.map((item) => {
            const { user, ...rest } = item;
            return rest;
        });
    
        const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);
    
        // If chat does not exist, create a new chat
        if (chatIndex === -1) {
            try {
                // Check if a chat already exists
                const existingChatQuery = await getDoc(doc(db, "chats", chat.chatId));
                if (!existingChatQuery.exists()) {
                    // Create a new chat document if it doesn't exist
                    const newChat = {
                        messages: [], // Initialize with an empty messages array
                        users: [user.uid, chat.receiverId], // Store user IDs
                        createdAt: new Date(),
                    };
    
                    const chatRef = doc(db, "chats", chat.chatId);
                    await setDoc(chatRef, newChat);
                }
    
                // Update the userChats for the users involved
                await updateDoc(doc(db, "userChats", user.uid), {
                    chats: arrayUnion({
                        chatId: chat.chatId,
                        receiverId: chat.receiverId,
                        lastMessage: "",
                        isSeen: false,
                        updatedAt: Date.now(),
                    }),
                });
    
                await updateDoc(doc(db, "userChats", chat.receiverId), {
                    chats: arrayUnion({
                        chatId: chat.chatId,
                        receiverId: user.uid,
                        lastMessage: "",
                        isSeen: false,
                        updatedAt: Date.now(),
                    }),
                });
    
                // Now you can change the chat context
                changeChat(chat.chatId, chat, user);
            } catch (error) {
                console.error("Error creating new chat:", error);
            }
        } else {
            userChats[chatIndex].isSeen = true;
    
            const userChatsRef = doc(db, "userChats", user.uid);
            try {
                await updateDoc(userChatsRef, {
                    chats: userChats,
                });
                changeChat(chat.chatId, chat, user);
            } catch (error) {
                console.log(error);
            }
        }
    };
    
    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="/search.png" alt="loupe" />
                    <input type="text" className="input" placeholder="Search" />
                </div>
                <img
                    src={addUser ? "/minus.png" : "/plus.png"}
                    alt="addIcon"
                    className="add"
                    onClick={() => setAddUser((prev) => !prev)}
                />
            </div>
            {chats.map((chat) => (
                <div className="item" key={chat.chatId} onClick={() => handleSelect(chat)} style={{backgroundColor: chat?.isSeen ? "transparent": "blue"}}>
                    <img src={chat.user.avatar || "/avatar.jpg"} alt="profilePic" />
                    <div className="texts">
                        <span>{chat.user.email}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
            {addUser && <AddUser />}
        </div>
    );
};

export default List;
