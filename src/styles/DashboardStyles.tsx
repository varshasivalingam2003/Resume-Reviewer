import React from 'react';

const styles = `/* Volunteer Dashboard Styling - Reference Matched */
.dashboard-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #FEFBF1;
  min-height: calc(100vh - 68px);
  width: 100%;
}

.dashboard-main {
  flex: 1;
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  padding: 28px 32px 48px;
  box-sizing: border-box;
}

/* ==========================================================================
   Hero Section
   ========================================================================== */
.dashboard-hero-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  position: relative;
  min-height: 140px;
  background: radial-gradient(circle at 88% 45%, rgba(254, 240, 138, 0.4) 0%, rgba(254, 251, 241, 0) 65%);
}

.hero-left-content {
  flex: 1;
  max-width: 580px;
  z-index: 2;
}

.hero-portal-badge {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.6px;
  color: #64748B;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.hero-greeting-title {
  font-size: 32px;
  font-weight: 800;
  color: #0F172A;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.6px;
  margin: 0 0 6px 0;
  line-height: 1.2;
}

.hero-wave-hand {
  display: inline-block;
  font-size: 26px;
  animation: waveHand 2.2s infinite ease-in-out;
  transform-origin: 75% 75%;
}

@keyframes waveHand {
  0%, 100% { transform: rotate(0deg); }
  20%, 60% { transform: rotate(14deg); }
  40%, 80% { transform: rotate(-10deg); }
}

.hero-greeting-subtitle {
  font-size: 14.5px;
  color: #475569;
  font-weight: 500;
  margin: 0;
  line-height: 1.5;
}

.hero-right-container {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.hero-speech-bubble {
  background: #FFFFFF;
  border-radius: 14px;
  padding: 14px 18px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.8);
  font-size: 13.5px;
  font-weight: 700;
  color: #1E293B;
  line-height: 1.4;
  white-space: nowrap;
}

.hero-illustration-wrap {
  width: 220px;
  height: 145px;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.hero-illustration-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  pointer-events: none;
}

/* ==========================================================================
   Stat Cards Row
   ========================================================================== */
.stat-cards-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #FFFFFF;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  border-color: #CBD5E1;
}

.stat-card-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon-circle {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-circle.yellow {
  background: #FEF9C3;
  color: #0F172A;
}

.stat-icon-circle.amber {
  background: #FEF3C7;
  color: #D97706;
}

.stat-icon-circle.green {
  background: #DCFCE7;
  color: #16A34A;
}

.stat-text-col {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 26px;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.1;
}

.stat-title {
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  margin-top: 3px;
}

.stat-chevron {
  color: #94A3B8;
  display: flex;
  align-items: center;
}

/* ==========================================================================
   Search & Filter Row
   ========================================================================== */
.filter-controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.filter-search-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.filter-search-icon {
  position: absolute;
  left: 14px;
  color: #94A3B8;
  pointer-events: none;
  display: flex;
  align-items: center;
}

.filter-search-input {
  width: 100%;
  height: 44px;
  padding: 0 16px 0 42px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  font-size: 13.5px;
  font-family: inherit;
  color: #0F172A;
  outline: none;
  transition: all 0.15s ease;
  box-sizing: border-box;
}

.filter-search-input::placeholder {
  color: #94A3B8;
}

.filter-search-input:focus {
  border-color: #FACC15;
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.2);
}

.filter-actions-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-select-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.filter-select-icon {
  position: absolute;
  left: 13px;
  color: #475569;
  pointer-events: none;
  display: flex;
  align-items: center;
}

.filter-select-chevron {
  position: absolute;
  right: 12px;
  color: #64748B;
  pointer-events: none;
  display: flex;
  align-items: center;
}

.filter-pill-select {
  height: 44px;
  padding: 0 34px 0 36px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  color: #0F172A;
  cursor: pointer;
  outline: none;
  appearance: none;
  transition: all 0.15s ease;
}

.filter-pill-select:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.filter-pill-select:focus {
  border-color: #FACC15;
}

/* ==========================================================================
   Student Compact Row Cards
   ========================================================================== */
.student-rows-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.student-row-card {
  background: #FFFFFF;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.15s ease;
}

.student-row-card:hover {
  border-color: #CBD5E1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.student-row-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 280px;
  flex: 1.2;
}

.student-initial-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 800;
  flex-shrink: 0;
  user-select: none;
}

.student-info-meta {
  display: flex;
  flex-direction: column;
}

.student-name-text {
  font-size: 15.5px;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.25;
}

.student-degree-text {
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
  margin-top: 3px;
}

.student-row-middle {
  display: flex;
  align-items: center;
  gap: 28px;
  flex: 1;
  justify-content: center;
}

.student-progress-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 120px;
}

.student-progress-label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.student-progress-bar {
  width: 120px;
  height: 7px;
  background: #E2E8F0;
  border-radius: 9999px;
  overflow: hidden;
}

.student-progress-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.student-progress-fill.yellow {
  background: #FACC15;
}

.student-progress-fill.green {
  background: #22C55E;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 12.5px;
  font-weight: 700;
  white-space: nowrap;
}

.status-pill.pending {
  background: #FEF3C7;
  color: #B45309;
}

.status-pill.completed {
  background: #DCFCE7;
  color: #15803D;
}

.student-row-right-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
}

.btn-student-view {
  height: 38px;
  padding: 0 16px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #0F172A;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.btn-student-view:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.btn-review-primary {
  height: 38px;
  padding: 0 18px;
  background: #FFED32;
  border: 1px solid #FACC15;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 800;
  color: #0F172A;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.btn-review-primary:hover {
  background: #FDE047;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(250, 204, 21, 0.35);
}

.btn-view-feedback {
  height: 38px;
  padding: 0 16px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #0F172A;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.btn-view-feedback:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

/* ==========================================================================
   Footer & Pagination
   ========================================================================== */
.dashboard-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 4px;
}

.footer-count-text {
  font-size: 13px;
  color: #64748B;
  font-weight: 600;
}

.footer-pagination-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pagination-arrow-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pagination-arrow-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.pagination-num-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFED32;
  border: 1px solid #FACC15;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 800;
  color: #0F172A;
  cursor: pointer;
}

/* ==========================================================================
   Empty State
   ========================================================================== */
.empty-students-card {
  padding: 60px 24px;
  text-align: center;
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

/* ==========================================================================
   Mobile Bottom Nav Bar (Preserved)
   ========================================================================== */
.mobile-bottom-nav {
  display: none;
}

/* ==========================================================================
   Responsive Breakpoints
   ========================================================================== */
@media (max-width: 1024px) {
  .dashboard-main {
    padding: 24px 20px 40px;
  }
  .hero-speech-bubble {
    display: none;
  }
}

@media (max-width: 860px) {
  .student-row-card {
    flex-wrap: wrap;
    gap: 14px;
  }
  .student-row-middle {
    order: 3;
    width: 100%;
    justify-content: space-between;
  }
  .student-row-right-actions {
    order: 2;
  }
}

@media (max-width: 768px) {
  .dashboard-hero-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    min-height: auto;
  }
  .hero-right-container {
    align-self: center;
  }
  .hero-greeting-title {
    font-size: 26px;
  }
  .stat-cards-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .filter-controls-row {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .filter-actions-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .filter-pill-select {
    width: 100%;
  }
  .student-row-card {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    gap: 14px;
  }
  .student-row-left {
    min-width: 0;
  }
  .student-row-middle {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  .student-progress-col {
    min-width: 0;
    flex: 1;
  }
  .student-progress-bar {
    width: 100%;
    max-width: 160px;
  }
  .student-row-right-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .btn-student-view,
  .btn-review-primary,
  .btn-view-feedback {
    width: 100%;
    justify-content: center;
  }
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: #FFFFFF;
    border-top: 1px solid #E2E8F0;
    z-index: 100;
    align-items: center;
    justify-content: space-around;
  }
  .mobile-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    background: none;
    border: none;
    font-size: 11px;
    font-weight: 600;
    color: #64748B;
    cursor: pointer;
  }
  .mobile-nav-item.active {
    color: #0F172A;
  }
}

@media (max-width: 480px) {
  .dashboard-main {
    padding: 16px 14px 70px;
  }
  .hero-greeting-title {
    font-size: 22px;
  }
  .hero-greeting-subtitle {
    font-size: 13px;
  }
  .stat-card {
    padding: 14px 16px;
  }
  .stat-number {
    font-size: 22px;
  }
  .filter-actions-group {
    grid-template-columns: 1fr;
  }
}
`;

export const DashboardStyles: React.FC = () => {
  return <style>{styles}</style>;
};
