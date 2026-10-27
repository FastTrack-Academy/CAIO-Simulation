import type { ExamAttempt } from '../types';

export function toAttemptRow(attempt: ExamAttempt) {
  return {
    id: attempt.id,
    student_id: attempt.studentId,
    exam_id: attempt.examId,
    score: attempt.score,
    total_points: attempt.totalPoints,
    answers: attempt.answers,
    flagged: attempt.flagged,
    time_spent: attempt.timeSpent,
    time_left: attempt.timeLeft,
    // Postgres timestamptz accepts NULL for an unfinished test, never ''.
    completed_at: attempt.isCompleted ? attempt.completedAt : null,
    is_completed: attempt.isCompleted,
  };
}
