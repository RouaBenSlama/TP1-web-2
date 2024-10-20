import { arrayUnion, collection, doc, getDoc, getDocs, query,serverTimestamp,setDoc,Timestamp,updateDoc,where } from "firebase/firestore"
import "./addUser.css"
import { auth, db } from "../../../Firebase"
import { useState } from "react"

const AddUser = () => {

    const [user, setUser] = useState(null)
    const currentUser = auth.currentUser;

    const handleSearch = async (e) => {
        e.preventDefault()


        const formData = new FormData(e.target)
        const email = formData.get("email")
        
        try{
            const useRef = collection(db, "users")

            const q = query(useRef, where("email","==", email))

            const querySnapshot = await getDocs(q)

            if(!querySnapshot.empty){
                console.log(querySnapshot.docs[0].data())
                setUser(querySnapshot.docs[0].data())
            }
        } catch(error) {
            console.log(error)
        }
    }

    const handleAdd = async () => {
        if (!user || !user.uid || !currentUser || !currentUser.uid) {
            console.error("User or Current User information is missing.");
            return;
        }
    
        const chatRef = collection(db, "chats");
        const userChatRef = collection(db, "userChats");
    
        try {
            // Create a new document in the "chats" collection with an auto-generated ID
            const newChatRef = doc(chatRef);
            console.log(newChatRef);
    
            // Set up the new chat with initial values
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
            });
    
            // Check if the user's document exists before updating
            const userChatDoc = doc(userChatRef, user.uid);
            const userChatSnapshot = await getDoc(userChatDoc);
    
            if (userChatSnapshot.exists()) {
                // Document exists, update it
                await updateDoc(userChatDoc, {
                    chats: arrayUnion({
                        chatId: newChatRef.id,
                        lastMessage: "",
                        receiverId: currentUser.uid,
                        updatedAt: Timestamp.now(),
                    })
                });
            } else {
                // Document doesn't exist, create it with setDoc
                await setDoc(userChatDoc, {
                    chats: [{
                        chatId: newChatRef.id,
                        lastMessage: "",
                        receiverId: currentUser.uid,
                        updatedAt: Timestamp.now(),
                    }]
                });
            }
    
            // Do the same for the current user
            const currentUserChatDoc = doc(userChatRef, currentUser.uid);
            const currentUserChatSnapshot = await getDoc(currentUserChatDoc);
    
            if (currentUserChatSnapshot.exists()) {
                // Document exists, update it
                await updateDoc(currentUserChatDoc, {
                    chats: arrayUnion({
                        chatId: newChatRef.id,
                        lastMessage: "",
                        receiverId: user.uid,
                        updatedAt: Timestamp.now(),
                    })
                });
            } else {
                // Document doesn't exist, create it with setDoc
                await setDoc(currentUserChatDoc, {
                    chats: [{
                        chatId: newChatRef.id,
                        lastMessage: "",
                        receiverId: user.uid,
                        updatedAt: Timestamp.now(),
                    }]
                });
            }
           
        } catch (error) {
            console.log("Error adding user to chat:", error);
        }
    };
    
    return(
        <div className="addUser">Form
            <form onSubmit={handleSearch}>
                <input 
                    type="text"
                    placeholder="Email"
                    name="email"
                />
                <button>Search</button>
            </form>
            {user && <div className="user">
                <div className="detail">
                    <img src={user.avatar || "/avatar.jpg"} alt="" />
                    <span>{user.email}</span>
                </div>
                <button onClick={handleAdd}>Add User</button>
            </div>}
        </div>
    )
}

export default AddUser;