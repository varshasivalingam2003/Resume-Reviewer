import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialStudents, Student, VolunteerSubtopic, ResumeSection } from '../data/studentsData';
import { 
  ArrowLeftIcon, PdfIcon, DownloadIcon, MaximizeIcon, 
  CommentIcon 
} from './Icons';

interface ResumeDocumentPaperProps {
  student: Student;
  pageNum: number;
  activeSection: string;
  volunteerSubtopics: VolunteerSubtopic[];
  onSelectSection: (key: string) => void;
  onQuickHighlight: (key: string, title: string) => void;
}

export const ResumeWorkspaceView: React.FC = () => {
  const { 
    activeStudent,
    setCurrentView,
    activeResumePage,
    setResumePage,
    zoomLevel,
    setZoom,
    activeHighlightSection,
    setActiveHighlightSection,
    mobileTab,
    setMobileTab,
    addVolunteerSubtopic,
    removeVolunteerSubtopic,
    toggleSubtopicHighlight,
    updateSubtopicCommand,
    toggleSubtopicReviewed,
    quickHighlightFromCanvas,
    updateGeneralFeedback,
    setRating,
    toggleImproveTag,
    openModal,
    setActiveRole,
    setSelectedStudentForViewId
  } = useApp();

  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [selectedSectionKey, setSelectedSectionKey] = useState('');
  const [newCommandText, setNewCommandText] = useState('');
  const [isDefiningSubtopic, setIsDefiningSubtopic] = useState(false);

  if (!activeStudent) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Student not found.</div>;
  }

  // Safe fallback to initial student data if LocalStorage had stale/empty data
  const initialStudentData = initialStudents.find(s => s.id === activeStudent.id) || initialStudents[0];
  const volunteerSubtopics = (activeStudent.volunteerSubtopics && activeStudent.volunteerSubtopics.length > 0)
    ? activeStudent.volunteerSubtopics
    : (initialStudentData.volunteerSubtopics || []);

  const reviewedCount = volunteerSubtopics.filter(s => s.isReviewed).length;
  const totalSubtopics = volunteerSubtopics.length;
  const progressPercent = totalSubtopics > 0 ? Math.round((reviewedCount / totalSubtopics) * 100) : 0;

  const resumeSections = (activeStudent.resumeSections && activeStudent.resumeSections.length > 0)
    ? activeStudent.resumeSections
    : (initialStudentData.resumeSections || []);
  const improveTagOptions = [
    'Grammar', 'Formatting', 'Skills', 'Objective', 'Projects', 'Education'
  ];

  const handleAddSubtopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtopicTitle.trim()) return;

    addVolunteerSubtopic(newSubtopicTitle, selectedSectionKey || 'custom', newCommandText);
    setNewSubtopicTitle('');
    setSelectedSectionKey('');
    setNewCommandText('');
    setIsDefiningSubtopic(false);
  };

  const handleQuickSelectSection = (section: ResumeSection) => {
    setNewSubtopicTitle(section.title);
    setSelectedSectionKey(section.key);
    setIsDefiningSubtopic(true);
  };

  const scrollToDocSection = (sectionKey: string) => {
    setActiveHighlightSection(sectionKey);
    const targetDocEl = document.getElementById(`section-doc-${sectionKey}`);
    if (targetDocEl) {
      targetDocEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_review': return 'In Review';
      case 'changes_required': return 'Changes Required';
      case 'approved': return 'Approved';
      default: return status;
    }
  };

  return (
    <div className="workspace-container">
      {/* Top Action Bar */}
      <header className="workspace-top-bar">
        <div className="workspace-left-meta">
          <button 
            className="workspace-back-btn" 
            onClick={() => setCurrentView('dashboard')}
          >
            <ArrowLeftIcon size={16} /> Back
          </button>
          
          <div className="workspace-student-title-box">
            <span className="workspace-student-name">{activeStudent.name}</span>
            <span className={`status-badge status-${activeStudent.status}`}>
              {formatStatus(activeStudent.status)}
            </span>
          </div>
        </div>

        <div className="workspace-top-actions">
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => {
              setSelectedStudentForViewId(activeStudent.id);
              setActiveRole('student');
            }}
            title="Preview how student sees the listed mistakes and feedback"
          >
            🎓 View as Student
          </button>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => alert('Review progress and defined commands saved successfully!')}
          >
            Save
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => openModal('approve')}
          >
            Submit Review
          </button>
        </div>
      </header>

      {/* Mobile Workspace Tab Switcher (Screens 9 & 10) */}
      <div className="mobile-workspace-tabs-bar">
        <div className="mobile-tabs-pill-container">
          <button 
            className={`mobile-tab-btn ${mobileTab === 'resume' ? 'active' : ''}`}
            onClick={() => setMobileTab('resume')}
          >
            📄 Resume
          </button>
          <button 
            className={`mobile-tab-btn ${mobileTab === 'review' ? 'active' : ''}`}
            onClick={() => setMobileTab('review')}
          >
            ✍️ Review ({volunteerSubtopics.length})
          </button>
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="workspace-dual-pane" data-mobile-tab={mobileTab}>
        {/* Left Pane: Resume Document Viewer */}
        <section className="resume-viewer-pane">
          {/* Toolbar */}
          <div className="resume-toolbar">
            <div className="resume-file-info">
              <span className="pdf-icon-badge"><PdfIcon size={18} /></span>
              <span>{activeStudent.name.replace(/\s+/g, '_')}_Resume.pdf</span>
            </div>

            <div className="resume-view-controls">
              {/* Page Navigator */}
              <div className="page-navigator">
                <button 
                  className="page-nav-btn" 
                  onClick={() => setResumePage(activeResumePage - 1)}
                  disabled={activeResumePage <= 1}
                >
                  &lt;
                </button>
                <span>{activeResumePage} / {activeStudent.totalPages || 2}</span>
                <button 
                  className="page-nav-btn" 
                  onClick={() => setResumePage(activeResumePage + 1)}
                  disabled={activeResumePage >= (activeStudent.totalPages || 2)}
                >
                  &gt;
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="zoom-controls">
                <button className="zoom-btn" onClick={() => setZoom(zoomLevel - 10)}>-</button>
                <span style={{ fontSize: '12px', minWidth: '36px', textAlign: 'center' }}>{zoomLevel}%</span>
                <button className="zoom-btn" onClick={() => setZoom(zoomLevel + 10)}>+</button>
              </div>

              <button 
                className="toolbar-action-icon-btn" 
                onClick={() => alert(`Downloading ${activeStudent.name}_Resume.pdf...`)}
                title="Download Resume"
              >
                <DownloadIcon size={16} />
              </button>

              <button 
                className="toolbar-action-icon-btn" 
                onClick={() => setZoom(100)}
                title="Reset Zoom"
              >
                <MaximizeIcon size={16} />
              </button>
            </div>
          </div>

          {/* Document Canvas */}
          <div className="resume-scroll-canvas">
            <div 
              className="resume-paper" 
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              <ResumeDocumentPaper 
                student={activeStudent} 
                pageNum={activeResumePage}
                activeSection={activeHighlightSection}
                volunteerSubtopics={volunteerSubtopics}
                onSelectSection={scrollToDocSection}
                onQuickHighlight={quickHighlightFromCanvas}
              />
            </div>
          </div>
        </section>

        {/* Right Pane: Review & Feedback Panel */}
        <aside className="review-feedback-pane">
          {/* Student Header */}
          <div className="review-student-header">
            <div className="review-student-info">
              <img src={activeStudent.avatar} alt={activeStudent.name} className="review-student-avatar" />
              <div>
                <h2 className="review-student-name">{activeStudent.name}</h2>
                <span className="review-student-sub">{activeStudent.degree}</span>
              </div>
            </div>
            <span className={`status-badge status-${activeStudent.status}`}>
              {formatStatus(activeStudent.status)}
            </span>
          </div>

          {/* Progress Header */}
          <div className="review-progress-section">
            <div className="review-progress-header">
              <span className="review-progress-title">Volunteer Review Progress</span>
              <span className="review-progress-count">
                {reviewedCount} / {totalSubtopics} subtopics reviewed
              </span>
            </div>
            <div className="review-progress-bar">
              <div className="review-progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          {/* Volunteer-Defined Subtopics Manager Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <span className="review-section-label" style={{ fontSize: '14px' }}>
              Volunteer-Defined Subtopics & Commands
            </span>
            <button 
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 10px', fontSize: '12px' }}
              onClick={() => setIsDefiningSubtopic(!isDefiningSubtopic)}
            >
              {isDefiningSubtopic ? 'Cancel' : '+ Define Subtopic'}
            </button>
          </div>

          {/* Define Subtopic Form */}
          {isDefiningSubtopic && (
            <form onSubmit={handleAddSubtopic} className="define-subtopic-box">
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#854D0E', marginBottom: '6px' }}>
                Define Subtopic Based on Student's Interest:
              </div>

              {/* Quick Suggestion Chips from student's actual resume */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: '#64748B', width: '100%' }}>
                  Click to select from {activeStudent.name}'s resume:
                </span>
                {resumeSections.map(sec => (
                  <button 
                    type="button" 
                    key={sec.key}
                    className="suggested-section-chip"
                    onClick={() => handleQuickSelectSection(sec)}
                  >
                    + {sec.title}
                  </button>
                ))}
              </div>

              <input 
                type="text"
                className="search-field"
                style={{ height: '36px', marginBottom: '8px', fontSize: '13px' }}
                placeholder="Subtopic title (e.g. Projective Skills, Extra-Curricular, Certifications)..."
                value={newSubtopicTitle}
                onChange={(e) => setNewSubtopicTitle(e.target.value)}
                autoFocus
              />

              <textarea 
                className="feedback-textarea"
                style={{ minHeight: '52px', marginBottom: '8px', fontSize: '12px', padding: '8px' }}
                placeholder="Initial command/instructions for this subtopic..."
                value={newCommandText}
                onChange={(e) => setNewCommandText(e.target.value)}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsDefiningSubtopic(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Add & Highlight Subtopic
                </button>
              </div>
            </form>
          )}

          {/* Volunteer-Defined Subtopics List */}
          <div className="section-checklist">
            {volunteerSubtopics.length === 0 ? (
              <div className="no-subtopics-placeholder">
                <p>No subtopics defined yet by volunteer.</p>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  Click <strong>"+ Define Subtopic"</strong> above or click any section on the resume canvas to define subtopics (e.g. <em>Projective Skills</em>, <em>Extra-Curricular Activities</em>, <em>Certifications</em>) and give your commands!
                </p>
              </div>
            ) : (
              volunteerSubtopics.map(sub => {
                const isActive = activeHighlightSection === sub.sectionKey;
                return (
                  <div key={sub.id} className="volunteer-subtopic-card">
                    {/* Header Row */}
                    <div 
                      className={`subtopic-card-header ${isActive ? 'active' : ''}`}
                      onClick={() => scrollToDocSection(sub.sectionKey)}
                    >
                      <div className="subtopic-card-title-wrap">
                        <div 
                          className={`section-check-circle ${sub.isReviewed ? 'checked' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubtopicReviewed(sub.id);
                          }}
                          title={sub.isReviewed ? "Mark as Incomplete" : "Mark as Reviewed"}
                        >
                          {sub.isReviewed && '✓'}
                        </div>
                        <span className="subtopic-card-title">{sub.title}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Volunteer Highlighting Toggle */}
                        <button 
                          type="button"
                          className={`subtopic-highlight-toggle ${sub.isHighlighted ? 'highlighted' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubtopicHighlight(sub.id);
                          }}
                          title="Toggle soft yellow highlight on the resume document"
                        >
                          💡 {sub.isHighlighted ? 'Highlighted' : 'Highlight'}
                        </button>

                        <button 
                          type="button"
                          className="subtopic-delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Remove subtopic "${sub.title}"?`)) {
                              removeVolunteerSubtopic(sub.id);
                            }
                          }}
                          title="Delete subtopic"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Volunteer Command Editor */}
                    <div className="subtopic-command-box">
                      <label className="subtopic-command-label">
                        Volunteer Command / Instructions:
                      </label>
                      <textarea 
                        className="subtopic-command-input"
                        placeholder="Write specific command/feedback for student..."
                        value={sub.command}
                        onChange={(e) => updateSubtopicCommand(sub.id, e.target.value)}
                      />

                      {/* Quick Command Suggestion Tags */}
                      <div className="command-suggestions-row">
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>Quick commands:</span>
                        <button 
                          type="button" 
                          className="cmd-pill"
                          onClick={() => updateSubtopicCommand(sub.id, (sub.command ? sub.command + " " : "") + "Quantify results with measurable metrics.")}
                        >
                          + Quantify metrics
                        </button>
                        <button 
                          type="button" 
                          className="cmd-pill"
                          onClick={() => updateSubtopicCommand(sub.id, (sub.command ? sub.command + " " : "") + "Include live project/demo link or GitHub repo.")}
                        >
                          + Add project link
                        </button>
                        <button 
                          type="button" 
                          className="cmd-pill"
                          onClick={() => updateSubtopicCommand(sub.id, (sub.command ? sub.command + " " : "") + "Highlight leadership responsibilities and active participation.")}
                        >
                          + Highlight leadership
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Rating */}
          <div className="review-rating-box">
            <span className="review-section-label">Rating</span>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(starNum => (
                <span 
                  key={starNum}
                  className={`star-icon ${starNum <= activeStudent.rating ? 'filled' : ''}`}
                  onClick={() => setRating(starNum)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Improve Chips */}
          <div className="improve-tags-box">
            <span className="review-section-label">Improve</span>
            <div className="improve-chips-wrap">
              {improveTagOptions.map(tag => {
                const isSelected = (activeStudent.improveTags || []).includes(tag);
                return (
                  <button 
                    key={tag}
                    className={`improve-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleImproveTag(tag)}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* General Feedback Textarea */}
          <div className="review-feedback-box">
            <span className="review-section-label">Overall Feedback</span>
            <textarea 
              className="feedback-textarea"
              placeholder="Write comprehensive summary feedback..."
              value={activeStudent.generalFeedback || ''}
              onChange={(e) => updateGeneralFeedback(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="review-action-buttons">
            <button 
              className="btn btn-danger-outline"
              onClick={() => openModal('changes')}
            >
              ⚠️ Needs Changes
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => openModal('approve')}
            >
              ✓ Approve
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const ResumeDocumentPaper: React.FC<ResumeDocumentPaperProps> = ({ 
  student, 
  pageNum, 
  activeSection, 
  volunteerSubtopics, 
  onSelectSection, 
  onQuickHighlight 
}) => {
  const initialStudentData = initialStudents.find(s => s.id === student.id) || initialStudents[0];
  const allSections = (student.resumeSections && student.resumeSections.length > 0)
    ? student.resumeSections
    : (initialStudentData.resumeSections || []);

  // Pagination: if 2 pages and on page 2, show subsequent sections; on page 1 show first 4 sections
  const sections = (student.totalPages === 2 && pageNum === 2)
    ? allSections.slice(3)
    : (student.totalPages === 2 ? allSections.slice(0, 4) : allSections);

  // Helper to find volunteer-defined subtopic and its highlight/command
  const getSubtopicForSection = (key: string, title?: string) => {
    return volunteerSubtopics.find(s => 
      s.sectionKey === key || 
      (s.title && title && s.title.toLowerCase().includes(title.toLowerCase())) ||
      (s.title && key && s.title.toLowerCase().includes(key.toLowerCase()))
    );
  };

  return (
    <>
      {/* Student Resume Candidate Header */}
      <header className="resume-header" id="section-doc-header">
        <h1 className="resume-name">{student.name.toUpperCase()}</h1>
        <div className="resume-target-title">{student.degree} Candidate</div>
        
        <div className="resume-contact-bar">
          <span className="resume-contact-item">✉ {student.email}</span>
          <span>•</span>
          <span className="resume-contact-item">☎ {student.phone}</span>
          <span>•</span>
          <span className="resume-contact-item">📍 {student.location}</span>
          {student.github && (
            <>
              <span>•</span>
              <span className="resume-contact-item">🐙 {student.github}</span>
            </>
          )}
        </div>
      </header>

      {/* Dynamic Personalized Resume Sections */}
      {sections.map(sec => {
        const subtopic = getSubtopicForSection(sec.key, sec.title);
        const isVolunteerHighlighted = !!(subtopic && subtopic.isHighlighted);

        return (
          <section 
            key={sec.key}
            className={`resume-section ${isVolunteerHighlighted ? 'has-volunteer-highlight' : ''}`}
            id={`section-doc-${sec.key}`}
          >
            {/* Section Header with Volunteer Highlight Status */}
            <div className="resume-section-title">
              <span>{sec.title}</span>
              <button 
                type="button"
                className={`canvas-section-action-btn ${isVolunteerHighlighted ? 'active' : ''}`}
                onClick={() => onQuickHighlight(sec.key, sec.title)}
                title="Click to highlight this subtopic and add command"
              >
                {isVolunteerHighlighted ? '💡 Highlighted' : '+ Highlight Subtopic'}
              </button>
            </div>

            {/* Render Content Based on Section Type */}
            {sec.type === 'text' && (
              <p>{sec.content}</p>
            )}

            {sec.type === 'education' && (
              (sec.items as any[])?.map((edu, idx) => (
                <div key={idx} className="resume-entry">
                  <div className="resume-entry-header">
                    <span className="entry-title">{edu.degree}</span>
                    <span className="entry-date">{edu.period}</span>
                  </div>
                  <div className="resume-entry-header">
                    <span className="entry-org">{edu.institution}</span>
                    <span className="entry-score">{edu.score}</span>
                  </div>
                </div>
              ))
            )}

            {sec.type === 'chips' && (
              <div className="resume-skills-chips">
                {(sec.items as string[])?.map((skill, idx) => (
                  <span key={idx} className="skill-chip">{skill}</span>
                ))}
              </div>
            )}

            {sec.type === 'projects' && (
              (sec.items as any[])?.map((project, idx) => (
                <div key={idx} className="resume-entry">
                  <div className="resume-entry-header">
                    <span className="entry-title">{project.title}</span>
                    <span className="entry-date">{project.period}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px', fontWeight: '600' }}>
                    Tech: {project.tech}
                  </div>
                  <p style={{ fontSize: '12px' }}>{project.description}</p>
                </div>
              ))
            )}

            {sec.type === 'list' && (
              <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#334155' }}>
                {(sec.items as string[])?.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                ))}
              </ul>
            )}

            {/* Volunteer Highlight Zone & Command Badge (Rendered ONLY when Volunteer Highlights it) */}
            {isVolunteerHighlighted && subtopic && (
              <div 
                className="resume-highlight-zone is-active"
                onClick={() => onSelectSection(sec.key)}
                title="Volunteer Highlighted Subtopic - Click to edit command"
              >
                <div className="highlight-comment-bubble">
                  <CommentIcon size={12} /> Volunteer Command
                </div>
                <div className="highlight-comment-pin">
                  🟡 Subtopic: {subtopic.title}
                </div>
                <div className="highlight-comment-text">
                  {subtopic.command || "No command entered yet. Type feedback command in the right review panel."}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </>
  );
};
