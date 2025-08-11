'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WALLS, getStudentWallStats } from '@/data/store';

export default function WallsPage() {
  // Get the student name from the URL
  const searchParams = useSearchParams();
  const studentName = searchParams.get('student') || 'Student';

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

  return (
    <div style={{ 
      height: '100vh', 
      background: 'linear-gradient(to bottom, #fef2f2, white)',
      overflow: 'hidden'
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
        <Link 
          href="/" 
          style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '4px 8px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          ← Back
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <img 
              src="/images/Industry City Logo Red.png" 
              alt="Hapik Logo" 
              style={{ height: '24px', width: 'auto', cursor: 'pointer' }}
            />
          </Link>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#dc2626' }}>
            Choose Your Wall
          </span>
        </div>
        <div style={{ width: '64px' }}></div>
      </div>

      {/* Student Info - Super compact */}
      <div style={{ 
        backgroundColor: 'white', 
        margin: '8px 12px', 
        borderRadius: '8px', 
        padding: '8px', 
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
          Time {studentName} on the Walls! 🧗‍♂️
        </h2>
      </div>

      {/* Walls Grid - Larger, more legible 3x5 layout for 15 walls with scrolling */}
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
          const stats = getStudentWallStats(studentName, wall.id);
          return (
            <Link 
              key={wall.id}
              href={`/climb?student=${encodeURIComponent(studentName)}&wall=${wall.id}`}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '3px',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
              <h3 style={{ 
                fontSize: '12px', 
                fontWeight: 'bold', 
                color: '#dc2626', 
                marginBottom: '2px',
                textAlign: 'center',
                lineHeight: '1.1'
              }}>
                {wall.name}
              </h3>
              
              {/* Student Stats for this Wall - Compact */}
              <div style={{ 
                backgroundColor: '#fef2f2', 
                borderRadius: '4px', 
                padding: '2px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#dc2626' }}>
                  {stats && stats.bestTime > 0 ? formatTime(stats.bestTime) : '00.00'}
                </div>
                <div style={{ fontSize: '6px', color: '#6b7280' }}>
                  Best
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Navigation Note */}
      <div style={{ 
        textAlign: 'center', 
        padding: '6px', 
        color: '#9ca3af', 
        fontSize: '10px' 
      }}>
        <p>Tap a wall to start timing {studentName}&apos;s climb!</p>
      </div>
    </div>
  );
}
