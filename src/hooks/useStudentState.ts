'use client';

import { useState, useEffect, useRef } from 'react';
import { Student, ExamAttempt, QuestionBook, StudentStats } from '../types';
import examsData from '../data/all-exams';
import { getQuestionGrade, getAttemptGrade } from '../lib/grading';
import { supabase } from '../lib/supabase';
import { toAttemptRow } from '../lib/attempt-persistence';
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveQueue = useRef<Promise<unknown>>(Promise.resolve());

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
      setIsLoaded(false);
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
          completedAt: a.completed_at ?? '',
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
    // Existing tests stay responsive. A new test becomes resumable only once
    // its initial database write succeeds.
    if (!attempt.isCompleted) {
      setAttempts(previous => previous.map(existing => existing.id === attempt.id ? attempt : existing));
    }

    const persist = async () => {
      const { error } = await supabase.from('attempts').upsert(toAttemptRow(attempt));
      if (error) throw error;
      setAttempts(previous => {
        if (attempt.isCompleted) return [...previous.filter(a => a.id !== attempt.id), attempt];
        // Don't replace more recent optimistic edits with an older queued save.
        return previous.some(existing => existing.id === attempt.id) ? previous : [...previous, attempt];
      });

      // If attempt is completed, update incorrect questions list in database
      if (attempt.isCompleted && attempt.studentId) {
        const exam = examsData.find(e => e.id === attempt.examId);
        if (exam) {
          const incorrectIds: string[] = [];
          const correctIds: string[] = [];

          exam.questions.forEach(q => {
            const grade = getQuestionGrade(q, attempt.answers);
            if (grade.status === 'pending') return;
            if (grade.status !== 'correct') {
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
    };
    // Serialize writes so a slower autosave cannot overwrite a later response
    // or turn a submitted attempt back into an in-progress attempt.
    const pending = saveQueue.current.catch(() => undefined).then(persist);
    saveQueue.current = pending;
    try {
      await pending;
      setSaveError(null);
      return true;
    } catch (err) {
      const failure = err as { code?: string; message?: string; details?: string; hint?: string };
      console.error('Error saving attempt to database:', JSON.stringify({
        code: failure?.code, message: failure?.message, details: failure?.details, hint: failure?.hint,
      }));
      setSaveError('Progress could not be saved. Check your connection, keep this page open, and try again before leaving.');
      return false;
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
    const markedAttempts = studentAttempts.filter(attempt => {
      const exam = examsData.find(exam => exam.id === attempt.examId);
      return !exam || getAttemptGrade(exam, attempt.answers).pendingCount === 0;
    });
    const averageScore = markedAttempts.length > 0
      ? Math.round(markedAttempts.reduce((acc, curr) => acc + (curr.score / curr.totalPoints) * 100, 0) / markedAttempts.length)
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
    saveError,
    getStudentAttempts,
    saveAttempt,
    deleteAttempt,
    questionBook,
    toggleSaveQuestion,
    removeIncorrectQuestion,
    stats: activeStudent ? getStudentStats(activeStudent.id) : { examsTaken: 0, averageScore: 0, totalTimeSpent: 0, incorrectCount: 0, savedCount: 0 }
  };
}

export { checkAnswer } from '../lib/grading';
