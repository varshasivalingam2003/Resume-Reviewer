import { Student } from '../data/studentsData';

export interface PrivacyMask {
  id: string;
  leftPercent: number;
  topPercent: number;
  widthPercent: number;
  heightPercent: number;
  type: 'photo' | 'name' | 'email' | 'phone' | 'address' | 'profile';
  label: string;
}

export interface DetectedPdfSection {
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

interface RawTextItem {
  str: string;
  tx: number;
  ty: number;
  width: number;
  height: number;
}

interface TextLine {
  ty: number;
  items: RawTextItem[];
  fullText: string;
  minTx: number;
  maxTx: number;
  height: number;
}

interface ColSegment {
  items: RawTextItem[];
  minTx: number;
  maxTx: number;
  segText: string;
}

// Split items on a single line into column segments separated by gaps > 18pt
function getColSegments(lineItems: RawTextItem[]): ColSegment[] {
  const sorted = [...lineItems].sort((a, b) => a.tx - b.tx);
  const segs: ColSegment[] = [];
  let cur: RawTextItem[] = [];

  sorted.forEach((it, i) => {
    if (i === 0) {
      cur.push(it);
      return;
    }
    const prev = sorted[i - 1];
    const gap = it.tx - (prev.tx + prev.width);
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
}

// Collect items in a line falling into a specific column range
function itemsInCol(lineItems: RawTextItem[], colMinX: number, colMaxX: number): RawTextItem[] {
  const colMid = (colMinX + colMaxX) / 2;
  const colHalf = (colMaxX - colMinX) / 2 + 20;
  return lineItems.filter(it => {
    const itMid = it.tx + it.width / 2;
    return Math.abs(itMid - colMid) <= colHalf;
  });
}

// Guard against masking academic section headings and core academic text
function isAcademicHeadingText(text: string): boolean {
  const trimmed = text.trim();
  return (
    /^(education|technical\s+skills|skills|projects|experience|work\s+experience|internships?|certifications?|activities|declaration|career\s+objective|summary|profile|academic\s+highlights|coursework)\b/i.test(trimmed) ||
    /\b(b\.e\.|b\.tech|b\.sc|m\.tech|m\.ca|bca|mca|b\.com|bba|mba|bachelor|master|cgpa|percentage|gpa|hsc|sslc|cbse|autonomous|curriculum|college|university|institute|school|department|technolog|developer|engineer|ngo|pvt|ltd)\b/i.test(text)
  );
}

// Check non-personal section headers to avoid expanding address masks into them
function isSectionBoundary(text: string): boolean {
  return /^(profile|summary|about\s+me|career\s+objective|objective|education|technical\s+skills|skills|projects?|experience|internship|certifications?|activities|languages?|achievements?|declaration|academic\s+highlights|coursework)\b/i.test(
    text.trim()
  );
}

// Helper to detect candidate profile photo / headshot using PDF.js operator list on Page 1
async function detectProfilePhotoMasks(
  page: any,
  viewport: any,
  pageH: number,
  pageW: number,
  canvasW: number,
  canvasH: number
): Promise<PrivacyMask[]> {
  const photoMasks: PrivacyMask[] = [];
  try {
    const ops = await page.getOperatorList();
    const pdfjs = (window as any).pdfjsLib;
    const paintImageXObject = pdfjs?.OPS?.paintImageXObject || 85;
    const paintInlineImageXObject = pdfjs?.OPS?.paintInlineImageXObject || 86;
    const paintImageMaskXObject = pdfjs?.OPS?.paintImageMaskXObject || 87;
    const transformOp = pdfjs?.OPS?.transform || 14;
    const saveOp = pdfjs?.OPS?.save || 10;
    const restoreOp = pdfjs?.OPS?.restore || 11;

    const imageOps = new Set([paintImageXObject, paintInlineImageXObject, paintImageMaskXObject]);

    let ctm = [1, 0, 0, 1, 0, 0];
    const ctmStack: number[][] = [];

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
      } else if (imageOps.has(fn)) {
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
        // Located in upper region of page 1, dimensions between 24pt and 280pt, headshot aspect ratio
        const isTopArea = maxY > pageH * 0.35 && minY > pageH * 0.15;
        const isPhotoDimensions = imgW >= 24 && imgW <= 280 && imgH >= 24 && imgH <= 280 && imgW < pageW * 0.55;
        const aspect = imgW / (imgH || 1);
        const isHeadshotAspect = aspect >= 0.45 && aspect <= 2.2;

        if (isTopArea && isPhotoDimensions && isHeadshotAspect) {
          const rect = viewport.convertToViewportRectangle([minX, minY, maxX, maxY]);
          const leftPx = Math.min(rect[0], rect[2]) - 4;
          const topPx = Math.min(rect[1], rect[3]) - 2;
          const widthPx = Math.abs(rect[2] - rect[0]) + 8;
          const heightPx = Math.abs(rect[3] - rect[1]) + 4;

          photoMasks.push({
            id: `mask-photo-${Math.round(minX)}-${Math.round(minY)}`,
            leftPercent: Math.max(0, (leftPx / canvasW) * 100),
            topPercent: Math.max(0, (topPx / canvasH) * 100),
            widthPercent: Math.min(100, (widthPx / canvasW) * 100),
            heightPercent: Math.min(100, (heightPx / canvasH) * 100),
            type: 'photo',
            label: ''
          });
          break;
        }
      }
    }
  } catch (err) {
    console.warn('[Privacy Masking] Operator list image scan note:', err);
  }
  return photoMasks;
}

/**
 * Extracts privacy masks and section coordinates from a PDF.js page
 */
export async function extractPrivacyMasksAndSections(
  page: any,
  viewport: any,
  activeStudent: Student | null,
  safePageNum: number
): Promise<{
  privacyMasks: PrivacyMask[];
  detectedSections: DetectedPdfSection[];
  isScannedPdf: boolean;
}> {
  const canvasW = viewport.width || 1;
  const canvasH = viewport.height || 1;
  const pageH = viewport.viewBox ? viewport.viewBox[3] : 842;
  const pageW = viewport.viewBox ? viewport.viewBox[2] : 595;

  const textContent = await page.getTextContent();
  const rawItems: RawTextItem[] = [];

  (textContent.items || []).forEach((item: any) => {
    if (!item.str || typeof item.str !== 'string') return;
    const str = item.str;
    const tx = item.transform[4];
    const ty = item.transform[5];
    const width = Math.max(item.width, 4);
    const height = Math.max(item.height || Math.abs(item.transform[3]) || 12, 12);
    rawItems.push({ str, tx, ty, width, height });
  });

  // If text layer is completely empty, PDF is scanned/image-based
  if (rawItems.length === 0) {
    let photoMasks: PrivacyMask[] = [];
    if (safePageNum === 1) {
      photoMasks = await detectProfilePhotoMasks(page, viewport, pageH, pageW, canvasW, canvasH);
    }
    return {
      privacyMasks: photoMasks,
      detectedSections: [],
      isScannedPdf: true
    };
  }

  // Cluster raw items into horizontal lines (by Y coordinate)
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

  // 1. SECTION HEADING DETECTION
  const sectionDefs: { regex: RegExp; key: string; title: string }[] = [
    { regex: /^(career\s+)?objective\b|^professional\s+summary\b|^summary\b|^about\s+me\b|^profile\b/i, key: 'objective', title: 'Career Objective' },
    { regex: /^technical\s+skills\b|^skills(\s+(&|and)\s+abilities)?\b|^core\s+competencies\b|^key\s+skills\b/i, key: 'skills', title: 'Technical Skills' },
    { regex: /^education(\s+(&|and)\s+academics)?\b|^academic\s+qualifications?\b|^academic\s+background\b/i, key: 'education', title: 'Education' },
    { regex: /^(academic\s+|key\s+|personal\s+)?projects\b/i, key: 'projects', title: 'Projects' },
    { regex: /^(work\s+)?experience\b|^internships?\b|^employment\s+history\b/i, key: 'experience', title: 'Experience' },
    { regex: /^certifications?\b|^certificates?\b|^achievements?\b|^awards(\s+(&|and)\s+honors)?\b/i, key: 'certifications', title: 'Certifications' },
    { regex: /^(extra[\s-]?)?curricular(\s+activities)?\b|^activities\b|^co[\s-]curricular\b/i, key: 'activities', title: 'Activities' },
    { regex: /^interests?(\s+(&|and)\s+hobbies)?\b|^hobbies\b/i, key: 'interests', title: 'Interests & Hobbies' },
    { regex: /^declaration\b/i, key: 'declaration', title: 'Declaration' }
  ];

  const detectedSections: DetectedPdfSection[] = [];
  const seenSectionKeys = new Set<string>();

  lines.forEach(line => {
    const text = line.fullText.trim();
    if (!text || text.length > 45) return;
    if (line.minTx > 420) return;

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
        const width = Math.abs(rect[2] - rect[0]);
        const height = Math.abs(rect[3] - rect[1]);

        const canvasW = viewport.width || 1;
        const canvasH = viewport.height || 1;
        const pdfX = Math.round((left / canvasW) * 100);
        const pdfY = Math.round((top / canvasH) * 100);

        detectedSections.push({
          id: `sec-${safePageNum}-${def.key}`,
          key: def.key,
          title: def.title,
          page: safePageNum,
          pixelLeft: Math.round(left),
          pixelTop: Math.round(top),
          pixelRight: Math.round(left + width),
          pixelWidth: Math.round(width),
          pixelHeight: Math.round(height),
          pdfX,
          pdfY
        });
        break;
      }
    }
  });

  // Identify the boundary of the first academic or professional section on this page
  let firstAcademicSectionTy = -1;
  for (const line of lines) {
    const text = line.fullText.trim();
    if (
      isSectionBoundary(text) &&
      !/^(profile|summary|about\s+me|career\s+objective|objective|personal\s+details|personal\s+information|contact)/i.test(text)
    ) {
      firstAcademicSectionTy = line.ty;
      break;
    }
  }

  // 2. PRIVACY MASKING FOR SENSITIVE PERSONAL DETAILS (ONLY photo, email, phone, address)
  const rawMasks: PrivacyMask[] = [];

  const studentEmail = (activeStudent?.email || '').trim().toLowerCase();
  const studentPhoneClean = (activeStudent?.phone || '').replace(/\D/g, '');

  const emailRegex = /\b[A-Za-z0-9._%+-]+(?:\s*@\s*|\s*\[at\]\s*)[A-Za-z0-9.-]+\s*\.[A-Za-z]{2,}\b/i;
  const phoneIndicatorRegex = /(?:phone|mobile|mob|tel|call|contact|ph)[\s.:]/i;

  // Helper to convert PDF rectangle into percentage-based PrivacyMask
  const pushMaskFromRect = (minTx: number, minTy: number, maxTx: number, maxTy: number, type: PrivacyMask['type'], idPrefix: string) => {
    const rect = viewport.convertToViewportRectangle([minTx, minTy, maxTx, maxTy]);
    const leftPx = Math.min(rect[0], rect[2]) - 4;
    const topPx = Math.min(rect[1], rect[3]) - 2;
    const widthPx = Math.abs(rect[2] - rect[0]) + 8;
    const heightPx = Math.abs(rect[3] - rect[1]) + 4;

    rawMasks.push({
      id: `${idPrefix}-${Math.round(minTx)}-${Math.round(minTy)}`,
      leftPercent: Math.max(0, (leftPx / canvasW) * 100),
      topPercent: Math.max(0, (topPx / canvasH) * 100),
      widthPercent: Math.min(100, (widthPx / canvasW) * 100),
      heightPercent: Math.min(100, (heightPx / canvasH) * 100),
      type,
      label: ''
    });
  };

  // NOTE: Student Name is NOT masked per requirements.

  // A. EMAIL ADDRESS MASKING (Column & item isolated)
  lines.forEach(line => {
    const segs = getColSegments(line.items);
    segs.forEach(seg => {
      if (isAcademicHeadingText(seg.segText)) return;
      const textNoSpaces = seg.segText.replace(/\s+/g, '');
      const hasEmail =
        emailRegex.test(seg.segText) ||
        emailRegex.test(textNoSpaces) ||
        (studentEmail && textNoSpaces.toLowerCase().includes(studentEmail.replace(/\s+/g, '')));

      if (hasEmail) {
        // Isolate only items that belong to the email (plus optional "Email:" prefix)
        const emailItems = seg.items.filter(it => {
          const s = it.str.toLowerCase();
          return (
            emailRegex.test(it.str) ||
            s.includes('@') ||
            (studentEmail && s.includes(studentEmail)) ||
            /^(?:e-?mail|mail)[\s.:]*$/i.test(it.str.trim())
          );
        });

        const targetItems = emailItems.length > 0 ? emailItems : seg.items;
        const minTx = Math.min(...targetItems.map(it => it.tx));
        const maxTx = Math.max(...targetItems.map(it => it.tx + it.width));
        pushMaskFromRect(minTx, line.ty, maxTx, line.ty + line.height, 'email', 'mask-email');
      }
    });
  });

  // B. PHONE NUMBER MASKING (Column & item isolated, restricted to header/contact)
  lines.forEach(line => {
    // Skip if line is within an academic or project section and not in header
    const isInHeaderArea = firstAcademicSectionTy === -1 || line.ty >= firstAcademicSectionTy;
    const isPersonalDetailsArea = /personal\s+(details|information|profile)/i.test(line.fullText);
    if (!isInHeaderArea && !isPersonalDetailsArea) return;

    const segs = getColSegments(line.items);
    segs.forEach(seg => {
      if (isAcademicHeadingText(seg.segText)) return;

      // Skip academic years, ranges, or dates like "2021 - 2025"
      if (/^(?:19|20)\d{2}\s*[-–—/]\s*(?:(?:19|20)\d{2}|present|current)\b/i.test(seg.segText.trim())) {
        return;
      }

      const cleanDigits = seg.segText.replace(/\D/g, '');
      const hasPhoneIndicator = phoneIndicatorRegex.test(seg.segText);
      const isIndianPhone = /(?:^|\D)(?:\+?91[\s.-]*)?[6-9]\d{4}[\s.-]*\d{5}(?:\D|$)|(?:^|\D)(?:\+?91[\s.-]*)?[6-9]\d{9}(?:\D|$)/.test(seg.segText);
      const matchesStudentPhone = Boolean(studentPhoneClean && studentPhoneClean.length >= 7 && cleanDigits.includes(studentPhoneClean));
      const isGenericPhone = hasPhoneIndicator && cleanDigits.length >= 7 && cleanDigits.length <= 13;

      if (isIndianPhone || matchesStudentPhone || isGenericPhone) {
        // Isolate only items that belong to the phone number
        const phoneItems = seg.items.filter(it => {
          const s = it.str.trim();
          const d = s.replace(/\D/g, '');
          return (
            phoneIndicatorRegex.test(s) ||
            /\d{3,}/.test(s) ||
            (studentPhoneClean && d.length >= 4 && studentPhoneClean.includes(d))
          );
        });

        const targetItems = phoneItems.length > 0 ? phoneItems : seg.items;
        const minTx = Math.min(...targetItems.map(it => it.tx));
        const maxTx = Math.max(...targetItems.map(it => it.tx + it.width));
        pushMaskFromRect(minTx, line.ty, maxTx, line.ty + line.height, 'phone', 'mask-phone');
      }
    });
  });

  // C. RESIDENTIAL / POSTAL ADDRESS BLOCK MASKING (Line-by-line in contact area only)
  const explicitAddressLabelRegex = /(?:permanent|current|residential|present|communication|postal)\s*address[\s:]|^address[\s:]/i;
  const houseDoorPrefixRegex = /\b(?:door|flat|plot|house|d[\s./-]?no|h[\s./-]?no|apartment|apt)\b\s*[:.]?\s*#?[\w/-]+/i;
  const streetAndPincodeRegex = /\b(?:street|road|rd\.?|lane|nagar|colony|layout|salai|cross|main)\b.*?\b[1-9]\d{5}\b/i;
  const pincodeLabelRegex = /\b(?:pincode|pin|postal\s*code)[\s:]*[1-9]\d{5}\b/i;
  const streetOnlyRegex = /\b(?:door|flat|plot|house|d[\s./-]?no|h[\s./-]?no|apt|apartment|nagar|colony|layout|salai|cross|lane)\b/i;

  lines.forEach((line, idx) => {
    // Only check lines in the contact/header area (above first academic section)
    // or under an explicit personal details section
    const isInHeaderArea = firstAcademicSectionTy === -1 || line.ty >= firstAcademicSectionTy;
    const isPersonalDetailsArea = /personal\s+(details|information|profile)/i.test(line.fullText);
    if (!isInHeaderArea && !isPersonalDetailsArea) return;

    // Must not be an academic, course, project, or organization line
    if (isAcademicHeadingText(line.fullText) || isSectionBoundary(line.fullText)) return;

    const segs = getColSegments(line.items);
    segs.forEach(seg => {
      if (isAcademicHeadingText(seg.segText) || isSectionBoundary(seg.segText)) return;

      const isStrongAddress =
        explicitAddressLabelRegex.test(seg.segText) ||
        houseDoorPrefixRegex.test(seg.segText) ||
        streetAndPincodeRegex.test(seg.segText) ||
        pincodeLabelRegex.test(seg.segText);

      if (isStrongAddress) {
        pushMaskFromRect(seg.minTx, line.ty, seg.maxTx, line.ty + line.height, 'address', 'mask-address');

        // Check if immediate next line in same column is an address continuation line (e.g. street + pincode)
        if (idx + 1 < lines.length) {
          const nextLine = lines[idx + 1];
          const dy = Math.abs(line.ty - nextLine.ty);
          if (dy < 28 && !isAcademicHeadingText(nextLine.fullText) && !isSectionBoundary(nextLine.fullText)) {
            const nextSegs = getColSegments(nextLine.items);
            const nextSeg = nextSegs.find(s => Math.abs(s.minTx - seg.minTx) < 40);
            if (nextSeg && !isAcademicHeadingText(nextSeg.segText)) {
              const isContinuation =
                /\b[1-9]\d{5}\b/.test(nextSeg.segText) ||
                streetOnlyRegex.test(nextSeg.segText) ||
                explicitAddressLabelRegex.test(nextSeg.segText);

              if (isContinuation) {
                pushMaskFromRect(nextSeg.minTx, nextLine.ty, nextSeg.maxTx, nextLine.ty + nextLine.height, 'address', 'mask-address-cont');
              }
            }
          }
        }
      }
    });
  });

  // D. PROFILE PHOTOGRAPH / HEADSHOT MASKING (Page 1)
  if (safePageNum === 1) {
    const photoMasks = await detectProfilePhotoMasks(page, viewport, pageH, pageW, canvasW, canvasH);
    photoMasks.forEach(m => rawMasks.push(m));
  }

  // E. MERGE OVERLAPPING MASKS ON THE SAME LINE
  const mergedMasks: PrivacyMask[] = [];
  rawMasks.forEach(mask => {
    const overlapIdx = mergedMasks.findIndex(
      m =>
        m.type === mask.type &&
        Math.abs(m.topPercent - mask.topPercent) < 2.0 &&
        !(mask.leftPercent > m.leftPercent + m.widthPercent + 1.0 || mask.leftPercent + mask.widthPercent < m.leftPercent - 1.0)
    );

    if (overlapIdx >= 0) {
      const existing = mergedMasks[overlapIdx];
      const minLeft = Math.min(existing.leftPercent, mask.leftPercent);
      const minTop = Math.min(existing.topPercent, mask.topPercent);
      const maxRight = Math.max(existing.leftPercent + existing.widthPercent, mask.leftPercent + mask.widthPercent);
      const maxBottom = Math.max(existing.topPercent + existing.heightPercent, mask.topPercent + mask.heightPercent);
      mergedMasks[overlapIdx] = {
        ...existing,
        leftPercent: minLeft,
        topPercent: minTop,
        widthPercent: maxRight - minLeft,
        heightPercent: maxBottom - minTop
      };
    } else {
      mergedMasks.push(mask);
    }
  });

  return {
    privacyMasks: mergedMasks,
    detectedSections,
    isScannedPdf: false
  };
}

