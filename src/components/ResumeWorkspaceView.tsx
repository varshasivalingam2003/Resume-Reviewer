import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { initialStudents, Student, VolunteerSubtopic, ResumeSection, getResumeSectionsForVersion } from '../data/studentsData';
import { downloadResumeDocument } from '../utils/resumeDownload';
import { 
  ArrowLeftIcon, PdfIcon, DownloadIcon, MaximizeIcon, 
  CommentIcon, CheckIcon, StarIcon, StarRating, GithubIcon
} from './Icons';
import { getResumeDownloadUrl, getResumeViewUrl } from '../services/zohoApi';
import { 
  GraduationCap, 
  Save, 
  Check, 
  FileText, 
  Edit3, 
  Sparkles, 
  RefreshCw, 
  Mic, 
  BarChart3, 
  Lightbulb, 
  AlertCircle, 
  Award, 
  HelpCircle, 
  X, 
  Eye, 
  Wrench, 
  Rocket, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Square, 
  Circle, 
  Play, 
  Pause, 
  RotateCcw, 
  MessageSquare, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  FilePlus, 
  Target, 
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';

import { InlineReviewBox } from './InlineReviewBox';

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
  openInlineSectionKey: string | null;
  onToggleInlineBox: (key: string, title: string) => void;
  onCloseInlineBox: () => void;
  resumeSections: ResumeSection[];
  version: 'old' | 'new';
  onSaveSubtopic: (data: any) => void;
  onSaveOverall: (data: any) => void;
}

