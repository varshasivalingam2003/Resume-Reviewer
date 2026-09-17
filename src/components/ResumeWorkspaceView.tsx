import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { initialStudents, Student, VolunteerSubtopic, ResumeSection } from '../data/studentsData';
import { 
  ArrowLeftIcon, PdfIcon, DownloadIcon, MaximizeIcon, 
  CommentIcon, CheckIcon 
} from './Icons';

// 4-Stage Guided Mentor Audit Types
export interface AuditStageData {
  stage1: { verdict: 'clean' | 'slightly_cluttered' | 'dense'; notes: string; highlightSection: string };
  stage2: { selectedProject: string; authenticity: 'genuine_challenge' | 'academic_standard' | 'tutorial_clone'; challengeNotes: string; proofOfWork: string };
  stage3: { interviewQuestion: string; prepTip: string };
  stage4: { task1: string; task2: string; encouragement: string };
}

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
    updateSubtopicCategory,
    updateSubtopicRewrite,
    updateSubtopicAudioNote,
    saveAudioNote,
    saveRubricScores,
    toggleSubtopicReviewed,
    quickHighlightFromCanvas,
    updateGeneralFeedback,
    setRating,
    toggleImproveTag,
    openModal,
    setActiveRole,
    setSelectedStudentForViewId
  } = useApp();

  // Multi-Method Commenting Tool State (5 Human Review Tools)
  const [activeCommentTool, setActiveCommentTool] = useState<'sections' | 'mentor_audit' | 'rewrite_diff' | 'voice_memo' | 'rubric'>('mentor_audit');
  
  // Method 1: Subtopic Definition
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [selectedSectionKey, setSelectedSectionKey] = useState('');
  const [newCommandText, setNewCommandText] = useState('');
  const [newCategory, setNewCategory] = useState<'suggestion' | 'must_fix' | 'praise' | 'question'>('suggestion');
  const [isDefiningSubtopic, setIsDefiningSubtopic] = useState(false);

  // Method 2: 4-Stage Guided Mentor Audit State (Human Mentorship)
  const [currentAuditStage, setCurrentAuditStage] = useState<1 | 2 | 3 | 4>(1);
  const [auditStage1, setAuditStage1] = useState({
    verdict: 'clean' as 'clean' | 'slightly_cluttered' | 'dense',
    notes: 'Contact info is clear and formatting is clean. Margins and visual hierarchy are well balanced.',
    highlightSection: 'contact'
  });
  const [auditStage2, setAuditStage2] = useState({
    selectedProject: 'Smart Attendance System',
    authenticity: 'genuine_challenge' as 'genuine_challenge' | 'academic_standard' | 'tutorial_clone',
    challengeNotes: 'Describe how concurrency was handled: 50+ simultaneous face captures without request timeouts.',
    proofOfWork: 'https://github.com/rahulsharma/smart-attendance-system'
  });
  const [auditStage3, setAuditStage3] = useState({
    interviewQuestion: 'How would your facial recognition pipeline scale if 500 students entered the hall at the exact same minute?',
    prepTip: 'Explain message broker queues (RabbitMQ/Kafka) and asynchronous worker threads.'
  });
  const [auditStage4, setAuditStage4] = useState({
    task1: 'Add metrics to Smart Attendance System: mention % recognition accuracy and latency reduction.',
    task2: 'Categorize skills into Languages, Frameworks, and Tools.',
    encouragement: 'Great engineering fundamentals! Polish these two areas and you are ready for tech interviews.'
  });
  const [auditAppliedSuccess, setAuditAppliedSuccess] = useState(false);

  // Method 3: Rewrite Suggestion Tool
  const [rewriteTargetSection, setRewriteTargetSection] = useState('objective');
  const [rewriteOriginal, setRewriteOriginal] = useState('Enthusiastic computer science student seeking an entry level developer job to gain experience and help the company grow.');
  const [rewriteProposed, setRewriteProposed] = useState('Results-driven Software Engineering candidate with hands-on React & Node.js full-stack project experience, seeking to build high-performance web applications.');
  const [rewriteSavedAlert, setRewriteSavedAlert] = useState(false);

  // Method 4: Voice Feedback Recorder Simulation (Overall + Subtopics)
  const [voiceTarget, setVoiceTarget] = useState<string>('overall');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [maxVoiceSeconds, setMaxVoiceSeconds] = useState<number>(300); // Default 5 mins (up to 10 mins)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingSubtopicAudioId, setPlayingSubtopicAudioId] = useState<string | null>(null);

  const formatVoiceTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let timer: any;
    if (isVoiceRecording) {
      timer = setInterval(() => {
        setVoiceSeconds(prev => {
          if (prev >= maxVoiceSeconds) {
            setIsVoiceRecording(false);
            const duration = formatVoiceTime(maxVoiceSeconds);
            const timestamp = 'Just now';
            if (voiceTarget === 'overall') {
              saveAudioNote({ recorded: true, duration, timestamp });
            } else {
              updateSubtopicAudioNote(voiceTarget, { recorded: true, duration, timestamp });
            }
            return maxVoiceSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isVoiceRecording, voiceTarget, maxVoiceSeconds]);

  // Method 5: Evaluation Rubric Scorecard
  const [rubricScores, setRubricScoresLocal] = useState({
    atsFormat: activeStudent?.rubricScores?.atsFormat || 4,
    metricsImpact: activeStudent?.rubricScores?.metricsImpact || 3,
    techDepth: activeStudent?.rubricScores?.techDepth || 4,
    grammarClarity: activeStudent?.rubricScores?.grammarClarity || 5
  });

  const handleRubricScoreChange = (key: 'atsFormat' | 'metricsImpact' | 'techDepth' | 'grammarClarity', value: number) => {
    const updated = { ...rubricScores, [key]: value };
    setRubricScoresLocal(updated);
    saveRubricScores(updated);
  };

  const calculateRubricOverall = () => {
    const avg = (rubricScores.atsFormat + rubricScores.metricsImpact + rubricScores.techDepth + rubricScores.grammarClarity) / 4;
    return Math.round((avg / 5) * 100);
  };

  const getActiveToolLabel = () => {
    switch (activeCommentTool) {
      case 'sections': return '✍️ Section Notes';
      case 'ai_suggestions': return '✨ AI Suggestions';
      case 'rewrite_diff': return '🔄 Rewrite (Diff)';
      case 'voice_memo': return '🎙️ Voice Memo';
      case 'rubric': return '📊 Rubric Scorecard';
    }
  };

  const handleInsertRubricSummary = () => {
    const summary = `\n\n📊 MENTOR EVALUATION RUBRIC (Score: ${calculateRubricOverall()}%):\n• ATS & Layout: ${rubricScores.atsFormat}/5\n• Impact & Metrics: ${rubricScores.metricsImpact}/5\n• Technical Stack Depth: ${rubricScores.techDepth}/5\n• Clarity & Action Verbs: ${rubricScores.grammarClarity}/5`;
    updateGeneralFeedback((activeStudent?.generalFeedback || '') + summary);
    alert('Rubric scorecard appended to Overall Feedback!');
  };

  if (!activeStudent) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Student not found.</div>;
  }

  // Safe fallback to initial student data
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

    addVolunteerSubtopic(newSubtopicTitle, selectedSectionKey || 'custom', newCommandText, newCategory);
    setNewSubtopicTitle('');
    setSelectedSectionKey('');
    setNewCommandText('');
    setNewCategory('suggestion');
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

  // 4-Stage Guided Mentor Audit Handler
  const handleApplyAuditToReview = () => {
    // 1. Stage 1 note
    const s1Cat = auditStage1.verdict === 'clean' ? 'praise' : 'must_fix';
    const s1Label = auditStage1.verdict === 'clean' ? 'Clean & Scannable' : auditStage1.verdict === 'slightly_cluttered' ? 'Needs Spacing Fix' : 'Dense Layout';
    addVolunteerSubtopic(
      `Stage 1: 6-Sec Glance (${s1Label})`,
      auditStage1.highlightSection || 'contact',
      auditStage1.notes,
      s1Cat
    );
    quickHighlightFromCanvas(auditStage1.highlightSection || 'contact', 'Stage 1: 6-Sec Glance');

    // 2. Stage 2 note
    const s2Cat = auditStage2.authenticity === 'genuine_challenge' ? 'praise' : 'must_fix';
    addVolunteerSubtopic(
      `Stage 2: Tech Depth (${auditStage2.selectedProject})`,
      'projects',
      `${auditStage2.challengeNotes}\n\n[Proof of Work]: ${auditStage2.proofOfWork}`,
      s2Cat
    );

    // 3. Stage 3 note
    addVolunteerSubtopic(
      'Stage 3: Interview Defense Question',
      'projects',
      `Mock Question: "${auditStage3.interviewQuestion}"\n\n[Coaching Tip]: ${auditStage3.prepTip}`,
      'suggestion'
    );

    // 4. Stage 4 note
    addVolunteerSubtopic(
      'Stage 4: 7-Day Action Plan',
      'overall',
      `1. ${auditStage4.task1}\n2. ${auditStage4.task2}\n\n[Mentor Encouragement]: ${auditStage4.encouragement}`,
      'must_fix'
    );

    // Update general feedback
    updateGeneralFeedback(`${auditStage4.encouragement}\n\nKey Interview Question to Prepare: "${auditStage3.interviewQuestion}"`);
    setAuditAppliedSuccess(true);
    setTimeout(() => setAuditAppliedSuccess(false), 4000);
  };

  const handleSaveRewriteSuggestion = () => {
    // Find matching subtopic or create new rewrite subtopic
    const targetSub = volunteerSubtopics.find(s => s.sectionKey === rewriteTargetSection) || volunteerSubtopics[0];
    if (targetSub) {
      updateSubtopicRewrite(targetSub.id, { before: rewriteOriginal, after: rewriteProposed });
      updateSubtopicCommand(targetSub.id, `${targetSub.command || ''}\n\n[Suggested Rewrite]: "${rewriteProposed}"`);
    } else {
      addVolunteerSubtopic(`Suggested Rewrite: ${rewriteTargetSection.toUpperCase()}`, rewriteTargetSection, `[Suggested Rewrite]: "${rewriteProposed}"`);
    }
    setRewriteSavedAlert(true);
    setTimeout(() => setRewriteSavedAlert(false), 3000);
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
            <span className="workspace-student-degree">{activeStudent.degree}</span>
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
            🎓 Student View
          </button>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => alert('Review comments, audit notes, audio memo, and rubric saved successfully!')}
          >
            💾 Save
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => openModal('approve')}
          >
            ✓ Submit Review
          </button>
        </div>
      </header>

      {/* Mobile Workspace Tab Switcher */}
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
          {/* Progress Header */}
          <div className="review-progress-section">
            <div className="review-progress-header">
              <span className="review-progress-title">Review Progress</span>
              <span className="review-progress-count">
                {reviewedCount} / {totalSubtopics} reviewed
              </span>
            </div>
            <div className="review-progress-bar">
              <div className="review-progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          {/* 5 Clean Navigation Tabs */}
          <div className="commenting-tools-tabs" role="tablist" aria-label="Volunteer Feedback Options">
            <button 
              type="button"
              className={`comment-tool-tab ${activeCommentTool === 'sections' ? 'active' : ''}`}
              onClick={() => setActiveCommentTool('sections')}
              title="Section Notes & Highlights"
            >
              <span className="tab-icon">✍️</span>
              <span className="tab-label">Notes</span>
              <span className="tab-count-pill">{volunteerSubtopics.length}</span>
            </button>

            <button 
              type="button"
              className={`comment-tool-tab ${activeCommentTool === 'mentor_audit' ? 'active' : ''}`}
              onClick={() => setActiveCommentTool('mentor_audit')}
              title="4-Stage Guided Mentor Audit: Glance, Tech Depth, Interview Defense & Action Plan"
            >
              <span className="tab-icon">🎯</span>
              <span className="tab-label">Audit</span>
              <span className="tab-count-pill">{currentAuditStage}/4</span>
            </button>

            <button 
              type="button"
              className={`comment-tool-tab ${activeCommentTool === 'rewrite_diff' ? 'active' : ''}`}
              onClick={() => setActiveCommentTool('rewrite_diff')}
              title="Suggest specific Before/After text replacements"
            >
              <span className="tab-icon">🔄</span>
              <span className="tab-label">Rewrite</span>
            </button>

            <button 
              type="button"
              className={`comment-tool-tab ${activeCommentTool === 'voice_memo' ? 'active' : ''}`}
              onClick={() => setActiveCommentTool('voice_memo')}
              title="Record audio coaching for overall resume or specific sections"
            >
              <span className="tab-icon">🎙️</span>
              <span className="tab-label">Voice</span>
              {((activeStudent?.audioNote?.recorded ? 1 : 0) + volunteerSubtopics.filter(s => s.audioNote?.recorded).length) > 0 && (
                <span className="tab-saved-dot">✓</span>
              )}
            </button>

            <button 
              type="button"
              className={`comment-tool-tab ${activeCommentTool === 'rubric' ? 'active' : ''}`}
              onClick={() => setActiveCommentTool('rubric')}
              title="Scorecard evaluation across 4 dimensions"
            >
              <span className="tab-icon">📊</span>
              <span className="tab-label">Rubric</span>
            </button>
          </div>

          {/* =========================================================================
              METHOD 1: SECTION NOTES & SUBTOPIC COMMANDS (WITH SEVERITY TAGS)
             ========================================================================= */}
          {activeCommentTool === 'sections' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="review-section-label" style={{ fontSize: '13px', margin: 0 }}>
                  Section Commands & Highlights
                </span>
                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                  onClick={() => setIsDefiningSubtopic(!isDefiningSubtopic)}
                >
                  {isDefiningSubtopic ? 'Cancel' : '+ Define New Section'}
                </button>
              </div>

              {/* Define Subtopic Form */}
              {isDefiningSubtopic && (
                <form onSubmit={handleAddSubtopic} className="define-subtopic-box">
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#854D0E', marginBottom: '6px' }}>
                    Define Subtopic & Assign Comment Type:
                  </div>

                  {/* Feedback Severity Category Selector */}
                  <div className="category-pill-group">
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', marginRight: '4px' }}>Type:</span>
                    <button 
                      type="button" 
                      className={`cat-select-btn ${newCategory === 'suggestion' ? 'active cat-suggestion' : ''}`}
                      onClick={() => setNewCategory('suggestion')}
                    >
                      💡 Suggestion
                    </button>
                    <button 
                      type="button" 
                      className={`cat-select-btn ${newCategory === 'must_fix' ? 'active cat-must_fix' : ''}`}
                      onClick={() => setNewCategory('must_fix')}
                    >
                      ⚠️ Must Fix
                    </button>
                    <button 
                      type="button" 
                      className={`cat-select-btn ${newCategory === 'praise' ? 'active cat-praise' : ''}`}
                      onClick={() => setNewCategory('praise')}
                    >
                      🌟 Praise
                    </button>
                    <button 
                      type="button" 
                      className={`cat-select-btn ${newCategory === 'question' ? 'active cat-question' : ''}`}
                      onClick={() => setNewCategory('question')}
                    >
                      ❓ Question
                    </button>
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
                    placeholder="Subtopic title (e.g. Projective Skills, Extra-Curricular)..."
                    value={newSubtopicTitle}
                    onChange={(e) => setNewSubtopicTitle(e.target.value)}
                    autoFocus
                  />

                  <textarea 
                    className="feedback-textarea"
                    style={{ minHeight: '52px', marginBottom: '8px', fontSize: '12px', padding: '8px' }}
                    placeholder="Write detailed comment or command for student..."
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

              {/* Subtopics List */}
              <div className="section-checklist">
                {volunteerSubtopics.length === 0 ? (
                  <div className="no-subtopics-placeholder">
                    <p>No subtopics defined yet by volunteer.</p>
                    <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                      Click <strong>"+ Define New Section"</strong> or switch to <strong>"✨ AI Suggestions"</strong> to review automated recommendations!
                    </p>
                  </div>
                ) : (
                  volunteerSubtopics.map(sub => {
                    const isActive = activeHighlightSection === sub.sectionKey;
                    const cat = sub.category || 'suggestion';
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
                            <span className={`subtopic-badge badge-${cat}`}>
                              {cat === 'must_fix' ? '⚠️ Must Fix' : cat === 'praise' ? '🌟 Praise' : cat === 'question' ? '❓ Question' : '💡 Suggestion'}
                            </span>
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
                          {/* Quick Category Switcher */}
                          <div className="category-pill-group">
                            <span style={{ fontSize: '10px', color: '#94A3B8' }}>Severity:</span>
                            <button 
                              type="button"
                              className={`cat-select-btn ${cat === 'suggestion' ? 'active cat-suggestion' : ''}`}
                              onClick={() => updateSubtopicCategory(sub.id, 'suggestion')}
                            >
                              💡 Suggestion
                            </button>
                            <button 
                              type="button"
                              className={`cat-select-btn ${cat === 'must_fix' ? 'active cat-must_fix' : ''}`}
                              onClick={() => updateSubtopicCategory(sub.id, 'must_fix')}
                            >
                              ⚠️ Must Fix
                            </button>
                            <button 
                              type="button"
                              className={`cat-select-btn ${cat === 'praise' ? 'active cat-praise' : ''}`}
                              onClick={() => updateSubtopicCategory(sub.id, 'praise')}
                            >
                              🌟 Praise
                            </button>
                            <button 
                              type="button"
                              className={`cat-select-btn ${cat === 'question' ? 'active cat-question' : ''}`}
                              onClick={() => updateSubtopicCategory(sub.id, 'question')}
                            >
                              ❓ Question
                            </button>
                          </div>

                          <textarea 
                            className="subtopic-command-input"
                            placeholder="Write specific command/feedback for student..."
                            value={sub.command}
                            onChange={(e) => updateSubtopicCommand(sub.id, e.target.value)}
                          />

                          {/* Suggested Rewrite Diff Preview if present */}
                          {sub.suggestedRewrite && (
                            <div className="diff-box-group" style={{ margin: '4px 0' }}>
                              <div className="diff-box before" style={{ padding: '6px 8px', fontSize: '11px' }}>
                                <span className="diff-label">Original:</span>
                                <s>{sub.suggestedRewrite.before}</s>
                              </div>
                              <div className="diff-box after" style={{ padding: '6px 8px', fontSize: '11px' }}>
                                <span className="diff-label">Suggested Replacement:</span>
                                <strong>{sub.suggestedRewrite.after}</strong>
                              </div>
                            </div>
                          )}

                          {/* Quick Command Suggestion Tags */}
                          <div className="command-suggestions-row">
                            <span style={{ fontSize: '10px', color: '#94A3B8' }}>Quick insertions:</span>
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
                              onClick={() => updateSubtopicCommand(sub.id, (sub.command ? sub.command + " " : "") + "Include live project link or GitHub repo.")}
                            >
                              + Add live link
                            </button>
                            <button 
                              type="button" 
                              className="cmd-pill"
                              onClick={() => updateSubtopicCommand(sub.id, (sub.command ? sub.command + " " : "") + "Highlight leadership and initiative.")}
                            >
                              + Leadership
                            </button>
                          </div>

                          {/* Subtopic Voice Feedback Note Row */}
                          <div className="subtopic-voice-row">
                            {sub.audioNote?.recorded ? (
                              <div className="subtopic-voice-pill">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontSize: '13px' }}>🎙️</span>
                                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#166534' }}>
                                    Voice Note ({sub.audioNote.duration})
                                  </span>
                                  <span style={{ fontSize: '10px', color: '#64748B' }}>
                                    {sub.audioNote.timestamp}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <button 
                                    type="button" 
                                    className="subtopic-voice-action-btn"
                                    onClick={() => {
                                      setPlayingSubtopicAudioId(playingSubtopicAudioId === sub.id ? null : sub.id);
                                    }}
                                  >
                                    {playingSubtopicAudioId === sub.id ? '⏸ Pause' : '▶ Play'}
                                  </button>
                                  <button 
                                    type="button" 
                                    className="subtopic-voice-action-btn record-again"
                                    onClick={() => {
                                      setVoiceTarget(sub.id);
                                      setActiveCommentTool('voice_memo');
                                    }}
                                    title="Re-record voice note for this subtopic"
                                  >
                                    🔄 Re-record
                                  </button>
                                  <button 
                                    type="button" 
                                    className="subtopic-voice-action-btn delete"
                                    onClick={() => {
                                      updateSubtopicAudioNote(sub.id, { recorded: false, duration: '0:00', timestamp: '' });
                                    }}
                                    title="Remove voice note"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button 
                                type="button" 
                                className="btn-attach-subtopic-voice"
                                onClick={() => {
                                  setVoiceTarget(sub.id);
                                  setActiveCommentTool('voice_memo');
                                }}
                              >
                                🎙️ + Record Voice Note for "{sub.title}"
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* =========================================================================
              METHOD 2: 4-STAGE GUIDED MENTOR AUDIT (HUMAN MENTORSHIP FLOW)
             ========================================================================= */}
          {activeCommentTool === 'mentor_audit' && (
            <div className="mentor-audit-card">
              {/* Stage Stepper Tabs */}
              <div className="audit-stage-stepper-row">
                {[
                  { stage: 1, label: '1. Glance', full: 'Stage 1: 6-Second Glance' },
                  { stage: 2, label: '2. Tech', full: 'Stage 2: Technical Depth' },
                  { stage: 3, label: '3. Defense', full: 'Stage 3: Interview Defense' },
                  { stage: 4, label: '4. Action Plan', full: 'Stage 4: Action Plan' }
                ].map(s => (
                  <button
                    key={s.stage}
                    type="button"
                    className={`audit-stage-pill-btn ${currentAuditStage === s.stage ? 'active' : ''}`}
                    onClick={() => setCurrentAuditStage(s.stage as any)}
                    title={s.full}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* STAGE 1: 6-Second Recruiter First Impression */}
              {currentAuditStage === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="mentor-stage-header">
                    <span className="mentor-stage-icon">👁️</span>
                    <div>
                      <h4 className="mentor-stage-title">Stage 1: The 6-Second Recruiter Glance</h4>
                      <p className="mentor-stage-desc">
                        Does this resume make an immediate, legible first impression or is it cluttered?
                      </p>
                    </div>
                  </div>

                  <div className="mentor-stage-field">
                    <label className="mentor-stage-label">Visual First Impression Verdict:</label>
                    <div className="audit-verdict-grid">
                      {[
                        { val: 'clean', label: '✅ Clean' },
                        { val: 'slightly_cluttered', label: '⚠️ Spacing' },
                        { val: 'dense', label: '❌ Cluttered' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          className={`audit-verdict-card ${auditStage1.verdict === opt.val ? 'selected' : ''}`}
                          onClick={() => setAuditStage1(prev => ({ ...prev, verdict: opt.val as any }))}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mentor-stage-field">
                    <div className="mentor-stage-label-row">
                      <label className="mentor-stage-label">Target Section for Spacing / Alignment:</label>
                      <span className="mentor-stage-sync-badge">
                        <span className="mentor-sync-dot"></span> Canvas Sync
                      </span>
                    </div>
                    <div className="mentor-section-action-row">
                      <div className="mentor-select-wrapper">
                        <select 
                          value={auditStage1.highlightSection}
                          onChange={(e) => {
                            setAuditStage1(prev => ({ ...prev, highlightSection: e.target.value }));
                            scrollToDocSection(e.target.value);
                          }}
                          className="mentor-stage-select"
                        >
                          <option value="contact">📞 Header & Contact Info</option>
                          <option value="education">🎓 Education Section</option>
                          <option value="skills">⚡ Technical Skills</option>
                          <option value="projects">📁 Projects & Experience</option>
                        </select>
                        <span className="mentor-select-chevron" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </div>

                      <button
                        type="button"
                        className="mentor-canvas-highlight-btn"
                        onClick={() => quickHighlightFromCanvas(auditStage1.highlightSection, 'Stage 1: 6-Sec Glance')}
                        title="Highlight this section on resume canvas"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <span>Highlight on Canvas</span>
                      </button>
                    </div>
                  </div>

                  <div className="mentor-stage-field">
                    <label className="mentor-stage-label">Visual Hierarchy Observations:</label>
                    <textarea 
                      className="mentor-stage-textarea"
                      rows={3}
                      value={auditStage1.notes}
                      onChange={(e) => setAuditStage1(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="e.g., Contact links are clean, but line-height in projects feels cramped. Add 4px margin..."
                    />
                  </div>

                  <div className="mentor-stage-nav-footer">
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Step 1 of 4</span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setCurrentAuditStage(2)}
                    >
                      Next: Project Authenticity ➔
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 2: Project Authenticity & Technical Depth */}
              {currentAuditStage === 2 && (
                <div className="mentor-stage-content">
                  <div className="mentor-stage-header">
                    <span className="mentor-stage-icon">🛠️</span>
                    <div>
                      <h4 className="mentor-stage-title">Stage 2: Project Authenticity & Technical Depth</h4>
                      <p className="mentor-stage-desc">
                        Do projects reflect genuine engineering depth or standard tutorial clones?
                      </p>
                    </div>
                  </div>

                  <div className="mentor-stage-field">
                    <div className="mentor-stage-label-row">
                      <label className="mentor-stage-label">Select Candidate Project to Audit:</label>
                    </div>
                    <div className="mentor-select-wrapper">
                      <select
                        value={auditStage2.selectedProject}
                        onChange={(e) => setAuditStage2(prev => ({ ...prev, selectedProject: e.target.value }))}
                        className="mentor-stage-select"
                      >
                        <option value="Smart Attendance System">Smart Attendance System (IoT & Web)</option>
                        <option value="Portfolio & Mini Projects">Personal Portfolio & Mini Projects</option>
                      </select>
                      <span className="mentor-select-chevron" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="mentor-stage-field">
                    <label className="mentor-stage-label">Authenticity Level:</label>
                    <div className="audit-verdict-grid">
                      {[
                        { val: 'genuine_challenge', label: '🌟 Authentic' },
                        { val: 'academic_standard', label: '📘 Academic' },
                        { val: 'tutorial_clone', label: '⚠️ Clone' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          className={`audit-verdict-card ${auditStage2.authenticity === opt.val ? 'selected' : ''}`}
                          onClick={() => setAuditStage2(prev => ({ ...prev, authenticity: opt.val as any }))}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mentor-stage-field">
                    <label className="mentor-stage-label">Engineering Challenges & Edge Cases to Detail:</label>
                    <textarea 
                      className="mentor-stage-textarea"
                      rows={3}
                      value={auditStage2.challengeNotes}
                      onChange={(e) => setAuditStage2(prev => ({ ...prev, challengeNotes: e.target.value }))}
                      placeholder="e.g., Detail how image processing handled low light conditions, or describe database indexing for search..."
                    />
                  </div>

                  <div className="mentor-stage-field">
                    <label className="mentor-stage-label">Proof of Work (Live Demo / GitHub Repo Link):</label>
                    <input 
                      type="text"
                      className="mentor-stage-input"
                      value={auditStage2.proofOfWork}
                      onChange={(e) => setAuditStage2(prev => ({ ...prev, proofOfWork: e.target.value }))}
                      placeholder="e.g. https://github.com/student/repo or https://live-demo.vercel.app"
                    />
                  </div>

                  <div className="mentor-stage-nav-footer">
                    <button
                      type="button"
                      className="btn-stage-nav"
                      onClick={() => setCurrentAuditStage(1)}
                    >
                      ← Back: 6-Sec Glance
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setCurrentAuditStage(3)}
                    >
                      Next: Interview Defense ➔
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 3: Interview Defense & Grilling Question */}
              {currentAuditStage === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="mentor-stage-header">
                    <span className="mentor-stage-icon">🎙️</span>
                    <div>
                      <h4 className="mentor-stage-title">Stage 3: Interview Defense & Grilling</h4>
                      <p className="mentor-stage-desc">
                        Prepare the student for difficult technical questions a recruiter or tech lead will ask.
                      </p>
                    </div>
                  </div>

                  <div className="mentor-stage-field">
                    <label className="mentor-stage-label">Interviewer Challenge Question:</label>
                    <textarea 
                      className="mentor-stage-textarea"
                      rows={3}
                      value={auditStage3.interviewQuestion}
                      onChange={(e) => setAuditStage3(prev => ({ ...prev, interviewQuestion: e.target.value }))}
                      placeholder='e.g., "If 1,000 requests hit your attendance backend simultaneously, how did your database prevent race conditions?"'
                    />
                  </div>

                  <div className="mentor-stage-field">
                    <label className="mentor-stage-label">Mentor Coaching Tip (How Candidate Should Answer):</label>
                    <textarea 
                      className="mentor-stage-textarea"
                      rows={2}
                      value={auditStage3.prepTip}
                      onChange={(e) => setAuditStage3(prev => ({ ...prev, prepTip: e.target.value }))}
                      placeholder="e.g., Mention queue workers, Redis caching, or SQL transaction isolation levels."
                    />
                  </div>

                  <div className="mentor-stage-nav-footer">
                    <button
                      type="button"
                      className="btn-stage-nav"
                      onClick={() => setCurrentAuditStage(2)}
                    >
                      ← Back: Tech Depth
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setCurrentAuditStage(4)}
                    >
                      Next: Action Plan ➔
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 4: Prioritized Action Plan & Homework */}
              {currentAuditStage === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="mentor-stage-header">
                    <span className="mentor-stage-icon">🚀</span>
                    <div>
                      <h4 className="mentor-stage-title">Stage 4: 7-Day Prioritized Action Plan</h4>
                      <p className="mentor-stage-desc">
                        Give the candidate concrete homework tasks to polish their resume this week.
                      </p>
                    </div>
                  </div>

                  <div className="mentor-stage-field">
                    <label className="mentor-stage-label">Task 1 (Critical Must-Fix Priority):</label>
                    <input 
                      type="text"
                      className="mentor-stage-input"
                      value={auditStage4.task1}
                      onChange={(e) => setAuditStage4(prev => ({ ...prev, task1: e.target.value }))}
                      placeholder="e.g. Add quantifiable metrics to project 1"
                    />
                  </div>

                  <div className="mentor-stage-field">
                    <label className="mentor-stage-label">Task 2 (Impact Polish Priority):</label>
                    <input 
                      type="text"
                      className="mentor-stage-input"
                      value={auditStage4.task2}
                      onChange={(e) => setAuditStage4(prev => ({ ...prev, task2: e.target.value }))}
                      placeholder="e.g. Separate skills into languages, frameworks, and developer tools"
                    />
                  </div>

                  <div className="mentor-stage-field">
                    <label className="mentor-stage-label">Personal Words of Encouragement from Mentor:</label>
                    <textarea 
                      className="mentor-stage-textarea"
                      rows={2}
                      value={auditStage4.encouragement}
                      onChange={(e) => setAuditStage4(prev => ({ ...prev, encouragement: e.target.value }))}
                      placeholder="Leave a motivating mentor closing message..."
                    />
                  </div>

                  <div className="mentor-stage-nav-footer">
                    <button
                      type="button"
                      className="btn-stage-nav"
                      onClick={() => setCurrentAuditStage(3)}
                    >
                      ← Back: Interview Q
                    </button>

                    <button
                      type="button"
                      className="btn-apply-audit"
                      onClick={handleApplyAuditToReview}
                    >
                      ✓ Compile & Apply Audit as Review Notes
                    </button>
                  </div>

                  {auditAppliedSuccess && (
                    <div style={{
                      background: '#DCFCE7',
                      color: '#15803D',
                      border: '1px solid #86EFAC',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      ✅ 4-Stage Mentor Audit compiled & applied to student review notes and general feedback!
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {/* =========================================================================
              METHOD 3: REWRITE SUGGESTION TOOL (BEFORE / AFTER DIFF)
             ========================================================================= */}
          {activeCommentTool === 'rewrite_diff' && (
            <div className="rewrite-tool-card">
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                Suggest Exact Sentence Rewrite (Diff Proposal)
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>
                Show the student an exact before & after transformation of their bullet point or summary:
              </p>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Target Section:
                </label>
                <select 
                  className="search-field"
                  style={{ height: '34px', fontSize: '12px', width: '100%', marginBottom: '8px' }}
                  value={rewriteTargetSection}
                  onChange={(e) => setRewriteTargetSection(e.target.value)}
                >
                  {resumeSections.map(s => (
                    <option key={s.key} value={s.key}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#991B1B', display: 'block', marginBottom: '4px' }}>
                  Original Student Text (Before):
                </label>
                <textarea 
                  className="feedback-textarea"
                  style={{ minHeight: '52px', fontSize: '12px', padding: '8px', marginBottom: '8px' }}
                  value={rewriteOriginal}
                  onChange={(e) => setRewriteOriginal(e.target.value)}
                  placeholder="Paste student's current weak sentence..."
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#166534', display: 'block', marginBottom: '4px' }}>
                  Mentor Suggested Rewrite (After):
                </label>
                <textarea 
                  className="feedback-textarea"
                  style={{ minHeight: '52px', fontSize: '12px', padding: '8px', border: '1.5px solid #86EFAC', marginBottom: '10px' }}
                  value={rewriteProposed}
                  onChange={(e) => setRewriteProposed(e.target.value)}
                  placeholder="Write the polished, action-oriented version with metrics..."
                />
              </div>

              {/* Side-by-Side Diff Preview */}
              <div className="diff-box-group">
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#334155' }}>Live Student Diff Preview:</span>
                <div className="diff-box before">
                  <span className="diff-label">❌ Before (Weak / Passive):</span>
                  <div style={{ fontSize: '12px', textDecoration: 'line-through', color: '#7F1D1D' }}>
                    {rewriteOriginal}
                  </div>
                </div>
                <div className="diff-box after">
                  <span className="diff-label">✅ After (Actionable & High-Impact):</span>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#14532D' }}>
                    {rewriteProposed}
                  </div>
                </div>
              </div>

              <button 
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSaveRewriteSuggestion}
                style={{ marginTop: '6px' }}
              >
                + Attach Rewrite Suggestion to Review
              </button>

              {rewriteSavedAlert && (
                <div style={{ background: '#DCFCE7', color: '#15803D', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
                  ✓ Rewrite suggestion saved and attached to student checklist!
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              METHOD 4: VOICE / AUDIO COACHING NOTE (OVERALL & SUBTOPIC TARGETS)
             ========================================================================= */}
          {activeCommentTool === 'voice_memo' && (
            <div className="voice-memo-panel">
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                🎙️ Audio Voice Coaching Notes
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '380px', margin: '0 auto 12px auto' }}>
                Record voice notes either for <strong>specific resume subtopics</strong> or as an <strong>overall review coaching memo</strong>.
              </p>

              {/* Target Selector Card */}
              <div className="voice-target-selector-box">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#854D0E', textTransform: 'uppercase' }}>
                    🎯 Record Voice Note For:
                  </span>
                  {(voiceTarget === 'overall' ? activeStudent.audioNote?.recorded : volunteerSubtopics.find(s => s.id === voiceTarget)?.audioNote?.recorded) && (
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: '9999px' }}>
                      ✓ Audio Attached ({(voiceTarget === 'overall' ? activeStudent.audioNote?.duration : volunteerSubtopics.find(s => s.id === voiceTarget)?.audioNote?.duration)})
                    </span>
                  )}
                </div>

                <select 
                  className="search-field"
                  style={{ width: '100%', height: '38px', fontSize: '13px', fontWeight: '700', background: '#FFFFFF' }}
                  value={voiceTarget}
                  onChange={(e) => {
                    setVoiceTarget(e.target.value);
                    setIsVoiceRecording(false);
                    setIsPlayingAudio(false);
                    setVoiceSeconds(0);
                  }}
                >
                  <option value="overall">📢 Overall Review Memo (General Feedback)</option>
                  <optgroup label="📌 Specific Subtopic Sections">
                    {volunteerSubtopics.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.title} {sub.audioNote?.recorded ? `(Attached: ${sub.audioNote.duration})` : '(No audio yet)'}
                      </option>
                    ))}
                  </optgroup>
                </select>

                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px' }}>
                  {voiceTarget === 'overall' 
                    ? "Recording will attach to candidate's overall review card."
                    : `Recording will attach directly to the "${volunteerSubtopics.find(s => s.id === voiceTarget)?.title || 'Selected'}" checklist card.`}
                </div>
              </div>

              {/* Recording Time Limit Selector */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: '4px 0 10px 0', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B' }}>⏱️ Duration Limit:</span>
                {[60, 180, 300, 600].map(limit => (
                  <button
                    key={limit}
                    type="button"
                    className={`limit-pill-btn ${maxVoiceSeconds === limit ? 'active' : ''}`}
                    onClick={() => {
                      if (!isVoiceRecording) setMaxVoiceSeconds(limit);
                    }}
                    disabled={isVoiceRecording}
                    title={`Set maximum recording duration to ${limit / 60} min`}
                  >
                    {limit / 60} min{limit > 60 ? 's' : ''}
                  </button>
                ))}
              </div>

              <div className="voice-recording-stage">
                <div 
                  className={`voice-mic-circle ${isVoiceRecording ? 'recording' : ''}`}
                  onClick={() => {
                    if (isVoiceRecording) {
                      setIsVoiceRecording(false);
                      const duration = formatVoiceTime(Math.max(voiceSeconds, 3));
                      const timestamp = 'Just now';
                      const audioData = { recorded: true, duration, timestamp };
                      if (voiceTarget === 'overall') {
                        saveAudioNote(audioData);
                      } else {
                        updateSubtopicAudioNote(voiceTarget, audioData);
                      }
                    } else {
                      setIsVoiceRecording(true);
                      setVoiceSeconds(0);
                      setIsPlayingAudio(false);
                    }
                  }}
                  title={isVoiceRecording ? "Click to Stop Recording" : "Click to Record Voice Feedback"}
                >
                  {isVoiceRecording ? '⏹' : '🎤'}
                </div>

                <div style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'monospace', color: isVoiceRecording ? '#DC2626' : '#0F172A' }}>
                  {formatVoiceTime(voiceSeconds)} / {formatVoiceTime(maxVoiceSeconds)}
                </div>

                {/* Animated Equalizer Waveform */}
                <div className="waveform-display">
                  {[12, 24, 18, 28, 14, 22, 30, 16, 26, 20, 14, 28, 18, 24].map((h, i) => (
                    <div 
                      key={i} 
                      className={`wave-bar ${isVoiceRecording || isPlayingAudio ? 'active' : ''}`}
                      style={{ 
                        height: isVoiceRecording || isPlayingAudio ? undefined : `${h}px`,
                        animationDelay: `${i * 0.08}s` 
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
                {!isVoiceRecording && !(voiceTarget === 'overall' ? activeStudent.audioNote?.recorded : volunteerSubtopics.find(s => s.id === voiceTarget)?.audioNote?.recorded) && (
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setIsVoiceRecording(true);
                      setVoiceSeconds(0);
                      setIsPlayingAudio(false);
                    }}
                  >
                    ● Start Recording (Up to {maxVoiceSeconds / 60} mins)
                  </button>
                )}

                {isVoiceRecording && (
                  <button 
                    type="button" 
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setIsVoiceRecording(false);
                      const duration = formatVoiceTime(Math.max(voiceSeconds, 3));
                      const timestamp = 'Just now';
                      const audioData = { recorded: true, duration, timestamp };
                      if (voiceTarget === 'overall') {
                        saveAudioNote(audioData);
                      } else {
                        updateSubtopicAudioNote(voiceTarget, audioData);
                      }
                    }}
                  >
                    ⏹ Done Recording
                  </button>
                )}

                {(voiceTarget === 'overall' ? activeStudent.audioNote?.recorded : volunteerSubtopics.find(s => s.id === voiceTarget)?.audioNote?.recorded) && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    >
                      {isPlayingAudio ? '⏸ Pause' : `▶ Play (${(voiceTarget === 'overall' ? activeStudent.audioNote?.duration : volunteerSubtopics.find(s => s.id === voiceTarget)?.audioNote?.duration) || '0:30'})`}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setIsPlayingAudio(false);
                        setVoiceSeconds(0);
                        if (voiceTarget === 'overall') {
                          saveAudioNote({ recorded: false, duration: '0:00', timestamp: '' });
                        } else {
                          updateSubtopicAudioNote(voiceTarget, { recorded: false, duration: '0:00', timestamp: '' });
                        }
                      }}
                    >
                      ↺ Remove & Re-Record
                    </button>
                  </>
                )}
              </div>

              {/* All Recorded Voice Notes Directory */}
              <div className="all-recorded-voice-notes-box">
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Recorded Audio Feedback ({((activeStudent?.audioNote?.recorded ? 1 : 0) + volunteerSubtopics.filter(s => s.audioNote?.recorded).length)}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeStudent.audioNote?.recorded && (
                    <div className={`voice-list-item ${voiceTarget === 'overall' ? 'active-target' : ''}`}>
                      <div>
                        <strong style={{ fontSize: '12px' }}>📢 Overall Review Coaching Memo</strong>
                        <span style={{ fontSize: '11px', color: '#166534', marginLeft: '6px', fontWeight: '700' }}>
                          ({activeStudent.audioNote.duration})
                        </span>
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-xs"
                        onClick={() => setVoiceTarget('overall')}
                      >
                        {voiceTarget === 'overall' ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  )}

                  {volunteerSubtopics.filter(s => s.audioNote?.recorded).map(s => (
                    <div key={s.id} className={`voice-list-item ${voiceTarget === s.id ? 'active-target' : ''}`}>
                      <div>
                        <strong style={{ fontSize: '12px' }}>📌 {s.title}</strong>
                        <span style={{ fontSize: '11px', color: '#166534', marginLeft: '6px', fontWeight: '700' }}>
                          ({s.audioNote?.duration})
                        </span>
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-xs"
                        onClick={() => setVoiceTarget(s.id)}
                      >
                        {voiceTarget === s.id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  ))}

                  {((activeStudent?.audioNote?.recorded ? 1 : 0) + volunteerSubtopics.filter(s => s.audioNote?.recorded).length) === 0 && (
                    <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic', textAlign: 'center', padding: '8px' }}>
                      No voice feedback notes recorded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              METHOD 5: EVALUATION RUBRIC SCORECARD
             ========================================================================= */}
          {activeCommentTool === 'rubric' && (
            <div className="rubric-panel">
              <div className="rubric-header-score">
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#854D0E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Evaluation Score
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#713F12' }}>
                    {calculateRubricOverall()}% Ready
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: '#854D0E', fontWeight: '600' }}>
                  4 Standard Criteria
                </div>
              </div>

              {/* Criterion 1 */}
              <div className="rubric-criterion-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                  <span>1. ATS & Layout Safety</span>
                  <span style={{ color: '#D97706', fontWeight: '800' }}>{rubricScores.atsFormat} / 5★</span>
                </div>
                <div className="rubric-stars-selector">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button 
                      key={val} 
                      type="button" 
                      className={`rubric-score-pill ${rubricScores.atsFormat === val ? 'active' : ''}`}
                      onClick={() => handleRubricScoreChange('atsFormat', val)}
                    >
                      {val}★
                    </button>
                  ))}
                </div>
              </div>

              {/* Criterion 2 */}
              <div className="rubric-criterion-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                  <span>2. Impact & Measurable Metrics</span>
                  <span style={{ color: '#D97706', fontWeight: '800' }}>{rubricScores.metricsImpact} / 5★</span>
                </div>
                <div className="rubric-stars-selector">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button 
                      key={val} 
                      type="button" 
                      className={`rubric-score-pill ${rubricScores.metricsImpact === val ? 'active' : ''}`}
                      onClick={() => handleRubricScoreChange('metricsImpact', val)}
                    >
                      {val}★
                    </button>
                  ))}
                </div>
              </div>

              {/* Criterion 3 */}
              <div className="rubric-criterion-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                  <span>3. Technical Projects Depth</span>
                  <span style={{ color: '#D97706', fontWeight: '800' }}>{rubricScores.techDepth} / 5★</span>
                </div>
                <div className="rubric-stars-selector">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button 
                      key={val} 
                      type="button" 
                      className={`rubric-score-pill ${rubricScores.techDepth === val ? 'active' : ''}`}
                      onClick={() => handleRubricScoreChange('techDepth', val)}
                    >
                      {val}★
                    </button>
                  ))}
                </div>
              </div>

              {/* Criterion 4 */}
              <div className="rubric-criterion-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                  <span>4. Clarity & Strong Action Verbs</span>
                  <span style={{ color: '#D97706', fontWeight: '800' }}>{rubricScores.grammarClarity} / 5★</span>
                </div>
                <div className="rubric-stars-selector">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button 
                      key={val} 
                      type="button" 
                      className={`rubric-score-pill ${rubricScores.grammarClarity === val ? 'active' : ''}`}
                      onClick={() => handleRubricScoreChange('grammarClarity', val)}
                    >
                      {val}★
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleInsertRubricSummary}
                style={{ marginTop: '4px' }}
              >
                📝 Append Rubric Scorecard into Overall Feedback
              </button>
            </div>
          )}

          {/* Star Rating Section */}
          <div className="review-rating-box">
            <span className="review-section-label">Overall Star Rating</span>
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
            <span className="review-section-label">Quick Improvement Tags</span>
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
            <span className="review-section-label">Overall Volunteer Review Feedback</span>
            <textarea 
              className="feedback-textarea"
              placeholder="Write comprehensive summary feedback for the candidate..."
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
              ✓ Approve Resume
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
        const cat = subtopic?.category || 'suggestion';

        return (
          <section 
            key={sec.key}
            className={`resume-section ${isVolunteerHighlighted ? 'has-volunteer-highlight' : ''}`}
            id={`section-doc-${sec.key}`}
          >
            {/* Section Header */}
            <div 
              className="resume-section-title" 
              onClick={() => onSelectSection(sec.key)}
              title="Click to view notes in review panel"
              style={{ cursor: 'pointer' }}
            >
              <span>{sec.title}</span>
              {isVolunteerHighlighted && (
                <span className="clean-doc-highlight-pill">
                  ● {cat === 'must_fix' ? 'Must Fix' : cat === 'praise' ? 'Praise' : 'Note'}
                </span>
              )}
            </div>

            {/* Clean Section Content */}
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
              <ul style={{ paddingLeft: '20px', fontSize: '12.5px', color: '#334155', margin: '4px 0' }}>
                {(sec.items as string[])?.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '3px' }}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </>
  );
};
