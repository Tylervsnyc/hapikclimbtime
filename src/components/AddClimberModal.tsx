'use client';

import { useState } from 'react';

interface AddClimberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClimber: (climberName: string) => void;
  isLoading?: boolean;
}

export default function AddClimberModal({ 
  isOpen, 
  onClose, 
  onAddClimber, 
  isLoading = false 
}: AddClimberModalProps) {
  const [climberName, setClimberName] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!climberName.trim()) {
      setError('Climber name is required');
      return;
    }
    
    if (climberName.trim().length < 2) {
      setError('Climber name must be at least 2 characters');
      return;
    }
    
    setError('');
    onAddClimber(climberName.trim());
    setClimberName('');
  }

  function handleClose() {
    setClimberName('');
    setError('');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.25)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#1f2937',
            margin: 0
          }}>
            👥 Add New Climber
          </h2>
          <button
            onClick={handleClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px'
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '6px' 
            }}>
              Climber Name
            </label>
            <input
              type="text"
              value={climberName}
              onChange={(e) => {
                setClimberName(e.target.value);
                if (error) setError('');
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: error ? '2px solid #ef4444' : '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder="Enter climber's name"
              disabled={isLoading}
              autoFocus
            />
            {error && (
              <div style={{ 
                color: '#ef4444', 
                fontSize: '14px', 
                marginTop: '6px' 
              }}>
                {error}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              style={{
                backgroundColor: 'transparent',
                color: '#6b7280',
                padding: '10px 20px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? '#9ca3af' : '#7c3aed',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
            >
              {isLoading ? '⏳ Adding...' : 'Add Climber'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

