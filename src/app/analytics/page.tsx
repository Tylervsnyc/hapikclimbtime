'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClimbers } from '@/contexts/ClimberContext';
import { AnalyticsService, ClimberAnalytics, WallStats, ClimbRecord } from '@/lib/analyticsService';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { climbers } = useClimbers();
  const [selectedClimber, setSelectedClimber] = useState<string>('');
  const [climberAnalytics, setClimberAnalytics] = useState<ClimberAnalytics | null>(null);
  const [wallAnalytics, setWallAnalytics] = useState<WallStats[]>([]);
  const [climbHistory, setClimbHistory] = useState<ClimbRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  useEffect(() => {
    if (selectedClimber && user) {
      loadClimberAnalytics(selectedClimber);
    }
  }, [selectedClimber, user]);

  async function loadAnalytics() {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Load wall analytics and climb history in parallel
      const [walls, history] = await Promise.all([
        AnalyticsService.getWallAnalytics(user.id),
        AnalyticsService.getClimbHistory(user.id, 100)
      ]);

      setWallAnalytics(walls);
      setClimbHistory(history);

      // Auto-select first climber if available
      if (climbers.length > 0 && !selectedClimber) {
        setSelectedClimber(climbers[0].id);
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadClimberAnalytics(climberId: string) {
    if (!user) return;

    try {
      const analytics = await AnalyticsService.getClimberAnalytics(user.id, climberId);
      setClimberAnalytics(analytics);
    } catch (err) {
      console.error('Error loading climber analytics:', err);
      setError('Failed to load climber analytics');
    }
  }

  function formatTime(seconds: number): string {
    return AnalyticsService.formatTime(seconds);
  }

  function getTrendIcon(trend: 'improving' | 'declining' | 'stable'): string {
    return AnalyticsService.getTrendIcon(trend);
  }

  function getTrendColor(trend: 'improving' | 'declining' | 'stable'): string {
    return AnalyticsService.getTrendColor(trend);
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
            Climbing Analytics
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            margin: 0
          }}>
            Track progress and performance insights
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

      {isLoading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Loading analytics...</p>
        </div>
      ) : error ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#dc2626'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <p style={{ margin: '0 0 16px 0' }}>Error loading analytics</p>
          <p style={{ fontSize: '14px', margin: 0, color: '#6b7280' }}>{error}</p>
          <button
            onClick={loadAnalytics}
            style={{
              backgroundColor: '#7c3aed',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: '12px'
            }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Climber Selection */}
          {climbers.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '500px',
              margin: '0 auto 20px auto'
            }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: '#1f2937',
                margin: '0 0 16px 0',
                textAlign: 'center'
              }}>
                🧗‍♀️ Select Climber for Detailed Analytics
              </h2>
              
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {climbers.map(climber => (
                  <button
                    key={climber.id}
                    onClick={() => setSelectedClimber(climber.id)}
                    style={{
                      backgroundColor: selectedClimber === climber.id ? '#7c3aed' : '#f3f4f6',
                      color: selectedClimber === climber.id ? 'white' : '#374151',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {climber.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Individual Climber Analytics */}
          {selectedClimber && climberAnalytics && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '500px',
              margin: '0 auto 20px auto'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#1f2937',
                margin: '0 0 20px 0',
                textAlign: 'center'
              }}>
                📊 {climbers.find(c => c.id === selectedClimber)?.name}'s Performance
              </h2>

              {/* Key Stats */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#7c3aed' 
                  }}>
                    {climberAnalytics.totalClimbs}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6b7280' 
                  }}>
                    Total Climbs
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#059669' 
                  }}>
                    {climberAnalytics.bestTime > 0 ? formatTime(climberAnalytics.bestTime) : 'N/A'}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6b7280' 
                  }}>
                    Best Time
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#f59e0b' 
                  }}>
                    {climberAnalytics.averageTime > 0 ? formatTime(climberAnalytics.averageTime) : 'N/A'}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6b7280' 
                  }}>
                    Average Time
                  </div>
                </div>
              </div>

              {/* Progress Trend */}
              <div style={{ 
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Recent Trend
                </div>
                <div style={{ 
                  fontSize: '24px', 
                  marginBottom: '8px'
                }}>
                  {getTrendIcon(climberAnalytics.recentTrend)}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: getTrendColor(climberAnalytics.recentTrend),
                  fontWeight: '500'
                }}>
                  {climberAnalytics.recentTrend === 'improving' ? 'Improving Performance' :
                   climberAnalytics.recentTrend === 'declining' ? 'Performance Declining' :
                   'Stable Performance'}
                </div>
                {climberAnalytics.improvement !== 0 && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6b7280',
                    marginTop: '4px'
                  }}>
                    {climberAnalytics.improvement > 0 ? '+' : ''}{climberAnalytics.improvement.toFixed(1)}% improvement
                  </div>
                )}
              </div>

              {/* Wall Breakdown */}
              {climberAnalytics.wallBreakdown.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151',
                    margin: '0 0 12px 0',
                    textAlign: 'center'
                  }}>
                    🧱 Performance by Wall
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {climberAnalytics.wallBreakdown.map((wall, index) => (
                      <div key={wall.wallId} style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        padding: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            color: '#374151' 
                          }}>
                            {wall.wallName}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#6b7280' 
                          }}>
                            {wall.climbCount} climbs
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            color: '#059669' 
                          }}>
                            {formatTime(wall.bestTime)}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#6b7280' 
                          }}>
                            Best
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wall Analytics */}
          {wallAnalytics.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '500px',
              margin: '0 auto 20px auto'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#1f2937',
                margin: '0 0 20px 0',
                textAlign: 'center'
              }}>
                🏗️ Wall Performance Overview
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {wallAnalytics.map((wall, index) => (
                  <div key={wall.wallId} style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    padding: '16px',
                    border: index === 0 ? '2px solid #7c3aed' : '1px solid #e5e7eb'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: '#374151' 
                      }}>
                        {wall.wallName}
                        {index === 0 && (
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#7c3aed', 
                            marginLeft: '8px',
                            fontWeight: '500'
                          }}>
                            🏆 Most Popular
                          </span>
                        )}
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#7c3aed' 
                      }}>
                        {wall.climbCount} climbs
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: '12px'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: '#059669' 
                        }}>
                          {formatTime(wall.bestTime)}
                        </div>
                        <div style={{ 
                          fontSize: '11px', 
                          color: '#6b7280' 
                        }}>
                          Best Time
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: '#f59e0b' 
                        }}>
                          {formatTime(wall.averageTime)}
                        </div>
                        <div style={{ 
                          fontSize: '11px', 
                          color: '#6b7280' 
                        }}>
                          Average
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Climb History */}
          {climbHistory.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '500px',
              margin: '0 auto 20px auto'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#1f2937',
                margin: '0 0 20px 0',
                textAlign: 'center'
              }}>
                📅 Recent Climb History
              </h2>
              
              <div style={{ 
                maxHeight: '400px', 
                overflowY: 'auto',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px', 
                        color: '#374151', 
                        fontWeight: '500',
                        fontSize: '12px'
                      }}>
                        Climber
                      </th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px', 
                        color: '#374151', 
                        fontWeight: '500',
                        fontSize: '12px'
                      }}>
                        Wall
                      </th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px', 
                        color: '#374151', 
                        fontWeight: '500',
                        fontSize: '12px'
                      }}>
                        Time
                      </th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px', 
                        color: '#374151', 
                        fontWeight: '500',
                        fontSize: '12px'
                      }}>
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {climbHistory.map((climb) => (
                      <tr key={climb.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ 
                          padding: '12px', 
                          color: '#374151',
                          fontSize: '14px'
                        }}>
                          {climb.climberName}
                        </td>
                        <td style={{ 
                          padding: '12px', 
                          color: '#374151',
                          fontSize: '14px'
                        }}>
                          {climb.wallName || 'Unknown'}
                        </td>
                        <td style={{ 
                          padding: '12px', 
                          color: '#374151', 
                          fontWeight: '500',
                          fontSize: '14px'
                        }}>
                          {formatTime(climb.timeInSeconds)}
                        </td>
                        <td style={{ 
                          padding: '12px', 
                          color: '#6b7280', 
                          fontSize: '12px'
                        }}>
                          {climb.timestamp.toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* No Data State */}
          {!isLoading && !error && climbHistory.length === 0 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '40px 20px',
              marginBottom: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '500px',
              margin: '0 auto 20px auto',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#374151',
                margin: '0 0 8px 0'
              }}>
                No Climb Data Yet
              </h3>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '14px',
                margin: '0 0 20px 0'
              }}>
                Start timing climbs to see detailed analytics and progress charts
              </p>
              <Link href="/climb" style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                🏃‍♂️ Start Climbing
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

