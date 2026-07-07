'use client';

import { useState, useEffect } from 'react';
import { Student, ExamAttempt, QuestionBook, StudentStats } from '../types';
import examsData from '../data/exams.json';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export function useStudentState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [questionBook, setQuestionBook] = useState<QuestionBook>({
    studentId: '',
    savedQuestions: [],
    incorrectQuestions: []
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Authenticate user with password
  const signIn = async (email: string, password: string) => {
    let res = await supabase.auth.signInWithPassword({ email, password });
    
    // Auto-create admin account if it doesn't exist yet
    if (res.error && email === 'haoyanjiang0709@gmail.com' && password === '123456') {
      console.log('Admin account does not exist. Auto-creating admin profile...');
      const signUpRes = await signUp(email, password, 'Admin');
      if (!signUpRes.error) {
        // Try logging in again
        res = await supabase.auth.signInWithPassword({ email, password });
      }
    }
    return res;
  };

  // Sign up user with email, password, and save full name to profile
  const signUp = async (email: string, password: string, fullName: string) => {
    const res = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    
    // If sign up is successful, create the profile and question book in public database immediately
    if (res.data?.user) {
      const newUser = res.data.user;
      const avatarColor = ['#818cf8', '#34d399', '#fb7185', '#f472b6', '#38bdf8', '#fbbf24'][Math.floor(Math.random() * 6)];
      
      try {
        await supabase.from('profiles').insert({
          id: newUser.id,
          name: fullName,
          avatar_color: avatarColor,
          email: newUser.email
        });

        await supabase.from('question_books').insert({
          student_id: newUser.id,
          saved_questions: [],
          incorrect_questions: []
        });
      } catch (err) {
        console.error('Error creating profile after signup:', err);
      }
    }
    return res;
  };

  // Sign out current user
  const signOut = async () => {
    setIsLoaded(false);
    
    // Log out logon session
    if (typeof window !== 'undefined') {
      const logonLogId = sessionStorage.getItem('current_logon_log_id');
      if (logonLogId) {
        try {
          await supabase
            .from('logon_logs')
            .update({
              logout_at: new Date().toISOString(),
              last_active: new Date().toISOString()
            })
            .eq('id', logonLogId);
        } catch (err) {
          // Fail silently
        }
        sessionStorage.removeItem('current_logon_log_id');
      }
    }

    await supabase.auth.signOut();
  };

  // Logon session tracking
  useEffect(() => {
    if (!user || !activeStudent) return;

    let logonLogId = typeof window !== 'undefined' ? sessionStorage.getItem('current_logon_log_id') : null;
    let isTracking = true;

    const startLogonSession = async () => {
      try {
        if (!logonLogId) {
          const { data, error } = await supabase
            .from('logon_logs')
            .insert({
              user_id: user.id,
              email: user.email,
              name: activeStudent.name,
              login_at: new Date().toISOString(),
              last_active: new Date().toISOString()
            })
            .select('id')
            .maybeSingle();

          if (error) {
            console.warn('Could not create logon log (table might not exist yet):', error.message);
            return;
          }

          if (data?.id && isTracking) {
            logonLogId = data.id;
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('current_logon_log_id', data.id);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to start logon tracking:', err);
      }
    };

    startLogonSession();

    // Ping activity every 30 seconds
    const interval = setInterval(async () => {
      if (!logonLogId || !isTracking) return;
      try {
        await supabase
          .from('logon_logs')
          .update({
            last_active: new Date().toISOString()
          })
          .eq('id', logonLogId);
      } catch (err) {
        // Fail silently
      }
    }, 30000);

    return () => {
      isTracking = false;
      clearInterval(interval);
    };
  }, [user?.id, activeStudent?.id]);

  // Get active session on mount and listen to changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync profile, attempts, and question books when user logs in/out
  useEffect(() => {
    if (!user) {
      setActiveStudent(null);
      setStudents([]);
      setAttempts([]);
      setQuestionBook({ studentId: '', savedQuestions: [], incorrectQuestions: [] });
      setIsLoaded(true);
      return;
    }

    const loadUserData = async () => {
      try {
        // Fetch or create profile
        let { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileErr || !profile) {
          const avatarColor = ['#818cf8', '#34d399', '#fb7185', '#f472b6', '#38bdf8', '#fbbf24'][Math.floor(Math.random() * 6)];
          const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Candidate';
          
          const { data: newProfile, error: createProfileErr } = await supabase
            .from('profiles')
            .insert({ id: user.id, name, avatar_color: avatarColor, email: user.email })
            .select()
            .single();

          if (createProfileErr) throw createProfileErr;
          profile = newProfile;
        }

        const student: Student = {
          id: profile.id,
          name: profile.name,
          avatarColor: profile.avatar_color
        };

        setActiveStudent(student);
        setStudents([student]);

        // Fetch Attempts
        const { data: dbAttempts, error: attemptsErr } = await supabase
          .from('attempts')
          .select('*')
          .eq('student_id', user.id);

        if (attemptsErr) throw attemptsErr;

        const formattedAttempts: ExamAttempt[] = (dbAttempts || []).map(a => ({
          id: a.id,
          studentId: a.student_id,
          examId: a.exam_id,
          score: a.score,
          totalPoints: a.total_points,
          answers: a.answers,
          flagged: a.flagged,
          timeSpent: a.time_spent,
          timeLeft: a.time_left,
          completedAt: a.completed_at,
          isCompleted: a.is_completed
        }));
        setAttempts(formattedAttempts);

        // Fetch or create Question Book
        let { data: qBook, error: qBookErr } = await supabase
          .from('question_books')
          .select('*')
          .eq('student_id', user.id)
          .maybeSingle();

        if (qBookErr || !qBook) {
          const { data: newQBook, error: createQBookErr } = await supabase
            .from('question_books')
            .insert({ student_id: user.id, saved_questions: [], incorrect_questions: [] })
            .select()
            .single();

          if (createQBookErr) throw createQBookErr;
          qBook = newQBook;
        }

        setQuestionBook({
          studentId: qBook.student_id,
          savedQuestions: qBook.saved_questions || [],
          incorrectQuestions: qBook.incorrect_questions || []
        });

      } catch (err) {
        console.error('Error loading user data from database:', err);
      } finally {
        setIsLoaded(true);
      }
    };

    loadUserData();
  }, [user?.id]);

  const getStudentAttempts = (studentId: string) => {
    return attempts.filter(a => a.studentId === studentId);
  };

  const saveAttempt = async (attempt: ExamAttempt) => {
    // 1. Optimistic UI update
    const filtered = attempts.filter(a => a.id !== attempt.id);
    const updated = [...filtered, attempt];
    setAttempts(updated);

    // 2. Sync to DB
    try {
      const dbRow = {
        id: attempt.id,
        student_id: attempt.studentId,
        exam_id: attempt.examId,
        score: attempt.score,
        total_points: attempt.totalPoints,
        answers: attempt.answers,
        flagged: attempt.flagged,
        time_spent: attempt.timeSpent,
        time_left: attempt.timeLeft,
        completed_at: attempt.completedAt,
        is_completed: attempt.isCompleted
      };

      await supabase.from('attempts').upsert(dbRow);

      // If attempt is completed, update incorrect questions list in database
      if (attempt.isCompleted && attempt.studentId) {
        const exam = examsData.find(e => e.id === attempt.examId);
        if (exam) {
          const incorrectIds: string[] = [];
          const correctIds: string[] = [];

          exam.questions.forEach(q => {
            const studentAns = attempt.answers[q.id] || '';
            const isCorrect = checkAnswer(studentAns, q.correctAnswer, q.type as any);
            if (!isCorrect) {
              incorrectIds.push(q.id);
            } else {
              correctIds.push(q.id);
            }
          });

          // Compute new incorrect list
          const updatedIncorrects = Array.from(new Set([
            ...questionBook.incorrectQuestions.filter(id => !correctIds.includes(id)),
            ...incorrectIds
          ]));

          const newQBook = {
            ...questionBook,
            incorrectQuestions: updatedIncorrects
          };
          setQuestionBook(newQBook);

          await supabase.from('question_books').update({
            incorrect_questions: updatedIncorrects,
            updated_at: new Date().toISOString()
          }).eq('student_id', attempt.studentId);
        }
      }
    } catch (err) {
      console.error('Error saving attempt to database:', err);
    }
  };

  const deleteAttempt = async (attemptId: string) => {
    // 1. Optimistic UI update
    const updated = attempts.filter(a => a.id !== attemptId);
    setAttempts(updated);

    // 2. Sync to DB
    try {
      await supabase.from('attempts').delete().eq('id', attemptId);
    } catch (err) {
      console.error('Error deleting attempt from database:', err);
    }
  };

  const toggleSaveQuestion = async (studentId: string, questionId: string) => {
    const isSaved = questionBook.savedQuestions.includes(questionId);
    const updatedSaved = isSaved
      ? questionBook.savedQuestions.filter(id => id !== questionId)
      : [...questionBook.savedQuestions, questionId];

    // 1. Optimistic UI update
    const newQBook = {
      ...questionBook,
      savedQuestions: updatedSaved
    };
    setQuestionBook(newQBook);

    // 2. Sync to DB
    try {
      await supabase.from('question_books').update({
        saved_questions: updatedSaved,
        updated_at: new Date().toISOString()
      }).eq('student_id', studentId);
    } catch (err) {
      console.error('Error toggling saved question in database:', err);
    }
  };

  const removeIncorrectQuestion = async (studentId: string, questionId: string) => {
    const updatedIncorrect = questionBook.incorrectQuestions.filter(id => id !== questionId);

    // 1. Optimistic UI update
    const newQBook = {
      ...questionBook,
      incorrectQuestions: updatedIncorrect
    };
    setQuestionBook(newQBook);

    // 2. Sync to DB
    try {
      await supabase.from('question_books').update({
        incorrect_questions: updatedIncorrect,
        updated_at: new Date().toISOString()
      }).eq('student_id', studentId);
    } catch (err) {
      console.error('Error removing incorrect question from database:', err);
    }
  };

  const getStudentStats = (studentId: string): StudentStats => {
    const studentAttempts = attempts.filter(a => a.studentId === studentId && a.isCompleted);

    const examsTaken = studentAttempts.length;
    const averageScore = examsTaken > 0
      ? Math.round(studentAttempts.reduce((acc, curr) => acc + (curr.score / curr.totalPoints) * 100, 0) / examsTaken)
      : 0;
    const totalTimeSpent = studentAttempts.reduce((acc, curr) => acc + curr.timeSpent, 0);

    return {
      examsTaken,
      averageScore,
      totalTimeSpent,
      incorrectCount: questionBook ? questionBook.incorrectQuestions.length : 0,
      savedCount: questionBook ? questionBook.savedQuestions.length : 0
    };
  };

  return {
    isLoaded,
    session,
    user,
    signIn,
    signUp,
    signOut,
    students,
    activeStudent,
    createStudentProfile: async () => {}, // No-op since we do standard auth now
    attempts,
    getStudentAttempts,
    saveAttempt,
    deleteAttempt,
    questionBook,
    toggleSaveQuestion,
    removeIncorrectQuestion,
    stats: activeStudent ? getStudentStats(activeStudent.id) : { examsTaken: 0, averageScore: 0, totalTimeSpent: 0, incorrectCount: 0, savedCount: 0 }
  };
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
export function checkAnswer(studentAnswer: string, correctAnswer: string, type: 'multiple-choice' | 'text-input'): boolean {
  if (!studentAnswer) return false;
  
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
