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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

      {/* Main Animated SVG Canvas - Spacious, accommodated in bigger size */}
      <div className="review-anim-stage">
        <svg 
          className="review-anim-svg" 
          viewBox="0 0 580 250" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Ambient Decor */}
          <circle cx="110" cy="125" r="95" fill="#FEF08A" fillOpacity="0.28" />
          <circle cx="470" cy="125" r="95" fill="#FEF9C3" fillOpacity="0.45" />
          <path d="M 0 226 Q 290 236 580 226" stroke="#E2E8F0" strokeWidth="1.5" />

          {/* ========================================================
              CONNECTING PIPELINE STREAM (Student ➔ Volunteer)
              ======================================================== */}
          <path 
            d="M 218 118 C 265 62, 305 62, 355 118" 
            stroke="#CBD5E1" 
            strokeWidth="3" 
            strokeLinecap="round" 
            className="anim-transfer-stream"
          />

          {/* Transferring Document Particle in Center */}
          <g transform="translate(268, 70)" className="anim-transfer-doc">
            <rect 
              width="36" 
              height="46" 
              rx="5" 
              fill="#FFFFFF" 
              stroke="#FACC15" 
              strokeWidth="2" 
              filter="drop-shadow(0 6px 10px rgba(234,179,8,0.22))" 
            />
            <rect x="7" y="7" width="16" height="4" rx="2" fill="#EF4444" />
            <rect x="7" y="15" width="22" height="2.5" rx="1.2" fill="#94A3B8" />
            <rect x="7" y="21" width="18" height="2.5" rx="1.2" fill="#FEF08A" />
            <rect x="7" y="27" width="20" height="2.5" rx="1.2" fill="#94A3B8" />
            <polygon points="15,37 21,37 18,32" fill="#10B981" />
          </g>

          {/* ========================================================
              LEFT SIDE: STUDENT UPLOADING RESUME
              ======================================================== */}
          <g transform="translate(16, 20)">
            {/* Student Label Pill - Placed cleanly at the top */}
            <rect x="25" y="0" width="94" height="22" rx="11" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.2" />
            <text x="72" y="15" fontSize="11" fontWeight="700" fill="#1E40AF" textAnchor="middle">🎓 Student</text>

            {/* Student Character Figure */}
            <g transform="translate(10, 48)">
              {/* Torso & Hoodie */}
              <path d="M 24 102 C 24 72 36 54 58 54 C 80 54 92 72 92 102 Z" fill="#3B82F6" />
              <path d="M 47 54 C 50 64 66 64 69 54" stroke="#1D4ED8" strokeWidth="2.5" />

              {/* Arms Typing */}
              <path d="M 28 86 C 40 98 56 99 66 99" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />
              <path d="M 88 86 C 76 98 60 99 50 99" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />

              {/* Head & Graduation Cap */}
              <circle cx="58" cy="34" r="20" fill="#FED7AA" />
              <path d="M 38 28 C 38 16 50 13 58 13 C 68 13 78 16 78 28 Z" fill="#1E293B" />
              {/* Graduation Cap */}
              <polygon points="58,4 32,15 58,22 84,15" fill="#0F172A" />
              <polygon points="58,20 54,28 62,28" fill="#F59E0B" />

              {/* Eyes & Smile */}
              <circle cx="51" cy="33" r="2" fill="#78350F" />
              <circle cx="65" cy="33" r="2" fill="#78350F" />
              <path d="M 53 41 Q 58 45 63 41" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" fill="none" />

              {/* Laptop with Upload Screen */}
              <g transform="translate(18, 76)">
                <rect x="10" y="8" width="60" height="38" rx="4" fill="#1E293B" />
                <rect x="13" y="11" width="54" height="32" rx="2" fill="#0F172A" />
                
                {/* Upload Cloud on Laptop Screen */}
                <g transform="translate(32, 16)" className="anim-upload-cloud">
                  <path d="M 4 10 C 2 10 0 8 0 6 C 0 4 2 2 4 2 C 5 1 7 0 9 0 C 13 0 15 2 16 5 C 17 5 18 6 18 8 C 18 10 16 10 14 10 Z" fill="#60A5FA" />
                  <path d="M 9 10 L 9 4 M 7 6 L 9 4 L 11 6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>

                {/* Progress bar on Laptop Screen */}
                <rect x="18" y="32" width="44" height="4" rx="2" fill="#334155" />
                <rect x="18" y="32" width="34" height="4" rx="2" fill="#10B981" />

                {/* Base of laptop */}
                <polygon points="2,46 78,46 82,51 0,51" fill="#94A3B8" />
              </g>
            </g>

            {/* Floating Uploading Document Card - Positioned beside student with zero collision */}
            <g transform="translate(122, 34)" className="anim-student-resume">
              <rect 
                width="72" 
                height="98" 
                rx="7" 
                fill="#FFFFFF" 
                stroke="#93C5FD" 
                strokeWidth="1.8" 
                filter="drop-shadow(0 10px 20px rgba(59,130,246,0.18))" 
              />
              {/* PDF Header Tag */}
              <rect x="7" y="7" width="24" height="8" rx="2.5" fill="#EF4444" />
              <text x="19" y="13.5" fontSize="6.5" fontWeight="900" fill="#FFFFFF" textAnchor="middle">PDF</text>
              <rect x="35" y="9" width="30" height="4" rx="2" fill="#0F172A" />
              
              {/* Skeleton Document Lines */}
              <rect x="7" y="20" width="58" height="2.5" rx="1.2" fill="#CBD5E1" />
              <rect x="7" y="27" width="50" height="2.5" rx="1.2" fill="#E2E8F0" />
              <rect x="7" y="33" width="54" height="2.5" rx="1.2" fill="#E2E8F0" />
              
              {/* Subtopic Highlight Indicator */}
              <rect x="7" y="41" width="40" height="6" rx="2.5" fill="#FEF08A" stroke="#EAB308" strokeWidth="1" />
              <text x="27" y="45.5" fontSize="4.5" fontWeight="800" fill="#854D0E" textAnchor="middle">Subtopic Area</text>
              <rect x="7" y="51" width="58" height="2.5" rx="1.2" fill="#E2E8F0" />
              <rect x="7" y="57" width="46" height="2.5" rx="1.2" fill="#E2E8F0" />

              {/* Upload 100% Badge */}
              <g transform="translate(8, 68)">
                <rect width="56" height="20" rx="5" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.2" />
                <circle cx="12" cy="10" r="5" fill="#10B981" />
                <path d="M 9.5 10 L 11.5 12.5 L 14.5 7.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                <text x="21" y="13.5" fontSize="7.5" fontWeight="800" fill="#065F46">Upload 100%</text>
              </g>
            </g>
          </g>

          {/* ========================================================
              RIGHT SIDE: VOLUNTEER REVIEWING & HIGHLIGHTING
              ======================================================== */}
          <g transform="translate(340, 20)">
            {/* Volunteer Reviewer Label Pill */}
            <rect x="90" y="0" width="120" height="22" rx="11" fill="#FEF9C3" stroke="#FDE047" strokeWidth="1.2" />
            <text x="150" y="15" fontSize="11" fontWeight="700" fill="#854D0E" textAnchor="middle">🧑‍🏫 Volunteer Review</text>

            {/* Volunteer Desk & Large Monitor */}
            <g transform="translate(45, 34)">
              {/* Monitor Display Stand */}
              <rect x="58" y="128" width="26" height="18" fill="#94A3B8" rx="2" />
              <ellipse cx="71" cy="148" rx="32" ry="5" fill="#64748B" />

              {/* Monitor Screen Frame */}
              <rect 
                x="0" 
                y="10" 
                width="142" 
                height="118" 
                rx="8" 
                fill="#1E293B" 
                stroke="#334155" 
                strokeWidth="2.5" 
                filter="drop-shadow(0 14px 28px rgba(0,0,0,0.12))" 
              />
              <rect x="5" y="15" width="132" height="108" rx="5" fill="#FFFFFF" />

              {/* Resume Header on Monitor */}
              <rect x="12" y="24" width="46" height="6" rx="2" fill="#0F172A" />
              <rect x="62" y="25" width="58" height="4" rx="2" fill="#94A3B8" />
              <line x1="12" y1="35" x2="126" y2="35" stroke="#E2E8F0" strokeWidth="1.2" />

              {/* Section 1: Objective */}
              <rect x="12" y="41" width="30" height="4" rx="2" fill="#64748B" />
              <rect x="12" y="48" width="102" height="2.5" rx="1.2" fill="#CBD5E1" />
              
              {/* Section 2: HIGHLIGHTED SUBTOPIC (Soft Yellow) */}
              <g>
                <rect 
                  x="10" 
                  y="55" 
                  width="122" 
                  height="26" 
                  rx="5" 
                  className="anim-highlight-rect" 
                />
                <text x="16" y="68" fontSize="8" fontWeight="800" fill="#854D0E">✦ Projective Skills & Metrics</text>
                <rect x="16" y="73" width="76" height="3" rx="1.5" fill="#CA8A04" />

                {/* Animated Highlighter Pen Sweeping */}
                <g className="anim-highlighter-pen" transform="translate(50, 46)">
                  <polygon points="5,3 17,3 12,18" fill="#FACC15" />
                  <rect x="7" y="0" width="8" height="10" rx="1.5" fill="#EAB308" />
                  <circle cx="11" cy="18" r="2" fill="#CA8A04" />
                </g>
              </g>

              {/* Section 3: Education & Experience */}
              <rect x="12" y="87" width="36" height="4" rx="2" fill="#64748B" />
              <rect x="12" y="95" width="96" height="2.5" rx="1.2" fill="#CBD5E1" />
              <rect x="12" y="101" width="84" height="2.5" rx="1.2" fill="#CBD5E1" />

              {/* Stamp of Approval / Feedback */}
              <g transform="translate(86, 78)" className="anim-approved-stamp">
                <circle cx="20" cy="20" r="19" fill="#10B981" />
                <circle cx="20" cy="20" r="16" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 2" />
                <path d="M 13 20 L 18 25 L 27 15" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <text x="20" y="32" fontSize="5" fontWeight="900" fill="#10B981" textAnchor="middle">APPROVED</text>
              </g>
            </g>

            {/* Floating Mentor Comment Callout Bubble - Positioned cleanly on left of monitor */}
            <g transform="translate(-115, 62)" className="anim-comment-bubble">
              <rect 
                width="162" 
                height="54" 
                rx="8" 
                fill="#FFFBEB" 
                stroke="#EAB308" 
                strokeWidth="1.8" 
                filter="drop-shadow(0 6px 16px rgba(234,179,8,0.24))" 
              />
              {/* Pointer Tail directing right to monitor */}
              <polygon points="162,28 172,34 162,38" fill="#FFFBEB" stroke="#EAB308" strokeWidth="1.5" />
              
              <circle cx="16" cy="16" r="6" fill="#FACC15" />
              <text x="16" y="19" fontSize="8" fontWeight="900" fill="#713F12" textAnchor="middle">💬</text>
              <text x="28" y="18" fontSize="9" fontWeight="800" fill="#713F12">Volunteer Command:</text>
              <text x="12" y="32" fontSize="8.5" fontWeight="600" fill="#854D0E">"Add quantified impact metrics</text>
              <text x="12" y="44" fontSize="8.5" fontWeight="600" fill="#854D0E">to your project achievements."</text>
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
