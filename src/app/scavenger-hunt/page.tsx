'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Wall data with clues
const WALLS = [
  {
    id: 'slight-of-hand',
    name: 'Slight of Hand',
    clue: '🎭 Where magic happens and tricks are performed',
    difficulty: 'Medium',
    color: '#f97316',
    completed: false
  },
  {
    id: 'kubrik',
    name: 'Kubrik',
    clue: '🎬 Named after a famous filmmaker, this wall demands precision',
    difficulty: 'Hard',
    color: '#3b82f6',
    completed: false
  },
  {
    id: 'matrix',
    name: 'Matrix',
    clue: '💻 Choose your path wisely, red or blue holds',
    difficulty: 'Hard',
    color: '#10b981',
    completed: false
  },
  {
    id: 'vines',
    name: 'Vines',
    clue: '🌿 Nature\'s ladder, climb through the jungle',
    difficulty: 'Medium',
    color: '#8b5cf6',
    completed: false
  },
  {
    id: 'rubiks',
    name: 'Rubiks',
    clue: '🧩 Twist and turn until all colors align',
    difficulty: 'Hard',
    color: '#eab308',
    completed: false
  },
  {
    id: 'walk-the-plank',
    name: 'Walk the Plank',
    clue: '🏴‍☠️ Arrr matey! Test your balance on the high seas',
    difficulty: 'Easy',
    color: '#ef4444',
    completed: false
  },
  {
    id: 'stairs',
    name: 'Stairs',
    clue: '🪜 Step by step, one foot at a time',
    difficulty: 'Easy',
    color: '#6366f1',
    completed: false
  },
  {
    id: 'sprint',
    name: 'Sprint',
    clue: '🏃‍♂️ Quick bursts of energy, no time to rest',
    difficulty: 'Medium',
    color: '#ec4899',
    completed: false
  },
  {
    id: 'chevron',
    name: 'Chevron',
    clue: '⬆️ Pointing upward, follow the arrows to success',
    difficulty: 'Medium',
    color: '#14b8a6',
    completed: false
  }
];

