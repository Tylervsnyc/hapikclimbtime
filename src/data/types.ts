// Types for our Hapik Climbing App
// This file defines the structure of our data

// A climbing attempt record
export interface ClimbRecord {
  id: string;
  studentName: string;
  wallId: string;
  wallName: string;
  timeInSeconds: number;
  timestamp: Date;
  sessionId: string; // To group climbs by camp session
}

// Student information
export interface Student {
  name: string;
  totalClimbs: number;
  bestTimes: Record<string, number>; // wallId -> best time in seconds
  averageTimes: Record<string, number>; // wallId -> average time in seconds
}

// Wall information
export interface Wall {
  id: string;
  name: string;
  description: string;
  color: string;
  imageUrl?: string; // We'll add this later when you have wall photos
}

// Camp session information
export interface Session {
  id: string;
  name: string; // e.g., "Morning Session", "Afternoon Session"
  date: Date;
  students: string[]; // List of student names in this session
}

// Statistics for a student on a specific wall
export interface WallStats {
  wallId: string;
  wallName: string;
  bestTime: number;
  averageTime: number;
  totalAttempts: number;
  lastClimbed?: Date;
}
