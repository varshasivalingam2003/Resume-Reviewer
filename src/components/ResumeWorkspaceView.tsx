import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { initialStudents, Student, VolunteerSubtopic, ResumeSection } from '../data/studentsData';
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
  Layers,
  Lock,
  Download,
  Trash2
} from 'lucide-react';

// Privacy Mask interface for PDF visual redaction layer
interface PrivacyMask {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  type: 'email' | 'phone' | 'address' | 'photo';
  label: string;
  originalText?: string;
}

// PDF Pin Annotation
interface AnnotationPin {
  id: string;
  subtopicId?: string;
  page: number;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  label: string;
  category: 'suggestion' | 'must_fix' | 'praise' | 'question';
  comment: string;
}

// Detected Section on Actual PDF
interface DetectedPdfSection {
  id: string;
  key: string;
  title: string;
  page: number;
  pixelLeft: number;
  pixelTop: number;
  pixelRight: number;
  pixelWidth: number;
  pixelHeight: number;
  pdfX: number;
  pdfY: number;
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

  // PDF Loading & Rendering States
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [pdfTotalPages, setPdfTotalPages] = useState<number>(activeStudent?.totalPages || 1);
  const [privacyMasks, setPrivacyMasks] = useState<PrivacyMask[]>([]);
  const [detectedSections, setDetectedSections] = useState<DetectedPdfSection[]>([]);
  const [inlinePopoverSection, setInlinePopoverSection] = useState<DetectedPdfSection | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);
  const isMobileDevice = typeof window !== 'undefined' && window.innerWidth <= 640;

  // Canvas & PDF Task Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const pdfDocRef = useRef<any>(null);

  // Pin & Annotation States (PDF Review Model)
  const [activePin, setActivePin] = useState<{ page: number; x: number; y: number } | null>(null);
  const [activeCommentTool, setActiveCommentTool] = useState<'sections' | 'mentor_audit' | 'rewrite_diff' | 'voice_memo' | 'rubric'>('sections');
  
  // Method 1: Subtopic Definition State
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [selectedSectionKey, setSelectedSectionKey] = useState('objective');
  const [newCommandText, setNewCommandText] = useState('');
  const [newCategory, setNewCategory] = useState<'suggestion' | 'must_fix' | 'praise' | 'question'>('suggestion');
  const [isDefiningSubtopic, setIsDefiningSubtopic] = useState(false);
  const [editingSubtopicId, setEditingSubtopicId] = useState<string | null>(null);
  const [editingCommandText, setEditingCommandText] = useState('');

  // Method 2: 4-Stage Guided Mentor Audit State
  const [currentAuditStage, setCurrentAuditStage] = useState<1 | 2 | 3 | 4>(1);
  const [auditStage1, setAuditStage1] = useState({
    verdict: 'clean' as 'clean' | 'slightly_cluttered' | 'dense',
    notes: 'Contact info is masked for privacy. Layout margins and visual hierarchy are well balanced.',
    highlightSection: 'contact'
  });
  const [auditStage2, setAuditStage2] = useState({
    selectedProject: 'Academic / Technical Project',
    authenticity: 'genuine_challenge' as 'genuine_challenge' | 'academic_standard' | 'tutorial_clone',
    challengeNotes: 'Describe technical challenges, architecture decisions, and concurrency/scale handling.',
    proofOfWork: 'https://github.com/'
  });
  const [auditStage3, setAuditStage3] = useState({
    interviewQuestion: 'How would your application handle 10x traffic spikes or database concurrency?',
    prepTip: 'Explain database indexing, asynchronous worker queues, and caching patterns.'
  });
  const [auditStage4, setAuditStage4] = useState({
    task1: 'Add quantified impact metrics (% latency reduction, users served).',
    task2: 'Categorize technical skills cleanly into Languages, Frameworks, and Tools.',
    encouragement: 'Strong engineering fundamentals! Polish these key areas to be interview ready.'
  });
  const [auditAppliedSuccess, setAuditAppliedSuccess] = useState(false);

  // Method 3: Rewrite Suggestion Tool
  const [rewriteTargetSection, setRewriteTargetSection] = useState('objective');
  const [rewriteOriginal, setRewriteOriginal] = useState('Enthusiastic computer science student seeking an entry level developer job to gain experience and help the company grow.');
  const [rewriteProposed, setRewriteProposed] = useState('Results-driven Software Engineering candidate with hands-on full-stack development experience, seeking to build high-performance web applications.');
  const [rewriteSavedAlert, setRewriteSavedAlert] = useState(false);

  // Method 4: Voice Feedback Recorder Simulation & Transcription
  const [voiceTarget, setVoiceTarget] = useState<string>('overall');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [maxVoiceSeconds, setMaxVoiceSeconds] = useState<number>(300); // 5 mins
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

  const handleInsertRubricSummary = () => {
    const summary = `\n\nMENTOR EVALUATION RUBRIC (Score: ${calculateRubricOverall()}%):\n• ATS & Layout: ${rubricScores.atsFormat}/5\n• Impact & Metrics: ${rubricScores.metricsImpact}/5\n• Technical Stack Depth: ${rubricScores.techDepth}/5\n• Clarity & Action Verbs: ${rubricScores.grammarClarity}/5`;
    updateGeneralFeedback((activeStudent?.generalFeedback || '') + summary);
    alert('Rubric scorecard appended to Overall Feedback!');
  };

  if (!activeStudent) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Student not found.</div>;
  }

  // Safe fallback to student subtopics and sections
  const initialStudentData = initialStudents.find(s => s.id === activeStudent.id) || initialStudents[0];
  const volunteerSubtopics = (activeStudent.volunteerSubtopics && activeStudent.volunteerSubtopics.length > 0)
    ? activeStudent.volunteerSubtopics
    : (initialStudentData.volunteerSubtopics || []);

  const reviewedCount = volunteerSubtopics.filter(s => s.isReviewed).length;
  const totalSubtopics = volunteerSubtopics.length;
  const progressPercent = totalSubtopics > 0 ? Math.round((reviewedCount / totalSubtopics) * 100) : 0;

  const standardSections: { key: string; title: string }[] = [
    { key: 'objective', title: 'Career Objective' },
    { key: 'education', title: 'Education & Academics' },
    { key: 'skills', title: 'Technical Skills' },
    { key: 'projects', title: 'Projects & Work' },
    { key: 'experience', title: 'Experience & Internships' },
    { key: 'certifications', title: 'Certifications & Awards' },
    { key: `page_${activeResumePage}`, title: `Current Page (${activeResumePage})` }
  ];

  const improveTagOptions = [
    'Grammar', 'Formatting', 'Skills', 'Objective', 'Projects', 'Education'
  ];

  // Resolve Real Uploaded Resume PDF URL from backend proxy
  const resumePdfUrl = activeStudent.resumeAttachment 
    ? (activeStudent.resumeAttachment.startsWith('/') && !activeStudent.resumeAttachment.startsWith('/api')
        ? activeStudent.resumeAttachment
        : getResumeViewUrl(activeStudent.resumeAttachment, activeStudent.name))
    : '';

  // ---------------------------------------------------------------------------
  // PDF.JS DOCUMENT & CANVAS RENDERING WITH REAL-TIME PRIVACY MASKING
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let isCancelled = false;

    if (!activeStudent.resumeAttachment) {
      setPdfLoading(false);
      setPdfError(false);
      return;
    }

    setPdfLoading(true);
    setPdfError(false);
    setPrivacyMasks([]);

    const loadPdfDoc = async () => {
      try {
        const pdfjs = (window as any).pdfjsLib;
        if (!pdfjs) {
          throw new Error('PDF viewer library is still initializing.');
        }

        // Load PDF through existing secure backend proxy
        const loadingTask = pdfjs.getDocument({
          url: resumePdfUrl,
          withCredentials: false
        });

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        pdfDocRef.current = doc;
        setPdfTotalPages(doc.numPages);

        const safePageNum = Math.max(1, Math.min(activeResumePage, doc.numPages));
        const page = await doc.getPage(safePageNum);
        if (isCancelled) return;

        // Base scale calculated for clear readability on Desktop and Mobile
        const isMobileDevice = typeof window !== 'undefined' && window.innerWidth <= 640;
        const baseScale = isMobileDevice ? 0.85 : 1.35;
        const currentScale = baseScale * (zoomLevel / 100);
        const viewport = page.getViewport({ scale: currentScale });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Cancel previous rendering task if running
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (_) {}
        }

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;

        if (isCancelled) return;

        // -----------------------------------------------------------------------
        // PDF TEXT EXTRACTION: LINE CLUSTERING FOR SECTIONS & FULL PRIVACY MASKING
        // -----------------------------------------------------------------------
        const textContent = await page.getTextContent();
        if (isCancelled) return;

        interface RawTextItem {
          str: string;
          tx: number;
          ty: number;
          width: number;
          height: number;
        }

        const rawItems: RawTextItem[] = [];
        textContent.items.forEach((item: any) => {
          if (!item.str || typeof item.str !== 'string') return;
          const str = item.str;
          const tx = item.transform[4];
          const ty = item.transform[5];
          const width = Math.max(item.width, 4);
          const height = Math.max(item.height || Math.abs(item.transform[3]) || 12, 12);
          rawItems.push({ str, tx, ty, width, height });
        });

        // Cluster raw items into horizontal text lines (by Y coordinate)
        interface TextLine {
          ty: number;
          items: RawTextItem[];
          fullText: string;
          minTx: number;
          maxTx: number;
          height: number;
        }

        const lines: TextLine[] = [];
        const sortedItems = [...rawItems].sort((a, b) => b.ty - a.ty);

        sortedItems.forEach(item => {
          const match = lines.find(line => Math.abs(line.ty - item.ty) < 3.5);
          if (match) {
            match.items.push(item);
          } else {
            lines.push({
              ty: item.ty,
              items: [item],
              fullText: '',
              minTx: item.tx,
              maxTx: item.tx + item.width,
              height: item.height
            });
          }
        });

        lines.forEach(line => {
          line.items.sort((a, b) => a.tx - b.tx);
          line.fullText = line.items.map(it => it.str).join(' ').trim();
          line.minTx = Math.min(...line.items.map(it => it.tx));
          line.maxTx = Math.max(...line.items.map(it => it.tx + it.width));
          line.height = Math.max(...line.items.map(it => it.height));
        });

        // ---------------------------------------------------------------------
        // 1. SECTION HEADING DETECTION DIRECTLY ON ACTUAL PDF
        // ---------------------------------------------------------------------
        const sectionDefs: { regex: RegExp; key: string; title: string }[] = [
          { regex: /^(career\s+)?objective\b|^professional\s+summary\b|^summary\b|^about\s+me\b/i, key: 'objective', title: 'Career Objective' },
          { regex: /^technical\s+skills\b|^skills(\s+(&|and)\s+abilities)?\b|^core\s+competencies\b|^key\s+skills\b/i, key: 'skills', title: 'Technical Skills' },
          { regex: /^education(\s+(&|and)\s+academics)?\b|^academic\s+qualifications?\b|^academic\s+background\b/i, key: 'education', title: 'Education' },
          { regex: /^(academic\s+|key\s+|personal\s+)?projects\b/i, key: 'projects', title: 'Projects' },
          { regex: /^(work\s+)?experience\b|^internships?\b|^employment\s+history\b/i, key: 'experience', title: 'Experience' },
          { regex: /^certifications?\b|^certificates?\b|^achievements?\b|^awards(\s+(&|and)\s+honors)?\b/i, key: 'certifications', title: 'Certifications' },
          { regex: /^(extra[\s-]?)?curricular(\s+activities)?\b|^activities\b|^co[\s-]curricular\b/i, key: 'activities', title: 'Activities' },
          { regex: /^interests?(\s+(&|and)\s+hobbies)?\b|^hobbies\b/i, key: 'interests', title: 'Interests & Hobbies' },
          { regex: /^declaration\b/i, key: 'declaration', title: 'Declaration' }
        ];

        const pageSections: DetectedPdfSection[] = [];
        const seenSectionKeys = new Set<string>();

        lines.forEach(line => {
          const text = line.fullText.trim();
          if (!text || text.length > 45) return;
          // Sections are located in the left column or top header (tx < 380)
          if (line.minTx > 400) return;

          for (const def of sectionDefs) {
            if (def.regex.test(text) && !seenSectionKeys.has(def.key)) {
              seenSectionKeys.add(def.key);

              const rect = viewport.convertToViewportRectangle([
                line.minTx,
                line.ty,
                line.maxTx,
                line.ty + line.height
              ]);

              const left = Math.min(rect[0], rect[2]);
              const top = Math.min(rect[1], rect[3]);
              const right = Math.max(rect[0], rect[2]);
              const width = Math.abs(rect[2] - rect[0]);
              const height = Math.abs(rect[3] - rect[1]);

              const canvasW = viewport.width || 1;
              const canvasH = viewport.height || 1;
              const pdfX = Math.round((left / canvasW) * 100);
              const pdfY = Math.round((top / canvasH) * 100);

              pageSections.push({
                id: `sec-${safePageNum}-${def.key}`,
                key: def.key,
                title: def.title,
                page: safePageNum,
                pixelLeft: Math.round(left),
                pixelTop: Math.round(top),
                pixelRight: Math.round(right),
                pixelWidth: Math.round(width),
                pixelHeight: Math.round(height),
                pdfX,
                pdfY
              });
              break;
            }
          }
        });

        setDetectedSections(pageSections);

        // ---------------------------------------------------------------------
        // 2. PRIVACY MASKING: WHITE FROSTED BLUR FOR EMAIL, PHONE, ADDRESS & PHOTO
        // ---------------------------------------------------------------------
        const rawMasks: PrivacyMask[] = [];

        // Enhanced Email regex supporting standard emails, spaced characters & tags
        const emailRegex = /[A-Za-z0-9._%+-]+(?:\s*@\s*|\s*\[at\]\s*)[A-Za-z0-9.-]+\s*\.[A-Za-z]{2,}/i;

        // Enhanced Phone regex supporting +91, spaces, dashes, brackets, etc.
        const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}|\b[6-9]\d{4}[\s.-]?\d{5}\b|\b[6-9]\d{9}\b|\+91[\s-]?\d{10}/;

        // Address indicators covering labels, door/flat numbers, road/street/nagar/salai/kovil, cities, states, pin codes
        const addressIndicatorRegex = /(?:permanent|current|residential|present|communication|postal)?\s*address[\s:]|\b(?:door|flat|plot|house|d[\s./-]?no|h[\s./-]?no)\b|\b(?:street|road|rd\.?|lane|nagar|colony|layout|salai|cross|main|kovil|temple|apt|apartment|block)\b|\b(?:chennai|coimbatore|madurai|trichy|salem|bangalore|bengaluru|hyderabad|mumbai|delhi|kolkata|pune|kerala|tamil\s*nadu|karnataka|andhra|india)\b|\b(?:thiruvottiyur|tambaram|velachery|guindy|anna\s*nagar|ambattur|avadi|mylapore|adyar|triplicane|chromepet)\b|\b(?:pincode|pin\s*code|postal\s*code|pin[\s:-]*\d{6})\b|\b[1-9]\d{5}\b/i;

        const studentEmail = (activeStudent.email || '').trim().toLowerCase();
        const studentPhoneClean = (activeStudent.phone || '').replace(/\D/g, '');
        const studentLocation = (activeStudent.location || '').trim().toLowerCase();

        // Safety filter: NEVER mask student name, education, skills, projects, certifications or academic content
        const isAcademicHeading = (text: string) => {
          return /^(education|technical\s+skills|skills|projects|experience|certifications?|activities|declaration|career\s+objective|summary)\b/i.test(text.trim()) ||
            /\b(b\.?e|b\.?tech|b\.?sc|m\.?tech|m\.?ca|cgpa|percentage|hsc|sslc|cbse|autonomous|university|college|school|curriculum)\b/i.test(text);
        };

        // -----------------------------------------------------------------------
        // COLUMN-AWARE HELPERS (used by email, address masking below)
        // MUST be defined before first use — const arrow functions are NOT hoisted.
        // -----------------------------------------------------------------------

        // Splits a TextLine's items into column-segments separated by gaps > 18pt.
        // PDF inter-word spaces are 3–8pt; column gutters are typically > 20pt.
        interface ColSegment {
          items: RawTextItem[];
          minTx: number;
          maxTx: number;
          segText: string;
        }
        const getColSegments = (lineItems: RawTextItem[]): ColSegment[] => {
          const sorted = [...lineItems].sort((a, b) => a.tx - b.tx);
          const segs: ColSegment[] = [];
          let cur: RawTextItem[] = [];
          sorted.forEach((it, i) => {
            if (i === 0) { cur.push(it); return; }
            const gap = it.tx - (sorted[i - 1].tx + sorted[i - 1].width);
            if (gap > 18) {
              segs.push({
                items: cur,
                minTx: Math.min(...cur.map(x => x.tx)),
                maxTx: Math.max(...cur.map(x => x.tx + x.width)),
                segText: cur.map(x => x.str).join(' ').trim()
              });
              cur = [it];
            } else {
              cur.push(it);
            }
          });
          if (cur.length > 0) {
            segs.push({
              items: cur,
              minTx: Math.min(...cur.map(x => x.tx)),
              maxTx: Math.max(...cur.map(x => x.tx + x.width)),
              segText: cur.map(x => x.str).join(' ').trim()
            });
          }
          return segs;
        };

        // Given a column X range, returns only items whose midpoint falls within it.
        const itemsInCol = (lineItems: RawTextItem[], colMinX: number, colMaxX: number): RawTextItem[] => {
          const colMid = (colMinX + colMaxX) / 2;
          const colHalf = (colMaxX - colMinX) / 2 + 20; // 20pt tolerance
          return lineItems.filter(it => {
            const itMid = it.tx + it.width / 2;
            return Math.abs(itMid - colMid) <= colHalf;
          });
        };

        // Non-personal content guard: stops masking expansion into Profile/Education/Skills etc.
        const isNonPersonalContent = (text: string) =>
          /^(profile|summary|about\s+me|career\s+objective|objective|education|technical\s+skills|skills|projects?|experience|internship|certifications?|activities|languages?|achievements?|declaration|linkedin|github|portfolio|cgpa|degree|college|university)/i.test(text.trim()) ||
          /\b(commerce|graduate|b\.?e\.?|b\.?tech|m\.?tech|cgpa|hsc|sslc|autonomous|university|college|curriculum)\b/i.test(text);

        // A. Full Email Masking — COLUMN-AWARE
        // Only mask items that clearly belong to the email value.
        // Never fall back to line.items (which can include Profile text from the right column).
        lines.forEach(line => {
          if (isAcademicHeading(line.fullText)) return;
          const textNoSpaces = line.fullText.replace(/\s+/g, '');
          const isEmail = emailRegex.test(line.fullText) ||
                          emailRegex.test(textNoSpaces) ||
                          (studentEmail && textNoSpaces.toLowerCase().includes(studentEmail.replace(/\s+/g, '')));

          if (isEmail) {
            // Identify the column segment that actually contains the email.
            const lineSegs = getColSegments(line.items);
            const emailSeg = lineSegs.find(seg =>
              emailRegex.test(seg.segText) ||
              emailRegex.test(seg.segText.replace(/\s+/g, '')) ||
              (studentEmail && seg.segText.replace(/\s+/g, '').toLowerCase().includes(studentEmail.replace(/\s+/g, '')))
            );

            // Fall back to items that directly contain '@' or known email tokens.
            // Removed: generic /[a-z0-9._%+-]/i — this matched every text item.
            const emailItems = (emailSeg ? emailSeg.items : line.items).filter(it => {
              const s = it.str.toLowerCase();
              return s.includes('@') ||
                     emailRegex.test(s) ||
                     /\.(com|in|org|edu|net)\b/i.test(s) ||
                     (studentEmail && studentEmail.includes(s.trim())) ||
                     /email|mail/i.test(s);
            });

            // Use the email segment items if we found a segment, else only the filtered items.
            // Never use full line.items as that can span multiple columns.
            const targetItems = emailItems.length > 0
              ? emailItems
              : emailSeg
                ? emailSeg.items
                : null;

            if (!targetItems || targetItems.length === 0) return;

            const minTx = Math.min(...targetItems.map(t => t.tx));
            const maxTx = Math.max(...targetItems.map(t => t.tx + t.width));
            const rect = viewport.convertToViewportRectangle([
              minTx,
              line.ty,
              maxTx,
              line.ty + line.height
            ]);

            rawMasks.push({
              id: `mask-email-${line.ty}-${Math.round(minTx)}`,
              left: Math.round(Math.min(rect[0], rect[2]) - 6),
              top: Math.round(Math.min(rect[1], rect[3]) - 3),
              width: Math.round(Math.abs(rect[2] - rect[0]) + 12),
              height: Math.round(Math.abs(rect[3] - rect[1]) + 6),
              type: 'email',
              label: ''
            });
          }
        });

        // B. Full Phone Masking (e.g. +91 9941864626, 99418 64626, etc.)
        lines.forEach(line => {
          if (isAcademicHeading(line.fullText)) return;
          const cleanDigits = line.fullText.replace(/\D/g, '');
          const isPhone = phoneRegex.test(line.fullText) || 
                          (cleanDigits.length >= 10 && (/[6-9]\d{9}/.test(cleanDigits) || (studentPhoneClean && cleanDigits.includes(studentPhoneClean))));

          if (isPhone) {
            const phoneItems = line.items.filter(it => {
              const s = it.str;
              return /\d/.test(s) || 
                     /[+()/-]/.test(s) || 
                     /ph|mob|tel|call|contact/i.test(s);
            });

            const targetItems = phoneItems.length > 0 ? phoneItems : line.items;
            const minTx = Math.min(...targetItems.map(t => t.tx));
            const maxTx = Math.max(...targetItems.map(t => t.tx + t.width));
            const rect = viewport.convertToViewportRectangle([
              minTx,
              line.ty,
              maxTx,
              line.ty + line.height
            ]);

            rawMasks.push({
              id: `mask-phone-${line.ty}-${Math.round(minTx)}`,
              left: Math.round(Math.min(rect[0], rect[2]) - 6),
              top: Math.round(Math.min(rect[1], rect[3]) - 3),
              width: Math.round(Math.abs(rect[2] - rect[0]) + 12),
              height: Math.round(Math.abs(rect[3] - rect[1]) + 6),
              type: 'phone',
              label: ''
            });
          }
        });

        // C. Full Multi-line Address Block Masking — COLUMN-AWARE
        // Strategy:
        // 1. Find address anchor items on a line.
        // 2. Determine the anchor column's X range (colMinX..colMaxX) from items
        //    belonging to the same horizontal cluster as the address token
        //    (gap > 18pt separates columns inside a single PDF "line").
        // 3. For every vertically adjacent candidate line, collect only items
        //    that fall within the anchor column X range.
        // 4. Stop expansion when no items in the candidate line fall in the column.
        // This prevents Profile/Summary text on the right from ever being masked.
        // (getColSegments, itemsInCol, isNonPersonalContent are defined above section A.)

        // Structure to hold address block segments for ONE anchor at a time.
        interface AddrBlockSeg {
          items: RawTextItem[];
          ty: number;
          height: number;
        }

        // Stronger address anchor: require a structural address token, not just a city/PIN alone.
        // City/PIN alone can false-trigger on Education or Experience sections.
        const strongAddressAnchorRegex = /(?:permanent|current|residential|present|communication|postal)?\s*address[\s:]|\b(?:door|flat|plot|house|d[\s./-]?no|h[\s./-]?no)\b|\b(?:street|road|rd\.?|lane|nagar|colony|layout|salai|cross|main|kovil|temple|apt|apartment|block)\b/i;

        // Continuation regex: city/PIN/locality can appear AFTER a strong anchor in the same column.
        const addressContinuationRegex = /\b(?:chennai|coimbatore|madurai|trichy|salem|bangalore|bengaluru|hyderabad|mumbai|delhi|kolkata|pune|kerala|tamil\s*nadu|karnataka|andhra|india)\b|\b(?:thiruvottiyur|tambaram|velachery|guindy|anna\s*nagar|ambattur|avadi|mylapore|adyar|triplicane|chromepet)\b|\b[1-9]\d{5}\b|\bpin\b/i;

        lines.forEach((line, idx) => {
          // NOTE: guards NEVER run on line.fullText in two-column layouts.
          // Column splitting happens FIRST; guards apply only to column-filtered text.

          // Split line into column segments.
          const segs = getColSegments(line.items);

          // Find the segment that contains a STRONG address anchor (not just city/PIN).
          const anchorSeg = segs.find(seg =>
            strongAddressAnchorRegex.test(seg.segText) &&
            !isNonPersonalContent(seg.segText)
          );

          if (!anchorSeg) return;

          // Each anchor builds its OWN local block — never shared across anchors.
          const localBlockSegs: AddrBlockSeg[] = [];

          // Column X range of the address anchor segment.
          const colMinX = anchorSeg.minTx - 5;
          const colMaxX = anchorSeg.maxTx + 5;

          // Anchor line items in the address column.
          const anchorItems = itemsInCol(line.items, colMinX, colMaxX);
          if (anchorItems.length > 0) {
            localBlockSegs.push({ items: anchorItems, ty: line.ty, height: line.height });
          }

          // Expand BACKWARDS (upward in PDF coords = higher ty).
          // Guards run ONLY on column-filtered text — no fullText checks.
          for (let back = 1; back <= 3; back++) {
            const prevIdx = idx - back;
            if (prevIdx < 0) break;
            const prev = lines[prevIdx];
            const dy = Math.abs(prev.ty - lines[idx - back + 1].ty);
            if (dy >= 36) break;

            const prevColItems = itemsInCol(prev.items, colMinX, colMaxX);
            if (prevColItems.length === 0) break;
            const prevColText = prevColItems.map(x => x.str).join(' ').trim();
            if (isNonPersonalContent(prevColText)) break;
            const isAddrContent = strongAddressAnchorRegex.test(prevColText) ||
                                  addressContinuationRegex.test(prevColText) ||
                                  /\d/.test(prevColText) ||
                                  /,/.test(prevColText);
            if (!isAddrContent) break;
            localBlockSegs.push({ items: prevColItems, ty: prev.ty, height: prev.height });
          }

          // Expand FORWARDS (downward).
          // Guards run ONLY on column-filtered text — no fullText checks.
          for (let forward = 1; forward <= 3; forward++) {
            const nextIdx = idx + forward;
            if (nextIdx >= lines.length) break;
            const next = lines[nextIdx];
            const dy = Math.abs(next.ty - lines[idx + forward - 1].ty);
            if (dy >= 36) break;

            const nextColItems = itemsInCol(next.items, colMinX, colMaxX);
            if (nextColItems.length === 0) break;
            const nextColText = nextColItems.map(x => x.str).join(' ').trim();
            if (isNonPersonalContent(nextColText)) break;
            const isAddrContent = strongAddressAnchorRegex.test(nextColText) ||
                                  addressContinuationRegex.test(nextColText) ||
                                  /\b\d{6}\b/.test(nextColText) ||
                                  /\d/.test(nextColText);
            if (!isAddrContent) break;
            localBlockSegs.push({ items: nextColItems, ty: next.ty, height: next.height });
          }

          // Emit ONE mask immediately for THIS anchor's local block only.
          if (localBlockSegs.length > 0) {
            const allItems = localBlockSegs.flatMap(s => s.items);
            const minTx = Math.min(...allItems.map(it => it.tx));
            const maxTx = Math.max(...allItems.map(it => it.tx + it.width));
            const minTy = Math.min(...localBlockSegs.map(s => s.ty));
            const maxTy = Math.max(...localBlockSegs.map(s => s.ty + s.height));

            const rect = viewport.convertToViewportRectangle([minTx, minTy, maxTx, maxTy]);
            rawMasks.push({
              id: `mask-address-block-${Math.round(minTy)}-${Math.round(maxTy)}`,
              left: Math.round(Math.min(rect[0], rect[2]) - 6),
              top: Math.round(Math.min(rect[1], rect[3]) - 3),
              width: Math.round(Math.abs(rect[2] - rect[0]) + 12),
              height: Math.round(Math.abs(rect[3] - rect[1]) + 6),
              type: 'address',
              label: ''
            });
          }
        });

        // Each address anchor now emits its own mask inline (localBlockSegs above).

        // D. Profile Photo Masking (Page 1 upper header area)
        let foundPhoto = false;
        if (safePageNum === 1) {
          try {
            const ops = await page.getOperatorList();
            const pdfjs = (window as any).pdfjsLib;
            const paintImageXObject = pdfjs?.OPS?.paintImageXObject;
            const paintInlineImageXObject = pdfjs?.OPS?.paintInlineImageXObject;
            const transformOp = pdfjs?.OPS?.transform;
            const saveOp = pdfjs?.OPS?.save;
            const restoreOp = pdfjs?.OPS?.restore;

            let ctm = [1, 0, 0, 1, 0, 0];
            const ctmStack: number[][] = [];
            const pageH = viewport.viewBox ? viewport.viewBox[3] : 842;
            const pageW = viewport.viewBox ? viewport.viewBox[2] : 595;

            for (let i = 0; i < ops.fnArray.length; i++) {
              const fn = ops.fnArray[i];
              const args = ops.argsArray[i];

              if (fn === saveOp) {
                ctmStack.push([...ctm]);
              } else if (fn === restoreOp) {
                if (ctmStack.length > 0) ctm = ctmStack.pop()!;
              } else if (fn === transformOp && Array.isArray(args) && args.length === 6) {
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
                const x1 = a + e, y1 = b + f;
                const x2 = c + e, y2 = d + f;
                const x3 = a + c + e, y3 = b + d + f;

                const minX = Math.min(x0, x1, x2, x3);
                const maxX = Math.max(x0, x1, x2, x3);
                const minY = Math.min(y0, y1, y2, y3);
                const maxY = Math.max(y0, y1, y2, y3);
                const imgW = maxX - minX;
                const imgH = maxY - minY;

                // Candidate headshot criteria:
                // Upper 42% of page 1, dimensions between 28pt & 240pt, not a full background banner
                const isTopArea = minY > pageH * 0.58;
                const isPhotoDimensions = imgW >= 28 && imgW <= 240 && imgH >= 28 && imgH <= 260 && imgW < pageW * 0.45;
                const aspect = imgW / (imgH || 1);
                const isHeadshotAspect = aspect >= 0.55 && aspect <= 1.85;

                if (isTopArea && isPhotoDimensions && isHeadshotAspect) {
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
                  foundPhoto = true;
                  break;
                }
              }
            }
          } catch (err) {
            console.warn('[Privacy Masking] Image operator scan note:', err);
          }
        }

        // E. Scanned / Image Resume Fallback Strategy (page 1)
        if (safePageNum === 1 && rawItems.length < 15) {
          // Flattened/scanned document where text couldn't be extracted
          if (!foundPhoto) {
            // Conservative top-right candidate photo box
            rawMasks.push({
              id: 'mask-photo-scanned-fallback',
              left: Math.round(viewport.width - (viewport.width * 0.22) - 16),
              top: 24,
              width: Math.round(viewport.width * 0.22),
              height: Math.round(viewport.width * 0.26),
              type: 'photo',
              label: ''
            });
          }

          // Conservative contact line overlay below candidate name header (LEFT HALF ONLY)
          rawMasks.push({
            id: 'mask-contact-scanned-fallback',
            left: Math.round(viewport.width * 0.08),
            top: Math.round(viewport.height * 0.095),
            width: Math.round(viewport.width * 0.42),
            height: Math.round(viewport.height * 0.045),
            type: 'phone',
            label: ''
          });
        }

        // F. Merge nearby / overlapping masks — SAME COLUMN ONLY (horizontal proximity < 30px)
        const mergedMasks: PrivacyMask[] = [];
        rawMasks.forEach(mask => {
          const overlapIdx = mergedMasks.findIndex(m =>
            m.type === mask.type &&
            Math.abs(m.top - mask.top) < 10 &&
            !(mask.left > m.left + m.width + 10 || mask.left + mask.width < m.left - 10) &&
            // Only merge if both masks are horizontally close (same column)
            Math.abs(m.left - mask.left) < 30
          );
          if (overlapIdx >= 0) {
            const existing = mergedMasks[overlapIdx];
            const minLeft = Math.min(existing.left, mask.left);
            const minTop = Math.min(existing.top, mask.top);
            const maxRight = Math.max(existing.left + existing.width, mask.left + mask.width);
            const maxBottom = Math.max(existing.top + existing.height, mask.top + mask.height);
            mergedMasks[overlapIdx] = {
              ...existing,
              left: minLeft,
              top: minTop,
              width: maxRight - minLeft,
              height: maxBottom - minTop
            };
          } else {
            mergedMasks.push(mask);
          }
        });

        setPrivacyMasks(mergedMasks);
        setPdfLoading(false);
      } catch (err: any) {
        if (!isCancelled) {
          console.error('[Resume PDF Viewer] Error loading PDF:', err);
          setPdfLoading(false);
          setPdfError(true);
        }
      }
    };

    loadPdfDoc();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_) {}
      }
    };
  }, [activeStudent.id, activeStudent.resumeAttachment, activeResumePage, zoomLevel, reloadNonce]);

  // Click on PDF Canvas to Drop Pin Annotation (PDF Review Model)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const clampedX = Math.max(2, Math.min(96, x));
    const clampedY = Math.max(2, Math.min(96, y));

    setActivePin({ page: activeResumePage, x: clampedX, y: clampedY });
    setIsDefiningSubtopic(true);
    setActiveCommentTool('sections');
    setNewSubtopicTitle(`Page ${activeResumePage} Note`);
    setSelectedSectionKey(`page_${activeResumePage}`);
  };

  const handleAddSubtopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtopicTitle.trim()) return;

    let finalCommand = newCommandText.trim();
    if (activePin) {
      finalCommand = `${finalCommand ? finalCommand + '\n' : ''}[Annotation Pin: Page ${activePin.page} at (${activePin.x}%, ${activePin.y}%)]`;
    }

    addVolunteerSubtopic(newSubtopicTitle, selectedSectionKey || 'custom', finalCommand, newCategory);
    setNewSubtopicTitle('');
    setSelectedSectionKey('objective');
    setNewCommandText('');
    setNewCategory('suggestion');
    setIsDefiningSubtopic(false);
    setActivePin(null);
  };

  const handleStartEditSubtopic = (sub: VolunteerSubtopic) => {
    setEditingSubtopicId(sub.id);
    setEditingCommandText(sub.command || '');
  };

  const handleSaveEditSubtopic = (subId: string) => {
    updateSubtopicCommand(subId, editingCommandText);
    setEditingSubtopicId(null);
  };

  const handleApplyAuditToReview = () => {
    const s1Cat = auditStage1.verdict === 'clean' ? 'praise' : 'must_fix';
    const s1Label = auditStage1.verdict === 'clean' ? 'Clean & Scannable' : auditStage1.verdict === 'slightly_cluttered' ? 'Needs Spacing Fix' : 'Dense Layout';
    addVolunteerSubtopic(
      `Stage 1: 6-Sec Glance (${s1Label})`,
      auditStage1.highlightSection || 'contact',
      auditStage1.notes,
      s1Cat
    );

    const s2Cat = auditStage2.authenticity === 'genuine_challenge' ? 'praise' : 'must_fix';
    addVolunteerSubtopic(
      `Stage 2: Tech Depth (${auditStage2.selectedProject})`,
      'projects',
      `${auditStage2.challengeNotes}\n\n[Proof of Work]: ${auditStage2.proofOfWork}`,
      s2Cat
    );

    addVolunteerSubtopic(
      'Stage 3: Interview Defense Question',
      'projects',
      `Mock Question: "${auditStage3.interviewQuestion}"\n\n[Coaching Tip]: ${auditStage3.prepTip}`,
      'suggestion'
    );

    addVolunteerSubtopic(
      'Stage 4: 7-Day Action Plan',
      'overall',
      `1. ${auditStage4.task1}\n2. ${auditStage4.task2}\n\n[Mentor Encouragement]: ${auditStage4.encouragement}`,
      'must_fix'
    );

    updateGeneralFeedback(`${auditStage4.encouragement}\n\nKey Interview Question to Prepare: "${auditStage3.interviewQuestion}"`);
    setAuditAppliedSuccess(true);
    setTimeout(() => setAuditAppliedSuccess(false), 4000);
  };

  const handleSaveRewriteSuggestion = () => {
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
            className="btn btn-outline btn-sm"
            onClick={() => {
              setSelectedStudentForViewId(activeStudent.id);
              setActiveRole('student');
            }}
            title="Preview how student sees the listed feedback"
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

      {/* Dual Pane Layout (Left: Real Uploaded Resume PDF, Right: Review Tools Panel) */}
      <div className="workspace-dual-pane" data-mobile-tab={mobileTab}>
        {/* Left Pane: Real Uploaded PDF Resume Viewer with Privacy Redaction */}
        <section className="resume-viewer-pane" style={{ flex: 1.25, display: 'flex', flexDirection: 'column', background: '#0F172A' }}>
          {/* Document Header Toolbar */}
          <div className="resume-toolbar" style={{ background: '#1E293B', color: '#F8FAFC', borderBottom: '1px solid #334155' }}>
            <div className="resume-file-info" style={{ color: '#F8FAFC' }}>
              <span className="pdf-icon-badge" style={{ color: '#EF4444' }}><PdfIcon size={18} /></span>
              <span className="resume-filename" style={{ color: '#F8FAFC' }}>
                {activeStudent.name.replace(/\s+/g, '_')}_Resume.pdf
              </span>
              <span style={{ 
                fontSize: '11px', 
                background: '#047857', 
                color: '#ECFDF5', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '4px',
                marginLeft: '6px'
              }}>
                <Lock size={10} /> Privacy Protected
              </span>
            </div>

            <div className="resume-view-controls">
              {/* Page Navigator */}
              <div className="page-navigator" style={{ color: '#F8FAFC' }}>
                <button 
                  className="page-nav-btn" 
                  onClick={() => setResumePage(activeResumePage - 1)}
                  disabled={activeResumePage <= 1}
                  aria-label="Previous Page"
                  style={{ color: '#F8FAFC', borderColor: '#475569' }}
                >
                  &lt;
                </button>
                <span className="page-indicator-text" style={{ color: '#F8FAFC' }}>
                  {activeResumePage} / {pdfTotalPages}
                </span>
                <button 
                  className="page-nav-btn" 
                  onClick={() => setResumePage(activeResumePage + 1)}
                  disabled={activeResumePage >= pdfTotalPages}
                  aria-label="Next Page"
                  style={{ color: '#F8FAFC', borderColor: '#475569' }}
                >
                  &gt;
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="zoom-controls">
                <button 
                  className="zoom-btn" 
                  onClick={() => setZoom(Math.max(60, zoomLevel - 10))} 
                  aria-label="Zoom Out"
                  style={{ color: '#F8FAFC', borderColor: '#475569' }}
                >
                  -
                </button>
                <span className="zoom-indicator-text" style={{ color: '#F8FAFC' }}>{zoomLevel}%</span>
                <button 
                  className="zoom-btn" 
                  onClick={() => setZoom(Math.min(160, zoomLevel + 10))} 
                  aria-label="Zoom In"
                  style={{ color: '#F8FAFC', borderColor: '#475569' }}
                >
                  +
                </button>
              </div>

              <div className="toolbar-divider" style={{ background: '#475569' }} />

              {/* Download Original Resume */}
              <button 
                className="toolbar-action-icon-btn" 
                onClick={() => {
                  if (activeStudent.resumeAttachment) {
                    window.open(getResumeDownloadUrl(activeStudent.resumeAttachment, activeStudent.name), '_blank');
                  } else {
                    alert(`Resume file not attached for ${activeStudent.name}.`);
                  }
                }}
                title="Download Original Resume PDF"
                style={{ color: '#CBD5E1' }}
              >
                <DownloadIcon size={16} />
              </button>

              {/* Open in New Tab */}
              <button 
                className="toolbar-action-icon-btn" 
                onClick={() => {
                  if (resumePdfUrl) {
                    window.open(resumePdfUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                title="Open Original PDF in New Tab"
                style={{ color: '#CBD5E1' }}
              >
                <MaximizeIcon size={16} />
              </button>
            </div>
          </div>

          {/* Real PDF Scroll Canvas */}
          <div 
            className="resume-scroll-canvas" 
            style={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'flex-start', 
              overflow: 'auto', 
              padding: '24px', 
              position: 'relative',
              background: '#0F172A'
            }}
          >
            {!activeStudent.resumeAttachment ? (
              <div style={{
                margin: 'auto',
                padding: '40px',
                background: '#1E293B',
                borderRadius: '8px',
                border: '1px solid #334155',
                textAlign: 'center',
                color: '#94A3B8',
                maxWidth: '380px'
              }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>📄</span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#F8FAFC', marginBottom: '6px' }}>Resume Not Uploaded</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8' }}>
                  No resume file was uploaded in Zoho Creator for {activeStudent.name}.
                </p>
              </div>
            ) : pdfError ? (
              <div style={{
                margin: 'auto',
                padding: '40px',
                background: '#1E293B',
                borderRadius: '8px',
                border: '1px solid #EF4444',
                textAlign: 'center',
                color: '#94A3B8',
                maxWidth: '400px'
              }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>⚠️</span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#F87171', marginBottom: '6px' }}>Failed to Load Resume PDF</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px' }}>
                  Could not load the resume preview from the backend proxy. Please retry or open the original file.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => { setPdfError(false); setPdfLoading(true); setReloadNonce(n => n + 1); }}
                  >
                    <RefreshCw size={13} style={{ marginRight: '5px' }} /> Retry
                  </button>
                  <a 
                    href={getResumeDownloadUrl(activeStudent.resumeAttachment, activeStudent.name)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline btn-sm"
                    style={{ color: '#F8FAFC', borderColor: '#475569' }}
                  >
                    <Download size={13} style={{ marginRight: '5px' }} /> Download
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {pdfLoading && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 20,
                    borderRadius: '4px',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      border: '3px solid #334155',
                      borderTopColor: '#38BDF8',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    <span style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: 600 }}>
                      Loading {activeStudent.name}'s uploaded resume PDF...
                    </span>
                  </div>
                )}

                {/* PDF Paper Container with Privacy Masking Overlay & Interactive Canvas */}
                <div
                  ref={canvasContainerRef}
                  className="pdf-page-container"
                  onClick={handleCanvasClick}
                  title="Click anywhere on the resume to drop an annotation pin"
                  style={{
                    position: 'relative',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
                    borderRadius: '4px',
                    background: '#FFFFFF',
                    cursor: 'crosshair',
                    userSelect: 'none'
                  }}
                >
                  <canvas ref={canvasRef} style={{ display: 'block', borderRadius: '4px' }} />

                  {/* Privacy Redaction Layer: White Frosted Blur, No Black Boxes, No Text */}
                  {privacyMasks.map(mask => (
                    <div
                      key={mask.id}
                      className="privacy-mask-frosted"
                      title="Personal contact detail is protected in volunteer review."
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
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
                        zIndex: 10,
                        pointerEvents: 'none'
                      }}
                    />
                  ))}

                  {/* Inline Review Action: [✎ Add Note] directly on the PDF Viewer for each detected section */}
                  {detectedSections.map(sec => {
                    const sectionNotes = volunteerSubtopics.filter(sub => 
                      sub.sectionKey === sec.key || sub.title.toLowerCase().includes(sec.title.toLowerCase())
                    );

                    return (
                      <div
                        key={sec.id}
                        className="pdf-inline-section-action"
                        style={{
                          position: 'absolute',
                          left: `${sec.pixelRight + 12}px`,
                          top: `${Math.max(4, sec.pixelTop - 2)}px`,
                          zIndex: 16,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="btn-pdf-add-note"
                          onClick={() => {
                            setSelectedSectionKey(sec.key);
                            setNewSubtopicTitle(sec.title);
                            setActivePin({ page: activeResumePage, x: sec.pdfX, y: sec.pdfY });
                            setInlinePopoverSection(sec);
                            setIsDefiningSubtopic(true);
                          }}
                          title={`Add review note directly to ${sec.title}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: '#FFFFFF',
                            color: '#0F172A',
                            border: '1.5px solid #CBD5E1',
                            borderRadius: '6px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.12)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ color: '#D97706' }}>✎</span>
                          <span>Add Note</span>
                        </button>

                        {sectionNotes.length > 0 && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              background: '#FEF3C7',
                              color: '#B45309',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              border: '1px solid #FDE68A'
                            }}
                          >
                            {sectionNotes.length} note{sectionNotes.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {/* Active Dropped Pin Marker */}
                  {activePin && activePin.page === activeResumePage && (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${activePin.x}%`,
                        top: `${activePin.y}%`,
                        transform: 'translate(-50%, -100%)',
                        zIndex: 15,
                        pointerEvents: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{
                        background: '#F59E0B',
                        color: '#0F172A',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 800,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        whiteSpace: 'nowrap'
                      }}>
                        📍 New Note
                      </div>
                      <div style={{
                        width: 0,
                        height: 0,
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderTop: '6px solid #F59E0B'
                      }} />
                    </div>
                  )}

                  {/* Inline Popover / Comment Box directly on PDF viewer */}
                  {isDefiningSubtopic && (
                    <div
                      className="pdf-inline-popover-overlay"
                      style={{
                        position: isMobileDevice ? 'fixed' : 'absolute',
                        inset: isMobileDevice ? 0 : undefined,
                        background: isMobileDevice ? 'rgba(15, 23, 42, 0.55)' : undefined,
                        left: isMobileDevice ? 0 : `${Math.min(Math.max(12, (inlinePopoverSection?.pixelLeft || 30)), (canvasRef.current?.width || 600) - 340)}px`,
                        top: isMobileDevice ? undefined : `${(inlinePopoverSection?.pixelTop || 100) + 32}px`,
                        bottom: isMobileDevice ? 0 : undefined,
                        zIndex: 100,
                        display: 'flex',
                        alignItems: isMobileDevice ? 'flex-end' : 'flex-start',
                        justifyContent: isMobileDevice ? 'center' : 'flex-start'
                      }}
                      onClick={(e) => {
                        if (e.target === e.currentTarget && isMobileDevice) {
                          setIsDefiningSubtopic(false);
                          setInlinePopoverSection(null);
                          setActivePin(null);
                        }
                      }}
                    >
                      <div
                        className="pdf-inline-popover-card"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: isMobileDevice ? '100%' : '330px',
                          maxWidth: isMobileDevice ? '100%' : '350px',
                          background: '#FFFFFF',
                          borderRadius: isMobileDevice ? '16px 16px 0 0' : '10px',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                          border: '1px solid #E2E8F0',
                          padding: '14px 16px',
                          animation: 'fadeIn 0.2s ease-out'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                              {newSubtopicTitle || 'Section Note'}
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                              (Page {activeResumePage})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsDefiningSubtopic(false);
                              setInlinePopoverSection(null);
                              setActivePin(null);
                            }}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#94A3B8' }}
                          >
                            ✕
                          </button>
                        </div>

                        {/* Category Pills: Suggestion, Must Fix, Praise, Question */}
                        <div className="category-pill-group" style={{ marginBottom: '10px' }}>
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

                        {/* Comment text area */}
                        <textarea
                          className="feedback-textarea"
                          style={{
                            width: '100%',
                            minHeight: '75px',
                            fontSize: '12.5px',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            marginBottom: '10px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                          placeholder="Write note/feedback for this section..."
                          value={newCommandText}
                          onChange={(e) => setNewCommandText(e.target.value)}
                          autoFocus
                        />

                        {/* Action buttons: Cancel and Save */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              setIsDefiningSubtopic(false);
                              setInlinePopoverSection(null);
                              setActivePin(null);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              if (!newCommandText.trim() && !newSubtopicTitle.trim()) return;
                              const title = newSubtopicTitle.trim() || 'Section Note';
                              let finalCommand = newCommandText.trim();
                              if (activePin) {
                                finalCommand = `${finalCommand ? finalCommand + '\n' : ''}[Annotation Pin: Page ${activePin.page} at (${activePin.x}%, ${activePin.y}%)]`;
                              }
                              addVolunteerSubtopic(title, selectedSectionKey || 'custom', finalCommand, newCategory);
                              setNewCommandText('');
                              setIsDefiningSubtopic(false);
                              setInlinePopoverSection(null);
                              setActivePin(null);
                            }}
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Render saved subtopic notes on the active PDF page */}
                  {volunteerSubtopics.map(sub => {
                    const pinMatch = sub.command?.match(/\[Annotation Pin:\s*Page\s*(\d+)\s*at\s*\((\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)\]/);
                    let pinPage = pinMatch ? parseInt(pinMatch[1], 10) : null;
                    let pinX = pinMatch ? parseFloat(pinMatch[2]) : null;
                    let pinY = pinMatch ? parseFloat(pinMatch[3]) : null;

                    if (!pinMatch) {
                      const sec = detectedSections.find(s => s.key === sub.sectionKey || sub.title.toLowerCase().includes(s.title.toLowerCase()));
                      if (sec && sec.page === activeResumePage) {
                        pinPage = activeResumePage;
                        pinX = sec.pdfX;
                        pinY = sec.pdfY;
                      }
                    }

                    if (pinPage !== activeResumePage || pinX === null || pinY === null) return null;

                    const cat = sub.category || 'suggestion';
                    const catColor = cat === 'must_fix' ? '#DC2626' : cat === 'praise' ? '#16A34A' : cat === 'question' ? '#2563EB' : '#D97706';
                    const catBg = cat === 'must_fix' ? '#FEF2F2' : cat === 'praise' ? '#F0FDF4' : cat === 'question' ? '#EFF6FF' : '#FFFBEB';

                    return (
                      <div
                        key={`pdf-sub-${sub.id}`}
                        className="pdf-saved-note-badge"
                        style={{
                          position: 'absolute',
                          left: `${pinX}%`,
                          top: `${pinY}%`,
                          transform: 'translate(0, -50%)',
                          zIndex: 15,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: catBg,
                          border: `1px solid ${catColor}`,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          color: catColor,
                          cursor: 'pointer',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`[${sub.title}] (${cat.toUpperCase()}):\n\n${sub.command || 'No comment'}`);
                        }}
                        title={`${sub.title}: ${sub.command || ''} (Click to view)`}
                      >
                        <span>{cat === 'must_fix' ? '⚠️' : cat === 'praise' ? '🌟' : cat === 'question' ? '❓' : '💡'}</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Pane: Review & Feedback Panel (Preserving All Review Tools) */}
        <aside className="review-feedback-pane" style={{ flex: 1, minWidth: '380px', maxWidth: '480px', borderLeft: '1px solid var(--border-color)' }}>
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

          {/* 5 Feedback Tabs */}
          <div className="commenting-tools-tabs" role="tablist" aria-label="Volunteer Feedback Options">
            <button 
              type="button"
              className={`comment-tool-tab ${activeCommentTool === 'sections' ? 'active' : ''}`}
              onClick={() => setActiveCommentTool('sections')}
              title="Section commands with severity tags & highlights"
            >
              <span className="tab-icon">✍️</span>
              <span className="tab-label">Section Notes</span>
              <span className="tab-count-pill">{volunteerSubtopics.length}</span>
            </button>

            <button 
              type="button"
              className={`comment-tool-tab ${activeCommentTool === 'mentor_audit' ? 'active' : ''}`}
              onClick={() => setActiveCommentTool('mentor_audit')}
              title="4-Stage Mentor Audit"
            >
              <span className="tab-icon">✨</span>
              <span className="tab-label">Mentor Audit</span>
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
              title="Record up to 5-10 minute voice feedback"
            >
              <span className="tab-icon">🎙️</span>
              <span className="tab-label">Voice Memo</span>
            </button>

            <button 
              type="button"
              className={`comment-tool-tab ${activeCommentTool === 'rubric' ? 'active' : ''}`}
              onClick={() => setActiveCommentTool('rubric')}
              title="Evaluate ATS, Impact, Tech Depth & Clarity"
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
                  Section Commands & Notes
                </span>
                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                  onClick={() => setIsDefiningSubtopic(!isDefiningSubtopic)}
                >
                  {isDefiningSubtopic ? 'Cancel' : '+ Add Note'}
                </button>
              </div>

              {/* Define Subtopic Form */}
              {isDefiningSubtopic && (
                <form onSubmit={handleAddSubtopic} className="define-subtopic-box">
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#854D0E', marginBottom: '6px' }}>
                    Define Note & Assign Feedback Category:
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

                  {/* Quick Section Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', width: '100%' }}>
                      Target Section:
                    </span>
                    {standardSections.map(sec => (
                      <button 
                        type="button" 
                        key={sec.key}
                        className={`suggested-section-chip ${selectedSectionKey === sec.key ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedSectionKey(sec.key);
                          setNewSubtopicTitle(sec.title);
                        }}
                        style={{
                          background: selectedSectionKey === sec.key ? '#FEF08A' : '#F1F5F9',
                          borderColor: selectedSectionKey === sec.key ? '#EAB308' : '#CBD5E1'
                        }}
                      >
                        {sec.title}
                      </button>
                    ))}
                  </div>

                  <input 
                    type="text"
                    className="search-field"
                    style={{ height: '36px', marginBottom: '8px', fontSize: '13px' }}
                    placeholder="Note title (e.g. Technical Stack, Project Impact)..."
                    value={newSubtopicTitle}
                    onChange={(e) => setNewSubtopicTitle(e.target.value)}
                    autoFocus
                  />

                  <textarea 
                    className="feedback-textarea"
                    style={{ minHeight: '60px', marginBottom: '8px', fontSize: '12px', padding: '8px' }}
                    placeholder="Write detailed comment or actionable guidance for student..."
                    value={newCommandText}
                    onChange={(e) => setNewCommandText(e.target.value)}
                  />

                  {activePin && (
                    <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600, marginBottom: '8px' }}>
                      📍 Attached to Page {activePin.page} at ({activePin.x}%, {activePin.y}%)
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setIsDefiningSubtopic(false);
                        setActivePin(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Save Note
                    </button>
                  </div>
                </form>
              )}

              {/* Subtopics List */}
              <div className="section-checklist">
                {volunteerSubtopics.length === 0 ? (
                  <div className="no-subtopics-placeholder" style={{ padding: '24px', textAlign: 'center', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                    <p style={{ fontWeight: 600, color: '#64748B' }}>No review notes added yet.</p>
                    <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                      Click <strong>"+ Add Note"</strong> or click directly on the resume to annotate!
                    </p>
                  </div>
                ) : (
                  volunteerSubtopics.map(sub => {
                    const isActive = activeHighlightSection === sub.sectionKey;
                    const cat = sub.category || 'suggestion';
                    const isEditing = editingSubtopicId === sub.id;

                    return (
                      <div key={sub.id} className="volunteer-subtopic-card" style={{ marginBottom: '10px' }}>
                        {/* Header Row */}
                        <div 
                          className={`subtopic-card-header ${isActive ? 'active' : ''}`}
                          style={{ cursor: 'pointer', padding: '10px 12px' }}
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
                            <span className="subtopic-card-title" style={{ fontWeight: 700 }}>{sub.title}</span>
                            <span className={`subtopic-badge badge-${cat}`}>
                              {cat === 'must_fix' ? '⚠️ Must Fix' : cat === 'praise' ? '🌟 Praise' : cat === 'question' ? '❓ Question' : '💡 Suggestion'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button 
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ padding: '2px 6px', fontSize: '11px', height: 'auto' }}
                              onClick={() => handleStartEditSubtopic(sub)}
                              title="Edit note"
                            >
                              <Edit3 size={11} />
                            </button>
                            <button 
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ padding: '2px 6px', fontSize: '11px', height: 'auto', color: '#EF4444' }}
                              onClick={() => removeVolunteerSubtopic(sub.id)}
                              title="Delete note"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>

                        {/* Note / Command Body */}
                        <div style={{ padding: '8px 12px', background: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
                          {isEditing ? (
                            <div>
                              <textarea
                                className="feedback-textarea"
                                style={{ minHeight: '52px', fontSize: '12px', padding: '6px', marginBottom: '6px' }}
                                value={editingCommandText}
                                onChange={(e) => setEditingCommandText(e.target.value)}
                              />
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                                <button 
                                  type="button" 
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '2px 8px', fontSize: '11px' }}
                                  onClick={() => setEditingSubtopicId(null)}
                                >
                                  Cancel
                                </button>
                                <button 
                                  type="button" 
                                  className="btn btn-primary btn-sm"
                                  style={{ padding: '2px 8px', fontSize: '11px' }}
                                  onClick={() => handleSaveEditSubtopic(sub.id)}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p style={{ margin: 0, fontSize: '12.5px', color: '#334155', whiteSpace: 'pre-wrap' }}>
                              {sub.command || 'No comment added yet.'}
                            </p>
                          )}

                          {sub.suggestedRewrite && (
                            <div style={{ marginTop: '6px', padding: '6px 8px', background: '#F0FDF4', borderRadius: '4px', border: '1px solid #BBF7D0', fontSize: '11.5px' }}>
                              <span style={{ fontWeight: 700, color: '#166534' }}>Suggested Rewrite:</span>
                              <div style={{ color: '#15803D', marginTop: '2px' }}>"{sub.suggestedRewrite.after}"</div>
                            </div>
                          )}

                          {sub.audioNote?.recorded && (
                            <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#047857' }}>
                              <Mic size={12} />
                              <span>Audio note attached ({sub.audioNote.duration})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* =========================================================================
              METHOD 2: 4-STAGE GUIDED MENTOR AUDIT
             ========================================================================= */}
          {activeCommentTool === 'mentor_audit' && (
            <div className="mentor-audit-box">
              <div style={{ marginBottom: '14px' }}>
                <span className="review-section-label">4-Stage Guided Mentor Audit</span>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '3px' }}>
                  Systematic audit evaluating layout scan, technical depth, interview questions, and 7-day action plan.
                </p>
              </div>

              {/* Audit Stage Tabs */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[1, 2, 3, 4].map((stage) => (
                  <button
                    type="button"
                    key={stage}
                    className={`btn btn-sm ${currentAuditStage === stage ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, padding: '4px', fontSize: '11.5px' }}
                    onClick={() => setCurrentAuditStage(stage as any)}
                  >
                    Stage {stage}
                  </button>
                ))}
              </div>

              {/* Stage 1 */}
              {currentAuditStage === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>
                    Stage 1: 6-Second First Glance
                  </div>
                  <div className="category-pill-group">
                    <button 
                      type="button"
                      className={`cat-select-btn ${auditStage1.verdict === 'clean' ? 'active cat-praise' : ''}`}
                      onClick={() => setAuditStage1({ ...auditStage1, verdict: 'clean' })}
                    >
                      🌟 Clean & Clear
                    </button>
                    <button 
                      type="button"
                      className={`cat-select-btn ${auditStage1.verdict === 'slightly_cluttered' ? 'active cat-suggestion' : ''}`}
                      onClick={() => setAuditStage1({ ...auditStage1, verdict: 'slightly_cluttered' })}
                    >
                      💡 Needs Spacing
                    </button>
                    <button 
                      type="button"
                      className={`cat-select-btn ${auditStage1.verdict === 'dense' ? 'active cat-must_fix' : ''}`}
                      onClick={() => setAuditStage1({ ...auditStage1, verdict: 'dense' })}
                    >
                      ⚠️ Dense Layout
                    </button>
                  </div>
                  <textarea
                    className="feedback-textarea"
                    style={{ minHeight: '60px', fontSize: '12px' }}
                    value={auditStage1.notes}
                    onChange={(e) => setAuditStage1({ ...auditStage1, notes: e.target.value })}
                    placeholder="Scan notes regarding contact info, spacing, margins..."
                  />
                </div>
              )}

              {/* Stage 2 */}
              {currentAuditStage === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>
                    Stage 2: Technical Depth & Authenticity
                  </div>
                  <input
                    type="text"
                    className="search-field"
                    style={{ height: '34px', fontSize: '12px' }}
                    value={auditStage2.selectedProject}
                    onChange={(e) => setAuditStage2({ ...auditStage2, selectedProject: e.target.value })}
                    placeholder="Project Name..."
                  />
                  <textarea
                    className="feedback-textarea"
                    style={{ minHeight: '60px', fontSize: '12px' }}
                    value={auditStage2.challengeNotes}
                    onChange={(e) => setAuditStage2({ ...auditStage2, challengeNotes: e.target.value })}
                    placeholder="Describe how technical challenges, concurrency, or scale were solved..."
                  />
                </div>
              )}

              {/* Stage 3 */}
              {currentAuditStage === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>
                    Stage 3: Interview Defense Question
                  </div>
                  <textarea
                    className="feedback-textarea"
                    style={{ minHeight: '52px', fontSize: '12px' }}
                    value={auditStage3.interviewQuestion}
                    onChange={(e) => setAuditStage3({ ...auditStage3, interviewQuestion: e.target.value })}
                    placeholder="Mock technical interview question..."
                  />
                  <textarea
                    className="feedback-textarea"
                    style={{ minHeight: '44px', fontSize: '12px' }}
                    value={auditStage3.prepTip}
                    onChange={(e) => setAuditStage3({ ...auditStage3, prepTip: e.target.value })}
                    placeholder="Mentoring answer tip..."
                  />
                </div>
              )}

              {/* Stage 4 */}
              {currentAuditStage === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>
                    Stage 4: 7-Day Action Plan
                  </div>
                  <input
                    type="text"
                    className="search-field"
                    style={{ height: '34px', fontSize: '12px' }}
                    value={auditStage4.task1}
                    onChange={(e) => setAuditStage4({ ...auditStage4, task1: e.target.value })}
                    placeholder="Task 1: Add impact metrics..."
                  />
                  <input
                    type="text"
                    className="search-field"
                    style={{ height: '34px', fontSize: '12px' }}
                    value={auditStage4.task2}
                    onChange={(e) => setAuditStage4({ ...auditStage4, task2: e.target.value })}
                    placeholder="Task 2: Categorize skills..."
                  />
                  <textarea
                    className="feedback-textarea"
                    style={{ minHeight: '44px', fontSize: '12px' }}
                    value={auditStage4.encouragement}
                    onChange={(e) => setAuditStage4({ ...auditStage4, encouragement: e.target.value })}
                    placeholder="Mentor encouragement note..."
                  />
                </div>
              )}

              {/* Apply Audit to Review */}
              <div style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={handleApplyAuditToReview}
                >
                  <Check size={14} /> Apply Audit to Review Notes
                </button>
                {auditAppliedSuccess && (
                  <div style={{ marginTop: '8px', color: '#047857', fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>
                    ✓ 4 Audit stages converted to review notes!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              METHOD 3: REWRITE SUGGESTION TOOL (BEFORE / AFTER)
             ========================================================================= */}
          {activeCommentTool === 'rewrite_diff' && (
            <div className="rewrite-tool-box">
              <span className="review-section-label">Rewrite Suggestion Tool</span>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 12px' }}>
                Propose an improved phrasing or strong action verb replacement for candidate bullet points.
              </p>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>Target Section</label>
                <select
                  className="search-field"
                  style={{ height: '34px', fontSize: '12px', marginTop: '3px' }}
                  value={rewriteTargetSection}
                  onChange={(e) => setRewriteTargetSection(e.target.value)}
                >
                  <option value="objective">Career Objective</option>
                  <option value="projects">Projects & Technical Work</option>
                  <option value="education">Education</option>
                  <option value="skills">Technical Skills</option>
                </select>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626' }}>Original Text (From Resume)</label>
                <textarea
                  className="feedback-textarea"
                  style={{ minHeight: '52px', fontSize: '12px', marginTop: '3px', background: '#FEF2F2', borderColor: '#FECACA' }}
                  value={rewriteOriginal}
                  onChange={(e) => setRewriteOriginal(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#047857' }}>Proposed Replacement (Rewritten)</label>
                <textarea
                  className="feedback-textarea"
                  style={{ minHeight: '60px', fontSize: '12px', marginTop: '3px', background: '#F0FDF4', borderColor: '#BBF7D0' }}
                  value={rewriteProposed}
                  onChange={(e) => setRewriteProposed(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                onClick={handleSaveRewriteSuggestion}
              >
                <Sparkles size={14} /> Attach Rewrite Suggestion
              </button>

              {rewriteSavedAlert && (
                <div style={{ marginTop: '8px', color: '#047857', fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>
                  ✓ Suggested rewrite attached to review notes!
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              METHOD 4: VOICE FEEDBACK RECORDER
             ========================================================================= */}
          {activeCommentTool === 'voice_memo' && (
            <div className="voice-memo-box">
              <span className="review-section-label">Voice Memo & Dictation</span>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 14px' }}>
                Record verbal feedback (up to 5 mins) to give personal coaching and encouragement.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '14px' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: isVoiceRecording ? '#DC2626' : '#1E293B', fontFamily: 'monospace', marginBottom: '12px' }}>
                  {formatVoiceTime(voiceSeconds)} / {formatVoiceTime(maxVoiceSeconds)}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {!isVoiceRecording ? (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      style={{ padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => setIsVoiceRecording(true)}
                    >
                      <Mic size={14} /> Start Recording
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => {
                        setIsVoiceRecording(false);
                        const duration = formatVoiceTime(voiceSeconds);
                        saveAudioNote({ recorded: true, duration, timestamp: 'Just now' });
                        alert('Voice memo saved to Overall Review!');
                      }}
                    >
                      <Square size={14} /> Stop & Save
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setIsVoiceRecording(false);
                      setVoiceSeconds(0);
                    }}
                  >
                    <RotateCcw size={13} /> Reset
                  </button>
                </div>
              </div>

              {activeStudent.audioNote?.recorded && (
                <div style={{ padding: '10px 12px', background: '#F0FDF4', borderRadius: '6px', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                    <Mic size={13} />
                    <span>Saved Audio Memo ({activeStudent.audioNote.duration})</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '2px 8px', fontSize: '11px', height: 'auto' }}
                    onClick={() => alert(`Playing voice memo (${activeStudent.audioNote?.duration})...`)}
                  >
                    <Play size={10} /> Play
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              METHOD 5: EVALUATION RUBRIC SCORECARD & OVERALL FEEDBACK
             ========================================================================= */}
          {activeCommentTool === 'rubric' && (
            <div className="rubric-scorecard-box">
              <span className="review-section-label">Candidate Evaluation Rubric</span>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 14px' }}>
                Score across 4 key hiring dimensions and assign overall star rating.
              </p>

              {/* 4 Rubric Dimensions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {[
                  { key: 'atsFormat', label: 'ATS Compatibility & Layout', val: rubricScores.atsFormat },
                  { key: 'metricsImpact', label: 'Impact & Quantified Metrics', val: rubricScores.metricsImpact },
                  { key: 'techDepth', label: 'Technical Stack Depth', val: rubricScores.techDepth },
                  { key: 'grammarClarity', label: 'Grammar, Action Verbs & Clarity', val: rubricScores.grammarClarity }
                ].map(r => (
                  <div key={r.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{r.label}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map(score => (
                        <button
                          key={score}
                          type="button"
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            border: '1px solid',
                            borderColor: r.val >= score ? '#EAB308' : '#CBD5E1',
                            background: r.val >= score ? '#FEF08A' : '#FFFFFF',
                            color: r.val >= score ? '#854D0E' : '#64748B',
                            fontWeight: 700,
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleRubricScoreChange(r.key as any, score)}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Rubric Score */}
              <div style={{ padding: '10px 14px', background: '#FEFCE8', borderRadius: '6px', border: '1px solid #FEF08A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#854D0E' }}>Overall Preparedness Score:</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#854D0E' }}>{calculateRubricOverall()}%</span>
              </div>

              {/* Star Rating */}
              <div className="review-rating-box" style={{ marginBottom: '14px' }}>
                <span className="review-section-label">Overall Star Rating:</span>
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                    >
                      <StarIcon size={22} filled={star <= (activeStudent.rating || 4)} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Improvement Tags */}
              <div className="improve-tags-box" style={{ marginBottom: '14px' }}>
                <span className="review-section-label">Areas to Improve:</span>
                <div className="improve-chips-wrap" style={{ marginTop: '6px' }}>
                  {improveTagOptions.map(tag => {
                    const isSelected = activeStudent.improveTags?.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
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
              <div className="review-feedback-box" style={{ marginBottom: '14px' }}>
                <span className="review-section-label">General Feedback for Student:</span>
                <textarea
                  className="feedback-textarea"
                  style={{ minHeight: '80px', marginTop: '4px' }}
                  value={activeStudent.generalFeedback || ''}
                  onChange={(e) => updateGeneralFeedback(e.target.value)}
                  placeholder="Summarize overall recommendations and career coaching advice..."
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                  onClick={handleInsertRubricSummary}
                >
                  Append Rubric to Notes
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => alert('Rubric and overall evaluation saved successfully!')}
                >
                  Save Feedback Draft
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
