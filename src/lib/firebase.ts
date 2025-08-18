// Firebase configuration for Hapik Climbing App
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
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

// Initialize Analytics (only on client side)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
