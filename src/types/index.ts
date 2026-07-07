export interface Question {
  id: string;
  number: number;
  points: number;
  text: string;
  type: 'multiple-choice' | 'text-input';
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Exam {
  id: string;
  name: string;
  questions: Question[];
}

export interface Student {
  id: string;
  name: string;
  avatarColor: string;
}

export interface ExamAttempt {
  id: string; // unique attempt ID
  studentId: string;
  examId: string;
  score: number;
  totalPoints: number;
  answers: { [questionId: string]: string };
  flagged: string[]; // array of questionIds
  timeSpent: number; // in seconds
  timeLeft: number; // in seconds
  completedAt: string; // ISO string
  isCompleted: boolean;
}

export interface QuestionBook {
  studentId: string;
  savedQuestions: string[]; // array of questionIds
  incorrectQuestions: string[]; // array of questionIds
}

export interface StudentStats {
  examsTaken: number;
  averageScore: number;
  totalTimeSpent: number; // in seconds
  incorrectCount: number;
  savedCount: number;
}
