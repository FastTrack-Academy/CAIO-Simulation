import type { Question } from '@/types';
import { parseSelections } from './grading';

export function displayExamName(name: string) {
  return name.replace(/^CJAIO Part 1 - /, '').replace(/^Max's CJAIO /, "Max's ").replace(/\s*\(Questions .*\)$/, '');
}

export function displayCorrectAnswer(question: Question) {
  if (question.type !== 'multi-select') return question.correctAnswer;
  return parseSelections(question.correctAnswer)
    .map(letter => question.options[letter.charCodeAt(0) - 65])
    .filter(Boolean).join('\n');
}
