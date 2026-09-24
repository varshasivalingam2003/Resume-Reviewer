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
  padding: 30px 36px 40px 36px;
  box-sizing: border-box;
}

.login-split-container {
  display: flex;
  width: 100%;
  max-width: 1300px;
  gap: 36px;
  align-items: stretch;
  justify-content: center;
}

/* ==========================================================================
   LEFT SIDE: 4-Slide Auto-Playing Visual Carousel
   ========================================================================== */
.login-carousel-pane {
  flex: 1.45;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.carousel-card {
  position: relative;
  background: #FFFDF5;
  border: 1.5px solid rgba(254, 240, 138, 0.9);
  border-radius: 28px;
  box-shadow: 0 20px 45px -12px rgba(234, 179, 8, 0.16), 0 4px 16px rgba(0, 0, 0, 0.03);
  padding: 30px 32px 24px 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-height: 560px;
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

/* Carousel Header (Badge & Controls) */
.carousel-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  position: relative;
  z-index: 2;
}

.carousel-slide-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #FEF08A;
  color: #854D0E;
  font-size: 11.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(234, 179, 8, 0.4);
}

.carousel-nav-arrows {
  display: flex;
  align-items: center;
  gap: 8px;
}

.carousel-arrow-btn {
  width: 34px;
  height: 34px;
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
  font-size: 30px;
  font-weight: 800;
  line-height: 1.25;
  color: #0F172A;
  letter-spacing: -0.6px;
  margin: 0 0 8px 0;
}

.yellow-accent {
  color: #D97706;
  background: linear-gradient(135deg, #B45309 0%, #D97706 60%, #EAB308 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline;
}

.slide-description {
  font-size: 14.5px;
  color: #64748B;
  line-height: 1.5;
  margin: 0 0 16px 0;
  max-width: 540px;
}

/* Visual Stage for each slide */
.slide-visual-stage {
  position: relative;
  width: 100%;
  height: 250px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
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
  object-position: center 25%;
  transition: transform 0.6s ease;
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
  flex: 1;
  min-width: 360px;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-card {
  background: #FFFFFF;
  border-radius: 28px;
  border: 1px solid rgba(226, 232, 240, 0.85);
  box-shadow: 0 24px 50px -12px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.02);
  padding: 28px 30px;
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
  justify-content: space-between;
  margin-bottom: 12px;
}

.login-back-home-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 700;
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
  animation: otpTrackSpin 2.6s linear infinite;
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
  animation: otpBoxCounterSpin 2.6s linear infinite;
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
  z-index: 10;
}

.otp-success-badge {
  position: relative;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
  animation: successBadgePop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
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
  font-size: 14px;
  font-weight: 700;
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
    max-width: 620px;
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
    height: 220px;
  }
  .login-form-pane {
    width: 100%;
    max-width: 480px;
  }
}

@media (max-width: 640px) {
  .login-top-bar {
    padding: 10px 14px;
  }
  .login-brand-name {
    font-size: 14px;
  }
  .login-brand-portal {
    font-size: 10.5px;
  }
  .login-header-user-info {
    display: none;
  }
  .login-main-stage {
    padding: 12px 10px 28px 10px;
  }
  .login-split-container {
    gap: 18px;
    width: 100%;
  }
  .carousel-card {
    padding: 18px 14px 16px 14px;
    border-radius: 20px;
  }
  .slide-heading {
    font-size: 20px;
    line-height: 1.25;
  }
  .slide-description {
    font-size: 12.5px;
    margin-bottom: 12px;
  }
  .slide-visual-stage {
    height: 175px;
    border-radius: 14px;
    margin-bottom: 14px;
  }
  .slide-feature-bar {
    grid-template-columns: 1fr;
    gap: 8px;
    padding-top: 10px;
  }
  .feature-item-card {
    padding: 7px 10px;
  }
  .login-card {
    padding: 22px 16px;
    border-radius: 20px;
  }
  .login-avatar-stage {
    width: 80px;
    height: 80px;
    margin-bottom: 6px;
  }
  .login-avatar-img {
    width: 74px;
    height: 74px;
  }
  .login-card-title {
    font-size: 20px;
  }
  .login-card-prompt {
    font-size: 12px;
    margin-bottom: 14px;
  }
  .otp-inputs-wrapper {
    gap: 5px;
  }
  .otp-box {
    width: 42px;
    height: 48px;
    font-size: 19px;
    border-radius: 9px;
  }
  .btn-login-submit {
    padding: 12px 16px;
    font-size: 14.5px;
    border-radius: 12px;
  }
}

/* Extreme compact screens (360px) */
@media (max-width: 380px) {
  .otp-inputs-wrapper {
    gap: 4px;
  }
  .otp-box {
    width: 38px;
    height: 44px;
    font-size: 17px;
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
}
.mobile-frame-mode .login-top-bar {
  padding: 8px 12px;
}
.mobile-frame-mode .login-main-stage {
  padding: 10px 8px 24px 8px;
}
.mobile-frame-mode .login-split-container {
  gap: 14px;
}
.mobile-frame-mode .carousel-card {
  padding: 16px 12px;
}
.mobile-frame-mode .slide-heading {
  font-size: 19px;
}
.mobile-frame-mode .slide-visual-stage {
  height: 160px;
}
.mobile-frame-mode .slide-feature-bar {
  grid-template-columns: 1fr;
  gap: 6px;
}
.mobile-frame-mode .otp-inputs-wrapper {
  gap: 4px;
}
.mobile-frame-mode .otp-box {
  width: 40px;
  height: 46px;
}
`;

export const LoginStyles: React.FC = () => {
  return <style>{styles}</style>;
};
