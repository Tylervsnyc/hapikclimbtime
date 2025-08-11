// Firebase configuration for Hapik Climbing App
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDKM3HhRJ6YOuQkVM_VCb871VURhfTaGMM",
  authDomain: "hapik-climbing-app.firebaseapp.com",
  projectId: "hapik-climbing-app",
  storageBucket: "hapik-climbing-app.firebasestorage.app",
  messagingSenderId: "215313709367",
  appId: "1:215313709367:web:44f4726929258f32cd02b2",
  measurementId: "G-H7MYBR4K2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
export const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth (if needed later)
export const auth = getAuth(app);

// Connect to emulators in development (remove in production)
if (process.env.NODE_ENV === 'development') {
  // Uncomment these lines if you want to use Firebase emulators for testing
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectAuthEmulator(auth, 'http://localhost:9099');
}

export default app;
