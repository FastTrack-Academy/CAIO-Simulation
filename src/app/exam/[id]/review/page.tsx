'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, ChevronLeft, Calendar, Clock, Award, Bookmark, HelpCircle } from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { MathRenderer } from '@/components/MathRenderer';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { displayExamName } from '@/lib/exam-display';
import examsData from '@/data/all-exams';
import { getQuestionGrade, getAttemptGrade, isOptionSelected, checkAnswer } from '@/lib/grading';

export default function ReviewPage() {
  const params = useParams();
  const attemptId = params.id as string;

  const { activeStudent, attempts, toggleSaveQuestion, questionBook, isLoaded } = useStudent();
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'saved' | 'pending'>('all');

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
  const grading = getAttemptGrade(exam, attempt.answers);
  const percentage = Math.round((grading.score / attempt.totalPoints) * 100);
  const pendingCount = grading.pendingCount;

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
    const grade = getQuestionGrade(q, attempt.answers);
    const isCorrect = grade.status === 'correct';
    const isSaved = questionBook.savedQuestions.includes(q.id);

    return {
      ...q,
      studentAns,
      grade,
      isCorrect,
      isSaved
    };
  });

  const filteredQuestions = gradedQuestions.filter(q => {
    if (filter === 'correct') return q.isCorrect;
    if (filter === 'incorrect') return q.grade.status === 'incorrect' || q.grade.status === 'partial';
    if (filter === 'saved') return q.isSaved;
    if (filter === 'pending') return q.grade.status === 'pending';
    return true;
  });

  const correctCount = gradedQuestions.filter(q => q.isCorrect).length;
  const incorrectCount = gradedQuestions.filter(q => q.grade.status === 'incorrect' || q.grade.status === 'partial').length;

  return (
    <div className="review-page animate-fade-in">
      <div className="review-nav-header">
        <Link href={exam.competition === 'CJAIO' ? '/cjaio' : '/'} className="back-link">
          <ChevronLeft size={16} />
          <span>Back to practice</span>
        </Link>
        <span className="exam-review-label">Practice review</span>
      </div>

      {/* Grade Hero Section */}
      <div className="score-hero glass-card">
        <div className="score-summary-left">
          <div className="score-circle-wrapper">
            <svg className="progress-ring" width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
              <circle
                className="progress-ring-bg"
                stroke="var(--border)"
                strokeWidth="8"
                fill="transparent"
                r="50"
                cx="60"
                cy="60"
              />
              <circle
                className={`progress-ring-fill ${gradeStatus}`}
                stroke={
                  pendingCount ? 'var(--color-warning)' : gradeStatus === 'pass'
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
            <div className="score-percentage">{pendingCount ? 'Pending' : `${percentage}%`}</div>
          </div>

          <div className="grade-details">
            <div className={`grade-badge ${pendingCount ? 'pending' : gradeStatus}`}>
              {pendingCount ? 'Awaiting teacher marking' : gradeStatus === 'pass'
                ? 'Target reached'
                : gradeStatus === 'borderline'
                  ? 'Keep practising'
                  : 'Ready for another try'}
            </div>
            <h1>{displayExamName(exam.name)}</h1>
            <DifficultyBadge difficulty={exam.difficulty} />
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
            <span className="tile-label">{pendingCount ? 'Marked so far' : 'Score'}</span>
            <span className="tile-value">{grading.score} / {attempt.totalPoints} pts</span>
          </div>
          <div className="score-tile glass-card">
            <span className="tile-label">Correct</span>
            <span className="tile-value green">{correctCount}</span>
          </div>
          <div className="score-tile glass-card">
            <span className="tile-label">To revisit</span>
            <span className="tile-value red">{incorrectCount}</span>
          </div>
        </div>
      </div>

      {pendingCount > 0 && <p className="pending-notice">{pendingCount} written responses ({grading.pendingPoints} points) await teacher marking. The current score is provisional. Submitted responses are saved below.</p>}

      {/* Review Section */}
      <div className="review-content">
        <div className="review-filters-bar glass-card">
          <div className="filter-title">Review questions</div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All questions ({questions.length})
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
              To revisit ({incorrectCount})
            </button>
            {pendingCount > 0 && <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Awaiting marking ({pendingCount})</button>}
            <button
              className={`filter-btn ${filter === 'saved' ? 'active' : ''}`}
              onClick={() => setFilter('saved')}
            >
              Saved ({gradedQuestions.filter(q => q.isSaved).length})
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
            filteredQuestions.map(q => (
              <div
                key={q.id}
                className={`graded-question-card glass-card ${q.grade.status === 'pending' || q.grade.status === 'partial' ? 'pending' : q.isCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="question-card-header">
                  <div className="q-badge-info">
                    <span className="q-number-lbl">Question {q.number}</span>
                    <span className="q-points-lbl">({q.points} Points)</span>
                  </div>

                  <div className="card-top-actions">
                    <div className={`correctness-badge ${q.grade.status === 'pending' || q.grade.status === 'partial' ? 'pending' : q.isCorrect ? 'correct' : 'incorrect'}`}>
                      {q.grade.status === 'pending' ? <span>Awaiting marking</span> : q.grade.status === 'partial' ? <span>Partial credit: {q.grade.score}/{q.points}</span> : q.isCorrect ? (
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
                {q.type !== 'text-input' ? (
                  <div className="review-options">
                    {q.options.map((opt, oIdx) => {
                      const isStudentAns = isOptionSelected(q, q.studentAns, oIdx);
                      const isCorrectAns = q.type === 'multi-select'
                        ? isOptionSelected(q, q.correctAnswer, oIdx)
                        : checkAnswer(opt, q.correctAnswer, q.type);

                      let rowClass = 'review-opt-row';
                      if (isStudentAns && isCorrectAns) rowClass += ' correct-selected';
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
                        <span className="comp-lbl">{q.grading === 'manual' ? 'Model answer:' : 'Correct Pattern:'}</span>
                        <div className="comp-code correct"><MathRenderer text={q.correctAnswer} /></div>
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
    </div>
  );
}
