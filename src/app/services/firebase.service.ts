// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCqZMaGpJGf5veYgTXmytg1bLerva-of0U",
    authDomain: "whiskeywiz2.firebaseapp.com",
    databaseURL: "https://whiskeywiz2-default-rtdb.firebaseio.com",
    projectId: "whiskeywiz2",
    storageBucket: "whiskeywiz2.appspot.com",
    messagingSenderId: "555320797929",
    appId: "1:555320797929:web:0d4b062d7f2ab330fc1e78",
    measurementId: "G-SK0TJJEPF5"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);
const functions = getFunctions(app);

// Export the initialized services
export { app, analytics, db, auth, storage, database, functions };