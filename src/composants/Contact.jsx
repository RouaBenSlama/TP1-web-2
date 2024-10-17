import React, { useEffect, useState } from "react";
import { db, storage } from "../Firebase"; // Import storage
import { collection, addDoc, getDocs } from "firebase/firestore"; // Import Firestore methods
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import Storage methods
import "./Contact.css";
import Navbar from "./Navbar";

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({ name: "", phone: "", image: "" });
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [file, setFile] = useState(null); // To store the uploaded file

    // Fetch contacts from Firestore on component mount
    useEffect(() => {
        const fetchContacts = async () => {
            const querySnapshot = await getDocs(collection(db, "contacts"));
            const contactsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setContacts(contactsList);
        };

        fetchContacts();
    }, []);

    const handleAddContact = async () => {
        try {
            if (file) {
                const storageRef = ref(storage, `images/${file.name}`); // Create a storage reference
                const uploadTask = uploadBytesResumable(storageRef, file); // Use uploadBytesResumable

                // Monitor upload progress
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(progress);
                        setUploading(true);
                    },
                    (error) => {
                        console.error("Error uploading file: ", error);
                        setUploading(false);
                    },
                    async () => {
                        // Get the download URL
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        // Add contact with image URL
                        const docRef = await addDoc(collection(db, "contacts"), {
                            ...newContact,
                            image: downloadURL, // Store the image URL in Firestore
                        });
                        setContacts([...contacts, { ...newContact, image: downloadURL, id: docRef.id }]);
                        resetForm();
                    }
                );
            } else {
                // If there's no file, add the contact without an image
                const docRef = await addDoc(collection(db, "contacts"), newContact);
                setContacts([...contacts, { ...newContact, id: docRef.id }]);
                resetForm();
            }
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const resetForm = () => {
        setNewContact({ name: "", phone: "", image: "" });
        setImagePreview(null);
        setShowForm(false);
        setUploadSuccess(false);
        setFile(null);
        setUploadProgress(0);
        setUploading(false);
    };

    const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile); // Store the selected file
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setUploadSuccess(true);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    return (
        <div>

        < Navbar/>

        <div className="contacts-container">

            <h1 className="title">Mes Contacts</h1>

            <div className="contact-list">
                {contacts.map((contact) => (
                    <div key={contact.id} className="contact-item">
                        <div className="contact-avatar">
                            {contact.image ? (
                                <img src={contact.image} alt={contact.name} className="avatar-image" />
                            ) : (
                                <div className="default-avatar">{contact.name[0]}</div>
                            )}
                        </div>
                        <div className="contact-info">
                            <p>{contact.name}</p>
                            <p>{contact.phone}</p>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="add-contact-form">
                    <input
                        type="text"
                        className="input"
                        placeholder="Nom"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        className="input"
                        placeholder="Téléphone"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        required
                    />
                    <div className="file-input-container">
                        <label className="file-label">Photo de profil</label>
                        <input
                            type="file"
                            className="file-input"
                            onChange={handleImageUpload}
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="file-upload"
                        />
                        <label className="button is-primary" htmlFor="file-upload">
                            Choisir une image
                        </label>
                        {uploading && (
                            <progress className="progress is-primary" value={uploadProgress} max="100">
                                {uploadProgress}%
                            </progress>
                        )}
                        {uploadSuccess && (
                            <p className="success-message">Téléchargement terminé !</p>
                        )}
                        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                    </div>
                    <br />
                    <button className="button is-success" onClick={handleAddContact}>
                        Ajouter Contact
                    </button>
                </div>
            )}

            <button className="add-button" onClick={() => setShowForm(true)}>+</button>
        </div>
        </div>
    );
};

export default Contacts;
