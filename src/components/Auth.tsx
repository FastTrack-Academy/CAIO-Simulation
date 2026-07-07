'use client';

import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { Key, Mail, User, AlertTriangle } from 'lucide-react';

export function Auth() {
  const { signIn, signUp } = useStudent();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const configured = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) return;
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
      } else {
        const res = await signUp(email, password, fullName);
        if (res.error) throw res.error;
        
        if (res.data?.session) {
          alert('Registration successful! You have been logged in automatically.');
        } else {
          alert('Registration successful! Please check your email for a confirmation link.');
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      let msg = err.message || 'An unexpected error occurred.';
      if (msg.toLowerCase().includes('rate limit')) {
        msg = `${msg} (Tip: As the administrator, you can manually create accounts for your students in the Supabase Dashboard under Authentication > Users > Add User to bypass this limit.)`;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="logo-icon">AI</div>
          <h2>Olympiad AI Mock Exam</h2>
          <p>Secure cloud portal for FastTrack Academy Scholars</p>
        </div>

        {!configured ? (
          <div className="config-warning">
            <AlertTriangle size={24} className="warning-icon" />
            <h3>Database Configuration Required</h3>
            <p>
              Please configure your Supabase variables in the <code>.env.local</code> file at the root of the project to initialize the database:
            </p>
            <pre>
              NEXT_PUBLIC_SUPABASE_URL=...<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=...
            </pre>
            <p className="hint">
              Once configured, restart your local Next.js server to load the database portal.
            </p>
          </div>
        ) : (
          <>
            <div className="tabs-row">
              <button 
                className={`tab-btn ${isLogin ? 'active' : ''}`}
                onClick={() => { setIsLogin(true); setError(''); }}
              >
                Log In
              </button>
              <button 
                className={`tab-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => { setIsLogin(false); setError(''); }}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div className="error-message">{error}</div>}

              {!isLogin && (
                <div className="input-group">
                  <label htmlFor="name-input">Full Name</label>
                  <div className="input-wrapper">
                    <User size={16} className="input-icon" />
                    <input 
                      id="name-input"
                      type="text" 
                      placeholder="John Doe" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required 
                    />
                  </div>
                </div>
              )}

              <div className="input-group">
                <label htmlFor="email-input">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input 
                    id="email-input"
                    type="email" 
                    placeholder="candidate@caio.org" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password-input">Password</label>
                <div className="input-wrapper">
                  <Key size={16} className="input-icon" />
                  <input 
                    id="password-input"
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                {loading ? <div className="btn-spinner"></div> : (isLogin ? 'Access Practice Environment' : 'Create Credentials Account')}
              </button>
            </form>
          </>
        )}
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          width: 100%;
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          padding: 2.5rem;
          background: rgba(17, 21, 36, 0.7);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          border-radius: 12px;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .logo-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          color: white;
          margin: 0 auto 1rem auto;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
        }
        .auth-header h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        .auth-header p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .config-warning {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          padding: 1.25rem;
          text-align: center;
          color: #fca5a5;
        }
        .warning-icon {
          color: #ef4444;
          margin-bottom: 0.75rem;
          margin-left: auto;
          margin-right: auto;
        }
        .config-warning h3 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .config-warning p {
          font-size: 0.8rem;
          line-height: 1.4;
          margin-bottom: 0.75rem;
        }
        .config-warning pre {
          background: rgba(0, 0, 0, 0.3);
          padding: 0.5rem;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          text-align: left;
          color: #f3f4f6;
          margin-bottom: 0.75rem;
          overflow-x: auto;
        }
        .hint {
          font-size: 0.75rem;
          color: var(--text-muted) !important;
        }
        .tabs-row {
          display: flex;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 1.5rem;
        }
        .tab-btn {
          flex: 1;
          background: none;
          border: none;
          padding: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          position: relative;
          transition: color 0.2s ease;
        }
        .tab-btn:hover {
          color: var(--text-primary);
        }
        .tab-btn.active {
          color: var(--color-primary-light);
        }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--color-primary);
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 6px;
          padding: 0.75rem;
          color: #f87171;
          font-size: 0.8rem;
          line-height: 1.4;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .input-group label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--text-muted);
        }
        .input-wrapper input {
          width: 100%;
          padding: 0.65rem 0.75rem 0.65rem 2.25rem;
          background: rgba(10, 13, 22, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }
        .input-wrapper input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 8px rgba(99, 102, 241, 0.15);
        }
        .auth-submit-btn {
          width: 100%;
          padding: 0.75rem;
          font-size: 0.9rem;
          font-weight: 700;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
        }
        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
