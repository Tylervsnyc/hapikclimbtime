'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { WALLS, saveClimb, getStudentWallStats, subscribeToRealTimeUpdates } from '@/data/store';
import { WallStats } from '@/data/types';

function ClimbPageContent() {
  // Get student and wall from URL
  const searchParams = useSearchParams();
  const router = useRouter();
  const studentName = searchParams.get('student') || 'Student';
  const wallId = searchParams.get('wall') || 'wall1';
  
  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [wallStats, setWallStats] = useState<WallStats | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get wall info
  const wallInfo = WALLS.find(w => w.id === wallId);

  // Load wall stats for this student and subscribe to real-time updates
  useEffect(() => {
    if (studentName && wallId) {
      const stats = getStudentWallStats(studentName, wallId);
      setWallStats(stats);
      
      // Subscribe to real-time updates
      const unsubscribe = subscribeToRealTimeUpdates(() => {
        // Update stats when new data comes in
        const updatedStats = getStudentWallStats(studentName, wallId);
        setWallStats(updatedStats);
      });
      
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [studentName, wallId]);

  // Timer logic - Update every 10ms for smooth display of hundredths
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 0.01);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

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

  // Start/Stop timer
  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      setShowSaveDialog(true);
    } else {
      setTime(0);
      setIsRunning(true);
    }
  };

  // Save the time to our data store
  const saveTime = async () => {
    try {
      if (wallInfo) {
        await saveClimb(studentName, wallId, time);
        console.log(`Saved time: ${studentName} on ${wallInfo.name} - ${formatTime(time)}`);
        
        // Update the stats display
        const newStats = getStudentWallStats(studentName, wallId);
        setWallStats(newStats);
      }
    } catch (error) {
      console.error('Error saving time:', error);
    }
    
    setShowSaveDialog(false);
    setTime(0);
    // Go back to walls page
    router.push(`/walls?student=${encodeURIComponent(studentName)}`);
  };

  // Reset timer
  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
    setShowSaveDialog(false);
  };

  if (!wallInfo) {
    return (
      <div style={{ 
        height: '100vh', 
        background: 'linear-gradient(to bottom, #fef2f2, white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Wall Not Found</h2>
          <p>The selected wall could not be found.</p>
          <Link href="/" style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-block',
            marginTop: '16px'
          }}>
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100vh', 
      background: 'linear-gradient(to bottom, #fef2f2, white)',
      overflow: 'hidden',
      overflowX: 'hidden',
      minWidth: '0'
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
            {wallInfo.name}
          </span>
        </div>
        <div style={{ width: '64px' }}></div>
      </div>

      {/* Wall Image Header */}
      <div style={{ 
        width: '100%',
        height: '60px',
        overflow: 'hidden',
        marginBottom: '8px'
      }}>
        <img 
          src={wallInfo.imageUrl} 
          alt={wallInfo.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Student Info - Super compact */}
      <div style={{ 
        backgroundColor: 'white', 
        margin: '0 12px 8px 12px', 
        borderRadius: '8px', 
        padding: '8px', 
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          fontSize: '16px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: '0'
        }}>
          Timing {studentName} on {wallInfo.name}
        </h2>
      </div>

      {/* Main Timer Section */}
      <div style={{ 
        padding: '0 12px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {/* Big Timer Display */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '24px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            fontSize: '64px', 
            fontFamily: 'monospace', 
            fontWeight: 'bold', 
            color: '#dc2626',
            marginBottom: '16px'
          }}>
            {formatTime(time)}
          </div>
          
          {/* Timer Controls - Much Bigger Button */}
          <button
            onClick={toggleTimer}
            style={{
              backgroundColor: isRunning ? '#dc2626' : '#059669',
              color: 'white',
              padding: '20px 40px',
              borderRadius: '16px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '24px',
              cursor: 'pointer',
              minHeight: '80px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease'
            }}
          >
            {isRunning ? '⏹️ Stop Timer' : '▶️ Start Timer'}
          </button>
        </div>

        {/* Wall Statistics */}
        {wallStats && (
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              {studentName}&apos;s Stats on {wallInfo.name}
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px' 
            }}>
              <div style={{ 
                backgroundColor: '#fef2f2', 
                borderRadius: '8px', 
                padding: '12px' 
              }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>
                  {formatTime(wallStats.bestTime)}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Best Time</div>
              </div>
              <div style={{ 
                backgroundColor: '#eff6ff', 
                borderRadius: '8px', 
                padding: '12px' 
              }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>
                  {formatTime(wallStats.averageTime)}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Average Time</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Total Attempts: <span style={{ fontWeight: 'bold', color: '#dc2626' }}>{wallStats.totalAttempts}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Time Dialog */}
      {showSaveDialog && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '16px', 
          zIndex: 50 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '20px', 
            padding: '24px', 
            maxWidth: '400px', 
            width: '100%', 
            textAlign: 'center' 
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
              Save This Time?
            </h3>
            <div style={{ 
              fontSize: '36px', 
              fontFamily: 'monospace', 
              fontWeight: 'bold', 
              color: '#dc2626', 
              marginBottom: '16px' 
            }}>
              {formatTime(time)}
            </div>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              {studentName} completed {wallInfo.name} in {formatTime(time)}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={saveTime}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                ✅ Save Time
              </button>
              <button
                onClick={resetTimer}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                ❌ Don&apos;t Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClimbPage() {
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
          <h2>Loading Timer...</h2>
          <p>Please wait while we load the climbing timer.</p>
        </div>
        </div>
    }>
      <ClimbPageContent />
    </Suspense>
  );
}
