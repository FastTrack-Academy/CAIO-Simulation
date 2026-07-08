'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Award, ArrowRight, Play, RefreshCw, BarChart2, Eye } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import examsData from '../data/exams.json';

export default function HomePage() {
  const router = useRouter();
  const { activeStudent, getStudentAttempts, saveAttempt, isLoaded } = useStudent();

  const getScoreColorClass = (score: number) => {
    if (score >= 50) return 'score-pass';
    if (score >= 35) return 'score-borderline';
    return 'score-fail';
  };

  if (!isLoaded || !activeStudent) return null;

  const studentAttempts = getStudentAttempts(activeStudent.id);

  // Group attempts by examId to find best score and status
  const examStatus = examsData.map(exam => {
    const examAttempts = studentAttempts.filter(a => a.examId === exam.id);
    const completedAttempts = examAttempts.filter(a => a.isCompleted);
    const activeAttempt = examAttempts.find(a => !a.isCompleted);
    
    const bestScore = completedAttempts.length > 0
      ? Math.max(...completedAttempts.map(a => Math.round((a.score / a.totalPoints) * 100)))
      : null;

    let status: 'not-started' | 'in-progress' | 'completed' = 'not-started';
    if (activeAttempt) {
      status = 'in-progress';
    } else if (completedAttempts.length > 0) {
      status = 'completed';
    }

    const totalPoints = exam.questions.reduce((acc, q) => acc + q.points, 0);

    return {
      ...exam,
      totalPoints,
      attemptsCount: completedAttempts.length,
      bestScore,
      status,
      activeAttemptId: activeAttempt?.id || null
    };
  });

  const handleStartExam = (examId: string, activeAttemptId: string | null) => {
    if (activeAttemptId) {
      // Resume existing attempt
      router.push(`/exam/${activeAttemptId}`);
    } else {
      // Create a new attempt
      const exam = examsData.find(e => e.id === examId);
      if (!exam) return;

      const totalPoints = exam.questions.reduce((acc, q) => acc + q.points, 0);
      const newAttemptId = `attempt_${Date.now()}`;
      
      const newAttempt = {
        id: newAttemptId,
        studentId: activeStudent.id,
        examId: examId,
        score: 0,
        totalPoints,
        answers: {},
        flagged: [],
        timeSpent: 0,
        timeLeft: 90 * 60, // 1.5 hours in seconds
        completedAt: '',
        isCompleted: false
      };

      saveAttempt(newAttempt);
      router.push(`/exam/${newAttemptId}`);
    }
  };

  return (
    <div className="home-page animate-fade-in">
      <div className="welcome-banner glass-card">
        <div className="banner-left">
          <span className="badge">CAIO Candidate Hub</span>
          <h1>Master Your AI Skills</h1>
          <p>
            Emulate the official exam room with standard 1.5-hour testing limits. 
            Track your analytics, isolate weaknesses, and build your customized review question book.
          </p>
        </div>
        <div className="banner-right">
          <div className="stat-circle">
            <span className="stat-num">{activeStudent.name ? activeStudent.name.split(' ')[0] : 'Hi'}</span>
            <span className="stat-label">Active Candidate</span>
          </div>
        </div>
      </div>

      <div className="sections-grid">
        <div className="exams-section">
          <h2 className="section-title">
            <BookOpen size={20} />
            <span>Available Practice Exams</span>
          </h2>
          
          <div className="exams-list">
            {examStatus.map(exam => (
              <div key={exam.id} className="exam-card glass-card">
                <div className="exam-card-header">
                  <div className="exam-header-left">
                    <span className="exam-tag">Official Format</span>
                    {exam.difficulty && (
                      <span className={`difficulty-badge ${exam.difficulty.toLowerCase().includes('harder') ? 'harder' : 'equivalent'}`}>
                        {exam.difficulty.toLowerCase().includes('harder') ? 'Harder' : 'Equivalent'}
                      </span>
                    )}
                  </div>
                  {exam.status === 'completed' && (
                    <div className="exam-status completed">Completed</div>
                  )}
                  {exam.status === 'in-progress' && (
                    <div className="exam-status in-progress">In Progress</div>
                  )}
                  {exam.status === 'not-started' && (
                    <div className="exam-status not-started">Not Started</div>
                  )}
                </div>

                <div className="exam-card-body">
                  <h3>{exam.name}</h3>
                  <p className="exam-desc">
                    Comprehensive practice set including multi-choice and short-code execution challenges.
                  </p>
                  
                  <div className="exam-meta-grid">
                    <div className="meta-item">
                      <span className="meta-label">Questions</span>
                      <span className="meta-value">{exam.questions.length} Qs</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Total Weight</span>
                      <span className="meta-value">{exam.totalPoints} pts</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Duration</span>
                      <span className="meta-value">90 mins</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Best Score</span>
                      <span className={`meta-value ${exam.bestScore !== null ? getScoreColorClass(exam.bestScore) : ''}`}>
                        {exam.bestScore !== null ? `${exam.bestScore}%` : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="exam-card-footer">
                  {exam.status === 'in-progress' ? (
                    <button 
                      onClick={() => handleStartExam(exam.id, exam.activeAttemptId)}
                      className="btn-primary flex-btn"
                    >
                      <Play size={16} />
                      <span>Resume Simulation</span>
                    </button>
                  ) : exam.status === 'completed' ? (
                    <div className="completed-actions">
                      <button 
                        onClick={() => handleStartExam(exam.id, null)}
                        className="btn-secondary flex-btn"
                      >
                        <RefreshCw size={14} />
                        <span>Retake Exam</span>
                      </button>
                      <Link 
                        href={`/exam/${studentAttempts.filter(a => a.examId === exam.id && a.isCompleted).sort((a,b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0]?.id}/review`}
                        className="btn-primary flex-btn"
                      >
                        <Eye size={14} />
                        <span>Review Solutions</span>
                      </Link>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleStartExam(exam.id, null)}
                      className="btn-primary flex-btn"
                    >
                      <Play size={16} />
                      <span>Start 1.5h Simulation</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-sidebar">
          <div className="sidebar-widget glass-card">
            <h3>Quick Performance Overview</h3>
            <div className="sidebar-stats">
              <div className="sidebar-stat-item">
                <span className="side-label">Exams Completed</span>
                <span className="side-val">
                  {studentAttempts.filter(a => a.isCompleted).length}
                </span>
              </div>
              <div className="sidebar-stat-item">
                <span className="side-label">Avg Grade</span>
                <span className={`side-val ${studentAttempts.filter(a => a.isCompleted).length > 0 ? getScoreColorClass(Math.round(studentAttempts.filter(a => a.isCompleted).reduce((acc, curr) => acc + (curr.score / curr.totalPoints) * 100, 0) / studentAttempts.filter(a => a.isCompleted).length)) : ''}`}>
                  {studentAttempts.filter(a => a.isCompleted).length > 0
                    ? `${Math.round(studentAttempts.filter(a => a.isCompleted).reduce((acc, curr) => acc + (curr.score / curr.totalPoints) * 100, 0) / studentAttempts.filter(a => a.isCompleted).length)}%`
                    : '—'}
                </span>
              </div>
            </div>
            <Link href="/dashboard" className="sidebar-link">
              <span>View detailed analytics</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="sidebar-widget glass-card accent-glow">
            <h3>Custom Question Book</h3>
            <p>Review questions you saved or got wrong during previous exam attempts.</p>
            <Link href="/question-book" className="btn-primary flex-btn margin-top-sm">
              <Award size={16} />
              <span>Open Question Book</span>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .home-page {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .welcome-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2.5rem;
          background: linear-gradient(135deg, rgba(22, 28, 45, 0.8) 0%, rgba(10, 13, 22, 0.8) 100%);
          border-left: 4px solid var(--color-primary);
        }
        .banner-left {
          max-width: 70%;
        }
        .badge {
          display: inline-block;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          background: rgba(99, 102, 241, 0.15);
          color: var(--color-primary-light);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }
        .banner-left h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          background: linear-gradient(to right, #ffffff, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .banner-left p {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.5;
        }
        .banner-right {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%);
          border: 1px solid rgba(99, 102, 241, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.1);
        }
        .stat-num {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-secondary);
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .stat-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
          margin-top: 0.25rem;
        }
        
        .sections-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 2rem;
        }
        @media (max-width: 960px) {
          .sections-grid {
            grid-template-columns: 1fr;
          }
          .welcome-banner {
            flex-direction: column;
            gap: 1.5rem;
            align-items: flex-start;
          }
          .banner-left {
            max-width: 100%;
          }
        }

        .exams-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          color: var(--text-primary);
        }
        
        .exams-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .exam-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .exam-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .exam-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .exam-tag {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .difficulty-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          line-height: 1;
        }
        .difficulty-badge.harder {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.2) 100%);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
        }
        .difficulty-badge.equivalent {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.2) 100%);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
        }
        .exam-status {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        .exam-status.completed {
          background-color: var(--color-success-bg);
          color: var(--color-success);
        }
        .exam-status.in-progress {
          background-color: var(--color-warning-bg);
          color: var(--color-warning);
        }
        .exam-status.not-started {
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
        }
        
        .exam-card-body h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        .exam-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }
        .exam-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          background: rgba(255, 255, 255, 0.02);
          padding: 0.75rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 255, 255, 0.03);
        }
        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .meta-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }
        .meta-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        
        .completed-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          width: 100%;
        }
        .flex-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
        }
        
        .quick-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .sidebar-widget {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .sidebar-widget h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .sidebar-widget p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .sidebar-widget.accent-glow {
          border-color: rgba(6, 182, 212, 0.2);
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(22, 28, 45, 0.6) 100%);
        }
        .sidebar-stats {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin: 0.25rem 0;
        }
        .sidebar-stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-sm);
        }
        .side-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .side-val {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--color-secondary);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .sidebar-link:hover {
          color: var(--text-primary);
        }
        .margin-top-sm {
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
