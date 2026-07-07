'use client';

import React, { useState } from 'react';
import { Bookmark, HelpCircle, Eye, EyeOff, CheckCircle2, RefreshCcw, Search } from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { MathRenderer } from '@/components/MathRenderer';
import examsData from '@/data/exams.json';

export default function QuestionBookPage() {
  const { activeStudent, questionBook, toggleSaveQuestion, removeIncorrectQuestion, isLoaded } = useStudent();
  const [activeTab, setActiveTab] = useState<'saved' | 'incorrect'>('saved');
  const [searchTerm, setSearchTerm] = useState('');
  const [revealedIds, setRevealedIds] = useState<string[]>([]);

  if (!isLoaded || !activeStudent) return null;

  // Flatten all questions and append their exam context
  const allQuestions = examsData.flatMap(exam => 
    exam.questions.map(q => ({
      ...q,
      examId: exam.id,
      examName: exam.name
    }))
  );

  // Filter based on active student's book
  const savedQuestions = allQuestions.filter(q => questionBook.savedQuestions.includes(q.id));
  const incorrectQuestions = allQuestions.filter(q => questionBook.incorrectQuestions.includes(q.id));

  const currentQuestionsList = activeTab === 'saved' ? savedQuestions : incorrectQuestions;

  // Apply search term
  const searchedQuestions = currentQuestionsList.filter(q => 
    q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.correctAnswer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.explanation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRevealAnswer = (qId: string) => {
    if (revealedIds.includes(qId)) {
      setRevealedIds(revealedIds.filter(id => id !== qId));
    } else {
      setRevealedIds([...revealedIds, qId]);
    }
  };

  return (
    <div className="question-book-page animate-fade-in">
      <div className="page-header">
        <h1>My Study Question Book</h1>
        <p>Isolate and review your flagged items and questions you answered incorrectly during exams.</p>
      </div>

      {/* Tabs and Search Bar row */}
      <div className="controls-row glass-card">
        <div className="tabs">
          <button 
            className={`tab-item ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('saved');
              setSearchTerm('');
            }}
          >
            <Bookmark size={16} />
            <span>Saved Questions ({savedQuestions.length})</span>
          </button>
          
          <button 
            className={`tab-item ${activeTab === 'incorrect' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('incorrect');
              setSearchTerm('');
            }}
          >
            <HelpCircle size={16} />
            <span>Wrong Answers Tracker ({incorrectQuestions.length})</span>
          </button>
        </div>

        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search questions or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Questions list */}
      <div className="book-questions-list">
        {searchedQuestions.length === 0 ? (
          <div className="empty-book glass-card">
            <HelpCircle size={40} />
            <h3>No questions found</h3>
            <p>
              {searchTerm 
                ? 'Try adapting your search keyword filter.' 
                : (activeTab === 'saved' 
                  ? 'Click "Save Question" inside exam simulation to flag references here.' 
                  : 'Exams you fail or answer incorrectly will automatically record problems here.')
              }
            </p>
          </div>
        ) : (
          searchedQuestions.map((q, index) => {
            const isRevealed = revealedIds.includes(q.id);
            return (
              <div key={q.id} className="book-question-card glass-card">
                <div className="card-top-header">
                  <div className="meta-context">
                    <span className="exam-tag">{q.examName}</span>
                    <span className="q-lbl">Question {q.number}</span>
                    <span className="points-lbl">({q.points} Points)</span>
                  </div>
                  
                  <div className="card-actions">
                    {activeTab === 'saved' ? (
                      <button 
                        onClick={() => toggleSaveQuestion(activeStudent.id, q.id)}
                        className="action-btn remove-btn"
                        title="Remove from saved"
                      >
                        Unsave Item
                      </button>
                    ) : (
                      <button 
                        onClick={() => removeIncorrectQuestion(activeStudent.id, q.id)}
                        className="action-btn resolve-btn"
                        title="Mark as reviewed and remove"
                      >
                        <CheckCircle2 size={12} />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="question-body">
                  <MathRenderer text={q.text} />
                </div>

                {/* Question Options if Multiple Choice */}
                {q.type === 'multiple-choice' && (
                  <div className="question-options-preview">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="preview-opt-row">
                        <span className="bullet"></span>
                        <div className="opt-preview-text">
                          <MathRenderer text={opt} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Show/Hide Rationale control */}
                <div className="reveal-control-section">
                  <button 
                    onClick={() => toggleRevealAnswer(q.id)}
                    className="btn-secondary reveal-toggle-btn"
                  >
                    {isRevealed ? (
                      <>
                        <EyeOff size={14} />
                        <span>Hide Answer & Rationale</span>
                      </>
                    ) : (
                      <>
                        <Eye size={14} />
                        <span>View Answer & Explanation</span>
                      </>
                    )}
                  </button>
                  
                  {isRevealed && (
                    <div className="revealed-details-card glass-card animate-fade-in">
                      <div className="revealed-section border-bottom">
                        <span className="revealed-section-lbl">Correct Answer:</span>
                        <div className="correct-answer-display">
                          {q.type === 'multiple-choice' ? (
                            <MathRenderer text={q.correctAnswer} />
                          ) : (
                            <code className="code-exact">{q.correctAnswer}</code>
                          )}
                        </div>
                      </div>
                      <div className="revealed-section">
                        <span className="revealed-section-lbl font-indigo">Explanation / Rationale:</span>
                        <div className="explanation-display">
                          <MathRenderer text={q.explanation} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <style jsx>{`
        .question-book-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .page-header h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        .page-header p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1.25rem;
          background: rgba(22, 28, 45, 0.7);
          border-color: rgba(255,255,255,0.05);
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .controls-row {
            flex-direction: column;
            align-items: stretch;
          }
        }
        
        .tabs {
          display: flex;
          gap: 0.5rem;
        }
        .tab-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }
        .tab-item:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.02);
        }
        .tab-item.active {
          color: var(--color-primary-light);
          background: rgba(99, 102, 241, 0.08);
        }
        
        .search-box {
          display: flex;
          align-items: center;
          background: var(--bg-primary);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-md);
          padding: 0.4rem 0.8rem;
          gap: 0.5rem;
          width: 320px;
          transition: border-color 0.2s;
        }
        .search-box:focus-within {
          border-color: var(--color-primary);
        }
        .search-icon {
          color: var(--text-muted);
        }
        .search-box input {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 0.85rem;
          outline: none;
          width: 100%;
        }
        @media (max-width: 768px) {
          .search-box {
            width: 100%;
          }
        }
        
        .book-questions-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .empty-book {
          padding: 4rem;
          text-align: center;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .empty-book h3 {
          font-size: 1.1rem;
          color: var(--text-primary);
        }
        .empty-book p {
          font-size: 0.85rem;
          max-width: 340px;
          line-height: 1.4;
        }
        
        .book-question-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .card-top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .meta-context {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .exam-tag {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-secondary);
          background: rgba(6, 182, 212, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        .q-lbl {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-primary);
        }
        .points-lbl {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .action-btn {
          padding: 0.35rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .remove-btn {
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.1);
          color: var(--color-error);
        }
        .remove-btn:hover {
          background-color: var(--color-error-bg);
          border-color: rgba(239, 68, 68, 0.3);
        }
        .resolve-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.1);
          color: var(--color-success);
        }
        .resolve-btn:hover {
          background-color: var(--color-success-bg);
          border-color: rgba(16, 185, 129, 0.3);
        }
        
        .question-body {
          font-size: 1rem;
          color: var(--text-primary);
          line-height: 1.5;
        }

        .question-options-preview {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          background: rgba(255,255,255,0.01);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(255,255,255,0.02);
        }
        .preview-opt-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-muted);
          flex-shrink: 0;
        }
        .opt-preview-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .reveal-control-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .reveal-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          width: fit-content;
          padding: 0.5rem 0.85rem;
          font-size: 0.8rem;
          border-radius: var(--radius-sm);
        }
        
        .revealed-details-card {
          padding: 1.25rem;
          background: rgba(99, 102, 241, 0.02);
          border-color: rgba(99, 102, 241, 0.08);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .revealed-section {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .revealed-section.border-bottom {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          padding-bottom: 0.75rem;
        }
        .revealed-section-lbl {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-secondary);
        }
        .revealed-section-lbl.font-indigo {
          color: var(--color-primary-light);
        }
        .correct-answer-display {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .code-exact {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          background: #0f1322;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          color: var(--color-primary-light);
          display: inline-block;
        }
        .explanation-display {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
