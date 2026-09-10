import React, { useState, useEffect } from 'react';

export const LoginIllustration: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1); // 1: Upload, 2: Review, 3: Approved
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    // Auto-advance through the workflow steps every 3.8 seconds
    const interval = setInterval(() => {
      setActiveStep(prev => (prev % 3) + 1);
    }, 3800);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleStepClick = (step: number) => {
    setActiveStep(step);
    // Pause auto-playing on user interaction so they can inspect
    setIsAutoPlaying(false);
  };

  return (
    <div className="review-animation-card">
      {/* Header with live interactive status and play toggle */}
      <div className="review-anim-header">
        <div className="review-anim-badge">
          <span className="review-anim-pulse-dot"></span>
          <span>INTERACTIVE RESUME WORKFLOW</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            type="button" 
            className="anim-play-toggle-btn"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            title={isAutoPlaying ? "Click to pause animation" : "Click to auto-play animation"}
          >
            {isAutoPlaying ? "⏸ Pause" : "▶ Auto-Play"}
          </button>
          <span className="review-anim-counter">Step {activeStep} of 3</span>
        </div>
      </div>

      {/* Main Animated SVG Canvas */}
      <div className="review-anim-stage">
        <svg 
          className="review-anim-svg" 
          viewBox="0 0 460 220" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Ambient Decor */}
          <circle cx="90" cy="110" r="70" fill="#FEF08A" fillOpacity="0.25" />
          <circle cx="370" cy="110" r="70" fill="#FEF9C3" fillOpacity="0.5" />
          <path d="M 0 195 Q 230 205 460 195" stroke="#E2E8F0" strokeWidth="1.5" />

          {/* ========================================================
              CONNECTING PIPELINE STREAM (Student ➔ Volunteer)
              ======================================================== */}
          <path 
            d="M 160 100 C 210 60, 250 60, 300 100" 
            stroke="#CBD5E1" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            className="anim-transfer-stream"
          />

          {/* Transferring Document Particle in Center */}
          <g transform="translate(215, 62)">
            <rect width="30" height="38" rx="4" fill="#FFFFFF" stroke="#FACC15" strokeWidth="1.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.08))" />
            <rect x="5" y="6" width="14" height="3" rx="1.5" fill="#EF4444" />
            <rect x="5" y="13" width="20" height="2" rx="1" fill="#94A3B8" />
            <rect x="5" y="18" width="16" height="2" rx="1" fill="#FEF08A" />
            <rect x="5" y="23" width="18" height="2" rx="1" fill="#94A3B8" />
            <polygon points="12,30 18,30 15,26" fill="#10B981" />
          </g>

          {/* ========================================================
              LEFT SIDE: STUDENT UPLOADING RESUME
              ======================================================== */}
          <g transform="translate(25, 30)">
            {/* Student Label Pill */}
            <rect x="25" y="0" width="80" height="18" rx="9" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
            <text x="65" y="13" fontSize="9.5" fontWeight="700" fill="#334155" textAnchor="middle">🎓 Student</text>

            {/* Student Character Figure */}
            <g transform="translate(15, 45)">
              {/* Torso & Hoodie */}
              <path d="M 25 90 C 25 65 35 48 55 48 C 75 48 85 65 85 90 Z" fill="#3B82F6" />
              <path d="M 45 48 C 48 56 62 56 65 48" stroke="#1D4ED8" strokeWidth="2" />

              {/* Arms Typing */}
              <path d="M 28 75 C 38 85 52 86 60 86" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />
              <path d="M 82 75 C 72 85 58 86 50 86" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />

              {/* Head & Graduation Cap */}
              <circle cx="55" cy="30" r="18" fill="#FED7AA" />
              <path d="M 37 25 C 37 15 48 12 55 12 C 65 12 73 18 73 25 Z" fill="#1E293B" />
              {/* Graduation Cap */}
              <polygon points="55,2 32,12 55,18 78,12" fill="#0F172A" />
              <polygon points="55,16 52,24 58,24" fill="#F59E0B" />

              {/* Laptop with Upload Screen */}
              <g transform="translate(18, 70)">
                <rect x="10" y="8" width="54" height="34" rx="3" fill="#1E293B" />
                <rect x="13" y="11" width="48" height="28" rx="2" fill="#0F172A" />
                
                {/* Upload Cloud on Laptop Screen */}
                <g transform="translate(28, 16)" className="anim-upload-cloud">
                  <path d="M 4 10 C 2 10 0 8 0 6 C 0 4 2 2 4 2 C 5 1 7 0 9 0 C 13 0 15 2 16 5 C 17 5 18 6 18 8 C 18 10 16 10 14 10 Z" fill="#60A5FA" />
                  <path d="M 9 10 L 9 4 M 7 6 L 9 4 L 11 6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>

                {/* Progress bar on Laptop Screen */}
                <rect x="18" y="29" width="38" height="4" rx="2" fill="#334155" />
                <rect x="18" y="29" width="28" height="4" rx="2" fill="#10B981" />

                <polygon points="2,42 72,42 76,46 0,46" fill="#94A3B8" />
              </g>
            </g>

            {/* Floating Uploading Document Card */}
            <g transform="translate(85, 25)" className="anim-student-resume">
              <rect width="64" height="84" rx="6" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" filter="drop-shadow(0 8px 16px rgba(59,130,246,0.18))" />
              {/* PDF Header Tag */}
              <rect x="6" y="6" width="20" height="6" rx="2" fill="#EF4444" />
              <text x="16" y="11" fontSize="4.5" fontWeight="900" fill="#FFFFFF" textAnchor="middle">PDF</text>
              <rect x="30" y="7" width="28" height="3" rx="1.5" fill="#0F172A" />
              
              {/* Skeleton Document Lines */}
              <rect x="6" y="17" width="52" height="2" rx="1" fill="#CBD5E1" />
              <rect x="6" y="23" width="44" height="2" rx="1" fill="#E2E8F0" />
              <rect x="6" y="28" width="48" height="2" rx="1" fill="#E2E8F0" />
              
              {/* Subtopic 1 */}
              <rect x="6" y="36" width="28" height="4" rx="2" fill="#FEF08A" stroke="#EAB308" strokeWidth="0.8" />
              <rect x="6" y="44" width="50" height="2" rx="1" fill="#E2E8F0" />
              <rect x="6" y="49" width="42" height="2" rx="1" fill="#E2E8F0" />

              {/* Upload Badge */}
              <g transform="translate(10, 58)">
                <rect width="44" height="16" rx="4" fill="#ECFDF5" stroke="#10B981" strokeWidth="1" />
                <circle cx="10" cy="8" r="4" fill="#10B981" />
                <path d="M 8 8 L 10 10 L 12 6" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                <text x="18" y="11" fontSize="6.5" fontWeight="800" fill="#065F46">Upload 100%</text>
              </g>
            </g>
          </g>

          {/* ========================================================
              RIGHT SIDE: VOLUNTEER REVIEWING & HIGHLIGHTING
              ======================================================== */}
          <g transform="translate(290, 30)">
            {/* Volunteer Reviewer Label Pill */}
            <rect x="25" y="0" width="86" height="18" rx="9" fill="#FEF9C3" stroke="#FDE047" strokeWidth="1" />
            <text x="68" y="13" fontSize="9.5" fontWeight="700" fill="#854D0E" textAnchor="middle">🧑‍🏫 Volunteer</text>

            {/* Volunteer Desk & Large Monitor */}
            <g transform="translate(5, 30)">
              {/* Monitor Display Stand */}
              <rect x="42" y="105" width="20" height="14" fill="#94A3B8" />
              <ellipse cx="52" cy="120" rx="22" ry="4" fill="#64748B" />

              {/* Monitor Screen Frame */}
              <rect x="0" y="15" width="104" height="92" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="2" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.1))" />
              <rect x="4" y="19" width="96" height="84" rx="4" fill="#FFFFFF" />

              {/* Resume Header on Monitor */}
              <rect x="10" y="25" width="34" height="5" rx="2" fill="#0F172A" />
              <rect x="48" y="26" width="46" height="3" rx="1.5" fill="#94A3B8" />
              <line x1="10" y1="34" x2="94" y2="34" stroke="#E2E8F0" strokeWidth="1" />

              {/* Section 1: Objective */}
              <rect x="10" y="38" width="22" height="3" rx="1.5" fill="#64748B" />
              <rect x="10" y="44" width="76" height="2" rx="1" fill="#CBD5E1" />
              
              {/* Section 2: HIGHLIGHTED SUBTOPIC (Soft Yellow) */}
              <g>
                <rect 
                  x="8" 
                  y="50" 
                  width="86" 
                  height="18" 
                  rx="4" 
                  className="anim-highlight-rect" 
                />
                <text x="12" y="60" fontSize="5.5" fontWeight="800" fill="#854D0E">✦ Projective Skills</text>
                <rect x="12" y="63" width="56" height="2" rx="1" fill="#CA8A04" />

                {/* Animated Highlighter Pen Sweeping */}
                <g className="anim-highlighter-pen" transform="translate(35, 42)">
                  <polygon points="4,2 14,2 10,14" fill="#FACC15" />
                  <rect x="6" y="0" width="6" height="8" rx="1" fill="#EAB308" />
                  <circle cx="9" cy="14" r="1.5" fill="#CA8A04" />
                </g>
              </g>

              {/* Section 3: Education & Experience */}
              <rect x="10" y="73" width="26" height="3" rx="1.5" fill="#64748B" />
              <rect x="10" y="79" width="70" height="2" rx="1" fill="#CBD5E1" />
              <rect x="10" y="84" width="62" height="2" rx="1" fill="#CBD5E1" />

              {/* Stamp of Approval / Feedback */}
              <g transform="translate(62, 70)" className="anim-approved-stamp">
                <circle cx="16" cy="16" r="15" fill="#10B981" />
                <circle cx="16" cy="16" r="13" fill="#FFFFFF" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M 11 16 L 14 19 L 21 12" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>

            {/* Floating Mentor Comment Callout Bubble */}
            <g transform="translate(-18, 98)" className="anim-comment-bubble">
              <rect width="90" height="36" rx="6" fill="#FFFBEB" stroke="#EAB308" strokeWidth="1.5" filter="drop-shadow(0 4px 10px rgba(234,179,8,0.22))" />
              <polygon points="76,36 82,42 80,36" fill="#FFFBEB" stroke="#EAB308" strokeWidth="1" />
              <circle cx="10" cy="12" r="4" fill="#FACC15" />
              <text x="9" y="14.5" fontSize="6.5" fontWeight="900" fill="#713F12">💬</text>
              <text x="18" y="13" fontSize="6.5" fontWeight="800" fill="#713F12">Volunteer Command:</text>
              <text x="8" y="23" fontSize="6" fontWeight="600" fill="#854D0E">"Add quantified impact metrics</text>
              <text x="8" y="30" fontSize="6" fontWeight="600" fill="#854D0E">to your project achievements."</text>
            </g>
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
          <span>✅ 3. Placement Approved</span>
        </button>
      </div>

      {/* Live Descriptive Caption */}
      <div className="review-anim-caption">
        {activeStep === 1 && "Stage 1: Student uploads resume with unique interest subtopics."}
        {activeStep === 2 && "Stage 2: Volunteer mentor reviews, highlights in soft yellow & adds commands."}
        {activeStep === 3 && "Stage 3: Student receives annotated feedback and verifies via Student OTP."}
      </div>
    </div>
  );
};
