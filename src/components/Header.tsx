'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, User, CheckSquare, BarChart2, LogOut, ChevronDown, Shield } from 'lucide-react';
import { Student } from '../types';
import { useStudent } from '../context/StudentContext';

interface HeaderProps {
  activeStudent: Student | null;
  students: Student[];
  switchStudent: (id: string) => void;
  createStudentProfile: (name: string) => void;
}

export function Header({
  activeStudent,
  students,
  switchStudent,
  createStudentProfile
}: HeaderProps) {
  const pathname = usePathname();
  const { signOut, user } = useStudent();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleCreateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    createStudentProfile(newProfileName.trim());
    setNewProfileName('');
    setShowCreateForm(false);
    setDropdownOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Exams', icon: BookOpen },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart2 },
    { href: '/question-book', label: 'Question Book', icon: CheckSquare }
  ];

  if (user?.email === 'haoyanjiang0709@gmail.com') {
    navLinks.push({ href: '/admin', label: 'Admin Console', icon: Shield });
  }

  return (
    <header className="main-header">
      <div className="header-container">
        <Link href="/" className="logo-section">
          <div className="logo-icon">AI</div>
          <div className="logo-text">
            <span className="logo-title">CAIO Prep</span>
            <span className="logo-subtitle">Study Hub</span>
          </div>
        </Link>

        <nav className="nav-links">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`nav-link-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="profile-section">
          <div 
            className="active-profile-trigger" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div 
              className="avatar-circle" 
              style={{ backgroundColor: activeStudent?.avatarColor || '#6366f1' }}
            >
              {activeStudent ? getInitials(activeStudent.name) : 'ST'}
            </div>
            <span className="student-name-display">{activeStudent?.name || 'Loading Student...'}</span>
            <ChevronDown size={14} className={`chevron-icon ${dropdownOpen ? 'rotated' : ''}`} />
          </div>

          {dropdownOpen && (
            <div className="profile-dropdown glass-card">
              <div className="dropdown-title">Account Details</div>
              
              <div className="user-details-box">
                <span className="user-email-label">Logged in as:</span>
                <span className="user-email-value">{user?.email || 'Active Candidate'}</span>
              </div>
              
              <button 
                className="sign-out-btn" 
                onClick={() => {
                  signOut();
                  setDropdownOpen(false);
                }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .main-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(10, 13, 22, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0.75rem 0;
        }
        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logo-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
          color: white;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
        }
        .logo-text {
          display: flex;
          flex-direction: column;
        }
        .logo-title {
          font-weight: 800;
          font-size: 1rem;
          color: var(--text-primary);
          line-height: 1.1;
        }
        .logo-subtitle {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .nav-links {
          display: flex;
          gap: 1.5rem;
        }
        .nav-link-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }
        .nav-link-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }
        .nav-link-item.active {
          color: var(--color-primary-light);
          background: rgba(99, 102, 241, 0.08);
        }
        .profile-section {
          position: relative;
        }
        .active-profile-trigger {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .active-profile-trigger:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .avatar-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: white;
        }
        .avatar-circle.small {
          width: 20px;
          height: 20px;
          font-size: 0.6rem;
        }
        .student-name-display {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .chevron-icon {
          color: var(--text-muted);
          transition: transform 0.2s ease;
        }
        .chevron-icon.rotated {
          transform: rotate(180deg);
        }
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 240px;
          padding: 0.75rem;
          z-index: 100;
          background: #111524;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
        }
        .dropdown-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 0.5rem;
        }
        .user-details-box {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 0.75rem;
        }
        .user-email-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .user-email-value {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          word-break: break-all;
        }
        .sign-out-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          width: 100%;
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .sign-out-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.3);
        }
        .create-profile-form {
          margin-top: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .create-profile-form input {
          width: 100%;
          padding: 0.4rem 0.6rem;
          background: var(--bg-primary);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-size: 0.8rem;
        }
        .create-profile-form input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.4rem;
        }
        .create-profile-form button {
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }
        .cancel-btn {
          background: none;
          border: none;
          color: var(--text-muted);
        }
        .cancel-btn:hover {
          color: var(--text-primary);
        }
        .save-btn {
          background: var(--color-primary);
          border: none;
          color: white;
        }
        .save-btn:hover {
          background: var(--color-primary-light);
        }
      `}</style>
    </header>
  );
}
