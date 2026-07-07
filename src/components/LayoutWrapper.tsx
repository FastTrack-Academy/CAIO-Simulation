'use client';

import React from 'react';
import { StudentProvider, useStudent } from '../context/StudentContext';
import { Header } from './Header';
import { Auth } from './Auth';

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { activeStudent, students, switchStudent, createStudentProfile, isLoaded, user } = useStudent();

  if (!isLoaded) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading study profile...</p>
      </div>
    );
  }

  // If not logged in, render the Auth view
  if (!user || !activeStudent) {
    return (
      <main className="main-content-layout">
        <Auth />
      </main>
    );
  }

  return (
    <>
      <Header 
        activeStudent={activeStudent}
        students={students}
        switchStudent={switchStudent}
        createStudentProfile={createStudentProfile}
      />
      
      {/* Dynamic Background Glow Elements */}
      <div className="bg-glow-container">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
      </div>

      <main className="main-content-layout">
        {children}
      </main>

      <style jsx global>{`
        .main-content-layout {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          position: relative;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          min-height: 50vh;
          gap: 1rem;
          color: var(--text-secondary);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(99, 102, 241, 0.1);
          border-radius: 50%;
          border-top-color: var(--color-primary);
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <StudentProvider>
      <InnerLayout>{children}</InnerLayout>
    </StudentProvider>
  );
}
