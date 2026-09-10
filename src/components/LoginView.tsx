import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PortalLogoIcon, ReviewsIcon, CommentIcon, CheckIcon, WarningTriangleIcon } from './Icons';
import { LoginIllustration } from './Illustration';
import { Student } from '../data/studentsData';

export const LoginView: React.FC = () => {
  const { students, loginWithOtp } = useApp();
  
  const [role, setRole] = useState<'volunteer' | 'student'>('volunteer');
  const [otp, setOtp] = useState<string[]>(['8', '4', '2', '0', '1', '9']);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('student-1');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [autofillSuccess, setAutofillSuccess] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleRoleChange = (newRole: 'volunteer' | 'student') => {
    setRole(newRole);
    setErrorMessage('');
    setAutofillSuccess(false);
    if (newRole === 'volunteer') {
      setOtp(['8', '4', '2', '0', '1', '9']);
    } else {
      // Set to Arun Kumar's OTP by default for student login
      const arun = students.find(s => s.id === 'student-1');
      const studentOtp = arun?.otp || '101010';
      setOtp(studentOtp.split(''));
      setSelectedStudentId('student-1');
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudentId(student.id);
    setErrorMessage('');
    const code = (student.otp || '101010').split('');
    setOtp(code);
    setAutofillSuccess(true);
    setTimeout(() => setAutofillSuccess(false), 2400);
    inputRefs.current[5]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    const val = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    setErrorMessage('');

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if new OTP matches any student
    if (role === 'student') {
      const fullCode = newOtp.join('');
      const matched = students.find(s => s.otp === fullCode);
      if (matched) {
        setSelectedStudentId(matched.id);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d+$/.test(pasteData)) {
      const digits = pasteData.split('').slice(0, 6);
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();

      if (role === 'student') {
        const fullCode = newOtp.join('');
        const matched = students.find(s => s.otp === fullCode);
        if (matched) {
          setSelectedStudentId(matched.id);
        }
      }
    }
  };

  const autofillVolunteerOtp = () => {
    setOtp(['8', '4', '2', '0', '1', '9']);
    setAutofillSuccess(true);
    setTimeout(() => setAutofillSuccess(false), 2400);
    inputRefs.current[5]?.focus();
  };

  const autofillDemoStudent = (code: string, studentId: string) => {
    setSelectedStudentId(studentId);
    setOtp(code.split(''));
    setAutofillSuccess(true);
    setTimeout(() => setAutofillSuccess(false), 2400);
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    const code = otp.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter all 6 digits of your verification code.');
      return;
    }

    const result = loginWithOtp(code, role, role === 'student' ? selectedStudentId : null);
    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="login-view">
      <div className="login-container">
        {/* Left Hero (Desktop) */}
        <div className="login-hero">
          {/* Brand header pill badge */}
          <div className="hero-brand-pill">
            <div className="brand-icon-mini">
              <PortalLogoIcon size={14} />
            </div>
            <span className="brand-text">Resume Review & Mentorship Platform</span>
            <span className="brand-status-dot"></span>
            <span className="brand-status-text">Active Evaluation Session</span>
          </div>

          <div className="hero-content">
            <h1 className="hero-title">
              Empower students to build <span className="hero-gradient-text">placement-ready resumes.</span>
            </h1>
            <p className="hero-subtitle">
              Annotate sections in real-time, deliver actionable commands, and certify career readiness.
            </p>

            <div className="hero-feature-chips">
              <div className="feature-chip">
                <div className="feature-chip-icon">
                  <ReviewsIcon size={16} />
                </div>
                <div className="feature-chip-text">
                  <span className="feature-chip-title">Precision Highlighting</span>
                  <span className="feature-chip-desc">Soft yellow subtopic markers</span>
                </div>
              </div>
              <div className="feature-chip">
                <div className="feature-chip-icon">
                  <CommentIcon size={16} />
                </div>
                <div className="feature-chip-text">
                  <span className="feature-chip-title">Volunteer Commands</span>
                  <span className="feature-chip-desc">Actionable mentor directives</span>
                </div>
              </div>
              <div className="feature-chip">
                <div className="feature-chip-icon">
                  <CheckIcon size={16} />
                </div>
                <div className="feature-chip-text">
                  <span className="feature-chip-title">Verified Approval</span>
                  <span className="feature-chip-desc">Placement-ready signoff</span>
                </div>
              </div>
            </div>
          </div>

          {/* Animation works below the header */}
          <div className="hero-illustration">
            <LoginIllustration />
          </div>
        </div>

        {/* Right Form Pane (Desktop & Mobile) */}
        <div className="login-form-pane">
          <div className="login-card">
            {/* Segmented Role Switcher */}
            <div className="login-role-tabs">
              <button 
                type="button"
                className={`login-role-tab ${role === 'volunteer' ? 'active' : ''}`}
                onClick={() => handleRoleChange('volunteer')}
              >
                🧑‍🏫 Volunteer Login
              </button>
              <button 
                type="button"
                className={`login-role-tab ${role === 'student' ? 'active' : ''}`}
                onClick={() => handleRoleChange('student')}
              >
                🎓 Student Login
              </button>
            </div>

            <div className="login-card-logo">
              <PortalLogoIcon size={26} />
            </div>
            <div className="login-card-portal-name">
              {role === 'volunteer' ? 'Volunteer Reviewer Portal' : 'Student Feedback Portal'}
            </div>

            <h2 className="login-card-title">
              {role === 'volunteer' ? 'Volunteer Login' : 'Student Verification'}
            </h2>
            <p className="login-card-prompt">
              {role === 'volunteer' 
                ? 'Enter your 6-digit volunteer OTP' 
                : 'Enter your 6-digit Student OTP to view your resume changes'}
            </p>

            {errorMessage && (
              <div className="login-error-alert">
                <WarningTriangleIcon size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quick student picker when in student mode */}
            {role === 'student' && (
              <div className="student-quick-picker">
                <span className="student-quick-picker-label">Select your student account:</span>
                <div className="student-quick-grid">
                  {students.map(student => (
                    <div 
                      key={student.id} 
                      className={`student-quick-card ${selectedStudentId === student.id ? 'selected' : ''}`}
                      onClick={() => handleSelectStudent(student)}
                    >
                      <img src={student.avatar} alt={student.name} className="student-quick-avatar" />
                      <div className="student-quick-info">
                        <span className="student-quick-name">{student.name}</span>
                        <span className="student-quick-otp">OTP: {student.otp || '101010'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="otp-inputs-wrapper" onPaste={handlePaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    maxLength={1}
                    className={`otp-box ${digit ? 'filled' : ''} ${autofillSuccess ? 'highlight-flash' : ''}`}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <button 
                type="submit" 
                className="btn-login-submit"
              >
                <span>{role === 'volunteer' ? 'Continue to Dashboard' : 'View My Resume Changes'}</span>
                <span className="btn-arrow-icon">→</span>
              </button>

              {role === 'volunteer' ? (
                <div className="demo-otp-helper">
                  <span>Demo code:</span>
                  <button 
                    type="button" 
                    className="demo-otp-chip"
                    onClick={autofillVolunteerOtp} 
                    title="Click to instant-fill 842019"
                  >
                    <span>⚡ Fill 8 4 2 0 1 9</span>
                  </button>
                </div>
              ) : (
                <div className="demo-otp-helper" style={{ fontSize: '11px', flexWrap: 'wrap' }}>
                  <span>Demo student codes:</span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button type="button" className="demo-otp-chip" onClick={() => autofillDemoStudent('101010', 'student-1')}>Arun 101010</button>
                    <button type="button" className="demo-otp-chip" onClick={() => autofillDemoStudent('202020', 'student-2')}>Priya 202020</button>
                  </div>
                </div>
              )}

              {autofillSuccess && (
                <div className="autofill-success-badge">
                  <span>✓</span>
                  <span>Demo code auto-filled & ready!</span>
                </div>
              )}

              <div>
                <a 
                  href="#help" 
                  className="login-need-help"
                  onClick={(e) => {
                    e.preventDefault();
                    if (role === 'volunteer') {
                      alert('Volunteer Verification:\nEnter 6-digit code 842019 to access the reviewer workspace.');
                    } else {
                      alert('Student Verification:\nEnter your 6-digit code (e.g. 101010 for Arun Kumar) or click on any profile above.');
                    }
                  }}
                >
                  Need help with your code?
                </a>
              </div>
            </form>

            {/* Bottom Illustration on Mobile */}
            <div className="mobile-login-illustration" style={{ display: 'none' }}>
              <LoginIllustration />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
