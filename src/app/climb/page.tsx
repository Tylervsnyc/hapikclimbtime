'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClimbers } from '@/contexts/ClimberContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Industry City specific walls
const WALLS = [
  { id: 'stairs', name: 'Stairs', image: '/images/stairs.png' },
  { id: 'fishscales', name: 'Fish Scales', image: '/images/fishscales.png' },
  { id: 'geoloco', name: 'Geo Loco', image: '/images/geoloco.png' },
  { id: 'kubrik', name: 'Kubrik', image: '/images/kubrik.png' },
  { id: 'matrix', name: 'Matrix', image: '/images/matrix.png' },
  { id: 'mazes', name: 'Mazes', image: '/images/Mazes.png' },
  { id: 'networks', name: 'Networks', image: '/images/networks.png' },
  { id: 'olympics', name: 'Olympics', image: '/images/olympics.png' },
  { id: 'puzzle', name: 'Puzzle', image: '/images/puzzle.png' },
  { id: 'rubiks', name: 'Rubiks', image: '/images/rubiks.png' },
  { id: 'salalom', name: 'Salalom', image: '/images/Salalom.png' },
  { id: 'slightofhand', name: 'Slight of Hand', image: '/images/slightofhand.png' },
  { id: 'sprint', name: 'Sprint', image: '/images/sprint.png' },
  { id: 'vines', name: 'Vines', image: '/images/vines.png' },
  { id: 'walktheplank', name: 'Walk the Plank', image: '/images/walktheplank.png' },
  { id: 'windows', name: 'Windows', image: '/images/windows.png' }
];

interface ClimbSession {
  id: string;
  climberId: string;
  climberName: string;
  wallId: string;
  wallName: string;
  startTime: Date;
  endTime?: Date;
  timeInSeconds?: number;
  isActive: boolean;
}

