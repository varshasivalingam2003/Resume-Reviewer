import React from 'react';

const styles = `/* Modals Styling */

/* Close button */
.modal-close-icon {
  position: absolute;
  top: 18px;
  right: 18px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.modal-close-icon:hover {
  background: var(--bg-subtle);
  color: var(--text-primary);
}

.modal-content-body {
  padding: 36px 32px 28px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Modal Status Icons */
.modal-status-badge-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.modal-status-badge-icon.success {
  background: #D1FAE5;
  color: #10B981;
}

.modal-status-badge-icon.warning {
  background: #FEF3C7;
  color: #F59E0B;
}

.modal-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 12px;
  letter-spacing: -0.4px;
}

.modal-student-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-subtle);
  padding: 4px 14px 4px 6px;
  border-radius: var(--radius-full);
  margin-bottom: 24px;
  border: 1px solid var(--border-color);
}

.modal-student-chip img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.modal-student-chip span {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

/* Approval Summary Table */
.approval-summary-card {
  width: 100%;
  background: #F8FAFC;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  margin-bottom: 24px;
  text-align: left;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-label {
  color: var(--text-secondary);
  font-weight: 600;
}

.summary-value {
  color: var(--text-primary);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Modal Actions Buttons */
.modal-actions-row {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 12px;
}

/* Request Changes Form Details */
.changes-section-wrapper {
  width: 100%;
  text-align: left;
  margin-bottom: 20px;
}

.changes-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
  display: block;
}

.changes-chips-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.changes-chip-item {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border-color);
  background: #FFFFFF;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.changes-chip-item.selected {
  background: var(--primary-yellow);
  border-color: var(--primary-yellow-hover);
  color: #0F172A;
  font-weight: 700;
}

.changes-note-textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 13px;
  resize: vertical;
}

.changes-note-textarea:focus {
  outline: none;
  border-color: var(--primary-yellow);
  box-shadow: 0 0 0 3px var(--primary-yellow-glow);
}
`;

export const ModalsStyles: React.FC = () => {
  return <style>{styles}</style>;
};
