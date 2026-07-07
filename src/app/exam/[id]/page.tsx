'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Clock, Flag, ChevronLeft, ChevronRight, AlertTriangle, CheckSquare, Save } from 'lucide-react';
import { useStudent, checkAnswer } from '@/context/StudentContext';
import { MathRenderer } from '@/components/MathRenderer';
import examsData from '@/data/exams.json';

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const attemptId = params.id as string;

  const { activeStudent, attempts, saveAttempt, toggleSaveQuestion, questionBook, isLoaded } = useStudent();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  // Load the attempt
  const attempt = attempts.find(a => a.id === attemptId);
  const exam = examsData.find(e => e?.id === attempt?.examId);

  // Timer Ref to avoid multiple running intervals
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    if (!attempt || attempt.isCompleted) return;

    timerRef.current = setInterval(() => {
      if (attempt.timeLeft <= 1) {
        clearInterval(timerRef.current!);
        handleAutoSubmit();
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
  }, [attempt, saveAttempt]);

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
    const updatedAnswers = {
      ...attempt.answers,
      [currentQuestion.id]: option
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

  const handleAutoSubmit = () => {
    // Perform auto grading
    const finalAttempt = {
      ...attempt,
      isCompleted: true,
      completedAt: new Date().toISOString(),
      timeLeft: 0
    };
    gradeAndSaveAttempt(finalAttempt);
  };

  const handleManualSubmit = () => {
    const finalAttempt = {
      ...attempt,
      isCompleted: true,
      completedAt: new Date().toISOString()
    };
    gradeAndSaveAttempt(finalAttempt);
  };

  const gradeAndSaveAttempt = (finishedAttempt: typeof attempt) => {
    let finalScore = 0;
    
    questions.forEach(q => {
      const studentAns = finishedAttempt.answers[q.id] || '';
      const isCorrect = checkAnswer(studentAns, q.correctAnswer, q.type as any);
      if (isCorrect) {
        finalScore += q.points;
      }
    });

    finishedAttempt.score = finalScore;
    
    // Save to localStorage/state through context
    saveAttempt(finishedAttempt);
    
    // Navigate to results
    router.replace(`/exam/${attemptId}/review`);
  };

  const unansweredCount = questions.filter(q => !attempt.answers[q.id]).length;

  return (
    <div className="exam-engine-page animate-fade-in">
      {/* Test Control Header */}
      <div className="exam-status-bar glass-card">
        <div className="exam-bar-left">
          <span className="exam-name-title">{exam.name}</span>
          <span className="question-counter">Question {currentIdx + 1} of {questions.length}</span>
        </div>
        
        <div className={`timer-widget ${attempt.timeLeft < 300 ? 'timer-danger' : ''}`}>
          <Clock size={16} />
          <span className="timer-countdown">{formatTime(attempt.timeLeft)}</span>
        </div>
        
        <button 
          className="btn-primary submit-exam-btn"
          onClick={() => setConfirmSubmitOpen(true)}
        >
          Submit Exam
        </button>
      </div>

      <div className="exam-main-layout">
        {/* Left Side Sidebar Index Selector */}
        <aside className="exam-sidebar glass-card">
          <div className="sidebar-index-title">Questions Map</div>
          
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
        </aside>

        {/* Central Core Question Area */}
        <div className="question-content-container">
          <div className="question-card glass-card">
            <div className="question-card-header">
              <div className="point-badge">{currentQuestion.points} points</div>
              <div className="action-row">
                <button 
                  onClick={() => toggleSaveQuestion(activeStudent.id, currentQuestion.id)}
                  className={`save-book-btn ${isSavedInBook ? 'saved' : ''}`}
                >
                  <Save size={16} />
                  <span>{isSavedInBook ? 'Saved' : 'Save Question'}</span>
                </button>
                <button 
                  onClick={handleToggleFlag} 
                  className={`flag-btn ${isQuestionFlagged ? 'flagged' : ''}`}
                >
                  <Flag size={16} />
                  <span>{isQuestionFlagged ? 'Flagged' : 'Flag Question'}</span>
                </button>
              </div>
            </div>

            <div className="question-body-section">
              <MathRenderer text={currentQuestion.text} />
            </div>

            {/* Answer inputs depending on type */}
            <div className="answer-section">
              {currentQuestion.type === 'multiple-choice' ? (
                <div className="options-list">
                  {currentQuestion.options.map((opt, oIdx) => {
                    const isSelected = attempt.answers[currentQuestion.id] === opt;
                    return (
                      <div 
                        key={oIdx} 
                        className={`option-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectOption(opt)}
                      >
                        <div className="option-radio">
                          {isSelected && <div className="radio-inner"></div>}
                        </div>
                        <div className="option-text-holder">
                          <MathRenderer text={opt} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-answer-box">
                  <label htmlFor="coding-answer">Type your response statement (e.g. code sequence):</label>
                  <textarea
                    id="coding-answer"
                    placeholder="Provide your code line or missing statements here..."
                    value={attempt.answers[currentQuestion.id] || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="coding-input"
                  />
                  <p className="coding-hint">
                    Make sure to write clean code matching standard syntax rules (e.g., matching parentheses, brackets, arguments). Semicolons and whitespaces will be matched loosely.
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
              <span>Previous Question</span>
            </button>

            {currentIdx < questions.length - 1 ? (
              <button 
                className="btn-secondary nav-nav-btn"
                onClick={() => setCurrentIdx(prev => prev + 1)}
              >
                <span>Next Question</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                className="btn-primary nav-nav-btn submit-final"
                onClick={() => setConfirmSubmitOpen(true)}
              >
                <span>Finish & Submit</span>
                <CheckSquare size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmSubmitOpen && (
        <div className="modal-backdrop">
          <div className="confirm-modal glass-card">
            <div className="modal-header">
              <AlertTriangle size={24} className="warning-icon" />
              <h3>Confirm Exam Submission</h3>
            </div>
            
            <div className="modal-body">
              <p>Are you sure you want to conclude and submit your practice exam?</p>
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
                Cancel & Return
              </button>
              <button 
                className="btn-primary submit-confirm" 
                onClick={handleManualSubmit}
              >
                Submit and Mark Exam
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .exam-engine-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: calc(100vh - 120px);
          min-height: 500px;
        }
        
        .exam-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: rgba(22, 28, 45, 0.85);
          border-color: rgba(99, 102, 241, 0.15);
        }
        .exam-bar-left {
          display: flex;
          flex-direction: column;
        }
        .exam-name-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .question-counter {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .timer-widget {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--color-secondary);
          font-family: var(--font-mono);
          font-weight: 700;
        }
        .timer-widget.timer-danger {
          color: var(--color-error);
          background: var(--color-error-bg);
          border-color: rgba(239, 68, 68, 0.3);
          animation: pulse 1s infinite alternate;
        }
        @keyframes pulse {
          to { transform: scale(1.02); }
        }
        .timer-countdown {
          font-size: 1.1rem;
        }
        .submit-exam-btn {
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
        }

        .exam-main-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 1.5rem;
          flex: 1;
          height: calc(100% - 80px);
          overflow: hidden;
        }
        @media (max-width: 850px) {
          .exam-main-layout {
            grid-template-columns: 1fr;
            overflow-y: auto;
            height: auto;
          }
          .exam-engine-page {
            height: auto;
          }
        }
        
        .exam-sidebar {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 100%;
          overflow-y: auto;
        }
        .sidebar-index-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .questions-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
        }
        .grid-cell {
          aspect-ratio: 1;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          transition: all 0.15s ease;
        }
        .grid-cell:hover {
          border-color: rgba(255, 255, 255, 0.2);
          color: var(--text-primary);
        }
        .grid-cell.active {
          border-color: var(--color-primary);
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
          color: var(--color-primary-light);
          background: rgba(99, 102, 241, 0.05);
        }
        .grid-cell.answered {
          background-color: var(--color-primary);
          border-color: var(--color-primary-dark);
          color: white;
        }
        .grid-cell.flagged {
          border-color: var(--color-warning);
          background: var(--color-warning-bg);
          color: var(--color-warning);
        }
        
        .grid-legend {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }
        .legend-color.active {
          border: 1px solid var(--color-primary);
          background: rgba(99, 102, 241, 0.05);
        }
        .legend-color.answered {
          background-color: var(--color-primary);
        }
        .legend-color.flagged {
          background: var(--color-warning-bg);
          border: 1px solid var(--color-warning);
        }
        .legend-color.default {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .question-content-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: 100%;
          overflow: hidden;
        }
        @media (max-width: 850px) {
          .question-content-container {
            height: auto;
          }
        }
        
        .question-card {
          padding: 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          overflow-y: auto;
        }
        .question-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .point-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
          padding: 0.25rem 0.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-sm);
        }
        .action-row {
          display: flex;
          gap: 0.75rem;
        }
        .flag-btn, .save-book-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }
        .flag-btn:hover {
          color: var(--color-warning);
          background: var(--color-warning-bg);
        }
        .flag-btn.flagged {
          color: var(--color-warning);
          background: var(--color-warning-bg);
        }
        .save-book-btn:hover {
          color: var(--color-secondary);
          background: rgba(6, 182, 212, 0.1);
        }
        .save-book-btn.saved {
          color: var(--color-secondary);
          background: rgba(6, 182, 212, 0.1);
        }
        
        .question-body-section {
          font-size: 1.05rem;
          color: var(--text-primary);
        }
        
        .answer-section {
          margin-top: auto;
          padding-top: 1rem;
        }
        
        .options-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .option-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .option-row:hover {
          border-color: rgba(99, 102, 241, 0.2);
          background: rgba(255, 255, 255, 0.04);
        }
        .option-row.selected {
          border-color: var(--color-primary);
          background: rgba(99, 102, 241, 0.05);
        }
        .option-radio {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .option-row.selected .option-radio {
          border-color: var(--color-primary-light);
        }
        .radio-inner {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--color-primary-light);
        }
        .option-text-holder {
          flex: 1;
        }

        .text-answer-box {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .text-answer-box label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .coding-input {
          width: 100%;
          min-height: 120px;
          padding: 1rem;
          background-color: #0f1322;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          color: #e2e8f0;
          font-family: var(--font-mono);
          font-size: 0.9rem;
          resize: vertical;
        }
        .coding-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
        }
        .coding-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .navigation-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-nav-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
        }
        .nav-nav-btn.submit-final {
          background-color: var(--color-success);
          color: white;
          border: none;
        }
        .nav-nav-btn.submit-final:hover {
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
          background-color: #059669;
        }

        /* Modal styling */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
        .confirm-modal {
          width: 440px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: #111524;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        }
        .modal-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .warning-icon {
          color: var(--color-warning);
        }
        .modal-header h3 {
          font-size: 1.25rem;
          color: var(--text-primary);
        }
        .modal-body {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .unanswered-warning {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem;
          background: var(--color-warning-bg);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: var(--radius-sm);
          color: var(--color-warning);
          font-size: 0.85rem;
        }
        .all-answered-green {
          color: var(--color-success);
          font-weight: 600;
          margin-top: 1rem;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .submit-confirm {
          background-color: var(--color-success);
          border: none;
        }
        .submit-confirm:hover {
          background-color: #059669;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
        }
      `}</style>
    </div>
  );
}
