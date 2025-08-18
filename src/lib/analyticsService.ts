import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

export interface ClimbRecord {
  id: string;
  climberId: string;
  climberName: string;
  timeInSeconds: number;
  timestamp: Date;
  wallId?: string;
  wallName?: string;
  userId: string;
}

export interface WallStats {
  wallId: string;
  wallName: string;
  totalClimbs: number;
  averageTime: number;
  bestTime: number;
  climbCount: number;
}

export interface ProgressData {
  date: string;
  time: number;
  wallName: string;
}

export interface ClimberAnalytics {
  totalClimbs: number;
  bestTime: number;
  averageTime: number;
  improvement: number; // Percentage improvement over time
  wallBreakdown: WallStats[];
  progressOverTime: ProgressData[];
  recentTrend: 'improving' | 'declining' | 'stable';
}

export class AnalyticsService {
  static async getClimbHistory(userId: string, limitCount: number = 50): Promise<ClimbRecord[]> {
    try {
      const climbsQuery = query(
        collection(db, 'climbs'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(climbsQuery);
      const climbs: ClimbRecord[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        climbs.push({
          id: doc.id,
          climberId: data.climberId,
          climberName: data.climberName,
          timeInSeconds: data.timeInSeconds,
          timestamp: data.timestamp?.toDate() || new Date(),
          wallId: data.wallId,
          wallName: data.wallName,
          userId: data.userId
        });
      });

      return climbs;
    } catch (error) {
      console.error('Error fetching climb history:', error);
      throw new Error('Failed to load climb history');
    }
  }

  static async getClimberAnalytics(userId: string, climberId: string): Promise<ClimberAnalytics> {
    try {
      const climbsQuery = query(
        collection(db, 'climbs'),
        where('userId', '==', userId),
        where('climberId', '==', climberId),
        orderBy('timestamp', 'asc')
      );

      const snapshot = await getDocs(climbsQuery);
      const climbs: ClimbRecord[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        climbs.push({
          id: doc.id,
          climberId: data.climberId,
          climberName: data.climberName,
          timeInSeconds: data.timeInSeconds,
          timestamp: data.timestamp?.toDate() || new Date(),
          wallId: data.wallId,
          wallName: data.wallName,
          userId: data.userId
        });
      });

      if (climbs.length === 0) {
        return {
          totalClimbs: 0,
          bestTime: 0,
          averageTime: 0,
          improvement: 0,
          wallBreakdown: [],
          progressOverTime: [],
          recentTrend: 'stable'
        };
      }

      // Calculate basic stats
      const totalClimbs = climbs.length;
      const bestTime = Math.min(...climbs.map(c => c.timeInSeconds));
      const averageTime = climbs.reduce((sum, c) => sum + c.timeInSeconds, 0) / totalClimbs;

      // Calculate improvement over time
      const recentClimbs = climbs.slice(-5); // Last 5 climbs
      const olderClimbs = climbs.slice(0, 5); // First 5 climbs
      
      let improvement = 0;
      if (olderClimbs.length > 0 && recentClimbs.length > 0) {
        const oldAvg = olderClimbs.reduce((sum, c) => sum + c.timeInSeconds, 0) / olderClimbs.length;
        const newAvg = recentClimbs.reduce((sum, c) => sum + c.timeInSeconds, 0) / recentClimbs.length;
        improvement = oldAvg > 0 ? ((oldAvg - newAvg) / oldAvg) * 100 : 0;
      }

      // Determine recent trend
      let recentTrend: 'improving' | 'declining' | 'stable' = 'stable';
      if (recentClimbs.length >= 3) {
        const recentAvg = recentClimbs.reduce((sum, c) => sum + c.timeInSeconds, 0) / recentClimbs.length;
        const overallAvg = averageTime;
        if (recentAvg < overallAvg * 0.9) recentTrend = 'improving';
        else if (recentAvg > overallAvg * 1.1) recentTrend = 'declining';
      }

      // Wall breakdown
      const wallStats = new Map<string, WallStats>();
      climbs.forEach(climb => {
        const wallId = climb.wallId || 'unknown';
        const wallName = climb.wallName || 'Unknown Wall';
        
        if (!wallStats.has(wallId)) {
          wallStats.set(wallId, {
            wallId,
            wallName,
            totalClimbs: 0,
            averageTime: 0,
            bestTime: Infinity,
            climbCount: 0
          });
        }

        const stats = wallStats.get(wallId)!;
        stats.totalClimbs += climb.timeInSeconds;
        stats.climbCount += 1;
        stats.bestTime = Math.min(stats.bestTime, climb.timeInSeconds);
      });

      // Calculate averages for each wall
      wallStats.forEach(stats => {
        stats.averageTime = stats.totalClimbs / stats.climbCount;
        stats.totalClimbs = stats.climbCount; // Reset to count, not total time
      });

      // Progress over time (last 20 climbs for chart)
      const progressOverTime = climbs.slice(-20).map(climb => ({
        date: climb.timestamp.toLocaleDateString(),
        time: climb.timeInSeconds,
        wallName: climb.wallName || 'Unknown'
      }));

      return {
        totalClimbs,
        bestTime,
        averageTime,
        improvement,
        wallBreakdown: Array.from(wallStats.values()),
        progressOverTime,
        recentTrend
      };
    } catch (error) {
      console.error('Error calculating climber analytics:', error);
      throw new Error('Failed to calculate analytics');
    }
  }

  static async getWallAnalytics(userId: string): Promise<WallStats[]> {
    try {
      const climbsQuery = query(
        collection(db, 'climbs'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(climbsQuery);
      const wallStats = new Map<string, WallStats>();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const wallId = data.wallId || 'unknown';
        const wallName = data.wallName || 'Unknown Wall';
        const time = data.timeInSeconds;

        if (!wallStats.has(wallId)) {
          wallStats.set(wallId, {
            wallId,
            wallName,
            totalClimbs: 0,
            averageTime: 0,
            bestTime: Infinity,
            climbCount: 0
          });
        }

        const stats = wallStats.get(wallId)!;
        stats.totalClimbs += time;
        stats.climbCount += 1;
        stats.bestTime = Math.min(stats.bestTime, time);
      });

      // Calculate averages and convert totalClimbs to count
      const results = Array.from(wallStats.values()).map(stats => ({
        ...stats,
        totalClimbs: stats.climbCount,
        averageTime: stats.totalClimbs / stats.climbCount
      }));

      // Sort by climb count (most popular first)
      return results.sort((a, b) => b.climbCount - a.climbCount);
    } catch (error) {
      console.error('Error fetching wall analytics:', error);
      throw new Error('Failed to load wall analytics');
    }
  }

  static formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const hundredths = Math.floor((seconds % 1) * 100);
    
    if (mins === 0) {
      return `${secs.toString().padStart(2, '0')}:${hundredths.toString().padStart(2, '0')}`;
    } else {
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }

  static getTrendIcon(trend: 'improving' | 'declining' | 'stable'): string {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  }

  static getTrendColor(trend: 'improving' | 'declining' | 'stable'): string {
    switch (trend) {
      case 'improving': return '#059669';
      case 'declining': return '#dc2626';
      case 'stable': return '#6b7280';
      default: return '#6b7280';
    }
  }
}

