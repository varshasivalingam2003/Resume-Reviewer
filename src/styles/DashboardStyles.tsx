import React from 'react';

const styles = `/* Volunteer Dashboard Styling */
.dashboard-layout {
  display: flex;
  flex: 1;
  background: var(--bg-page);
  min-height: calc(100vh - 68px);
}

/* Sidebar Navigation */
.dashboard-sidebar {
  width: 240px;
  background: var(--bg-card);
  border-right: 1px solid var(--border-color);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar-nav-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.sidebar-nav-item:hover {
  background: var(--bg-subtle);
  color: var(--text-primary);
}

.sidebar-nav-item.active {
  background: var(--primary-yellow-light);
  color: #854D0E;
}

.sidebar-nav-item svg {
  width: 18px;
  height: 18px;
}

.sidebar-bottom {
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.logout-btn:hover {
  background: #FEE2E2;
  color: #DC2626;
}

/* Dashboard Main View Area */
.dashboard-main {
  flex: 1;
  padding: 32px 48px;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

/* Greeting Header */
.dashboard-header-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.greeting-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.5px;
}

.greeting-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 2px;
  font-weight: 500;
}

.progress-summary-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.progress-label-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.progress-pct {
  font-weight: 700;
  color: var(--text-primary);
}

.progress-track {
  width: 180px;
  height: 8px;
  background: #E2E8F0;
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-yellow);
  border-radius: var(--radius-full);
  transition: width 0.4s ease;
}

/* Metric Cards Row */
.metric-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.metric-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.metric-icon-bubble {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon-bubble.blue {
  background: #EFF6FF;
  color: #3B82F6;
}

.metric-icon-bubble.orange {
  background: #FFFBEB;
  color: #F59E0B;
}

.metric-icon-bubble.green {
  background: #ECFDF5;
  color: #10B981;
}

.metric-content {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
}

.metric-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

/* Search and Filter Row */
.dashboard-controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.search-input-box {
  flex: 1;
  max-width: 480px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-field {
  width: 100%;
  height: 44px;
  padding: 0 16px 0 42px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: inherit;
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.search-field:focus {
  outline: none;
  border-color: var(--primary-yellow-hover);
  box-shadow: 0 0 0 3px var(--primary-yellow-glow);
}

.filter-dropdown-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-select {
  height: 44px;
  padding: 0 36px 0 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-yellow);
}

/* Student Cards List */
.student-cards-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.student-card-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.student-card-item:hover {
  border-color: #CBD5E1;
  box-shadow: var(--shadow-md);
}

.student-info-col {
  display: flex;
  align-items: center;
  gap: 16px;
}

.student-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border-color);
}

.student-name-meta {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.student-degree {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.student-actions-col {
  display: flex;
  align-items: center;
  gap: 20px;
}

.student-action-btn {
  min-width: 100px;
}

/* ==========================================================================
   Single User vs Group User Dashboard Styles
   ========================================================================== */

/* Top Assignment Type Banner */
.assignment-type-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid transparent;
  gap: 16px;
  flex-wrap: wrap;
}

.assignment-type-banner.single-mode {
  background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
  border-color: #BBF7D0;
}

.assignment-type-banner.group-mode {
  background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
  border-color: #DBEAFE;
}

.banner-left-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.banner-type-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.single-mode .banner-type-icon {
  background: #22C55E;
  color: #FFFFFF;
}

.group-mode .banner-type-icon {
  background: #3B82F6;
  color: #FFFFFF;
}

.banner-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.banner-type-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 800;
  color: #0F172A;
}

.banner-type-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.single-mode .banner-type-tag {
  background: #DCFCE7;
  color: #15803D;
  border: 1px solid #86EFAC;
}

.group-mode .banner-type-tag {
  background: #DBEAFE;
  color: #1D4ED8;
  border: 1px solid #93C5FD;
}

.banner-type-desc {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

/* Tag Assignment Switcher Pill */
.dashboard-mode-switcher {
  display: inline-flex;
  align-items: center;
  background: #FFFFFF;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid #CBD5E1;
  gap: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.mode-switch-btn {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  background: transparent;
  color: #64748B;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.mode-switch-btn:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.mode-switch-btn.active {
  background: #0F172A;
  color: #FFFFFF;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2);
}

/* --------------------------------------------------------------------------
   Clean & Simple Single Student Card Styles
   -------------------------------------------------------------------------- */
.single-student-clean-wrapper {
  margin-top: 4px;
}

.single-student-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px 28px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.student-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.student-profile-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.student-profile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #E2E8F0;
}

.student-profile-headings {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.student-name-status-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.student-profile-name {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}

.student-profile-degree {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 600;
  margin: 0;
}

.student-profile-college {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.student-profile-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Details Grid */
.student-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px 24px;
}

@media (max-width: 680px) {
  .student-details-grid {
    grid-template-columns: 1fr;
  }
}

.student-detail-field {
  display: flex;
  flex-direction: column;
  gap: 3px;
  background: var(--bg-subtle);
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid #F1F5F9;
}

.field-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-value {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-primary);
}

.field-link {
  font-size: 13.5px;
  font-weight: 600;
  color: #2563EB;
  text-decoration: none;
}

.field-link:hover {
  text-decoration: underline;
}

/* --------------------------------------------------------------------------
   Single Student Hero Spotlight Card (Legacy / Alternative)
   -------------------------------------------------------------------------- */
.single-hero-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow: hidden;
}

.single-hero-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FACC15 0%, #10B981 100%);
}

.single-hero-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.single-hero-profile {
  display: flex;
  align-items: center;
  gap: 20px;
}

.single-hero-avatar-wrap {
  position: relative;
}

.single-hero-avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #FFFFFF;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.single-hero-avatar-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: #10B981;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #FFFFFF;
}

.single-hero-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.single-hero-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.single-hero-name {
  font-size: 22px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.3px;
}

.single-hero-meta {
  font-size: 14px;
  color: #475569;
  font-weight: 600;
}

.single-hero-institution {
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
}

.single-hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: center;
  flex-wrap: wrap;
}

.btn-start-review {
  background: #FACC15;
  color: #0F172A;
  border: none;
  font-size: 14px;
  font-weight: 800;
  padding: 12px 22px;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(250, 204, 21, 0.4);
  transition: all 0.2s ease;
}

.btn-start-review:hover {
  background: #EAB308;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(250, 204, 21, 0.5);
}

.btn-student-view {
  background: #FFFFFF;
  color: #334155;
  border: 1px solid #CBD5E1;
  font-size: 13px;
  font-weight: 700;
  padding: 11px 18px;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}

.btn-student-view:hover {
  background: #F8FAFC;
  border-color: #94A3B8;
  color: #0F172A;
}

/* Contact Pills Strip */
.single-contact-strip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid #F1F5F9;
}

.contact-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  background: #F8FAFC;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid #E2E8F0;
  text-decoration: none;
  transition: all 0.15s ease;
}

.contact-pill:hover {
  background: #F1F5F9;
  color: #0F172A;
  border-color: #CBD5E1;
}

/* --------------------------------------------------------------------------
   Single Student 3-Card Grid
   -------------------------------------------------------------------------- */
.single-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

@media (max-width: 960px) {
  .single-meta-grid {
    grid-template-columns: 1fr;
  }
}

.single-detail-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.single-detail-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #F1F5F9;
}

.single-card-title {
  font-size: 14px;
  font-weight: 800;
  color: #0F172A;
  display: flex;
  align-items: center;
  gap: 8px;
}

.single-card-badge {
  font-size: 11px;
  font-weight: 700;
  color: #854D0E;
  background: #FEF08A;
  padding: 2px 8px;
  border-radius: 9999px;
}

/* Checklist Items */
.single-subtopic-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.single-subtopic-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 12px;
}

.subtopic-check-icon {
  color: #10B981;
  margin-top: 2px;
  flex-shrink: 0;
}

.subtopic-text-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.subtopic-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.subtopic-name {
  font-weight: 700;
  color: #1E293B;
}

.subtopic-cat-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
}

.subtopic-cat-badge.must_fix {
  background: #FEE2E2;
  color: #B91C1C;
}

.subtopic-cat-badge.suggestion {
  background: #E0F2FE;
  color: #0369A1;
}

.subtopic-cat-badge.praise {
  background: #DCFCE7;
  color: #15803D;
}

.subtopic-cmd {
  font-size: 11.5px;
  color: #64748B;
  line-height: 1.4;
}

/* Readiness & Score Card */
.readiness-score-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFBEB;
  border: 1px solid #FEF08A;
  border-radius: 10px;
  padding: 14px 18px;
}

.score-number {
  font-size: 26px;
  font-weight: 900;
  color: #854D0E;
}

.score-sub {
  font-size: 11px;
  font-weight: 600;
  color: #A16207;
}

.skills-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag-pill {
  font-size: 11px;
  font-weight: 600;
  background: #F1F5F9;
  color: #334155;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid #E2E8F0;
}

/* Mentor Instructions Card */
.mentor-directive-box {
  background: #F8FAFC;
  border: 1px dashed #CBD5E1;
  border-radius: 8px;
  padding: 12px;
  font-size: 12.5px;
  color: #475569;
  line-height: 1.5;
}

.directive-point {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}

.directive-point:last-child {
  margin-bottom: 0;
}

/* Cohort Badge on Group Cards */
.cohort-tag-pill {
  font-size: 10.5px;
  font-weight: 700;
  color: #2563EB;
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  padding: 2px 7px;
  border-radius: 4px;
}

`;

export const DashboardStyles: React.FC = () => {
  return <style>{styles}</style>;
};
