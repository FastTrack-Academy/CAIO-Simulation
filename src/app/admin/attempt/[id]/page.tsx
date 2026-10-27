'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useStudent } from '@/context/StudentContext';
import { useCompetition } from '@/context/CompetitionContext';
import { MathRenderer } from '@/components/MathRenderer';
import { supabase } from '@/lib/supabase';
import exams from '@/data/all-exams';
import { getAttemptGrade, getQuestionGrade, MANUAL_MARKS_KEY, readManualMarks } from '@/lib/grading';
import type { ExamAttempt } from '@/types';

export default function MarkAttemptPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoaded } = useStudent();
  const { selectCompetition } = useCompetition();
  const isAdmin = user?.email === 'haoyanjiang0709@gmail.com';
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    async function load() {
      try {
        const { data, error } = await supabase.from('attempts').select('*').eq('id', id).single();
        if (error) throw error;
        if (cancelled) return;
        const loaded: ExamAttempt = {
          id: data.id, studentId: data.student_id, examId: data.exam_id,
          score: data.score, totalPoints: data.total_points, answers: data.answers || {},
          flagged: data.flagged || [], timeSpent: data.time_spent, timeLeft: data.time_left,
          completedAt: data.completed_at, isCompleted: data.is_completed,
        };
        setAttempt(loaded);
        const previous = readManualMarks(loaded.answers);
        const exam = exams.find(exam => exam.id === loaded.examId);
        if (exam?.competition) selectCompetition(exam.competition);
        setMarks(Object.fromEntries((exam?.questions || []).filter(q => q.grading === 'manual').map(q => [
          q.id, previous[q.id] !== undefined ? String(previous[q.id]) : loaded.answers[q.id]?.trim() ? '' : '0',
        ])));
      } catch (error) {
        if (!cancelled) setError(error instanceof Error ? error.message : 'Could not load this attempt. Check your database access.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id, isAdmin, selectCompetition]);

  const exam = exams.find(exam => exam.id === attempt?.examId);

  async function saveMarks(event: React.FormEvent) {
    event.preventDefault();
    if (!attempt || !exam || !isAdmin || !attempt.isCompleted) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const numericMarks: Record<string, number> = {};
      for (const question of exam.questions.filter(q => q.grading === 'manual')) {
        const value = marks[question.id] ?? '';
        if (value.trim() === '') continue;
        const score = Number(value);
        if (!Number.isFinite(score) || score < 0 || score > question.points) {
          throw new Error(`Question ${question.number}: enter a score from 0 to ${question.points}.`);
        }
        numericMarks[question.id] = score;
      }
      const answers = { ...attempt.answers, [MANUAL_MARKS_KEY]: JSON.stringify(numericMarks) };
      const grading = getAttemptGrade(exam, answers);
      const { error } = await supabase.from('attempts').update({ answers, score: grading.score }).eq('id', attempt.id).select('id').single();
      if (error) throw error;
      setAttempt({ ...attempt, answers, score: grading.score });
      setMessage(grading.pendingCount ? `Marks saved. ${grading.pendingCount} responses still await marking.` : `Marking complete: ${grading.score}/${attempt.totalPoints} points.`);

      // Update the student's wrong-answer book after marking, without treating
      // unanswered-to-be-marked responses as incorrect prematurely.
      const { data: book, error: readError } = await supabase.from('question_books').select('incorrect_questions').eq('student_id', attempt.studentId).single();
      if (readError) throw new Error('Marks saved, but the question book could not be loaded. Check teacher database permissions.');
      const incorrect = new Set<string>(book.incorrect_questions || []);
      for (const question of exam.questions) {
        const grade = getQuestionGrade(question, answers);
        if (grade.status === 'pending') continue;
        if (grade.status === 'correct') incorrect.delete(question.id);
        else incorrect.add(question.id);
      }
      const { error: bookError } = await supabase.from('question_books').update({ incorrect_questions: [...incorrect], updated_at: new Date().toISOString() }).eq('student_id', attempt.studentId);
      if (bookError) throw new Error('Marks saved, but the wrong-answer book could not be updated. Check teacher database permissions.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not save marks. Check your database access and try again.');
    } finally {
      setSaving(false);
    }
  }

  if (!isLoaded) return <p>Loading...</p>;
  if (!isAdmin) return <p>Teacher access is required to mark another student&apos;s work.</p>;
  if (loading) return <p>Loading submitted answers...</p>;
  if (!attempt || !exam) return <p role="alert">{error || 'Attempt not found.'}</p>;
  const grading = getAttemptGrade(exam, attempt.answers);

  return (
    <div className="marking-page">
      <Link href="/admin">← Back to Admin Console</Link>
      <h1>Mark submitted practice</h1>
      <h2>{exam.name}</h2>
      <p>Student ID: {attempt.studentId}</p>
      <p>{grading.score}/{attempt.totalPoints} points recorded · {grading.pendingCount} responses awaiting marking</p>
      <p>Review each response against the model answer and award partial credit where appropriate. Leave a score blank to keep that response pending.</p>
      {!attempt.isCompleted && <p role="alert">This attempt is still in progress. Marking is available after submission.</p>}
      <form onSubmit={saveMarks}>
        {exam.questions.map(question => {
          const grade = getQuestionGrade(question, attempt.answers);
          return (
            <section className="glass-card marking-question" key={question.id}>
              <h3>Question {question.number} · {question.points} points</h3>
              <MathRenderer text={question.text} />
              <h4>Student response</h4>
              <pre className="student-response">{attempt.answers[question.id] || '(No response)'}</pre>
              <details>
                <summary>Model answer and marking guidance</summary>
                <MathRenderer text={question.correctAnswer} />
                <MathRenderer text={question.explanation} />
              </details>
              {question.grading === 'manual' ? (
                <label className="mark-input">Score for Question {question.number} (0–{question.points})
                  <input type="number" min="0" max={question.points} step="0.5" value={marks[question.id] ?? ''}
                    disabled={!attempt.isCompleted || saving}
                    onChange={event => setMarks(previous => ({ ...previous, [question.id]: event.target.value }))} />
                </label>
              ) : <p>Automatically marked: {grade.score}/{question.points}</p>}
            </section>
          );
        })}
        <div className="marking-actions glass-card">
          <button className="btn-primary" type="submit" disabled={saving || !attempt.isCompleted}>{saving ? 'Saving marks...' : 'Save marks'}</button>
          {message && <p role="status">{message}</p>}
          {error && <p role="alert">{error}</p>}
        </div>
      </form>
    </div>
  );
}
