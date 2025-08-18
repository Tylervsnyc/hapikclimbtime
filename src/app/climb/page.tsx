'use client';

import { useState, useEffect, useRef } from 'react';
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

// Basic climbers data
const CLIMBERS = [
  'Student 1',
  'Student 2', 
  'Student 3',
  'Student 4',
  'Student 5'
];

interface ClimbSession {
  id: string;
  climberName: string;
  wallName: string;
  timeInSeconds: number;
  timestamp: string;
}

export default function ClimbPage() {
  const [selectedClimber, setSelectedClimber] = useState<string>('');
  const [selectedWall, setSelectedWall] = useState<string>('');
  const [isTiming, setIsTiming] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [climbHistory, setClimbHistory] = useState<ClimbSession[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load climb history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('climb_history');
    if (saved) {
      setClimbHistory(JSON.parse(saved));
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (isTiming) {
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
  }, [isTiming]);

  const startClimb = () => {
    if (!selectedClimber || !selectedWall) return;
    
    setIsTiming(true);
    setStartTime(new Date());
    setElapsedTime(0);
  };

  const stopClimb = () => {
    if (!startTime || !selectedClimber || !selectedWall) return;
    
    const wall = WALLS.find(w => w.id === selectedWall);
    const session: ClimbSession = {
      id: Date.now().toString(),
      climberName: selectedClimber,
      wallName: wall?.name || selectedWall,
      timeInSeconds: elapsedTime,
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [session, ...climbHistory];
    setClimbHistory(updatedHistory);
    localStorage.setItem('climb_history', JSON.stringify(updatedHistory));
    
    setIsTiming(false);
    setStartTime(null);
    setElapsedTime(0);
    setSelectedClimber('');
    setSelectedWall('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const hundredths = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <img 
            src="/images/Industry City Logo Red.png" 
            alt="Hapik Logo" 
            style={{ height: '50px', width: 'auto' }}
          />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
          Climbing Timer
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
          Time your climbs and track progress
        </p>
      </div>

      {/* Climber Selection */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
          👤 Select Climber
        </h3>
        <select
          value={selectedClimber}
          onChange={(e) => setSelectedClimber(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '2px solid #e5e7eb',
            fontSize: '16px',
            marginBottom: '16px'
          }}
        >
          <option value="">Choose a climber...</option>
          {CLIMBERS.map((climber) => (
            <option key={climber} value={climber}>
              {climber}
            </option>
          ))}
        </select>
      </div>

      {/* Wall Selection */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
          🧱 Select Wall
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '12px' 
        }}>
          {WALLS.map((wall) => (
            <button
              key={wall.id}
              onClick={() => setSelectedWall(wall.id)}
              style={{
                backgroundColor: selectedWall === wall.id ? '#dc2626' : 'white',
                color: selectedWall === wall.id ? 'white' : '#1f2937',
                padding: '12px',
                borderRadius: '8px',
                border: `2px solid ${selectedWall === wall.id ? '#dc2626' : '#e5e7eb'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <img 
                src={wall.image} 
                alt={wall.name}
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '12px', fontWeight: '500' }}>{wall.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timer Display */}
      {isTiming && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '24px',
          marginBottom: '20px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
            ⏱️ Timing {selectedClimber} on {WALLS.find(w => w.id === selectedWall)?.name}
          </h3>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#dc2626', marginBottom: '24px' }}>
            {formatTime(elapsedTime)}
          </div>
          <button
            onClick={stopClimb}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🏁 Stop Timer
          </button>
        </div>
      )}

      {/* Start Button */}
      {!isTiming && selectedClimber && selectedWall && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={startClimb}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            🚀 Start Climb!
          </button>
        </div>
      )}

      {/* Climb History */}
      {climbHistory.length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
            📊 Recent Climbs
          </h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {climbHistory.slice(0, 10).map((climb) => (
              <div key={climb.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                marginBottom: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1f2937' }}>{climb.climberName}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>{climb.wallName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#dc2626', fontSize: '16px' }}>
                    {formatTime(climb.timeInSeconds)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {new Date(climb.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back Button */}
      <div style={{ textAlign: 'center' }}>
        <Link 
          href="/"
          style={{
            display: 'inline-block',
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ← Back to Main App
        </Link>
      </div>
    </div>
  );
}
