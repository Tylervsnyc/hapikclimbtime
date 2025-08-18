'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { resetPassword, isLoading, error: authError } = useAuth();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setEmail(value);
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  }

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      // Error is handled by the auth context
      console.error('Password reset failed:', err);
    }
  }

  if (isSubmitted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
          padding: '32px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            margin: '0 0 12px 0'
          }}>
            Check Your Email
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '16px',
            margin: '0 0 24px 0',
            lineHeight: '1.5'
          }}>
            We've sent a password reset link to <strong>{email}</strong>. 
            Click the link in the email to reset your password.
          </p>
          
          <div style={{ marginBottom: '24px' }}>
            <Link 
              href="/auth/login"
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                display: 'inline-block'
              }}
            >
              Back to Login
            </Link>
          </div>

          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            margin: 0
          }}>
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setIsSubmitted(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#7c3aed',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
        padding: '24px',
        width: '100%',
        maxWidth: '380px',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <img 
              src="/images/Industry City Logo Red.png" 
              alt="Hapik Logo" 
              style={{ height: '40px', width: 'auto' }}
            />
          </div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            margin: '0 0 6px 0'
          }}>
            Reset Your Password
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            margin: 0
          }}>
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Reset Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          {/* Email Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '6px' 
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: errors.email ? '2px solid #ef4444' : '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            {errors.email && (
              <div style={{ 
                color: '#ef4444', 
                fontSize: '14px', 
                marginTop: '6px' 
              }}>
                {errors.email}
              </div>
            )}
          </div>

          {/* Auth Error Display */}
          {authError && (
            <div style={{ 
              backgroundColor: '#fef2f2', 
              color: '#dc2626', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              ❌ {authError}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#9ca3af' : '#7c3aed',
              color: 'white',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? '⏳ Sending...' : '📧 Send Reset Link'}
          </button>
        </form>

        {/* Login Link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            margin: 0
          }}>
            Remember your password?{' '}
            <Link 
              href="/auth/login"
              style={{
                color: '#7c3aed',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link 
            href="/"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

