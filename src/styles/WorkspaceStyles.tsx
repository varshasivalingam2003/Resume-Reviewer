import React from 'react';

const styles = `/* Resume Review Workspace Styles */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.workspace-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: #F1F5F9;
}

/* Top Action & Breadcrumb Bar */
.workspace-top-bar {
  height: 56px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 50;
  flex-shrink: 0;
}

.workspace-left-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.workspace-back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-fast);
}

.workspace-back-btn:hover {
  background: var(--bg-subtle);
  color: var(--text-primary);
}

.workspace-student-title-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.workspace-student-name {
  font-size: 17px;
  font-weight: 800;
  color: var(--text-primary);
}

.workspace-student-degree {
  font-size: 12.5px;
  color: #64748B;
  background: #F1F5F9;
  border: 1px solid #E2E8F0;
  padding: 3px 10px;
  border-radius: 6px;
  font-weight: 500;
}

.workspace-top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Dual Pane Layout */
.workspace-dual-pane {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left Pane: Resume Document Viewer */
.resume-viewer-pane {
  flex: 1.25;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #0F172A;
  overflow: hidden;
  border-right: 1px solid var(--border-color);
  position: relative;
}

/* Resume Document Control Bar */
.resume-toolbar {
  height: 48px;
  background: #FFFFFF;
  border-bottom: 1px solid var(--border-color);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.resume-file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 0;
}

.resume-filename {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pdf-icon-badge {
  color: #EF4444;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.resume-view-controls {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.page-navigator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  white-space: nowrap;
}

.page-indicator-text {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  min-width: 36px;
  text-align: center;
}

.zoom-indicator-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  min-width: 38px;
  text-align: center;
}

.page-nav-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 12px;
  transition: var(--transition-fast);
}

.page-nav-btn:hover:not(:disabled) {
  background: var(--bg-subtle);
}

.page-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.zoom-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 700;
  color: var(--text-primary);
}

.zoom-btn:hover {
  background: var(--bg-subtle);
}

.toolbar-action-icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
}

.toolbar-action-icon-btn:hover {
  background: var(--bg-subtle);
  color: var(--text-primary);
}

.highlight-toggle-chip {
  background: #FEF08A;
  color: #854D0E;
  border: 1px solid #EAB308;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

/* Resume Document Paper Canvas: Perfectly Centered & Prominent */
.resume-scroll-canvas {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  padding: 36px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #E2E8F0;
  position: relative;
}

.resume-paper {
  background: #FFFFFF;
  width: 820px;
  max-width: 95%;
  min-height: 1060px;
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.14), 0 2px 6px rgba(0, 0, 0, 0.04);
  border-radius: 6px;
  padding: 48px 56px;
  position: relative;
  font-family: var(--font-main);
  transition: transform 0.2s ease, width 0.2s ease;
  transform-origin: top center;
  margin: 0 auto;
}

/* Resume Document Sections */
.resume-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1.5px solid #CBD5E1;
  position: relative;
}

.resume-name {
  font-size: 26px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.resume-target-title {
  font-size: 14px;
  font-weight: 600;
  color: #64748B;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.resume-contact-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  color: #475569;
}

.resume-contact-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.resume-section {
  margin-bottom: 20px;
  position: relative;
  transition: all var(--transition-fast);
  border-radius: 6px;
  padding: 4px 6px;
}

.resume-section.has-volunteer-highlight {
  background: rgba(254, 240, 138, 0.22);
  border-left: 3px solid #EAB308;
  padding-left: 10px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clean-doc-highlight-pill {
  font-size: 10px;
  font-weight: 700;
  color: #92400E;
  background: #FEF3C7;
  border: 1px solid #FDE68A;
  padding: 2px 8px;
  border-radius: 9999px;
  margin-left: 8px;
  text-transform: none;
  letter-spacing: 0;
  vertical-align: middle;
}

.resume-section-title {
  font-size: 13px;
  font-weight: 800;
  color: #1E293B;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #E2E8F0;
  padding-bottom: 4px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.resume-section-title .section-indicator {
  font-size: 11px;
  font-weight: 600;
  color: #94A3B8;
  text-transform: none;
}

.resume-section p {
  font-size: 13px;
  color: #334155;
  line-height: 1.6;
}

/* Education & Project Entries */
.resume-entry {
  margin-bottom: 12px;
}

.resume-entry-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 3px;
}

.entry-title {
  font-size: 13px;
  font-weight: 700;
  color: #0F172A;
}

.entry-org {
  font-size: 12px;
  color: #475569;
  font-weight: 500;
}

.entry-date {
  font-size: 12px;
  color: #64748B;
  font-weight: 600;
}

.entry-score {
  font-size: 12px;
  color: #059669;
  font-weight: 700;
}

.resume-skills-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-chip {
  background: #F1F5F9;
  border: 1px solid #E2E8F0;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  color: #334155;
}

/* ===================================================
   RESUME COMMENT HIGHLIGHTS (USER REQUIREMENT)
   "the comments of the resume that should be highlighted in the page"
   =================================================== */

.resume-highlight-zone {
  position: relative;
  background: var(--highlight-bg);
  border: 1.5px dashed var(--highlight-border);
  border-radius: 8px;
  padding: 8px 12px;
  margin: 6px 0;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.resume-highlight-zone:hover {
  background: var(--highlight-active-bg);
  border-color: var(--highlight-active-border);
  box-shadow: 0 2px 8px rgba(234, 179, 8, 0.25);
}

.resume-highlight-zone.is-active {
  background: #FEF08A;
  border-color: #CA8A04;
  border-style: solid;
  border-width: 2px;
  box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.4);
  animation: pulseHighlight 2s infinite;
}

@keyframes pulseHighlight {
  0% { box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.5); }
  70% { box-shadow: 0 0 0 6px rgba(250, 204, 21, 0); }
  100% { box-shadow: 0 0 0 0 rgba(250, 204, 21, 0); }
}

.highlight-comment-pin {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #FEF08A;
  color: #854D0E;
  border: 1px solid #EAB308;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.highlight-comment-bubble {
  position: absolute;
  top: -12px;
  right: 12px;
  background: #854D0E;
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: transform var(--transition-fast);
}

.resume-highlight-zone:hover .highlight-comment-bubble {
  transform: scale(1.05);
}

.highlight-comment-text {
  font-size: 12px;
  color: #713F12;
  font-weight: 600;
  line-height: 1.4;
}

/* Right Pane: Review & Feedback Panel */
.review-feedback-pane {
  flex: 1;
  background: var(--bg-card);
  overflow-y: auto;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Review Panel Header / Student Card */
.review-student-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.review-student-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-student-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.review-student-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.review-student-sub {
  font-size: 12px;
  color: var(--text-secondary);
}

/* Review Progress Section */
.review-progress-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.review-progress-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.review-progress-count {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
}

.review-progress-bar {
  width: 100%;
  height: 6px;
  background: #E2E8F0;
  border-radius: var(--radius-full);
  overflow: hidden;
}

.review-progress-fill {
  height: 100%;
  background: var(--primary-yellow);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

/* Section Checklist */
.section-checklist {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-check-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: #FFFFFF;
}

.section-check-item:hover {
  background: #FEFCE8;
  border-color: #FEF08A;
}

.section-check-item.active {
  background: #FFFBEB;
  border-color: #FDE047;
  box-shadow: 0 0 0 2px var(--primary-yellow-glow);
}

.section-check-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-check-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: transparent;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.section-check-circle.checked {
  background: #10B981;
  border-color: #10B981;
  color: #FFFFFF;
}

.section-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.section-comment-badge-count {
  font-size: 11px;
  font-weight: 700;
  color: #854D0E;
  background: #FEF08A;
  padding: 2px 7px;
  border-radius: var(--radius-full);
}

/* Section Active Feedback Editor Dropdown */
.section-inline-editor {
  margin-top: 6px;
  padding: 10px 12px;
  background: #FFFDF5;
  border: 1px solid #FEF08A;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-inline-textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #CBD5E1;
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 12px;
  resize: vertical;
  min-height: 52px;
}

.section-inline-textarea:focus {
  outline: none;
  border-color: var(--primary-yellow);
}

.section-inline-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-toggle-reviewed {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #CBD5E1;
  background: #FFFFFF;
}

/* Rating Section */
.review-rating-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-section-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

/* Improve Tags Chips */
.improve-tags-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.improve-chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.improve-chip {
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

.improve-chip:hover {
  background: var(--bg-subtle);
  border-color: #CBD5E1;
}

.improve-chip.selected {
  background: var(--primary-yellow);
  border-color: var(--primary-yellow-hover);
  color: #0F172A;
  box-shadow: 0 1px 4px rgba(250, 204, 21, 0.4);
}

/* Feedback Textarea Box */
.review-feedback-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feedback-textarea {
  width: 100%;
  min-height: 84px;
  padding: 12px;
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.5;
  resize: vertical;
  background: #FFFFFF;
  transition: all var(--transition-fast);
}

.feedback-textarea:focus {
  outline: none;
  border-color: var(--primary-yellow);
  box-shadow: 0 0 0 3px var(--primary-yellow-glow);
}

/* Bottom Action Buttons */
.review-action-buttons {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 12px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

/* ========================================================
   VOLUNTEER-DEFINED SUBTOPICS & DYNAMIC COMMAND HIGHLIGHTING
   ======================================================== */

.canvas-section-action-btn {
  background: #F8FAFC;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-transform: none;
  letter-spacing: normal;
}

.canvas-section-action-btn:hover {
  background: var(--primary-yellow-light);
  border-color: #EAB308;
  color: #854D0E;
}

.canvas-section-action-btn.active {
  background: var(--primary-yellow);
  border-color: #CA8A04;
  color: #0F172A;
  box-shadow: 0 1px 4px rgba(250, 204, 21, 0.4);
}

.define-subtopic-box {
  background: #FFFBEB;
  border: 1.5px solid #FDE047;
  border-radius: var(--radius-md);
  padding: 14px;
  margin-bottom: 12px;
  animation: fadeIn 0.2s ease-out;
}

.suggested-section-chip {
  background: #FFFFFF;
  border: 1px solid #FEF08A;
  border-radius: var(--radius-full);
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #854D0E;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.suggested-section-chip:hover {
  background: var(--primary-yellow);
  color: #0F172A;
}

.volunteer-subtopic-card {
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  margin-bottom: 8px;
}

.volunteer-subtopic-card:hover {
  border-color: #CBD5E1;
}

.subtopic-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #FAFAFA;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.subtopic-card-header.active {
  background: #FEF9C3;
  border-color: #FEF08A;
}

.subtopic-card-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.subtopic-card-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.subtopic-highlight-toggle {
  background: #F1F5F9;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.subtopic-highlight-toggle:hover {
  background: #FEF08A;
  color: #854D0E;
}

.subtopic-highlight-toggle.highlighted {
  background: #FEF08A;
  border-color: #EAB308;
  color: #854D0E;
  box-shadow: 0 1px 3px rgba(234, 179, 8, 0.3);
}

.subtopic-delete-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all var(--transition-fast);
}

.subtopic-delete-btn:hover {
  background: #FEE2E2;
  color: #EF4444;
}

.subtopic-command-box {
  padding: 10px 14px 12px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.subtopic-command-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.subtopic-command-input {
  width: 100%;
  min-height: 54px;
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 12px;
  color: var(--text-primary);
  line-height: 1.4;
  resize: vertical;
  background: #FAFAFA;
  transition: all var(--transition-fast);
}

.subtopic-command-input:focus {
  outline: none;
  background: #FFFFFF;
  border-color: var(--primary-yellow-hover);
  box-shadow: 0 0 0 2px var(--primary-yellow-glow);
}

.command-suggestions-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 2px;
}

.cmd-pill {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 4px;
  padding: 2px 7px;
  font-size: 10px;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.cmd-pill:hover {
  background: #FEF08A;
  border-color: #EAB308;
  color: #854D0E;
}

.no-subtopics-placeholder {
  background: #FFFFFF;
  border: 1.5px dashed var(--border-color);
  border-radius: var(--radius-md);
  padding: 24px 16px;
  text-align: center;
  color: var(--text-secondary);
}

/* ==========================================================================
   MULTI-METHOD COMMENTING TOOLS STYLES
   ========================================================================== */

/* Comment Tools Top Panel Container */
.comment-feedback-tools-panel {
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0 !important;
  width: 100%;
  box-sizing: border-box;
}

.comment-tools-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.comment-tools-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.comment-tools-badge-icon {
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #FEF9C3;
  border: 1px solid #FDE047;
  border-radius: 9px;
  flex-shrink: 0;
}

.comment-tools-main-title {
  font-size: 13px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.2px;
}

.comment-tools-sub-title {
  font-size: 11px;
  color: #64748B;
  font-weight: 500;
}

.comment-tools-current-mode-pill {
  font-size: 11px;
  color: #854D0E;
  background: #FEF08A;
  border: 1px solid #FACC15;
  padding: 4px 10px;
  border-radius: 9999px;
  font-weight: 600;
  white-space: nowrap;
}

.comment-tools-current-mode-pill strong {
  color: #713F12;
  font-weight: 800;
}

/* Comment Tool Mode Navigation Bar - Modern segmented grid control */
.commenting-tools-tabs {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3px;
  background: #F1F5F9;
  padding: 3px;
  border-radius: 9px;
  border: 1px solid #E2E8F0;
  width: 100%;
  box-sizing: border-box;
}

.comment-tool-tab {
  min-width: 0;
  height: 34px;
  padding: 4px 3px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid transparent;
  background: transparent;
  color: #64748B;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  box-shadow: none;
  transition: all 0.15s ease;
  box-sizing: border-box;
  overflow: hidden;
}

.comment-tool-tab:hover {
  background: rgba(255, 255, 255, 0.7);
  color: #0F172A;
}

.comment-tool-tab.active {
  background: #FFFFFF;
  color: #0F172A;
  border-color: rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  font-weight: 700;
}

.tab-icon {
  font-size: 12.5px;
  line-height: 1;
  flex-shrink: 0;
}

.tab-label {
  font-size: 11px;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-count-pill {
  font-size: 9px;
  font-weight: 700;
  background: #E2E8F0;
  color: #475569;
  padding: 1px 4px;
  border-radius: 9999px;
  line-height: 1.2;
  flex-shrink: 0;
}

.comment-tool-tab.active .tab-count-pill {
  background: #FEF08A;
  color: #854D0E;
}

.tab-saved-dot {
  font-size: 9px;
  font-weight: 700;
  color: #15803D;
  background: #DCFCE7;
  padding: 1px 4px;
  border-radius: 9999px;
  line-height: 1.2;
  flex-shrink: 0;
}

.comment-tool-tab.active .tab-saved-dot {
  background: #22C55E;
  color: #FFFFFF;
}

/* Severity & Category Badges */
.category-pill-group {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
}

.cat-select-btn {
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  background: #F1F5F9;
  color: #64748B;
  transition: all 0.15s ease;
}

.cat-select-btn:hover {
  filter: brightness(0.95);
}

.cat-select-btn.active.cat-suggestion {
  background: #E0F2FE;
  color: #0369A1;
  border-color: #7DD3FC;
}

.cat-select-btn.active.cat-must_fix {
  background: #FEE2E2;
  color: #B91C1C;
  border-color: #FCA5A5;
}

.cat-select-btn.active.cat-praise {
  background: #DCFCE7;
  color: #15803D;
  border-color: #86EFAC;
}

.cat-select-btn.active.cat-question {
  background: #F3E8FF;
  color: #7E22CE;
  border-color: #D8B4FE;
}

.subtopic-badge {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.badge-suggestion { background: #E0F2FE; color: #0369A1; border: 1px solid #BAE6FD; }
.badge-must_fix { background: #FEE2E2; color: #B91C1C; border: 1px solid #FECACA; }
.badge-praise { background: #DCFCE7; color: #15803D; border: 1px solid #BBF7D0; }
.badge-question { background: #F3E8FF; color: #7E22CE; border: 1px solid #E9D5FF; }

/* 4-Stage Guided Mentor Audit Styles */
.mentor-audit-card {
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.audit-stage-stepper-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  background: #F1F5F9;
  padding: 3px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  width: 100%;
  box-sizing: border-box;
}

.audit-stage-pill-btn {
  width: 100%;
  min-width: 0;
  padding: 6px 3px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid transparent;
  background: transparent;
  color: #64748B;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
}

.audit-stage-pill-btn.active {
  background: #FFFFFF;
  color: #0F172A;
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.mentor-stage-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #F1F5F9;
}

.mentor-stage-icon {
  font-size: 22px;
}

.mentor-stage-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 2px 0;
}

.mentor-stage-desc {
  font-size: 11.5px;
  color: #64748B;
  margin: 0;
  line-height: 1.4;
}

.audit-verdict-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  width: 100%;
  box-sizing: border-box;
}

.audit-verdict-card {
  width: 100%;
  min-width: 0;
  padding: 8px 6px;
  border-radius: 7px;
  border: 1px solid #CBD5E1;
  background: #FFFFFF;
  color: #475569;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
}

.audit-verdict-card:hover {
  background: #F8FAFC;
  border-color: #94A3B8;
}

.audit-verdict-card.selected {
  background: #0F172A;
  color: #FFFFFF;
  border-color: #0F172A;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.2);
}

.mentor-stage-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mentor-stage-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 2px;
}

.mentor-stage-label {
  font-size: 11px;
  font-weight: 800;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mentor-stage-sync-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 700;
  color: #2563EB;
  background: #EFF6FF;
  border: 1px solid #DBEAFE;
  padding: 2px 7px;
  border-radius: 999px;
  letter-spacing: 0.01em;
}

.mentor-sync-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2563EB;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  display: inline-block;
  animation: mentorSyncPulse 2s infinite ease-in-out;
}

@keyframes mentorSyncPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(0.85); }
}

/* Unified Action Row & Custom Dropdown */
.mentor-section-action-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.mentor-select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  width: 100%;
}

.mentor-stage-select {
  width: 100%;
  height: 38px;
  line-height: 38px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #FFFFFF;
  border: 1.5px solid #CBD5E1;
  border-radius: 8px;
  padding: 0 34px 0 12px;
  font-size: 12.5px;
  font-weight: 600;
  color: #0F172A;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  box-sizing: border-box;
}

.mentor-stage-select:hover {
  border-color: #94A3B8;
  background-color: #F8FAFC;
}

.mentor-stage-select:focus {
  outline: none;
  border-color: #2563EB;
  background-color: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.mentor-select-chevron {
  position: absolute;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #64748B;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.mentor-select-wrapper:hover .mentor-select-chevron {
  color: #0F172A;
}

/* Canvas Highlight Action Button */
.mentor-canvas-highlight-btn {
  height: 38px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 8px;
  border: 1.5px solid #CBD5E1;
  background: #F8FAFC;
  color: #1E293B;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.mentor-canvas-highlight-btn:hover {
  background: #0F172A;
  border-color: #0F172A;
  color: #FFFFFF;
  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.16);
  transform: translateY(-1px);
}

.mentor-canvas-highlight-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}


.mentor-stage-textarea {
  width: 100%;
  border: 1px solid #CBD5E1;
  border-radius: 7px;
  padding: 8px 10px;
  font-size: 12px;
  color: #0F172A;
  font-family: inherit;
  resize: vertical;
  line-height: 1.45;
  background: #FFFFFF;
}

.mentor-stage-textarea:focus {
  outline: none;
  border-color: #EAB308;
  box-shadow: 0 0 0 2px rgba(234, 179, 8, 0.2);
}

.mentor-stage-input {
  width: 100%;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 12px;
  color: #0F172A;
  font-family: inherit;
}

.mentor-stage-input:focus {
  outline: none;
  border-color: #EAB308;
}

.mentor-stage-nav-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #F1F5F9;
}

.btn-stage-nav {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 6px;
  border: 1px solid #CBD5E1;
  background: #FFFFFF;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-stage-nav:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.btn-apply-audit {
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 6px;
  border: none;
  background: #16A34A;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s ease;
}

.btn-apply-audit:hover {
  background: #15803D;
}

/* Suggestion Rewrite / Diff Tool */
.rewrite-tool-card {
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.diff-box-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.diff-box {
  border-radius: 8px;
  padding: 10px 12px;
}

.diff-box.before {
  background: #FEF2F2;
  border: 1px solid #FECACA;
}

.diff-box.after {
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
}

.diff-label {
  font-size: 10.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.diff-box.before .diff-label { color: #991B1B; }
.diff-box.after .diff-label { color: #166534; }

/* Voice Feedback Note Recorder */
.voice-memo-panel {
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.voice-recording-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
}

.voice-mic-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #F1F5F9;
  border: 2px solid #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.voice-mic-circle.recording {
  background: #FEE2E2;
  border-color: #EF4444;
  animation: micPulse 1.5s infinite;
}

@keyframes micPulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 14px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.waveform-display {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 32px;
  padding: 0 10px;
}

.wave-bar {
  width: 3px;
  height: 8px;
  background: #94A3B8;
  border-radius: 2px;
}

.wave-bar.active {
  background: #EAB308;
  animation: waveEqualizer 0.8s ease-in-out infinite alternate;
}

@keyframes waveEqualizer {
  0% { height: 6px; }
  100% { height: 28px; }
}

/* Voice Target Selector & Directory */
.voice-target-selector-box {
  background: #FFFBEB;
  border: 1px solid #FEF08A;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 12px;
}

.limit-pill-btn {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 6px;
  border: 1px solid #CBD5E1;
  background: #FFFFFF;
  color: #475569;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.limit-pill-btn:hover:not(:disabled) {
  background: #F8FAFC;
  border-color: #EAB308;
  color: #854D0E;
}

.limit-pill-btn.active {
  background: #0F172A;
  color: #FFFFFF;
  border-color: #0F172A;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.2);
}

.limit-pill-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.all-recorded-voice-notes-box {
  margin-top: 16px;
  padding: 12px 14px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
}

.voice-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  background: #FFFFFF;
  border: 1px solid #CBD5E1;
  border-radius: 7px;
  transition: all var(--transition-fast);
}

.voice-list-item.active-target {
  border-color: #EAB308;
  background: #FEFCE8;
  box-shadow: 0 0 0 1px #EAB308;
}

/* Subtopic Card Voice Elements */
.subtopic-voice-row {
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px dashed #E2E8F0;
}

.subtopic-voice-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 8px;
  padding: 6px 10px;
}

.subtopic-voice-action-btn {
  background: #FFFFFF;
  border: 1px solid #86EFAC;
  color: #166534;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.subtopic-voice-action-btn:hover {
  background: #DCFCE7;
}

.subtopic-voice-action-btn.record-again {
  border-color: #CBD5E1;
  color: #475569;
}

.subtopic-voice-action-btn.delete {
  border-color: #FECACA;
  color: #DC2626;
  background: #FEF2F2;
}

.subtopic-voice-action-btn.delete:hover {
  background: #FEE2E2;
}

.btn-attach-subtopic-voice {
  background: transparent;
  border: 1px dashed #CBD5E1;
  color: #64748B;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  transition: all var(--transition-fast);
}

.btn-attach-subtopic-voice:hover {
  background: #F8FAFC;
  border-color: #EAB308;
  color: #854D0E;
}

/* Evaluation Rubric Scorecard */
.rubric-panel {
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.rubric-header-score {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 10px 14px;
}

.rubric-criterion-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 10px;
  border-bottom: 1px solid #F1F5F9;
}

.rubric-criterion-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.rubric-stars-selector {
  display: flex;
  gap: 6px;
}

.rubric-score-pill {
  flex: 1;
  padding: 6px 4px;
  font-size: 11.5px;
  font-weight: 600;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  background: #F8FAFC;
  color: #64748B;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}

.rubric-score-pill:hover {
  background: #F1F5F9;
  color: #0F172A;
  border-color: #CBD5E1;
}

.rubric-score-pill.active {
  background: #FEF08A;
  border-color: #EAB308;
  color: #854D0E;
  font-weight: 800;
}

/* ==========================================================================
   INTERACTIVE PENCIL BUTTONS & REVIEW DIALOGUE BOX (NO SIDE PANEL)
   ========================================================================== */

/* Resume Section Header with Pencil Action */
.resume-section-title-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  position: relative;
}

.resume-section-title-wrap .resume-section-title {
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.section-pencil-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 6px;
  background: #F8FAFC;
  color: #64748B;
  border: 1px solid #CBD5E1;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.15s ease;
}

.section-pencil-btn:hover {
  background: #EFF6FF;
  color: #2563EB;
  border-color: #93C5FD;
}

.section-pencil-btn.is-active-open {
  background: #2563EB;
  color: #FFFFFF;
  border-color: #2563EB;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
}

.section-pencil-btn.has-notes {
  background: #EFF6FF;
  color: #1D4ED8;
  border-color: #BFDBFE;
}

.section-pencil-btn.has-notes:hover {
  background: #DBEAFE;
  color: #1E40AF;
}

/* Top Toolbar Pencil Button */
.toolbar-pencil-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  background: #EFF6FF;
  color: #2563EB;
  border: 1px solid #BFDBFE;
  cursor: pointer;
  transition: all 0.15s ease;
}

.toolbar-pencil-action-btn:hover {
  background: #DBEAFE;
  color: #1D4ED8;
  border-color: #93C5FD;
}

/* Floating Pencil FAB */
.floating-pencil-fab {
  position: fixed;
  bottom: 26px;
  right: 28px;
  background: linear-gradient(135deg, #2563EB, #1D4ED8);
  color: #FFFFFF;
  border: none;
  border-radius: 50px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.45);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 80;
}

.floating-pencil-fab:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 14px 30px -5px rgba(37, 99, 235, 0.55);
}

/* Review Dialogue Box (Modal) */
.review-dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: modalFadeIn 0.2s ease-out;
}

.review-dialog-modal {
  background: #FFFFFF;
  width: 100%;
  max-width: 660px;
  max-height: 92vh;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #E2E8F0;
  animation: modalSlideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.review-dialog-header {
  padding: 16px 22px;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.review-dialog-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-dialog-title {
  font-size: 16px;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
}

.review-dialog-close-btn {
  background: transparent;
  border: none;
  color: #64748B;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.review-dialog-close-btn:hover {
  background: #E2E8F0;
  color: #0F172A;
}

.review-dialog-body {
  padding: 18px 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dialog-target-selector {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dialog-target-label {
  font-size: 11px;
  font-weight: 800;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dialog-mode-tabs {
  display: flex;
  background: #F1F5F9;
  padding: 4px;
  border-radius: 10px;
  gap: 4px;
}

.dialog-mode-tab {
  flex: 1;
  padding: 8px 12px;
  font-size: 12.5px;
  font-weight: 700;
  color: #64748B;
  border: none;
  background: transparent;
  border-radius: 7px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s ease;
}

.dialog-mode-tab:hover {
  color: #0F172A;
}

.dialog-mode-tab.active {
  background: #FFFFFF;
  color: #2563EB;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.voice-record-card {
  background: #F8FAFC;
  border: 1.5px dashed #CBD5E1;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s ease;
}

.voice-record-card.is-recording {
  background: #FEF2F2;
  border-color: #F87171;
  border-style: solid;
}

.live-transcript-badge {
  font-size: 11px;
  font-weight: 700;
  color: #059669;
  background: #D1FAE5;
  padding: 2px 8px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.live-transcript-pulse {
  width: 7px;
  height: 7px;
  background: #10B981;
  border-radius: 50%;
  animation: pulse 1.2s infinite;
}

.review-dialog-footer {
  padding: 14px 22px;
  background: #F8FAFC;
  border-top: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

/* ==========================================================================
   CLEAN INLINE REVIEW CARD (Modern, Minimalist, Volunteer-Friendly)
   ========================================================================== */
.clean-inline-card {
  margin: 12px 0 16px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: cleanCardFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
  position: relative;
  z-index: 10;
}

@keyframes cleanCardFadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.clean-inline-header {
  padding: 10px 16px;
  background: #F8FAFC;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.clean-inline-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clean-inline-icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: #EFF6FF;
  color: #2563EB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.clean-inline-title {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.clean-inline-title span {
  font-weight: 700;
  color: #0F172A;
}

.clean-inline-subtitle {
  font-size: 11px;
  color: #94A3B8;
}

.clean-inline-close-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #94A3B8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.clean-inline-close-btn:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.clean-inline-body {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Category Pills Row */
.clean-category-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clean-field-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.clean-pills-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.clean-cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  background: #F8FAFC;
  color: #64748B;
  transition: all 0.15s ease;
}

.clean-cat-pill:hover {
  background: #F1F5F9;
  color: #334155;
}

.clean-cat-pill.pill-suggestion.selected {
  background: #FEF3C7;
  color: #B45309;
  border-color: #FCD34D;
}

.clean-cat-pill.pill-mustfix.selected {
  background: #FEE2E2;
  color: #DC2626;
  border-color: #FCA5A5;
}

.clean-cat-pill.pill-praise.selected {
  background: #DCFCE7;
  color: #16A34A;
  border-color: #86EFAC;
}

/* Textarea & Integrated Dictation Toolbar */
.clean-input-box {
  border: 1px solid #CBD5E1;
  border-radius: 10px;
  background: #FFFFFF;
  overflow: hidden;
  transition: all 0.15s ease;
}

.clean-input-box:focus-within {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.clean-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px 6px;
  border: none;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
  color: #0F172A;
  background: transparent;
  resize: vertical;
  min-height: 64px;
}

.clean-textarea:focus {
  outline: none;
}

.clean-textarea::placeholder {
  color: #94A3B8;
}

.clean-textarea-toolbar {
  padding: 6px 10px 8px;
  background: #F8FAFC;
  border-top: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.clean-voice-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 600;
  border: 1px solid #BFDBFE;
  background: #EFF6FF;
  color: #2563EB;
  cursor: pointer;
  transition: all 0.15s ease;
}

.clean-voice-btn:hover {
  background: #DBEAFE;
  border-color: #93C5FD;
}

.clean-voice-btn.recording {
  background: #FEE2E2;
  border-color: #FCA5A5;
  color: #DC2626;
  animation: voicePulse 1.5s infinite;
}

@keyframes voicePulse {
  0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.3); }
  70% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); }
  100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
}

.clean-voice-duration {
  font-size: 11px;
  font-weight: 700;
  color: #16A34A;
}

.clean-pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #DC2626;
  display: inline-block;
  animation: pulse 1s infinite;
}

.clean-preview-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid #CBD5E1;
  background: #FFFFFF;
  color: #475569;
  cursor: pointer;
}

.clean-preview-btn:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.clean-transcribe-hint {
  font-size: 11px;
  color: #059669;
  font-style: italic;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Expandable Scoring Link */
.clean-expandable-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 2px;
}

.clean-link-btn {
  background: transparent;
  border: none;
  padding: 0;
  font-size: 11.5px;
  font-weight: 600;
  color: #6366F1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color 0.15s ease;
}

.clean-link-btn:hover {
  color: #4338CA;
  text-decoration: underline;
}

/* Candidate Scoring Card */
.clean-scoring-card {
  padding: 12px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.clean-rating-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.clean-star-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 1px;
  display: flex;
  align-items: center;
  transition: transform 0.12s ease;
}

.clean-star-btn:hover {
  transform: scale(1.15);
}

.clean-rating-val {
  font-size: 12px;
  font-weight: 700;
  color: #D97706;
}



.clean-tag-chip {
  padding: 3px 8px;
  font-size: 10.5px;
  font-weight: 600;
  color: #475569;
  background: #FFFFFF;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.clean-tag-chip.selected {
  background: #EFF6FF;
  border-color: #3B82F6;
  color: #1D4ED8;
}

/* Footer: Cancel + Save */
.clean-inline-footer {
  padding: 10px 16px;
  background: #F8FAFC;
  border-top: 1px solid #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.clean-cancel-btn {
  padding: 6px 14px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  background: transparent;
  border: 1px solid #CBD5E1;
  cursor: pointer;
  transition: all 0.15s ease;
}

.clean-cancel-btn:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.clean-save-btn {
  padding: 6px 16px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  color: #FFFFFF;
  background: #2563EB;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
  transition: all 0.15s ease;
}

.clean-save-btn:hover {
  background: #1D4ED8;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.4);
}

/* ==========================================================================
   IN-TAB OLD vs NEW RESUME VERSION SWITCHER (SIDE HEADER)
   ========================================================================== */
.toolbar-divider {
  width: 1px;
  height: 22px;
  background: #CBD5E1;
  margin: 0 6px;
  flex-shrink: 0;
}

.resume-version-toggle-group {
  display: inline-flex;
  align-items: center;
  background: #F1F5F9;
  border: 1.5px solid #CBD5E1;
  padding: 3px;
  border-radius: 8px;
  gap: 3px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
}

.version-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: #64748B;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.version-toggle-btn:hover {
  color: #0F172A;
  background: rgba(255, 255, 255, 0.6);
}

.version-toggle-btn.active-old {
  background: #FFFFFF;
  color: #475569;
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #CBD5E1;
}

.version-toggle-btn.active-new {
  background: #2563EB;
  color: #FFFFFF;
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
}

.resume-version-banner {
  margin: 0 auto 12px;
  max-width: 820px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.2s ease;
}

.resume-version-banner.old {
  background: #F8FAFC;
  border: 1.5px dashed #94A3B8;
}

.resume-version-banner.new {
  background: #F0FDF4;
  border: 1px solid #86EFAC;
}

.version-pill-tag {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 999px;
  white-space: nowrap;
}

.version-pill-tag.old {
  background: #E2E8F0;
  color: #334155;
}

.version-pill-tag.new {
  background: #DCFCE7;
  color: #166534;
}

.btn-switch-version-inline {
  background: #FFFFFF;
  border: 1px solid #CBD5E1;
  color: #2563EB;
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.btn-switch-version-inline:hover {
  background: #EFF6FF;
  border-color: #2563EB;
}

/* ==========================================================================
   SIDEBAR: RESUME VERSION SWITCHER (ON THE SIDE)
   ========================================================================== */
.workspace-version-sidebar {
  width: 260px;
  min-width: 260px;
  background: #FFFFFF;
  border-right: 1px solid #CBD5E1;
  display: flex;
  flex-direction: column;
  transition: width 0.22s ease, min-width 0.22s ease;
  flex-shrink: 0;
  z-index: 10;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);
}

.workspace-version-sidebar.collapsed {
  width: 52px;
  min-width: 52px;
}

.version-sidebar-header {
  height: 48px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E2E8F0;
  background: #F8FAFC;
  flex-shrink: 0;
}

.version-sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #0F172A;
  white-space: nowrap;
}

.version-sidebar-collapse-btn {
  background: transparent;
  border: 1px solid #E2E8F0;
  border-radius: 4px;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
  cursor: pointer;
  transition: all 0.15s ease;
}

.version-sidebar-collapse-btn:hover {
  background: #FFFFFF;
  color: #0F172A;
  border-color: #CBD5E1;
}

.version-sidebar-body {
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.version-sidebar-hint {
  font-size: 11.5px;
  color: #64748B;
  margin: 0;
  line-height: 1.45;
}

.version-switcher-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.version-card {
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  padding: 12px 14px;
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  user-select: none;
  position: relative;
}

.version-card:hover {
  border-color: #94A3B8;
  background: #F8FAFC;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
}

.version-card.active.old {
  border-color: #64748B;
  background: #F8FAFC;
  box-shadow: 0 0 0 2px rgba(100, 116, 139, 0.25);
}

.version-card.active.new {
  border-color: #2563EB;
  background: #F0F7FF;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
}

.version-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.version-card-badge {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 7px;
  border-radius: 6px;
}

.version-card-badge.old {
  background: #E2E8F0;
  color: #475569;
}

.version-card-badge.new {
  background: #DBEAFE;
  color: #1D4ED8;
}

.version-active-dot {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #2563EB;
}

.version-card.active.old .version-active-dot {
  color: #475569;
}

.version-card-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13.5px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 4px;
}

.version-card-desc {
  font-size: 11px;
  color: #64748B;
  margin: 0;
  line-height: 1.4;
}

.version-sidebar-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid #E2E8F0;
}

.version-sidebar-download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #1E293B;
  background: #F1F5F9;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.version-sidebar-download-btn:hover {
  background: #E2E8F0;
  color: #0F172A;
}

.version-sidebar-current-status {
  font-size: 11px;
  color: #64748B;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.version-sidebar-current-status strong {
  color: #0F172A;
  font-size: 12px;
}

/* Collapsed icon bar */
.version-sidebar-collapsed-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 12px 6px;
}

.collapsed-icon-btn {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: 1.5px solid #E2E8F0;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748B;
  transition: all 0.15s ease;
  position: relative;
}

.collapsed-icon-btn:hover {
  background: #F8FAFC;
  color: #0F172A;
  border-color: #94A3B8;
}

.collapsed-icon-btn.active.old {
  border-color: #64748B;
  background: #F1F5F9;
  color: #1E293B;
}

.collapsed-icon-btn.active.new {
  border-color: #2563EB;
  background: #EFF6FF;
  color: #2563EB;
}

/* ==========================================================================
   STUDENT VIEW: VOLUNTEER EDITED PART HIGHLIGHTS & CALLOUTS
   ========================================================================== */
.volunteer-edited-pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #DCFCE7;
  color: #166534;
  border: 1px solid #86EFAC;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0;
  margin-left: 10px;
}

.resume-section.has-volunteer-highlight.is-student-revised {
  background: rgba(240, 253, 244, 0.65);
  border-left: 3.5px solid #10B981;
  padding-left: 14px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.student-revised-callout {
  margin-top: 10px;
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
}

.student-revised-callout .callout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.student-revised-callout .callout-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: #15803D;
  font-size: 11.5px;
}

.student-revised-callout .callout-note {
  color: #334155;
  font-size: 11.5px;
  line-height: 1.45;
  margin-bottom: 6px;
}

.student-revised-callout .callout-diff {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  background: #FFFFFF;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #E2E8F0;
}

.student-revised-callout .diff-tag.old {
  color: #64748B;
}

.student-revised-callout .diff-tag.new {
  color: #0F172A;
}

.student-revised-callout .diff-tag.new strong {
  color: #166534;
}
`;

export const WorkspaceStyles: React.FC = () => {
  return <style>{styles}</style>;
};
