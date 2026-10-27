'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, Flag, ChevronLeft, ChevronRight, AlertTriangle, CheckSquare, Save } from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { getAttemptGrade, isOptionSelected, parseSelections } from '@/lib/grading';
import { MathRenderer } from '@/components/MathRenderer';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { Modal } from '@/components/Modal';
import { displayExamName } from '@/lib/exam-display';
import examsData from '@/data/all-exams';
import type { ExamAttempt } from '@/types';

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const attemptId = params.id as string;

  const { activeStudent, attempts, saveAttempt, toggleSaveQuestion, questionBook, isLoaded, saveError } = useStudent();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load the attempt
  const attempt = attempts.find(a => a.id === attemptId);
  const exam = examsData.find(e => e?.id === attempt?.examId);
  const questionMapRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (window.matchMedia('(max-width: 650px)').matches) questionMapRef.current?.removeAttribute('open');
  }, [attempt?.id]);

  // Timer Ref to avoid multiple running intervals
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const gradeAndSaveAttempt = useCallback(async (finishedAttempt: ExamAttempt) => {
    if (submitting || !exam) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);
    const gradedAttempt = { ...finishedAttempt, score: getAttemptGrade(exam, finishedAttempt.answers).score };

    // Save to localStorage/state through context
    const saved = await saveAttempt(gradedAttempt);
    if (!saved) {
      setSubmitting(false);
      return;
    }

    // Navigate to results
    router.replace(`/exam/${attemptId}/review`);
  }, [attemptId, exam, router, saveAttempt, submitting]);

  // Prevent accessing completed exams in active test interface
  useEffect(() => {
    // Only verify attempts and redirect if the student is authenticated and loaded
    if (isLoaded && activeStudent) {
      if (!attempt) {
        router.replace('/');
      } else if (attempt.isCompleted) {
        router.replace(`/exam/${attemptId}/review`);
      }
    }
  }, [isLoaded, activeStudent, attempt, attemptId, router]);

  // Keep track of remaining time and tick down
  useEffect(() => {
    if (!attempt || attempt.isCompleted || submitting) return;

    timerRef.current = setInterval(() => {
      if (attempt.timeLeft <= 1) {
        clearInterval(timerRef.current!);
        void gradeAndSaveAttempt({ ...attempt, isCompleted: true, completedAt: new Date().toISOString(), timeLeft: 0 });
      } else {
        // Save timeLeft decrement back to global state
        const updatedAttempt = {
          ...attempt,
          timeLeft: attempt.timeLeft - 1,
          timeSpent: attempt.timeSpent + 1
        };
        saveAttempt(updatedAttempt);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attempt, saveAttempt, submitting, gradeAndSaveAttempt]);

  if (!isLoaded || !attempt || !exam || !activeStudent) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Initializing practice environment...</p>
      </div>
    );
  }

  const questions = exam.questions;
  const currentQuestion = questions[currentIdx];
  const isQuestionFlagged = attempt.flagged.includes(currentQuestion.id);
  const isSavedInBook = questionBook.savedQuestions.includes(currentQuestion.id);

  // Formats timer into HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const handleSelectOption = (option: string) => {
    let answer = option;
    if (currentQuestion.type === 'multi-select') {
      const selected = parseSelections(attempt.answers[currentQuestion.id] || '');
      const letter = String.fromCharCode(65 + currentQuestion.options.indexOf(option));
      const next = selected.includes(letter) ? selected.filter(value => value !== letter) : [...selected, letter].sort();
      answer = next.length ? JSON.stringify(next) : '';
    }
    const updatedAnswers = {
      ...attempt.answers,
      [currentQuestion.id]: answer
    };
    const updatedAttempt = {
      ...attempt,
      answers: updatedAnswers
    };
    saveAttempt(updatedAttempt);
  };

  const handleTextChange = (text: string) => {
    const updatedAnswers = {
      ...attempt.answers,
      [currentQuestion.id]: text
    };
    const updatedAttempt = {
      ...attempt,
      answers: updatedAnswers
    };
    saveAttempt(updatedAttempt);
  };

  const handleToggleFlag = () => {
    const isFlagged = attempt.flagged.includes(currentQuestion.id);
    const updatedFlagged = isFlagged
      ? attempt.flagged.filter(id => id !== currentQuestion.id)
      : [...attempt.flagged, currentQuestion.id];

    const updatedAttempt = {
      ...attempt,
      flagged: updatedFlagged
    };
    saveAttempt(updatedAttempt);
  };

  const handleManualSubmit = () => {
    const finalAttempt = {
      ...attempt,
      isCompleted: true,
      completedAt: new Date().toISOString()
    };
    gradeAndSaveAttempt(finalAttempt);
  };


  const unansweredCount = questions.filter(q => !attempt.answers[q.id]).length;

  return (
    <div className="exam-engine-page animate-fade-in">
      {/* Test Control Header */}
      <div className="exam-status-bar glass-card">
        <div className="exam-bar-left">
          <Link href={exam.competition === 'CJAIO' ? '/cjaio' : '/'} className="exam-back-link"><ChevronLeft size={15} />Back to practice</Link>
          <div className="exam-heading-line"><h1 className="exam-name-title">{displayExamName(exam.name)}</h1><DifficultyBadge difficulty={exam.difficulty} /></div>
        </div>

        <div className={`timer-widget ${attempt.timeLeft < 300 ? 'timer-danger' : ''}`}>
          <Clock size={16} />
          <span className="timer-countdown">{formatTime(attempt.timeLeft)}</span>
        </div>

        <button
          className="btn-primary submit-exam-btn"
          disabled={submitting}
          onClick={() => setConfirmSubmitOpen(true)}
        >
          Submit exam
        </button>
      </div>

      {exam.instructions && <details className="practice-instructions"><summary>Paper instructions</summary><p>{exam.instructions}</p></details>}

      <div className="exam-main-layout">
        {/* Left Side Sidebar Index Selector */}
        <aside className="exam-sidebar glass-card">
          <details className="question-map-details" ref={questionMapRef} open>
          <summary>Questions <span className="map-count">{currentIdx + 1} / {questions.length}</span></summary>
          <div className="questions-grid">
            {questions.map((q, idx) => {
              const hasAnswer = !!attempt.answers[q.id];
              const isFlagged = attempt.flagged.includes(q.id);
              const isActive = idx === currentIdx;

              let cellClass = 'grid-cell';
              if (isActive) cellClass += ' active';
              else if (isFlagged) cellClass += ' flagged';
              else if (hasAnswer) cellClass += ' answered';

              return (
                <button
                  key={q.id}
                  className={cellClass}
                  onClick={() => setCurrentIdx(idx)}
                  title={`Question ${q.number}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {q.number}
                </button>
              );
            })}
          </div>

          <div className="grid-legend">
            <div className="legend-item">
              <span className="legend-color active"></span>
              <span>Active</span>
            </div>
            <div className="legend-item">
              <span className="legend-color answered"></span>
              <span>Answered</span>
            </div>
            <div className="legend-item">
              <span className="legend-color flagged"></span>
              <span>Flagged</span>
            </div>
            <div className="legend-item">
              <span className="legend-color default"></span>
              <span>Unanswered</span>
            </div>
          </div>
          <p className="autosave-note">Your progress saves automatically.</p>
          </details>
        </aside>

        {/* Central Core Question Area */}
        <div className="question-content-container">
          <div className="question-card glass-card">
            <div className="question-card-header">
              <div className="question-heading-meta"><span className="question-counter">Question {currentIdx + 1} of {questions.length}</span><span className="point-badge">{currentQuestion.points} points · {currentQuestion.type === 'multi-select' ? 'Select all' : currentQuestion.type === 'text-input' ? 'Written answer' : 'Single choice'}</span></div>
              <div className="action-row">
                <button
                  onClick={() => toggleSaveQuestion(activeStudent.id, currentQuestion.id)}
                  className={`save-book-btn ${isSavedInBook ? 'saved' : ''}`}
                  aria-label={isSavedInBook ? 'Unsave question' : 'Save Question'}
                >
                  <Save size={16} />
                  <span>{isSavedInBook ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={handleToggleFlag}
                  className={`flag-btn ${isQuestionFlagged ? 'flagged' : ''}`}
                  aria-label={isQuestionFlagged ? 'Unflag question' : 'Flag Question'}
                >
                  <Flag size={16} />
                  <span>{isQuestionFlagged ? 'Flagged' : 'Flag'}</span>
                </button>
              </div>
            </div>

            <div className="question-body-section">
              <MathRenderer text={currentQuestion.text} />
            </div>

            {/* Answer inputs depending on type */}
            <div className="answer-section">
              {currentQuestion.type !== 'text-input' ? (
                <div className={`options-list ${currentQuestion.type === 'multi-select' ? 'multi-select' : ''}`} role={currentQuestion.type === 'multi-select' ? 'group' : 'radiogroup'} aria-label="Answer choices">
                  {currentQuestion.type === 'multi-select' && <p>Select all correct answers.</p>}
                  {currentQuestion.options.map((opt, oIdx) => {
                    const isSelected = isOptionSelected(currentQuestion, attempt.answers[currentQuestion.id] || '', oIdx);
                    return (
                      <div key={oIdx} className={`option-row ${isSelected ? 'selected' : ''}`}
                        onClick={event => { if (!(event.target as HTMLElement).closest('button, a, input, textarea')) handleSelectOption(opt); }}>
                        <input className="option-control" type={currentQuestion.type === 'multi-select' ? 'checkbox' : 'radio'}
                          name={currentQuestion.id} checked={isSelected} disabled={submitting}
                          aria-labelledby={`${currentQuestion.id}-option-${oIdx}`}
                          onChange={() => handleSelectOption(opt)} />
                        <div className="option-text-holder" id={`${currentQuestion.id}-option-${oIdx}`}><MathRenderer text={opt} /></div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-answer-box">
                  <label htmlFor="coding-answer">Write your answer{currentQuestion.grading === 'manual' ? ', calculations, or Python code' : ''}:</label>
                  <textarea
                    id="coding-answer"
                    placeholder="Provide your code line or missing statements here..."
                    value={attempt.answers[currentQuestion.id] || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="coding-input"
                    disabled={submitting}
                  />
                  <p className="coding-hint">
                    {currentQuestion.grading === 'manual' ? 'Show your work for each part. Your teacher can mark this response later and award partial credit.' : 'Enter the requested answer. Check your calculations and Python syntax.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="navigation-footer">
            <button
              className="btn-secondary nav-nav-btn"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                className="btn-secondary nav-nav-btn"
                onClick={() => setCurrentIdx(prev => prev + 1)}
              >
                <span>Next question</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className="btn-primary nav-nav-btn submit-final"
                onClick={() => setConfirmSubmitOpen(true)}
              >
                <span>Finish &amp; submit</span>
                <CheckSquare size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmSubmitOpen && (
        <Modal labelledBy="submit-modal-title" onClose={() => setConfirmSubmitOpen(false)}>
            <div className="modal-header">
              <AlertTriangle size={24} className="warning-icon" />
              <h3 id="submit-modal-title">Submit your practice?</h3>
            </div>

            <div className="modal-body">
              {saveError && <p className="error-message" role="alert">{saveError}</p>}
              <p>Your answers will be saved and objective questions marked. Written responses can be marked by your teacher.</p>
              {unansweredCount > 0 ? (
                <div className="unanswered-warning">
                  <AlertTriangle size={14} />
                  <span>You have <strong>{unansweredCount}</strong> unanswered questions remaining.</span>
                </div>
              ) : (
                <p className="all-answered-green">All questions have been answered. Ready to grade!</p>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setConfirmSubmitOpen(false)}
              >
                Keep practising
              </button>
              <button
                className="btn-primary submit-confirm"
                disabled={submitting}
                onClick={handleManualSubmit}
              >
                {submitting ? 'Saving submission...' : 'Submit practice'}
              </button>
            </div>
        </Modal>
      )}
    </div>
  );
}
