import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WarningTriangleIcon } from './Icons';
import { 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  GraduationCap 
} from 'lucide-react';

type AnimState = 'idle' | 'verifying' | 'success' | 'error';

export const StudentLoginView: React.FC = () => {
  const { students, loginStudentWithOtp, loginStudent, setActiveRole, setCurrentView } = useApp();

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [animState, setAnimState] = useState<AnimState>('idle');
  const [bounceIndex, setBounceIndex] = useState<number | null>(null);
  const [boxOffsets, setBoxOffsets] = useState<{ tx: number; ty: number; ctx: number; cty: number }[]>([]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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

      // Circular orbit position (6 boxes evenly spaced at 60° increments)
      const angleRad = (-90 + i * 60) * (Math.PI / 180);
      const targetX = cX + radius * Math.cos(angleRad);
      const targetY = cY + radius * Math.sin(angleRad);

      const tx = Math.round((targetX - bX) * 10) / 10;
      const ty = Math.round((targetY - bY) * 10) / 10;

      return { tx, ty, ctx, cty };
    });
  };

  const handleChange = (index: number, value: string) => {
    const val = value.slice(-1).toUpperCase();
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
    const pasteData = e.clipboardData.getData('text').trim().toUpperCase();
    if (/^[A-Z0-9]+$/i.test(pasteData)) {
      const digits = pasteData.split('').slice(0, 6);
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;
    setErrorMessage('');
    const code = otp.join('').trim().toUpperCase();
    if (code.length < 6) {
      setErrorMessage('Please enter all 6 characters of your Student OTP.');
      inputRefs.current[otp.findIndex(d => !d) || 0]?.focus();
      return;
    }

    // 1. Calculate orbit coordinates and transition 6 boxes into circular arrangement
    const offsets = computeOffsets();
    setBoxOffsets(offsets);
    setAnimState('verifying');
    setIsLoading(true);

    try {
      // 2. Perform verification with existing student auth flow (no artificial delay before API)
      const authResult = await loginStudentWithOtp(code, null, false);

      if (!authResult || !authResult.success) {
        // 3. Failure: Stop circle immediately, shake error, reset cleanly
        setAnimState('error');
        const isServiceFailure = authResult?.message?.includes('Unable to verify') || authResult?.message?.includes('server');
        setErrorMessage(isServiceFailure 
          ? 'Unable to verify OTP right now. Please try again.' 
          : 'Invalid Student OTP. Please check your OTP and try again.');
        setTimeout(() => {
          setAnimState('idle');
          setBoxOffsets([]);
          setIsLoading(false);
          inputRefs.current[0]?.focus();
        }, 600);
        return;
      }

      // 4. Success: Stop circle immediately, show green check and "Verified"
      setAnimState('success');

      // Keep success UI visible for ~800ms
      await new Promise(resolve => setTimeout(resolve, 800));

      // 5. ONLY THEN execute EXISTING Student Portal navigation
      if (authResult?.student) {
        loginStudent(authResult.student.id);
      } else if (students && students.length > 0) {
        loginStudent(students[0].id);
      }
    } catch (err: any) {
      console.error('[StudentLoginView] Error:', err);
      setAnimState('error');
      setErrorMessage('Unable to verify OTP right now. Please try again.');
      setTimeout(() => {
        setAnimState('idle');
        setBoxOffsets([]);
        setIsLoading(false);
      }, 600);
    }
  };

  return (
    <div className="login-view student-login-page">
      {/* Top Navigation Bar with Team Everest Branding */}
      <header className="login-top-bar">
        <div className="login-brand-group">
          <img 
            src="/images/team-everest-logo.png" 
            alt="Team Everest Logo" 
            className="team-everest-header-logo" 
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="login-brand-titles">
            <span className="login-brand-name">Team Everest</span>
            <span className="login-brand-portal">Resume Review Portal</span>
          </div>
        </div>
      </header>

      {/* Centered Main Stage with Clean Student Verification Card */}
      <main 
        className="student-login-main-stage" 
        style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '32px 16px' 
        }}
      >
        <div className="login-form-pane" style={{ maxWidth: '440px', width: '100%' }}>
          <div className="login-card">
            {/* Top Navigation Row inside Card */}
            <div className="login-card-top-nav">
              {/* Segmented Role Switcher */}
              <div className="login-role-tabs">
                <button 
                  type="button"
                  className="login-role-tab"
                  onClick={() => {
                    setActiveRole('volunteer');
                    setCurrentView('login');
                  }}
                  title="Switch to Volunteer Login"
                >
                  <GraduationCap size={14} />
                  <span>Volunteer</span>
                </button>
                <button 
                  type="button"
                  className="login-role-tab active"
                  title="Student Portal selected"
                >
                  <User size={14} />
                  <span>Student</span>
                </button>
              </div>

              <a 
                href="#"
                className="login-back-home-link"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveRole('volunteer');
                  setCurrentView('login');
                }}
                title="Return to main Landing / Login page"
              >
                <ArrowLeft size={13} />
                <span>Back to Home</span>
              </a>
            </div>

            {/* Student Profile Avatar */}
            <div className="login-avatar-stage">
              <img 
                src="/images/login-carousel/student-slide4.jpg" 
                alt="Team Everest Student" 
                className="login-avatar-img student-avatar"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <h2 className="login-card-title">Student Verification</h2>
            <p className="login-card-prompt">
              Enter your 6-digit Student OTP to view your resume changes
            </p>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="login-error-alert" style={{ marginBottom: '16px' }}>
                <WarningTriangleIcon size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 6-Digit OTP Form with Smooth Circle Animation */}
            <form onSubmit={handleSubmit}>
              <div 
                ref={wrapperRef}
                className={`otp-inputs-wrapper ${animState === 'verifying' ? 'is-verifying' : ''} ${animState === 'success' ? 'is-success' : ''} ${animState === 'error' ? 'is-error' : ''}`}
                onPaste={handlePaste}
                style={{ marginBottom: '18px' }}
              >
                <div className={`otp-boxes-track ${animState === 'verifying' ? 'is-spinning' : ''}`}>
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
                        className={`otp-box ${digit ? 'filled' : ''} ${bounceIndex === idx ? 'input-bounce' : ''}`}
                        value={digit}
                        placeholder={animState === 'idle' ? '-' : ''}
                        style={{ '--tx': tx, '--ty': ty } as React.CSSProperties}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        autoFocus={idx === 0}
                        aria-label={`Student OTP Digit ${idx + 1}`}
                      />
                    );
                  })}
                </div>

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
                    <div className="otp-success-text">Verified</div>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block btn-login-submit" 
                disabled={isLoading}
                style={{ 
                  padding: '13px', 
                  fontSize: '15px',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(234, 179, 8, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isLoading ? 0.85 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                <span>
                  {animState === 'success' ? 'Verified' : 'Verify OTP & Open Resume Page'}
                </span>
                {!isLoading && <ArrowRight size={16} />}
                {animState === 'success' && <Check size={16} />}
              </button>

              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a 
                  href="#volunteer" 
                  className="login-need-help"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveRole('volunteer');
                    setCurrentView('login');
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
          </div>
        </div>
      </main>
    </div>
  );
};
