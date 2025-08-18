'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HapikClimbingApp() {
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  const STUDENTS = [
    'Student 1',
    'Student 2', 
    'Student 3',
    'Student 4',
    'Student 5'
  ];

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
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
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
                style={{ height: '64px', width: 'auto' }}
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

        {/* Student Selection Section */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
          padding: '24px',
          marginBottom: '20px',
          border: '2px solid #059669'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#059669', 
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            👤 Select a Student
          </h3>
          
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              fontSize: '16px',
              marginBottom: '20px',
              backgroundColor: 'white'
            }}
          >
            <option value="">Choose a student...</option>
            {STUDENTS.map((student) => (
              <option key={student} value={student}>
                {student}
              </option>
            ))}
          </select>

          {selectedStudent && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                marginBottom: '16px', 
                color: '#6b7280',
                fontSize: '16px'
              }}>
                Select a student above to start timing their climbs, view their profile, or start a scavenger hunt!
              </p>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '300px',
                margin: '0 auto'
              }}>
                <Link 
                  href={`/walls?student=${selectedStudent}`}
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}
                >
                  🧗‍♀️ Time {selectedStudent} on the Walls!
                </Link>
                
                <Link 
                  href={`/scavenger-hunt?student=${selectedStudent}`}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}
                >
                  🎯 Start Scavenger Hunt
                </Link>
                
                <Link 
                  href={`/profile?student=${selectedStudent}`}
                  style={{
                    backgroundColor: '#7c3aed',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}
                >
                  👤 View {selectedStudent}'s Profile
                </Link>
              </div>
            </div>
          )}
        </div>



        {/* Quick Access Links */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
          padding: '24px',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            🔗 Quick Access
          </h3>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '300px',
            margin: '0 auto'
          }}>
            <Link 
              href="/manager"
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '16px'
              }}
            >
              📊 Staff Analytics Dashboard
            </Link>
            
            <Link 
              href="/walls"
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '16px'
              }}
            >
              🧱 View All Climbing Walls
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            🏢 Industry City Climbing Center
          </p>
          <p style={{ margin: 0 }}>
            Built with Next.js • React • Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
