import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { initialStudents, Student, VolunteerSubtopic, ResumeSection } from '../data/studentsData';
import { 
  ArrowLeftIcon, PdfIcon, DownloadIcon, MaximizeIcon, 
  StarRating
} from './Icons';
import { getResumeDownloadUrl, getResumeViewUrl, getResumeRawUrl } from '../services/zohoApi';
import { parseResumeFromPdfLines } from '../utils/pdfResumeParser';
import { ResumeComparisonView } from './ResumeComparisonView';
import { 
  GraduationCap, 
  Save, 
  Check, 
  FileText, 
  Edit3, 
  Sparkles, 
  RefreshCw, 
  X, 
  Circle, 
  AlertTriangle, 
  Lock,
  Download,
  Trash2,
  Mic,
  MessageSquare
} from 'lucide-react';
import { InlineReviewBox } from './InlineReviewBox';

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
    setSelectedStudentForViewId,
    updateStudentFromPdf
  } = useApp();

  // Mode: 'pdf_review' (Real original Zoho PDF with privacy masking & inline pencil actions) vs 'comparison' (Full side-by-side)
  const [workspaceMode, setWorkspaceMode] = useState<'pdf_review' | 'comparison'>('pdf_review');

  // PDF Loading & Rendering States
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [pdfTotalPages, setPdfTotalPages] = useState<number>(activeStudent?.totalPages || 1);
  const [privacyMasks, setPrivacyMasks] = useState<PrivacyMask[]>([]);
  const [detectedSections, setDetectedSections] = useState<DetectedPdfSection[]>([]);
  const [inlinePopoverSection, setInlinePopoverSection] = useState<DetectedPdfSection | null>(null);
  const [openInlineSectionKey, setOpenInlineSectionKey] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);
  const isMobileDevice = typeof window !== 'undefined' && window.innerWidth <= 640;

  // Canvas & PDF Task Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const pdfDocRef = useRef<any>(null);

  if (!activeStudent) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Student not found.</div>;
  }

  // Safe fallback to initial student data
  const initialStudentData = initialStudents.find(s => s.id === activeStudent.id) || initialStudents[0];
  const volunteerSubtopics = (activeStudent.volunteerSubtopics && activeStudent.volunteerSubtopics.length > 0)
    ? activeStudent.volunteerSubtopics
    : (initialStudentData.volunteerSubtopics || []);

  const resumeSections = (activeStudent.resumeSections && activeStudent.resumeSections.length > 0)
    ? activeStudent.resumeSections
    : (initialStudentData.resumeSections || []);

  // Resolve Real Uploaded Resume PDF URL from backend proxy (raw PDF stream for PDF.js)
  const resumePdfUrl = activeStudent.resumeAttachment 
    ? (activeStudent.resumeAttachment.startsWith('/') && !activeStudent.resumeAttachment.startsWith('/api')
        ? activeStudent.resumeAttachment
        : getResumeRawUrl(activeStudent.resumeAttachment, activeStudent.name))
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

        // Load PDF through backend proxy
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

        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
        const baseScale = isMobile ? 0.85 : 1.35;
        const currentScale = baseScale * (zoomLevel / 100);
        const viewport = page.getViewport({ scale: currentScale });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

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

        // Extract text for section detection & privacy masking
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

        // Dynamically parse actual sections and candidate details from the PDF
        const parsedPdfResume = parseResumeFromPdfLines(lines as any, activeStudent.name);
        if (parsedPdfResume.sections.length > 0) {
          updateStudentFromPdf(activeStudent.id, parsedPdfResume);
        }

        // 1. SECTION HEADING DETECTION DIRECTLY ON ACTUAL PDF
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

        // If no sections detected, add standard fallback pins at reasonable locations
        if (pageSections.length === 0) {
          pageSections.push(
            { id: 'sec-fallback-1', key: 'objective', title: 'Career Objective', page: safePageNum, pixelLeft: 40, pixelTop: 120, pixelRight: 160, pixelWidth: 120, pixelHeight: 20, pdfX: 10, pdfY: 15 },
            { id: 'sec-fallback-2', key: 'education', title: 'Education', page: safePageNum, pixelLeft: 40, pixelTop: 240, pixelRight: 140, pixelWidth: 100, pixelHeight: 20, pdfX: 10, pdfY: 28 },
            { id: 'sec-fallback-3', key: 'skills', title: 'Key Skills', page: safePageNum, pixelLeft: 40, pixelTop: 380, pixelRight: 140, pixelWidth: 100, pixelHeight: 20, pdfX: 10, pdfY: 45 },
            { id: 'sec-fallback-4', key: 'projects', title: 'Projects / Experience', page: safePageNum, pixelLeft: 40, pixelTop: 520, pixelRight: 180, pixelWidth: 140, pixelHeight: 20, pdfX: 10, pdfY: 62 }
          );
        }

        setDetectedSections(pageSections);

        // 2. PRIVACY MASKING: WHITE FROSTED BLUR FOR EMAIL, PHONE, ADDRESS & PHOTO
        const rawMasks: PrivacyMask[] = [];
        const emailRegex = /[A-Za-z0-9._%+-]+(?:\s*@\s*|\s*\[at\]\s*)[A-Za-z0-9.-]+\s*\.[A-Za-z]{2,}/i;
        const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}|\b[6-9]\d{4}[\s.-]?\d{5}\b|\b[6-9]\d{9}\b|\+91[\s-]?\d{10}/;
        const addressIndicatorRegex = /(?:permanent|current|residential|present|communication|postal)?\s*address[\s:]|\b(?:door|flat|plot|house|d[\s./-]?no|h[\s./-]?no)\b|\b(?:street|road|rd\.?|lane|nagar|colony|layout|salai|cross|main|kovil|temple|apt|apartment|block)\b|\b(?:chennai|coimbatore|madurai|trichy|salem|bangalore|bengaluru|hyderabad|mumbai|delhi|kolkata|pune|kerala|tamil\s*nadu|karnataka|andhra|india)\b|\b(?:pincode|pin\s*code|postal\s*code|pin[\s:-]*\d{6})\b|\b[1-9]\d{5}\b/i;

        const isAcademicHeading = (text: string) => {
          return /^(education|technical\s+skills|skills|projects|experience|certifications?|activities|declaration|career\s+objective|summary)\b/i.test(text.trim()) ||
            /\b(b\.?e|b\.?tech|b\.?sc|m\.?tech|m\.?ca|cgpa|percentage|hsc|sslc|cbse|autonomous|university|college|school|curriculum)\b/i.test(text);
        };

        lines.forEach(line => {
          if (isAcademicHeading(line.fullText)) return;

          // Email Masking
          if (emailRegex.test(line.fullText)) {
            const emailItems = line.items.filter(it => it.str.includes('@') || emailRegex.test(it.str) || /\.(com|in|org|edu|net)\b/i.test(it.str) || /email|mail/i.test(it.str));
            const targetItems = emailItems.length > 0 ? emailItems : line.items;
            const minX = Math.min(...targetItems.map(it => it.tx));
            const maxX = Math.max(...targetItems.map(it => it.tx + it.width));
            const minY = Math.min(...targetItems.map(it => it.ty));
            const maxY = Math.max(...targetItems.map(it => it.ty + it.height));

            const rect = viewport.convertToViewportRectangle([minX - 3, minY - 2, maxX + 3, maxY + 2]);
            rawMasks.push({
              id: `mask-email-${Math.round(minX)}-${Math.round(minY)}`,
              left: Math.round(Math.min(rect[0], rect[2])),
              top: Math.round(Math.min(rect[1], rect[3])),
              width: Math.round(Math.abs(rect[2] - rect[0])),
              height: Math.round(Math.abs(rect[3] - rect[1])),
              type: 'email',
              label: ''
            });
          }

          // Phone Masking
          if (phoneRegex.test(line.fullText)) {
            const phoneItems = line.items.filter(it => phoneRegex.test(it.str) || /\d{3,}/.test(it.str) || /\+91/i.test(it.str) || /phone|mobile|tel|contact/i.test(it.str));
            const targetItems = phoneItems.length > 0 ? phoneItems : line.items;
            const minX = Math.min(...targetItems.map(it => it.tx));
            const maxX = Math.max(...targetItems.map(it => it.tx + it.width));
            const minY = Math.min(...targetItems.map(it => it.ty));
            const maxY = Math.max(...targetItems.map(it => it.ty + it.height));

            const rect = viewport.convertToViewportRectangle([minX - 3, minY - 2, maxX + 3, maxY + 2]);
            rawMasks.push({
              id: `mask-phone-${Math.round(minX)}-${Math.round(minY)}`,
              left: Math.round(Math.min(rect[0], rect[2])),
              top: Math.round(Math.min(rect[1], rect[3])),
              width: Math.round(Math.abs(rect[2] - rect[0])),
              height: Math.round(Math.abs(rect[3] - rect[1])),
              type: 'phone',
              label: ''
            });
          }

          // Address Masking
          if (addressIndicatorRegex.test(line.fullText)) {
            const minX = Math.min(...line.items.map(it => it.tx));
            const maxX = Math.max(...line.items.map(it => it.tx + it.width));
            const minY = Math.min(...line.items.map(it => it.ty));
            const maxY = Math.max(...line.items.map(it => it.ty + it.height));

            const rect = viewport.convertToViewportRectangle([minX - 3, minY - 2, maxX + 3, maxY + 2]);
            rawMasks.push({
              id: `mask-addr-${Math.round(minX)}-${Math.round(minY)}`,
              left: Math.round(Math.min(rect[0], rect[2])),
              top: Math.round(Math.min(rect[1], rect[3])),
              width: Math.round(Math.abs(rect[2] - rect[0])),
              height: Math.round(Math.abs(rect[3] - rect[1])),
              type: 'address',
              label: ''
            });
          }
        });

        // Candidate photo scan / detection
        if (safePageNum === 1) {
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
                  break;
                }
              }
            }
          } catch (err) {
            console.warn('[Privacy Masking] Photo scan note:', err);
          }
        }

        setPrivacyMasks(rawMasks);
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
    <div className="workspace-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top Action Bar */}
      <header className="workspace-top-bar" style={{ flexShrink: 0 }}>
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

          {/* View Mode Toggle: Original PDF Review vs Side-by-Side Comparison */}
          <div className="workspace-view-mode-toggle" style={{ display: 'inline-flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px', border: '1px solid #E2E8F0', gap: '3px', marginLeft: '12px' }}>
            <button
              type="button"
              className={`mode-toggle-btn ${workspaceMode === 'pdf_review' ? 'active' : ''}`}
              onClick={() => setWorkspaceMode('pdf_review')}
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: workspaceMode === 'pdf_review' ? 700 : 600,
                background: workspaceMode === 'pdf_review' ? '#FFFFFF' : 'transparent',
                color: workspaceMode === 'pdf_review' ? '#0F172A' : '#64748B',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: workspaceMode === 'pdf_review' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <PdfIcon size={13} />
              <span>Original PDF Review</span>
            </button>
            <button
              type="button"
              className={`mode-toggle-btn ${workspaceMode === 'comparison' ? 'active' : ''}`}
              onClick={() => setWorkspaceMode('comparison')}
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: workspaceMode === 'comparison' ? 700 : 600,
                background: workspaceMode === 'comparison' ? '#FFFFFF' : 'transparent',
                color: workspaceMode === 'comparison' ? '#0F172A' : '#64748B',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: workspaceMode === 'comparison' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Sparkles size={13} />
              <span>Compare Resumes (v1 vs v2)</span>
            </button>
          </div>
        </div>

        <div className="workspace-top-actions">
          <button 
            type="button"
            className="toolbar-pencil-action-btn"
            onClick={() => setOpenInlineSectionKey(openInlineSectionKey === 'overall' ? null : 'overall')}
            title="Open Overall Review Notes & Scoring Box"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: openInlineSectionKey === 'overall' ? '#FDE047' : '#FEF08A',
              color: '#854D0E',
              border: '1px solid #FACC15',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <Edit3 size={13} />
            <span>{openInlineSectionKey === 'overall' ? 'Close Score & Note' : 'Overall Score & Note'}</span>
          </button>

          <button 
            className="btn btn-outline btn-sm"
            onClick={() => {
              setSelectedStudentForViewId(activeStudent.id);
              setActiveRole('student');
            }}
            title="Preview how student sees the highlighted feedback"
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
            onClick={() => alert('Review comments saved successfully!')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <Save size={13} />
            <span>Save Draft</span>
          </button>
        </div>
      </header>

      {/* Main Content Area: EITHER Resume Comparison View OR Original Masked PDF Review (NO SIDEBAR!) */}
      {workspaceMode === 'comparison' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ResumeComparisonView isVolunteerView={true} />
        </div>
      ) : (
        <div className="workspace-dual-pane" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <section className="resume-viewer-pane" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', background: '#0F172A' }}>
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

            {/* Real PDF Scroll Canvas with Pencil Action Overlays on Sections */}
            <div 
              className="resume-scroll-canvas" 
              style={{ 
                flex: 1, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'flex-start', 
                overflow: 'auto', 
                padding: '24px 16px', 
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
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '60px' }}>
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
                        Loading {activeStudent.name}'s uploaded resume from Zoho Creator...
                      </span>
                    </div>
                  )}

                  {/* Real PDF Canvas Container with Privacy Masking & Section Pencil Buttons */}
                  <div
                    ref={canvasContainerRef}
                    className="pdf-page-container"
                    style={{
                      position: 'relative',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
                      borderRadius: '4px',
                      background: '#FFFFFF',
                      userSelect: 'none'
                    }}
                  >
                    <canvas ref={canvasRef} style={{ display: 'block', borderRadius: '4px' }} />

                    {/* Privacy Redaction Layer: White Frosted Blur */}
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

                    {/* Interactive Pencil Icon Action Buttons for Each Subsection on the PDF */}
                    {detectedSections.map(sec => {
                      const sectionNotes = volunteerSubtopics.filter(sub => 
                        sub.sectionKey === sec.key || (sub.title && sub.title.toLowerCase().includes(sec.title.toLowerCase()))
                      );
                      const isHighlighted = sectionNotes.length > 0;

                      return (
                        <div
                          key={sec.id}
                          className="pdf-inline-section-action"
                          style={{
                            position: 'absolute',
                            left: `${Math.min(sec.pixelRight + 12, (canvasRef.current?.width || 600) - 120)}px`,
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
                            className={`section-pencil-btn ${openInlineSectionKey === sec.key ? 'is-active-open' : ''} ${isHighlighted ? 'has-notes' : ''}`}
                            onClick={() => {
                              setInlinePopoverSection(sec);
                              setOpenInlineSectionKey(openInlineSectionKey === sec.key ? null : sec.key);
                            }}
                            title={`Click pencil to give volunteer review comments on ${sec.title}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 10px',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              background: isHighlighted ? '#EFF6FF' : '#FFFFFF',
                              color: isHighlighted ? '#1D4ED8' : '#0F172A',
                              border: isHighlighted ? '1.5px solid #93C5FD' : '1.5px solid #CBD5E1',
                              borderRadius: '6px',
                              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <Edit3 size={12} color={isHighlighted ? '#2563EB' : '#D97706'} />
                            <span>{isHighlighted ? 'Edit Note' : 'Add Note'}</span>
                          </button>

                          {isHighlighted && (
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 800,
                                background: '#FEF3C7',
                                color: '#B45309',
                                padding: '2px 7px',
                                borderRadius: '10px',
                                border: '1px solid #FDE68A',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }}
                            >
                              ● {sectionNotes[0].category === 'must_fix' ? 'Must Fix' : sectionNotes[0].category === 'praise' ? 'Praise' : 'Note'}
                            </span>
                          )}
                        </div>
                      );
                    })}

                    {/* Inline Comment Box Dialog Popover positioned directly on the chosen section */}
                    {openInlineSectionKey && (
                      <div
                        className="pdf-inline-review-popover"
                        style={{
                          position: 'absolute',
                          left: openInlineSectionKey === 'overall' ? '50%' : `${Math.min(Math.max(12, (inlinePopoverSection?.pixelLeft || 30)), (canvasRef.current?.width || 600) - 380)}px`,
                          top: openInlineSectionKey === 'overall' ? '80px' : `${(inlinePopoverSection?.pixelTop || 100) + 36}px`,
                          transform: openInlineSectionKey === 'overall' ? 'translateX(-50%)' : 'none',
                          zIndex: 100,
                          width: '380px',
                          maxWidth: '92vw',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '1.5px solid #CBD5E1',
                          background: '#FFFFFF'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <InlineReviewBox
                          sectionKey={openInlineSectionKey}
                          sectionTitle={openInlineSectionKey === 'overall' ? 'Overall Profile & Scoring' : (inlinePopoverSection?.title || 'Section Note')}
                          onClose={() => setOpenInlineSectionKey(null)}
                          activeStudent={activeStudent}
                          resumeSections={resumeSections}
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
                            setOpenInlineSectionKey(null);
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
                            setOpenInlineSectionKey(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
