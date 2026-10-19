import React from 'react';

const styles = `/* ==========================================================================
   Team Everest Resume Review Portal - High-End Cohesive Login UI Styles
   ========================================================================== */

/* Main Container & Layout */
.login-view {
  min-height: 100vh;
  width: 100%;
  background-color: #FAF8F2;
  background-image: 
    radial-gradient(circle at 10% 15%, rgba(255, 237, 50, 0.35) 0%, transparent 40%),
    radial-gradient(circle at 90% 85%, rgba(250, 204, 21, 0.22) 0%, transparent 45%),
    radial-gradient(rgba(202, 138, 4, 0.08) 1.2px, transparent 1.2px);
  background-size: 100% 100%, 100% 100%, 24px 24px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  font-family: inherit;
  color: #0F172A;
  overflow-x: hidden;
}

/* Top Navigation Bar */
.login-top-bar {
  width: 100%;
  padding: 16px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  box-sizing: border-box;
  z-index: 20;
}

.login-brand-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.team-everest-header-logo {
  height: 42px;
  width: auto;
  max-width: 48px;
  object-fit: contain;
  display: block;
  border-radius: 4px;
}

@media (max-width: 640px) {
  .team-everest-header-logo {
    height: 34px;
    max-width: 38px;
  }
}

.login-brand-icon {
  width: 36px;
  height: 36px;
  background: #FFED32;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0F172A;
  box-shadow: 0 2px 8px rgba(234, 179, 8, 0.3);
}

.login-brand-titles {
  display: flex;
  flex-direction: column;
}

.login-brand-name {
  font-size: 15px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.2px;
  line-height: 1.2;
}

.login-brand-portal {
  font-size: 11.5px;
  font-weight: 600;
  color: #64748B;
  letter-spacing: 0.2px;
}

.login-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.login-header-bell {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-header-bell:hover {
  background: #F8FAFC;
  color: #0F172A;
  border-color: #CBD5E1;
}

.login-header-bell-dot {
  position: absolute;
  top: 7px;
  right: 8px;
  width: 7px;
  height: 7px;
  background: #EF4444;
  border-radius: 50%;
  border: 1.5px solid #FFFFFF;
}

.login-header-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 10px 4px 4px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 30px;
}

.login-header-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #FFED32;
  color: #78350F;
  font-weight: 800;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.login-header-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-header-user-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.login-header-user-name {
  font-size: 12px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.1;
}

.login-header-user-role {
  font-size: 10px;
  font-weight: 500;
  color: #64748B;
}

/* Split Screen Main Content */
.login-main-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 28px;
  box-sizing: border-box;
  min-height: calc(100vh - 64px);
  width: 100%;
}

.login-split-container {
  display: flex;
  width: 100%;
  max-width: 1480px;
  gap: 24px;
  align-items: stretch;
  justify-content: center;
  margin: 0 auto;
  box-sizing: border-box;
}

/* ==========================================================================
   LEFT SIDE: 4-Slide Auto-Playing Visual Carousel
   ========================================================================== */
.login-carousel-pane {
  flex: 1.45;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* Desktop Welcome Animation — Full Width Mode */
.login-carousel-pane.welcome-fullwidth {
  flex: 1;
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
}

.welcome-fullwidth .carousel-card {
  padding: 22px 36px 18px 36px;
}

.welcome-fullwidth .slide-heading {
  font-size: clamp(24px, 2.2vw, 30px);
  margin-bottom: 6px;
}

.welcome-fullwidth .slide-description {
  font-size: 14.5px;
  margin-bottom: 12px;
  max-width: 900px;
}

.welcome-fullwidth .slide-visual-stage {
  height: clamp(360px, 46vh, 490px);
  aspect-ratio: 16 / 10;
  width: 100%;
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 14px;
}

.welcome-fullwidth .slide-feature-bar {
  gap: 16px;
  padding-top: 12px;
}

.welcome-fullwidth .carousel-mobile-footer {
  justify-content: center;
  margin-top: 14px;
}

.welcome-fullwidth .carousel-action-btn {
  max-width: 320px;
  width: 100%;
  margin: 0 auto;
  padding: 12px 24px;
  font-size: 14.5px;
}

/* Desktop Two-Column Login Mode — Left Slideshow */
.login-carousel-pane.login-column-mode {
  flex: 1.45;
  max-width: 900px;
  width: 100%;
  min-width: 0;
}

.login-carousel-pane.login-column-mode .carousel-mobile-skip-btn {
  display: none !important;
}

.login-carousel-pane.login-column-mode .carousel-mobile-footer {
  display: none !important;
}

.carousel-card {
  position: relative;
  background: #FFFDF5;
  border: 1.5px solid rgba(254, 240, 138, 0.9);
  border-radius: 24px;
  box-shadow: 0 16px 40px -12px rgba(234, 179, 8, 0.16), 0 4px 16px rgba(0, 0, 0, 0.03);
  padding: 22px 28px 20px 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  user-select: none;
}

/* Decorative ambient curves */
.carousel-card::before {
  content: '';
  position: absolute;
  top: -80px;
  right: -80px;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(255, 237, 50, 0.45) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
}

.carousel-card::after {
  content: '';
  position: absolute;
  bottom: 40px;
  left: -60px;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(254, 240, 138, 0.35) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
}

/* Carousel Header (Navigation Controls & Switcher) */
.carousel-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  position: relative;
  z-index: 2;
  gap: 12px;
}

.carousel-journey-toggle {
  display: inline-flex;
  background: #F1F5F9;
  border-radius: 20px;
  padding: 3px;
  border: 1px solid #E2E8F0;
  align-items: center;
  gap: 2px;
}

.carousel-journey-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 11.5px;
  font-weight: 700;
  color: #64748B;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.carousel-journey-btn:hover {
  color: #0F172A;
}

.carousel-journey-btn.active {
  background: #FFED32;
  color: #0F172A;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.carousel-header-right-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.carousel-mobile-skip-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  color: #64748B;
  background: transparent;
  border: none;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.carousel-mobile-skip-btn:hover {
  color: #0F172A;
  background: #F1F5F9;
}

.carousel-mobile-footer {
  display: flex;
  width: 100%;
  margin-top: 12px;
}

.carousel-btn-pair {
  display: flex;
  gap: 10px;
  width: 100%;
}

.carousel-action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.carousel-action-btn.secondary {
  background: #FFFFFF;
  color: #334155;
  border: 1.5px solid #CBD5E1;
}

.carousel-action-btn.secondary:hover {
  background: #F8FAFC;
  color: #0F172A;
}

.carousel-action-btn.primary {
  background: #FFED32;
  color: #0F172A;
  border: 1.5px solid #EAB308;
  box-shadow: 0 2px 8px rgba(234, 179, 8, 0.25);
}

.carousel-action-btn.primary:hover {
  background: #FACC15;
}

.carousel-action-btn.full-width {
  width: 100%;
}

/* ==========================================================================
   GET STARTED BUTTON HOVER ANIMATION (Scoped exclusively to Get Started button)
   ========================================================================== */
.get-started-btn {
  position: relative !important;
  overflow: hidden !important;
  z-index: 1 !important;
  background-color: #FFED32 !important;
  color: #0F172A !important;
  border: 1.5px solid #EAB308 !important;
  box-shadow: 0 4px 14px rgba(234, 179, 8, 0.28) !important;
  transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, transform 0.2s ease !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 10px !important;
}

/* Expanding cover overlay from left to right */
.get-started-btn .btn-cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #FACC15 0%, #F59E0B 100%);
  border-radius: inherit;
  transition: width 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  pointer-events: none;
}

.get-started-btn:hover .btn-cover-overlay {
  width: 100%;
}

.get-started-btn:hover {
  background-color: #FACC15 !important;
  border-color: #D97706 !important;
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.35) !important;
}

/* Button text with subtle movement to the left on hover */
.get-started-btn .btn-text {
  position: relative;
  z-index: 2;
  font-weight: 800;
  color: #0F172A;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.get-started-btn:hover .btn-text {
  transform: translateX(-5px);
}

/* Circular icon section */
.get-started-btn .btn-icon-circle {
  position: relative;
  z-index: 2;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.35s ease, transform 0.35s ease;
  pointer-events: none;
}

.get-started-btn:hover .btn-icon-circle {
  background: rgba(15, 23, 42, 0.18);
  transform: translateX(2px);
}

/* Icon rotation on hover (continuous spin) */
.get-started-btn .btn-icon-svg {
  display: block;
  transition: transform 0.35s ease;
  color: #0F172A;
}

.get-started-btn:hover .btn-icon-svg {
  animation: getStartedIconSpin 1.1s linear infinite;
}

@keyframes getStartedIconSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Accessibility: focus visibility */
.get-started-btn:focus-visible {
  outline: 2px solid #0F172A !important;
  outline-offset: 3px !important;
}

/* Accessibility: prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .get-started-btn,
  .get-started-btn .btn-cover-overlay,
  .get-started-btn .btn-text,
  .get-started-btn .btn-icon-circle,
  .get-started-btn .btn-icon-svg {
    transition: none !important;
    animation: none !important;
    transform: none !important;
  }
}

.carousel-nav-arrows {
  display: flex;
  align-items: center;
  gap: 8px;
}

.carousel-arrow-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.carousel-arrow-btn:hover {
  background: #FFED32;
  border-color: #EAB308;
  color: #0F172A;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(234, 179, 8, 0.3);
}

/* Slide Content Area */
.carousel-body {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.carousel-slide-content {
  animation: slideFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
  display: flex;
  flex-direction: column;
  flex: 1;
}

@keyframes slideFadeIn {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-heading {
  font-size: clamp(20px, 1.7vw, 26px);
  font-weight: 800;
  line-height: 1.25;
  color: #0F172A;
  letter-spacing: -0.5px;
  margin: 0 0 4px 0;
}

.yellow-accent {
  color: #D97706;
  background: linear-gradient(135deg, #B45309 0%, #D97706 60%, #EAB308 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline;
}

.slide-description {
  font-size: clamp(12.5px, 0.9vw, 14px);
  color: #64748B;
  line-height: 1.45;
  margin: 0 0 10px 0;
  max-width: 680px;
}

/* Visual Stage for each slide */
.slide-visual-stage {
  position: relative;
  width: 100%;
  height: clamp(330px, 40vh, 420px);
  aspect-ratio: 16 / 11;
  max-height: 420px;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 12px;
  background: #FFFDF0;
  border: 1px solid rgba(254, 240, 138, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 10px rgba(254, 240, 138, 0.3);
}

.slide-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  transition: transform 0.6s ease;
  display: block;
}

.slide-photo.slide1-photo {
  object-position: center 18%;
}

.slide-photo.slide3-photo {
  object-position: center 22%;
}

.slide-photo.slide4-photo {
  object-position: center 18%;
}

.carousel-card:hover .slide-photo {
  transform: scale(1.02);
}

/* Slide 1 Floating Doodle */
.slide-doodle-callout {
  position: absolute;
  top: 14px;
  right: 18px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px dashed #F59E0B;
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.22);
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 5;
  animation: floatBob 3s ease-in-out infinite;
}

.doodle-text {
  font-size: 12px;
  font-weight: 800;
  color: #92400E;
  font-family: 'Comic Sans MS', 'Caveat', cursive, sans-serif;
  letter-spacing: -0.2px;
}

.doodle-heart {
  color: #EF4444;
}

@keyframes floatBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Slide 2 Graphic: Clean 3D Resume Mockup */
.slide2-resume-canvas {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #FEFDF9 0%, #FEF9C3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
}

.resume-paper-card {
  width: 270px;
  background: #FFFFFF;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(234, 179, 8, 0.15);
  padding: 16px 18px;
  box-sizing: border-box;
  position: relative;
}

.resume-paper-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #F1F5F9;
}

.resume-paper-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
}

.resume-paper-meta {
  flex: 1;
}

.resume-paper-title {
  font-size: 13px;
  font-weight: 800;
  color: #1E293B;
  margin-bottom: 3px;
}

.resume-paper-line-sm {
  width: 65%;
  height: 5px;
  background: #E2E8F0;
  border-radius: 3px;
}

.resume-paper-lines {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.resume-paper-line {
  height: 6px;
  background: #F1F5F9;
  border-radius: 3px;
  width: 100%;
}

.resume-paper-line.short {
  width: 75%;
}

/* Floating Section Highlight Badges */
.floating-tag-stack {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 6;
}

.floating-tag {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 11.5px;
  font-weight: 800;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
  white-space: nowrap;
}

.floating-tag:hover {
  transform: translateX(-3px);
}

.tag-objective {
  background: #FEF9C3;
  color: #854D0E;
  border: 1px solid #FACC15;
}

.tag-skills {
  background: #EFF6FF;
  color: #1D4ED8;
  border: 1px solid #93C5FD;
}

.tag-projects {
  background: #F0FDF4;
  color: #15803D;
  border: 1px solid #86EFAC;
}

.tag-experience {
  background: #FFF1F2;
  color: #BE123C;
  border: 1px solid #FDA4AF;
}

/* Slide 3 Floating Comments Stack */
.slide3-feedback-stack {
  position: absolute;
  top: 12px;
  right: 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  z-index: 5;
  max-width: 210px;
}

.feedback-bubble {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 7px 11px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 7px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.feedback-bubble.green {
  border-left: 3.5px solid #10B981;
  color: #065F46;
}

.feedback-bubble.yellow {
  border-left: 3.5px solid #F59E0B;
  color: #92400E;
}

.feedback-bubble.blue {
  border-left: 3.5px solid #3B82F6;
  color: #1E40AF;
}

/* Slide 4 Floating Approval Card */
.slide4-approval-card {
  position: absolute;
  top: 18px;
  right: 18px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid #A7F3D0;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 5;
}

.approval-badge-header {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ECFDF5;
  color: #047857;
  font-size: 12px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid #10B981;
}

.approval-checklist {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.approval-check-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #1E293B;
}

.approval-check-icon {
  color: #10B981;
  font-size: 12px;
}

/* Bottom Feature Badges Bar */
.slide-feature-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid rgba(226, 232, 240, 0.7);
}

.feature-item-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  gap: 9px;
  transition: all 0.2s ease;
}

.feature-item-card:hover {
  background: #FFFFFF;
  border-color: #FACC15;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(234, 179, 8, 0.15);
}

.feature-icon-circle {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon-circle.yellow {
  background: #FEF08A;
  color: #854D0E;
}

.feature-icon-circle.teal {
  background: #CCFBF1;
  color: #0F766E;
}

.feature-icon-circle.blue {
  background: #DBEAFE;
  color: #1D4ED8;
}

.feature-item-text {
  display: flex;
  flex-direction: column;
}

.feature-item-title {
  font-size: 12px;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.2;
}

.feature-item-sub {
  font-size: 10px;
  font-weight: 500;
  color: #64748B;
}

/* Pagination Dots */
.carousel-dots-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 16px;
}

.carousel-dot-btn {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #CBD5E1;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.carousel-dot-btn.active {
  width: 26px;
  border-radius: 5px;
  background: #FFED32;
  box-shadow: 0 2px 6px rgba(234, 179, 8, 0.45);
}

/* ==========================================================================
   RIGHT SIDE: Elevated White Login Card
   ========================================================================== */
.login-form-pane {
  flex: 0.85;
  min-width: 360px;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-card {
  background: #FFFFFF;
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.85);
  box-shadow: 0 20px 45px -12px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.02);
  padding: 24px 28px 22px 28px;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

/* Top Card Bar (Back to Home / Switcher) */
.login-card-top-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.login-back-home-link {
  display: none;
}

.login-back-home-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: inherit;
  font-size: 11.5px;
  font-weight: 700;
  line-height: 1.2;
  color: #64748B;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.login-back-home-link:hover {
  color: #0F172A;
  background: #F1F5F9;
}

/* Role Segmented Control */
.login-role-tabs {
  display: inline-flex;
  background: #F1F5F9;
  border-radius: 20px;
  padding: 3px;
  border: 1px solid #E2E8F0;
  margin-bottom: 12px;
}

.login-role-tab {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  border: none;
  background: transparent;
  color: #64748B;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.login-role-tab.active {
  background: #FFFFFF;
  color: #0F172A;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* 3D Character Avatar */
.login-avatar-stage {
  width: 96px;
  height: 96px;
  margin: 0 auto 8px auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-avatar-stage::before {
  content: '';
  position: absolute;
  inset: -6px;
  background: radial-gradient(circle, rgba(255, 237, 50, 0.45) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 0;
}

.login-avatar-img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.12));
}

.login-avatar-img.student-avatar {
  object-position: center 16%;
}

.login-card-title {
  font-size: 23px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.4px;
  margin: 0 0 4px 0;
}

.login-card-prompt {
  font-size: 13px;
  color: #64748B;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

/* OTP Inputs Container */
.otp-inputs-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  position: relative;
  min-height: 54px;
  transition: min-height 0.45s cubic-bezier(0.34, 1.25, 0.64, 1), margin-bottom 0.45s ease;
}

.otp-inputs-wrapper.is-verifying,
.otp-inputs-wrapper.is-success {
  min-height: 160px;
  margin-bottom: 20px;
}

.otp-box {
  width: 48px;
  height: 52px;
  border: 1.5px solid #CBD5E1;
  border-radius: 12px;
  text-align: center;
  font-size: 22px;
  font-weight: 800;
  color: #0F172A;
  background: #F8FAFC;
  outline: none;
  transition: transform 0.4s cubic-bezier(0.34, 1.35, 0.64, 1),
              border-color 0.25s ease,
              box-shadow 0.25s ease,
              background-color 0.25s ease,
              opacity 0.35s ease;
  font-family: monospace;
  text-transform: uppercase;
  will-change: transform, opacity;
  box-sizing: border-box;
}

.otp-box:focus {
  border-color: #EAB308;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.35);
  transform: translateY(-2px);
}

.otp-box.filled {
  background: #FFFFFF;
  border-color: #94A3B8;
}

.otp-boxes-track {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transform-origin: center center;
  width: 100%;
}

.otp-boxes-track.is-spinning {
  animation: otpTrackSpin 1.3s linear infinite;
}

@keyframes otpTrackSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.otp-inputs-wrapper.is-verifying .otp-box {
  transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(0.92);
  border-color: #EAB308;
  background: #FFFFFF;
  box-shadow: 0 4px 14px rgba(234, 179, 8, 0.28);
  pointer-events: none;
  animation: otpBoxCounterSpin 1.3s linear infinite;
}

@keyframes otpBoxCounterSpin {
  0% { transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(0.92) rotate(0deg); }
  100% { transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(0.92) rotate(-360deg); }
}

.otp-inputs-wrapper.is-success .otp-box {
  transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(0.15);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease;
}

.otp-success-badge-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 50;
}

.otp-inputs-wrapper.is-success .otp-success-badge-container {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.otp-success-badge {
  position: relative;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
  animation: successBadgePop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.otp-success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

@keyframes successBadgePop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.18); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.otp-success-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(16, 185, 129, 0.6);
  animation: successRingPulse 1s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
}

@keyframes successRingPulse {
  0% { transform: scale(0.85); opacity: 0.9; }
  100% { transform: scale(1.55); opacity: 0; }
}

.otp-success-text {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 800;
  color: #059669;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.otp-inputs-wrapper.is-error {
  animation: otpRowShake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes otpRowShake {
  0%, 100% { transform: translateX(0); }
  15%, 55%, 85% { transform: translateX(-6px); }
  35%, 75% { transform: translateX(6px); }
}

.otp-inputs-wrapper.is-error .otp-box {
  border-color: #EF4444;
  background: #FEF2F2;
}

/* Submit Action Button */
.btn-login-submit {
  width: 100%;
  padding: 13px 20px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #FFED32 0%, #FACC15 50%, #EAB308 100%);
  color: #0F172A;
  border: 1px solid #CA8A04;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(234, 179, 8, 0.35);
  transition: all 0.2s ease;
}

.btn-login-submit:hover {
  background: linear-gradient(135deg, #FFF04D 0%, #FFED32 50%, #FACC15 100%);
  box-shadow: 0 6px 18px rgba(234, 179, 8, 0.45);
  transform: translateY(-1px);
}

.btn-login-submit:active {
  transform: translateY(0);
}

.btn-arrow-icon {
  transition: transform 0.2s ease;
}

.btn-login-submit:hover .btn-arrow-icon {
  transform: translateX(4px);
}

/* OR Divider */
.login-or-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  color: #94A3B8;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
}

.login-or-divider::before,
.login-or-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #E2E8F0;
}

/* Helper Info Box */
.login-info-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FFFDF5;
  border: 1px solid #FEF08A;
  border-radius: 12px;
  padding: 10px 14px;
  text-align: left;
  margin-bottom: 14px;
}

.login-info-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #FEF08A;
  color: #854D0E;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.login-info-text {
  font-size: 12px;
  color: #475569;
  line-height: 1.4;
  font-weight: 500;
}

/* Need Help Footer */
.login-need-help-link {
  font-size: 12px;
  color: #64748B;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}

.login-need-help-link:hover {
  color: #0F172A;
  text-decoration: underline;
}

/* Demo Autofill Helper */
.demo-otp-helper {
  margin-top: 12px;
  font-size: 11.5px;
  color: #64748B;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}

.demo-otp-chip {
  background: #FEF9C3;
  border: 1px dashed #EAB308;
  color: #854D0E;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  font-size: 11.5px;
}

.demo-otp-chip:hover {
  background: #FEF08A;
  transform: scale(1.02);
}

.autofill-success-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #DCFCE7;
  color: #15803D;
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 8px;
  margin-top: 8px;
}

/* Error Alert */
.login-error-alert {
  background: #FEF2F2;
  border: 1px solid #FECACA;
  color: #991B1B;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 14px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Student Quick Select Grid */
.student-quick-picker {
  margin-bottom: 14px;
  text-align: left;
}

.student-quick-picker-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  margin-bottom: 6px;
  display: block;
}

.student-quick-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.student-quick-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  background: #F8FAFC;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.student-quick-card:hover {
  border-color: #FACC15;
  background: #FFFDF5;
}

.student-quick-card.selected {
  border-color: #EAB308;
  background: #FFFBEB;
  box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.3);
}

.student-quick-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.student-quick-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.student-quick-name {
  font-size: 11.5px;
  font-weight: 700;
  color: #0F172A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.student-quick-otp {
  font-size: 10px;
  font-weight: 600;
  color: #854D0E;
}

/* ==========================================================================
   RESPONSIVE DESIGN (TABLET & MOBILE)
   ========================================================================== */
@media (max-width: 1080px) {
  .login-top-bar {
    padding: 12px 20px;
  }
  .login-main-stage {
    padding: 20px 16px 36px 16px;
  }
  .login-split-container {
    flex-direction: column;
    align-items: center;
    gap: 28px;
    max-width: 680px;
    width: 100%;
  }
  .login-carousel-pane {
    width: 100%;
  }
  .carousel-card {
    min-height: auto;
    padding: 24px 20px 20px 20px;
  }
  .slide-heading {
    font-size: 26px;
  }
  .slide-visual-stage {
    height: 230px;
  }
  .login-form-pane {
    width: 100%;
    max-width: 480px;
    min-width: 0;
  }
}

@media (max-width: 640px) {
  /* Prevent horizontal overflow on mobile viewports and ensure full viewport usage */
  .login-view {
    overflow-x: hidden !important;
    width: 100% !important;
    max-width: 100vw !important;
    min-height: 100vh !important;
    min-height: 100dvh !important;
    height: 100dvh !important;
    max-height: 100dvh !important;
    display: flex !important;
    flex-direction: column !important;
    box-sizing: border-box !important;
  }

  .login-top-bar {
    padding: 8px 12px !important;
    padding-top: calc(8px + env(safe-area-inset-top, 0px)) !important;
    width: 100% !important;
    box-sizing: border-box !important;
    flex-shrink: 0 !important;
  }

  .login-brand-name {
    font-size: 13.5px !important;
  }

  .login-brand-portal {
    font-size: 10px !important;
  }

  .login-header-user-info {
    display: none !important;
  }

  /* Main Stage uses full available height below header */
  .login-main-stage {
    padding: 8px 10px calc(10px + env(safe-area-inset-bottom, 0px)) 10px !important;
    width: 100% !important;
    max-width: 100vw !important;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    flex: 1 1 0% !important;
    min-height: 0 !important;
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    justify-content: stretch !important;
  }

  .login-split-container {
    flex-direction: column !important;
    align-items: stretch !important;
    justify-content: stretch !important;
    gap: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    flex: 1 1 0% !important;
    min-height: 0 !important;
    height: 100% !important;
    display: flex !important;
  }

  /* Controlled Visibility for Mobile Steps */
  .login-carousel-pane {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    max-width: 100% !important;
    flex: 1 1 0% !important;
    min-height: 0 !important;
    height: 100% !important;
    box-sizing: border-box !important;
  }

  .login-carousel-pane.mobile-hidden {
    display: none !important;
  }

  .login-form-pane {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    flex: 1 !important;
    min-height: 0 !important;
    height: auto !important;
    justify-content: flex-start !important;
    align-items: stretch !important;
    padding-top: 6px !important;
    box-sizing: border-box !important;
  }

  .login-form-pane.mobile-hidden {
    display: none !important;
  }

  /* STEP 1: Mobile Carousel Card - Full Available Height & Width */
  .carousel-card {
    padding: 12px 14px 12px 14px !important;
    border-radius: 20px !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    min-height: 0 !important;
    flex: 1 1 0% !important;
    height: 100% !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
    background: rgba(255, 255, 255, 0.98) !important;
    border: 1.5px solid rgba(254, 240, 138, 0.9) !important;
    box-shadow: 0 10px 28px -6px rgba(234, 179, 8, 0.16), 0 4px 14px rgba(0, 0, 0, 0.04) !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
  }

  .carousel-header-row {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    margin-bottom: 6px !important;
    position: relative !important;
    z-index: 10 !important;
    gap: 4px !important;
    flex-shrink: 0 !important;
  }

  .carousel-journey-toggle {
    display: inline-flex !important;
    background: #F1F5F9 !important;
    border-radius: 14px !important;
    padding: 2px !important;
  }

  .carousel-journey-btn {
    padding: 4px 8px !important;
    font-size: 11px !important;
    border-radius: 12px !important;
    gap: 4px !important;
  }

  .carousel-header-right-actions {
    display: flex !important;
    align-items: center !important;
    gap: 4px !important;
  }

  .carousel-mobile-skip-btn {
    display: inline-flex !important;
    align-items: center !important;
    gap: 2px !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    color: #64748B !important;
    background: transparent !important;
    border: none !important;
    padding: 3px 5px !important;
    cursor: pointer !important;
  }

  .carousel-nav-arrows {
    display: none !important;
  }

  .carousel-body {
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    width: 100% !important;
    flex: 1 1 0% !important;
    min-height: 0 !important;
  }

  .carousel-slide-content {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    flex: 1 1 0% !important;
    min-height: 0 !important;
  }

  .slide-heading {
    font-size: clamp(17px, 4.4vw, 21px) !important;
    line-height: 1.25 !important;
    letter-spacing: -0.4px !important;
    margin: 0 0 2px 0 !important;
    word-break: break-word !important;
    flex-shrink: 0 !important;
  }

  .slide-description {
    font-size: clamp(12px, 3.2vw, 13px) !important;
    line-height: 1.35 !important;
    margin: 0 0 6px 0 !important;
    color: #64748B !important;
    word-break: break-word !important;
    flex-shrink: 0 !important;
  }

  /* Visual Stage naturally stretches to make photo visually prominent */
  .slide-visual-stage {
    width: 100% !important;
    flex: 1 1 0% !important;
    min-height: 180px !important;
    max-height: none !important;
    height: 100% !important;
    border-radius: 14px !important;
    margin-bottom: 6px !important;
    box-sizing: border-box !important;
    position: relative !important;
    overflow: hidden !important;
  }

  .slide-photo {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center 20% !important;
    display: block !important;
  }

  .carousel-step-badge {
    width: 24px !important;
    height: 24px !important;
    font-size: 11px !important;
    top: 8px !important;
    left: 8px !important;
  }

  /* Hide feature bar on mobile to keep carousel compact and prevent overflow */
  .slide-feature-bar {
    display: none !important;
  }

  .carousel-dots-row {
    margin-top: 6px !important;
    margin-bottom: 4px !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 6px !important;
    flex-shrink: 0 !important;
  }

  .carousel-dot-btn {
    width: 6px !important;
    height: 6px !important;
  }

  .carousel-dot-btn.active {
    width: 20px !important;
    height: 6px !important;
  }

  /* Mobile Carousel Footer Buttons */
  .carousel-mobile-footer {
    display: flex !important;
    width: 100% !important;
    margin-top: 6px !important;
    flex-shrink: 0 !important;
  }

  .carousel-btn-pair {
    display: flex !important;
    gap: 8px !important;
    width: 100% !important;
  }

  .carousel-action-btn {
    flex: 1 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 5px !important;
    padding: 12px 14px !important;
    border-radius: 12px !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    cursor: pointer !important;
    font-family: inherit !important;
    transition: all 0.2s ease !important;
  }

  .carousel-action-btn.secondary {
    background: #FFFFFF !important;
    color: #334155 !important;
    border: 1.5px solid #CBD5E1 !important;
  }

  .carousel-action-btn.primary {
    background: #FFED32 !important;
    color: #0F172A !important;
    border: 1.5px solid #EAB308 !important;
    box-shadow: 0 2px 8px rgba(234, 179, 8, 0.25) !important;
  }

  .carousel-action-btn.full-width {
    width: 100% !important;
  }

  /* STEP 2: Mobile Login Card - Compact, Professional, Clean Spacing */
  .login-card {
    padding: 18px 16px 20px 16px !important;
    border-radius: 20px !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    min-height: auto !important;
    height: auto !important;
    flex: none !important;
    box-sizing: border-box !important;
    background: #FFFFFF !important;
    border: 1.5px solid rgba(226, 232, 240, 0.9) !important;
    box-shadow: 0 10px 28px -6px rgba(0, 0, 0, 0.08), 0 4px 14px rgba(0, 0, 0, 0.03) !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    margin: 0 !important;
  }

  .login-card-top-nav {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    margin-bottom: 12px !important;
    flex-shrink: 0 !important;
  }

  .login-back-home-link {
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
    color: #64748B !important;
    padding: 5px 8px !important;
    background: transparent !important;
    border: none !important;
    cursor: pointer !important;
    border-radius: 6px !important;
  }

  .login-role-tabs {
    display: inline-flex !important;
    background: #F1F5F9 !important;
    border-radius: 16px !important;
    padding: 2px !important;
  }

  .login-role-tab {
    padding: 5px 12px !important;
    font-size: 11.5px !important;
    border-radius: 12px !important;
    font-weight: 700 !important;
  }

  .login-avatar-stage {
    width: 60px !important;
    height: 60px !important;
    margin: 0 auto 10px auto !important;
    background: #FFFDF0 !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
  }

  .login-avatar-img {
    width: 54px !important;
    height: 54px !important;
    border-radius: 50% !important;
    object-fit: cover !important;
  }

  .login-avatar-img.student-avatar {
    object-position: center 16% !important;
  }

  .login-card-title {
    font-size: 21px !important;
    font-weight: 800 !important;
    margin-bottom: 4px !important;
    flex-shrink: 0 !important;
  }

  .login-card-prompt {
    font-size: 12.5px !important;
    margin-bottom: 14px !important;
    color: #64748B !important;
    line-height: 1.4 !important;
    flex-shrink: 0 !important;
  }

  .otp-inputs-wrapper {
    gap: 4px !important;
    margin-bottom: 14px !important;
    min-height: 48px !important;
    flex-shrink: 0 !important;
  }

  .otp-boxes-track {
    gap: clamp(5px, 2vw, 8px) !important;
    width: 100% !important;
    justify-content: center !important;
  }

  .otp-box {
    width: clamp(40px, 12vw, 48px) !important;
    height: clamp(46px, 13vw, 52px) !important;
    font-size: 21px !important;
    border-radius: 12px !important;
  }

  .btn-login-submit {
    padding: 13px 16px !important;
    font-size: 15px !important;
    font-weight: 800 !important;
    border-radius: 13px !important;
    width: 100% !important;
    margin-top: 2px !important;
    flex-shrink: 0 !important;
  }

  .login-or-divider {
    margin: 12px 0 !important;
    font-size: 10.5px !important;
    flex-shrink: 0 !important;
  }

  .login-info-card {
    padding: 10px 14px !important;
    font-size: 12px !important;
    line-height: 1.45 !important;
    border-radius: 11px !important;
    margin-top: 2px !important;
    margin-bottom: 8px !important;
    flex-shrink: 0 !important;
  }

  .login-need-help-link {
    font-size: 11.5px !important;
    margin-top: 4px !important;
    flex-shrink: 0 !important;
  }

  .student-login-main-stage {
    padding: 10px 10px calc(10px + env(safe-area-inset-bottom, 0px)) 10px !important;
    align-items: flex-start !important;
    justify-content: flex-start !important;
  }
}

/* Compact screens (360px) */
@media (max-width: 380px) {
  .carousel-journey-btn {
    padding: 3px 6px !important;
    font-size: 10px !important;
  }
  .carousel-journey-btn span {
    display: inline !important;
  }
  .slide-visual-stage {
    min-height: 150px !important;
  }
  .slide-heading {
    font-size: 16px !important;
  }
  .slide-description {
    font-size: 11.5px !important;
  }
  .otp-boxes-track {
    gap: 4px !important;
  }
  .otp-box {
    width: 38px !important;
    height: 44px !important;
    font-size: 17px !important;
  }
  .carousel-action-btn {
    padding: 10px 12px !important;
    font-size: 12.5px !important;
  }
  .login-card {
    padding: 14px 12px 16px 12px !important;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .carousel-slide-content,
  .slide-doodle-callout,
  .btn-login-submit,
  .carousel-arrow-btn,
  .otp-box {
    animation: none !important;
    transition: none !important;
  }
}

/* Mobile Frame Simulation Mode */
.mobile-frame-mode .login-view {
  min-height: 100%;
  overflow-x: hidden !important;
  width: 100% !important;
  box-sizing: border-box !important;
}
.mobile-frame-mode .login-top-bar {
  padding: 8px 12px;
}
.mobile-frame-mode .login-main-stage {
  padding: 10px 8px 24px 8px !important;
  width: 100% !important;
  box-sizing: border-box !important;
  overflow-x: hidden !important;
}
.mobile-frame-mode .login-split-container {
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 14px !important;
  width: 100% !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}
.mobile-frame-mode .login-carousel-pane {
  width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
}
.mobile-frame-mode .login-carousel-pane.mobile-hidden {
  display: none !important;
}
.mobile-frame-mode .carousel-card {
  padding: 16px 12px !important;
  min-height: auto !important;
  height: auto !important;
  width: 100% !important;
  box-sizing: border-box !important;
}
.mobile-frame-mode .slide-heading {
  font-size: 18px !important;
  line-height: 1.25 !important;
  word-break: break-word !important;
  margin: 0 0 6px 0 !important;
}
.mobile-frame-mode .slide-description {
  font-size: 12px !important;
  line-height: 1.4 !important;
  margin: 0 0 10px 0 !important;
  word-break: break-word !important;
}
.mobile-frame-mode .slide-visual-stage {
  height: 160px !important;
  width: 100% !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}
.mobile-frame-mode .slide-photo {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}
.mobile-frame-mode .slide-photo.slide4-photo {
  object-position: 36% 22% !important;
}
.mobile-frame-mode .slide4-approval-card {
  max-width: 135px !important;
  padding: 5px 8px !important;
  right: 6px !important;
  top: 6px !important;
}
.mobile-frame-mode .slide-feature-bar {
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
  padding-top: 6px !important;
  width: 100% !important;
}
.mobile-frame-mode .feature-item-card {
  padding: 6px 10px !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}
.mobile-frame-mode .login-form-pane {
  width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
}
.mobile-frame-mode .login-card {
  width: 100% !important;
  box-sizing: border-box !important;
  padding: 20px 14px !important;
}
.mobile-frame-mode .otp-inputs-wrapper {
  gap: 4px;
}
.mobile-frame-mode .otp-box {
  width: 40px;
  height: 46px;
}

/* ==========================================================================
   Team Everest Welcome Screen (Responsive for Desktop & Mobile)
   ========================================================================== */

.welcome-screen-view {
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  box-sizing: border-box;
}

.welcome-top-bar {
  width: 100%;
  padding: 16px 36px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  box-sizing: border-box;
  z-index: 20;
}

.welcome-brand-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.welcome-header-logo {
  height: 42px;
  width: auto;
  max-width: 48px;
  object-fit: contain;
  display: block;
  border-radius: 4px;
}

.welcome-brand-titles {
  display: flex;
  flex-direction: column;
}

.welcome-brand-name {
  font-size: 15px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.2px;
  line-height: 1.2;
}

.welcome-brand-portal {
  font-size: 11.5px;
  font-weight: 600;
  color: #64748B;
  letter-spacing: 0.2px;
}

/* Desktop Main Stage */
.welcome-main-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  box-sizing: border-box;
  width: 100%;
}

.welcome-header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-journey-toggle {
  display: inline-flex;
  background: #F1F5F9;
  border-radius: 20px;
  padding: 3px;
  border: 1px solid #E2E8F0;
}

.welcome-journey-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  color: #64748B;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.welcome-journey-btn:hover {
  color: #0F172A;
}

.welcome-journey-btn.active {
  background: #FFED32;
  color: #0F172A;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.welcome-skip-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  color: #64748B;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.welcome-skip-link:hover {
  color: #0F172A;
  background: #F1F5F9;
}

/* Desktop Main Stage */
.welcome-main-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  box-sizing: border-box;
  width: 100%;
}

.welcome-carousel-card {
  max-width: 580px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 26px;
  padding: 24px 28px 24px 28px;
  box-shadow: 
    0 24px 48px -12px rgba(15, 23, 42, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
}

.welcome-active-badge {
  font-size: 12px;
  font-weight: 700;
  color: #64748B;
  letter-spacing: 0.2px;
}

.carousel-journey-tag {
  font-size: 12px;
  font-weight: 800;
  color: #854D0E;
  background: #FEF08A;
  padding: 3px 10px;
  border-radius: 12px;
  letter-spacing: 0.2px;
}

/* Welcome Slide Presentation & Realistic Photo */
.welcome-slide-anim {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.welcome-slide-photo-wrap {
  position: relative;
  width: 100%;
  height: 250px;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  background: #F1F5F9;
}

.welcome-slide-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  display: block;
}

/* Step Badge Number 1, 2, 3, 4 (Hidden per requirements) */
.carousel-step-badge {
  display: none !important;
}

.welcome-slide-text {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

.welcome-slide-heading {
  font-size: 22px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.4px;
  line-height: 1.3;
  margin: 0 0 6px 0;
  word-break: break-word;
}

.welcome-slide-desc {
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  line-height: 1.5;
  margin: 0;
  word-break: break-word;
}

/* Welcome Carousel Footer Buttons */
.welcome-carousel-footer {
  width: 100%;
  margin-top: 14px;
}

.welcome-btn-pair {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.welcome-btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 22px;
  background: #F8FAFC;
  color: #475569;
  font-size: 14px;
  font-weight: 700;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.welcome-btn-secondary:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.welcome-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  background: #FFED32;
  color: #0F172A;
  font-size: 14.5px;
  font-weight: 800;
  border: 1px solid rgba(202, 138, 4, 0.3);
  border-radius: 12px;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 14px rgba(234, 179, 8, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.welcome-btn-primary:hover {
  background: #FACC15;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(234, 179, 8, 0.45);
}

.welcome-btn-primary:active {
  transform: translateY(0);
}

.welcome-btn-primary.full-width {
  width: 100%;
}

/* ==========================================================================
   Smooth Carousel Animations (Fade, Smooth, Slide, Impact)
   ========================================================================== */

.anim-fade .welcome-slide-photo,
.anim-fade .slide-photo {
  animation: slidePhotoFadeIn 0.5s ease-out both;
}
.anim-fade .welcome-slide-heading,
.anim-fade .slide-heading {
  animation: slideHeadingFadeIn 0.55s ease-out both;
}

.anim-smooth .welcome-slide-photo,
.anim-smooth .slide-photo {
  animation: slidePhotoSmooth 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.anim-smooth .welcome-slide-heading,
.anim-smooth .slide-heading,
.anim-smooth .welcome-slide-desc,
.anim-smooth .slide-description {
  animation: slideTextSmooth 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.anim-slide .welcome-slide-photo,
.anim-slide .slide-photo {
  animation: slidePhotoSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.anim-slide .welcome-slide-heading,
.anim-slide .slide-heading,
.anim-slide .welcome-slide-desc,
.anim-slide .slide-description {
  animation: slideTextSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.anim-impact .welcome-slide-photo,
.anim-impact .slide-photo {
  animation: slidePhotoImpact 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.anim-impact .welcome-slide-heading,
.anim-impact .slide-heading,
.anim-impact .welcome-slide-desc,
.anim-impact .slide-description {
  animation: slideTextSmooth 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slidePhotoFadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideHeadingFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slidePhotoSmooth {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideTextSmooth {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slidePhotoSlideIn {
  from {
    opacity: 0;
    transform: translateX(18px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideTextSlideIn {
  from {
    opacity: 0;
    transform: translateX(12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slidePhotoImpact {
  0% {
    opacity: 0;
    transform: scale(1.03);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}


/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .anim-fade .welcome-slide-photo,
  .anim-fade .slide-photo,
  .anim-fade .welcome-slide-heading,
  .anim-fade .slide-heading,
  .anim-smooth .welcome-slide-photo,
  .anim-smooth .slide-photo,
  .anim-smooth .welcome-slide-heading,
  .anim-smooth .slide-heading,
  .anim-smooth .welcome-slide-desc,
  .anim-smooth .slide-description,
  .anim-slide .welcome-slide-photo,
  .anim-slide .slide-photo,
  .anim-slide .welcome-slide-heading,
  .anim-slide .slide-heading,
  .anim-slide .welcome-slide-desc,
  .anim-slide .slide-description,
  .anim-impact .welcome-slide-photo,
  .anim-impact .slide-photo,
  .anim-impact .welcome-slide-heading,
  .anim-impact .slide-heading,
  .anim-impact .welcome-slide-desc,
  .anim-impact .slide-description,
  .welcome-btn-primary {
    animation: none !important;
    transition: none !important;
  }
}

/* Mobile Frame Simulation Support */
.mobile-frame-mode .welcome-screen-view {
  height: 100% !important;
  min-height: 100% !important;
  overflow: hidden !important;
}
.mobile-frame-mode .welcome-top-bar {
  padding: 8px 12px !important;
}
.mobile-frame-mode .welcome-main-stage {
  padding: 10px 12px 14px 12px !important;
}
.mobile-frame-mode .welcome-carousel-card {
  height: 100% !important;
  padding: 12px 12px !important;
}
.mobile-frame-mode .welcome-slide-photo-wrap {
  height: 140px !important;
}
`;

export const LoginStyles: React.FC = () => {
  return <style>{styles}</style>;
};
