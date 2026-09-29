import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { initialStudents, getResumeSectionsForVersion, ResumeSection, EducationItem, ProjectItem } from '../data/studentsData';
import { downloadResumeDocument } from '../utils/resumeDownload';
import { getResumeDownloadUrl, getResumeViewUrl, getResumeRawUrl } from '../services/zohoApi';
import { groupPdfItemsIntoLines, parseResumeFromPdfLines, ParsedPdfResume, RawPdfTextItem } from '../utils/pdfResumeParser';
import { InlineReviewBox } from './InlineReviewBox';
import { 
  CheckCircleIcon, WarningTriangleIcon, ClockIcon, 
  PortalLogoIcon, LogoutIcon, DownloadIcon,
  PdfIcon, MaximizeIcon, GithubIcon, StarRating
} from './Icons';
import { 
  GraduationCap, 
  Hand, 
  FileText, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Check, 
  X, 
  Columns, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Lock,
  RotateCw
} from 'lucide-react';

interface ResumeComparisonViewProps {
  isVolunteerView?: boolean;
}

interface PrivacyMask {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  type: 'email' | 'phone' | 'address' | 'photo';
  label: string;
}

// PDF Canvas for Original Resume with Privacy Protection
const PdfOldResumeCanvas: React.FC<{
  resumeAttachment: string;
  studentName: string;
  pageNum: number;
  zoomLevel: number;
  rotation?: number;
  onParsedResume?: (parsed: ParsedPdfResume) => void;
}> = ({ resumeAttachment, studentName, pageNum, zoomLevel, rotation = 0, onParsedResume }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [privacyMasks, setPrivacyMasks] = useState<PrivacyMask[]>([]);

  const resumePdfUrl = resumeAttachment.startsWith('/') && !resumeAttachment.startsWith('/api')
    ? resumeAttachment
    : getResumeRawUrl(resumeAttachment, studentName);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(false);

    const renderPdf = async () => {
      try {
        const pdfjs = (window as any).pdfjsLib;
        if (!pdfjs) return;

        const loadingTask = pdfjs.getDocument({
          url: resumePdfUrl,
          withCredentials: false
        });
        const doc = await loadingTask.promise;
        if (isCancelled) return;

        const page = await doc.getPage(Math.min(pageNum, doc.numPages));
        if (isCancelled) return;

        const baseScale = typeof window !== 'undefined' && window.innerWidth <= 640 ? 0.75 : 1.15;
        const viewport = page.getViewport({
          scale: baseScale * (zoomLevel / 100),
          rotation: (page.rotate + (rotation || 0)) % 360
        });

        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        if (isCancelled) return;

        // Privacy text extraction & dynamic section parsing
        const textContent = await page.getTextContent();
        if (isCancelled) return;

        const rawPdfItems: RawPdfTextItem[] = [];
        textContent.items.forEach((item: any) => {
          if (!item.str || typeof item.str !== 'string') return;
          rawPdfItems.push({
            str: item.str,
            tx: item.transform[4],
            ty: item.transform[5],
            width: Math.max(item.width, 4),
            height: Math.max(item.height || Math.abs(item.transform[3]) || 12, 12)
          });
        });

        const lines = groupPdfItemsIntoLines(rawPdfItems);
        const parsed = parseResumeFromPdfLines(lines, studentName);
        if (onParsedResume && parsed.sections.length > 0) {
          onParsedResume(parsed);
        }

        const emailRegex = /[A-Za-z0-9._%+-]+(?:\s*@\s*|\s*\[at\]\s*)[A-Za-z0-9.-]+\s*\.[A-Za-z]{2,}/i;
        const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}|\b[6-9]\d{4}[\s.-]?\d{5}\b|\b[6-9]\d{9}\b|\+91[\s-]?\d{10}/;
        const addressIndicatorRegex = /(?:permanent|current|residential|present|communication|postal)?\s*address[\s:]|\b(?:door|flat|plot|house|d[\s./-]?no|h[\s./-]?no)\b|\b(?:street|road|rd\.?|lane|nagar|colony|layout|salai|cross|main|kovil|temple|apt|apartment|block)\b|\b(?:chennai|coimbatore|madurai|trichy|salem|bangalore|bengaluru|hyderabad|mumbai|delhi|kolkata|pune|kerala|tamil\s*nadu|karnataka|andhra|india)\b|\b(?:thiruvottiyur|tambaram|velachery|guindy|anna\s*nagar|ambattur|avadi|mylapore|adyar|triplicane|chromepet)\b|\b(?:pincode|pin\s*code|postal\s*code|pin[\s:-]*\d{6})\b|\b[1-9]\d{5}\b/i;

        const rawMasks: PrivacyMask[] = [];
        textContent.items.forEach((item: any) => {
          if (!item.str || typeof item.str !== 'string') return;
          const str = item.str.trim();
          const tx = item.transform[4];
          const ty = item.transform[5];
          const w = Math.max(item.width, 4);
          const h = Math.max(item.height || Math.abs(item.transform[3]) || 12, 12);

          if (emailRegex.test(str) || phoneRegex.test(str) || addressIndicatorRegex.test(str)) {
            const rect = viewport.convertToViewportRectangle([tx - 2, ty - 2, tx + w + 2, ty + h + 2]);
            rawMasks.push({
              id: `pm-${Math.round(tx)}-${Math.round(ty)}`,
              left: Math.round(Math.min(rect[0], rect[2])),
              top: Math.round(Math.min(rect[1], rect[3])),
              width: Math.round(Math.abs(rect[2] - rect[0])),
              height: Math.round(Math.abs(rect[3] - rect[1])),
              type: emailRegex.test(str) ? 'email' : phoneRegex.test(str) ? 'phone' : 'address',
              label: ''
            });
          }
        });

        // Photo mask scan (page 1)
        if (pageNum === 1) {
          try {
            const opList = await page.getOperatorList();
            const fnArray = opList.fnArray || [];
            const argsArray = opList.argsArray || [];
            const paintImageXObject = pdfjs.OPS?.paintImageXObject ?? 82;
            const paintInlineImageXObject = pdfjs.OPS?.paintInlineImageXObject ?? 83;
            const transformOp = pdfjs.OPS?.transform ?? 14;
            const saveOp = pdfjs.OPS?.save ?? 12;
            const restoreOp = pdfjs.OPS?.restore ?? 13;

            let ctm: number[] = [1, 0, 0, 1, 0, 0];
            const ctmStack: number[][] = [];
            const pageW = page.view ? page.view[2] - page.view[0] : 595;
            const pageH = page.view ? page.view[3] - page.view[1] : 842;

            for (let i = 0; i < fnArray.length; i++) {
              const fn = fnArray[i];
              const args = argsArray[i];
              if (fn === saveOp) ctmStack.push([...ctm]);
              else if (fn === restoreOp && ctmStack.length > 0) ctm = ctmStack.pop()!;
              else if (fn === transformOp && Array.isArray(args) && args.length === 6) {
                const [a1, b1, c1, d1, e1, f1] = ctm;
                const [a2, b2, c2, d2, e2, f2] = args;
                ctm = [
                  a1 * a2 + c1 * b2,
                  b1 * a2 + d1 * b2,
                  a1 * c2 + c1 * d2,
                  b1 * c2 + d1 * d2,
                  a1 * e2 + c1 * f2 + e1,
                  b1 * e2 + d1 * f2 + f1
                ];
              } else if (fn === paintImageXObject || fn === paintInlineImageXObject) {
                const a = ctm[0], b = ctm[1], c = ctm[2], d = ctm[3], e = ctm[4], f = ctm[5];
                const x0 = e, y0 = f;
                const minX = Math.min(x0, a + e, c + e, a + c + e);
                const maxX = Math.max(x0, a + e, c + e, a + c + e);
                const minY = Math.min(y0, b + f, d + f, b + d + f);
                const maxY = Math.max(y0, b + f, d + f, b + d + f);
                const imgW = maxX - minX;
                const imgH = maxY - minY;

                const isTopArea = minY > pageH * 0.58;
                const isPhotoDimensions = imgW >= 28 && imgW <= 240 && imgH >= 28 && imgH <= 260 && imgW < pageW * 0.45;
                if (isTopArea && isPhotoDimensions) {
                  const rect = viewport.convertToViewportRectangle([minX, minY, maxX, maxY]);
                  rawMasks.push({
                    id: `mask-photo-${Math.round(minX)}-${Math.round(minY)}`,
                    left: Math.round(Math.min(rect[0], rect[2]) - 3),
                    top: Math.round(Math.min(rect[1], rect[3]) - 3),
                    width: Math.round(Math.abs(rect[2] - rect[0]) + 6),
                    height: Math.round(Math.abs(rect[3] - rect[1]) + 6),
                    type: 'photo',
                    label: ''
                  });
                  break;
                }
              }
            }
          } catch (_) {}
        }

        setPrivacyMasks(rawMasks);
        setLoading(false);
      } catch (err) {
        if (!isCancelled) {
          setError(true);
          setLoading(false);
        }
      }
    };

    renderPdf();
    return () => { isCancelled = true; };
  }, [resumeAttachment, studentName, pageNum, zoomLevel, rotation]);

  return (
    <div style={{ position: 'relative', display: 'inline-block', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', borderRadius: '4px', background: '#FFFFFF' }}>
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.6)', color: '#FFFFFF', fontSize: '12px', zIndex: 20 }}>
          Loading Original Uploaded PDF...
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'block', borderRadius: '4px' }} />
      {privacyMasks.map(mask => (
        <div
          key={mask.id}
          className="privacy-mask-frosted"
          style={{
            position: 'absolute',
            left: `${mask.left}px`,
            top: `${mask.top}px`,
            width: `${mask.width}px`,
            height: `${mask.height}px`,
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(9px)',
            WebkitBackdropFilter: 'blur(9px)',
            borderRadius: mask.type === 'photo' ? '8px' : '4px',
            border: '1px solid rgba(226, 232, 240, 0.7)',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        />
      ))}
    </div>
  );
};

