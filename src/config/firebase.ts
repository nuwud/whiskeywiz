import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCqZMaGpJGf5veYgTXmytg1bLerva-of0U',
  authDomain: 'whiskeywiz2.firebaseapp.com',
  databaseURL: 'https://whiskeywiz2-default-rtdb.firebaseio.com',
  projectId: 'whiskeywiz2',
  storageBucket: 'whiskeywiz2.appspot.com',
  messagingSenderId: '555320797929',
  appId: '1:555320797929:web:0d4b062d7f2ab330fc1e78',
  measurementId: 'G-SK0TJJEPF5'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const realdb = getDatabase(app);
export const analytics = getAnalytics(app);

// Emulator configuration
const useEmulators = process.env.REACT_APP_USE_EMULATOR === 'true';

if (useEmulators) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectDatabaseEmulator(realdb, 'localhost', 9000);
}

export default app;