import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { initialStudents } from '../data/studentsData';
import { 
  CheckCircleIcon, WarningTriangleIcon, ClockIcon, CommentIcon, 
  PortalLogoIcon, LogoutIcon
} from './Icons';

export const StudentFeedbackView: React.FC = () => {
  const { 
    students, 
    activeStudent, 
    volunteer, 
    selectedStudentForViewId, 
    setSelectedStudentForViewId,
    studentResolvedItems, 
    toggleResolveItem,
    setActiveRole,
    logoutStudent
  } = useApp();

  const [activeSpotlightSection, setActiveSpotlightSection] = useState<string | null>(null);
  const [studentMobileTab, setStudentMobileTab] = useState<'mistakes' | 'resume'>('mistakes');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingSubtopicAudioId, setPlayingSubtopicAudioId] = useState<string | null>(null);

  if (!activeStudent) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Student profile not found.</div>;
  }

  // Safe fallback to initial student data if needed
  const initialStudentData = initialStudents.find(s => s.id === activeStudent.id) || initialStudents[0];
  const volunteerSubtopics = (activeStudent.volunteerSubtopics && activeStudent.volunteerSubtopics.length > 0)
    ? activeStudent.volunteerSubtopics
    : (initialStudentData.volunteerSubtopics || []);

  const resumeSections = (activeStudent.resumeSections && activeStudent.resumeSections.length > 0)
    ? activeStudent.resumeSections
    : (initialStudentData.resumeSections || []);

  const resolvedCount = volunteerSubtopics.filter(s => studentResolvedItems[s.id]).length;
  const totalSubtopics = volunteerSubtopics.length;

  const scrollToResumeSection = (sectionKey: string) => {
    setActiveSpotlightSection(sectionKey);
    setStudentMobileTab('resume');
    setTimeout(() => {
      const el = document.getElementById(`student-doc-sec-${sectionKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
  };

  const handleSubmitRevisions = () => {
    alert(`Thank you, ${activeStudent.name}! Your revised resume and responses to volunteer feedback have been submitted to mentor ${volunteer.name} for re-review.`);
  };

  const rubricScores = activeStudent.rubricScores;
  const hasRubric = !!rubricScores;
  const rubricAvg = hasRubric
    ? Math.round(((rubricScores.atsFormat + rubricScores.metricsImpact + rubricScores.techDepth + rubricScores.grammarClarity) / 20) * 100)
    : null;

  return (
    <div className="student-view-container">
      {/* Student Portal Navigation Bar */}
      <nav className="student-top-navbar">
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
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            🧑‍🏫 Volunteer Mode
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

      {/* Greeting & Status Banner */}
      <header className="student-header-banner">
        <div className="student-info-meta">
          <img src={activeStudent.avatar} alt={activeStudent.name} className="student-view-avatar" />
          <div>
            <h1 className="student-greeting-title">Hello, {activeStudent.name} 👋</h1>
            <span className="student-degree-sub">{activeStudent.degree} • {activeStudent.institution}</span>
          </div>
        </div>

        <div className="student-otp-badge-pill">
          <span>Logged in via Student OTP:</span>
          <strong>{activeStudent.otp || '101010'}</strong>
        </div>

        {/* Status Alert Banner */}
        <div style={{ width: '100%' }}>
          {activeStudent.status === 'changes_required' && (
            <div className="student-status-alert changes-required">
              <WarningTriangleIcon size={24} />
              <div>
                <strong>Changes Requested by Volunteer {volunteer.name}:</strong>
                <span style={{ marginLeft: '6px', fontWeight: '500' }}>
                  Please address the {totalSubtopics} listed feedback items and commands below before submitting your final resume.
                </span>
              </div>
            </div>
          )}

          {activeStudent.status === 'approved' && (
            <div className="student-status-alert approved">
              <CheckCircleIcon size={24} />
              <div>
                <strong>Resume Approved!</strong>
                <span style={{ marginLeft: '6px', fontWeight: '500' }}>
                  Volunteer {volunteer.name} has approved your resume for upcoming campus placement drives.
                </span>
              </div>
            </div>
          )}

          {activeStudent.status === 'in_review' && (
            <div className="student-status-alert in-review">
              <ClockIcon size={24} />
              <div>
                <strong>Review in Progress:</strong>
                <span style={{ marginLeft: '6px', fontWeight: '500' }}>
                  Volunteer {volunteer.name} is currently reviewing your resume. Check back soon for comments.
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Tab Toggle for Student View */}
      <div className="mobile-workspace-tabs-bar student-mobile-tabs-bar">
        <div className="mobile-tabs-pill-container">
          <button 
            type="button"
            className={`mobile-tab-btn ${studentMobileTab === 'mistakes' ? 'active' : ''}`}
            onClick={() => setStudentMobileTab('mistakes')}
          >
            📋 Feedback & Fixes ({totalSubtopics})
          </button>
          <button 
            type="button"
            className={`mobile-tab-btn ${studentMobileTab === 'resume' ? 'active' : ''}`}
            onClick={() => setStudentMobileTab('resume')}
          >
            📄 Annotated Resume
          </button>
        </div>
      </div>

      {/* Main Body Layout */}
      <div className="student-body-layout" data-student-tab={studentMobileTab}>
        {/* Left Column: Volunteer Review & Mistakes Action List */}
        <div className="student-feedback-left-col">
          {/* Volunteer Reviewer Card */}
          <div className="volunteer-reviewer-card">
            <div className="reviewer-card-header">
              <div className="reviewer-profile-wrap">
                <img src={volunteer.avatar} alt={volunteer.name} className="reviewer-avatar-img" />
                <div>
                  <div className="reviewer-name">Reviewed by {volunteer.name}</div>
                  <div className="reviewer-role">{volunteer.role} • {volunteer.organization}</div>
                </div>
              </div>

              <div className="reviewer-rating-pill">
                <span>Rating:</span>
                <span style={{ color: '#F59E0B' }}>
                  {'★'.repeat(activeStudent.rating || 4)}{'☆'.repeat(5 - (activeStudent.rating || 4))}
                </span>
              </div>
            </div>

            {/* Improve Areas Tags */}
            {activeStudent.improveTags && activeStudent.improveTags.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
                  Areas to Improve:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {activeStudent.improveTags.map(tag => (
                    <span key={tag} className="improve-chip selected" style={{ fontSize: '11px', padding: '3px 10px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Volunteer General Note */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
                Mentor's General Feedback:
              </span>
              <div className="volunteer-notes-quote">
                "{activeStudent.generalFeedback || 'Great foundation. Review the highlighted action items on your resume.'}"
              </div>
            </div>

            {/* Mentor Voice Audio Memo if present */}
            {activeStudent.audioNote?.recorded && (
              <div className="student-voice-memo-card">
                <div className="voice-memo-header">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#0F172A', fontSize: '13px' }}>
                    🎙️ Mentor Voice Memo ({activeStudent.audioNote.duration})
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    {activeStudent.audioNote.timestamp || 'Recorded during review'}
                  </span>
                </div>
                <div className="student-voice-player-row">
                  <button 
                    type="button" 
                    className={`btn-play-voice ${isPlayingAudio ? 'is-playing' : ''}`}
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  >
                    {isPlayingAudio ? '⏸ Pause Feedback' : '▶ Play Voice Feedback'}
                  </button>
                  <div className="voice-waveform-mini">
                    <span className={`wave-bar ${isPlayingAudio ? 'anim' : ''}`} />
                    <span className={`wave-bar ${isPlayingAudio ? 'anim' : ''}`} />
                    <span className={`wave-bar ${isPlayingAudio ? 'anim' : ''}`} />
                    <span className={`wave-bar ${isPlayingAudio ? 'anim' : ''}`} />
                    <span className={`wave-bar ${isPlayingAudio ? 'anim' : ''}`} />
                    <span className={`wave-bar ${isPlayingAudio ? 'anim' : ''}`} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                    {isPlayingAudio ? 'Playing...' : activeStudent.audioNote.duration}
                  </span>
                </div>
              </div>
            )}

            {/* 4-Criteria Evaluation Rubric Scorecard if present */}
            {hasRubric && rubricScores && (
              <div className="student-rubric-summary-box">
                <div className="rubric-summary-header">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#0F172A', fontSize: '13px' }}>
                    📊 Evaluation Rubric Scorecard
                  </span>
                  <span className="rubric-overall-badge">
                    {rubricAvg}% Overall Quality
                  </span>
                </div>
                <div className="rubric-compact-grid">
                  <div className="rubric-compact-card">
                    <span className="criterion-name">ATS & Layout</span>
                    <span className="criterion-val">{rubricScores.atsFormat} / 5</span>
                    <div className="criterion-bar"><div style={{ width: `${(rubricScores.atsFormat / 5) * 100}%` }} /></div>
                  </div>
                  <div className="rubric-compact-card">
                    <span className="criterion-name">Metrics & Impact</span>
                    <span className="criterion-val">{rubricScores.metricsImpact} / 5</span>
                    <div className="criterion-bar"><div style={{ width: `${(rubricScores.metricsImpact / 5) * 100}%` }} /></div>
                  </div>
                  <div className="rubric-compact-card">
                    <span className="criterion-name">Technical Depth</span>
                    <span className="criterion-val">{rubricScores.techDepth} / 5</span>
                    <div className="criterion-bar"><div style={{ width: `${(rubricScores.techDepth / 5) * 100}%` }} /></div>
                  </div>
                  <div className="rubric-compact-card">
                    <span className="criterion-name">Clarity & Verbs</span>
                    <span className="criterion-val">{rubricScores.grammarClarity} / 5</span>
                    <div className="criterion-bar"><div style={{ width: `${(rubricScores.grammarClarity / 5) * 100}%` }} /></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actionable Mistakes & Commands Section */}
          <div className="action-items-section-header">
            <h2 className="action-items-title">
              <CommentIcon size={18} /> Mistakes & Feedback Listed by Volunteer
            </h2>
            <span className="action-progress-pill">
              {resolvedCount} of {totalSubtopics} fixed
            </span>
          </div>

          {/* Mistakes Cards List */}
          <div className="student-mistakes-list">
            {volunteerSubtopics.length === 0 ? (
              <div className="white-card" style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
                No mistakes or changes flagged by the volunteer yet.
              </div>
            ) : (
              volunteerSubtopics.map(item => {
                const isResolved = !!studentResolvedItems[item.id];
                const isSpotlighted = activeSpotlightSection === item.sectionKey;
                const cat = item.category || 'suggestion';

                return (
                  <div 
                    key={item.id} 
                    className={`student-mistake-card ${isResolved ? 'is-resolved' : ''}`}
                    style={isSpotlighted ? { borderColor: '#EAB308', boxShadow: '0 0 0 3px rgba(250, 204, 21, 0.4)' } : {}}
                  >
                    <div className="student-mistake-top-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="subtopic-card-title" style={{ fontSize: '14px' }}>
                          {item.title}
                        </span>
                        <span className={`subtopic-badge badge-${cat}`}>
                          {cat === 'must_fix' ? '⚠️ Must Fix' : cat === 'praise' ? '🌟 Praise' : cat === 'question' ? '❓ Question' : '💡 Suggestion'}
                        </span>
                      </div>

                      <button 
                        className="btn-spotlight-resume"
                        onClick={() => scrollToResumeSection(item.sectionKey)}
                        title="Scroll to see this section in your resume"
                      >
                        🔍 View in Resume
                      </button>
                    </div>

                    {/* Volunteer Command Box */}
                    <div className="volunteer-command-quote-box">
                      <span className="volunteer-command-label">Volunteer's Correction / Instruction:</span>
                      <p className="volunteer-command-body">
                        {item.command || "Please review and enhance this section based on best resume formatting standards."}
                      </p>
                    </div>

                    {/* Before / After Rewrite Diff if provided by volunteer */}
                    {item.suggestedRewrite && (
                      <div className="diff-box-group" style={{ margin: '8px 0 12px 0' }}>
                        <div className="diff-box before" style={{ padding: '6px 10px', fontSize: '12px' }}>
                          <span className="diff-label">Original Text:</span>
                          <s>{item.suggestedRewrite.before}</s>
                        </div>
                        <div className="diff-box after" style={{ padding: '6px 10px', fontSize: '12px' }}>
                          <span className="diff-label">Suggested Replacement by Mentor:</span>
                          <strong>{item.suggestedRewrite.after}</strong>
                        </div>
                      </div>
                    )}

                    {/* Subtopic Audio Voice Feedback Player */}
                    {item.audioNote?.recorded && (
                      <div className="student-subtopic-voice-memo">
                        <div className="subtopic-voice-meta">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700', fontSize: '12px', color: '#166534' }}>
                            🎙️ Volunteer Voice Note on this section ({item.audioNote.duration})
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>
                            {item.audioNote.timestamp || 'Recorded by mentor'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button
                            type="button"
                            className={`btn-play-voice ${playingSubtopicAudioId === item.id ? 'is-playing' : ''}`}
                            onClick={() => setPlayingSubtopicAudioId(playingSubtopicAudioId === item.id ? null : item.id)}
                          >
                            {playingSubtopicAudioId === item.id ? '⏸ Pause Note' : '▶ Play Voice Note'}
                          </button>
                          <div className="voice-waveform-mini">
                            <span className={`wave-bar ${playingSubtopicAudioId === item.id ? 'anim' : ''}`} />
                            <span className={`wave-bar ${playingSubtopicAudioId === item.id ? 'anim' : ''}`} />
                            <span className={`wave-bar ${playingSubtopicAudioId === item.id ? 'anim' : ''}`} />
                            <span className={`wave-bar ${playingSubtopicAudioId === item.id ? 'anim' : ''}`} />
                            <span className={`wave-bar ${playingSubtopicAudioId === item.id ? 'anim' : ''}`} />
                            <span className={`wave-bar ${playingSubtopicAudioId === item.id ? 'anim' : ''}`} />
                          </div>
                          <span style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>
                            {playingSubtopicAudioId === item.id ? 'Playing audio...' : item.audioNote.duration}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Student Action: Mark as Resolved */}
                    <div className="student-resolve-action-row">
                      <label className={`resolve-checkbox-label ${isResolved ? 'checked' : ''}`}>
                        <input 
                          type="checkbox" 
                          checked={isResolved}
                          onChange={() => toggleResolveItem(item.id)}
                        />
                        <span>{isResolved ? 'Marked as Fixed ✓' : 'I have made this change in my resume'}</span>
                      </label>

                      {isResolved && (
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
                          Resolved ✓
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Submit Revised Resume Action */}
          <div className="white-card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Ready to submit revised resume?
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Submit your changes for final volunteer approval.
              </div>
            </div>

            <button 
              className="btn btn-primary"
              onClick={handleSubmitRevisions}
            >
              📤 Submit Revisions
            </button>
          </div>
        </div>

        {/* Right Column: Annotated Resume Paper */}
        <div className="student-resume-right-col">
          <div className="student-resume-header-bar">
            <span>📄 {activeStudent.name}_Resume_Annotated.pdf</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                type="button"
                className="mobile-back-to-feedback-btn"
                onClick={() => setStudentMobileTab('mistakes')}
              >
                ← View Fixes
              </button>
              <span className="yellow-highlight-indicator">
                💡 Highlights = Mentor Feedback
              </span>
            </div>
          </div>

          <div className="resume-scroll-canvas student-resume-scroll-canvas">
            <div className="resume-paper student-resume-paper">
              {/* Header */}
              <header className="resume-header">
                <h1 className="resume-name">{activeStudent.name.toUpperCase()}</h1>
                <div className="resume-target-title">{activeStudent.degree} Candidate</div>
                <div className="resume-contact-bar">
                  <span className="resume-contact-item">✉ {activeStudent.email}</span>
                  <span>•</span>
                  <span className="resume-contact-item">☎ {activeStudent.phone}</span>
                  <span>•</span>
                  <span className="resume-contact-item">📍 {activeStudent.location}</span>
                </div>
              </header>

              {/* Sections with Highlighted Volunteer Feedback */}
              {resumeSections.map(sec => {
                const subtopic = volunteerSubtopics.find(s => 
                  s.sectionKey === sec.key || 
                  (s.title && s.title.toLowerCase().includes(sec.key.toLowerCase())) ||
                  (s.title && s.title.toLowerCase().includes(sec.title.toLowerCase()))
                );
                const hasFeedback = !!subtopic;
                const isSpotlighted = activeSpotlightSection === sec.key;

                return (
                  <section 
                    key={sec.key}
                    id={`student-doc-sec-${sec.key}`}
                    className={`resume-section ${hasFeedback ? 'has-volunteer-highlight' : ''}`}
                    style={isSpotlighted ? { boxShadow: '0 0 0 3px #FACC15', borderRadius: '6px' } : {}}
                  >
                    <div className="resume-section-title">
                      <span>{sec.title}</span>
                      {hasFeedback && (
                        <span style={{ fontSize: '11px', color: '#854D0E', background: '#FEF08A', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                          ⚠️ Feedback Listed
                        </span>
                      )}
                    </div>

                    {/* Section Content */}
                    {sec.type === 'text' && <p>{sec.content}</p>}
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

                    {/* Highlighted Box with Volunteer Command */}
                    {hasFeedback && subtopic && (
                      <div className="resume-highlight-zone is-active">
                        <div className="highlight-comment-bubble" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span><CommentIcon size={12} /> Volunteer Correction</span>
                          {subtopic.category && (
                            <span className={`subtopic-badge badge-${subtopic.category}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                              {subtopic.category === 'must_fix' ? '⚠️ Must Fix' : subtopic.category === 'praise' ? '🌟 Praise' : subtopic.category === 'question' ? '❓ Question' : '💡 Suggestion'}
                            </span>
                          )}
                        </div>
                        <div className="highlight-comment-pin">
                          Action Required: {subtopic.title}
                        </div>
                        <div className="highlight-comment-text">
                          {subtopic.command || "Please improve this section based on volunteer advice."}
                        </div>
                        {subtopic.suggestedRewrite && (
                          <div className="diff-box-group" style={{ marginTop: '8px' }}>
                            <div className="diff-box before" style={{ padding: '4px 8px', fontSize: '11px' }}>
                              <span className="diff-label" style={{ fontSize: '9px' }}>Original:</span>
                              <s>{subtopic.suggestedRewrite.before}</s>
                            </div>
                            <div className="diff-box after" style={{ padding: '4px 8px', fontSize: '11px' }}>
                              <span className="diff-label" style={{ fontSize: '9px' }}>Suggested Replacement:</span>
                              <strong>{subtopic.suggestedRewrite.after}</strong>
                            </div>
                          </div>
                        )}
                        {subtopic.audioNote?.recorded && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '6px', padding: '3px 8px', marginTop: '6px', fontSize: '11px', color: '#166534', fontWeight: '700' }}>
                            <span>🎙️ Voice Note Attached: {subtopic.audioNote.duration}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
