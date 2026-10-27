'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, BookOpen, BarChart2, LogOut, Shield, Menu, X, ChevronRight } from 'lucide-react';
import type { Student } from '@/types';
import { useStudent } from '@/context/StudentContext';
import { useCompetition } from '@/context/CompetitionContext';
import exams from '@/data/all-exams';

export function Header({ activeStudent }: { activeStudent: Student }) {
  const pathname = usePathname();
  const { signOut, user, attempts } = useStudent();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const closeMenu = useCallback(() => { setMenuOpen(false); menuButtonRef.current?.focus(); }, []);
  const attempt = attempts.find(attempt => pathname?.split('/')[2] === attempt.id);
  const routeCompetition = pathname === '/' ? 'CAIO' : pathname === '/cjaio' ? 'CJAIO'
    : exams.find(exam => exam.id === attempt?.examId)?.competition;
  const { competition: selectedCompetition, selectCompetition } = useCompetition();
  const competition = routeCompetition ?? selectedCompetition;
  const practiceHref = competition === 'CJAIO' ? '/cjaio' : '/';
  const isPractice = pathname === '/' || pathname === '/cjaio' || pathname.startsWith('/exam/');
  const pageTitle = pathname.startsWith('/admin') ? 'Admin Console'
    : pathname === '/dashboard' ? 'Dashboard' : pathname === '/question-book' ? 'Question Book'
    : pathname.endsWith('/review') ? 'Review' : 'Practice';
  const initials = activeStudent.name.split(' ').filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  const navLinks = [
    { href: practiceHref, label: 'Practice', icon: FileText, active: isPractice },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart2, active: pathname === '/dashboard' },
    { href: '/question-book', label: 'Question Book', icon: BookOpen, active: pathname === '/question-book' },
    ...(user?.email === 'haoyanjiang0709@gmail.com' ? [{ href: '/admin', label: 'Admin Console', icon: Shield, active: pathname.startsWith('/admin') }] : []),
  ];

  useEffect(() => {
    if (!menuOpen) return;
    sidebarRef.current?.querySelector<HTMLAnchorElement>('.workspace-nav-link')?.focus();
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') closeMenu(); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen, closeMenu]);

  return (
    <>
      {menuOpen && <button type="button" className="nav-backdrop" aria-label="Close navigation" onClick={closeMenu} />}
      <aside ref={sidebarRef} className={`workspace-sidebar ${menuOpen ? 'is-open' : ''}`} id="workspace-navigation">
        <Link href={practiceHref} className="workspace-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">AI</span>
          <span><strong>AI Olympiad</strong><small>Practice studio</small></span>
        </Link>
        <button type="button" className="mobile-nav-close icon-button" aria-label="Close navigation" onClick={closeMenu}><X size={20} /></button>
        <nav className="workspace-navigation" aria-label="Study navigation">
          {navLinks.map(({ href, label, icon: Icon, active }) => (
            <Link key={label} href={href} className={`workspace-nav-link ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined}
              onClick={() => { selectCompetition(competition); setMenuOpen(false); }}>
              <Icon size={19} strokeWidth={1.7} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-profile">
          <span className="profile-avatar" aria-hidden="true">{initials}</span>
          <div className="sidebar-profile-text"><strong title={activeStudent.name}>{activeStudent.name}</strong><small title={user?.email}>{user?.email}</small></div>
          <button className="icon-button" type="button" onClick={() => { void signOut(); }} aria-label="Sign out" title="Sign out"><LogOut size={18} /></button>
        </div>
      </aside>
      <header className="workspace-topbar">
        <div className="topbar-location">
          <button ref={menuButtonRef} type="button" className="mobile-nav-toggle icon-button" aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="workspace-navigation" onClick={() => setMenuOpen(true)}><Menu size={21} /></button>
          <span>{pageTitle}</span>{(isPractice || pathname.startsWith('/admin/attempt/')) && <><ChevronRight size={13} className="breadcrumb-divider" /><span className="breadcrumb-competition">{competition}</span></>}
        </div>
        <nav className="competition-switch" aria-label="Choose competition">
          {(['CAIO', 'CJAIO'] as const).map(value => (
            <Link key={value} href={value === 'CJAIO' ? '/cjaio' : '/'} className={competition === value ? 'is-active' : ''}
              aria-current={competition === value ? 'page' : undefined} onClick={() => { selectCompetition(value); setMenuOpen(false); }}>{value}</Link>
          ))}
        </nav>
      </header>
    </>
  );
}
