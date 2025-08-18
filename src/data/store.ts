// Data store for Hapik Climbing App with Firebase integration
import { ClimbRecord, Student, Wall, WallStats } from './types';
import { 
  saveClimbToFirebase, 
  getWeekClimbs, 
  subscribeToWeekClimbs
} from '@/lib/firebaseService';

// Our climbing walls data - using the 15 uploaded images!
export const WALLS: Wall[] = [
  {
    id: 'wall1',
    name: 'Slight of Hand',
    description: 'A tricky wall that requires finesse and precision',
    color: 'bg-orange-500',
    imageUrl: '/images/slightofhand.png'
  },
  {
    id: 'wall2',
    name: 'Kubrik',
    description: 'A challenging wall with unique holds and angles',
    color: 'bg-blue-500',
    imageUrl: '/images/kubrik.png'
  },
  {
    id: 'wall3',
    name: 'Matrix',
    description: 'A complex wall with multiple route options',
    color: 'bg-green-500',
    imageUrl: '/images/matrix.png'
  },
  {
    id: 'wall4',
    name: 'Vines',
    description: 'A natural-feeling wall with flowing movements',
    color: 'bg-purple-500',
    imageUrl: '/images/vines.png'
  },
  {
    id: 'wall5',
    name: 'Rubiks',
    description: 'A puzzle-like wall with strategic climbing patterns',
    color: 'bg-yellow-500',
    imageUrl: '/images/rubiks.png'
  },
  {
    id: 'wall6',
    name: 'Walk the Plank',
    description: 'A daring wall that tests balance and courage',
    color: 'bg-red-500',
    imageUrl: '/images/walktheplank.png'
  },
  {
    id: 'wall7',
    name: 'Stairs',
    description: 'A step-by-step wall with progressive difficulty',
    color: 'bg-indigo-500',
    imageUrl: '/images/stairs.png'
  },
  {
    id: 'wall8',
    name: 'Sprint',
    description: 'A fast-paced wall for quick climbing challenges',
    color: 'bg-pink-500',
    imageUrl: '/images/sprint.png'
  },
  {
    id: 'wall9',
    name: 'Chevron',
    description: 'A directional wall with angular climbing patterns',
    color: 'bg-teal-500',
    imageUrl: '/images/chevron.png'
  },
  {
    id: 'wall10',
    name: 'Networks',
    description: 'A connected wall with multiple route intersections',
    color: 'bg-amber-500',
    imageUrl: '/images/networks.png'
  },
  {
    id: 'wall11',
    name: 'Fish Scales',
    description: 'A textured wall with overlapping scale-like holds',
    color: 'bg-rose-500',
    imageUrl: '/images/fishscales.png'
  },
  {
    id: 'wall12',
    name: 'Geoloco',
    description: 'A geological-inspired wall with natural rock formations',
    color: 'bg-slate-500',
    imageUrl: '/images/geoloco.png'
  },
  {
    id: 'wall13',
    name: 'Slalom',
    description: 'A winding wall with zigzag climbing patterns',
    color: 'bg-emerald-500',
    imageUrl: '/images/Salalom.png'
  },
  {
    id: 'wall14',
    name: 'Hapik Wall',
    description: 'The signature wall with classic climbing challenges',
    color: 'bg-cyan-500',
    imageUrl: '/images/Hapikwall.png'
  },
  {
    id: 'wall15',
    name: 'Mazes',
    description: 'A complex wall with intricate route puzzles',
    color: 'bg-violet-500',
    imageUrl: '/images/Mazes.png'
  },
  {
    id: 'wall16',
    name: 'Olympics',
    description: 'A competitive wall designed for Olympic-style climbing challenges',
    color: 'bg-orange-600',
    imageUrl: '/images/olympics.png'
  },
  {
    id: 'wall17',
    name: 'Puzzle',
    description: 'A brain-teasing wall that requires strategic problem-solving',
    color: 'bg-purple-600',
    imageUrl: '/images/puzzle.png'
  },
  {
    id: 'wall18',
    name: 'Windows',
    description: 'A unique wall with window-like openings and creative routes',
    color: 'bg-sky-500',
    imageUrl: '/images/windows.png'
  }
];

// Weekly data configuration
export const WEEKLY_DATA = {
  'aug11-15': {
    name: 'August 11-15, 2024',
    startDate: '2024-08-11',
    endDate: '2024-08-15',
    students: [
      'Emma',
      'Petra', 
      'Milo',
      'Hudson',
      'Walker',
      'Thalia',
      'Scarlett',
      'Aiden',
      'Danielle'
    ]
  }
};

// Current week - change this to switch between weeks
export const CURRENT_WEEK = 'aug11-15';

// Get current week's students
export const STUDENTS = WEEKLY_DATA[CURRENT_WEEK].students;

