'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { STUDENTS, getThisWeekClimbCount, getActiveStudentsThisWeek, initializeStore, WEEKLY_DATA, CURRENT_WEEK, subscribeToRealTimeUpdates } from '@/data/store';

export default function DirectorsPage() {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [todayClimbs, setTodayClimbs] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);

  useEffect(() => {
    const initApp = async () => {
      console.log('🚀 Initializing app...');
      await initializeStore();
      updateStats();
      
      console.log('📡 Setting up real-time subscription...');
      // Subscribe to real-time updates
      const unsubscribe = subscribeToRealTimeUpdates(() => {
        console.log('🔄 Real-time update received, updating stats...');
        updateStats();
      });
      
      console.log('✅ Real-time subscription set up successfully');
      
      // Cleanup subscription on unmount
      return () => {
        console.log('🧹 Cleaning up real-time subscription');
        unsubscribe();
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
      padding: '8px',
      overflow: 'hidden',
      overflowX: 'hidden',
      minWidth: '0'
    }}>
      {/* Header with Hapik branding */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <img 
            src="/images/Industry City Logo Red.png" 
            alt="Hapik Logo" 
            style={{ height: '32px', width: 'auto' }}
          />
        </div>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Camp Director&apos;s Timer - {WEEKLY_DATA[CURRENT_WEEK].name} (v2.0)
        </p>
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link 
              href={`/walls?student=${encodeURIComponent(selectedStudent)}`}
              style={{
                flex: 1,
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '8px 16px',
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
              href={`/profile?student=${encodeURIComponent(selectedStudent)}`}
              style={{
                flex: 1,
                backgroundColor: '#059669',
                color: 'white',
                padding: '8px 16px',
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
        padding: '12px',
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
      </div>



      {/* Navigation Note */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '8px', 
        color: '#9ca3af', 
        fontSize: '12px' 
      }}>
        <p>Select a student above to start timing their climbs or view their profile!</p>
      </div>
    </div>
  );
}
