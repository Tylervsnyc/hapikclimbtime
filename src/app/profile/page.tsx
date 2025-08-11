'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WALLS, getStudentStats, getStudentClimbs } from '@/data/store';

export default function ProfilePage() {
  // Get the student name from the URL
  const searchParams = useSearchParams();
  const studentName = searchParams.get('student') || 'Student';

  // Get student stats
  const studentStats = getStudentStats(studentName);
  const studentClimbs = getStudentClimbs(studentName);

  // Format time as MM:SS or 00.00 for under 1 minute
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      const wholeSeconds = Math.floor(seconds);
      const hundredths = Math.floor((seconds - wholeSeconds) * 100);
      return `${wholeSeconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Find fastest wall and time
  const fastestWall = Object.entries(studentStats.bestTimes).reduce((fastest, [wallId, time]) => {
    if (time < fastest.time) {
      const wall = WALLS.find(w => w.id === wallId);
      return { wallId, time, wallName: wall?.name || 'Unknown' };
    }
    return fastest;
  }, { wallId: '', time: Infinity, wallName: '' });

  return (
    <div style={{ 
      height: '100vh', 
      background: 'linear-gradient(to bottom, #fef2f2, white)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header - Compact with small logo */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '8px 12px', 
        backgroundColor: 'white', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <img 
            src="/images/Industry City Logo Red.png" 
            alt="Hapik Logo" 
            style={{ height: '24px', width: 'auto', cursor: 'pointer' }}
          />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#dc2626' }}>
            {studentName}'s Profile
          </span>
        </div>
        <div style={{ width: '64px' }}></div>
      </div>

      {/* Student Info Header */}
      <div style={{ 
        backgroundColor: 'white', 
        margin: '8px 12px', 
        borderRadius: '8px', 
        padding: '12px', 
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
          {studentName} 🧗‍♂️
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Climbing Profile & Statistics
        </p>
      </div>

      {/* Quick Stats Overview */}
      <div style={{ 
        padding: '0 12px',
        marginBottom: '8px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '6px' 
        }}>
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>
              {studentStats.totalClimbs}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Climbs</div>
          </div>
          
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>
              {Object.keys(studentStats.bestTimes).length}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Walls Climbed</div>
          </div>
          
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>
              {fastestWall.wallName}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Fastest Wall</div>
          </div>
        </div>
      </div>

      {/* Wall-by-Wall Performance - Exact match to walls page */}
      <div style={{ 
        padding: '0 4px',
        height: 'calc(100vh - 110px)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: 'auto auto auto auto auto',
        gap: '3px',
        alignItems: 'start',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: '20px',
        minWidth: '0'
      }}>
        {WALLS.map((wall) => {
          const bestTime = studentStats.bestTimes[wall.id];
          const hasClimbed = bestTime !== undefined;
          
          return (
            <div 
              key={wall.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '3px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                opacity: hasClimbed ? 1 : 0.6,
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
                minWidth: '0',
                aspectRatio: '1'
              }}
            >
              {/* Wall Image - Square and prominent */}
              <div style={{ 
                width: '100%', 
                height: '70%', 
                borderRadius: '6px', 
                overflow: 'hidden', 
                marginBottom: '3px',
                flex: '1'
              }}>
                <img 
                  src={wall.imageUrl} 
                  alt={wall.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              
              {/* Wall Name - Bigger and bolder red text */}
              <h4 style={{ 
                fontSize: '12px', 
                fontWeight: 'bold', 
                color: '#dc2626', 
                marginBottom: '2px',
                textAlign: 'center',
                lineHeight: '1.1'
              }}>
                {wall.name}
              </h4>
              
              {/* Student Stats for this Wall - Compact */}
              <div style={{ 
                backgroundColor: '#fef2f2', 
                borderRadius: '4px', 
                padding: '2px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#dc2626' }}>
                  {hasClimbed ? formatTime(bestTime) : '00.00'}
                </div>
                <div style={{ fontSize: '6px', color: '#6b7280' }}>
                  Best
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div style={{ 
        padding: '8px 12px',
        marginTop: '8px'
      }}>
        <Link 
          href={`/walls?student=${encodeURIComponent(studentName)}`}
          style={{
            display: 'block',
            width: '100%',
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            textDecoration: 'none',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          Time {studentName} on the Walls! 🧗‍♂️
        </Link>
      </div>
    </div>
  );
}
