import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import "./addUser.css";
import { auth, db } from "../../../Firebase";
import { useState } from "react";

const AddUser = ({ onClose }) => {
    const [user, setUser] = useState(null);
    const currentUser = auth.currentUser;
    const [isAdded, setIsAdded] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get("email");

        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setUser(querySnapshot.docs[0].data());
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAdd = async () => {
        if (!user || !user.uid || !currentUser || !currentUser.uid) {
            console.error("User or Current User information is missing.");
            return;
        }

        const chatRef = collection(db, "chats");
        const userChatRef = collection(db, "userChats");

        try {
            const newChatRef = doc(chatRef);
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
            });

            const userChatDoc = doc(userChatRef, user.uid);
            const userChatSnapshot = await getDoc(userChatDoc);

            if (userChatSnapshot.exists()) {
                await updateDoc(userChatDoc, {
                    chats: arrayUnion({
                        chatId: newChatRef.id,
                        lastMessage: "",
                        receiverId: currentUser.uid,
                        updatedAt: Timestamp.now(),
                    })
                });
            } else {
                await setDoc(userChatDoc, {
                    chats: [{
                        chatId: newChatRef.id,
                        lastMessage: "",
                        receiverId: currentUser.uid,
                        updatedAt: Timestamp.now(),
                    }]
                });
            }

            const currentUserChatDoc = doc(userChatRef, currentUser.uid);
            const currentUserChatSnapshot = await getDoc(currentUserChatDoc);

            if (currentUserChatSnapshot.exists()) {
                await updateDoc(currentUserChatDoc, {
                    chats: arrayUnion({
                        chatId: newChatRef.id,
                        lastMessage: "",
                        receiverId: user.uid,
                        updatedAt: Timestamp.now(),
                    })
                });
            } else {
                await setDoc(currentUserChatDoc, {
                    chats: [{
                        chatId: newChatRef.id,
                        lastMessage: "",
                        receiverId: user.uid,
                        updatedAt: Timestamp.now(),
                    }]
                });
            }

            // Mark the user as added
            setIsAdded(true);
        } catch (error) {
            console.log("Error adding user to chat:", error);
        }
    };

    const handleChecked = () => {
        if (!isAdded) {
            handleAdd();
        }
    };

    return (
        <div className="addUser">
            <button className="closeButton" onClick={onClose}><i className="fas fa-times"></i></button>
            <form onSubmit={handleSearch} className="form">
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Entrez l'email"
                        name="email"
                        required
                        style={{ paddingLeft: '40px' }} 
                    />
                    <i className="fas fa-search search-icon"></i>
                </div>
                <button type="submit">Search</button>
            </form>
            {user && (
                <div className="user">
                    <div className="detail">
                        <img src={user.avatar || "/avatar.jpg"} alt="" />
                        <span>{user.email}</span>
                    </div>
                    <button 
                        id={isAdded ? "addedButton" : "addButton"} 
                        onClick={handleChecked} 
                        className={isAdded ? "added" : "add"}
                    >
                        {isAdded ? (
                            <i className="fa-solid fa-circle-check" style={{ color: 'white' }}></i>
                        ) : (
                            <i className="fas fa-user-plus"></i>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddUser;
