import React, { useEffect, useState } from "react";
import "./list.css"
import AddUser from "./addUser/AddUser";
import { auth, db } from "../../Firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const List = () => {
    const [addUser, setAddUser] = useState(false)
    const [chats, setChats] = useState([])

    const user = auth.currentUser;

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "userChats", user.uid), async (res)=> {
            const items = res.data().chats;

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users",item.receiverId)
                const userDocSnap = await getDoc(userDocRef)

                const user = userDocSnap.data()

                return {...item, user}
            })

            const chatData = await Promise.all(promises)

            setChats(chatData.sort((a,b) => b.updatedAt - a.updatedAt))
        });

        return () => {
            unsub()
        }
    }, [user.uid])



    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="/search.png" alt="loupe" />
                    <input type="text"className="input" placeholder="Search"/>
                </div>
                <img 
                    src={ addUser ? "/minus.png" : "/plus.png"} 
                    alt="addIcon" 
                    className="add"
                    onClick={() => setAddUser ((prev) => !prev)}

                />

            </div>
            {chats.map((chat) => (
                <div className="item" key={chat.chatId}>
                    <img src="/avatar.jpg" alt="profilPic" />
                    <div className="texts">
                        <span>{chat.user.email}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
            {addUser && <AddUser /> }
        </div>
    );
};

export default List;

