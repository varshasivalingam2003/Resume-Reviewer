import React from 'react';

const styles = `/* ==========================================================================
   Cohesive, Modern, High-End Landing Page Styling
   ========================================================================== */

.login-view {
  flex: 1;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FAF8F2;
  background-image: 
    radial-gradient(rgba(202, 138, 4, 0.1) 1.2px, transparent 1.2px),
    radial-gradient(circle at 12% 18%, rgba(254, 240, 138, 0.45) 0%, transparent 45%),
    radial-gradient(circle at 88% 82%, rgba(250, 204, 21, 0.2) 0%, transparent 45%);
  background-size: 24px 24px, 100% 100%, 100% 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 32px 36px;
  position: relative;
  box-sizing: border-box;
}

/* Ambient dynamic light orbs */
.login-view::before {
  content: '';
  position: absolute;
  top: -100px;
  left: -100px;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(254, 240, 138, 0.5) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
  filter: blur(40px);
}

.login-view::after {
  content: '';
  position: absolute;
  bottom: -100px;
  right: -100px;
  width: 440px;
  height: 440px;
  background: radial-gradient(circle, rgba(250, 204, 21, 0.28) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
  filter: blur(45px);
}

/* Centered Unified Container */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 44px;
  max-width: 1260px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* ==========================================================================
   Left Column: Elevated Hero Content & Live Studio Showcase
   ========================================================================== */
.login-hero {
  flex: 1;
  max-width: 660px;
  background: transparent;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  border: none;
}

/* Brand badge pill at top of hero */
.hero-brand-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(254, 240, 138, 0.9);
  box-shadow: 0 2px 8px rgba(234, 179, 8, 0.15);
  padding: 5px 14px;
  border-radius: var(--radius-full);
  width: fit-content;
}

.hero-brand-pill .brand-icon-mini {
  width: 22px;
  height: 22px;
  background: var(--primary-yellow);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #78350F;
  box-shadow: 0 2px 5px rgba(234, 179, 8, 0.3);
}

.hero-brand-pill .brand-text {
  font-size: 12px;
  font-weight: 800;
  color: #1E293B;
  letter-spacing: 0.3px;
}

.hero-brand-pill .brand-status-dot {
  width: 7px;
  height: 7px;
  background: #10B981;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
  animation: animPulse 2s infinite;
}

.hero-brand-pill .brand-status-text {
  font-size: 11.5px;
  font-weight: 700;
  color: #059669;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero-title {
  font-size: 32px;
  font-weight: 800;
  line-height: 1.22;
  color: #0F172A;
  letter-spacing: -0.6px;
}

.hero-gradient-text {
  background: linear-gradient(135deg, #B45309 0%, #D97706 50%, #F59E0B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline;
}

.hero-subtitle {
  font-size: 15px;
  font-weight: 500;
  color: #64748B;
  line-height: 1.4;
  margin-bottom: 4px;
}

/* Minimalist Feature Pills */
.hero-feature-chips {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.feature-pill {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: var(--radius-full);
  padding: 6px 14px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.feature-pill:hover {
  background: #FFFFFF;
  border-color: #FACC15;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(234, 179, 8, 0.15);
}

.pill-icon {
  font-size: 13px;
  line-height: 1;
}

.pill-label {
  font-size: 12.5px;
  font-weight: 700;
  color: #1E293B;
  white-space: nowrap;
}

/* Illustration Studio Frame */
.hero-illustration {
  position: relative;
  width: 100%;
  max-width: 660px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ==========================================================================
   Right Column: Elevated, Glassmorphic Login Terminal Card
   ========================================================================== */
.login-form-pane {
  flex: none;
  width: 440px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.login-card {
  width: 100%;
  padding: 34px 30px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(16px);
  border-radius: 26px;
  border: 1.5px solid rgba(254, 240, 138, 0.9);
  box-shadow: 0 25px 55px -12px rgba(202, 138, 4, 0.18), 0 4px 18px rgba(0, 0, 0, 0.04);
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

/* Glowing top accent stripe */
.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FACC15, #EAB308, #CA8A04);
}

.login-card:hover {
  box-shadow: 0 30px 60px -12px rgba(202, 138, 4, 0.24), 0 8px 24px rgba(0, 0, 0, 0.06);
}

/* Segmented Role Switcher */
.login-role-tabs {
  display: flex;
  background: #F1F5F9;
  border-radius: var(--radius-full);
  padding: 4px;
  margin-bottom: 18px;
  border: 1px solid var(--border-color);
}

.login-role-tab {
  flex: 1;
  padding: 8px 14px;
  font-size: 12.5px;
  font-weight: 700;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.login-role-tab.active {
  background: #FFFFFF;
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.login-card-logo {
  width: 50px;
  height: 50px;
  background: var(--primary-yellow);
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  box-shadow: 0 4px 14px var(--primary-yellow-glow);
  color: #78350F;
}

.login-card-portal-name {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.9px;
  color: #854D0E;
  margin-bottom: 3px;
}

.login-card-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
  letter-spacing: -0.5px;
}

.login-card-prompt {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 18px;
  line-height: 1.45;
}

/* OTP Inputs */
.otp-inputs-wrapper {
  display: flex;
  justify-content: center;
  gap: 9px;
  margin-bottom: 18px;
}

.otp-box {
  width: 48px;
  height: 54px;
  border: 1.5px solid #CBD5E1;
  border-radius: 12px;
  text-align: center;
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
  background: #F8FAFC;
  outline: none;
  transition: all var(--transition-fast);
  font-family: monospace;
}

.otp-box:focus {
  border-color: #EAB308;
  background: #FFFFFF;
  box-shadow: 0 0 0 3.5px rgba(250, 204, 21, 0.35);
  transform: translateY(-2px);
}

.otp-box.filled {
  background: #FFFFFF;
  border-color: #94A3B8;
}

.otp-box.highlight-flash {
  border-color: #10B981;
  background: #F0FDF4;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
  animation: pulseFlash 0.5s ease-in-out;
}

@keyframes pulseFlash {
  0% { transform: scale(1); }
  50% { transform: scale(1.06); }
  100% { transform: scale(1); }
}

/* Continue Button */
.btn-login-submit {
  width: 100%;
  padding: 13px 20px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%);
  color: #0F172A;
  border: 1px solid #CA8A04;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(234, 179, 8, 0.35);
  transition: all 0.2s ease;
}

.btn-login-submit:hover {
  background: linear-gradient(135deg, #FDE047 0%, #FACC15 100%);
  box-shadow: 0 6px 18px rgba(234, 179, 8, 0.45);
  transform: translateY(-1px);
}

.btn-login-submit:active {
  transform: translateY(0);
}

.btn-arrow-icon {
  font-size: 17px;
  transition: transform 0.2s ease;
}

.btn-login-submit:hover .btn-arrow-icon {
  transform: translateX(4px);
}

/* Demo Autofill Helper */
.demo-otp-helper {
  margin-top: 14px;
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.demo-otp-chip {
  background: #FEF9C3;
  border: 1px dashed #EAB308;
  color: #854D0E;
  padding: 6px 14px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  font-size: 12px;
}

.demo-otp-chip:hover {
  background: #FEF08A;
  transform: scale(1.03);
  box-shadow: 0 2px 8px rgba(234, 179, 8, 0.22);
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
  margin-top: 10px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-need-help {
  margin-top: 14px;
  font-size: 12.5px;
  color: #64748B;
  text-decoration: none;
  display: inline-block;
  font-weight: 500;
  cursor: pointer;
}

.login-need-help:hover {
  color: var(--text-primary);
  text-decoration: underline;
}

/* Student Quick Select Chips */
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
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  background: #F8FAFC;
  cursor: pointer;
  transition: all var(--transition-fast);
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
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.student-quick-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.student-quick-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.student-quick-otp {
  font-size: 10.5px;
  font-weight: 600;
  color: #854D0E;
}

/* Login Error Alert */
.login-error-alert {
  background: #FEF2F2;
  border: 1px solid #FECACA;
  color: #991B1B;
  border-radius: var(--radius-md);
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ==========================================================================
   Responsive Layout Rules
   ========================================================================== */
@media (max-width: 1080px) {
  .login-view {
    padding: 24px 20px;
  }
  .login-container {
    flex-direction: column;
    gap: 36px;
  }
  .login-hero {
    max-width: 100%;
    text-align: center;
    align-items: center;
  }
  .hero-brand-pill {
    margin: 0 auto 4px auto;
  }
  .hero-feature-chips {
    max-width: 600px;
  }
  .hero-title {
    font-size: 28px;
  }
  .hero-subtitle {
    font-size: 15px;
  }
  .login-form-pane {
    width: 100%;
    max-width: 440px;
  }
}

@media (max-width: 640px) {
  .hero-feature-chips {
    grid-template-columns: 1fr;
  }
}

/* Mobile Frame Mode Simulation */
.mobile-frame-mode .login-view {
  height: auto;
  min-height: 100%;
  overflow-y: auto;
  padding: 16px 12px;
}
.mobile-frame-mode .login-container {
  flex-direction: column;
  gap: 20px;
}
.mobile-frame-mode .login-hero {
  max-width: 100%;
}
.mobile-frame-mode .hero-title {
  font-size: 22px;
}
.mobile-frame-mode .hero-subtitle {
  font-size: 14px;
  margin-bottom: 10px;
}
.mobile-frame-mode .hero-feature-chips {
  grid-template-columns: 1fr;
  gap: 6px;
}
.mobile-frame-mode .login-form-pane {
  width: 100%;
}
.mobile-frame-mode .login-card {
  padding: 20px 16px;
}
`;

export const LoginStyles: React.FC = () => {
  return <style>{styles}</style>;
};