export default function ClimbPage() {
  const { user } = useAuth();
  const { climbers, recordClimb } = useClimbers();
  const router = useRouter();
  
  const [selectedClimber, setSelectedClimber] = useState<string>('');
  const [selectedWall, setSelectedWall] = useState<string>('');
  const [activeSession, setActiveSession] = useState<ClimbSession | null>(null);
  const [climbHistory, setClimbHistory] = useState<ClimbSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showClimberDropdown, setShowClimberDropdown] = useState(false);
  const [showTimerWindow, setShowTimerWindow] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [completedTime, setCompletedTime] = useState<number>(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  // Load climb history from localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`climb_history_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved).map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined
        }));
        setClimbHistory(parsed);
      }
    }
  }, [user]);

  // Timer logic
  useEffect(() => {
    if (activeSession?.isActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 0.01);
      }, 10);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeSession?.isActive]);

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    
    if (mins === 0) {
      // Always show SS:TT format (seconds:tenths)
      return `${secs.toString().padStart(2, '0')}:${tenths.toString().padStart(2, '0')}`;
    } else {
      // Show MM:SS format after first minute
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }

  function handleStartClimb() {
    if (!selectedClimber || !selectedWall) return;

    const climber = climbers.find(c => c.id === selectedClimber);
    const wall = WALLS.find(w => w.id === selectedWall);
    
    if (!climber || !wall) return;

    const newSession: ClimbSession = {
      id: `session_${Date.now()}`,
      climberId: selectedClimber,
      climberName: climber.name,
      wallId: selectedWall,
      wallName: wall.name,
      startTime: new Date(),
      isActive: true
    };

    setActiveSession(newSession);
    setElapsedTime(0);
  }

  async function saveClimbTime() {
    if (!activeSession) return;

    const endTime = new Date();
    const timeInSeconds = (endTime.getTime() - activeSession.startTime.getTime()) / 1000;

    const completedSession: ClimbSession = {
      ...activeSession,
      endTime,
      timeInSeconds,
      isActive: false
    };

    // Add to history
    const updatedHistory = [completedSession, ...climbHistory];
    setClimbHistory(updatedHistory);

    // Save to localStorage
    if (user) {
      localStorage.setItem(`climb_history_${user.id}`, JSON.stringify(updatedHistory));
    }

    // Update climber stats
    await recordClimb(activeSession.climberId, timeInSeconds, activeSession.wallId, activeSession.wallName);

    console.log('✅ Climb completed:', {
      climber: completedSession.climberName,
      wall: completedSession.wallName,
      time: formatTime(timeInSeconds)
    });
  }

  function handleStopClimb() {
    if (!activeSession) return;
    
    const endTime = new Date();
    const timeInSeconds = (endTime.getTime() - activeSession.startTime.getTime()) / 1000;
    
    setCompletedTime(timeInSeconds);
    setShowSaveDialog(true);
  }

  function handleCancelClimb() {
    setActiveSession(null);
    setElapsedTime(0);
    setSelectedClimber('');
    setSelectedWall('');
  }

  function handleWallClick(wallId: string) {
    if (climbers.length === 0) {
      alert('Please add climbers to your account first!');
      return;
    }
    
    setSelectedWall(wallId);
    setShowClimberDropdown(true);
  }

  // Show loading or redirect state
  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: '16px', 
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)', 
        padding: '20px',
        marginBottom: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '500px',
        margin: '0 auto 20px auto'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{ marginBottom: '12px' }}>
            <img 
              src="/images/Industry City Logo Red.png" 
              alt="Hapik Logo" 
              style={{ height: '45px', width: 'auto' }}
            />
          </div>
          
          <h1 style={{ 
            fontSize: '22px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            margin: '0 0 6px 0'
          }}>
            Climbing Timer
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            margin: 0
          }}>
            Select a wall and start timing your climbs
          </p>
          
          <Link href="/dashboard" style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            backgroundColor: '#7c3aed',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '12px',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
          }}>
            ← Back
          </Link>
        </div>
      </div>

      {/* Wall Grid */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: 'white',
          margin: '0 0 20px 0',
          textAlign: 'center',
          backgroundColor: '#7c3aed',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)'
        }}>
          Select a Wall to Climb
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '12px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          {WALLS.map(wall => (
            <div
              key={wall.id}
              style={{
                border: selectedWall === wall.id ? '3px solid #7c3aed' : '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: selectedWall === wall.id ? '#f3f4f6' : 'white',
                transform: selectedWall === wall.id ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selectedWall === wall.id ? '0 8px 25px rgba(124, 58, 237, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
              onClick={() => handleWallClick(wall.id)}
            >
              <div style={{
                width: '100%',
                height: '50px',
                marginBottom: '8px',
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundColor: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src={wall.image} 
                  alt={wall.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </div>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: '600', 
                color: selectedWall === wall.id ? '#7c3aed' : '#374151',
                transition: 'color 0.3s ease',
                lineHeight: '1.2'
              }}>
                {wall.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Climber Selection Dropdown */}
      {showClimberDropdown && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '100px'
          }}
          onClick={() => setShowClimberDropdown(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.25)',
              minWidth: '300px',
              maxWidth: '400px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: '0 0 16px 0',
              textAlign: 'center'
            }}>
              Select Climber
            </h3>
            
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              margin: '0 0 20px 0',
              textAlign: 'center'
            }}>
              Who is climbing {WALLS.find(w => w.id === selectedWall)?.name}?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {climbers.map(climber => (
                <button
                  key={climber.id}
                  onClick={() => {
                    setSelectedClimber(climber.id);
                    setShowClimberDropdown(false);
                    setShowTimerWindow(true);
                  }}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    padding: '14px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  {climber.name}
                </button>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setShowClimberDropdown(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  padding: '10px 20px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timer Window */}
      {showTimerWindow && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center'
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#1f2937',
                margin: '0 0 8px 0'
              }}>
                {climbers.find(c => c.id === selectedClimber)?.name}
              </h2>
              <p style={{ 
                fontSize: '16px', 
                color: '#6b7280',
                margin: '0 0 16px 0'
              }}>
                {WALLS.find(w => w.id === selectedWall)?.name}
              </p>
              
              {/* Wall Image */}
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '3px solid #e5e7eb',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              }}>
                <img 
                  src={WALLS.find(w => w.id === selectedWall)?.image} 
                  alt={WALLS.find(w => w.id === selectedWall)?.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>

            {/* Visual Separator */}
            <div style={{
              width: '60px',
              height: '3px',
              backgroundColor: '#e5e7eb',
              margin: '0 auto 32px auto',
              borderRadius: '2px'
            }} />

            {/* Timer Display */}
            <div style={{ 
              fontSize: '90px', 
              fontWeight: 'bold', 
              color: '#7c3aed',
              marginBottom: '32px',
              fontFamily: 'monospace',
              textShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
              background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {activeSession ? formatTime(elapsedTime) : '00:00'}
            </div>

            {/* Action Buttons */}
            {!activeSession && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                <button
                  onClick={handleStartClimb}
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '16px 32px',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 8px 25px rgba(5, 150, 105, 0.3)'
                  }}
                >
                  Start Climb
                </button>
                <button
                  onClick={() => {
                    setShowTimerWindow(false);
                    setSelectedClimber('');
                    setSelectedWall('');
                  }}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ← Back to Walls
                </button>
              </div>
            )}

            {/* Active Timer Controls */}
            {activeSession && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                <button
                  onClick={handleStopClimb}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '20px 40px',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  Stop Climb
                </button>
                <button
                  onClick={() => {
                    setShowTimerWindow(false);
                    setSelectedClimber('');
                    setSelectedWall('');
                  }}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ← Back to Walls
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Time Dialog */}
      {showSaveDialog && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1001,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center'
            }}
          >
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#1f2937',
              margin: '0 0 16px 0'
            }}>
              Climb Complete!
            </h3>
            
            <div style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: '#7c3aed',
              marginBottom: '24px',
              fontFamily: 'monospace'
            }}>
              {formatTime(completedTime)}
            </div>

            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280',
              margin: '0 0 24px 0'
            }}>
              Would you like to save this time?
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setActiveSession(null);
                  setElapsedTime(0);
                  setShowTimerWindow(false);
                  setSelectedClimber('');
                  setSelectedWall('');
                }}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Discard
              </button>
              <button
                onClick={async () => {
                  if (activeSession) {
                    await saveClimbTime();
                    setShowSaveDialog(false);
                    setActiveSession(null);
                    setElapsedTime(0);
                  }
                }}
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Save Time
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
