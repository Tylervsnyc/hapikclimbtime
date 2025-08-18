'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useClimbers } from '@/contexts/ClimberContext';
import { useRouter } from 'next/navigation';
import AddClimberModal from '@/components/AddClimberModal';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { climbers, addClimber, isLoading: climbersLoading, error } = useClimbers();
  const router = useRouter();
  
  const [isAddClimberModalOpen, setIsAddClimberModalOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push('/');
  }

  function handleAddClimber() {
    setIsAddClimberModalOpen(true);
  }

  async function handleAddClimberSubmit(climberName: string) {
    await addClimber(climberName);
    setIsAddClimberModalOpen(false);
  }

  function handleTimeClimbs() {
    if (climbers.length === 0) {
      alert('Please add climbers to your account first!');
      return;
    }
    router.push('/climb');
  }

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          position: 'relative',
          maxWidth: '500px',
          margin: '0 auto 20px auto'
        }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          textAlign: 'center'
        }}>
          {/* Logo - Centered at Top */}
          <div style={{ marginBottom: '12px' }}>
            <img 
              src="/images/Industry City Logo Red.png" 
              alt="Hapik Logo" 
              style={{ height: '45px', width: 'auto' }}
            />
          </div>
          
          {/* Welcome Message - Centered Below Logo */}
          <div style={{ marginBottom: '0' }}>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 6px 0'
            }}>
              Welcome back, {user.name}! 👋
            </h1>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '14px',
              margin: 0
            }}>
              Manage your climbers and track their progress
            </p>
          </div>
          
          {/* Logout Button - Tiny and Upper Right */}
          <button
            onClick={handleLogout}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '6px 10px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(220, 38, 38, 0.3)';
            }}
          >
            🚪
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
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
            🚀 Quick Actions
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '16px',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
                      <button
              onClick={handleTimeClimbs}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '16px 20px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 6px 20px rgba(5, 150, 105, 0.3)',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(5, 150, 105, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.3)';
              }}
            >
              🏃‍♂️ Start Climbing
            </button>
          
                                <button
            onClick={() => router.push('/analytics')}
            style={{
              backgroundColor: '#7c3aed',
              color: 'white',
              padding: '16px 20px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 6px 20px rgba(124, 58, 237, 0.3)',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(124, 58, 237, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(124, 58, 237, 0.3)';
            }}
          >
            📊 View Analytics
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
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
          🧭 Navigation
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '16px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <Link
            href="/manager"
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '16px 20px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 6px 20px rgba(220, 38, 38, 0.3)',
              textDecoration: 'none',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(220, 38, 38, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.3)';
            }}
          >
            🏢 Manager View
          </Link>
          
          <Link
            href="/tristatetest"
            style={{
              backgroundColor: '#0891b2',
              color: 'white',
              padding: '16px 20px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 6px 20px rgba(8, 145, 178, 0.3)',
              textDecoration: 'none',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(8, 145, 178, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(8, 145, 178, 0.3)';
            }}
          >
            🌟 Tristatetest Demo
          </Link>
        </div>
      </div>

      {/* Climbers List */}
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: '16px', 
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)', 
        padding: '20px',
        marginBottom: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '400px',
        margin: '0 auto 20px auto'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#1f2937',
            margin: 0
          }}>
            👥 Your Climbers ({climbers.length})
          </h2>
          <button
            onClick={handleAddClimber}
            style={{
              backgroundColor: '#7c3aed',
              color: 'white',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(124, 58, 237, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.3)';
            }}
          >
            + Add Climber
          </button>
        </div>

        {climbersLoading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p>Loading climbers...</p>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#dc2626'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <p style={{ margin: '0 0 16px 0' }}>Error loading climbers</p>
            <p style={{ fontSize: '14px', margin: 0, color: '#6b7280' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
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
        ) : climbers.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              No climbers yet
            </h3>
            <p style={{ 
              fontSize: '14px',
              margin: '0 0 20px 0'
            }}>
              Add your first climber to start tracking their progress
            </p>
            <button
              onClick={handleAddClimber}
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Add Your First Climber
            </button>
          </div>
        ) : (
                  <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '8px'
        }}>
            {climbers.map(climber => (
                          <div key={climber.id} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              padding: '8px 16px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              transform: 'translateY(0)',
              width: '85%',
              maxWidth: '320px',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
            >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    color: '#1f2937',
                    margin: 0,
                    textAlign: 'left',
                    maxWidth: '60px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {climber.name}
                  </h3>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0,
                    marginLeft: '20px'
                  }}>
                    <div style={{ textAlign: 'center', minWidth: '40px' }}>
                      <div style={{ 
                        fontSize: '13px', 
                        fontWeight: 'bold', 
                        color: '#7c3aed' 
                      }}>
                        {climber.totalClimbs}
                      </div>
                      <div style={{ 
                        fontSize: '8px', 
                        color: '#6b7280' 
                      }}>
                        Total
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: '40px' }}>
                      <div style={{ 
                        fontSize: '13px', 
                        fontWeight: 'bold', 
                        color: climber.bestTime > 0 ? '#059669' : '#9ca3af' 
                      }}>
                        {climber.bestTime > 0 ? `${climber.bestTime}s` : 'No climbs'}
                      </div>
                      <div style={{ 
                        fontSize: '8px', 
                        color: '#6b7280' 
                      }}>
                        Fastest
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: '40px' }}>
                      <div style={{ 
                        fontSize: '13px', 
                        fontWeight: 'bold', 
                        color: climber.totalClimbs > 0 ? '#f59e0b' : '#9ca3af' 
                      }}>
                        {climber.totalClimbs > 0 ? `${climber.averageTime.toFixed(1)}s` : 'No climbs'}
                      </div>
                      <div style={{ 
                        fontSize: '8px', 
                        color: '#6b7280' 
                      }}>
                        Average
                      </div>
                    </div>
                  </div>
                  
                  <button
                    style={{
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: '4px'
                    }}
                  >
                    ✏️
                  </button>
                </div>
                

              </div>
            ))}
          </div>
        )}
      </div>



      {/* Add Climber Modal */}
      <AddClimberModal
        isOpen={isAddClimberModalOpen}
        onClose={() => setIsAddClimberModalOpen(false)}
        onAddClimber={handleAddClimberSubmit}
        isLoading={climbersLoading}
      />
    </div>
  );
}
