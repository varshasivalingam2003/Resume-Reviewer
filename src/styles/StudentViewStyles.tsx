import React from 'react';

const styles = `/* Student Feedback & Resume Comparison View Styles */
.student-view-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--bg-page);
  min-height: calc(100vh - 68px);
}

/* Save Success Toast */
.student-save-toast {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 9999;
  background: #065F46;
  color: #ECFDF5;
  padding: 12px 20px;
  border-radius: var(--radius-lg);
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid #10B981;
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Student Top Navigation Bar */
.student-top-navbar {
  background: #FFFFFF;
  border-bottom: 1px solid var(--border-color);
  padding: 10px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.student-top-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.student-portal-tag {
  display: block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: #854D0E;
  background: #FEF08A;
  padding: 1px 6px;
  border-radius: 4px;
  width: fit-content;
  margin-top: 1px;
}

.student-nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.student-nav-switcher {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #F8FAFC;
  padding: 4px 10px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.student-account-select {
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  cursor: pointer;
  outline: none;
}

.student-logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #FEE2E2;
  border: 1px solid #FECACA;
  color: #DC2626;
  border-radius: var(--radius-md);
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.student-logout-btn:hover {
  background: #FCA5A5;
  color: #991B1B;
}

.student-otp-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #FFFBEB;
  border: 1px solid #FDE047;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  color: #854D0E;
}

.student-otp-badge-pill strong {
  color: #713F12;
  letter-spacing: 0.5px;
}

/* Header Banner */
.student-header-banner {
  background: #FFFFFF;
  border-bottom: 1px solid var(--border-color);
  padding: 12px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.student-info-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-view-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-yellow);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.student-greeting-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-primary);
}

.student-degree-sub {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Mentor Summary Strip */
.student-mentor-summary-strip {
  background: #F8FAFC;
  border-bottom: 1px solid var(--border-color);
  padding: 10px 28px;
}

.mentor-strip-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.mentor-quote-box {
  flex: 1;
  min-width: 280px;
}

.mentor-badge-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.mentor-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 700;
  color: #0369A1;
  background: #E0F2FE;
  padding: 2px 8px;
  border-radius: 4px;
}

.mentor-feedback-text {
  font-size: 12.5px;
  color: #334155;
  margin: 0;
  line-height: 1.45;
  font-weight: 500;
}

.student-voice-memo-strip {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  padding: 6px 14px;
  border-radius: var(--radius-md);
}

.btn-play-voice-mini {
  background: #16A34A;
  color: #FFFFFF;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s ease;
}

.btn-play-voice-mini:hover {
  background: #15803D;
}

.btn-play-voice-mini.is-playing {
  background: #DC2626;
}

/* Comparison Toolbar */
.comparison-toolbar {
  background: #FFFFFF;
  border-bottom: 1px solid var(--border-color);
  padding: 8px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  flex-shrink: 0;
}

.comparison-mode-selector {
  display: inline-flex;
  background: #F1F5F9;
  padding: 3px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  gap: 2px;
}

.mode-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: #64748B;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mode-tab-btn:hover {
  color: #0F172A;
}

.mode-tab-btn.active {
  background: #FFFFFF;
  color: #0F172A;
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.comparison-toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Side-by-Side Comparison Grid Body */
.comparison-grid-body {
  flex: 1;
  display: grid;
  overflow: hidden;
  background: #0F172A;
  gap: 1px;
}

.comparison-grid-body.side-by-side {
  grid-template-columns: 1fr 1fr;
}

.comparison-grid-body.old,
.comparison-grid-body.new {
  grid-template-columns: 1fr;
}

.comparison-resume-column {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #1E293B;
}

.comparison-resume-column.old-version-col {
  border-right: 1px solid #334155;
}

.comparison-column-header {
  background: #0F172A;
  border-bottom: 1px solid #334155;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.column-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.comparison-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.comparison-badge.old-badge {
  background: #334155;
  color: #F1F5F9;
  border: 1px solid #475569;
}

.comparison-badge.new-badge {
  background: #065F46;
  color: #ECFDF5;
  border: 1px solid #10B981;
}

.comparison-meta-hint {
  font-size: 11px;
  color: #94A3B8;
  font-weight: 500;
}

/* Student Pencil Edit Button */
.student-pencil-edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  color: #1D4ED8;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  text-transform: none;
  letter-spacing: 0;
}

.student-pencil-edit-btn:hover {
  background: #DBEAFE;
  color: #1E40AF;
  border-color: #93C5FD;
  transform: translateY(-1px);
}

/* Student Edit Modal */
.student-edit-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.student-edit-modal-card {
  background: #FFFFFF;
  border-radius: var(--radius-xl);
  max-width: 650px;
  width: 100%;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #E2E8F0;
  overflow: hidden;
  animation: modalScaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.student-edit-modal-header {
  padding: 16px 22px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #F8FAFC;
}

.modal-close-icon-btn {
  background: transparent;
  border: none;
  color: #64748B;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-icon-btn:hover {
  background: #E2E8F0;
  color: #0F172A;
}

.modal-mentor-guidance-box {
  background: #FFFBEB;
  border-bottom: 1px solid #FDE047;
  padding: 10px 22px;
}

.student-edit-modal-body {
  padding: 20px 22px;
  overflow-y: auto;
  flex: 1;
}

.edit-form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-form-label {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sub-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #64748B;
  margin-bottom: 3px;
}

.edit-textarea {
  width: 100%;
  border: 1.5px solid #CBD5E1;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
  color: #0F172A;
  resize: vertical;
  line-height: 1.5;
  transition: border-color 0.15s ease;
}

.edit-textarea:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.character-counter {
  font-size: 11px;
  color: #94A3B8;
  align-self: flex-end;
}

.edit-text-input {
  width: 100%;
  border: 1.5px solid #CBD5E1;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 12.5px;
  color: #0F172A;
  transition: border-color 0.15s ease;
}

.edit-text-input:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12);
}

.editable-chips-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  background: #F8FAFC;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  min-height: 48px;
}

.editable-skill-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #E0E7FF;
  color: #3730A3;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.chip-remove-btn {
  background: transparent;
  border: none;
  color: #4F46E5;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.chip-remove-btn:hover {
  color: #DC2626;
}

.editable-projects-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.editable-project-card {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 12px 14px;
}

.btn-danger-icon {
  background: transparent;
  border: none;
  color: #EF4444;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.btn-danger-icon:hover {
  background: #FEE2E2;
}

.student-edit-modal-footer {
  padding: 14px 22px;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  background: #F8FAFC;
}

/* Responsive side-by-side rules */
@media (max-width: 1024px) {
  .comparison-grid-body.side-by-side {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }

  .comparison-resume-column {
    min-height: 600px;
  }
}
`;

export const StudentViewStyles: React.FC = () => {
  return <style>{styles}</style>;
};
