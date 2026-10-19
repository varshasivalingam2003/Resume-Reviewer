import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PortalLogoIcon, WarningTriangleIcon } from './Icons';
import { 
  GraduationCap, 
  User, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  Check, 
  Zap, 
  Bell,
  Star,
  Briefcase,
  Layers,
  Heart,
  Award
} from 'lucide-react';
import { Student } from '../data/studentsData';

type AnimState = 'idle' | 'verifying' | 'success' | 'error';

interface CarouselSlide {
  id: number;
  badge: number;
  headingStart: string;
  headingHighlight: string;
  description: string;
  image: string;
  alt: string;
  animType: 'fade' | 'smooth' | 'slide' | 'impact';
}

const VOLUNTEER_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    badge: 1,
    headingStart: 'Turn Resumes ',
    headingHighlight: 'Into Brighter Futures',
    description: 'Join as a volunteer and start reviewing resumes.',
    image: '/images/login-carousel/volunteer-slide1.jpg',
    alt: 'Realistic Team Everest volunteer reviewing resumes',
    animType: 'fade'
  },
  {
    id: 2,
    badge: 2,
    headingStart: 'Review ',
    headingHighlight: 'Resumes',
    description: 'Read student resumes and highlight key strengths.',
    image: '/images/login-carousel/volunteer-slide2.jpg',
    alt: 'Real person reviewing a resume on a laptop',
    animType: 'smooth'
  },
  {
    id: 3,
    badge: 3,
    headingStart: 'Share Your ',
    headingHighlight: 'Feedback',
    description: 'Rate and write comments to guide students.',
    image: '/images/login-carousel/volunteer-slide3.jpg',
    alt: 'Real volunteer providing resume feedback',
    animType: 'slide'
  },
  {
    id: 4,
    badge: 4,
    headingStart: 'Together We ',
    headingHighlight: 'Make an Impact',
    description: 'Your feedback creates real opportunities for students.',
    image: '/images/login-carousel/volunteer-slide4.jpg',
    alt: 'Realistic volunteering group photo',
    animType: 'impact'
  }
];

const STUDENT_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    badge: 1,
    headingStart: 'Showcase Your ',
    headingHighlight: 'Journey',
    description: 'Share your profile and let volunteers help you grow.',
    image: '/images/login-carousel/student-slide1.jpg',
    alt: 'Real student working on a laptop',
    animType: 'fade'
  },
  {
    id: 2,
    badge: 2,
    headingStart: 'Upload Your ',
    headingHighlight: 'Resume',
    description: 'Share your latest resume to get feedback.',
    image: '/images/login-carousel/student-slide2.jpg',
    alt: 'Realistic laptop displaying a resume upload screen',
    animType: 'smooth'
  },
  {
    id: 3,
    badge: 3,
    headingStart: 'Get Valuable ',
    headingHighlight: 'Feedback',
    description: 'Receive personalized feedback to improve your resume.',
    image: '/images/login-carousel/student-slide3.jpg',
    alt: 'Real student reviewing volunteer feedback',
    animType: 'slide'
  },
  {
    id: 4,
    badge: 4,
    headingStart: 'Take the Next Step ',
    headingHighlight: 'With Confidence',
    description: 'Build a stronger resume for a brighter future.',
    image: '/images/login-carousel/student-slide4.jpg',
    alt: 'Realistic confident student photo',
    animType: 'impact'
  }
];

