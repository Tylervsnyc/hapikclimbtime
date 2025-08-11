// Firebase service for Hapik Climbing App
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { ClimbRecord, WallStats } from '@/data/types';

// Collection names
const COLLECTIONS = {
  CLIMBS: 'climbs',
  WEEKS: 'weeks',
  STUDENTS: 'students'
};

// Convert Date to Firestore Timestamp
const toFirestoreTimestamp = (date: Date) => Timestamp.fromDate(date);

// Convert Firestore Timestamp to Date
const fromFirestoreTimestamp = (timestamp: any) => timestamp?.toDate() || new Date();

// Save a new climb record to Firebase
export const saveClimbToFirebase = async (
  studentName: string, 
  wallId: string, 
  timeInSeconds: number,
  weekId: string
): Promise<string> => {
  try {
    const climbData = {
      studentName,
      wallId,
      timeInSeconds,
      weekId,
      timestamp: toFirestoreTimestamp(new Date()),
      sessionId: `session_${Date.now()}`,
      createdAt: toFirestoreTimestamp(new Date())
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.CLIMBS), climbData);
    console.log(`✅ Climb saved to Firebase with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving climb to Firebase:', error);
    throw error;
  }
};

// Get all climbs for a specific week
export const getWeekClimbs = async (weekId: string): Promise<ClimbRecord[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.CLIMBS),
      where('weekId', '==', weekId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const climbs: ClimbRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      climbs.push({
        id: doc.id,
        studentName: data.studentName,
        wallId: data.wallId,
        wallName: data.wallName || 'Unknown Wall',
        timeInSeconds: data.timeInSeconds,
        timestamp: fromFirestoreTimestamp(data.timestamp),
        sessionId: data.sessionId
      });
    });
    
    console.log(`📊 Loaded ${climbs.length} climbs for week ${weekId}`);
    return climbs;
  } catch (error) {
    console.error('❌ Error loading climbs from Firebase:', error);
    return [];
  }
};

// Get climbs for a specific student in a week
export const getStudentWeekClimbs = async (
  studentName: string, 
  weekId: string
): Promise<ClimbRecord[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.CLIMBS),
      where('weekId', '==', weekId),
      where('studentName', '==', studentName),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const climbs: ClimbRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      climbs.push({
        id: doc.id,
        studentName: data.studentName,
        wallId: data.wallId,
        wallName: data.wallName || 'Unknown Wall',
        timeInSeconds: data.timeInSeconds,
        timestamp: fromFirestoreTimestamp(data.timestamp),
        sessionId: data.sessionId
      });
    });
    
    return climbs;
  } catch (error) {
    console.error('❌ Error loading student climbs from Firebase:', error);
    return [];
  }
};

// Real-time listener for climbs in a week
export const subscribeToWeekClimbs = (
  weekId: string, 
  callback: (climbs: ClimbRecord[]) => void
) => {
  const q = query(
    collection(db, COLLECTIONS.CLIMBS),
    where('weekId', '==', weekId),
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const climbs: ClimbRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      climbs.push({
        id: doc.id,
        studentName: data.studentName,
        wallId: data.wallId,
        wallName: data.wallName || 'Unknown Wall',
        timeInSeconds: data.timeInSeconds,
        timestamp: fromFirestoreTimestamp(data.timestamp),
        sessionId: data.sessionId
      });
    });
    
    callback(climbs);
  });
};

// Delete a climb record
export const deleteClimb = async (climbId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.CLIMBS, climbId));
    console.log(`🗑️ Climb deleted: ${climbId}`);
    return true;
  } catch (error) {
    console.error('❌ Error deleting climb:', error);
    return false;
  }
};

// Update a climb record
export const updateClimb = async (
  climbId: string, 
  updates: Partial<ClimbRecord>
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.CLIMBS, climbId);
    const updateData: any = { ...updates };
    
    // Convert Date to Timestamp if present
    if (updates.timestamp) {
      updateData.timestamp = toFirestoreTimestamp(updates.timestamp);
    }
    
    await updateDoc(docRef, updateData);
    console.log(`✏️ Climb updated: ${climbId}`);
    return true;
  } catch (error) {
    console.error('❌ Error updating climb:', error);
    return false;
  }
};

// Get real-time stats for a student on a specific wall
export const getStudentWallStatsRealTime = (
  studentName: string,
  wallId: string,
  weekId: string,
  callback: (stats: WallStats | null) => void
) => {
  const q = query(
    collection(db, COLLECTIONS.CLIMBS),
    where('weekId', '==', weekId),
    where('studentName', '==', studentName),
    where('wallId', '==', wallId),
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.empty) {
      callback(null);
      return;
    }
    
    const climbs = querySnapshot.docs.map(doc => doc.data());
    const times = climbs.map(climb => climb.timeInSeconds);
    const bestTime = Math.min(...times);
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    
    const stats: WallStats = {
      wallId,
      wallName: climbs[0].wallName || 'Unknown Wall',
      bestTime,
      averageTime,
      totalAttempts: climbs.length,
      lastClimbed: fromFirestoreTimestamp(climbs[0].timestamp)
    };
    
    callback(stats);
  });
};
