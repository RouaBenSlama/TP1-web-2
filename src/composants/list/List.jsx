import React, { useEffect, useState } from "react";
import "./list.css";
import AddUser from "./addUser/AddUser";
import { auth, db } from "../../Firebase";
import { arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../chatStore";

const List = () => {
    const [addUser, setAddUser] = useState(false);
    const [chats, setChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const user = auth.currentUser;
    const { changeChat } = useChatStore();

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "userChats", user.uid), async (res) => {
            const items = res.data().chats;

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);
                const userData = userDocSnap.data();

                if (!userData) {
                    console.error(`User with ID ${item.receiverId} not found`);
                    return null;
                }

                const avatarUrl = userData.photoURL || "/avatar.jpg";

                return {
                    ...item,
                    user: userData,
                    chatId: item.chatId,
                    avatar: avatarUrl,
                };
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

        if (chatIndex === -1) {
            try {
                const existingChatQuery = await getDoc(doc(db, "chats", chat.chatId));
                if (!existingChatQuery.exists()) {
                    const newChat = {
                        messages: [],
                        users: [user.uid, chat.receiverId],
                        createdAt: new Date(),
                    };

                    const chatRef = doc(db, "chats", chat.chatId);
                    await setDoc(chatRef, newChat);
                }

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

    const filteredChats = chats.filter(chat =>
        chat.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <input
                        type="text"
                        className="input"
                        placeholder="Search"
                        value={searchTerm}
                        style={{ paddingLeft: '40px' }} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search"></i>
                </div>
                <i
                    className={`fas ${addUser ? "fa-minus" : "fa-plus"} add`}
                    onClick={() => setAddUser((prev) => !prev)}
                />
            </div>
            {filteredChats.map((chat) => (
                <div
                    className="item"
                    key={chat.chatId}
                    onClick={() => handleSelect(chat)}
                    style={{ backgroundColor: chat?.isSeen ? "transparent" : "blue" }}
                >
                    <img
                        src={chat.avatar}
                        alt="profilePic"
                    />
                    <div className="texts">
                        <span>{chat.user.email}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
            {addUser && (
                <div className="addUserContainer">
                    <button className="closeButton" onClick={() => setAddUser(false)}>X</button>
                    <AddUser onClose={() => setAddUser(false)} />
                </div>
            )}
        </div>
    );
};

export default List;
