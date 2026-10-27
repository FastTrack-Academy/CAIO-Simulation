import type { Exam, ExamAttempt, Question } from '@/types';

// Stored alongside responses in the existing answers JSON column. No schema change
// is needed, and question IDs cannot collide with this reserved metadata key.
export const MANUAL_MARKS_KEY = '__manual_marks_v1';

export function parseSelections(answer: string): string[] {
  try {
    const parsed: unknown = JSON.parse(answer);
    if (!Array.isArray(parsed) || !parsed.every(value => typeof value === 'string' && /^[A-E]$/.test(value))) return [];
    return [...new Set(parsed)].sort();
  } catch {
    return [];
  }
}

export function isOptionSelected(question: Question, answer: string, index: number): boolean {
  return question.type === 'multi-select'
    ? parseSelections(answer).includes(String.fromCharCode(65 + index))
    : answer === question.options[index];
}

export function readManualMarks(answers: ExamAttempt['answers']): Record<string, number> {
  try {
    const value: unknown = JSON.parse(answers[MANUAL_MARKS_KEY] || '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([, mark]) => typeof mark === 'number' && Number.isFinite(mark)));
  } catch {
    return {};
  }
}

export function getQuestionGrade(question: Question, answers: ExamAttempt['answers']) {
  const answer = answers[question.id] || '';
  if (question.grading === 'manual') {
    const mark = readManualMarks(answers)[question.id];
    if (typeof mark === 'number' && mark >= 0 && mark <= question.points) {
      return { status: mark === question.points ? 'correct' : mark === 0 ? 'incorrect' : 'partial', score: mark } as const;
    }
    if (answer.trim()) return { status: 'pending', score: 0 } as const;
    return { status: 'incorrect', score: 0 } as const;
  }
  const correct = checkAnswer(answer, question.correctAnswer, question.type);
  return { status: correct ? 'correct' : 'incorrect', score: correct ? question.points : 0 } as const;
}

export function getAttemptGrade(exam: Exam, answers: ExamAttempt['answers']) {
  return exam.questions.reduce((result, question) => {
    const grade = getQuestionGrade(question, answers);
    result.score += grade.score;
    if (grade.status === 'pending') {
      result.pendingCount += 1;
      result.pendingPoints += question.points;
    } else {
      result.gradedPoints += question.points;
    }
    return result;
  }, { score: 0, pendingCount: 0, pendingPoints: 0, gradedPoints: 0 });
}

// Helper to extract possible correct options from a text-input answer pattern
function extractOptions(correctAnswer: string): string[] {
  const options: string[] = [];
  
  // 1. Try to find all backticked snippets: e.g. `code`
  const regex = /`([^`]+)`/g;
  let match;
  while ((match = regex.exec(correctAnswer)) !== null) {
    options.push(match[1].trim());
  }
  
  // 2. If no backticked snippets were found, split by "or", "/", or ";"
  if (options.length === 0) {
    const parts = correctAnswer.split(/\s+or\s+|\s*\/\s*|\s*;\s*/i);
    parts.forEach(p => {
      if (p.trim()) {
        options.push(p.trim());
      }
    });
  }
  
  return options;
}

// Utility to match answers
export function checkAnswer(studentAnswer: string, correctAnswer: string, type: Question['type']): boolean {
  if (!studentAnswer) return false;
  
  if (type === 'multi-select') {
    const selected = parseSelections(studentAnswer);
    const expected = parseSelections(correctAnswer);
    return expected.length > 0 && selected.length === expected.length && selected.every((letter, i) => letter === expected[i]);
  }

  if (type === 'multiple-choice') {
    // Normalise options e.g. "D. Recall" or "Option 3" vs student choice
    // Clean correct answers and student answers for comparison
    const cleanCorrect = cleanAnswerString(correctAnswer);
    const cleanStudent = cleanAnswerString(studentAnswer);

    // If exact match
    if (cleanCorrect === cleanStudent) return true;
    
    // Check if the studentAnswer starts with the correct option letter
    // E.g., Correct answer starts with "D" and student answer is "D" or "Option D"
    // Extract letter prefix from "D. Recall" -> D
    const correctLetter = getOptionLetter(cleanCorrect);
    const studentLetter = getOptionLetter(cleanStudent);
    if (correctLetter && studentLetter && correctLetter === studentLetter) return true;

    // Check option word index match
    if (correctAnswer.toLowerCase().includes(studentAnswer.toLowerCase()) || 
        studentAnswer.toLowerCase().includes(correctAnswer.toLowerCase())) {
      return true;
    }
  } else {
    // Text input matching
    const cleanStudent = cleanTextInput(studentAnswer);
    const options = extractOptions(correctAnswer);

    // Check if the student's answer matches any of the parsed options
    const isMatch = options.some(opt => {
      const cleanOpt = cleanTextInput(opt);
      
      // Exact or loose match (whitespace stripped, semi-colon checks)
      if (cleanOpt === cleanStudent) return true;
      
      // If correct is code statement and user answer has slight quote differences
      if (cleanOpt.replace(/['"]/g, '') === cleanStudent.replace(/['"]/g, '')) return true;
      
      return false;
    });

    if (isMatch) return true;
  }

  return false;
}

function cleanAnswerString(str: string): string {
  // Strip markdown bold characters
  return str.replace(/\*\*/g, '').trim();
}

function getOptionLetter(str: string): string | null {
  // Matches "A", "Option A", "A. Accuracy", "Option 1"
  const match = str.match(/^(?:option\s+)?([a-e1-5])\b/i);
  return match ? match[1].toUpperCase() : null;
}

function cleanTextInput(str: string): string {
  return str.trim()
    .toLowerCase()
    .replace(/`/g, '')   // remove backticks
    .replace(/\s+/g, '') // remove all whitespaces for coding lines comparison
    .replace(/;/g, '')   // remove semicolons
    .replace(/['"]/g, '"'); // normalize quotes to double quotes
}
