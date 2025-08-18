'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WALLS, getStudentWallStats } from '@/data/store';
import { Suspense, useState, useEffect } from 'react';

function WallsPageContent() {
  // Get the student name from the URL
  const searchParams = useSearchParams();
  const studentName = searchParams.get('student') || 'Student';
  
  // Timer state
  const [activeTimer, setActiveTimer] = useState<{wallId: string, startTime: number} | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - activeTimer.startTime);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

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

  const startTimer = (wallId: string) => {
    setActiveTimer({ wallId, startTime: Date.now() });
    setElapsedTime(0);
  };

  const stopTimer = () => {
    if (activeTimer) {
      // Save the climb result to localStorage
      const wall = WALLS.find(w => w.id === activeTimer.wallId);
      const climbResult = {
        id: Date.now().toString(),
        studentName,
        wallName: wall?.name || activeTimer.wallId,
        timeInSeconds: elapsedTime / 1000,
        timestamp: new Date().toISOString()
      };
      
      // Get existing climbs or create new array
      const existingClimbs = localStorage.getItem('climb_history') || '[]';
      const climbs = JSON.parse(existingClimbs);
      climbs.unshift(climbResult);
      localStorage.setItem('climb_history', JSON.stringify(climbs));
      
      setActiveTimer(null);
      setElapsedTime(0);
    }
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

      {/* Active Timer Display */}
      {activeTimer && (
        <div style={{ 
          backgroundColor: 'white', 
          margin: '8px 12px', 
          borderRadius: '8px', 
          padding: '16px', 
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          border: '2px solid #dc2626'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626', marginBottom: '8px' }}>
            ⏱️ Timing {studentName} on {WALLS.find(w => w.id === activeTimer.wallId)?.name}
          </h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626', marginBottom: '16px' }}>
            {formatTime(elapsedTime / 1000)}
          </div>
          <button
            onClick={stopTimer}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🏁 Stop Timer
          </button>
        </div>
      )}

      {/* Walls Grid - Larger, more legible 3x5 layout for 15 walls with scrolling */}
      <div style={{ 
        padding: '0 4px',
        height: activeTimer ? 'calc(100vh - 200px)' : 'calc(100vh - 110px)',
        overflowY: 'auto'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '8px',
          padding: '4px'
        }}>
          {WALLS.map((wall) => {
            const stats = getStudentWallStats(studentName, wall.id);
            const isActive = activeTimer?.wallId === wall.id;
            
            return (
              <div 
                key={wall.id}
                onClick={() => !activeTimer ? startTimer(wall.id) : null}
                style={{
                  backgroundColor: isActive ? '#fef2f2' : 'white',
                  borderRadius: '8px',
                  padding: '3px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto',
                  minWidth: '0',
                  aspectRatio: '1',
                  cursor: !activeTimer ? 'pointer' : 'default',
                  border: isActive ? '2px solid #dc2626' : '1px solid #e5e7eb',
                  transition: 'all 0.2s ease'
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
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: isActive ? '#dc2626' : '#dc2626', 
                  marginBottom: '4px',
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
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#dc2626' }}>
                    {stats && stats.bestTime > 0 ? formatTime(stats.bestTime) : '00.00'}
                  </div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>
                    Best
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Note */}
      <div style={{ 
        textAlign: 'center', 
        padding: '6px', 
        color: '#9ca3af', 
        fontSize: '10px' 
      }}>
        <p>{activeTimer ? 'Timer is running! Click Stop when done.' : 'Tap a wall to start timing!'}</p>
      </div>
    </div>
  );
}

export default function WallsPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        height: '100vh', 
        background: 'linear-gradient(to bottom, #fef2f2, white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Loading Walls...</h2>
          <p>Please wait while we load the climbing walls.</p>
        </div>
      </div>
    }>
      <WallsPageContent />
    </Suspense>
  );
}
