'use client';

import React from 'react';
import Link from 'next/link';
import { Award, BookOpen, Clock, AlertCircle, BarChart2, Eye, Trash2 } from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import examsData from '@/data/exams.json';

export default function DashboardPage() {
  const { activeStudent, getStudentAttempts, deleteAttempt, stats, isLoaded } = useStudent();

  const getScoreColorClass = (score: number) => {
    if (score >= 50) return 'score-pass';
    if (score >= 35) return 'score-borderline';
    return 'score-fail';
  };

  if (!isLoaded || !activeStudent) return null;

  const studentAttempts = getStudentAttempts(activeStudent.id).filter(a => a.isCompleted);

  const formatTimeSpent = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins} mins`;
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Find areas of improvement based on incorrect answers
  // We can group topics dynamically from question details
  const getWeaknesses = () => {
    const topicErrors: { [topic: string]: number } = {};
    const topicTotals: { [topic: string]: number } = {};

    studentAttempts.forEach(attempt => {
      const exam = examsData.find(e => e.id === attempt.examId);
      if (!exam) return;

      exam.questions.forEach(q => {
        // Tag questions based on keywords
        let topic = 'General ML';
        const txt = q.text.toLowerCase();
        if (txt.includes('regression') || txt.includes('linear')) topic = 'Regression Models';
        else if (txt.includes('bayes') || txt.includes('naive')) topic = 'Naïve Bayes Classifier';
        else if (txt.includes('numpy') || txt.includes('pandas') || txt.includes('split') || txt.includes('matrix')) topic = 'Data Manipulation (NumPy/Pandas)';
        else if (txt.includes('recommend') || txt.includes('collaborative') || txt.includes('filtering')) topic = 'Recommendation Systems';
        else if (txt.includes('svm') || txt.includes('support vector')) topic = 'Support Vector Machines (SVM)';
        else if (txt.includes('k-means') || txt.includes('cluster') || txt.includes('elbow')) topic = 'Clustering (K-Means)';
        else if (txt.includes('search') || txt.includes('ucs') || txt.includes('bfs') || txt.includes('a*')) topic = 'Search Algorithms & AI Agent Search';
        else if (txt.includes('tree') || txt.includes('forest') || txt.includes('xgboost') || txt.includes('gradient')) topic = 'Tree Models & Boosting';

        topicTotals[topic] = (topicTotals[topic] || 0) + 1;

        const studentAns = attempt.answers[q.id] || '';
        // If student answer is not correct, increment errors
        // Simple string match check for correct answer
        const cleanCorrect = q.correctAnswer.replace(/\*\*/g, '').trim();
        const cleanStudent = studentAns.replace(/\*\*/g, '').trim();
        const isCorrect = cleanStudent && (cleanCorrect === cleanStudent || cleanCorrect.startsWith(cleanStudent) || cleanStudent.startsWith(cleanCorrect));
        
        if (!isCorrect) {
          topicErrors[topic] = (topicErrors[topic] || 0) + 1;
        }
      });
    });

    return Object.keys(topicTotals).map(topic => {
      const errors = topicErrors[topic] || 0;
      const total = topicTotals[topic];
      const errorRate = total > 0 ? Math.round((errors / total) * 100) : 0;
      return { topic, errors, total, errorRate };
    }).sort((a, b) => b.errorRate - a.errorRate);
  };

  const weaknesses = getWeaknesses().filter(w => w.errors > 0);

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="dashboard-header">
        <h1>Welcome back, {activeStudent.name}</h1>
        <p>Review your exam attempts history, track learning statistics, and target weak syllabus topics.</p>
      </div>

      {/* Grid Stats Row */}
      <div className="stats-row">
        <div className="stat-card glass-card">
          <Award className="stat-icon purple" size={24} />
          <div className="stat-details">
            <span className={`stat-value ${getScoreColorClass(stats.averageScore)}`}>{stats.averageScore}%</span>
            <span className="stat-label">Average Score</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <BookOpen className="stat-icon indigo" size={24} />
          <div className="stat-details">
            <span className="stat-value">{stats.examsTaken}</span>
            <span className="stat-label">Simulations Completed</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <Clock className="stat-icon cyan" size={24} />
          <div className="stat-details">
            <span className="stat-value">{formatTimeSpent(stats.totalTimeSpent)}</span>
            <span className="stat-label">Total Time Studying</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <AlertCircle className="stat-icon red" size={24} />
          <div className="stat-details">
            <span className="stat-value">{stats.incorrectCount}</span>
            <span className="stat-label">Weak Questions</span>
          </div>
        </div>
      </div>

      <div className="dashboard-split">
        {/* Attempt history list */}
        <div className="attempts-history-section">
          <h2 className="widget-title">Practice Attempt Logs</h2>
          
          {studentAttempts.length === 0 ? (
            <div className="empty-attempts glass-card">
              <BarChart2 size={36} />
              <p>No practice simulations recorded yet.</p>
              <Link href="/" className="btn-primary start-first-btn">
                Launch Practice Exam
              </Link>
            </div>
          ) : (
            <div className="attempts-list">
              {studentAttempts.sort((a,b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).map(attempt => {
                const examName = examsData.find(e => e.id === attempt.examId)?.name || 'CAIO Practice Exam';
                const percentage = Math.round((attempt.score / attempt.totalPoints) * 100);
                const isPassed = percentage >= 70;

                return (
                  <div key={attempt.id} className="attempt-card glass-card">
                    <div className="attempt-card-main">
                      <div className="attempt-title-info">
                        <h3>{examName}</h3>
                        <span className="attempt-date">
                          Taken: {formatDate(attempt.completedAt)}
                        </span>
                      </div>
                      
                      <div className="attempt-stats-mini">
                        <div className="attempt-stat-mini">
                          <span className="mini-lbl">Grade</span>
                          <span className={`mini-val ${getScoreColorClass(percentage)}`}>
                            {percentage}%
                          </span>
                        </div>
                        <div className="attempt-stat-mini">
                          <span className="mini-lbl">Score</span>
                          <span className="mini-val">
                            {attempt.score} / {attempt.totalPoints} pts
                          </span>
                        </div>
                        <div className="attempt-stat-mini">
                          <span className="mini-lbl">Time Spent</span>
                          <span className="mini-val">
                            {Math.floor(attempt.timeSpent / 60)} mins
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="attempt-card-actions">
                      <Link 
                        href={`/exam/${attempt.id}/review`}
                        className="btn-secondary flex-btn-mini"
                        title="Review Answers"
                      >
                        <Eye size={14} />
                        <span>Review</span>
                      </Link>
                      <button 
                        onClick={() => deleteAttempt(attempt.id)}
                        className="btn-delete"
                        title="Delete Attempt Log"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Areas of Weakness breakdown */}
        <div className="syllabus-weakness-section">
          <h2 className="widget-title">Topic Analytics (Errors Rate)</h2>
          
          <div className="weakness-card glass-card">
            {weaknesses.length === 0 ? (
              <div className="perfect-score-banner">
                <span className="perfect-star">★</span>
                <h3>Solid Core Competency</h3>
                <p>Complete mock exams and get questions wrong to see your error rates and weakness topics visualized here.</p>
              </div>
            ) : (
              <div className="weaknesses-list">
                <p className="weakness-intro-text">
                  Below are syllabus topics ranked by the percentage of questions you answered incorrectly:
                </p>
                
                {weaknesses.map((w, idx) => (
                  <div key={idx} className="weakness-row">
                    <div className="weakness-row-info">
                      <span className="weakness-topic-name">{w.topic}</span>
                      <span className="weakness-topic-ratio">
                        {w.errors} wrong / {w.total} attempts ({w.errorRate}% error)
                      </span>
                    </div>
                    
                    <div className="progress-bar-container">
                      <div 
                        className={`progress-bar-fill ${w.errorRate > 50 ? 'danger' : (w.errorRate > 25 ? 'warning' : 'info')}`}
                        style={{ width: `${w.errorRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .dashboard-header h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        .dashboard-header p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background: rgba(22, 28, 45, 0.75);
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-icon.purple { background-color: rgba(168, 85, 247, 0.1); color: var(--color-accent); }
        .stat-icon.indigo { background-color: rgba(99, 102, 241, 0.1); color: var(--color-primary-light); }
        .stat-icon.cyan { background-color: rgba(6, 182, 212, 0.1); color: var(--color-secondary); }
        .stat-icon.red { background-color: rgba(239, 68, 68, 0.1); color: var(--color-error); }
        
        .stat-details {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.1;
        }
        .stat-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }
        
        @media (max-width: 900px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 500px) {
          .stats-row {
            grid-template-columns: 1fr;
          }
        }
        
        .dashboard-split {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 2rem;
        }
        @media (max-width: 900px) {
          .dashboard-split {
            grid-template-columns: 1fr;
          }
        }
        
        .widget-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }
        
        .empty-attempts {
          padding: 3rem;
          text-align: center;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .start-first-btn {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          border-radius: var(--radius-sm);
          margin-top: 0.5rem;
        }
        
        .attempts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .attempt-card {
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          background: rgba(22, 28, 45, 0.4);
        }
        .attempt-card:hover {
          background: rgba(22, 28, 45, 0.6);
        }
        .attempt-card-main {
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        @media (max-width: 600px) {
          .attempt-card-main {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .attempt-card {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        
        .attempt-title-info h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .attempt-date {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.1rem;
          display: block;
        }
        
        .attempt-stats-mini {
          display: flex;
          gap: 1.5rem;
        }
        .attempt-stat-mini {
          display: flex;
          flex-direction: column;
        }
        .mini-lbl {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .mini-val {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
        }
        .mini-val.pass { color: var(--color-success); }
        .mini-val.fail { color: var(--color-error); }
        
        .attempt-card-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .flex-btn-mini {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.4rem 0.6rem;
          font-size: 0.75rem;
          border-radius: var(--radius-sm);
        }
        
        .btn-delete {
          padding: 0.4rem;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.1);
          border-radius: var(--radius-sm);
          color: var(--color-error);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-delete:hover {
          background-color: var(--color-error-bg);
          border-color: rgba(239, 68, 68, 0.3);
        }
        
        .weakness-card {
          padding: 1.5rem;
          background: rgba(22, 28, 45, 0.5);
        }
        .perfect-score-banner {
          text-align: center;
          color: var(--text-muted);
          padding: 1.5rem;
        }
        .perfect-star {
          font-size: 2rem;
          color: var(--color-warning);
          line-height: 1;
          margin-bottom: 0.5rem;
          display: block;
        }
        .perfect-score-banner h3 {
          font-size: 0.95rem;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }
        .perfect-score-banner p {
          font-size: 0.75rem;
          line-height: 1.4;
        }
        
        .weakness-intro-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          line-height: 1.4;
        }
        
        .weakness-row {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 1rem;
        }
        .weakness-row:last-child {
          margin-bottom: 0;
        }
        .weakness-row-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }
        .weakness-topic-name {
          font-weight: 700;
          color: var(--text-primary);
        }
        .weakness-topic-ratio {
          color: var(--text-muted);
        }
        
        .progress-bar-container {
          width: 100%;
          height: 6px;
          background-color: rgba(255,255,255,0.03);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: var(--radius-full);
        }
        .progress-bar-fill.danger { background-color: var(--color-error); }
        .progress-bar-fill.warning { background-color: var(--color-warning); }
        .progress-bar-fill.info { background-color: var(--color-secondary); }
      `}</style>
    </div>
  );
}
