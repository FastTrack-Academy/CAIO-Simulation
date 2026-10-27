'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useStudentState, checkAnswer } from '../hooks/useStudentState';
export { checkAnswer };
import { Student, ExamAttempt, QuestionBook, StudentStats } from '../types';

interface StudentContextType {
  isLoaded: boolean;
  session: any;
  user: any;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
  students: Student[];
  activeStudent: Student | null;
  createStudentProfile: (name: string) => void;
  switchStudent: (id: string) => void;
  attempts: ExamAttempt[];
  saveError: string | null;
  getStudentAttempts: (studentId: string) => ExamAttempt[];
  saveAttempt: (attempt: ExamAttempt) => Promise<boolean>;
  deleteAttempt: (attemptId: string) => void;
  questionBook: QuestionBook;
  toggleSaveQuestion: (studentId: string, questionId: string) => void;
  removeIncorrectQuestion: (studentId: string, questionId: string) => void;
  stats: StudentStats;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const state = useStudentState();

  return (
    <StudentContext.Provider value={state as any}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
