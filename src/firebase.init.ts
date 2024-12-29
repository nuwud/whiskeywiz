import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getDatabase } from 'firebase/database';

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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const database = getDatabase(app);

export default app;