export default function ScavengerHuntPage() {
  const [gameState, setGameState] = useState<'waiting' | 'active' | 'completed'>('waiting');
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [currentClue, setCurrentClue] = useState(0);
  const [score, setScore] = useState(0);
  const [walls, setWalls] = useState(WALLS);
  const [gameHistory, setGameHistory] = useState<Array<{wall: string, time: number, score: number}>>([]);
  const [selectedStudent, setSelectedStudent] = useState('');

  // Get student from URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const student = urlParams.get('student');
      if (student) {
        setSelectedStudent(student);
      }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState === 'active' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  const startGame = () => {
    if (!selectedStudent) {
      alert('Please select a student first!');
      return;
    }
    
    setGameState('active');
    setTimeLeft(3600);
    setScore(0);
    setCurrentClue(0);
    setWalls(WALLS.map(wall => ({ ...wall, completed: false })));
    setGameHistory([]);
  };

  const endGame = () => {
    setGameState('completed');
    // Save game results
    const finalScore = score + (timeLeft > 0 ? Math.floor(timeLeft / 60) * 10 : 0); // Bonus points for time remaining
    setGameHistory(prev => [...prev, { wall: 'Game Complete', time: 3600 - timeLeft, score: finalScore }]);
    
    // Save to local storage for profile display
    if (selectedStudent) {
      const gameResult = {
        student: selectedStudent,
        date: new Date().toISOString(),
        score: finalScore,
        timeUsed: 3600 - timeLeft,
        wallsCompleted: walls.filter(w => w.completed).length,
        totalWalls: walls.length
      };
      
      const existingResults = JSON.parse(localStorage.getItem('scavengerHuntResults') || '[]');
      existingResults.push(gameResult);
      localStorage.setItem('scavengerHuntResults', JSON.stringify(existingResults));
    }
  };

  const completeWall = (wallId: string) => {
    if (gameState !== 'active') return;
    
    const wall = walls.find(w => w.id === wallId);
    if (!wall || wall.completed) return;
    
    // Calculate points based on difficulty and time
    const difficultyPoints = { 'Easy': 100, 'Medium': 150, 'Hard': 200 };
    const timeBonus = Math.floor(timeLeft / 60) * 5; // Bonus for completing early
    const wallScore = difficultyPoints[wall.difficulty as keyof typeof difficultyPoints] + timeBonus;
    
    setScore(prev => prev + wallScore);
    setWalls(prev => prev.map(w => w.id === wallId ? { ...w, completed: true } : w));
    
    // Move to next clue
    const nextClue = Math.min(currentClue + 1, walls.length - 1);
    setCurrentClue(nextClue);
    
    // Check if all walls completed
    const allCompleted = walls.every(w => w.id === wallId ? true : w.completed);
    if (allCompleted) {
      endGame();
    }
    
    // Add to history
    setGameHistory(prev => [...prev, { wall: wall.name, time: 3600 - timeLeft, score: wallScore }]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentWall = () => {
    const uncompletedWalls = walls.filter(w => !w.completed);
    return uncompletedWalls[currentClue] || uncompletedWalls[0];
  };

  const currentWall = getCurrentWall();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        padding: '24px',
        marginBottom: '24px',
        textAlign: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img 
            src="/images/Industry City Logo Red.png" 
            alt="Hapik Logo" 
            style={{ height: '50px', width: 'auto' }}
          />
        </div>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          🎯 Scavenger Hunt Challenge
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '16px',
          margin: 0
        }}>
          Find and climb walls based on clever clues! 60 minutes to complete the challenge.
        </p>
      </div>

      {/* Student Selection */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
          👤 Student
        </h3>
        {selectedStudent ? (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#f3f4f6',
            border: '2px solid #10b981',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#059669',
            textAlign: 'center'
          }}>
            🎯 {selectedStudent} - Ready for Scavenger Hunt!
          </div>
        ) : (
          <select 
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              fontSize: '16px',
              backgroundColor: 'white'
            }}
          >
            <option value="">Choose a student...</option>
            <option value="Student 1">Student 1</option>
            <option value="Student 2">Student 2</option>
            <option value="Student 3">Student 3</option>
            <option value="Student 4">Student 4</option>
            <option value="Student 5">Student 5</option>
          </select>
        )}
      </div>

      {/* Game Controls */}
      {gameState === 'waiting' && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={startGame}
            disabled={!selectedStudent}
            style={{
              backgroundColor: selectedStudent ? '#10b981' : '#9ca3af',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: selectedStudent ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease'
            }}
          >
            🚀 Start Scavenger Hunt!
          </button>
          {!selectedStudent && (
            <p style={{ color: '#ef4444', marginTop: '12px', fontSize: '14px' }}>
              Please select a student to begin
            </p>
          )}
        </div>
      )}

      {/* Active Game */}
      {gameState === 'active' && (
        <>
          {/* Timer and Score */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: timeLeft < 300 ? '#ef4444' : '#10b981' }}>
                  {formatTime(timeLeft)}
                </div>
                <div style={{ fontSize: '16px', color: '#6b7280' }}>Time Remaining</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {score}
                </div>
                <div style={{ fontSize: '16px', color: '#6b7280' }}>Current Score</div>
              </div>
            </div>
          </div>

          {/* Current Clue */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
              🔍 Current Clue
            </h3>
            <div style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '20px', 
              borderRadius: '12px',
              border: '3px solid #f59e0b',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400e', marginBottom: '8px' }}>
                {currentWall?.clue}
              </div>
              <div style={{ fontSize: '16px', color: '#6b7280' }}>
                Difficulty: <span style={{ fontWeight: 'bold', color: currentWall?.color }}>
                  {currentWall?.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Wall Completion */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
              ✅ Complete Wall
            </h3>
            <button
              onClick={() => completeWall(currentWall?.id || '')}
              style={{
                backgroundColor: currentWall?.color || '#6b7280',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s ease'
              }}
            >
              🧗‍♀️ I Completed: {currentWall?.name}
            </button>
          </div>

          {/* Progress */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
              📊 Progress: {walls.filter(w => w.completed).length} / {walls.length} Walls
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {walls.map(wall => (
                <div key={wall.id} style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: wall.completed ? '#10b981' : '#f3f4f6',
                  color: wall.completed ? 'white' : '#6b7280',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: wall.completed ? 'bold' : 'normal'
                }}>
                  {wall.completed ? '✅' : '⭕'} {wall.name}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Game Complete */}
      {gameState === 'completed' && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px', color: '#10b981' }}>
            🎉 Scavenger Hunt Complete!
          </h2>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '16px' }}>
            Final Score: {score + (timeLeft > 0 ? Math.floor(timeLeft / 60) * 10 : 0)}
          </div>
          <div style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
            Walls Completed: {walls.filter(w => w.completed).length} / {walls.length}
          </div>
          <button
            onClick={() => setGameState('waiting')}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginRight: '12px'
            }}
          >
            🔄 Play Again
          </button>
        </div>
      )}

      {/* Game History */}
      {gameHistory.length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
            📝 Game History
          </h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {gameHistory.map((entry, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                marginBottom: '8px'
              }}>
                <div style={{ fontWeight: 'bold', color: '#1f2937' }}>{entry.wall}</div>
                <div style={{ color: '#6b7280' }}>
                  {Math.floor(entry.time / 60)}:{(entry.time % 60).toString().padStart(2, '0')}
                </div>
                <div style={{ fontWeight: 'bold', color: '#10b981' }}>+{entry.score}</div>
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
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          ← Back to Main App
        </Link>
      </div>
    </div>
  );
}
