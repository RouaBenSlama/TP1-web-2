import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import "./addUser.css";
import { auth, db } from "../../../Firebase";
import { useState } from "react";

const AddUser = ({ onClose }) => {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const currentUser = auth.currentUser;
    const [isAdded, setIsAdded] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Reset error message on new search
        const formData = new FormData(e.target);
        const email = formData.get("email");

        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setUser(querySnapshot.docs[0].data());
            } else {
                setErrorMessage("No user found with this email.");
                setUser(null);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("An error occurred while searching for the user.");
        }
    };

    const handleAdd = async () => {
        if (!user || !user.uid || !currentUser || !currentUser.uid) {
            setErrorMessage("User or Current User information is missing.");
            return;
        }

        const userChatRef = doc(db, "userChats", currentUser.uid);

        try {
            const userChatSnapshot = await getDoc(userChatRef);

            if (userChatSnapshot.exists()) {
                const existingChats = userChatSnapshot.data().chats || [];
                const existingChat = existingChats.find(
                    (chat) => chat.receiverId === user.uid
                );

                if (existingChat) {
                    setErrorMessage("Chat with this user already exists.");
                    setIsAdded(true);
                    return;
                }
            }

            const chatRef = doc(collection(db, "chats"));
            await setDoc(chatRef, {
                createdAt: serverTimestamp(),
                messages: []
            });

            const chatData = {
                chatId: chatRef.id,
                lastMessage: "",
                receiverId: user.uid,
                updatedAt: Timestamp.now(),
            };

            if (userChatSnapshot.exists()) {
                await updateDoc(userChatRef, {
                    chats: arrayUnion(chatData),
                });
            } else {
                await setDoc(userChatRef, {
                    chats: [chatData],
                });
            }

            const selectedUserChatRef = doc(db, "userChats", user.uid);
            const selectedUserChatSnapshot = await getDoc(selectedUserChatRef);
            const selectedChatData = {
                chatId: chatRef.id,
                lastMessage: "",
                receiverId: currentUser.uid,
                updatedAt: Timestamp.now(),
            };

            if (selectedUserChatSnapshot.exists()) {
                await updateDoc(selectedUserChatRef, {
                    chats: arrayUnion(selectedChatData),
                });
            } else {
                await setDoc(selectedUserChatRef, {
                    chats: [selectedChatData],
                });
            }

            setIsAdded(true);
        } catch (error) {
            console.log("Error adding user to chat:", error);
            setErrorMessage("An error occurred while adding the user.");
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
                        placeholder="Enter email"
                        name="email"
                        required
                        style={{ paddingLeft: '40px' }} 
                    />
                    <i className="fas fa-search search-icon"></i>
                </div>
                <button type="submit">Search</button>
            </form>

            {errorMessage && <div className="errorMessage">{errorMessage}</div>}

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
