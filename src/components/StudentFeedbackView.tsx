import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialStudents, getResumeSectionsForVersion } from '../data/studentsData';
import { downloadResumeDocument } from '../utils/resumeDownload';
import { 
  CheckCircleIcon, WarningTriangleIcon, ClockIcon, 
  PortalLogoIcon, LogoutIcon, DownloadIcon,
  PdfIcon, MaximizeIcon, GithubIcon
} from './Icons';
import { 
  GraduationCap, 
  Hand, 
  FileText, 
  Sparkles,
  Mail, 
  Phone, 
  MapPin
} from 'lucide-react';

export const StudentFeedbackView: React.FC = () => {
  const { 
    students, 
    activeStudent, 
    volunteer, 
    selectedStudentForViewId, 
    setSelectedStudentForViewId,
    setActiveRole,
    logoutStudent
  } = useApp();

  // In-Tab Old vs New Resume Version State (Same comparison as volunteer view)
  const [activeResumeVersion, setActiveResumeVersion] = useState<'old' | 'new'>('new');
  const [zoomLevel, setZoom] = useState(100);
  const [activeResumePage, setResumePage] = useState(1);

  if (!activeStudent) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Student profile not found.</div>;
  }

  const initialStudentData = initialStudents.find(s => s.id === activeStudent.id) || initialStudents[0];
  const volunteerSubtopics = (activeStudent.volunteerSubtopics && activeStudent.volunteerSubtopics.length > 0)
    ? activeStudent.volunteerSubtopics
    : (initialStudentData.volunteerSubtopics || []);

  const allSections = getResumeSectionsForVersion(activeStudent, activeResumeVersion);
  // Pagination: if 2 pages and on page 2, show subsequent sections; on page 1 show first 4 sections
  const sections = (activeStudent.totalPages === 2 && activeResumePage === 2)
    ? allSections.slice(3)
    : (activeStudent.totalPages === 2 ? allSections.slice(0, 4) : allSections);

  return (
    <div className="student-view-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Student Portal Navigation Bar */}
      <nav className="student-top-navbar" style={{ flexShrink: 0 }}>
        <div className="student-top-brand">
          <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
            <PortalLogoIcon size={18} />
          </div>
          <div>
            <span className="brand-title" style={{ fontSize: '15px' }}>Resume Review Portal</span>
            <span className="student-portal-tag">STUDENT PORTAL</span>
          </div>
        </div>

        <div className="student-nav-actions">
          {/* Quick student switcher for easy testing */}
          <div className="student-nav-switcher">
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B' }}>Account:</span>
            <select 
              className="student-account-select"
              value={selectedStudentForViewId}
              onChange={(e) => setSelectedStudentForViewId(e.target.value)}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} (OTP: {s.otp || '101010'})
                </option>
              ))}
            </select>
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveRole('volunteer')}
            title="Switch to volunteer review mode"
            style={{ fontSize: '12px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <GraduationCap size={13} />
            <span>Volunteer Mode</span>
          </button>

          <button 
            className="student-logout-btn"
            onClick={logoutStudent}
            title="Log out and return to Student OTP verification"
          >
            <LogoutIcon size={15} />
            <span>Lock / Change OTP</span>
          </button>
        </div>
      </nav>

      {/* Greeting & Meta Bar */}
      <header className="student-header-banner" style={{ padding: '12px 24px', flexShrink: 0 }}>
        <div className="student-info-meta">
          <img src={activeStudent.avatar} alt={activeStudent.name} className="student-view-avatar" style={{ width: '40px', height: '40px' }} />
          <div>
            <h1 className="student-greeting-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '18px', margin: 0 }}>
              <span>Hello, {activeStudent.name}</span>
              <Hand size={18} color="#F59E0B" />
            </h1>
            <span className="student-degree-sub" style={{ fontSize: '12px' }}>{activeStudent.degree} • {activeStudent.institution}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="student-otp-badge-pill" style={{ margin: 0 }}>
            <span>OTP:</span>
            <strong>{activeStudent.otp || '101010'}</strong>
          </div>

          {activeStudent.status === 'approved' && (
            <span className="status-pill approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircleIcon size={14} />
              <span>Approved by Volunteer {volunteer.name}</span>
            </span>
          )}

          {activeStudent.status === 'changes_required' && (
            <span className="status-pill changes_required" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <WarningTriangleIcon size={14} />
              <span>Changes Requested by {volunteer.name}</span>
            </span>
          )}

          {activeStudent.status === 'in_review' && (
            <span className="status-pill in_review" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ClockIcon size={14} />
              <span>In Review by {volunteer.name}</span>
            </span>
          )}
        </div>
      </header>

      {/* Full-Width Focused Resume Document Viewer (Same design as Volunteer View, No Left Column) */}
      <div className="workspace-dual-pane" style={{ flex: 1, overflow: 'hidden' }}>
        <section className="resume-viewer-pane" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Document Header Bar with Version Switcher Toggle */}
          <div className="resume-toolbar">
            <div className="resume-file-info">
              <span className="pdf-icon-badge"><PdfIcon size={18} /></span>
              <span className="resume-filename" title={`${activeStudent.name.replace(/\s+/g, '_')}_${activeResumeVersion === 'old' ? 'Original_v1' : 'Revised_v2'}_Resume.pdf`}>
                {activeStudent.name.replace(/\s+/g, '_')}_{activeResumeVersion === 'old' ? 'Original_v1' : 'Revised_v2'}_Resume.pdf
              </span>
            </div>

            <div className="resume-view-controls">
              {/* Version Switcher Toggle in the Side Header */}
              <div className="resume-version-toggle-group">
                <button
                  type="button"
                  className={`version-toggle-btn ${activeResumeVersion === 'old' ? 'active-old' : ''}`}
                  onClick={() => setActiveResumeVersion('old')}
                  title="Switch to view original submission reference (v1)"
                >
                  <FileText size={13} />
                  <span>Old Resume (v1)</span>
                </button>
                <button
                  type="button"
                  className={`version-toggle-btn ${activeResumeVersion === 'new' ? 'active-new' : ''}`}
                  onClick={() => setActiveResumeVersion('new')}
                  title="Switch to view revised & optimized resume (v2)"
                >
                  <Sparkles size={13} />
                  <span>New Resume (v2)</span>
                </button>
              </div>

              <div className="toolbar-divider" />

              {/* Page Navigator */}
              <div className="page-navigator">
                <button 
                  className="page-nav-btn" 
                  onClick={() => setResumePage(activeResumePage - 1)}
                  disabled={activeResumePage <= 1}
                  aria-label="Previous Page"
                >
                  &lt;
                </button>
                <span className="page-indicator-text">{activeResumePage} / {activeStudent.totalPages || 2}</span>
                <button 
                  className="page-nav-btn" 
                  onClick={() => setResumePage(activeResumePage + 1)}
                  disabled={activeResumePage >= (activeStudent.totalPages || 2)}
                  aria-label="Next Page"
                >
                  &gt;
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="zoom-controls">
                <button className="zoom-btn" onClick={() => setZoom(zoomLevel - 10)} aria-label="Zoom Out">-</button>
                <span className="zoom-indicator-text">{zoomLevel}%</span>
                <button className="zoom-btn" onClick={() => setZoom(zoomLevel + 10)} aria-label="Zoom In">+</button>
              </div>

              <button 
                className="toolbar-action-icon-btn" 
                onClick={() => downloadResumeDocument(activeStudent, activeResumeVersion)}
                title={`Download ${activeResumeVersion === 'old' ? 'Original (v1)' : 'Revised (v2)'} Resume`}
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

          {/* Document Canvas: Centered & Large Resume Paper */}
          <div className="resume-scroll-canvas">
            <div 
              className="resume-paper" 
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {/* Header */}
              <header className="resume-header">
                <h1 className="resume-name">{activeStudent.name.toUpperCase()}</h1>
                <div className="resume-target-title">{activeStudent.degree} Candidate</div>
                <div className="resume-contact-bar">
                  <span className="resume-contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={12} />
                    <span>{activeStudent.email}</span>
                  </span>
                  <span>•</span>
                  <span className="resume-contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={12} />
                    <span>{activeStudent.phone}</span>
                  </span>
                  <span>•</span>
                  <span className="resume-contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} />
                    <span>{activeStudent.location}</span>
                  </span>
                  {activeStudent.github && (
                    <>
                      <span>•</span>
                      <span className="resume-contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <GithubIcon size={12} />
                        <span>{activeStudent.github}</span>
                      </span>
                    </>
                  )}
                </div>
              </header>

              {/* Dynamic Personalized Sections */}
              {sections.map(sec => {
                const subtopic = volunteerSubtopics.find(s => 
                  s.sectionKey === sec.key || 
                  (s.title && s.title.toLowerCase().includes(sec.key.toLowerCase())) ||
                  (s.title && s.title.toLowerCase().includes(sec.title.toLowerCase()))
                );
                const isEditedByVolunteer = activeResumeVersion === 'new' && !!subtopic;

                return (
                  <section 
                    key={sec.key} 
                    className={`resume-section ${isEditedByVolunteer ? 'has-volunteer-highlight is-student-revised' : ''}`} 
                    id={`student-doc-sec-${sec.key}`}
                  >
                    <div className="resume-section-title">
                      <span>{sec.title}</span>
                      {isEditedByVolunteer && (
                        <span className="volunteer-edited-pill-badge">
                          <Sparkles size={11} />
                          <span>Volunteer Revision</span>
                        </span>
                      )}
                    </div>

                    {/* Section Content */}
                    {sec.type === 'text' && (
                      <p style={{ margin: '4px 0', fontSize: '12.5px', lineHeight: '1.5' }}>{sec.content}</p>
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
                      (sec.items as any[])?.map((proj, idx) => (
                        <div key={idx} className="resume-entry">
                          <div className="resume-entry-header">
                            <span className="entry-title">{proj.title}</span>
                            <span className="entry-date">{proj.period}</span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px', fontWeight: '600' }}>
                            Tech: {proj.tech}
                          </div>
                          <p style={{ fontSize: '12px' }}>{proj.description}</p>
                        </div>
                      ))
                    )}

                    {sec.type === 'list' && (
                      <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#334155' }}>
                        {(sec.items as string[])?.map((it, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>{it}</li>
                        ))}
                      </ul>
                    )}

                    {/* Volunteer Improvement Callout on New Resume */}
                    {isEditedByVolunteer && subtopic && (
                      <div className="student-revised-callout">
                        <div className="callout-header">
                          <span className="callout-title">
                            <Sparkles size={12} />
                            <span>Mentor Revision: {subtopic.title}</span>
                          </span>
                          {subtopic.category && (
                            <span className="clean-doc-highlight-pill" style={{ margin: 0 }}>
                              {subtopic.category === 'must_fix' ? 'Must Fix Applied' : subtopic.category === 'praise' ? 'Strengthened' : 'Optimized'}
                            </span>
                          )}
                        </div>
                        {subtopic.command && (
                          <div className="callout-note">
                            <strong>Feedback Applied:</strong> {subtopic.command}
                          </div>
                        )}
                        {subtopic.suggestedRewrite && (
                          <div className="callout-diff">
                            <div className="diff-tag old">
                              <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Original Submission: </span>
                              <s>{subtopic.suggestedRewrite.before}</s>
                            </div>
                            <div className="diff-tag new">
                              <span style={{ fontSize: '10px', fontWeight: '700', color: '#15803D' }}>Revised Content: </span>
                              <strong>{subtopic.suggestedRewrite.after}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
