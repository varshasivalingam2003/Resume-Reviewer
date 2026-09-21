import React from 'react';

const styles = `/* ========================================================
   MOBILE & RESPONSIVE DESIGN SYSTEM
   Pixel-perfect alignment, zero clumsiness, touch ergonomics
   ======================================================== */

/* Global Mobile Containers & Resets */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Base components (Hidden on wide screens by default) */
.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #FFFFFF;
  border-top: 1px solid var(--border-color);
  z-index: 99;
  justify-content: space-around;
  align-items: center;
  padding: 0 12px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 10.5px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.mobile-nav-item.active {
  color: #854D0E;
  background: #FEF08A;
}

.mobile-workspace-tabs-bar {
  display: none;
  background: #FFFFFF;
  border-bottom: 1px solid var(--border-color);
  padding: 6px 12px;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}

.mobile-tabs-pill-container {
  display: flex;
  background: #F1F5F9;
  border-radius: 999px;
  padding: 3px;
  width: 100%;
  max-width: 360px;
}

.mobile-tab-btn {
  flex: 1;
  padding: 7px 10px;
  border: none;
  background: transparent;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #64748B;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  white-space: nowrap;
  transition: all var(--transition-fast);
}

.mobile-tab-btn.active {
  background: var(--primary-yellow);
  color: #0F172A;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  font-weight: 800;
}

/* ========================================================
   RESPONSIVE MEDIA QUERIES FOR VIEWPORTS <= 860px
   ======================================================== */
@media (max-width: 860px) {
  html, body, #root, #app {
    width: 100% !important;
    max-width: 100vw !important;
    overflow-x: hidden !important;
  }

  /* Top Utility Bar (DeviceBar) */
  .device-toggle-bar {
    padding: 4px 8px !important;
    overflow-x: auto !important;
    white-space: nowrap !important;
    -webkit-overflow-scrolling: touch !important;
    display: flex !important;
    flex-wrap: nowrap !important;
    justify-content: flex-start !important;
    gap: 6px !important;
    height: 36px !important;
    align-items: center !important;
    background: #0F172A !important;
  }

  .device-toggle-bar::-webkit-scrollbar {
    display: none !important;
  }

  .device-bar-left-group,
  .device-bar-right-group {
    flex-shrink: 0 !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
  }

  .device-toggle-btn {
    padding: 2px 7px !important;
    font-size: 10.5px !important;
    white-space: nowrap !important;
  }

  .quick-reset-btn {
    font-size: 10.5px !important;
    padding: 2px 7px !important;
    white-space: nowrap !important;
  }

  /* Common Portal Navbar */
  .portal-navbar {
    padding: 0 12px !important;
    height: 50px !important;
  }

  .brand-title {
    font-size: 13.5px !important;
    font-weight: 800 !important;
  }

  .volunteer-user-pill {
    padding: 2px 8px !important;
    gap: 6px !important;
  }

  .volunteer-avatar {
    width: 24px !important;
    height: 24px !important;
  }

  .volunteer-name {
    font-size: 11px !important;
    max-width: 90px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .volunteer-badge {
    display: none !important;
  }

  /* Login Screens */
  .login-container {
    flex-direction: column !important;
    width: 100% !important;
    padding: 12px 10px !important;
  }

  .login-hero {
    display: none !important;
  }

  .login-form-pane {
    padding: 0 !important;
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
  }

  .login-card {
    border: 1px solid var(--border-color) !important;
    box-shadow: var(--shadow-sm) !important;
    padding: 20px 14px !important;
    border-radius: var(--radius-xl) !important;
    max-width: 360px !important;
    width: 100% !important;
    margin: 0 auto !important;
  }

  .login-role-tabs {
    margin-bottom: 12px !important;
  }

  .login-role-tab {
    font-size: 11.5px !important;
    padding: 6px 8px !important;
  }

  .otp-inputs-wrapper {
    gap: 5px !important;
    margin-bottom: 14px !important;
    justify-content: center !important;
  }

  .otp-box {
    width: 38px !important;
    height: 46px !important;
    font-size: 17px !important;
  }

  /* Volunteer Dashboard View */
  .dashboard-sidebar {
    display: none !important;
  }

  .dashboard-main {
    padding: 12px 10px 75px !important;
    width: 100% !important;
  }

  .dashboard-header-banner {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 8px !important;
    padding: 12px !important;
    border-radius: 12px !important;
  }

  .dashboard-greeting-title {
    font-size: 17px !important;
  }

  .progress-summary-box {
    align-items: flex-start !important;
    width: 100% !important;
  }

  .metric-cards-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 6px !important;
    margin: 10px 0 !important;
  }

  .metric-card {
    padding: 8px 4px !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    gap: 2px !important;
  }

  .metric-value {
    font-size: 15px !important;
    font-weight: 800 !important;
  }

  .metric-label {
    font-size: 9.5px !important;
  }

  .dashboard-controls-row {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 8px !important;
    margin-bottom: 10px !important;
  }

  .search-input-box {
    width: 100% !important;
    max-width: none !important;
    height: 36px !important;
  }

  .filter-tabs-row {
    display: flex !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    gap: 6px !important;
    padding-bottom: 4px !important;
    width: 100% !important;
  }

  .filter-tabs-row::-webkit-scrollbar {
    display: none !important;
  }

  .filter-tab-btn {
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    font-size: 11px !important;
    padding: 4px 10px !important;
  }

  .student-cards-list {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
  }

  .student-card-item {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 10px !important;
    padding: 12px !important;
    border-radius: 10px !important;
  }

  .student-actions-col {
    width: 100% !important;
    display: flex !important;
    justify-content: space-between !important;
    gap: 8px !important;
    border-top: 1px solid var(--border-color) !important;
    padding-top: 10px !important;
  }

  .student-actions-col .btn {
    flex: 1 !important;
    min-height: 38px !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    text-align: center !important;
    justify-content: center !important;
  }

  .mobile-bottom-nav {
    display: flex !important;
  }

  /* ========================================================
     WORKSPACE DUAL PANE & TOP BAR
     ======================================================== */
  .workspace-container {
    height: auto !important;
    min-height: calc(100vh - 50px) !important;
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    background: #F8FAFC !important;
  }

  .workspace-top-bar {
    padding: 8px 10px !important;
    height: auto !important;
    min-height: 50px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    background: #FFFFFF !important;
    border-bottom: 1px solid #E2E8F0 !important;
    flex-shrink: 0 !important;
    width: 100% !important;
  }

  .workspace-left-meta {
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
  }

  .workspace-back-btn {
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
    padding: 4px 10px !important;
    font-size: 12px !important;
    height: 32px !important;
    border-radius: 6px !important;
    border: 1px solid #CBD5E1 !important;
  }

  .workspace-student-title-box {
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    flex: 1 !important;
    justify-content: flex-end !important;
  }

  .workspace-student-name {
    font-size: 14px !important;
    font-weight: 800 !important;
    color: #0F172A !important;
    max-width: 130px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .workspace-student-degree {
    display: none !important;
  }

  .workspace-student-title-box .status-badge {
    font-size: 9.5px !important;
    padding: 2px 7px !important;
    border-radius: 999px !important;
  }

  .workspace-top-actions {
    width: 100% !important;
    display: flex !important;
    gap: 6px !important;
    justify-content: space-between !important;
  }

  .workspace-top-actions .btn {
    flex: 1 !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
    padding: 6px 4px !important;
    min-height: 36px !important;
    text-align: center !important;
    justify-content: center !important;
    border-radius: 7px !important;
    white-space: nowrap !important;
  }

  /* Dual Pane Switcher */
  .mobile-workspace-tabs-bar {
    display: flex !important;
  }

  .workspace-dual-pane {
    display: flex !important;
    flex-direction: column !important;
    height: auto !important;
    flex: 1 !important;
    min-height: 0 !important;
    margin-bottom: 0 !important;
    width: 100% !important;
  }

  .workspace-dual-pane[data-mobile-tab="resume"] .resume-viewer-pane {
    display: flex !important;
    flex-direction: column !important;
    flex: 1 !important;
    width: 100% !important;
    min-height: calc(100vh - 145px) !important;
    overflow-y: auto !important;
  }

  .workspace-dual-pane[data-mobile-tab="resume"] .review-feedback-pane {
    display: none !important;
  }

  .workspace-dual-pane[data-mobile-tab="review"] .resume-viewer-pane {
    display: none !important;
  }

  .workspace-dual-pane[data-mobile-tab="review"] .review-feedback-pane {
    display: flex !important;
    flex-direction: column !important;
    flex: 1 !important;
    width: 100% !important;
    min-height: calc(100vh - 145px) !important;
    padding: 12px 10px 30px !important;
    box-sizing: border-box !important;
    overflow-y: auto !important;
  }

  /* ========================================================
     5 REVIEW NAVIGATION TABS (Segmented Control)
     Uniform 50px height, icon top, label bottom, zero jump
     ======================================================== */
  .commenting-tools-tabs {
    display: grid !important;
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 3px !important;
    padding: 3px !important;
    background: #F1F5F9 !important;
    border-radius: 12px !important;
    border: 1px solid #E2E8F0 !important;
    margin-bottom: 12px !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .comment-tool-tab {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    height: 50px !important;
    min-height: 50px !important;
    padding: 4px 1px !important;
    min-width: 0 !important;
    border-radius: 8px !important;
    border: 1px solid transparent !important;
    background: transparent !important;
    cursor: pointer !important;
    position: relative !important;
    transition: all 0.15s ease !important;
    box-sizing: border-box !important;
  }

  .comment-tool-tab.active {
    background: #FFFFFF !important;
    border-color: #CBD5E1 !important;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06) !important;
  }

  .comment-tool-tab .tab-icon {
    font-size: 16px !important;
    line-height: 1 !important;
    margin-bottom: 2px !important;
  }

  .comment-tool-tab .tab-label {
    font-size: 10px !important;
    font-weight: 700 !important;
    color: #475569 !important;
    line-height: 1.1 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    max-width: 100% !important;
    text-align: center !important;
  }

  .comment-tool-tab.active .tab-label {
    color: #0F172A !important;
    font-weight: 800 !important;
  }

  .comment-tool-tab .tab-count-pill {
    position: absolute !important;
    top: 3px !important;
    right: 3px !important;
    font-size: 8px !important;
    font-weight: 800 !important;
    background: #E2E8F0 !important;
    color: #334155 !important;
    padding: 1px 4px !important;
    border-radius: 999px !important;
    line-height: 1 !important;
  }

  .comment-tool-tab.active .tab-count-pill {
    background: #FEF08A !important;
    color: #854D0E !important;
  }

  .comment-tool-tab .tab-saved-dot {
    position: absolute !important;
    top: 3px !important;
    right: 3px !important;
    font-size: 8px !important;
    font-weight: 800 !important;
    background: #DCFCE7 !important;
    color: #166534 !important;
    padding: 1px 4px !important;
    border-radius: 999px !important;
    line-height: 1 !important;
  }

  /* ========================================================
     4-STAGE GUIDED MENTOR AUDIT
     ======================================================== */
  .mentor-audit-card {
    background: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 12px !important;
    padding: 12px 10px !important;
    gap: 12px !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .audit-stage-stepper-row {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 3px !important;
    padding: 3px !important;
    background: #F8FAFC !important;
    border-radius: 10px !important;
    border: 1px solid #E2E8F0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
    margin-bottom: 2px !important;
  }

  .audit-stage-pill-btn {
    height: 36px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 4px 2px !important;
    font-size: 10.5px !important;
    font-weight: 700 !important;
    color: #64748B !important;
    background: transparent !important;
    border: 1px solid transparent !important;
    border-radius: 7px !important;
    cursor: pointer !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    transition: all 0.15s ease !important;
  }

  .audit-stage-pill-btn.active {
    background: #FEF08A !important;
    color: #854D0E !important;
    font-weight: 800 !important;
    border-color: #FDE047 !important;
    box-shadow: 0 1px 3px rgba(133, 77, 14, 0.15) !important;
  }

  .mentor-stage-header {
    display: flex !important;
    align-items: flex-start !important;
    gap: 8px !important;
    justify-content: space-between !important;
  }

  .mentor-stage-icon {
    font-size: 20px !important;
    flex-shrink: 0 !important;
  }

  .mentor-stage-title {
    font-size: 13.5px !important;
    font-weight: 800 !important;
    color: #0F172A !important;
    margin-bottom: 2px !important;
  }

  .mentor-stage-desc {
    font-size: 11.5px !important;
    color: #64748B !important;
    line-height: 1.4 !important;
  }

  /* Verdict Cards - 3 columns, clean wrap, zero overflow */
  .audit-verdict-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 6px !important;
    margin: 4px 0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .audit-verdict-card {
    min-height: 42px !important;
    padding: 6px 4px !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    border-radius: 8px !important;
    text-align: center !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    white-space: normal !important;
    line-height: 1.25 !important;
    cursor: pointer !important;
    border: 1.5px solid #E2E8F0 !important;
    background: #FFFFFF !important;
    color: #475569 !important;
    word-break: break-word !important;
  }

  .audit-verdict-card.selected {
    background: #0F172A !important;
    color: #FFFFFF !important;
    border-color: #0F172A !important;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15) !important;
  }

  /* Target Section Row on Mobile */
  .mentor-stage-label-row {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 6px !important;
    margin-bottom: 2px !important;
  }

  .mentor-stage-sync-badge {
    font-size: 10px !important;
    padding: 2px 6px !important;
    border-radius: 999px !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
  }

  .mentor-section-action-row {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 6px !important;
    width: 100% !important;
  }

  .mentor-select-wrapper {
    flex: 1 !important;
    min-width: 0 !important;
    position: relative !important;
    display: flex !important;
    align-items: center !important;
  }

  .mentor-stage-select {
    width: 100% !important;
    height: 38px !important;
    line-height: 38px !important;
    padding: 0 28px 0 10px !important;
    border-radius: 8px !important;
    border: 1.5px solid #CBD5E1 !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    background-color: #FFFFFF !important;
    color: #0F172A !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    box-sizing: border-box !important;
  }

  .mentor-stage-select:focus {
    outline: none !important;
    border-color: #2563EB !important;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
  }

  .mentor-select-chevron {
    position: absolute !important;
    right: 9px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    pointer-events: none !important;
    color: #64748B !important;
    display: flex !important;
  }

  .mentor-canvas-highlight-btn {
    height: 38px !important;
    min-height: 38px !important;
    padding: 0 10px !important;
    border-radius: 8px !important;
    border: 1.5px solid #CBD5E1 !important;
    background: #F8FAFC !important;
    color: #1E293B !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 5px !important;
    box-sizing: border-box !important;
  }

  .mentor-canvas-highlight-btn:active {
    background: #0F172A !important;
    color: #FFFFFF !important;
    border-color: #0F172A !important;
  }

  @media (max-width: 420px) {
    .mentor-section-action-row {
      flex-direction: column !important;
      gap: 6px !important;
    }
    .mentor-select-wrapper,
    .mentor-canvas-highlight-btn {
      width: 100% !important;
    }
  }

  .mentor-stage-textarea,
  .mentor-stage-input {
    width: 100% !important;
    font-size: 12.5px !important;
    padding: 8px 10px !important;
    border-radius: 8px !important;
    border: 1px solid #CBD5E1 !important;
    font-family: inherit !important;
    box-sizing: border-box !important;
  }

  .mentor-stage-nav-footer {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 8px !important;
    width: 100% !important;
    margin-top: 4px !important;
  }

  .mentor-stage-nav-footer .btn-stage-nav {
    padding: 8px 10px !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
    background: #F1F5F9 !important;
    border: 1px solid #CBD5E1 !important;
    border-radius: 8px !important;
    color: #334155 !important;
    min-height: 38px !important;
    flex: 1 !important;
    text-align: center !important;
    justify-content: center !important;
    display: inline-flex !important;
    align-items: center !important;
  }

  .mentor-stage-nav-footer .btn-primary,
  .mentor-stage-nav-footer .btn-apply-audit {
    padding: 8px 12px !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
    border-radius: 8px !important;
    min-height: 38px !important;
    flex: 1.3 !important;
    text-align: center !important;
    justify-content: center !important;
    display: inline-flex !important;
    align-items: center !important;
  }

  /* Subtopics & Section Notes Cards */
  .volunteer-subtopic-card {
    padding: 10px !important;
    border-radius: 10px !important;
    border: 1px solid #E2E8F0 !important;
    margin-bottom: 10px !important;
  }

  .subtopic-card-header {
    flex-wrap: wrap !important;
    gap: 6px !important;
    padding: 6px 0 !important;
  }

  .subtopic-card-title-wrap {
    flex-wrap: wrap !important;
    gap: 6px !important;
    width: 100% !important;
  }

  .subtopic-card-title {
    font-size: 13px !important;
    font-weight: 700 !important;
    width: 100% !important;
    margin-bottom: 2px !important;
  }

  .subtopic-highlight-toggle {
    font-size: 10px !important;
    padding: 2px 7px !important;
    border-radius: 999px !important;
  }

  /* Star Rating & General Feedback */
  .review-rating-box,
  .improve-tags-box,
  .review-feedback-box {
    margin-top: 10px !important;
  }

  .review-section-label {
    font-size: 12px !important;
    font-weight: 700 !important;
    color: #334155 !important;
    margin-bottom: 6px !important;
    display: block !important;
  }

  .feedback-textarea {
    width: 100% !important;
    min-height: 80px !important;
    font-size: 12.5px !important;
    padding: 8px 10px !important;
    border-radius: 8px !important;
    border: 1px solid #CBD5E1 !important;
    box-sizing: border-box !important;
  }

  /* Action Buttons at Bottom of Review Pane */
  .review-action-buttons {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 10px !important;
    margin-top: 14px !important;
    padding-top: 14px !important;
    border-top: 1px solid #E2E8F0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .review-action-buttons .btn {
    min-height: 44px !important;
    font-size: 12.5px !important;
    font-weight: 700 !important;
    padding: 8px 6px !important;
    text-align: center !important;
    justify-content: center !important;
    border-radius: 8px !important;
    white-space: nowrap !important;
    display: flex !important;
    align-items: center !important;
  }

  .review-action-buttons .btn-danger-outline {
    background: #FEF2F2 !important;
    border: 1.5px solid #F87171 !important;
    color: #B91C1C !important;
  }

  .review-action-buttons .btn-primary {
    background: #EAB308 !important;
    color: #0F172A !important;
    border: 1.5px solid #CA8A04 !important;
    font-weight: 800 !important;
  }

  /* ========================================================
     RESUME DOCUMENT VIEWER ON MOBILE
     ======================================================== */
  .resume-toolbar {
    height: 44px !important;
    min-height: 44px !important;
    padding: 0 8px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 6px !important;
    background: #FFFFFF !important;
    border-bottom: 1px solid #E2E8F0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .resume-file-info {
    display: flex !important;
    align-items: center !important;
    gap: 5px !important;
    min-width: 0 !important;
    flex: 0 1 auto !important;
    max-width: 110px !important;
    overflow: hidden !important;
  }

  .resume-file-info .pdf-icon-badge {
    flex-shrink: 0 !important;
  }

  .resume-filename {
    font-size: 11.5px !important;
    font-weight: 700 !important;
    color: #1E293B !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    min-width: 0 !important;
    flex: 1 !important;
  }

  .resume-view-controls {
    display: flex !important;
    align-items: center !important;
    gap: 4px !important;
    flex-shrink: 0 !important;
    flex-wrap: nowrap !important;
  }

  .page-navigator {
    display: inline-flex !important;
    align-items: center !important;
    gap: 3px !important;
    padding: 2px 4px !important;
    border-radius: 6px !important;
    border: 1px solid #E2E8F0 !important;
    background: #F8FAFC !important;
    flex-shrink: 0 !important;
    white-space: nowrap !important;
  }

  .page-indicator-text {
    font-size: 11px !important;
    font-weight: 700 !important;
    color: #1E293B !important;
    white-space: nowrap !important;
    min-width: 28px !important;
    text-align: center !important;
    display: inline-block !important;
    font-variant-numeric: tabular-nums !important;
    line-height: 1 !important;
  }

  .zoom-controls {
    display: inline-flex !important;
    align-items: center !important;
    gap: 3px !important;
    padding: 2px 4px !important;
    border-radius: 6px !important;
    border: 1px solid #E2E8F0 !important;
    background: #F8FAFC !important;
    flex-shrink: 0 !important;
    white-space: nowrap !important;
  }

  .zoom-indicator-text {
    font-size: 11px !important;
    font-weight: 700 !important;
    color: #1E293B !important;
    white-space: nowrap !important;
    min-width: 32px !important;
    text-align: center !important;
    display: inline-block !important;
    font-variant-numeric: tabular-nums !important;
    line-height: 1 !important;
  }

  .page-nav-btn, 
  .zoom-btn {
    width: 22px !important;
    height: 22px !important;
    min-width: 22px !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    border-radius: 4px !important;
    border: 1px solid #CBD5E1 !important;
    background: #FFFFFF !important;
    color: #0F172A !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    cursor: pointer !important;
  }

  .page-nav-btn:hover:not(:disabled),
  .zoom-btn:hover:not(:disabled) {
    background: #F1F5F9 !important;
  }

  .page-nav-btn:disabled {
    opacity: 0.35 !important;
    cursor: not-allowed !important;
  }

  .toolbar-action-icon-btn {
    width: 26px !important;
    height: 26px !important;
    min-width: 26px !important;
    border-radius: 6px !important;
    border: 1px solid #E2E8F0 !important;
    background: #F8FAFC !important;
    color: #475569 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 !important;
    flex-shrink: 0 !important;
    cursor: pointer !important;
  }

  .resume-scroll-canvas {
    padding: 8px !important;
    flex: 1 !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    background: #E2E8F0 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
  }

  .resume-paper {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    min-height: auto !important;
    padding: 14px 10px !important;
    box-sizing: border-box !important;
    border-radius: 8px !important;
    transform: none !important;
    margin: 0 auto !important;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08) !important;
  }

  .resume-name {
    font-size: 16px !important;
    font-weight: 800 !important;
  }

  .resume-target-title {
    font-size: 11.5px !important;
    margin-bottom: 4px !important;
  }

  .resume-contact-bar {
    gap: 3px 6px !important;
    font-size: 10px !important;
    flex-wrap: wrap !important;
  }

  .resume-section {
    margin-bottom: 12px !important;
  }

  .resume-section-title {
    font-size: 11.5px !important;
    padding-bottom: 3px !important;
    margin-bottom: 6px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
  }

  .resume-entry-header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 2px !important;
  }

  /* Modals on Mobile */
  .modal-overlay {
    padding: 12px !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .modal-card {
    width: 92% !important;
    max-width: 360px !important;
    border-radius: 16px !important;
    padding: 20px 14px !important;
    max-height: 88vh !important;
    overflow-y: auto !important;
    margin: auto !important;
    box-sizing: border-box !important;
  }

  .modal-actions-row {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 8px !important;
    width: 100% !important;
  }

  .modal-actions-row .btn {
    width: 100% !important;
    min-height: 42px !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    border-radius: 8px !important;
  }
}

/* ========================================================
   SIMULATED MOBILE FRAME MODE (.mobile-frame-mode)
   Mirror the same ergonomic mobile rules in the desktop preview frame
   ======================================================== */
.mobile-frame-mode .dashboard-sidebar {
  display: none !important;
}

.mobile-frame-mode .login-hero {
  display: none !important;
}

.mobile-frame-mode .login-form-pane {
  padding: 16px 12px !important;
}

.mobile-frame-mode .login-card {
  padding: 20px 14px !important;
  width: 100% !important;
  max-width: 360px !important;
  margin: 0 auto !important;
}

.mobile-frame-mode .dashboard-main {
  padding: 12px 10px 75px !important;
  width: 100% !important;
}

.mobile-frame-mode .metric-cards-grid {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 6px !important;
}

.mobile-frame-mode .metric-card {
  padding: 8px 4px !important;
  flex-direction: column !important;
  align-items: center !important;
  text-align: center !important;
  gap: 2px !important;
}

.mobile-frame-mode .student-card-item {
  flex-direction: column !important;
  align-items: flex-start !important;
  gap: 10px !important;
  padding: 12px !important;
}

.mobile-frame-mode .student-actions-col {
  width: 100% !important;
  display: flex !important;
  justify-content: space-between !important;
  gap: 8px !important;
  border-top: 1px solid var(--border-color) !important;
  padding-top: 10px !important;
}

.mobile-frame-mode .student-actions-col .btn {
  flex: 1 !important;
  min-height: 38px !important;
  font-size: 12px !important;
  font-weight: 700 !important;
}

.mobile-frame-mode .mobile-bottom-nav {
  display: flex !important;
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
}

.mobile-frame-mode .workspace-container {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
  width: 100% !important;
}

.mobile-frame-mode .workspace-top-bar {
  padding: 8px 10px !important;
  height: auto !important;
  min-height: 50px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
  background: #FFFFFF !important;
  border-bottom: 1px solid #E2E8F0 !important;
  flex-shrink: 0 !important;
}

.mobile-frame-mode .workspace-left-meta {
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}

.mobile-frame-mode .workspace-back-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
  padding: 4px 10px !important;
  font-size: 12px !important;
  height: 32px !important;
  border-radius: 6px !important;
}

.mobile-frame-mode .workspace-student-title-box {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
}

.mobile-frame-mode .workspace-student-name {
  font-size: 14px !important;
  font-weight: 800 !important;
  max-width: 130px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.mobile-frame-mode .workspace-student-degree {
  display: none !important;
}

.mobile-frame-mode .workspace-top-actions {
  width: 100% !important;
  display: flex !important;
  gap: 6px !important;
  justify-content: space-between !important;
}

.mobile-frame-mode .workspace-top-actions .btn {
  flex: 1 !important;
  font-size: 11.5px !important;
  font-weight: 700 !important;
  padding: 6px 4px !important;
  min-height: 36px !important;
  text-align: center !important;
  justify-content: center !important;
  border-radius: 7px !important;
}

.mobile-frame-mode .mobile-workspace-tabs-bar {
  display: none !important;
}

.mobile-frame-mode .workspace-dual-pane {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 !important;
  min-height: 0 !important;
  width: 100% !important;
}

.mobile-frame-mode .resume-viewer-pane {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 !important;
  width: 100% !important;
  height: calc(844px - 100px) !important;
  min-height: 0 !important;
  overflow-y: auto !important;
}

.mobile-frame-mode .review-feedback-pane {
  display: none !important;
}

.mobile-frame-mode .commenting-tools-tabs {
  display: grid !important;
  grid-template-columns: repeat(5, 1fr) !important;
  gap: 3px !important;
  padding: 3px !important;
  background: #F1F5F9 !important;
  border-radius: 12px !important;
  border: 1px solid #E2E8F0 !important;
  margin-bottom: 12px !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.mobile-frame-mode .comment-tool-tab {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  height: 50px !important;
  min-height: 50px !important;
  padding: 4px 1px !important;
  min-width: 0 !important;
  border-radius: 8px !important;
  border: 1px solid transparent !important;
  background: transparent !important;
  cursor: pointer !important;
  position: relative !important;
}

.mobile-frame-mode .comment-tool-tab.active {
  background: #FFFFFF !important;
  border-color: #CBD5E1 !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06) !important;
}

.mobile-frame-mode .comment-tool-tab .tab-icon {
  font-size: 16px !important;
  line-height: 1 !important;
  margin-bottom: 2px !important;
}

.mobile-frame-mode .comment-tool-tab .tab-label {
  font-size: 10px !important;
  font-weight: 700 !important;
  color: #475569 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 100% !important;
  text-align: center !important;
}

.mobile-frame-mode .comment-tool-tab.active .tab-label {
  color: #0F172A !important;
  font-weight: 800 !important;
}

.mobile-frame-mode .comment-tool-tab .tab-count-pill {
  position: absolute !important;
  top: 3px !important;
  right: 3px !important;
  font-size: 8px !important;
  font-weight: 800 !important;
  background: #E2E8F0 !important;
  color: #334155 !important;
  padding: 1px 4px !important;
  border-radius: 999px !important;
  line-height: 1 !important;
}

.mobile-frame-mode .comment-tool-tab.active .tab-count-pill {
  background: #FEF08A !important;
  color: #854D0E !important;
}

.mobile-frame-mode .comment-tool-tab .tab-saved-dot {
  position: absolute !important;
  top: 3px !important;
  right: 3px !important;
  font-size: 8px !important;
  font-weight: 800 !important;
  background: #DCFCE7 !important;
  color: #166534 !important;
  padding: 1px 4px !important;
  border-radius: 999px !important;
  line-height: 1 !important;
}

.mobile-frame-mode .audit-stage-stepper-row {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 3px !important;
  padding: 3px !important;
  background: #F8FAFC !important;
  border-radius: 10px !important;
  border: 1px solid #E2E8F0 !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.mobile-frame-mode .audit-stage-pill-btn {
  height: 36px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 4px 2px !important;
  font-size: 10.5px !important;
  font-weight: 700 !important;
  color: #64748B !important;
  background: transparent !important;
  border: 1px solid transparent !important;
  border-radius: 7px !important;
  cursor: pointer !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.mobile-frame-mode .audit-stage-pill-btn.active {
  background: #FEF08A !important;
  color: #854D0E !important;
  font-weight: 800 !important;
  border-color: #FDE047 !important;
}

.mobile-frame-mode .audit-verdict-grid {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 6px !important;
  margin: 4px 0 !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.mobile-frame-mode .audit-verdict-card {
  min-height: 42px !important;
  padding: 6px 4px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  text-align: center !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  white-space: normal !important;
  line-height: 1.25 !important;
  cursor: pointer !important;
  border: 1.5px solid #E2E8F0 !important;
  background: #FFFFFF !important;
  color: #475569 !important;
}

.mobile-frame-mode .audit-verdict-card.selected {
  background: #0F172A !important;
  color: #FFFFFF !important;
  border-color: #0F172A !important;
}

.mobile-frame-mode .review-action-buttons {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 10px !important;
  margin-top: 14px !important;
  padding-top: 14px !important;
  border-top: 1px solid #E2E8F0 !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.mobile-frame-mode .review-action-buttons .btn {
  min-height: 44px !important;
  font-size: 12.5px !important;
  font-weight: 700 !important;
  padding: 8px 6px !important;
  text-align: center !important;
  justify-content: center !important;
  border-radius: 8px !important;
}

.mobile-frame-mode .review-dialog-modal {
  width: 95% !important;
  max-width: 95% !important;
  max-height: 85vh !important;
  margin: auto !important;
}
`;

export const MobileStyles: React.FC = () => {
  return <style>{styles}</style>;
};
