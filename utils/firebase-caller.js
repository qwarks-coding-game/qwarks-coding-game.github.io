// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as signOutFirebase } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDTmWRz0vlNpBoCamRoZ7pdz5nzxFzpYMc",
    authDomain: "qwarks-89c09.firebaseapp.com",
    projectId: "qwarks-89c09",
    storageBucket: "qwarks-89c09.firebasestorage.app",
    messagingSenderId: "240969688862",
    appId: "1:240969688862:web:82b7d9aa521a2d15948b0f",
    measurementId: "G-JHQDNG49T7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function createAccount(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

export async function signIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

export async function signOut() {
    await auth.signOut();
}

export { createAccount, signIn, signOut };
export default app;