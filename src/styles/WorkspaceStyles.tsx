import React from 'react';

const styles = `/* Resume Review Workspace Styles */
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
  flex: 1.35;
  display: flex;
  flex-direction: column;
  background: #E2E8F0;
  overflow: hidden;
  border-right: 1px solid #CBD5E1;
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
}

.pdf-icon-badge {
  color: #EF4444;
  display: flex;
  align-items: center;
}

.resume-view-controls {
  display: flex;
  align-items: center;
  gap: 14px;
}

.page-navigator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
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

/* Resume Document Paper Canvas */
.resume-scroll-canvas {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.resume-paper {
  background: #FFFFFF;
  width: 680px;
  min-height: 880px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 40px 48px;
  position: relative;
  font-family: var(--font-main);
  transition: transform 0.2s ease;
  transform-origin: top center;
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





`;

export const WorkspaceStyles: React.FC = () => {
  return <style>{styles}</style>;
};
