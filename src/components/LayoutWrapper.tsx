'use client';

import type { ReactNode } from 'react';
import { StudentProvider, useStudent } from '@/context/StudentContext';
import { CompetitionProvider } from '@/context/CompetitionContext';
import { Header } from './Header';
import { Auth } from './Auth';

function InnerLayout({ children }: { children: ReactNode }) {
  const { activeStudent, isLoaded, user, saveError } = useStudent();
  if (!isLoaded) return <div className="loading-container"><span className="loading-spinner" /><p>Loading your workspace…</p></div>;
  if (!user || !activeStudent) return <main className="auth-layout"><Auth /></main>;

  return (
    <div className="workspace-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header activeStudent={activeStudent} />
      <main className="main-content-layout" id="main-content">
        {saveError && <p role="alert" className="save-error">{saveError}</p>}
        {children}
      </main>
    </div>
  );
}

export function LayoutWrapper({ children }: { children: ReactNode }) {
  return <StudentProvider><CompetitionProvider><InnerLayout>{children}</InnerLayout></CompetitionProvider></StudentProvider>;
}
