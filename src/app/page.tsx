'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { STUDENTS, getThisWeekClimbCount, getActiveStudentsThisWeek, initializeStore, WEEKLY_DATA, CURRENT_WEEK, subscribeToRealTimeUpdates } from '@/data/store';

export default function DirectorsPage() {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [todayClimbs, setTodayClimbs] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  
  // 🔐 **Authentication temporarily disabled for testing**

  useEffect(() => {
    const initApp = async () => {
      console.log('🚀 Initializing app...');
      await initializeStore();
      updateStats();
      
      console.log('📡 Setting up real-time subscription...');
      // TEMPORARILY DISABLE FIREBASE SUBSCRIPTION TO FOCUS ON AUTH SYSTEM
      console.log('🚫 Firebase subscription temporarily disabled');
      
      // Cleanup subscription on unmount
      return () => {
        console.log('🧹 No Firebase subscription to clean up');
      };
    };
    initApp();
  }, []);

  const updateStats = () => {
    const climbCount = getThisWeekClimbCount();
    const activeStudentsCount = getActiveStudentsThisWeek().length;
    
    console.log(`📊 Updating stats: ${climbCount} climbs, ${activeStudentsCount} active students`);
    
    setTodayClimbs(climbCount);
    setActiveStudents(activeStudentsCount);
  };

  return (
    <div style={{ 
      height: '100vh', 
      background: 'linear-gradient(to bottom, #fef2f2, white)',
      backgroundImage: 'url(/images/stairs.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      padding: '8px',
      overflow: 'hidden',
      overflowX: 'hidden',
      minWidth: '0'
    }}>
      {/* Semi-transparent overlay to make background subtle */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.6)', // 60% white overlay = 40% transparent background
        zIndex: 0
      }}></div>
      
      {/* Content container with higher z-index */}
      <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Header with Hapik branding */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        {/* Window frame around logo */}
        <div style={{
          display: 'inline-block',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: '2px solid #e5e7eb',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <img 
              src="/images/Industry City Logo Red.png" 
              alt="Hapik Logo" 
              style={{ height: '64px', width: 'auto' }} // Doubled from 32px to 64px
            />
          </div>
          <p style={{ 
            color: '#1f2937', 
            fontSize: '16px', 
            fontWeight: 'bold',
            margin: 0,
            textAlign: 'center'
          }}>
            Summer Camp Climb Time Tracker August 18-23rd
          </p>
        </div>
      </div>

              {/* 🧗‍♀️ **Climbing Timer Section** */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
          padding: '16px',
          marginBottom: '16px',
          border: '2px solid #059669'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#059669', 
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            🧗‍♀️ Climbing Timer
          </h3>
          
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '16px', color: '#6b7280' }}>
              Ready to time some climbs? Access the climbing timer here:
            </p>
            <Link href="/climb" style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'inline-block'
            }}>
              🚀 Start Climbing Timer
            </Link>
          </div>
        </div>

        {/* 🔐 **Authentication Test Section - TEMPORARY FOR TESTING** */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
          padding: '16px',
          marginBottom: '16px',
          border: '2px solid #7c3aed'
        }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#7c3aed', 
          marginBottom: '12px',
          textAlign: 'center'
        }}>
          🚀 Get Started with Hapik Climbing
        </h3>
        

        
        {/* Temporarily disabled auth for testing */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '12px', color: '#6b7280' }}>
            🎯 Ready to start the Scavenger Hunt Challenge!
          </div>
          <div style={{ 
            backgroundColor: '#fef3c7', 
            borderRadius: '8px', 
            padding: '12px',
            border: '2px solid #f59e0b',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '14px', color: '#92400e', fontWeight: 'bold' }}>
              ⚠️ Auth temporarily disabled for testing
            </div>
            <div style={{ fontSize: '12px', color: '#92400e' }}>
              Firebase setup in progress - app will work without login for now
            </div>
          </div>
        </div>
      </div>

      {/* Student Selection Section */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        padding: '12px', 
        marginBottom: '12px' 
      }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '12px', 
          textAlign: 'center' 
        }}>
          Choose Your Climber
        </h2>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '4px' 
          }}>
            Select Student:
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none'
            }}
          >
            <option value="">-- Pick a student --</option>
            {STUDENTS.map((student) => (
              <option key={student} value={student}>
                {student}
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
            <Link 
              href={`/walls?student=${encodeURIComponent(selectedStudent)}`}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              Time {selectedStudent} on the Walls! 🧗‍♂️
            </Link>
            <Link 
              href={`/scavenger-hunt?student=${encodeURIComponent(selectedStudent)}`}
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              🎯 Start Scavenger Hunt
            </Link>
            <Link 
              href={`/profile?student=${encodeURIComponent(selectedStudent)}`}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              View {selectedStudent}&apos;s Profile 📊
            </Link>
          </div>
        )}
      </div>

      {/* Quick Stats Preview */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        padding: '16px',
        marginBottom: '12px'
      }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '8px', 
          textAlign: 'center' 
        }}>
          This Week&apos;s Stats ({WEEKLY_DATA[CURRENT_WEEK].name})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <div style={{ 
            backgroundColor: '#fef2f2', 
            borderRadius: '8px', 
            padding: '8px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>
              {todayClimbs}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Climbs This Week</div>
          </div>
          <div style={{ 
            backgroundColor: '#eff6ff', 
            borderRadius: '8px', 
            padding: '8px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>
              {activeStudents}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Students This Week</div>
          </div>
        </div>
        <p style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          fontSize: '13px',
          margin: 0,
          fontStyle: 'italic'
        }}>
          Select a student above to start timing their climbs, view their profile, or start a scavenger hunt!
        </p>
      </div>

      {/* Manager's View Button */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        padding: '16px',
        marginBottom: '12px'
      }}>
        <Link 
          href="/manager"
          style={{
            display: 'block',
            backgroundColor: '#7c3aed',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          📊 Manager&apos;s Analytics Dashboard
        </Link>
        <p style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          fontSize: '12px',
          margin: '8px 0 0 0',
          fontStyle: 'italic'
        }}>
          View climbing statistics, popular walls, and student performance
        </p>
      </div>



      </div>
    </div>
  );
}