// Helper function to generate unique IDs
const generateId = () => 'climb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// Save a new climb record
export const saveClimb = async (studentName: string, wallId: string, timeInSeconds: number): Promise<ClimbRecord> => {
  const wall = WALLS.find(w => w.id === wallId);
  if (!wall) {
    throw new Error(`Wall ${wallId} not found`);
  }

  console.log(`🚀 Starting to save climb: ${studentName} on ${wall.name} - ${timeInSeconds}s`);

  // Save to Firebase first for real-time sharing across all devices
  try {
    const firebaseId = await saveClimbToFirebase(studentName, wallId, timeInSeconds, CURRENT_WEEK);
    console.log(`✅ Climb saved to Firebase with ID: ${firebaseId}`);
    
    // Create record with Firebase ID
    const newRecord: ClimbRecord = {
      id: firebaseId, // Use Firebase ID instead of generated ID
      studentName,
      wallId,
      wallName: wall.name,
      timeInSeconds,
      timestamp: new Date(),
      sessionId: currentSessionId
    };

    // Add to memory
    climbRecords.push(newRecord);
    
    // Save to localStorage as backup
    localStorage.setItem(`hapik_climbs_${CURRENT_WEEK}`, JSON.stringify(climbRecords));
    console.log(`📊 Total climbs this week: ${climbRecords.length}`);
    
    return newRecord;
  } catch (error) {
    console.error('❌ Failed to save climb to Firebase:', error);
    
    // Fallback: create record with generated ID and save to localStorage only
    const newRecord: ClimbRecord = {
      id: generateId(),
      studentName,
      wallId,
      wallName: wall.name,
      timeInSeconds,
      timestamp: new Date(),
      sessionId: currentSessionId
    };

    // Add to memory
    climbRecords.push(newRecord);
    
    // Save to localStorage as backup
    try {
      localStorage.setItem(`hapik_climbs_${CURRENT_WEEK}`, JSON.stringify(climbRecords));
      console.log(`💾 Saved to localStorage as backup`);
    } catch (localError) {
      console.error('❌ Failed to save to localStorage:', localError);
    }
    
    return newRecord;
  }
};

// Get all climb records for a student
export const getStudentClimbs = (studentName: string): ClimbRecord[] => {
  return climbRecords.filter(climb => climb.studentName === studentName);
};

// Get all climb records for a specific wall
export const getWallClimbs = (wallId: string): ClimbRecord[] => {
  return climbRecords.filter(climb => climb.wallId === wallId);
};

// Get statistics for a student on a specific wall
export const getStudentWallStats = (studentName: string, wallId: string): WallStats | null => {
  const wallClimbs = climbRecords.filter(
    climb => climb.studentName === studentName && climb.wallId === wallId
  );

  if (wallClimbs.length === 0) {
    return null;
  }

  const times = wallClimbs.map(climb => climb.timeInSeconds);
  const bestTime = Math.min(...times);
  const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
  const totalAttempts = wallClimbs.length;
  const lastClimbed = wallClimbs[wallClimbs.length - 1].timestamp;

  const wall = WALLS.find(w => w.id === wallId);
  
  return {
    wallId,
    wallName: wall?.name || 'Unknown Wall',
    bestTime,
    averageTime,
    totalAttempts,
    lastClimbed
  };
};

// Get overall statistics for a student
export const getStudentStats = (studentName: string): Student => {
  const studentClimbs = getStudentClimbs(studentName);
  const bestTimes: Record<string, number> = {};
  const averageTimes: Record<string, number> = {};

  // Calculate best and average times for each wall
  WALLS.forEach(wall => {
    const wallStats = getStudentWallStats(studentName, wall.id);
    if (wallStats) {
      bestTimes[wall.id] = wallStats.bestTime;
      averageTimes[wall.id] = wallStats.averageTime;
    }
  });

  return {
    name: studentName,
    totalClimbs: studentClimbs.length,
    bestTimes,
    averageTimes
  };
};

// Get this week's climb count
export const getThisWeekClimbCount = (): number => {
  return climbRecords.length; // All records in current week
};

// Get active students this week
export const getActiveStudentsThisWeek = (): string[] => {
  return [...new Set(climbRecords.map(climb => climb.studentName))];
};

// Load data from Firebase and localStorage for current week
export const initializeStore = async () => {
  // TODAY ONLY: Clear all existing data to start fresh
  try {
    // Clear localStorage for fresh start today
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('hapik_climbs_')) {
        localStorage.removeItem(key);
        console.log(`🧹 Cleared: ${key}`);
      }
    });
    console.log(`🆕 Starting completely fresh today with new parent authentication system`);
  } catch (error) {
    console.log(`🆕 Starting fresh (localStorage clear failed)`);
  }
  
  // Initialize with empty data
  climbRecords = [];
  currentSessionId = 'session_' + Date.now();
  
  // TEMPORARILY DISABLE FIREBASE TO FOCUS ON AUTH SYSTEM
  console.log('🚫 Firebase queries temporarily disabled - focusing on authentication system');
};

