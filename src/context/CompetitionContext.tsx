'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type Competition = 'CAIO' | 'CJAIO';
const storageKey = 'olympiad.competition.v1';
const CompetitionContext = createContext<{ competition: Competition; selectCompetition: (value: Competition) => void } | null>(null);

export function CompetitionProvider({ children }: { children: ReactNode }) {
  const [competition, setCompetition] = useState<Competition>(() => {
    try { return typeof window !== 'undefined' && sessionStorage.getItem(storageKey) === 'CJAIO' ? 'CJAIO' : 'CAIO'; }
    catch { return 'CAIO'; }
  });
  const selectCompetition = useCallback((value: Competition) => {
    setCompetition(value);
    try { sessionStorage.setItem(storageKey, value); } catch { /* Navigation works when storage is unavailable. */ }
  }, []);
  return <CompetitionContext.Provider value={{ competition, selectCompetition }}>{children}</CompetitionContext.Provider>;
}

export function useCompetition() {
  const context = useContext(CompetitionContext);
  if (!context) throw new Error('useCompetition must be used inside CompetitionProvider');
  return context;
}
