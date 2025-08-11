// Simple data store for Hapik Climbing App
// This is temporary - we'll replace it with a real database later!
import { ClimbRecord, Student, Wall, WallStats } from './types';

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
    name: 'Fishscales',
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
    name: 'Hapikwall',
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
  }
];

// Our students data
export const STUDENTS = [
  'Emma',
  'Petra',
  'Milo',
  'Hudson',
  'Walker',
  'Thalia',
  'Scarlett',
  'Aiden',
  'Danielle'
];

// In-memory storage for climb records
let climbRecords: ClimbRecord[] = [];
let currentSessionId = 'session_' + Date.now();

// Helper function to generate unique IDs
const generateId = () => 'climb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// Save a new climb record
export const saveClimb = (studentName: string, wallId: string, timeInSeconds: number): ClimbRecord => {
  const wall = WALLS.find(w => w.id === wallId);
  if (!wall) {
    throw new Error(`Wall ${wallId} not found`);
  }

  const newRecord: ClimbRecord = {
    id: generateId(),
    studentName,
    wallId,
    wallName: wall.name,
    timeInSeconds,
    timestamp: new Date(),
    sessionId: currentSessionId
  };

  climbRecords.push(newRecord);
  
  // Save to localStorage for persistence (temporary solution)
  localStorage.setItem('hapik_climbs', JSON.stringify(climbRecords));
  
  return newRecord;
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

// Get today's climb count
export const getTodayClimbCount = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return climbRecords.filter(climb => {
    const climbDate = new Date(climb.timestamp);
    climbDate.setHours(0, 0, 0, 0);
    return climbDate.getTime() === today.getTime();
  }).length;
};

// Get active students today
export const getActiveStudentsToday = (): string[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayClimbs = climbRecords.filter(climb => {
    const climbDate = new Date(climb.timestamp);
    climbDate.setHours(0, 0, 0, 0);
    return climbDate.getTime() === today.getTime();
  });

  return [...new Set(todayClimbs.map(climb => climb.studentName))];
};

// Load data from localStorage on app start
export const initializeStore = () => {
  try {
    const saved = localStorage.getItem('hapik_climbs');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert timestamp strings back to Date objects
      climbRecords = parsed.map((record: ClimbRecord) => ({
        ...record,
        timestamp: new Date(record.timestamp)
      }));
    }
  } catch {
    console.log('No saved data found, starting fresh!');
  }
};

// Clear all data (useful for testing)
export const clearAllData = () => {
  climbRecords = [];
  localStorage.removeItem('hapik_climbs');
  console.log('All climbing data cleared! Starting fresh.');
};

// Clear all data and start fresh
export const startFresh = () => {
  clearAllData();
  // Reset session
  currentSessionId = 'session_' + Date.now();
  console.log('Fresh session started:', currentSessionId);
};

// Start a new session
export const startNewSession = (sessionName: string) => {
  currentSessionId = 'session_' + Date.now();
  console.log(`Started new session: ${sessionName}`);
};