export const ResumeComparisonView: React.FC<ResumeComparisonViewProps> = ({ isVolunteerView = false }) => {
  const { 
    activeStudent, 
    volunteer, 
    activeRole,
    updateStudentResumeSection,
    updateStudentFromPdf,
    addVolunteerSubtopic,
    updateSubtopicCommand,
    updateSubtopicCategory,
    updateSubtopicRewrite,
    updateSubtopicAudioNote,
    saveAudioNote,
    saveRubricScores,
    updateGeneralFeedback,
    setRating
  } = useApp();

  // Layout View Modes: 'side-by-side' (default full comparison), 'old', 'new'
  const [viewMode, setViewMode] = useState<'side-by-side' | 'old' | 'new'>('side-by-side');
  const [zoomLevel, setZoom] = useState<number>(100);
  const [activeResumePage, setResumePage] = useState<number>(1);
  const [oldPdfRotation, setOldPdfRotation] = useState<number>(0);
  const [showMentorNotes, setShowMentorNotes] = useState<boolean>(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Edit & Comment Modal States
  const [editingSection, setEditingSection] = useState<ResumeSection | null>(null);
  const [commentingSection, setCommentingSection] = useState<ResumeSection | null>(null);
  const [editFeedbackNote, setEditFeedbackNote] = useState<string>('');
  const [editFeedbackCategory, setEditFeedbackCategory] = useState<'suggestion' | 'must_fix' | 'praise' | 'question'>('suggestion');
  const [editTextContent, setEditTextContent] = useState<string>('');
  const [editChipsContent, setEditChipsContent] = useState<string[]>([]);
  const [newChipInput, setNewChipInput] = useState<string>('');
  const [editEduContent, setEditEduContent] = useState<EducationItem[]>([]);
  const [editProjectsContent, setEditProjectsContent] = useState<ProjectItem[]>([]);
  const [editListContent, setEditListContent] = useState<string[]>([]);
  const [newListItemInput, setNewListItemInput] = useState<string>('');

  if (!activeStudent) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Student profile not found.</div>;
  }

  const initialStudentData = initialStudents.find(s => s.id === activeStudent.id) || initialStudents[0];
  const volunteerSubtopics = (activeStudent.volunteerSubtopics && activeStudent.volunteerSubtopics.length > 0)
    ? activeStudent.volunteerSubtopics
    : (initialStudentData.volunteerSubtopics || []);

  const rawNewSections = (activeStudent.newResumeSections && activeStudent.newResumeSections.length > 0)
    ? activeStudent.newResumeSections
    : (activeStudent.resumeSections && activeStudent.resumeSections.length > 0
        ? activeStudent.resumeSections
        : (initialStudentData.newResumeSections || initialStudentData.resumeSections || []));

  const rawOldSections = (activeStudent.oldResumeSections && activeStudent.oldResumeSections.length > 0)
    ? activeStudent.oldResumeSections
    : (activeStudent.resumeSections && activeStudent.resumeSections.length > 0
        ? activeStudent.resumeSections
        : (initialStudentData.oldResumeSections || initialStudentData.resumeSections || []));

  const oldAllSections = rawOldSections;
  const newAllSections = rawNewSections;

  const oldSections = oldAllSections;
  const newSections = newAllSections;

  // Open Edit Modal for a specific section
  const handleOpenEditModal = (sec: ResumeSection) => {
    setEditingSection(sec);
    const existingSub = getVolunteerSubtopicForSection(sec);
    setEditFeedbackNote(existingSub?.command || '');
    setEditFeedbackCategory(existingSub?.category || 'suggestion');

    if (sec.type === 'text') {
      setEditTextContent(sec.content || '');
    } else if (sec.type === 'chips') {
      setEditChipsContent([...((sec.items as string[]) || [])]);
      setNewChipInput('');
    } else if (sec.type === 'education') {
      setEditEduContent(JSON.parse(JSON.stringify(sec.items || [])));
    } else if (sec.type === 'projects') {
      setEditProjectsContent(JSON.parse(JSON.stringify(sec.items || [])));
    } else if (sec.type === 'list') {
      setEditListContent([...((sec.items as string[]) || [])]);
      setNewListItemInput('');
    }
  };

  // Save changes from Edit Modal
  const handleSaveEdit = () => {
    if (!editingSection) return;

    let updatedData: Partial<ResumeSection> = {};
    if (editingSection.type === 'text') {
      updatedData = { content: editTextContent };
    } else if (editingSection.type === 'chips') {
      updatedData = { items: editChipsContent };
    } else if (editingSection.type === 'education') {
      updatedData = { items: editEduContent };
    } else if (editingSection.type === 'projects') {
      updatedData = { items: editProjectsContent };
    } else if (editingSection.type === 'list') {
      updatedData = { items: editListContent };
    }

    updateStudentResumeSection(activeStudent.id, editingSection.key, updatedData);

    if (editFeedbackNote.trim()) {
      const existingSub = getVolunteerSubtopicForSection(editingSection);
      if (existingSub) {
        updateSubtopicCommand(existingSub.id, editFeedbackNote.trim());
        updateSubtopicCategory(existingSub.id, editFeedbackCategory);
        if (!existingSub.isHighlighted) {
          toggleSubtopicHighlight(existingSub.id);
        }
      } else {
        addVolunteerSubtopic(editingSection.title, editingSection.key, editFeedbackNote.trim(), editFeedbackCategory);
      }
    }

    setEditingSection(null);
    setSaveSuccessMsg(`Updated "${editingSection.title}" & highlighted feedback for student!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const getVolunteerSubtopicForSection = (sec: ResumeSection) => {
    const direct = volunteerSubtopics.find(s => s.sectionKey === sec.key);
    if (direct) return direct;

    return volunteerSubtopics.find(s => {
      const target = `${s.title || ''} ${s.sectionKey || ''}`.toLowerCase();
      if (sec.key === 'education') {
        return (target.includes('education') || target.includes('college') || target.includes('degree') || target.includes('academic background') || target.includes('qualification')) && !target.includes('project');
      }
      if (sec.key === 'projects') {
        return target.includes('academic project') || (target.includes('project') && !target.includes('skill'));
      }
      if (sec.key === 'experience') {
        return target.includes('internship') || target.includes('experience') || target.includes('work') || target.includes('employment') || target.includes('ngo');
      }
      if (sec.key === 'skills') {
        return target.includes('skill') || target.includes('programming') || target.includes('tech stack') || target.includes('competenc');
      }
      if (sec.key === 'coursework') {
        return target.includes('coursework') || target.includes('undergraduate coursework');
      }
      if (sec.key === 'objective') {
        return target.includes('objective') || target.includes('summary') || target.includes('about') || target.includes('profile');
      }
      if (sec.key === 'certifications') {
        return target.includes('certif') || target.includes('badge') || target.includes('award') || target.includes('achievement');
      }
      if (sec.key === 'workshops') {
        return target.includes('workshop') || target.includes('seminar');
      }
      if (sec.key === 'activities') {
        return target.includes('activit') || target.includes('curricular');
      }
      if (sec.key === 'languages') {
        return target.includes('language');
      }
      if (sec.key === 'interests') {
        return target.includes('interest') || target.includes('hobb') || target.includes('drawing');
      }
      return s.sectionKey === sec.key || (s.title && s.title.toLowerCase().includes(sec.title.toLowerCase()));
    });
  };

  const correctedCount = volunteerSubtopics.length;

  const leftColumnKeys = ['education', 'coursework', 'skills', 'languages', 'interests', 'objective'];

  const partitionSections = (secs: ResumeSection[]) => {
    const left = secs.filter(s => s.column === 'left' || (!s.column && leftColumnKeys.includes(s.key)));
    const right = secs.filter(s => s.column === 'right' || (!s.column && !leftColumnKeys.includes(s.key)));
    return { left, right, isTwoCol: left.length > 0 && right.length > 0 };
  };

  const newCols = partitionSections(newSections);
  const oldCols = partitionSections(oldSections);

  const renderSectionCard = (sec: ResumeSection, isEditable: boolean = true) => {
    const subtopic = getVolunteerSubtopicForSection(sec);
    const isCorrected = !!subtopic;

    return (
      <section 
        key={sec.key} 
        className={`resume-section ${isCorrected ? 'has-volunteer-highlight is-student-revised' : ''}`} 
        id={`new-doc-sec-${sec.key}`}
      >
        <div className="resume-section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span>{sec.title}</span>
            {isCorrected && (
              <span className="volunteer-edited-pill-badge" title="Mentor updated and highlighted this section">
                <Sparkles size={11} />
                <span>{subtopic?.category === 'must_fix' ? 'Must Fix' : subtopic?.category === 'praise' ? 'Strengthened' : 'Corrected Subsection'}</span>
              </span>
            )}
          </div>

          {isEditable && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                className="student-pencil-edit-btn"
                onClick={() => handleOpenEditModal(sec)}
                title={`Edit ${sec.title} & provide mentor review feedback`}
                style={{
                  fontSize: '11px',
                  padding: '3px 9px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderRadius: '5px',
                  background: isCorrected ? '#ECFDF5' : '#EFF6FF',
                  color: isCorrected ? '#047857' : '#2563EB',
                  border: `1px solid ${isCorrected ? '#A7F3D0' : '#BFDBFE'}`,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={11} />
                <span>{isCorrected ? 'Edit Feedback & Content' : '✎ Edit / Add Feedback'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Section Content */}
        {sec.type === 'text' && (
          <p style={{ margin: '4px 0', fontSize: '12px', lineHeight: '1.5', color: '#334155' }}>{sec.content}</p>
        )}

        {sec.type === 'education' && (
          (sec.items as EducationItem[])?.map((edu, idx) => (
            <div key={idx} className="resume-entry" style={{ marginBottom: '10px' }}>
              <div className="resume-entry-header">
                <span className="entry-title" style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>{edu.institution}</span>
                <span className="entry-score" style={{ fontSize: '11px', fontWeight: 700, color: '#059669' }}>{edu.score}</span>
              </div>
              <div className="resume-entry-header" style={{ marginTop: '2px' }}>
                <span className="entry-org" style={{ fontSize: '11px', color: '#475569' }}>{edu.degree}</span>
                <span className="entry-date" style={{ fontSize: '11px', color: '#64748B' }}>{edu.period}</span>
              </div>
            </div>
          ))
        )}

        {sec.type === 'chips' && (
          <div className="resume-skills-chips">
            {(sec.items as string[])?.map((skill, idx) => (
              <span key={idx} className="skill-chip" style={{ fontSize: '11px', padding: '3px 7px' }}>{skill}</span>
            ))}
          </div>
        )}

        {sec.type === 'projects' && (
          (sec.items as ProjectItem[])?.map((proj, idx) => (
            <div key={idx} className="resume-entry" style={{ marginBottom: '12px' }}>
              <div className="resume-entry-header">
                <span className="entry-title" style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>{proj.title}</span>
                {proj.period && <span className="entry-date" style={{ fontSize: '11px', color: '#64748B' }}>{proj.period}</span>}
              </div>
              {proj.tech && !proj.tech.includes('CGPA') && !proj.tech.includes('Percentage') && (
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px', fontWeight: '600' }}>
                  Tech: {proj.tech}
                </div>
              )}
              <div style={{ fontSize: '11.5px', margin: '4px 0', lineHeight: '1.5', color: '#334155' }}>
                {proj.description?.split('\n').map((line, lIdx) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;
                  const colonMatch = trimmed.match(/^([•\-\*]?\s*[^:]+:)(.*)$/);
                  if (colonMatch) {
                    return (
                      <div key={lIdx} style={{ marginBottom: '4px' }}>
                        <strong style={{ color: '#1E293B' }}>{colonMatch[1]}</strong>
                        <span>{colonMatch[2]}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={lIdx} style={{ marginBottom: '4px' }}>
                      {trimmed.startsWith('•') ? trimmed : `• ${trimmed}`}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {sec.type === 'list' && (
          <ul style={{ paddingLeft: '18px', fontSize: '11.5px', color: '#334155', margin: '4px 0' }}>
            {(sec.items as string[])?.map((it, idx) => (
              <li key={idx} style={{ marginBottom: '4px', lineHeight: '1.45' }}>{it}</li>
            ))}
          </ul>
        )}

        {/* Volunteer Improvement Callout on New Resume */}
        {isCorrected && subtopic && (
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
  };

  return (
    <div className="comparison-component-wrap" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflow: 'hidden' }}>
      {/* Success Notification Toast */}
      {saveSuccessMsg && (
        <div className="student-save-toast">
          <Check size={16} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Greeting & Meta Bar if not in volunteer header */}
      {!isVolunteerView && (
        <header className="student-header-banner" style={{ padding: '10px 24px', flexShrink: 0 }}>
          <div className="student-info-meta">
            <img src={activeStudent.avatar} alt={activeStudent.name} className="student-view-avatar" style={{ width: '38px', height: '38px' }} />
            <div>
              <h1 className="student-greeting-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '17px', margin: 0 }}>
                <span>Hello, {activeStudent.name}</span>
                <Hand size={17} color="#F59E0B" />
              </h1>
              <span className="student-degree-sub" style={{ fontSize: '11.5px' }}>{activeStudent.degree} • {activeStudent.institution}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div className="student-otp-badge-pill" style={{ margin: 0, padding: '4px 10px', fontSize: '11px' }}>
              <span>OTP:</span>
              <strong>{activeStudent.otp || '101010'}</strong>
            </div>

            <div className="comparison-stat-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '4px 10px', borderRadius: '999px', fontSize: '11.5px', color: '#065F46', fontWeight: 700 }}>
              <Sparkles size={13} />
              <span>{correctedCount} Subsections Enhanced</span>
            </div>

            {activeStudent.status === 'approved' && (
              <span className="status-pill approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '11px' }}>
                <CheckCircleIcon size={13} />
                <span>Approved by Volunteer {volunteer.name}</span>
              </span>
            )}

            {activeStudent.status === 'changes_required' && (
              <span className="status-pill changes_required" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '11px' }}>
                <WarningTriangleIcon size={13} />
                <span>Changes Requested by {volunteer.name}</span>
              </span>
            )}

            {activeStudent.status === 'in_review' && (
              <span className="status-pill in_review" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '11px' }}>
                <ClockIcon size={13} />
                <span>In Review by {volunteer.name}</span>
              </span>
            )}

            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={() => setShowMentorNotes(!showMentorNotes)}
              style={{ fontSize: '11.5px', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <MessageSquare size={13} />
              <span>{showMentorNotes ? 'Hide Mentor Feedback' : 'Show Mentor Feedback'}</span>
              {showMentorNotes ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
        </header>
      )}

      {/* Collapsible Mentor Feedback Banner */}
      {showMentorNotes && (
        <div className="student-mentor-summary-strip" style={{ flexShrink: 0 }}>
          <div className="mentor-strip-content">
            <div className="mentor-quote-box">
              <div className="mentor-badge-header">
                <span className="mentor-label">
                  <Sparkles size={12} />
                  <span>Mentor Feedback from {volunteer.name} ({volunteer.role})</span>
                </span>
                {activeStudent.rating && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <StarRating rating={activeStudent.rating} size={12} />
                  </div>
                )}
              </div>
              <p className="mentor-feedback-text">
                {activeStudent.generalFeedback || 'Review completed. Please review the highlighted subsections and pencil-edit any specific details needed.'}
              </p>
            </div>

            {/* Voice Memo Player if present */}
            {activeStudent.audioNote?.recorded && (
              <div className="student-voice-memo-strip">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Volume2 size={15} color="#16A34A" />
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#166534' }}>
                    Voice Note ({activeStudent.audioNote.duration || '0:45'})
                  </span>
                </div>
                <button
                  type="button"
                  className={`btn-play-voice-mini ${isPlayingAudio ? 'is-playing' : ''}`}
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                >
                  {isPlayingAudio ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isPlayingAudio ? 'Pause' : 'Play Feedback'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Resume Comparison Area (Full Page, No Sidebar) */}
      <main className="comparison-main-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Full-Width Comparison Toolbar */}
        <div className="comparison-toolbar">
          <div className="comparison-toolbar-left">
            <div className="comparison-mode-selector">
              <button
                type="button"
                className={`mode-tab-btn ${viewMode === 'side-by-side' ? 'active' : ''}`}
                onClick={() => setViewMode('side-by-side')}
                title="View Old Resume and New Resume side-by-side"
              >
                <Columns size={14} />
                <span>Side-by-Side Comparison</span>
              </button>
              <button
                type="button"
                className={`mode-tab-btn ${viewMode === 'old' ? 'active' : ''}`}
                onClick={() => setViewMode('old')}
                title="View Old Resume only"
              >
                <FileText size={14} />
                <span>Old Resume (v1)</span>
              </button>
              <button
                type="button"
                className={`mode-tab-btn ${viewMode === 'new' ? 'active' : ''}`}
                onClick={() => setViewMode('new')}
                title="View New Resume only"
              >
                <Sparkles size={14} />
                <span>New Resume (v2)</span>
              </button>
            </div>
          </div>

          <div className="comparison-toolbar-right">
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

            <div className="toolbar-divider" />

            {/* Zoom Controls */}
            <div className="zoom-controls">
              <button className="zoom-btn" onClick={() => setZoom(Math.max(60, zoomLevel - 10))} aria-label="Zoom Out">-</button>
              <span className="zoom-indicator-text">{zoomLevel}%</span>
              <button className="zoom-btn" onClick={() => setZoom(Math.min(140, zoomLevel + 10))} aria-label="Zoom In">+</button>
            </div>

            <button 
              className="toolbar-action-icon-btn" 
              onClick={() => setZoom(100)}
              title="Reset Zoom to 100%"
            >
              <MaximizeIcon size={15} />
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className={`comparison-grid-body ${viewMode}`}>
          {/* LEFT: OLD RESUME (Original PDF or Candidate Submission) */}
          {(viewMode === 'side-by-side' || viewMode === 'old') && (
            <div className="comparison-resume-column old-version-col">
              <div className="comparison-column-header">
                <div className="column-title-wrap">
                  <span className="comparison-badge old-badge">
                    <FileText size={13} />
                    <span>Old Resume (v1)</span>
                  </span>
                  <span className="comparison-meta-hint">Original Candidate Submission</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button 
                    className="btn btn-secondary btn-xs"
                    onClick={() => setOldPdfRotation(r => (r + 180) % 360)}
                    title="Rotate / Flip Page 180°"
                    style={{ fontSize: '11px', padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <RotateCw size={12} />
                    <span>Rotate</span>
                  </button>

                  <button 
                    className="btn btn-secondary btn-xs"
                    onClick={() => {
                      if (activeStudent.resumeAttachment) {
                        window.open(getResumeDownloadUrl(activeStudent.resumeAttachment, activeStudent.name), '_blank');
                      } else {
                        downloadResumeDocument(activeStudent, 'old');
                      }
                    }}
                    title="Download Original Resume PDF"
                    style={{ fontSize: '11px', padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <DownloadIcon size={12} />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              <div className="resume-scroll-canvas">
                {activeStudent.resumeAttachment ? (
                  <PdfOldResumeCanvas 
                    resumeAttachment={activeStudent.resumeAttachment}
                    studentName={activeStudent.name}
                    pageNum={activeResumePage}
                    zoomLevel={zoomLevel}
                    rotation={oldPdfRotation}
                    onParsedResume={(parsed) => updateStudentFromPdf(activeStudent.id, parsed)}
                  />
                ) : (
                    <div 
                      className="resume-paper resume-template-twocolumn" 
                      style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                    >
                      <header className="resume-header">
                        <h1 className="resume-name">{activeStudent.name.toUpperCase()}</h1>
                        <div className="resume-target-title">{activeStudent.degree || 'Candidate Profile'}</div>
                        <div className="resume-contact-bar">
                          {activeStudent.email && <span className="resume-contact-item">✉ {activeStudent.email}</span>}
                          {activeStudent.phone && <><span>•</span><span className="resume-contact-item">☎ {activeStudent.phone}</span></>}
                          {activeStudent.location && <><span>•</span><span className="resume-contact-item">📍 {activeStudent.location}</span></>}
                        </div>
                      </header>

                      {oldCols.isTwoCol ? (
                        <div className="resume-twocol-body">
                          <div className="resume-col-left">
                            {oldCols.left.map(sec => renderSectionCard(sec, false))}
                          </div>
                          <div className="resume-col-right">
                            {oldCols.right.map(sec => renderSectionCard(sec, false))}
                          </div>
                        </div>
                      ) : (
                        <div className="resume-single-col-body">
                          {oldSections.map(sec => renderSectionCard(sec, false))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RIGHT: NEW RESUME (Revised & Enhanced with Volunteer Highlights & Pencil Edit) */}
            {(viewMode === 'side-by-side' || viewMode === 'new') && (
              <div className="comparison-resume-column new-version-col">
                <div className="comparison-column-header">
                  <div className="column-title-wrap">
                    <span className="comparison-badge new-badge">
                      <Sparkles size={13} />
                      <span>New Resume (v2)</span>
                    </span>
                    <span className="comparison-meta-hint">Revised & Mentor-Enhanced</span>
                  </div>

                  <button 
                    className="btn btn-secondary btn-xs"
                    onClick={() => downloadResumeDocument(activeStudent, 'new')}
                    title="Download Revised Resume PDF"
                    style={{ fontSize: '11px', padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <DownloadIcon size={12} />
                    <span>PDF</span>
                  </button>
                </div>

                <div className="resume-scroll-canvas">
                  <div 
                    className="resume-paper resume-template-twocolumn" 
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  >
                    <header className="resume-header">
                      <h1 className="resume-name">{((activeStudent.extractedName || activeStudent.name) || 'STUDENT').toUpperCase()}</h1>
                      <div className="resume-target-title">
                        {activeStudent.degree && !activeStudent.degree.includes('Candidate') ? `${activeStudent.degree} Candidate` : (activeStudent.degree || 'Candidate Profile')}
                      </div>
                      <div className="resume-contact-bar">
                        {activeStudent.email && (
                          <span className="resume-contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={12} />
                            <span>{activeStudent.email}</span>
                          </span>
                        )}
                        {activeStudent.phone && (
                          <>
                            <span>•</span>
                            <span className="resume-contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={12} />
                              <span>{activeStudent.phone}</span>
                            </span>
                          </>
                        )}
                        {activeStudent.location && (
                          <>
                            <span>•</span>
                            <span className="resume-contact-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={12} />
                              <span>{activeStudent.location}</span>
                            </span>
                          </>
                        )}
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

                    {newCols.isTwoCol ? (
                      <div className="resume-twocol-body">
                        <div className="resume-col-left">
                          {newCols.left.map(sec => renderSectionCard(sec, true))}
                        </div>
                        <div className="resume-col-right">
                          {newCols.right.map(sec => renderSectionCard(sec, true))}
                        </div>
                      </div>
                    ) : (
                      <div className="resume-single-col-body">
                        {newSections.map(sec => renderSectionCard(sec, true))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </main>

      {/* Interactive Subsection Edit Modal */}
      {editingSection && (
        <div className="student-edit-modal-overlay" onClick={() => setEditingSection(null)}>
          <div className="student-edit-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="student-edit-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} color="#2563EB" />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                  Edit Subsection: {editingSection.title}
                </h3>
              </div>
              <button 
                className="modal-close-icon-btn"
                onClick={() => setEditingSection(null)}
                title="Close editor"
              >
                <X size={18} />
              </button>
            </div>

            <div className="student-edit-modal-body">
              {/* Top: Mentor Feedback & Instruction for this Subsection */}
              <div className="modal-mentor-feedback-composer" style={{ background: '#F8FAFC', border: '1.5px solid #CBD5E1', borderRadius: '8px', padding: '14px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={15} color="#2563EB" />
                    <label style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Mentor Feedback & Student Instructions
                    </label>
                  </div>

                  {/* Category selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      className={`clean-tag-chip ${editFeedbackCategory === 'must_fix' ? 'selected' : ''}`}
                      onClick={() => setEditFeedbackCategory('must_fix')}
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: editFeedbackCategory === 'must_fix' ? '#FEE2E2' : '#FFFFFF',
                        color: editFeedbackCategory === 'must_fix' ? '#991B1B' : '#475569',
                        borderColor: editFeedbackCategory === 'must_fix' ? '#FCA5A5' : '#CBD5E1',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      ● Must Fix
                    </button>
                    <button
                      type="button"
                      className={`clean-tag-chip ${editFeedbackCategory === 'suggestion' ? 'selected' : ''}`}
                      onClick={() => setEditFeedbackCategory('suggestion')}
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: editFeedbackCategory === 'suggestion' ? '#EFF6FF' : '#FFFFFF',
                        color: editFeedbackCategory === 'suggestion' ? '#1D4ED8' : '#475569',
                        borderColor: editFeedbackCategory === 'suggestion' ? '#93C5FD' : '#CBD5E1',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      ● Suggestion
                    </button>
                    <button
                      type="button"
                      className={`clean-tag-chip ${editFeedbackCategory === 'praise' ? 'selected' : ''}`}
                      onClick={() => setEditFeedbackCategory('praise')}
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: editFeedbackCategory === 'praise' ? '#DCFCE7' : '#FFFFFF',
                        color: editFeedbackCategory === 'praise' ? '#166534' : '#475569',
                        borderColor: editFeedbackCategory === 'praise' ? '#86EFAC' : '#CBD5E1',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      ● Strengthen
                    </button>
                  </div>
                </div>

                <textarea
                  className="edit-textarea"
                  rows={3}
                  value={editFeedbackNote}
                  onChange={(e) => setEditFeedbackNote(e.target.value)}
                  placeholder="Enter mentor feedback / instruction for student (e.g., 'Add CGPA and graduation year', 'Quantify impact with numbers and repository link')..."
                  style={{ width: '100%', fontSize: '12.5px', borderRadius: '6px', padding: '8px 10px', border: '1px solid #CBD5E1' }}
                />
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                  💡 This feedback will highlight this subsection in both the New Resume and Student Login View.
                </div>
              </div>

              {/* Bottom: Direct Subsection Content Editor */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px', marginBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  Edit Subsection Content
                </div>
              </div>
              {editingSection.type === 'text' && (
                <div className="edit-form-group">
                  <label className="edit-form-label">Objective / Summary Content</label>
                  <textarea
                    className="edit-textarea"
                    rows={5}
                    value={editTextContent}
                    onChange={(e) => setEditTextContent(e.target.value)}
                    placeholder="Enter revised summary or objective text..."
                  />
                  <span className="character-counter">{editTextContent.length} characters</span>
                </div>
              )}

              {editingSection.type === 'chips' && (
                <div className="edit-form-group">
                  <label className="edit-form-label">Skills & Tech Stack Tags</label>
                  <div className="editable-chips-wrapper">
                    {editChipsContent.map((chip, idx) => (
                      <span key={idx} className="editable-skill-chip">
                        <span>{chip}</span>
                        <button
                          type="button"
                          className="chip-remove-btn"
                          onClick={() => setEditChipsContent(editChipsContent.filter((_, i) => i !== idx))}
                          title="Remove skill"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="add-chip-row" style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="edit-text-input"
                      placeholder="Add new skill (e.g., React, TypeScript, Docker)..."
                      value={newChipInput}
                      onChange={(e) => setNewChipInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newChipInput.trim()) {
                          e.preventDefault();
                          setEditChipsContent([...editChipsContent, newChipInput.trim()]);
                          setNewChipInput('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        if (newChipInput.trim()) {
                          setEditChipsContent([...editChipsContent, newChipInput.trim()]);
                          setNewChipInput('');
                        }
                      }}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              )}

              {editingSection.type === 'projects' && (
                <div className="edit-form-group">
                  <label className="edit-form-label">Projects List</label>
                  <div className="editable-projects-list">
                    {editProjectsContent.map((proj, pIdx) => (
                      <div key={pIdx} className="editable-project-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '13px', color: '#1E293B' }}>Project #{pIdx + 1}</span>
                          <button
                            type="button"
                            className="btn-danger-icon"
                            onClick={() => setEditProjectsContent(editProjectsContent.filter((_, i) => i !== pIdx))}
                            title="Delete project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                          <div>
                            <label className="sub-label">Project Title</label>
                            <input
                              type="text"
                              className="edit-text-input"
                              value={proj.title}
                              onChange={(e) => {
                                const updated = [...editProjectsContent];
                                updated[pIdx].title = e.target.value;
                                setEditProjectsContent(updated);
                              }}
                            />
                          </div>
                          <div>
                            <label className="sub-label">Timeline / Period</label>
                            <input
                              type="text"
                              className="edit-text-input"
                              value={proj.period}
                              onChange={(e) => {
                                const updated = [...editProjectsContent];
                                updated[pIdx].period = e.target.value;
                                setEditProjectsContent(updated);
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label className="sub-label">Technologies Used</label>
                          <input
                            type="text"
                            className="edit-text-input"
                            value={proj.tech}
                            onChange={(e) => {
                              const updated = [...editProjectsContent];
                              updated[pIdx].tech = e.target.value;
                              setEditProjectsContent(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="sub-label">Description & Impact Metrics</label>
                          <textarea
                            className="edit-textarea"
                            rows={3}
                            value={proj.description}
                            onChange={(e) => {
                              const updated = [...editProjectsContent];
                              updated[pIdx].description = e.target.value;
                              setEditProjectsContent(updated);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setEditProjectsContent([
                        ...editProjectsContent,
                        { title: 'New Technical Project', tech: 'React, Node.js', period: '2025', description: 'Engineered high-performance web application...' }
                      ]);
                    }}
                    style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Plus size={14} /> Add Another Project
                  </button>
                </div>
              )}

              {editingSection.type === 'education' && (
                <div className="edit-form-group">
                  <label className="edit-form-label">Education Qualifications</label>
                  <div className="editable-projects-list">
                    {editEduContent.map((edu, eIdx) => (
                      <div key={eIdx} className="editable-project-card">
                        <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                          <div>
                            <label className="sub-label">Degree / Course</label>
                            <input
                              type="text"
                              className="edit-text-input"
                              value={edu.degree}
                              onChange={(e) => {
                                const updated = [...editEduContent];
                                updated[eIdx].degree = e.target.value;
                                setEditEduContent(updated);
                              }}
                            />
                          </div>
                          <div>
                            <label className="sub-label">Institution Name</label>
                            <input
                              type="text"
                              className="edit-text-input"
                              value={edu.institution}
                              onChange={(e) => {
                                const updated = [...editEduContent];
                                updated[eIdx].institution = e.target.value;
                                setEditEduContent(updated);
                              }}
                            />
                          </div>
                        </div>
                        <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <label className="sub-label">Period</label>
                            <input
                              type="text"
                              className="edit-text-input"
                              value={edu.period}
                              onChange={(e) => {
                                const updated = [...editEduContent];
                                updated[eIdx].period = e.target.value;
                                setEditEduContent(updated);
                              }}
                            />
                          </div>
                          <div>
                            <label className="sub-label">Score / CGPA</label>
                            <input
                              type="text"
                              className="edit-text-input"
                              value={edu.score}
                              onChange={(e) => {
                                const updated = [...editEduContent];
                                updated[eIdx].score = e.target.value;
                                setEditEduContent(updated);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editingSection.type === 'list' && (
                <div className="edit-form-group">
                  <label className="edit-form-label">Certifications / List Items</label>
                  <div className="editable-list-items">
                    {editListContent.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          className="edit-text-input"
                          value={it}
                          onChange={(e) => {
                            const updated = [...editListContent];
                            updated[idx] = e.target.value;
                            setEditListContent(updated);
                          }}
                        />
                        <button
                          type="button"
                          className="btn-danger-icon"
                          onClick={() => setEditListContent(editListContent.filter((_, i) => i !== idx))}
                          title="Delete item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <input
                      type="text"
                      className="edit-text-input"
                      placeholder="Add new certification / credential..."
                      value={newListItemInput}
                      onChange={(e) => setNewListItemInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newListItemInput.trim()) {
                          e.preventDefault();
                          setEditListContent([...editListContent, newListItemInput.trim()]);
                          setNewListItemInput('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        if (newListItemInput.trim()) {
                          setEditListContent([...editListContent, newListItemInput.trim()]);
                          setNewListItemInput('');
                        }
                      }}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="student-edit-modal-footer">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setEditingSection(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSaveEdit}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#2563EB', fontWeight: 700 }}
              >
                <Check size={14} />
                <span>Save Feedback & Highlight for Student</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Section Feedback & Inline Review Modal */}
      {commentingSection && (
        <div className="student-edit-modal-overlay" onClick={() => setCommentingSection(null)}>
          <div
            className="student-edit-modal-card"
            style={{ maxWidth: '540px', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <InlineReviewBox
              sectionKey={commentingSection.key}
              sectionTitle={commentingSection.title}
              onClose={() => setCommentingSection(null)}
              activeStudent={activeStudent}
              resumeSections={newAllSections}
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
                setCommentingSection(null);
                setSaveSuccessMsg(`Feedback saved for "${commentingSection.title}"! Highlighting updated in New Resume & Student View.`);
                setTimeout(() => setSaveSuccessMsg(null), 4000);
              }}
              onSaveOverall={(overallData) => {
                updateGeneralFeedback(overallData.generalFeedback);
                setRating(overallData.rating);
                saveRubricScores(overallData.rubricScores);
                if (overallData.audioNote) {
                  saveAudioNote(overallData.audioNote);
                }
                setCommentingSection(null);
                setSaveSuccessMsg('Overall mentor feedback saved!');
                setTimeout(() => setSaveSuccessMsg(null), 4000);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
