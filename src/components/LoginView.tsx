import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PortalLogoIcon, ReviewsIcon, CommentIcon, CheckIcon, WarningTriangleIcon } from './Icons';
import { 
  Zap, 
  MessageSquare, 
  Check, 
  GraduationCap, 
  User, 
  ArrowRight 
} from 'lucide-react';
import { LoginIllustration } from './Illustration';
import { Student } from '../data/studentsData';
import { loginVolunteerWithApi } from '../services/zohoApi';

type AnimState = 'idle' | 'verifying' | 'success' | 'error';

export const LoginView: React.FC = () => {
  const { students, loginWithOtp } = useApp();
  
  const [role, setRole] = useState<'volunteer' | 'student'>('volunteer');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('student-1');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autofillSuccess, setAutofillSuccess] = useState<boolean>(false);
  const [animState, setAnimState] = useState<AnimState>('idle');
  const [bounceIndex, setBounceIndex] = useState<number | null>(null);
  const [boxOffsets, setBoxOffsets] = useState<{ tx: number; ty: number; ctx: number; cty: number }[]>([]);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const computeOffsets = () => {
    if (!wrapperRef.current) return [];
    const cRect = wrapperRef.current.getBoundingClientRect();
    const cX = cRect.left + cRect.width / 2;
    const cY = cRect.top + cRect.height / 2;
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
    const radius = isMobile ? 52 : 64;

    return inputRefs.current.map((el, i) => {
      if (!el) return { tx: 0, ty: 0, ctx: 0, cty: 0 };
      const bRect = el.getBoundingClientRect();
      const bX = bRect.left + bRect.width / 2;
      const bY = bRect.top + bRect.height / 2;

      // Convergence to center (Success)
      const ctx = Math.round((cX - bX) * 10) / 10;
      const cty = Math.round((cY - bY) * 10) / 10;

      // Circular orbit position (6 boxes evenly spaced at 60° increments, starting from top -90°)
      const angleRad = (-90 + i * 60) * (Math.PI / 180);
      const targetX = cX + radius * Math.cos(angleRad);
      const targetY = cY + radius * Math.sin(angleRad);

      const tx = Math.round((targetX - bX) * 10) / 10;
      const ty = Math.round((targetY - bY) * 10) / 10;

      return { tx, ty, ctx, cty };
    });
  };

  const handleRoleChange = (newRole: 'volunteer' | 'student') => {
    setRole(newRole);
    setErrorMessage('');
    setAutofillSuccess(false);
    setAnimState('idle');
    setBoxOffsets([]);
    if (newRole === 'volunteer') {
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } else {
      // Set to Arun Kumar's OTP by default for student login
      const arun = students.find(s => s.id === 'student-1');
      const studentOtp = arun?.sOtp || arun?.otp || '101010';
      setOtp(studentOtp.split(''));
      setSelectedStudentId('student-1');
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudentId(student.id);
    setErrorMessage('');
    setAnimState('idle');
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

    if (val) {
      setBounceIndex(index);
      setTimeout(() => {
        setBounceIndex(prev => prev === index ? null : prev);
      }, 250);
    }

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
    if (/^[a-zA-Z0-9]+$/.test(pasteData)) {
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
    setAnimState('idle');
    setOtp(['G', 'E', '7', '0', '8', '4']);
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;
    setErrorMessage('');
    const code = otp.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter all 6 digits of your verification code.');
      return;
    }

    if (role === 'volunteer') {
      // 1. Calculate orbit coordinates and transition 6 boxes into circular arrangement
      const offsets = computeOffsets();
      setBoxOffsets(offsets);
      setAnimState('verifying');
      setIsLoading(true);

      try {
        // 2. Perform existing verification API call
        const apiResult = await loginVolunteerWithApi(code);

        if (!apiResult.success) {
          // 3. Invalid OTP: return boxes to horizontal row with error shake
          setAnimState('error');
          setErrorMessage(apiResult.message || 'Invalid Volunteer OTP');
          setTimeout(() => {
            setAnimState('idle');
            setIsLoading(false);
            inputRefs.current[0]?.focus();
          }, 600);
          return;
        }

        // 4. Successful verification: converge 6 boxes toward center and show verified badge
        setAnimState('success');

        // Keep final success animation for 800ms
        await new Promise(resolve => setTimeout(resolve, 800));

        // 5. Continue existing navigation to dashboard
        await loginWithOtp(code, role, null);
      } catch (err: any) {
        setAnimState('error');
        setErrorMessage(err?.message || 'Unable to connect to server. Please try again.');
        setTimeout(() => {
          setAnimState('idle');
          setIsLoading(false);
        }, 600);
      }
    } else {
      // Student login mode
      setIsLoading(true);
      try {
        const result = await loginWithOtp(code, role, selectedStudentId);
        if (!result.success) {
          setErrorMessage(result.message || 'Verification failed');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'Unable to connect to server. Please try again.');
      } finally {
        setIsLoading(false);
      }
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
            <span className="brand-text">Resume Review Portal</span>
            <span className="brand-status-dot"></span>
            <span className="brand-status-text">Active</span>
          </div>

          <div className="hero-content">
            <h1 className="hero-title">
              Help students build <span className="hero-gradient-text">better resumes.</span>
            </h1>
            <p className="hero-subtitle">
              Highlight sections, share feedback, and approve resumes.
            </p>

            <div className="hero-feature-chips">
              <div className="feature-pill">
                <Zap size={14} className="pill-icon" />
                <span className="pill-label">Highlight Sections</span>
              </div>
              <div className="feature-pill">
                <MessageSquare size={14} className="pill-icon" />
                <span className="pill-label">Mentor Feedback</span>
              </div>
              <div className="feature-pill">
                <Check size={14} className="pill-icon" />
                <span className="pill-label">Approve Resumes</span>
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
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <GraduationCap size={15} />
                <span>Volunteer Login</span>
              </button>
              <button 
                type="button"
                className={`login-role-tab ${role === 'student' ? 'active' : ''}`}
                onClick={() => handleRoleChange('student')}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <User size={15} />
                <span>Student Login</span>
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
              <div 
                ref={wrapperRef}
                className={`otp-inputs-wrapper ${animState === 'verifying' ? 'is-verifying' : ''} ${animState === 'success' ? 'is-success' : ''} ${animState === 'error' ? 'is-error' : ''}`} 
                onPaste={handlePaste}
              >
                {otp.map((digit, idx) => {
                  const tx = animState === 'verifying' 
                    ? `${boxOffsets[idx]?.tx || 0}px` 
                    : animState === 'success' 
                      ? `${boxOffsets[idx]?.ctx || 0}px` 
                      : '0px';
                  const ty = animState === 'verifying' 
                    ? `${boxOffsets[idx]?.ty || 0}px` 
                    : animState === 'success' 
                      ? `${boxOffsets[idx]?.cty || 0}px` 
                      : '0px';

                  return (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      readOnly={animState === 'verifying' || animState === 'success'}
                      className={`otp-box ${digit ? 'filled' : ''} ${autofillSuccess ? 'highlight-flash' : ''} ${bounceIndex === idx ? 'input-bounce' : ''}`}
                      value={digit}
                      style={{ '--tx': tx, '--ty': ty } as React.CSSProperties}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      autoFocus={idx === 0}
                    />
                  );
                })}

                {animState === 'success' && (
                  <div className="otp-success-badge-container">
                    <div className="otp-success-badge">
                      <div className="otp-success-ring"></div>
                      <div className="otp-success-icon">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <div className="otp-success-text">Verified successfully</div>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn-login-submit"
                disabled={isLoading}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px',
                  ...(isLoading ? { opacity: 0.85, cursor: 'not-allowed' } : {})
                }}
              >
                <span>
                  {isLoading 
                    ? (animState === 'success' 
                        ? 'Verified!' 
                        : role === 'volunteer' 
                          ? 'Verifying Volunteer OTP...' 
                          : 'Verifying Student...') 
                    : (role === 'volunteer' ? 'Continue to Dashboard' : 'View My Resume Changes')}
                </span>
                {!isLoading && <ArrowRight size={16} className="btn-arrow-icon" />}
              </button>

              {role === 'volunteer' ? (
                <div className="demo-otp-helper">
                  <span>Demo code:</span>
                  <button 
                    type="button" 
                    className="demo-otp-chip"
                    onClick={autofillVolunteerOtp} 
                    title="Click to instant-fill GE7084"
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={12} />
                      <span>Fill G E 7 0 8 4</span>
                    </span>
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
                <div className="autofill-success-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} />
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
