'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, FileText, RotateCcw } from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import exams from '@/data/all-exams';
import { getAttemptGrade } from '@/lib/grading';
import { displayExamName } from '@/lib/exam-display';
import type { Exam, ExamAttempt } from '@/types';
import { DifficultyBadge } from './DifficultyBadge';

export function ExamCatalog({ competition }: { competition: NonNullable<Exam['competition']> }) {
  const router = useRouter();
  const { activeStudent, getStudentAttempts, saveAttempt, isLoaded, questionBook } = useStudent();
  const [opening, setOpening] = useState<string | null>(null);
  if (!isLoaded || !activeStudent) return null;

  const visibleExams = exams.filter(exam => exam.competition === competition);
  const visibleIds = new Set(visibleExams.map(exam => exam.id));
  const questionIds = new Set(visibleExams.flatMap(exam => exam.questions.map(question => question.id)));
  const studentAttempts = getStudentAttempts(activeStudent.id).filter(attempt => visibleIds.has(attempt.examId));
  const completed = studentAttempts.filter(attempt => attempt.isCompleted);
  const marked = completed.filter(attempt => getAttemptGrade(visibleExams.find(exam => exam.id === attempt.examId)!, attempt.answers).pendingCount === 0);
  const average = marked.length ? Math.round(marked.reduce((sum, attempt) => sum + 100 * attempt.score / attempt.totalPoints, 0) / marked.length) : null;
  const savedCount = questionBook.savedQuestions.filter(id => questionIds.has(id)).length;
  const examStatus = visibleExams.map(exam => {
    const examAttempts = studentAttempts.filter(attempt => attempt.examId === exam.id);
    const finished = examAttempts.filter(attempt => attempt.isCompleted);
    const marked = finished.filter(attempt => getAttemptGrade(exam, attempt.answers).pendingCount === 0);
    const latest = finished.toSorted((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
    return {
      ...exam,
      totalPoints: exam.questions.reduce((sum, question) => sum + question.points, 0),
      active: examAttempts.find(attempt => !attempt.isCompleted),
      latest,
      finishedCount: finished.length,
      pending: latest ? getAttemptGrade(exam, latest.answers).pendingCount > 0 : false,
      bestScore: marked.length ? Math.max(...marked.map(attempt => Math.round(100 * attempt.score / attempt.totalPoints))) : null,
    };
  });
  const papers = examStatus.filter(exam => !exam.name.startsWith("Max's"));
  const years = [...new Set(papers.flatMap(exam => exam.year ? [exam.year] : []))].sort((a, b) => b - a);
  const groups = [
    ...years.map(year => ({ title: `${year} papers`, exams: papers.filter(exam => exam.year === year) })),
    { title: 'Practice sets', exams: papers.filter(exam => !exam.year) },
    { title: 'Max’s drills', exams: examStatus.filter(exam => exam.name.startsWith("Max's")) },
  ];

  async function startExam(exam: Exam, active?: ExamAttempt) {
    if (!activeStudent || opening) return;
    if (active) { router.push(`/exam/${active.id}`); return; }
    setOpening(exam.id);
    const attempt: ExamAttempt = {
      id: `attempt_${crypto.randomUUID()}`, studentId: activeStudent.id, examId: exam.id,
      score: 0, totalPoints: exam.questions.reduce((sum, question) => sum + question.points, 0),
      answers: {}, flagged: [], timeSpent: 0, timeLeft: (exam.durationMinutes ?? 90) * 60, completedAt: '', isCompleted: false,
    };
    const saved = await saveAttempt(attempt);
    setOpening(null);
    if (saved) router.push(`/exam/${attempt.id}`);
  }

  return (
    <div className="catalog-page page-stack">
      <div className="page-heading">
        <h1>{competition} practice</h1>
        <p>Choose a paper, practise, and review your work.</p>
        <div className="catalog-caption">{visibleExams.length} papers <span>·</span> {visibleExams.reduce((sum, exam) => sum + exam.questions.length, 0)} questions <span>·</span> {competition === 'CJAIO' ? 60 : 90} minutes each</div>
      </div>
      <div className="summary-strip">
        <div><strong>{completed.length}</strong><span>Completed</span></div>
        <div><strong>{average === null ? '—' : `${average}%`}</strong><span>Average score</span></div>
        <div><strong>{savedCount}</strong><span>Saved questions</span></div>
      </div>
      <section className="practice-library panel" aria-labelledby="practice-library-title">
        <div className="panel-heading"><h2 id="practice-library-title">Practice library</h2><Link href="/dashboard" className="text-link">View dashboard <ArrowRight size={15} /></Link></div>
        {groups.filter(group => group.exams.length).map(group => (
          <section key={group.title} className="exam-group" aria-label={group.title}>
            <h3 className="group-title">{group.title}</h3>
            <div className="exams-list">
              {group.exams.map(exam => (
                <article className="exam-row exam-card" key={exam.id} aria-label={exam.name}>
                  <div className="exam-document"><FileText size={22} strokeWidth={1.6} /></div>
                  <div className="exam-row-info">
                    <div className="exam-row-title"><h3 title={exam.name}>{displayExamName(exam.name)}</h3><DifficultyBadge difficulty={exam.difficulty} /></div>
                    <p className="exam-format"><span>{exam.questions.length} questions</span><span>{exam.totalPoints} points</span><span>{exam.durationMinutes} min</span></p>
                    {exam.finishedCount > 0 && <p className="exam-history">{exam.finishedCount} {exam.finishedCount === 1 ? 'attempt' : 'attempts'}{exam.bestScore !== null ? ` · Best ${exam.bestScore}%` : ''}</p>}
                  </div>
                  <span className={`status-pill ${exam.active ? 'active' : exam.latest ? exam.pending ? 'pending' : 'completed' : 'neutral'}`}>{exam.active ? 'In progress' : exam.latest ? exam.pending ? 'Awaiting marking' : 'Completed' : 'Not started'}</span>
                  <div className="exam-row-actions">
                    {exam.latest && !exam.active ? <>
                      <button className="icon-button retake-button" type="button" onClick={() => { void startExam(exam); }} disabled={opening !== null} aria-label={`Retake ${displayExamName(exam.name)}`} title="Retake"><RotateCcw size={17} /></button>
                      <Link href={`/exam/${exam.latest.id}/review`} className="btn-primary">Review <ArrowRight size={15} /></Link>
                    </> : <button className="btn-primary" type="button" disabled={opening !== null} onClick={() => { void startExam(exam, exam.active); }}>{opening === exam.id ? 'Opening…' : exam.active ? 'Resume' : 'Start practice'}<ArrowRight size={16} /></button>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </section>
      <p className="catalog-footnote">Saved a question? Revisit it in your <Link href="/question-book">Question Book</Link>.</p>
    </div>
  );
}
