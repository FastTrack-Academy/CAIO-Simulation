'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStudent } from '@/context/StudentContext';
import { supabase } from '../../lib/supabase';
import examsData from '../../data/all-exams';
import { getAttemptGrade } from '@/lib/grading';
import { Shield, Users, Clock, Award, BookOpen, ChevronDown, ChevronUp, ExternalLink, Activity } from 'lucide-react';

export default function AdminConsolePage() {
  const router = useRouter();
  const { user, isLoaded } = useStudent();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [logonLogs, setLogonLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const isAdmin = user?.email === 'haoyanjiang0709@gmail.com';

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace('/');
      return;
    }
    if (isLoaded && user && !isAdmin) {
      // Non-admin redirect
      return;
    }
  }, [user, isLoaded, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: profilesData } = await supabase.from('profiles').select('*');
        const { data: attemptsData } = await supabase.from('attempts').select('*');

        let logonLogsData = [];
        try {
          const { data, error } = await supabase
            .from('logon_logs')
            .select('*')
            .order('login_at', { ascending: false });
          if (!error && data) {
            logonLogsData = data;
          }
        } catch (e) {
          console.warn('logon_logs table might not exist yet:', e);
        }

        // Exclude admin
        const normalCandidates = (profilesData || []).filter(c => c.email !== 'haoyanjiang0709@gmail.com');
        setCandidates(normalCandidates);
        setAttempts(attemptsData || []);
        setLogonLogs(logonLogsData);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  if (!isLoaded || (isAdmin && loading)) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Admin Console...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="denied-container glass-card">
        <Shield size={48} className="denied-icon" />
        <h2>Access Denied</h2>
        <p>You do not have administrative privileges to access this console.</p>
        <button className="btn-primary" onClick={() => router.push('/')}>
          Return to Home
        </button>
      </div>
    );
  }

  // Calculate Overall Metrics
  const totalCandidates = candidates.length;
  const completedAttempts = attempts.filter(a => a.is_completed);
  const totalCompletedExams = completedAttempts.length;
  const markedAttempts = completedAttempts.filter(a => {
    const exam = examsData.find(exam => exam.id === a.exam_id);
    return !exam || getAttemptGrade(exam, a.answers || {}).pendingCount === 0;
  });
  const averageCorrectnessGlobal = markedAttempts.length > 0
    ? Math.round(markedAttempts.reduce((acc, curr) => acc + (curr.score / curr.total_points) * 100, 0) / markedAttempts.length)
    : 0;

  const totalGlobalScreenTime = attempts.reduce((acc, curr) => acc + curr.time_spent, 0);

  // Time format utility
  const formatTimeSpent = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;

    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const toggleExpandUser = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  return (
    <div className="admin-console animate-fade-in">
      <div className="admin-header glass-card">
        <div className="title-area">
          <Shield size={28} className="admin-badge-icon" />
          <h1>Admin Console</h1>
        </div>
        <p>Students, practice history, and marking.</p>
      </div>

      {/* Global Stat Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card glass-card">
          <div className="stat-icon-wrapper blue">
            <Users size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{totalCandidates}</span>
            <span className="stat-label">Students</span>
          </div>
        </div>

        <div className="admin-stat-card glass-card">
          <div className="stat-icon-wrapper green">
            <Clock size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{formatTimeSpent(totalGlobalScreenTime)}</span>
            <span className="stat-label">Study time</span>
          </div>
        </div>

        <div className="admin-stat-card glass-card">
          <div className="stat-icon-wrapper purple">
            <BookOpen size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{totalCompletedExams}</span>
            <span className="stat-label">Completed papers</span>
          </div>
        </div>

        <div className="admin-stat-card glass-card">
          <div className="stat-icon-wrapper gold">
            <Award size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{markedAttempts.length ? `${averageCorrectnessGlobal}%` : '—'}</span>
            <span className="stat-label">Average score</span>
          </div>
        </div>
      </div>

      {/* User Progress List */}
      <div className="candidates-list-container glass-card">
        <h2 className="section-title">
          <Activity size={18} />
          <span>Student activity</span>
        </h2>

        {candidates.length === 0 ? (
          <div className="empty-state">
            <Users size={32} />
            <p>No candidates have registered for the exam preparation yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Study time</th>
                  <th>Progress</th>
                  <th>Average</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(candidate => {
                  const userAttempts = attempts.filter(a => a.student_id === candidate.id);
                  const completedUserAttempts = userAttempts.filter(a => a.is_completed);
                  const isExpanded = expandedUser === candidate.id;

                  // Stats Calculations
                  const totalTime = userAttempts.reduce((acc, curr) => acc + curr.time_spent, 0);
                  const markedUserAttempts = completedUserAttempts.filter(a => {
                    const exam = examsData.find(exam => exam.id === a.exam_id);
                    return !exam || getAttemptGrade(exam, a.answers || {}).pendingCount === 0;
                  });
                  const avgScore = markedUserAttempts.length > 0
                    ? Math.round(markedUserAttempts.reduce((acc, curr) => acc + (curr.score / curr.total_points) * 100, 0) / markedUserAttempts.length)
                    : null;

                  return (
                    <React.Fragment key={candidate.id}>
                      <tr className={`user-row ${isExpanded ? 'expanded' : ''}`}>
                        <td>
                          <div className="user-info-cell">
                            <div
                              className="user-avatar"
                              style={{ backgroundColor: candidate.avatar_color || '#6366f1' }}
                            >
                              {getInitials(candidate.name)}
                            </div>
                            <div className="user-meta">
                              <span className="user-name">{candidate.name}</span>
                              <span className="user-email">{candidate.email || 'No email registered'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="metric-cell font-mono">{formatTimeSpent(totalTime)}</td>
                        <td className="metric-cell">
                          <span className="progress-badge">
                            {completedUserAttempts.length} / {userAttempts.length} completed
                          </span>
                        </td>
                        <td className="metric-cell font-mono score-cell">
                          {avgScore !== null ? (
                            <span className={avgScore >= 70 ? 'pass-score' : 'fail-score'}>
                              {avgScore}%
                            </span>
                          ) : (
                            <span className="no-score">—</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn-action-trigger"
                            onClick={() => toggleExpandUser(candidate.id)}
                          >
                            <span>Activity</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="expansion-details-row">
                          <td colSpan={5}>
                            <div className="expansion-details-grid">
                              {/* Left Panel: Attempts History */}
                              <div className="detailed-attempts-panel">
                                <h3>User Attempts History</h3>
                                {userAttempts.length === 0 ? (
                                  <p className="no-attempts-notice">This candidate has not started any practice exams yet.</p>
                                ) : (
                                  <div className="nested-table-container">
                                    <table className="nested-table">
                                      <thead>
                                        <tr>
                                          <th>Practice Exam</th>
                                          <th>Date Taken</th>
                                          <th>Points</th>
                                          <th>Percent</th>
                                          <th>Time Spent</th>
                                          <th>Status</th>
                                          <th>Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {userAttempts.map(a => {
                                          const examName = examsData.find(e => e.id === a.exam_id)?.name || a.exam_id;
                                          const exam = examsData.find(e => e.id === a.exam_id);
                                          const pending = exam ? getAttemptGrade(exam, a.answers || {}).pendingCount > 0 : false;
                                          const scorePercentage = Math.round((a.score / a.total_points) * 100);
                                          const dateLabel = a.completed_at
                                            ? new Date(a.completed_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                              })
                                            : 'In Progress';

                                          return (
                                            <tr key={a.id}>
                                              <td className="exam-name-cell">{examName}</td>
                                              <td>{dateLabel}</td>
                                              <td className="font-mono">{a.is_completed ? `${a.score}/${a.total_points}` : '—'}</td>
                                              <td className="font-mono score-cell">
                                                {a.is_completed ? (
                                                  <span className={scorePercentage >= 70 ? 'pass-score' : 'fail-score'}>
                                                    {pending ? 'Pending' : `${scorePercentage}%`}
                                                  </span>
                                                ) : '—'}
                                              </td>
                                              <td className="font-mono">{formatTimeSpent(a.time_spent)}</td>
                                              <td>
                                                <span className={`status-pill ${a.is_completed ? 'completed' : 'active'}`}>
                                                  {a.is_completed ? pending ? 'Awaiting marking' : 'Completed' : 'Active'}
                                                </span>
                                              </td>
                                              <td>
                                                {a.is_completed && (
                                                  <a
                                                    href={a.exam_id.startsWith('cjaio_') ? `/admin/attempt/${a.id}` : `/exam/${a.id}/review`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn-review-link"
                                                  >
                                                    <span>{a.exam_id.startsWith('cjaio_') ? 'Review / Mark' : 'Review'}</span>
                                                    <ExternalLink size={12} />
                                                  </a>
                                                )}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>

                              {/* Right Panel: Logon History */}
                              <div className="detailed-logons-panel">
                                <h3>Logon & Session History</h3>
                                {logonLogs.filter(log => log.user_id === candidate.id).length === 0 ? (
                                  <p className="no-attempts-notice">No logon logs recorded yet. (Ensure the <code>logon_logs</code> table is created in your database)</p>
                                ) : (
                                  <div className="nested-table-container">
                                    <table className="nested-table">
                                      <thead>
                                        <tr>
                                          <th>Login Time</th>
                                          <th>Last Active / Logout</th>
                                          <th>Duration</th>
                                          <th>Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {logonLogs
                                          .filter(log => log.user_id === candidate.id)
                                          .slice(0, 10) // Show last 10 logons
                                          .map(log => {
                                            const loginDate = new Date(log.login_at);
                                            const lastActiveDate = new Date(log.last_active);
                                            const isOnline = !log.logout_at && (Date.now() - lastActiveDate.getTime() < 60000);

                                            const durationSec = Math.round((lastActiveDate.getTime() - loginDate.getTime()) / 1000);

                                            const loginLabel = loginDate.toLocaleString('en-US', {
                                              month: 'short',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            });

                                            const logoutLabel = log.logout_at
                                              ? new Date(log.logout_at).toLocaleString('en-US', {
                                                  month: 'short',
                                                  day: 'numeric',
                                                  hour: '2-digit',
                                                  minute: '2-digit'
                                                })
                                              : (isOnline ? 'Active now' : `Last active ${lastActiveDate.toLocaleTimeString('en-US', {
                                                  hour: '2-digit',
                                                  minute: '2-digit'
                                                })}`);

                                            return (
                                              <tr key={log.id}>
                                                <td className="exam-name-cell">{loginLabel}</td>
                                                <td>{logoutLabel}</td>
                                                <td className="font-mono">{formatTimeSpent(durationSec)}</td>
                                                <td>
                                                  <span className={`status-pill ${isOnline ? 'completed' : 'offline'}`}>
                                                    {isOnline ? 'Online' : 'Offline'}
                                                  </span>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Table setup notice */}
      <details className="sql-setup-details glass-card">
        <summary className="sql-setup-summary">
          <span>Connection setup</span>
        </summary>
        <div className="sql-setup-content">
          <p>Run this SQL query in your <strong>Supabase SQL Editor</strong> to create the required <code>logon_logs</code> table and configure Row Level Security (RLS) policies for logon monitoring:</p>
          <pre className="sql-code-block">
{`CREATE TABLE IF NOT EXISTS public.logon_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  login_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  logout_at TIMESTAMPTZ,
  last_active TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.logon_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read logon_logs" ON public.logon_logs
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow individual insert/update logon_logs" ON public.logon_logs
  FOR ALL TO authenticated USING (true);`}
          </pre>
        </div>
      </details>


    </div>
  );
}