export const LoginView: React.FC = () => {
  const { students, loginWithOtp, currentView, setCurrentView, isAuthenticated, volunteer, loginStudent, activeRole, setActiveRole, isStudentLoggedIn, setIsStudentLoggedIn } = useApp();
  
  const [step, setStep] = useState<'carousel' | 'login'>('carousel');
  const [role, setRole] = useState<'volunteer' | 'student'>(activeRole === 'student' ? 'student' : 'volunteer');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [animState, setAnimState] = useState<AnimState>('idle');
  const [bounceIndex, setBounceIndex] = useState<number | null>(null);
  const [boxOffsets, setBoxOffsets] = useState<{ tx: number; ty: number; ctx: number; cty: number }[]>([]);
  const isNavigatingRef = useRef<boolean>(false);
  const successNavTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up success timer on unmount
  useEffect(() => {
    return () => {
      if (successNavTimerRef.current) {
        clearTimeout(successNavTimerRef.current);
      }
    };
  }, []);

  // Ensure currentView is 'login' so that App.tsx does not switch prematurely when unauthenticated
  useEffect(() => {
    if (isAuthenticated || isStudentLoggedIn) return;
    if (!isNavigatingRef.current && currentView !== 'login') {
      setCurrentView('login');
    }
  }, [isAuthenticated, isStudentLoggedIn, currentView, setCurrentView]);
  
  // Carousel State
  const slides = role === 'student' ? STUDENT_SLIDES : VOLUNTEER_SLIDES;
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Auto-play carousel every 3 seconds (pausing on hover/interaction)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused, role, slides.length]);

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      // Swiped left -> next slide
      setActiveSlide(prev => (prev + 1) % slides.length);
    } else if (distance < -45) {
      // Swiped right -> prev slide
      setActiveSlide(prev => (prev - 1 + slides.length) % slides.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const goToPrevSlide = () => {
    setActiveSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setActiveSlide(prev => (prev + 1) % slides.length);
  };

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
    setActiveRole(newRole);
    setActiveSlide(0);
    setErrorMessage('');
    setAnimState('idle');
    setBoxOffsets([]);
    setOtp(['', '', '', '', '', '']);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 50);
  };

  const handleChange = (index: number, value: string) => {
    // Preserve uppercase normalization for OTP
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
      setErrorMessage(
        role === 'volunteer'
          ? 'Please enter all 6 characters of your verification code.'
          : 'Please enter all 6 characters of your Student OTP.'
      );
      return;
    }

    if (role === 'volunteer') {
      // 1. Calculate orbit coordinates and transition 6 boxes into circular arrangement
      const offsets = computeOffsets();
      setBoxOffsets(offsets);
      setAnimState('verifying');
      setIsLoading(true);

      try {
        // 2. Perform verification with existing auth flow (NO delay on API request)
        const authResult = await loginWithOtp(code, role, null, false);

        if (!authResult || !authResult.success) {
          // Failure: Stop/reset circle animation cleanly, return boxes to normal layout, show error
          setAnimState('error');
          const isServiceFailure = authResult?.message?.includes('Unable to verify') || authResult?.message?.includes('server');
          setErrorMessage(isServiceFailure 
            ? 'Unable to verify OTP right now. Please try again.' 
            : 'Invalid Volunteer OTP. Please check your OTP and try again.');
          setTimeout(() => {
            setAnimState('idle');
            setBoxOffsets([]);
            setIsLoading(false);
            inputRefs.current[0]?.focus();
          }, 600);
          return;
        }

        // On successful API response:
        // 1. Set the existing visual state to success.
        // 2. Stop/hide the rotating OTP animation.
        // 3. Render a centered green check.
        // 4. Render "Verified" below it.
        setAnimState('success');

        // 5. Keep this success UI visible for about 800ms.
        await new Promise(resolve => {
          successNavTimerRef.current = setTimeout(resolve, 800);
        });

        // 6. ONLY THEN execute the EXISTING dashboard navigation.
        isNavigatingRef.current = true;
        setCurrentView('dashboard');
      } catch (err: any) {
        console.error('[LoginView] Error:', err);
        setAnimState('error');
        setErrorMessage('Unable to verify OTP right now. Please try again.');
        setTimeout(() => {
          setAnimState('idle');
          setBoxOffsets([]);
          setIsLoading(false);
        }, 600);
      }
    } else {
      // Student login mode
      const offsets = computeOffsets();
      setBoxOffsets(offsets);
      setAnimState('verifying');
      setIsLoading(true);

      try {
        const authResult = await loginWithOtp(code, role, null, false);
        if (!authResult || !authResult.success) {
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

        setAnimState('success');
        await new Promise(resolve => {
          successNavTimerRef.current = setTimeout(resolve, 800);
        });
        isNavigatingRef.current = true;
        if (authResult?.student) {
          loginStudent(authResult.student.id);
        } else {
          setActiveRole('student');
          setIsStudentLoggedIn(true);
        }
      } catch (err: any) {
        console.error('[LoginView] Error:', err);
        setAnimState('error');
        setErrorMessage('Unable to verify OTP right now. Please try again.');
        setTimeout(() => {
          setAnimState('idle');
          setBoxOffsets([]);
          setIsLoading(false);
        }, 600);
      }
    }
  };

  const currentSlide = slides[activeSlide % slides.length];

  return (
    <div className="login-view">
      {/* Top Application Header Bar */}
      <header className="login-top-bar">
        <div className="login-brand-group">
          <img 
            src="/images/team-everest-logo.png" 
            alt="Team Everest Logo" 
            className="team-everest-header-logo" 
          />
          <div className="login-brand-titles">
            <span className="login-brand-name">Team Everest</span>
            <span className="login-brand-portal">Resume Review Portal</span>
          </div>
        </div>

        {isAuthenticated && volunteer && volunteer.name && (
          <div className="login-header-right">
            <div className="login-header-bell" title="Notifications">
              <Bell size={16} />
              <span className="login-header-bell-dot"></span>
            </div>
            <div className="login-header-profile">
              <div className="login-header-avatar">
                {volunteer.avatar ? (
                  <img src={volunteer.avatar} alt={volunteer.name} />
                ) : (
                  <span>{volunteer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="login-header-user-info">
                <span className="login-header-user-name">{volunteer.name}</span>
                <span className="login-header-user-role">{volunteer.role || 'Volunteer'}</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Split-Screen Stage */}
      <main className="login-main-stage">
        <div className="login-split-container">
          
          {/* =========================================================
              LEFT SIDE: Welcome Animation Slideshow
              ========================================================= */}
          <section 
            className={`login-carousel-pane ${step === 'carousel' ? 'welcome-fullwidth' : 'login-column-mode mobile-hidden'}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            aria-label="Welcome Presentation Carousel"
          >
            <div className="carousel-card">
              {/* Card Header: Journey Switcher + Skip */}
              <div className="carousel-header-row">
                <div className="carousel-journey-toggle" role="tablist" aria-label="Journey Switcher">
                  <button 
                    type="button" 
                    className={`carousel-journey-btn ${role === 'volunteer' ? 'active' : ''}`}
                    onClick={() => handleRoleChange('volunteer')}
                    role="tab"
                    aria-selected={role === 'volunteer'}
                  >
                    <GraduationCap size={13} />
                    <span>Volunteer Journey</span>
                  </button>
                  <button 
                    type="button" 
                    className={`carousel-journey-btn ${role === 'student' ? 'active' : ''}`}
                    onClick={() => handleRoleChange('student')}
                    role="tab"
                    aria-selected={role === 'student'}
                  >
                    <User size={13} />
                    <span>Student Journey</span>
                  </button>
                </div>

                <div className="carousel-header-right-actions">
                  <button 
                    type="button" 
                    className="carousel-mobile-skip-btn"
                    onClick={() => {
                      setStep('login');
                      setTimeout(() => inputRefs.current[0]?.focus(), 60);
                    }}
                    title="Skip to login"
                    aria-label="Skip to login"
                  >
                    <span>Skip</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Dynamic Slide Content */}
              <div className="carousel-body">
                <div key={`${role}-${currentSlide.id}`} className={`carousel-slide-content anim-${currentSlide.animType}`}>
                  <h1 className="slide-heading">
                    {currentSlide.headingStart}
                    <span className="yellow-accent">{currentSlide.headingHighlight}</span>
                  </h1>
                  <p className="slide-description">{currentSlide.description}</p>

                  {/* Slide Visual Presentation with complete realistic photo */}
                  <div className="slide-visual-stage">
                    <img 
                      key={`slide-img-${role}-${currentSlide.id}`}
                      src={currentSlide.image} 
                      alt={currentSlide.alt} 
                      className={`slide-photo anim-${currentSlide.animType}`} 
                      onError={(e) => {
                        console.warn(`[LoginView] Image failed to load: ${currentSlide.image}`);
                      }}
                    />
                  </div>
                </div>

                {/* 3 Core Highlight Badges at Bottom of Slide */}
                <div className="slide-feature-bar">
                  <div className="feature-item-card">
                    <div className="feature-icon-circle yellow">
                      <FileText size={15} />
                    </div>
                    <div className="feature-item-text">
                      <span className="feature-item-title">Highlight Key Sections</span>
                      <span className="feature-item-sub">Help students improve</span>
                    </div>
                  </div>

                  <div className="feature-item-card">
                    <div className="feature-icon-circle teal">
                      <MessageSquare size={15} />
                    </div>
                    <div className="feature-item-text">
                      <span className="feature-item-title">Share Feedback</span>
                      <span className="feature-item-sub">Guide with actionable inputs</span>
                    </div>
                  </div>

                  <div className="feature-item-card">
                    <div className="feature-icon-circle blue">
                      <ShieldCheck size={15} />
                    </div>
                    <div className="feature-item-text">
                      <span className="feature-item-title">Approve Resumes</span>
                      <span className="feature-item-sub">Make a real impact</span>
                    </div>
                  </div>
                </div>

                {/* 4 Pagination Dots */}
                <div className="carousel-dots-row">
                  {slides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      className={`carousel-dot-btn ${activeSlide === idx ? 'active' : ''}`}
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Bottom Navigation: Get Started */}
                <div className="carousel-mobile-footer">
                  <button 
                    type="button" 
                    className="carousel-action-btn primary full-width get-started-btn"
                    onClick={() => {
                      setStep('login');
                      setTimeout(() => inputRefs.current[0]?.focus(), 60);
                    }}
                  >
                    <span className="btn-cover-overlay" aria-hidden="true" />
                    <span className="btn-text">Get Started</span>
                    <span className="btn-icon-circle" aria-hidden="true">
                      <ArrowRight size={15} className="btn-icon-svg" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              OTP LOGIN: Elevated White Login Card (~40%)
              ========================================================= */}
          {step === 'login' && (
            <section className="login-form-pane">
              <div className="login-card">
                
                {/* Top Navigation Row inside Card */}
                <div className="login-card-top-nav">
                  {/* Segmented Role Switcher */}
                  <div className="login-role-tabs">
                    <button 
                      type="button"
                      className={`login-role-tab ${role === 'volunteer' ? 'active' : ''}`}
                      onClick={() => handleRoleChange('volunteer')}
                    >
                      <GraduationCap size={14} />
                      <span>Volunteer</span>
                    </button>
                    <button 
                      type="button"
                      className={`login-role-tab ${role === 'student' ? 'active' : ''}`}
                      onClick={() => handleRoleChange('student')}
                    >
                      <User size={14} />
                      <span>Student</span>
                    </button>
                  </div>
                </div>

              {/* Profile Avatar: Volunteer avatar for volunteer, realistic student photo for student */}
              <div className="login-avatar-stage">
                <img 
                  src={role === 'volunteer' ? "/images/login-carousel/avatar.png" : "/images/login-carousel/student-slide4.jpg"} 
                  alt={role === 'volunteer' ? "Team Everest Volunteer Avatar" : "Team Everest Student"} 
                  className={`login-avatar-img ${role === 'student' ? 'student-avatar' : ''}`}
                  onError={(e) => {
                    // Fallback to stylized SVG avatar if image is unavailable
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <h2 className="login-card-title">
                {role === 'volunteer' ? 'Volunteer Login' : 'Student Verification'}
              </h2>
              <p className="login-card-prompt">
                {role === 'volunteer' 
                  ? 'Enter your 6-character OTP to continue' 
                  : 'Enter your 6-digit Student OTP to view your resume changes'}
              </p>

              {errorMessage && (
                <div className="login-error-alert">
                  <WarningTriangleIcon size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}



              {/* Form with OTP inputs */}
              <form onSubmit={handleSubmit}>
                <div 
                  ref={wrapperRef}
                  className={`otp-inputs-wrapper ${animState === 'verifying' ? 'is-verifying' : ''} ${animState === 'success' ? 'is-success' : ''} ${animState === 'error' ? 'is-error' : ''}`} 
                  onPaste={handlePaste}
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
                          style={{ '--tx': tx, '--ty': ty } as React.CSSProperties}
                          onChange={(e) => handleChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          autoFocus={idx === 0}
                          aria-label={`OTP Character ${idx + 1}`}
                        />
                      );
                    })}
                  </div>

                  {animState === 'success' && (
                    <div className="otp-success-badge-container">
                      <div className="otp-success-badge">
                        <div className="otp-success-ring"></div>
                        <div className="otp-success-icon">
                          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
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
                  className="btn-login-submit"
                  disabled={isLoading}
                  style={isLoading ? { opacity: 0.85, cursor: 'not-allowed' } : {}}
                >
                  <span>
                    {animState === 'success' 
                      ? 'Verified' 
                      : (role === 'volunteer' ? 'Verify & Login' : 'View My Resume Changes')}
                  </span>
                  {!isLoading && <ArrowRight size={16} className="btn-arrow-icon" />}
                  {animState === 'success' && <Check size={16} />}
                </button>

                {/* OR Divider matching reference */}
                <div className="login-or-divider">
                  <span>OR</span>
                </div>

                {/* Information Callout Card matching reference */}
                <div className="login-info-card">
                  <div className="login-info-icon">
                    <Clock size={16} />
                  </div>
                  <div className="login-info-text">
                    Enter the same 6-character OTP shared with you by Team Everest.
                  </div>
                </div>

                {/* Need Help Footer Link */}
                <div>
                  <a 
                    href="#help" 
                    className="login-need-help-link"
                    onClick={(e) => {
                      e.preventDefault();
                      if (role === 'volunteer') {
                        alert('Volunteer Verification:\nEnter the 6-character code (e.g. GE7084) assigned to you by Team Everest to access the reviewer workspace.');
                      } else {
                        alert('Student Verification:\nEnter your 6-digit code (e.g. 101010 for Arun Kumar) or click on any profile above.');
                      }
                    }}
                  >
                    <HelpCircle size={14} />
                    <span>Need help? Please reach out to the Team Everest team.</span>
                  </a>
                </div>


              </form>
            </div>
          </section>
        )}

        </div>
      </main>
    </div>
  );
};
