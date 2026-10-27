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
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
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
          <h2>A little practice. A lot of progress.</h2>
          <p>Your space to practise CAIO and CJAIO.</p>
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
                      autoComplete="name"
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
                    autoComplete="email"
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
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                {loading ? <div className="btn-spinner"></div> : (isLogin ? 'Sign in' : 'Create account')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
