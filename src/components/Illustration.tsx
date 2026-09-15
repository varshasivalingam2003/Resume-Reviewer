import React, { useState, useEffect } from 'react';

export const LoginIllustration: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1); // 1: Upload, 2: Review, 3: Approved
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev % 3) + 1);
    }, 3800);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleStepClick = (step: number) => {
    setActiveStep(step);
    setIsAutoPlaying(false);
  };

  return (
    <div className="review-animation-card">
      {/* Studio Window Bar with Mac-style Dots and Status */}
      <div className="review-anim-header">
        <div className="review-studio-left">
          <div className="window-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <div className="review-anim-badge">
            <span className="review-anim-pulse-dot"></span>
            <span>LIVE RESUME EVALUATION PIPELINE</span>
          </div>
        </div>
        <div className="review-studio-right">
          <button 
            type="button" 
            className="anim-play-toggle-btn"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            title={isAutoPlaying ? "Pause simulation" : "Resume auto-play"}
          >
            {isAutoPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <span className="review-anim-counter">Phase {activeStep} / 3</span>
        </div>
      </div>

      {/* Main Animated SVG Canvas */}
      <div className="review-anim-stage">
        <svg 
          className="review-anim-svg" 
          viewBox="0 0 580 225" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Ambient Background Decor */}
          <circle cx="95" cy="112" r="85" fill="#FEF08A" fillOpacity="0.25" />
          <circle cx="475" cy="112" r="85" fill="#FEF9C3" fillOpacity="0.45" />
          <line x1="20" y1="208" x2="560" y2="208" stroke="#E2E8F0" strokeWidth="1.2" strokeDasharray="5 5" />

          {/* ========================================================
              CONNECTING PIPELINE STREAM (Student ➔ Volunteer)
              ======================================================== */}
          <path 
            d="M 180 114 C 235 62, 310 62, 365 114" 
            stroke="#CBD5E1" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            className="anim-transfer-stream"
          />

          {/* Transferring Document Particle in Center */}
          <g transform="translate(258, 68)" className="anim-transfer-doc">
            <rect 
              width="36" 
              height="46" 
              rx="5" 
              fill="#FFFFFF" 
              stroke="#FACC15" 
              strokeWidth="2" 
              filter="drop-shadow(0 6px 12px rgba(234,179,8,0.22))" 
            />
            <rect x="7" y="7" width="15" height="3.5" rx="1.5" fill="#EF4444" />
            <rect x="7" y="15" width="22" height="2.5" rx="1.2" fill="#94A3B8" />
            <rect x="7" y="21" width="18" height="2.5" rx="1.2" fill="#FEF08A" />
            <rect x="7" y="27" width="20" height="2.5" rx="1.2" fill="#94A3B8" />
            <polygon points="15,36 21,36 18,31" fill="#10B981" />
          </g>

          <text x="273" y="146" fontSize="10.5" fontWeight="700" fill="#94A3B8" textAnchor="middle" letterSpacing="0.3">
            Real-time Sync →
          </text>

          {/* ========================================================
              LEFT SIDE: STUDENT UPLOADING RESUME
              ======================================================== */}
          <g transform="translate(10, 8)">
            {/* Clean Section Header Text */}
            <text x="95" y="18" fontSize="13" fontWeight="800" fill="#1E40AF" textAnchor="middle">
              🎓 Student Workspace
            </text>

            {/* Student Character Figure */}
            <g transform="translate(20, 22)">
              {/* Torso & Hoodie */}
              <path d="M 40 100 C 40 74 50 58 70 58 C 90 58 100 74 100 100 Z" fill="#3B82F6" />
              <path d="M 60 58 C 63 67 77 67 80 58" stroke="#1D4ED8" strokeWidth="2.5" />

              {/* Arms Typing */}
              <path d="M 44 86 C 54 96 68 97 77 97" stroke="#FED7AA" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M 96 86 C 86 96 72 97 63 97" stroke="#FED7AA" strokeWidth="5.5" strokeLinecap="round" />

              {/* Head & Graduation Cap */}
              <circle cx="70" cy="38" r="18" fill="#FED7AA" />
              <path d="M 52 32 C 52 22 62 19 70 19 C 78 19 88 22 88 32 Z" fill="#1E293B" />
              {/* Graduation Cap */}
              <polygon points="70,10 46,20 70,26 94,20" fill="#0F172A" />
              <polygon points="70,25 66,32 74,32" fill="#F59E0B" />

              {/* Eyes & Smile */}
              <circle cx="64" cy="37" r="1.8" fill="#78350F" />
              <circle cx="76" cy="37" r="1.8" fill="#78350F" />
              <path d="M 66 44 Q 70 48 74 44" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" fill="none" />

              {/* Laptop with Upload Screen */}
              <g transform="translate(32, 78)">
                <rect x="8" y="6" width="60" height="38" rx="4" fill="#1E293B" />
                <rect x="11" y="9" width="54" height="32" rx="2" fill="#0F172A" />
                
                {/* Upload Cloud on Laptop Screen */}
                <g transform="translate(30, 14)" className="anim-upload-cloud">
                  <path d="M 4 10 C 2 10 0 8 0 6 C 0 4 2 2 4 2 C 5 1 7 0 9 0 C 13 0 15 2 16 5 C 17 5 18 6 18 8 C 18 10 16 10 14 10 Z" fill="#60A5FA" />
                  <path d="M 9 10 L 9 4 M 7 6 L 9 4 L 11 6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>

                {/* Progress bar on Laptop Screen */}
                <rect x="16" y="30" width="44" height="4" rx="2" fill="#334155" />
                <rect x="16" y="30" width="36" height="4" rx="2" fill="#10B981" />

                {/* Base of laptop */}
                <polygon points="0,44 76,44 80,49 -4,49" fill="#94A3B8" />
              </g>
            </g>

            {/* Simple Clean Status Text Below Student */}
            <text x="95" y="174" fontSize="11.5" fontWeight="700" fill="#059669" textAnchor="middle">
              ✓ Resume Uploaded
            </text>
          </g>

          {/* ========================================================
              RIGHT SIDE: VOLUNTEER REVIEWING
              ======================================================== */}
          <g transform="translate(365, 8)">
            {/* Clean Section Header Text */}
            <text x="100" y="18" fontSize="13" fontWeight="800" fill="#854D0E" textAnchor="middle">
              🧑‍🏫 Volunteer Review
            </text>

            {/* Volunteer Monitor Display */}
            <g transform="translate(30, 22)">
              {/* Stand */}
              <rect x="58" y="112" width="24" height="14" fill="#94A3B8" rx="2" />
              <ellipse cx="70" cy="128" rx="28" ry="4" fill="#64748B" />

              {/* Monitor Frame */}
              <rect 
                x="0" 
                y="6" 
                width="140" 
                height="106" 
                rx="7" 
                fill="#1E293B" 
                stroke="#334155" 
                strokeWidth="2" 
                filter="drop-shadow(0 12px 24px rgba(0,0,0,0.12))" 
              />
              <rect x="5" y="11" width="130" height="96" rx="5" fill="#FFFFFF" />

              {/* Resume Header on Monitor */}
              <rect x="12" y="18" width="44" height="5" rx="1.5" fill="#0F172A" />
              <rect x="60" y="19" width="56" height="3.5" rx="1.5" fill="#94A3B8" />
              <line x1="12" y1="28" x2="124" y2="28" stroke="#E2E8F0" strokeWidth="1" />

              {/* Section 1: Objective */}
              <rect x="12" y="34" width="26" height="3" rx="1" fill="#64748B" />
              <rect x="12" y="40" width="98" height="2.5" rx="1" fill="#CBD5E1" />
              
              {/* Section 2: HIGHLIGHTED SUBTOPIC (Soft Yellow) */}
              <g>
                <rect 
                  x="10" 
                  y="46" 
                  width="120" 
                  height="22" 
                  rx="4" 
                  className="anim-highlight-rect" 
                />
                <text x="15" y="58" fontSize="7.5" fontWeight="800" fill="#854D0E">✦ Projective Skills & Metrics</text>
                <rect x="15" y="62" width="72" height="2.5" rx="1" fill="#CA8A04" />

                {/* Animated Highlighter Pen Sweeping */}
                <g className="anim-highlighter-pen" transform="translate(48, 38)">
                  <polygon points="4,2 14,2 10,15" fill="#FACC15" />
                  <rect x="6" y="0" width="6" height="8" rx="1" fill="#EAB308" />
                  <circle cx="9" cy="15" r="1.5" fill="#CA8A04" />
                </g>
              </g>

              {/* Section 3: Education & Experience */}
              <rect x="12" y="74" width="32" height="3" rx="1" fill="#64748B" />
              <rect x="12" y="81" width="94" height="2" rx="1" fill="#CBD5E1" />
              <rect x="12" y="86" width="80" height="2" rx="1" fill="#CBD5E1" />

              {/* Stamp of Approval / Feedback (visible on Step 3) */}
              {activeStep === 3 && (
                <g transform="translate(82, 68)" className="anim-approved-stamp">
                  <circle cx="18" cy="18" r="17" fill="#10B981" />
                  <circle cx="18" cy="18" r="14" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 2" />
                  <path d="M 12 18 L 16 22 L 24 14" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="18" y="28" fontSize="4.5" fontWeight="900" fill="#10B981" textAnchor="middle">APPROVED</text>
                </g>
              )}
            </g>

            {/* Simple Clean Volunteer Command Text */}
            <text x="100" y="174" fontSize="11" fontWeight="700" fill="#78350F" textAnchor="middle">
              💬 Volunteer Command:
            </text>
            <text x="100" y="190" fontSize="10.5" fontWeight="600" fill="#854D0E" textAnchor="middle">
              "Add impact metrics to projects"
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Step Timeline Controls */}
      <div className="review-anim-controls">
        <button 
          type="button" 
          className={`anim-step-btn ${activeStep === 1 ? 'active' : ''}`}
          onClick={() => handleStepClick(1)}
        >
          <span>📤 1. Upload Resume</span>
        </button>
        <button 
          type="button" 
          className={`anim-step-btn ${activeStep === 2 ? 'active' : ''}`}
          onClick={() => handleStepClick(2)}
        >
          <span>✏️ 2. Review & Highlight</span>
        </button>
        <button 
          type="button" 
          className={`anim-step-btn ${activeStep === 3 ? 'active' : ''}`}
          onClick={() => handleStepClick(3)}
        >
          <span>🏆 3. Resume Reviewed</span>
        </button>
      </div>

      {/* Live Descriptive Caption */}
      <div className="review-anim-caption">
        <span className="caption-badge">Phase {activeStep}</span>
        <span>
          {activeStep === 1 && "Student uploads resume with career goals and target role interests."}
          {activeStep === 2 && "Volunteer mentor annotates sections with soft yellow highlights and actionable commands."}
          {activeStep === 3 && "Student resolves corrections, clears checklist, and receives final resume review."}
        </span>
      </div>
    </div>
  );
};