/**
 * Returns dynamic relevant categories for a student's resume.
 * Always keeps Formatting, Grammar, and Other available.
 * Preserves existing selected categories and saved feedback.
 * If section detection is unreliable, preserves all categories.
 */
export function getRelevantCategories(student: Student | null, detectedSections: DetectedPdfSection[]): string[] {
  const alwaysAvailable = ['Formatting', 'Grammar', 'Other'];
  const contentCategoryDefs = [
    { name: 'Career Objective', matchKeys: ['objective', 'summary', 'profile', 'about'], regex: /objective|summary|profile|about/i },
    { name: 'Education', matchKeys: ['education', 'academics'], regex: /education|academic/i },
    { name: 'Skills', matchKeys: ['skills', 'technical_skills'], regex: /skill|competenc/i },
    { name: 'Projects', matchKeys: ['projects', 'academic_projects'], regex: /project/i },
    { name: 'Experience', matchKeys: ['experience', 'internship', 'work'], regex: /experience|internship|employment/i }
  ];

  const presentCategories = new Set<string>();

  // 1. Detected sections from PDF text
  if (Array.isArray(detectedSections) && detectedSections.length > 0) {
    detectedSections.forEach(sec => {
      const secKey = (sec.key || '').toLowerCase();
      const secTitle = (sec.title || '').toLowerCase();
      contentCategoryDefs.forEach(cat => {
        if (cat.matchKeys.includes(secKey) || cat.regex.test(secTitle) || cat.regex.test(secKey)) {
          presentCategories.add(cat.name);
        }
      });
    });
  }

  // 2. Sections from student metadata
  if (student && Array.isArray(student.resumeSections) && student.resumeSections.length > 0) {
    student.resumeSections.forEach(sec => {
      const secKey = (sec.key || '').toLowerCase();
      const secTitle = (sec.title || '').toLowerCase();
      contentCategoryDefs.forEach(cat => {
        if (cat.matchKeys.includes(secKey) || cat.regex.test(secTitle) || cat.regex.test(secKey)) {
          presentCategories.add(cat.name);
        }
      });
    });
  }

  // If section detection is unreliable or empty, preserve all 8 existing categories
  if (presentCategories.size === 0) {
    return [
      'Career Objective',
      'Education',
      'Skills',
      'Projects',
      'Experience',
      'Formatting',
      'Grammar',
      'Other'
    ];
  }

  // Always preserve currently selected improveTags
  const currentTags = student?.improveTags || [];
  currentTags.forEach(tag => {
    if (tag === 'Objective') presentCategories.add('Career Objective');
    else presentCategories.add(tag);
  });

  // Always preserve any category with saved categoryFeedback
  if (student?.categoryFeedback) {
    Object.keys(student.categoryFeedback).forEach(cat => {
      if (student.categoryFeedback![cat]?.trim()) {
        presentCategories.add(cat);
      }
    });
  }

  // Build ordered list
  const orderedList: string[] = [];
  contentCategoryDefs.forEach(cat => {
    if (presentCategories.has(cat.name)) {
      orderedList.push(cat.name);
    }
  });

  // Always append Formatting, Grammar, Other
  alwaysAvailable.forEach(cat => {
    if (!orderedList.includes(cat)) {
      orderedList.push(cat);
    }
  });

  return orderedList;
}
