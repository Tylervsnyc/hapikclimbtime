'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  STUDENTS, 
  WALLS, 
  getThisWeekClimbCount, 
  getActiveStudentsThisWeek, 
  initializeStore, 
  WEEKLY_DATA, 
  CURRENT_WEEK, 
  subscribeToRealTimeUpdates,
  getWallPopularityStats,
  getStudentActivityStats,
  getWeeklyTrends
} from '@/data/store';
import { ClimbRecord } from '@/data/types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement);

export default function ManagerPage() {
  const [climbRecords, setClimbRecords] = useState<ClimbRecord[]>([]);
  const [totalClimbs, setTotalClimbs] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [wallStats, setWallStats] = useState<Array<{wallId: string, wallName: string, climbCount: number, percentage: number}>>([]);
  const [studentStats, setStudentStats] = useState<Array<{studentName: string, climbCount: number, averageTime: number, bestTime: number}>>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<Array<{day: string, climbCount: number, uniqueStudents: number}>>([]);

  useEffect(() => {
    const initApp = async () => {
      console.log('🚀 Initializing manager app...');
      await initializeStore();
      updateStats();
      
      console.log('📡 Setting up real-time subscription...');
      const unsubscribe = subscribeToRealTimeUpdates(() => {
        console.log('🔄 Real-time update received, updating manager stats...');
        updateStats();
      });
      
      return () => {
        console.log('🧹 Cleaning up manager real-time subscription');
        unsubscribe();
      };
    };
    initApp();
  }, []);

  const updateStats = () => {
    // Get all climb records from localStorage
    const saved = localStorage.getItem(`hapik_climbs_${CURRENT_WEEK}`);
    if (saved) {
      const records: ClimbRecord[] = JSON.parse(saved).map((record: ClimbRecord) => ({
        ...record,
        timestamp: new Date(record.timestamp)
      }));
      setClimbRecords(records);
      
      // Use the new analytics functions
      setWallStats(getWallPopularityStats());
      setStudentStats(getStudentActivityStats());
      setWeeklyTrends(getWeeklyTrends());
      
      setTotalClimbs(records.length);
      setActiveStudents([...new Set(records.map(climb => climb.studentName))].length);
    }
  };

  // Prepare data for pie chart (top 8 most popular walls)
  const pieChartData = {
    labels: wallStats.slice(0, 8).map(wall => wall.wallName),
    datasets: [
      {
        data: wallStats.slice(0, 8).map(wall => wall.climbCount),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  // Prepare data for bar chart (top 10 most active students)
  const barChartData = {
    labels: studentStats.slice(0, 10).map(student => student.studentName),
    datasets: [
      {
        label: 'Number of Climbs',
        data: studentStats.slice(0, 10).map(student => student.climbCount),
        backgroundColor: 'rgba(124, 58, 237, 0.8)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 1
      }
    ]
  };

  // Prepare data for line chart (weekly trends)
  const lineChartData = {
    labels: weeklyTrends.map(day => day.day),
    datasets: [
      {
        label: 'Total Climbs',
        data: weeklyTrends.map(day => day.climbCount),
        borderColor: 'rgba(220, 38, 38, 1)',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Unique Students',
        data: weeklyTrends.map(day => day.uniqueStudents),
        borderColor: 'rgba(37, 99, 235, 1)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: 'Most Popular Climbing Walls',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Most Active Climbers',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: 'Weekly Activity Trends',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)',
      padding: '16px'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        padding: '24px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img 
            src="/images/Industry City Logo Red.png" 
            alt="Hapik Logo" 
            style={{ height: '48px', width: 'auto' }}
          />
        </div>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          margin: '0 0 8px 0'
        }}>
          Manager&apos;s Analytics Dashboard
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '16px',
          margin: 0
        }}>
          {WEEKLY_DATA[CURRENT_WEEK].name} - Climbing Statistics & Insights
        </p>
        <Link 
          href="/"
          style={{
            display: 'inline-block',
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '14px',
            marginTop: '16px'
          }}
        >
          ← Back to Home
        </Link>
      </div>

      {/* Summary Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626', marginBottom: '8px' }}>
            {totalClimbs}
          </div>
          <div style={{ fontSize: '16px', color: '#6b7280' }}>Total Climbs This Week</div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>
            {activeStudents}
          </div>
          <div style={{ fontSize: '16px', color: '#6b7280' }}>Active Students</div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669', marginBottom: '8px' }}>
            {WALLS.length}
          </div>
          <div style={{ fontSize: '16px', color: '#6b7280' }}>Available Walls</div>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '8px' }}>
            {STUDENTS.length}
          </div>
          <div style={{ fontSize: '16px', color: '#6b7280' }}>Total Students</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Pie Chart - Popular Walls */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
          padding: '24px'
        }}>
          <div style={{ height: '400px' }}>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        {/* Bar Chart - Active Students */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
          padding: '24px'
        }}>
          <div style={{ height: '400px' }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Weekly Trends Chart */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{ height: '400px' }}>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      {/* Detailed Tables */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '24px'
      }}>
        {/* Wall Popularity Table */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
          padding: '24px'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Wall Popularity Ranking
          </h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {wallStats.map((wall, index) => (
              <div key={wall.wallId} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderBottom: index < wallStats.length - 1 ? '1px solid #e5e7eb' : 'none',
                backgroundColor: index < 3 ? '#fef3c7' : 'transparent'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: index < 3 ? '#f59e0b' : '#6b7280',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                  <span style={{ fontWeight: '500' }}>{wall.wallName}</span>
                </div>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: index < 3 ? '#d97706' : '#374151'
                }}>
                  {wall.climbCount} climbs ({wall.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Activity Table */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
          padding: '24px'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Student Activity Ranking
          </h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {studentStats.map((student, index) => (
              <div key={student.studentName} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderBottom: index < studentStats.length - 1 ? '1px solid #e5e7eb' : 'none',
                backgroundColor: index < 3 ? '#dbeafe' : 'transparent'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: index < 3 ? '#2563eb' : '#6b7280',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                  <span style={{ fontWeight: '500' }}>{student.studentName}</span>
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: index < 3 ? '#1d4ed8' : '#374151',
                  textAlign: 'right'
                }}>
                  <div>{student.climbCount} climbs</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'normal' }}>
                    Avg: {student.averageTime}s | Best: {student.bestTime}s
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        padding: '24px',
        marginTop: '24px'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          Recent Climbing Activity
        </h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {climbRecords
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 20)
            .map((climb, index) => (
              <div key={climb.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderBottom: index < Math.min(19, climbRecords.length - 1) ? '1px solid #e5e7eb' : 'none',
                backgroundColor: index % 2 === 0 ? '#f9fafb' : 'transparent'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>{climb.studentName}</span>
                  <span style={{ color: '#6b7280' }}>climbed</span>
                  <span style={{ fontWeight: '500', color: '#059669' }}>{climb.wallName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#6b7280' }}>
                    {climb.timeInSeconds}s
                  </span>
                  <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                    {new Date(climb.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
