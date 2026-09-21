import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PortalLogoIcon, ReviewsIcon, CommentIcon, CheckIcon, WarningTriangleIcon, LockIcon } from './Icons';
import { 
  Search, 
  Edit3, 
  Check, 
  KeyRound, 
  Zap, 
  Unlock, 
  ArrowRight, 
  GraduationCap 
} from 'lucide-react';
import { LoginIllustration } from './Illustration';
import { Student } from '../data/studentsData';

export const StudentLoginView: React.FC = () => {
  const { students, loginStudentWithOtp, setActiveRole, setSelectedStudentForViewId } = useApp();

  // Initially empty OTP fields so user is explicitly asked to enter OTP
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('student-1');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const currentSelectedStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const dummyOtp = currentSelectedStudent?.otp || '101010';

  useEffect(() => {
    // Focus first OTP field on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudentId(student.id);
    setSelectedStudentForViewId(student.id);
    setErrorMessage('');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    const val = value.slice(-1);
    if (val && !/^\d$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    setErrorMessage('');

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-detect matching student when 6 digits are typed
    const fullCode = newOtp.join('');
    if (fullCode.length === 6) {
      const matched = students.find(s => s.otp === fullCode);
      if (matched) {
        setSelectedStudentId(matched.id);
        setSelectedStudentForViewId(matched.id);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d+$/.test(pasteData)) {
      const digits = pasteData.split('').slice(0, 6);
      const newOtp = ['', '', '', '', '', ''];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();

      const fullCode = newOtp.join('');
      const matched = students.find(s => s.otp === fullCode);
      if (matched) {
        setSelectedStudentId(matched.id);
        setSelectedStudentForViewId(matched.id);
      }
    }
  };

  const autofillDemoOtp = (code = dummyOtp, studentId = selectedStudentId) => {
    setOtp(code.split(''));
    setSelectedStudentId(studentId);
    setSelectedStudentForViewId(studentId);
    setErrorMessage('');
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    const code = otp.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter all 6 digits of your Student OTP.');
      inputRefs.current[otp.findIndex(d => !d) || 0]?.focus();
      return;
    }

    const result = loginStudentWithOtp(code, selectedStudentId);
    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="login-view student-login-page">
      <div className="login-container">
        {/* Left Hero Section (Desktop) */}
        <div className="login-hero">
          {/* Brand header pill badge */}
          <div className="hero-brand-pill">
            <div className="brand-icon-mini">
              <PortalLogoIcon size={14} />
            </div>
            <span className="brand-text">Student Portal</span>
            <span className="brand-status-dot"></span>
            <span className="brand-status-text">Active</span>
          </div>

          <div className="hero-content">
            <h1 className="hero-title">
              Review your <span className="hero-gradient-text">resume feedback.</span>
            </h1>
            <p className="hero-subtitle">
              View mentor notes, fix checklist items, and get approved.
            </p>

            <div className="hero-feature-chips">
              <div className="feature-pill">
                <Search size={14} className="pill-icon" />
                <span className="pill-label">View Highlights</span>
              </div>
              <div className="feature-pill">
                <Edit3 size={14} className="pill-icon" />
                <span className="pill-label">Fix Mistakes</span>
              </div>
              <div className="feature-pill">
                <Check size={14} className="pill-icon" />
                <span className="pill-label">Get Approved</span>
              </div>
            </div>
          </div>

          <div className="hero-illustration">
            <LoginIllustration />
          </div>
        </div>

        {/* Right Form Pane */}
        <div className="login-form-pane">
          <div className="login-card">
            <div className="login-card-logo" style={{ background: '#FEF08A' }}>
              <LockIcon size={24} />
            </div>
            <div className="login-card-portal-name">STUDENT ACCESS GATEWAY</div>

            <h2 className="login-card-title">Student OTP Verification</h2>
            <p className="login-card-prompt">
              Enter your 6-digit Student OTP to open your resume feedback
            </p>

            {/* Prominent Dummy OTP Helper Banner */}
            <div style={{
              background: '#FEFCE8',
              border: '1.5px solid #FACC15',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px',
              textAlign: 'left',
              boxShadow: '0 2px 6px rgba(234, 179, 8, 0.12)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <KeyRound size={15} color="#854D0E" />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#854D0E' }}>
                    Dummy OTP for Testing:
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => autofillDemoOtp(dummyOtp, currentSelectedStudent?.id)}
                  style={{
                    background: '#FEF08A',
                    border: '1px solid #EAB308',
                    color: '#713F12',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    letterSpacing: '0.5px'
                  }}
                  title="Click to auto-fill this OTP"
                >
                  <Zap size={13} />
                  <span>Fill {dummyOtp}</span>
                </button>
              </div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: '#A16207' }}>
                Student: <strong>{currentSelectedStudent?.name}</strong> • Status: {currentSelectedStudent?.status === 'changes_required' ? 'Changes Needed' : currentSelectedStudent?.status === 'approved' ? 'Approved' : 'In Review'}
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="login-error-alert" style={{ marginBottom: '16px' }}>
                <WarningTriangleIcon size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quick Student Switcher Cards */}
            <div className="student-quick-picker" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="student-quick-picker-label" style={{ margin: 0 }}>Select Student Profile to test:</span>
                <span style={{ fontSize: '10px', color: '#64748B' }}>Click to test their OTP</span>
              </div>
              <div className="student-quick-grid">
                {students.map(student => (
                  <div 
                    key={student.id} 
                    className={`student-quick-card ${selectedStudentId === student.id ? 'selected' : ''}`}
                    onClick={() => handleSelectStudent(student)}
                    title={`Click to select ${student.name} (Dummy OTP: ${student.otp || '101010'})`}
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

            {/* 6-Digit OTP Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '10px', textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                  Enter 6-Digit Verification Code:
                </label>
              </div>

              <div className="otp-inputs-wrapper" onPaste={handlePaste} style={{ marginBottom: '18px' }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`otp-box ${digit ? 'filled' : ''}`}
                    value={digit}
                    placeholder="-"
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                  />
                ))}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                style={{ 
                  padding: '13px', 
                  fontSize: '15px',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(234, 179, 8, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Unlock size={16} />
                <span>Verify OTP & Open Resume Page</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a 
                  href="#volunteer" 
                  className="login-need-help"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveRole('volunteer');
                  }}
                  style={{ color: '#0F172A', fontWeight: '700', fontSize: '13px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <GraduationCap size={15} />
                  <span>Switch to Volunteer Reviewer Portal</span>
                </a>

                <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.4' }}>
                  Entered OTP is verified against student records before opening the annotated resume.
                </div>
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
