# Real-Time Chat Application

## Overview

This project is a real-time chat application built using **React** and **Firebase**. The application allows users to create an account, authenticate securely, and join an online chat room. It also includes profile management features, enabling users to customize their profile picture and other information. The goal is to provide a user-friendly, intuitive experience with robust security features.

## Features

1. **User Authentication**  
   Users can sign up and log in securely using Firebase Authentication. Access to the chat room is restricted to authenticated users only.

2. **Real-Time Chat**  
   The chat system is powered by Firebase Firestore, allowing instant messaging between users in the chat room. Messages are updated in real-time to ensure a seamless communication experience.

3. **Profile Management**  
   Users can manage their profile information, including the ability to upload, update, or delete their profile picture using Firebase Storage.

4. **User Interface Design**  
   The user interfaces are designed for ease of use and include pages for account creation, login, and chat room interaction. We have focused on creating a user-friendly and intuitive design to enhance the overall user experience.

## Technologies Used

- **React**: For building the user interface and handling client-side logic.
- **Firebase Authentication**: To manage user sign-up, login, and secure access to the chat room.
- **Firebase Firestore**: For real-time storage and retrieval of chat messages.
- **Firebase Storage**: For uploading and managing user profile pictures.
- **CSS & Bulma**: For styling and designing the user interface.

## Setup and Installation

1. Clone the repository:
   git clone https://github.com/your-username/your-repo-name.git

2. Navigate to the project directory:
   cd your-repo-name

3. Install dependencies:
   npm install

4. Set up Firebase:
   - Go to the Firebase Console and create a new project.
   - Set up Firebase Authentication, Firestore, and Storage.
   - Add your Firebase configuration in .env:
      REACT_APP_API_KEY=your-api-key
      REACT_APP_AUTH_DOMAIN=your-auth-domain
      REACT_APP_PROJECT_ID=your-project-id
      REACT_APP_STORAGE_BUCKET=your-storage-bucket
      REACT_APP_MESSAGING_SENDER_ID=your-messaging-sender-id
      REACT_APP_APP_ID=your-app-id

5. Start
   npx vite or npm start

## Authors 
- David Chiu
- Daniel To
- Judith Andrasko
- Roua Ben Slama