// Reload data from localStorage (useful when switching between students)
export const reloadData = () => {
  try {
    const saved = localStorage.getItem(`hapik_climbs_${CURRENT_WEEK}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert timestamp strings back to Date objects
      climbRecords = parsed.map((record: ClimbRecord) => ({
        ...record,
        timestamp: new Date(record.timestamp)
      }));
      console.log(`🔄 Reloaded ${climbRecords.length} climbs for ${WEEKLY_DATA[CURRENT_WEEK].name}`);
      return true;
    } else {
      console.log(`📭 No saved data found for ${WEEKLY_DATA[CURRENT_WEEK].name}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error reloading data for ${WEEKLY_DATA[CURRENT_WEEK].name}:`, error);
    return false;
  }
};

// Clear all data for current week
export const clearAllData = () => {
  climbRecords = [];
  localStorage.removeItem(`hapik_climbs_${CURRENT_WEEK}`);
  console.log(`All climbing data cleared for ${WEEKLY_DATA[CURRENT_WEEK].name}!`);
};

// Clear all data and start fresh
export const startFresh = () => {
  clearAllData();
  // Reset session
  currentSessionId = 'session_' + Date.now();
  console.log(`Fresh session started for ${WEEKLY_DATA[CURRENT_WEEK].name}:`, currentSessionId);
};

// Start a new session
export const startNewSession = (sessionName: string) => {
  currentSessionId = 'session_' + Date.now();
  console.log(`Started new session: ${sessionName}`);
};

// In-memory storage for climb records
let climbRecords: ClimbRecord[] = []; // Starting fresh today!
let currentSessionId = 'session_' + Date.now();



// Subscribe to real-time updates from Firebase
export const subscribeToRealTimeUpdates = (callback: (climbRecords: ClimbRecord[]) => void) => {
  console.log(`🔄 Setting up real-time subscription for week: ${CURRENT_WEEK}`);
  
  return subscribeToWeekClimbs(CURRENT_WEEK, (firebaseClimbs) => {
    console.log(`📡 Store received real-time update: ${firebaseClimbs.length} climbs`);
    
    // Update local memory
    climbRecords = firebaseClimbs;
    
    // Update localStorage
    localStorage.setItem(`hapik_climbs_${CURRENT_WEEK}`, JSON.stringify(climbRecords));
    
    // Call the callback to update UI
    callback(climbRecords);
    
    console.log(`🔄 Real-time update: ${climbRecords.length} climbs for ${WEEKLY_DATA[CURRENT_WEEK].name}`);
  });
};

// Analytics functions for manager's view
export const getWallPopularityStats = (): Array<{wallId: string, wallName: string, climbCount: number, percentage: number}> => {
  const totalClimbs = climbRecords.length;
  if (totalClimbs === 0) return [];

  return WALLS.map(wall => {
    const climbs = climbRecords.filter(climb => climb.wallId === wall.id);
    const climbCount = climbs.length;
    const percentage = totalClimbs > 0 ? (climbCount / totalClimbs) * 100 : 0;
    
    return {
      wallId: wall.id,
      wallName: wall.name,
      climbCount,
      percentage: Math.round(percentage * 10) / 10
    };
  })
  .filter(wall => wall.climbCount > 0)
  .sort((a, b) => b.climbCount - a.climbCount);
};

export const getStudentActivityStats = (): Array<{studentName: string, climbCount: number, averageTime: number, bestTime: number}> => {
  return STUDENTS.map(student => {
    const climbs = climbRecords.filter(climb => climb.studentName === student);
    const climbCount = climbs.length;
    
    if (climbCount === 0) {
      return {
        studentName: student,
        climbCount: 0,
        averageTime: 0,
        bestTime: 0
      };
    }
    
    const times = climbs.map(climb => climb.timeInSeconds);
    const averageTime = Math.round(times.reduce((sum, time) => sum + time, 0) / times.length);
    const bestTime = Math.min(...times);
    
    return {
      studentName: student,
      climbCount,
      averageTime,
      bestTime
    };
  })
  .filter(student => student.climbCount > 0)
  .sort((a, b) => b.climbCount - a.climbCount);
};

export const getWeeklyTrends = (): Array<{day: string, climbCount: number, uniqueStudents: number}> => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
  
  return days.map((day, index) => {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + index);
    
    const dayStart = new Date(dayDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    const dayClimbs = climbRecords.filter(climb => {
      const climbDate = new Date(climb.timestamp);
      return climbDate >= dayStart && climbDate <= dayEnd;
    });
    
    const uniqueStudents = [...new Set(dayClimbs.map(climb => climb.studentName))].length;
    
    return {
      day,
      climbCount: dayClimbs.length,
      uniqueStudents
    };
  });
};
