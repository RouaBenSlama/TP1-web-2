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
                const storageRef = ref(storage, `images/${file.name}`); 
                const uploadTask = uploadBytesResumable(storageRef, file);

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
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        const docRef = await addDoc(collection(db, "contacts"), {
                            ...newContact,
                            image: downloadURL,
                        });
                        setContacts([...contacts, { ...newContact, image: downloadURL, id: docRef.id }]);
                        resetForm();
                    }
                );
            } else {
                // If there's no photo, add the contact without a pic
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
            setFile(selectedFile); 
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setUploadSuccess(true);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    return (
        <div className="contacts-page">
            <Navbar />
            <div className="contacts-content">
                <h2 className="title">Mes Contacts</h2>
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
                                <h5>{contact.name}</h5>
                                <p>{contact.phone}</p>
                            </div>
                        </div>
                    ))}
                </div>
        
                {showForm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Ajouter un Contact</h2>
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
                                    style={{ display: "none" }}
                                    id="file-upload"
                                />
                                <label className="button is-primary" htmlFor="file-upload">
                                    <i className="fas fa-image"></i> Choisir une image
                                </label>
                                {uploading && (
                                    <progress className="progress is-link" value={uploadProgress} max="100">
                                        {uploadProgress}%
                                    </progress>
                                )}
                                {uploadSuccess && (
                                    <p className="success-message">Téléchargement terminé !</p>
                                )}
                                {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                            </div>
                            <div className="modal-actions">
                                <button className="button is-link" onClick={handleAddContact}>
                                    <i className="fas fa-user-plus"></i> Ajouter Contact
                                </button>
                                <button className="button is-danger" onClick={resetForm}>
                                    <i className="fas fa-times"></i> Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        
                <button className="add-button" onClick={() => setShowForm(true)}>
                    <i className="fas fa-user-plus"></i> Ajouter un contact
                </button>
            </div>
        </div>
    );
        
};

export default Contacts;
