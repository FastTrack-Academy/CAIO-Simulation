'use client';

import React from 'react';
import Link from 'next/link';
import { Award, BookOpen, Clock, AlertCircle, BarChart2, Eye, Trash2 } from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import examsData from '@/data/all-exams';
import { getAttemptGrade, getQuestionGrade } from '@/lib/grading';

export default function DashboardPage() {
  const { activeStudent, getStudentAttempts, deleteAttempt, stats, isLoaded } = useStudent();

  const getScoreColorClass = (score: number) => {
    if (score >= 50) return 'score-pass';
    if (score >= 35) return 'score-borderline';
    return 'score-fail';
  };

  if (!isLoaded || !activeStudent) return null;

  const studentAttempts = getStudentAttempts(activeStudent.id).filter(a => a.isCompleted);
  const hasMarkedAttempts = studentAttempts.some(attempt => {
    const exam = examsData.find(exam => exam.id === attempt.examId);
    return !exam || getAttemptGrade(exam, attempt.answers).pendingCount === 0;
  });

  const formatTimeSpent = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return sec < 60 ? `${sec}s` : `${mins} min`;
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
        const grade = getQuestionGrade(q, attempt.answers);
        if (grade.status === 'pending') return;
        // Tag questions based on keywords
        let topic = 'Core concepts';
        const txt = q.text.toLowerCase();
        if (txt.includes('regression') || txt.includes('linear')) topic = 'Regression';
        else if (txt.includes('bayes') || txt.includes('naive')) topic = 'Naïve Bayes Classifier';
        else if (txt.includes('numpy') || txt.includes('pandas') || txt.includes('split') || txt.includes('matrix')) topic = 'Data & arrays';
        else if (txt.includes('recommend') || txt.includes('collaborative') || txt.includes('filtering')) topic = 'Recommendation Systems';
        else if (txt.includes('svm') || txt.includes('support vector')) topic = 'Support Vector Machines (SVM)';
        else if (txt.includes('k-means') || txt.includes('cluster') || txt.includes('elbow')) topic = 'Clustering (K-Means)';
        else if (txt.includes('search') || txt.includes('ucs') || txt.includes('bfs') || txt.includes('a*')) topic = 'Search & algorithms';
        else if (txt.includes('tree') || txt.includes('forest') || txt.includes('xgboost') || txt.includes('gradient')) topic = 'Tree Models & Boosting';

        topicTotals[topic] = (topicTotals[topic] || 0) + 1;

        const isCorrect = grade.status === 'correct';

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
        <h1>Your progress</h1>
        <p>Your practice history across CAIO and CJAIO.</p>
      </div>

      {/* Grid Stats Row */}
      <div className="stats-row">
        <div className="stat-card glass-card">
          <Award className="stat-icon purple" size={24} />
          <div className="stat-details">
            <span className={`stat-value ${hasMarkedAttempts ? getScoreColorClass(stats.averageScore) : ''}`}>{hasMarkedAttempts ? `${stats.averageScore}%` : '—'}</span>
            <span className="stat-label">Average Score</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <BookOpen className="stat-icon indigo" size={24} />
          <div className="stat-details">
            <span className="stat-value">{stats.examsTaken}</span>
            <span className="stat-label">Completed papers</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <Clock className="stat-icon cyan" size={24} />
          <div className="stat-details">
            <span className="stat-value">{formatTimeSpent(stats.totalTimeSpent)}</span>
            <span className="stat-label">Study time</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <AlertCircle className="stat-icon red" size={24} />
          <div className="stat-details">
            <span className="stat-value">{stats.incorrectCount}</span>
            <span className="stat-label">Questions to revisit</span>
          </div>
        </div>
      </div>

      <div className="dashboard-split">
        {/* Attempt history list */}
        <div className="attempts-history-section">
          <h2 className="widget-title">Recent attempts</h2>

          {studentAttempts.length === 0 ? (
            <div className="empty-attempts glass-card">
              <BarChart2 size={36} />
              <p>Your practice history starts here.</p>
              <Link href="/" className="btn-primary start-first-btn">
                Choose a paper
              </Link>
            </div>
          ) : (
            <div className="attempts-list">
              {studentAttempts.sort((a,b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).map(attempt => {
                const exam = examsData.find(e => e.id === attempt.examId);
                const examName = exam?.name || 'Practice Exam';
                const pending = exam ? getAttemptGrade(exam, attempt.answers).pendingCount > 0 : false;
                const percentage = Math.round((attempt.score / attempt.totalPoints) * 100);

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
                            {pending ? 'Awaiting marking' : `${percentage}%`}
                          </span>
                        </div>
                        <div className="attempt-stat-mini">
                          <span className="mini-lbl">Score</span>
                          <span className="mini-val">
                            {attempt.score} / {attempt.totalPoints} pts
                          </span>
                        </div>
                        <div className="attempt-stat-mini">
                          <span className="mini-lbl">Time</span>
                          <span className="mini-val">
                            {formatTimeSpent(attempt.timeSpent)}
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
                        aria-label="Delete attempt"
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
          <h2 className="widget-title">Topics to revisit</h2>

          <div className="weakness-card glass-card">
            {weaknesses.length === 0 ? (
              <div className="perfect-score-banner">
                <span className="perfect-star">★</span>
                <h3>No topic data yet</h3>
                <p>Your marked work will show which topics need another look.</p>
              </div>
            ) : (
              <div className="weaknesses-list">
                <p className="weakness-intro-text">
                  Topics are ordered by the share of answers to revisit.
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
    </div>
  );
}
