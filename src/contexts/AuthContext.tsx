'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name: userData.name,
              createdAt: userData.createdAt?.toDate() || new Date(),
              emailVerified: firebaseUser.emailVerified
            });
          } else {
            // User document doesn't exist, create it
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
              createdAt: new Date(),
              emailVerified: firebaseUser.emailVerified
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              name: newUser.name,
              email: newUser.email,
              createdAt: serverTimestamp(),
              emailVerified: newUser.emailVerified
            });
            
            setUser(newUser);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to load user data');
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function register(email: string, password: string, name: string) {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📝 Attempting registration for:', email, 'with name:', name);
      console.log('🔧 Firebase config check:', {
        auth: !!auth,
        authConfig: auth?.config,
        currentUser: auth?.currentUser
      });
      
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(firebaseUser);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
        emailVerified: false
      });
      
      console.log('✅ Registration successful for:', name);
      console.log('📧 Verification email sent to:', email);
      
    } catch (err: any) {
      console.error('❌ Registration failed:', err);
      console.error('❌ Error details:', {
        code: err.code,
        message: err.message,
        stack: err.stack
      });
      
      // Handle specific Firebase errors
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/configuration-not-found') {
        setError('Firebase Authentication not configured. Please check your Firebase setup.');
      } else {
        setError(`Registration failed: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔑 Attempting login for:', email);
      
      // Sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      
      console.log('✅ Login successful for:', email);
      
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      
      // Handle specific Firebase errors
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🚪 Logging out user:', user?.name);
      
      // Sign out with Firebase Auth
      await signOut(auth);
      
      console.log('✅ Logout successful');
      
    } catch (err) {
      console.error('❌ Logout failed:', err);
      setError('Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function resetPassword(email: string) {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Sending password reset email to:', email);
      
      await sendPasswordResetEmail(auth, email);
      
      console.log('✅ Password reset email sent');
      
    } catch (err: any) {
      console.error('❌ Password reset failed:', err);
      
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function resendVerification() {
    try {
      if (!auth.currentUser) {
        setError('No user is currently signed in.');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      console.log('📧 Resending verification email to:', auth.currentUser.email);
      
      await sendEmailVerification(auth.currentUser);
      
      console.log('✅ Verification email resent');
      
    } catch (err) {
      console.error('❌ Failed to resend verification email:', err);
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    resetPassword,
    resendVerification,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
