'use client';

import React, { useState } from 'react';
import { Bookmark, HelpCircle, Eye, EyeOff, CheckCircle2, Search } from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { MathRenderer } from '@/components/MathRenderer';
import { displayCorrectAnswer } from '@/lib/exam-display';
import examsData from '@/data/all-exams';

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
        <h1>Question Book</h1>
        <p>Keep useful questions. Revisit mistakes.</p>
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
            <span>Saved ({savedQuestions.length})</span>
          </button>

          <button
            className={`tab-item ${activeTab === 'incorrect' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('incorrect');
              setSearchTerm('');
            }}
          >
            <HelpCircle size={16} />
            <span>To revisit ({incorrectQuestions.length})</span>
          </button>
        </div>

        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search questions…"
            aria-label="Search questions"
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
                ? 'Try a different search term.'
                : (activeTab === 'saved'
                  ? 'Save a question during practice to find it here.'
                  : 'Marked answers to revisit will appear here.')
              }
            </p>
          </div>
        ) : (
          searchedQuestions.map(q => {
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
                        Unsave
                      </button>
                    ) : (
                      <button
                        onClick={() => removeIncorrectQuestion(activeStudent.id, q.id)}
                        className="action-btn resolve-btn"
                        title="Mark as reviewed and remove"
                      >
                        <CheckCircle2 size={12} />
                        <span>Mark reviewed</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="question-body">
                  <MathRenderer text={q.text} />
                </div>

                {/* Question Options if Multiple Choice */}
                {q.type !== 'text-input' && (
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
                        <span>Hide explanation</span>
                      </>
                    ) : (
                      <>
                        <Eye size={14} />
                        <span>Show answer & explanation</span>
                      </>
                    )}
                  </button>

                  {isRevealed && (
                    <div className="revealed-details-card glass-card animate-fade-in">
                      <div className="revealed-section border-bottom">
                        <span className="revealed-section-lbl">Correct Answer:</span>
                        <div className="correct-answer-display">
                          <MathRenderer text={displayCorrectAnswer(q)} />
                        </div>
                      </div>
                      <div className="revealed-section">
                        <span className="revealed-section-lbl font-indigo">Explanation:</span>
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
    </div>
  );
}
