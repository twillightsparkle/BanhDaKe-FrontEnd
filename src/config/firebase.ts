// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1TaaLTonoKu_GzV6QAs5A3aMZ6-52gRo",
  authDomain: "banhdake-b24a5.firebaseapp.com",
  projectId: "banhdake-b24a5",
  storageBucket: "banhdake-b24a5.firebasestorage.app",
  messagingSenderId: "980315726724",
  appId: "1:980315726724:web:0a9d76df3214c5e78073d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
