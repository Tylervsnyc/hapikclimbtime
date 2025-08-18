'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

interface Climber {
  id: string;
  name: string;
  totalClimbs: number;
  bestTime: number;
  averageTime: number;
  createdAt: Date;
  userId: string; // Parent's user ID
}

interface ClimberContextType {
  climbers: Climber[];
  addClimber: (name: string) => Promise<void>;
  recordClimb: (climberId: string, timeInSeconds: number, wallId?: string, wallName?: string) => Promise<void>;
  updateClimber: (id: string, updates: Partial<Climber>) => Promise<void>;
  deleteClimber: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ClimberContext = createContext<ClimberContextType | undefined>(undefined);

export function useClimbers() {
  const context = useContext(ClimberContext);
  if (!context) {
    throw new Error('useClimbers must be used within a ClimberProvider');
  }
  return context;
}

interface ClimberProviderProps {
  children: ReactNode;
}

export function ClimberProvider({ children }: ClimberProviderProps) {
  const { user } = useAuth();
  const [climbers, setClimbers] = useState<Climber[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load climbers when user changes
  useEffect(() => {
    if (user) {
      loadClimbers();
    } else {
      setClimbers([]);
    }
  }, [user]);

  async function loadClimbers() {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Set up real-time listener for climbers
      const climbersQuery = query(
        collection(db, 'climbers'),
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(climbersQuery, (snapshot) => {
        const climbersData: Climber[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          climbersData.push({
            id: doc.id,
            name: data.name,
            totalClimbs: data.totalClimbs || 0,
            bestTime: data.bestTime || 0,
            averageTime: data.averageTime || 0,
            createdAt: data.createdAt?.toDate() || new Date(),
            userId: data.userId
          });
        });
        setClimbers(climbersData);
        setIsLoading(false);
      }, (err) => {
        console.error('Error listening to climbers:', err);
        setError('Failed to load climbers');
        setIsLoading(false);
      });

      // Return cleanup function
      return unsubscribe;
    } catch (err) {
      console.error('Error loading climbers:', err);
      setError('Failed to load climbers');
      setIsLoading(false);
    }
  }

  async function addClimber(name: string) {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add climber to Firestore
      const climberData = {
        name,
        totalClimbs: 0,
        bestTime: 0,
        averageTime: 0,
        createdAt: serverTimestamp(),
        userId: user.id
      };

      const docRef = await addDoc(collection(db, 'climbers'), climberData);
      
      console.log('✅ Climber added to Firestore:', name, 'with ID:', docRef.id);
    } catch (err) {
      console.error('Error adding climber:', err);
      setError('Failed to add climber. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function recordClimb(climberId: string, timeInSeconds: number, wallId?: string, wallName?: string) {
    if (!user) return;

    try {
      // Find the climber
      const climber = climbers.find(c => c.id === climberId);
      if (!climber) {
        throw new Error('Climber not found');
      }

      // Calculate new stats
      const newTotalClimbs = climber.totalClimbs + 1;
      const newBestTime = climber.bestTime === 0 ? timeInSeconds : Math.min(climber.bestTime, timeInSeconds);
      
      // Calculate new average time
      const totalTime = (climber.averageTime * climber.totalClimbs) + timeInSeconds;
      const newAverageTime = totalTime / newTotalClimbs;

      // Update climber in Firestore
      const climberRef = doc(db, 'climbers', climberId);
      await updateDoc(climberRef, {
        totalClimbs: newTotalClimbs,
        bestTime: newBestTime,
        averageTime: newAverageTime
      });

      // Also add the climb record to a separate collection for detailed history
      await addDoc(collection(db, 'climbs'), {
        climberId,
        climberName: climber.name,
        timeInSeconds,
        timestamp: serverTimestamp(),
        wallId,
        wallName,
        userId: user.id
      });

      console.log('✅ Climb recorded for climber:', climber.name, 'Time:', timeInSeconds);
    } catch (err) {
      console.error('Error recording climb:', err);
      setError('Failed to record climb. Please try again.');
    }
  }

  async function updateClimber(id: string, updates: Partial<Climber>) {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Update climber in Firestore
      const climberRef = doc(db, 'climbers', id);
      const updateData: any = {};
      
      // Only update allowed fields
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.totalClimbs !== undefined) updateData.totalClimbs = updates.totalClimbs;
      if (updates.bestTime !== undefined) updateData.bestTime = updates.bestTime;
      if (updates.averageTime !== undefined) updateData.averageTime = updates.averageTime;

      await updateDoc(climberRef, updateData);

      console.log('✅ Climber updated in Firestore:', id);
    } catch (err) {
      console.error('Error updating climber:', err);
      setError('Failed to update climber. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteClimber(id: string) {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Delete climber from Firestore
      await deleteDoc(doc(db, 'climbers', id));

      console.log('✅ Climber deleted from Firestore:', id);
    } catch (err) {
      console.error('Error deleting climber:', err);
      setError('Failed to delete climber. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const value: ClimberContextType = {
    climbers,
    addClimber,
    recordClimb,
    updateClimber,
    deleteClimber,
    isLoading,
    error
  };

  return (
    <ClimberContext.Provider value={value}>
      {children}
    </ClimberContext.Provider>
  );
}
