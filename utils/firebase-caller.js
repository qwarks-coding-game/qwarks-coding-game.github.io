// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore"; 
import { getStorage, uploadBytes, ref } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG) : {}; // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

async function createAccount(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", email), {
        bots: []
    });
    return userCredential.user;
}

async function signIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

async function signOut() {
    await auth.signOut();
}

async function getUserInfo() {
    if (!auth.currentUser) {
        return null;
    }
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.email));
    if (userDoc.exists()) {
        return userDoc.data();
    } else {
        return null;
    }
}

async function createBot(bot) {
    const email = auth.currentUser.email;
    if (!email) {
        console.log("No authenticated user found");
        return;
    }
    const userDoc = await getDoc(doc(db, "users", email));
    if (userDoc.exists()) {
        const userData = userDoc.data();
        const bots = userData.bots || [];
        bots.push(bot);
        await setDoc(doc(db, "users", email), { bots });
    } else {
        console.log("User does not exist");
    }
}

async function uploadBot(bot, file) {
    const email = auth.currentUser.email;
    if (!email) {
        console.log("No authenticated user found");
        return;
    }
    // Upload the bot to Firebase Storage
    const storageRef = ref(storage, `bots/${bot}.zip`);
    await uploadBytes(storageRef, file);
}

export { createAccount, signIn, signOut, getUserInfo, createBot, uploadBot };
export default app;