export const ResumeWorkspaceView: React.FC = () => {
  const { 
    activeStudent,
    students,
    openStudentReview,
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

  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    setPdfLoading(true);
    setPdfError(false);
  }, [activeStudent?.id, activeStudent?.resumeAttachment]);

  const resumePdfUrl = activeStudent?.resumeAttachment 
    ? getResumeViewUrl(activeStudent.resumeAttachment, activeStudent.name)
    : '';

  // Inline Review Dialogue Box State (Opens directly below clicked section, NO POPUP)
  const [openInlineSectionKey, setOpenInlineSectionKey] = useState<string | null>(null);

  const toggleInlineReviewBox = (sectionKey = 'overall') => {
    if (openInlineSectionKey === sectionKey) {
      // Clicking same pencil closes the box
      setOpenInlineSectionKey(null);
    } else {
      setOpenInlineSectionKey(sectionKey);
    }
  };

  const closeInlineReviewBox = () => {
    setOpenInlineSectionKey(null);
  };

  // In-Tab Old vs New Resume Version State (New Resume has edit options, Old Resume is read-only reference)
  const [activeResumeVersion, setActiveResumeVersion] = useState<'old' | 'new'>('new');

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
      case 'sections': return 'Section Notes';
      case 'ai_suggestions': return 'AI Suggestions';
      case 'rewrite_diff': return 'Rewrite (Diff)';
      case 'voice_memo': return 'Voice Memo';
      case 'rubric': return 'Rubric Scorecard';
    }
  };

  const handleInsertRubricSummary = () => {
    const summary = `\n\nMENTOR EVALUATION RUBRIC (Score: ${calculateRubricOverall()}%):\n• ATS & Layout: ${rubricScores.atsFormat}/5\n• Impact & Metrics: ${rubricScores.metricsImpact}/5\n• Technical Stack Depth: ${rubricScores.techDepth}/5\n• Clarity & Action Verbs: ${rubricScores.grammarClarity}/5`;
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
            {students && students.length > 1 ? (
              <select 
                className="workspace-student-select"
                value={activeStudent.id}
                onChange={(e) => openStudentReview(e.target.value)}
                style={{
                  fontWeight: 700,
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  background: '#FFFFFF',
                  cursor: 'pointer'
                }}
                title="Switch candidate"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="workspace-student-name">{activeStudent.name}</span>
            )}
            <span className="workspace-student-degree">{activeStudent.degree}</span>
            <span className={`status-badge status-${activeStudent.status}`}>
              {formatStatus(activeStudent.status)}
            </span>
          </div>
        </div>

        <div className="workspace-top-actions">
          <button 
            type="button"
            className="toolbar-pencil-action-btn"
            onClick={() => openFeedbackDialog('overall')}
            title="Open Review Notes & Scoring Dialogue Box"
          >
            <Edit3 size={14} />
            <span>Score & Note Dialogue</span>
          </button>

          <button 
            className="btn btn-outline btn-sm"
            onClick={() => {
              setSelectedStudentForViewId(activeStudent.id);
              setActiveRole('student');
            }}
            title="Preview how student sees the listed mistakes and feedback"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <GraduationCap size={13} />
            <span>Student View</span>
          </button>

          <button 
            className="btn btn-danger-outline btn-sm"
            onClick={() => openModal('changes')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <AlertTriangle size={13} />
            <span>Needs Changes</span>
          </button>

          <button 
            className="btn btn-primary btn-sm"
            onClick={() => openModal('approve')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <Check size={14} />
            <span>Approve Resume</span>
          </button>

          <button 
            className="btn btn-outline btn-sm"
            onClick={() => alert('Review comments, audit notes, audio memo, and rubric saved successfully!')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <Save size={13} />
            <span>Save Draft</span>
          </button>
        </div>
      </header>

      {/* Full-Width Focused Resume Viewer (No Sidebar Beside Resume) */}
      <div className="workspace-dual-pane">
        <section className="resume-viewer-pane">
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
                  onClick={() => {
                    setActiveResumeVersion('old');
                    setOpenInlineSectionKey(null);
                  }}
                  title="Switch to view original submission reference (v1 - read-only)"
                >
                  <FileText size={13} />
                  <span>Old Resume (v1)</span>
                </button>
                <button
                  type="button"
                  className={`version-toggle-btn ${activeResumeVersion === 'new' ? 'active-new' : ''}`}
                  onClick={() => setActiveResumeVersion('new')}
                  title="Switch to review and edit revised & optimized resume (v2)"
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
                onClick={() => {
                  if (activeStudent.resumeAttachment) {
                    window.open(getResumeDownloadUrl(activeStudent.resumeAttachment, activeStudent.name), '_blank');
                  } else {
                    downloadResumeDocument(activeStudent, activeResumeVersion);
                  }
                }}
                title={`Download ${activeResumeVersion === 'old' ? 'Original (v1)' : 'Revised (v2)'} Resume`}
              >
                <DownloadIcon size={16} />
              </button>

              <button 
                className="toolbar-action-icon-btn" 
                onClick={() => {
                  if (resumePdfUrl) {
                    window.open(resumePdfUrl, '_blank');
                  }
                }}
                title="Open PDF in New Tab"
              >
                <MaximizeIcon size={16} />
              </button>
            </div>
          </div>

          {/* Document Canvas: Centered Resume Paper */}
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
                openInlineSectionKey={openInlineSectionKey}
                onToggleInlineBox={toggleInlineReviewBox}
                onCloseInlineBox={closeInlineReviewBox}
                resumeSections={resumeSections}
                version={activeResumeVersion}
                onSaveSubtopic={(subData) => {
                  const existing = (activeStudent.volunteerSubtopics || []).find(
                    s => s.sectionKey === subData.sectionKey || s.id === subData.sectionKey
                  );
                  if (existing) {
                    updateSubtopicCommand(existing.id, subData.command);
                    updateSubtopicCategory(existing.id, subData.category);
                    if (subData.suggestedRewrite) {
                      updateSubtopicRewrite(existing.id, subData.suggestedRewrite);
                    }
                    if (subData.audioNote) {
                      updateSubtopicAudioNote(existing.id, subData.audioNote);
                    }
                  } else {
                    addVolunteerSubtopic(subData.title, subData.sectionKey, subData.command, subData.category);
                  }
                }}
                onSaveOverall={(overallData) => {
                  updateGeneralFeedback(overallData.generalFeedback);
                  setRating(overallData.rating);
                  saveRubricScores(overallData.rubricScores);
                  if (overallData.audioNote) {
                    saveAudioNote(overallData.audioNote);
                  }
                  if (overallData.improveTags) {
                    overallData.improveTags.forEach(tag => {
                      if (!activeStudent.improveTags?.includes(tag)) {
                        toggleImproveTag(tag);
                      }
                    });
                  }
                }}
              />
            </div>

            {/* Floating Pencil Action Button (Available on New Resume for editing) */}
            {activeResumeVersion === 'new' && (
              <button
                type="button"
                className="floating-pencil-fab"
                onClick={() => toggleInlineReviewBox('overall')}
                title="Click pencil to open review notes & scoring below"
              >
                <Edit3 size={16} />
                <span>{openInlineSectionKey ? 'Close Review' : 'Review & Score'}</span>
              </button>
            )}
          </div>
        </section>
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
  onQuickHighlight,
  openInlineSectionKey,
  onToggleInlineBox,
  onCloseInlineBox,
  resumeSections,
  version = 'new',
  onSaveSubtopic,
  onSaveOverall
}) => {
  const isEditable = version === 'new';
  const allSections = getResumeSectionsForVersion(student, version);

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
          <span className="resume-contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Mail size={12} />
            <span>{student.email}</span>
          </span>
          <span>•</span>
          <span className="resume-contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Phone size={12} />
            <span>{student.phone}</span>
          </span>
          <span>•</span>
          <span className="resume-contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} />
            <span>{student.location}</span>
          </span>
          {student.github && (
            <>
              <span>•</span>
              <span className="resume-contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <GithubIcon size={12} />
                <span>{student.github}</span>
              </span>
            </>
          )}

          {isEditable && (
            <button
              type="button"
              className={`section-pencil-btn ${openInlineSectionKey === 'overall' ? 'is-active-open' : ''}`}
              onClick={() => onToggleInlineBox('overall', 'Overall Profile')}
              title="Review overall profile & score candidate"
              style={{ marginLeft: '8px' }}
            >
              <Edit3 size={11} />
              <span>Score / Note</span>
            </button>
          )}
        </div>

        {/* Inline Dialogue Box directly below header/contact bar if overall review opened (Only on Old Resume) */}
        {isEditable && openInlineSectionKey === 'overall' && (
          <InlineReviewBox
            sectionKey="overall"
            sectionTitle="Overall Profile & Scoring"
            onClose={onCloseInlineBox}
            activeStudent={student}
            resumeSections={allSections}
            onSaveSubtopic={onSaveSubtopic}
            onSaveOverall={onSaveOverall}
          />
        )}
      </header>

      {/* Dynamic Personalized Resume Sections */}
      {sections.map(sec => {
        const subtopic = getSubtopicForSection(sec.key, sec.title);
        const isVolunteerHighlighted = !!(subtopic && subtopic.isHighlighted);
        const cat = subtopic?.category || 'suggestion';

        return (
          <section 
            key={sec.key}
            className={`resume-section ${isEditable && isVolunteerHighlighted ? 'has-volunteer-highlight' : ''}`}
            id={`section-doc-${sec.key}`}
          >
            {/* Section Header with Interactive Pencil Action (Only on Old Resume) */}
            <div className="resume-section-title-wrap">
              <div 
                className="resume-section-title" 
                onClick={() => isEditable && onSelectSection(sec.key)}
                title={isEditable ? "Click section to focus" : undefined}
                style={{ cursor: isEditable ? 'pointer' : 'default' }}
              >
                <span>{sec.title}</span>
                {isEditable && isVolunteerHighlighted && (
                  <span className="clean-doc-highlight-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Circle size={6} fill="currentColor" />
                    <span>{cat === 'must_fix' ? 'Must Fix' : cat === 'praise' ? 'Praise' : 'Note'}</span>
                  </span>
                )}
              </div>

              {isEditable && (
                <button
                  type="button"
                  className={`section-pencil-btn ${openInlineSectionKey === sec.key ? 'is-active-open' : ''} ${subtopic?.command ? 'has-notes' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleInlineBox(sec.key, sec.title);
                  }}
                  title={`Click pencil to review ${sec.title}`}
                >
                  <Edit3 size={11} />
                  <span>{subtopic?.command ? 'Edit Note' : 'Add Note'}</span>
                </button>
              )}
            </div>

            {/* Inline Dialogue Box directly below this section (Only on Old Resume) */}
            {isEditable && openInlineSectionKey === sec.key && (
              <InlineReviewBox
                sectionKey={sec.key}
                sectionTitle={sec.title}
                onClose={onCloseInlineBox}
                activeStudent={student}
                resumeSections={allSections}
                onSaveSubtopic={onSaveSubtopic}
                onSaveOverall={onSaveOverall}
              />
            )}

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
