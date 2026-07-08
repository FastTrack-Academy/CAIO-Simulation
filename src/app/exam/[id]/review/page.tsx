'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, ChevronLeft, Calendar, Clock, Award, Bookmark, HelpCircle } from 'lucide-react';
import { useStudent, checkAnswer } from '@/context/StudentContext';
import { MathRenderer } from '@/components/MathRenderer';
import examsData from '@/data/exams.json';

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const attemptId = params.id as string;

  const { activeStudent, attempts, toggleSaveQuestion, questionBook, isLoaded } = useStudent();
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'saved'>('all');

  const attempt = attempts.find(a => a.id === attemptId);
  const exam = examsData.find(e => e?.id === attempt?.examId);

  if (!isLoaded || !attempt || !exam || !activeStudent) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading graded report...</p>
      </div>
    );
  }

  const questions = exam.questions;
  const percentage = Math.round((attempt.score / attempt.totalPoints) * 100);
  
  let gradeStatus: 'pass' | 'borderline' | 'fail' = 'fail';
  if (percentage >= 50) {
    gradeStatus = 'pass';
  } else if (percentage >= 35) {
    gradeStatus = 'borderline';
  }

  const formatTimeSpent = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return 'Recent';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Grade each question to filter or map them
  const gradedQuestions = questions.map(q => {
    const studentAns = attempt.answers[q.id] || '';
    const isCorrect = checkAnswer(studentAns, q.correctAnswer, q.type as any);
    const isSaved = questionBook.savedQuestions.includes(q.id);

    return {
      ...q,
      studentAns,
      isCorrect,
      isSaved
    };
  });

  const filteredQuestions = gradedQuestions.filter(q => {
    if (filter === 'correct') return q.isCorrect;
    if (filter === 'incorrect') return !q.isCorrect;
    if (filter === 'saved') return q.isSaved;
    return true;
  });

  const correctCount = gradedQuestions.filter(q => q.isCorrect).length;
  const incorrectCount = gradedQuestions.length - correctCount;

  return (
    <div className="review-page animate-fade-in">
      <div className="review-nav-header">
        <Link href="/" className="back-link">
          <ChevronLeft size={16} />
          <span>Exit Review</span>
        </Link>
        <span className="exam-review-label">Candidate Score Report</span>
      </div>

      {/* Grade Hero Section */}
      <div className="score-hero glass-card">
        <div className="score-summary-left">
          <div className="score-circle-wrapper">
            <svg className="progress-ring" width="120" height="120">
              <circle
                className="progress-ring-bg"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="8"
                fill="transparent"
                r="50"
                cx="60"
                cy="60"
              />
              <circle
                className={`progress-ring-fill ${gradeStatus}`}
                stroke={
                  gradeStatus === 'pass' 
                    ? 'var(--color-success)' 
                    : gradeStatus === 'borderline' 
                      ? 'var(--color-warning)' 
                      : 'var(--color-error)'
                }
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - Math.min(percentage, 100) / 100)}`}
                strokeLinecap="round"
                fill="transparent"
                r="50"
                cx="60"
                cy="60"
              />
            </svg>
            <div className="score-percentage">{percentage}%</div>
          </div>
          
          <div className="grade-details">
            <div className={`grade-badge ${gradeStatus}`}>
              {gradeStatus === 'pass' 
                ? 'PASSED (Safe Pass)' 
                : gradeStatus === 'borderline' 
                  ? 'BORDERLINE (Study Required)' 
                  : 'FAILING (Review Required)'}
            </div>
            <h2>{exam.name}</h2>
            <div className="attempt-info-row">
              <span className="info-item">
                <Calendar size={14} />
                <span>{formatDate(attempt.completedAt)}</span>
              </span>
              <span className="info-item">
                <Clock size={14} />
                <span>Spent: {formatTimeSpent(attempt.timeSpent)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="score-grid-right">
          <div className="score-tile glass-card">
            <span className="tile-label">Earned Score</span>
            <span className="tile-value">{attempt.score} / {attempt.totalPoints} pts</span>
          </div>
          <div className="score-tile glass-card">
            <span className="tile-label">Correct Answers</span>
            <span className="tile-value green">{correctCount}</span>
          </div>
          <div className="score-tile glass-card">
            <span className="tile-label">Incorrect Answers</span>
            <span className="tile-value red">{incorrectCount}</span>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="review-content">
        <div className="review-filters-bar glass-card">
          <div className="filter-title">Grade Review Sheets</div>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Questions ({questions.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'correct' ? 'active' : ''}`}
              onClick={() => setFilter('correct')}
            >
              Correct ({correctCount})
            </button>
            <button 
              className={`filter-btn ${filter === 'incorrect' ? 'active' : ''}`}
              onClick={() => setFilter('incorrect')}
            >
              Incorrect ({incorrectCount})
            </button>
            <button 
              className={`filter-btn ${filter === 'saved' ? 'active' : ''}`}
              onClick={() => setFilter('saved')}
            >
              Saved Book ({gradedQuestions.filter(q => q.isSaved).length})
            </button>
          </div>
        </div>

        <div className="graded-questions-list">
          {filteredQuestions.length === 0 ? (
            <div className="empty-filter glass-card">
              <HelpCircle size={36} />
              <p>No questions match the current filter selection.</p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => (
              <div 
                key={q.id} 
                className={`graded-question-card glass-card ${q.isCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="question-card-header">
                  <div className="q-badge-info">
                    <span className="q-number-lbl">Question {q.number}</span>
                    <span className="q-points-lbl">({q.points} Points)</span>
                  </div>
                  
                  <div className="card-top-actions">
                    <div className={`correctness-badge ${q.isCorrect ? 'correct' : 'incorrect'}`}>
                      {q.isCorrect ? (
                        <>
                          <CheckCircle size={14} />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={14} />
                          <span>Incorrect</span>
                        </>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => toggleSaveQuestion(activeStudent.id, q.id)}
                      className={`save-toggle-btn ${q.isSaved ? 'saved' : ''}`}
                      title={q.isSaved ? 'Remove from Question Book' : 'Add to Question Book'}
                    >
                      <Bookmark size={16} />
                      <span>{q.isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </div>

                <div className="q-text-body">
                  <MathRenderer text={q.text} />
                </div>

                {/* Show Options and choices */}
                {q.type === 'multiple-choice' ? (
                  <div className="review-options">
                    {q.options.map((opt, oIdx) => {
                      const isStudentAns = q.studentAns === opt;
                      const isCorrectAns = q.correctAnswer === opt || 
                        (oIdx === 0 && q.correctAnswer.startsWith('A.')) ||
                        (oIdx === 1 && q.correctAnswer.startsWith('B.')) ||
                        (oIdx === 2 && q.correctAnswer.startsWith('C.')) ||
                        (oIdx === 3 && q.correctAnswer.startsWith('D.')) ||
                        (oIdx === 4 && q.correctAnswer.startsWith('E.')) ||
                        q.correctAnswer.toLowerCase().includes(opt.substring(0, 30).toLowerCase());

                      let rowClass = 'review-opt-row';
                      if (isStudentAns && q.isCorrect) rowClass += ' correct-selected';
                      else if (isStudentAns && !q.isCorrect) rowClass += ' incorrect-selected';
                      else if (isCorrectAns) rowClass += ' should-select';

                      return (
                        <div key={oIdx} className={rowClass}>
                          <span className="review-radio"></span>
                          <div className="review-opt-content">
                            <MathRenderer text={opt} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="review-inputs-details">
                    <div className="answer-comparison">
                      <div className="ans-comp-row">
                        <span className="comp-lbl">Your Answer:</span>
                        <code className={`comp-code ${q.isCorrect ? 'green' : 'red'}`}>
                          {q.studentAns || '— (Skipped)'}
                        </code>
                      </div>
                      <div className="ans-comp-row">
                        <span className="comp-lbl">Correct Pattern:</span>
                        <code className="comp-code correct">{q.correctAnswer}</code>
                      </div>
                    </div>
                  </div>
                )}

                {/* Explanation Rationale Panel */}
                <div className="explanation-accordion glass-card">
                  <div className="explanation-header">
                    <Award size={14} />
                    <span>Solution Rationale & Explanations</span>
                  </div>
                  <div className="explanation-body">
                    <MathRenderer text={q.explanation} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .review-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .review-nav-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--color-secondary);
          font-size: 0.85rem;
          font-weight: 600;
        }
        .back-link:hover {
          color: var(--text-primary);
        }
        .exam-review-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }
        
        .score-hero {
          display: flex;
          justify-content: space-between;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(22, 28, 45, 0.9) 0%, rgba(10, 13, 22, 0.9) 100%);
        }
        .score-summary-left {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .score-circle-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
        }
        .progress-ring {
          transform: rotate(-90deg);
        }
        .progress-ring-fill {
          transition: stroke-dashoffset 0.35s;
          transform-origin: 50% 50%;
        }
        .score-percentage {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .grade-details h2 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .grade-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        .grade-badge.pass {
          background-color: var(--color-success-bg);
          color: var(--color-success);
        }
        .grade-badge.borderline {
          background-color: var(--color-warning-bg);
          color: var(--color-warning);
        }
        .grade-badge.fail {
          background-color: var(--color-error-bg);
          color: var(--color-error);
        }
        .attempt-info-row {
          display: flex;
          gap: 1.5rem;
          color: var(--text-secondary);
          font-size: 0.85rem;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        
        .score-grid-right {
          display: grid;
          grid-template-columns: repeat(3, 130px);
          gap: 0.75rem;
        }
        .score-tile {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0.75rem;
          background: rgba(255,255,255,0.02);
          text-align: center;
        }
        .tile-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .tile-value {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .tile-value.green { color: var(--color-success); }
        .tile-value.red { color: var(--color-error); }

        @media (max-width: 900px) {
          .score-hero {
            flex-direction: column;
            gap: 1.5rem;
          }
          .score-grid-right {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .review-content {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .review-content {
            grid-template-columns: 1fr;
          }
        }

        .review-filters-bar {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: fit-content;
        }
        .filter-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 0.5rem;
        }
        .filter-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .filter-btn {
          width: 100%;
          text-align: left;
          padding: 0.5rem 0.75rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-btn:hover {
          background: rgba(255,255,255,0.02);
          color: var(--text-primary);
        }
        .filter-btn.active {
          background: rgba(99, 102, 241, 0.08);
          color: var(--color-primary-light);
          font-weight: 600;
        }
        
        .graded-questions-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .empty-filter {
          padding: 3rem;
          text-align: center;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .graded-question-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border-left: 4px solid transparent;
        }
        .graded-question-card.correct {
          border-left-color: var(--color-success);
        }
        .graded-question-card.incorrect {
          border-left-color: var(--color-error);
        }
        
        .q-badge-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .q-number-lbl {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .q-points-lbl {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .card-top-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .correctness-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        .correctness-badge.correct {
          background-color: var(--color-success-bg);
          color: var(--color-success);
        }
        .correctness-badge.incorrect {
          background-color: var(--color-error-bg);
          color: var(--color-error);
        }
        
        .save-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.2rem 0.4rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }
        .save-toggle-btn:hover, .save-toggle-btn.saved {
          color: var(--color-secondary);
          background: rgba(6, 182, 212, 0.1);
        }
        
        .q-text-body {
          font-size: 1rem;
          line-height: 1.5;
        }
        
        .review-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .review-opt-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.03);
          pointer-events: none;
        }
        .review-radio {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid var(--text-muted);
          flex-shrink: 0;
        }
        .correct-selected {
          border-color: var(--color-success);
          background: var(--color-success-bg);
        }
        .correct-selected .review-radio {
          border-color: var(--color-success);
          background-color: var(--color-success);
        }
        .incorrect-selected {
          border-color: var(--color-error);
          background: var(--color-error-bg);
        }
        .incorrect-selected .review-radio {
          border-color: var(--color-error);
          background-color: var(--color-error);
        }
        .should-select {
          border-color: var(--color-success);
          background-color: rgba(16, 185, 129, 0.05);
          border-style: dashed;
        }
        .should-select .review-radio {
          border-color: var(--color-success);
        }
        .review-opt-content {
          flex: 1;
        }

        .review-inputs-details {
          padding: 0.75rem;
          background: rgba(255,255,255,0.02);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .answer-comparison {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .ans-comp-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .comp-lbl {
          width: 110px;
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .comp-code {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        .comp-code.green {
          background-color: var(--color-success-bg);
          color: var(--color-success);
        }
        .comp-code.red {
          background-color: var(--color-error-bg);
          color: var(--color-error);
        }
        .comp-code.correct {
          background-color: rgba(99,102,241,0.1);
          color: var(--color-primary-light);
        }

        .explanation-accordion {
          padding: 1rem;
          background: rgba(99, 102, 241, 0.02);
          border-color: rgba(99, 102, 241, 0.08);
        }
        .explanation-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-primary-light);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        .explanation-body {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
