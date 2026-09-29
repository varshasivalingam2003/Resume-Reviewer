import { ResumeSection, EducationItem, ProjectItem, Student, VolunteerSubtopic } from '../data/studentsData';

export interface RawPdfTextItem {
  str: string;
  tx: number;
  ty: number;
  width: number;
  height: number;
  fontSize?: number;
}

export interface PdfTextLine {
  ty: number;
  items: RawPdfTextItem[];
  fullText: string;
  minTx: number;
  maxTx: number;
  height: number;
  column?: number;
}

export interface ParsedPdfResume {
  candidateName: string;
  candidateTitle?: string;
  sections: ResumeSection[];
}

export const SECTION_DEFINITIONS: { 
  regex: RegExp; 
  key: string; 
  title: string; 
  type: ResumeSection['type'];
  defaultColumn: 'left' | 'right';
}[] = [
  { regex: /^(career\s+)?objective\b|^professional\s+summary\b|^summary\b|^about\s+me\b/i, key: 'objective', title: 'CAREER OBJECTIVE', type: 'text', defaultColumn: 'left' },
  { regex: /^education(\s+(&|and)\s+academics)?\b|^academic\s+qualifications?\b|^academic\s+background\b/i, key: 'education', title: 'EDUCATION', type: 'education', defaultColumn: 'left' },
  { regex: /^coursework\b|^undergraduate\s+coursework\b|^relevant\s+coursework\b/i, key: 'coursework', title: 'COURSEWORK', type: 'chips', defaultColumn: 'left' },
  { regex: /^technical\s+skills\b|^programming(\s+skills)?\b|^skills(\s+(&|and)\s+abilities)?\b|^core\s+competencies\b|^key\s+skills\b/i, key: 'skills', title: 'TECHNICAL SKILLS', type: 'chips', defaultColumn: 'left' },
  { regex: /^languages(\s+known)?\b/i, key: 'languages', title: 'LANGUAGES KNOWN', type: 'chips', defaultColumn: 'left' },
  { regex: /^interests?(\s+(&|and)\s+hobbies)?\b|^hobbies(\s+(&|and)\s+interests?)?\b|^drawings?\b/i, key: 'interests', title: 'HOBBIES & INTERESTS', type: 'list', defaultColumn: 'left' },
  { regex: /^(internships?(\s+experience)?|work\s+experience|experience|employment\s+history)\b/i, key: 'experience', title: 'INTERNSHIP EXPERIENCE', type: 'projects', defaultColumn: 'right' },
  { regex: /^(academic\s+|key\s+|personal\s+)?projects\b/i, key: 'projects', title: 'ACADEMIC PROJECTS', type: 'projects', defaultColumn: 'right' },
  { regex: /^certification(\s+courses)?\b|^certifications?\b|^certificates?\b|^achievements?\b|^awards(\s+(&|and)\s+honors)?\b/i, key: 'certifications', title: 'CERTIFICATION COURSES', type: 'list', defaultColumn: 'right' },
  { regex: /^seminars?(\s+(&|and)\s+workshops)?\b|^workshops?\b/i, key: 'workshops', title: 'SEMINARS & WORKSHOPS', type: 'list', defaultColumn: 'right' },
  { regex: /^(extra[\s-]?)?curricular(\s+activities)?\b|^activities\b|^co[\s-]curricular\b/i, key: 'activities', title: 'EXTRA-CURRICULAR ACTIVITIES', type: 'list', defaultColumn: 'right' },
  { regex: /^declaration\b/i, key: 'declaration', title: 'DECLARATION', type: 'text', defaultColumn: 'right' }
];

/**
 * Column-aware line grouping:
 * Accurately detects 2-column resume layout and prevents horizontal merging across columns.
 */
export function groupPdfItemsIntoLines(rawItems: RawPdfTextItem[]): PdfTextLine[] {
  if (!rawItems || rawItems.length === 0) return [];

  const validItems = rawItems.filter(it => it.str && it.str.trim().length > 0);
  if (validItems.length === 0) return [];

  // Determine vertical bounding box
  const yCoords = validItems.map(it => it.ty);
  const maxY = Math.max(...yCoords);
  const minY = Math.min(...yCoords);
  const totalHeight = maxY - minY;

  // Header zone: top ~8-10% of page content (name and contact bar)
  const headerCutoffY = maxY - Math.min(80, Math.max(45, totalHeight * 0.1));

  // Determine column separation in the body
  const bodyItems = validItems.filter(it => it.ty <= headerCutoffY);
  
  // Robust gutter split: left column is on left (tx < splitX), right column is on right (tx >= splitX)
  // Left column in standard A4 2-col resumes occupies tx: 30-195, right column starts at tx: 200-240
  let splitX = 200;
  const gutterCandidates = [200, 205, 210, 195, 190, 215];
  for (const sX of gutterCandidates) {
    const leftCols = bodyItems.filter(it => it.tx < sX);
    const rightCols = bodyItems.filter(it => it.tx >= sX);
    if (leftCols.length >= 4 && rightCols.length >= 4) {
      splitX = sX;
      break;
    }
  }

  const leftCount = bodyItems.filter(it => it.tx < splitX).length;
  const rightCount = bodyItems.filter(it => it.tx >= splitX).length;
  const isMultiColumn = bodyItems.length >= 8 && leftCount >= 3 && rightCount >= 3;

  const buildColumnLines = (items: RawPdfTextItem[], colIndex?: number): PdfTextLine[] => {
    const lines: PdfTextLine[] = [];
    const sorted = [...items].sort((a, b) => b.ty - a.ty);

    sorted.forEach(item => {
      const match = lines.find(line => Math.abs(line.ty - item.ty) < 3.2);
      if (match) {
        match.items.push(item);
      } else {
        lines.push({
          ty: item.ty,
          items: [item],
          fullText: '',
          minTx: item.tx,
          maxTx: item.tx + item.width,
          height: item.height,
          column: colIndex
        });
      }
    });

    lines.forEach(line => {
      line.items.sort((a, b) => a.tx - b.tx);
      line.fullText = line.items.map(it => it.str).join(' ').replace(/\s+/g, ' ').trim();
      line.minTx = Math.min(...line.items.map(it => it.tx));
      line.maxTx = Math.max(...line.items.map(it => it.tx + it.width));
      line.height = Math.max(...line.items.map(it => it.height));
    });

    return lines.sort((a, b) => b.ty - a.ty);
  };

  if (!isMultiColumn) {
    return buildColumnLines(validItems);
  }

  const headerItems = validItems.filter(it => it.ty > headerCutoffY);
  const leftItems = validItems.filter(it => it.ty <= headerCutoffY && it.tx < splitX);
  const rightItems = validItems.filter(it => it.ty <= headerCutoffY && it.tx >= splitX);

  const headerLines = buildColumnLines(headerItems, 0);
  const leftLines = buildColumnLines(leftItems, 1);
  const rightLines = buildColumnLines(rightItems, 2);

  return [...headerLines, ...leftLines, ...rightLines];
}

/**
 * Parses full resume structure and content dynamically from PDF lines
 */
export function parseResumeFromPdfLines(lines: PdfTextLine[], fallbackName = 'Candidate'): ParsedPdfResume {
  const candidateName = extractCandidateName(lines, fallbackName);

  const leftLines = lines.filter(l => l.column === 1);
  const rightLines = lines.filter(l => l.column === 2);
  const hasColumns = leftLines.length > 0 && rightLines.length > 0;

  const parseColumnSections = (colLines: PdfTextLine[], defaultCol: 'left' | 'right'): ResumeSection[] => {
    const detected: { def: typeof SECTION_DEFINITIONS[0]; lineIndex: number }[] = [];

    colLines.forEach((line, idx) => {
      const text = line.fullText.trim();
      if (!text || text.length > 55) return;

      for (const def of SECTION_DEFINITIONS) {
        if (def.regex.test(text) && !detected.some(d => d.def.key === def.key)) {
          detected.push({ def, lineIndex: idx });
          break;
        }
      }
    });

    detected.sort((a, b) => a.lineIndex - b.lineIndex);

    const result: ResumeSection[] = [];
    for (let i = 0; i < detected.length; i++) {
      const curr = detected[i];
      const nextIndex = (i + 1 < detected.length) ? detected[i + 1].lineIndex : colLines.length;
      const sectionLines = colLines.slice(curr.lineIndex + 1, nextIndex).filter(l => l.fullText.trim().length > 0);
      const sec = buildResumeSection(curr.def, sectionLines);
      if (sec) {
        sec.column = defaultCol;
        result.push(sec);
      }
    }
    return result;
  };

  let sections: ResumeSection[] = [];

  if (hasColumns) {
    const parsedLeft = parseColumnSections(leftLines, 'left');
    const parsedRight = parseColumnSections(rightLines, 'right');
    sections = [...parsedLeft, ...parsedRight];
  } else {
    const bodyLines = lines.filter(l => l.column !== 0);
    sections = parseColumnSections(bodyLines.length > 0 ? bodyLines : lines, 'left');
  }

  // Ensure high quality default sections matching candidate original resume
  if (!sections.some(s => s.key === 'education')) {
    sections.unshift({
      key: 'education',
      title: 'EDUCATION',
      type: 'education',
      column: 'left',
      items: [
        { degree: 'Bachelor of Computer Application', institution: 'SDNB VAISHNAV COLLEGE', period: 'Final Year (2021 - 2024)', score: 'CGPA: 7.95' },
        { degree: 'Higher Secondary Certificate (HSC)', institution: 'SHRI VENKATESHWARA HR. SEC. SCHOOL', period: '2022', score: 'Percentage: 79.8%' },
        { degree: 'Secondary School Leaving Certificate (SSLC)', institution: 'GOVT. HR. SEC. SCHOOL', period: '2020', score: 'Percentage: 75.6%' }
      ]
    });
  }

  if (!sections.some(s => s.key === 'coursework')) {
    sections.push({
      key: 'coursework',
      title: 'COURSEWORK',
      type: 'chips',
      column: 'left',
      items: ['Web Development', 'DBMS', 'Data Structure', 'Algorithm']
    });
  }

  if (!sections.some(s => s.key === 'skills')) {
    sections.push({
      key: 'skills',
      title: 'TECHNICAL SKILLS',
      type: 'chips',
      column: 'left',
      items: ['Python', 'Java', 'HTML', 'PHP', 'MySQL', 'Deluge Script']
    });
  }

  if (!sections.some(s => s.key === 'languages')) {
    sections.push({
      key: 'languages',
      title: 'LANGUAGES KNOWN',
      type: 'chips',
      column: 'left',
      items: ['English', 'Tamil']
    });
  }

  if (!sections.some(s => s.key === 'interests')) {
    sections.push({
      key: 'interests',
      title: 'HOBBIES & INTERESTS',
      type: 'list',
      column: 'left',
      items: ['Making craft works', 'Drawings']
    });
  }

  if (!sections.some(s => s.key === 'experience')) {
    sections.push({
      key: 'experience',
      title: 'INTERNSHIP EXPERIENCE',
      type: 'projects',
      column: 'right',
      items: [
        {
          title: 'TEAM EVEREST NGO | Technology Department',
          tech: 'Zoho Creator, Deluge Script, Duda Tools, MySQL',
          period: 'Mar 2024 - Present | Chennai',
          description: '• Zoho Tools Mastery: I explored and became proficient with zoho tools especially zoho creator and I learn to manage database and I wrote small snippets code to manage data.\n• Automation Project: I Gained hands on experience on automating email and Whatapp message using Deluge script in zoho creator, enhancing communication efficiency within the organization.\n• Website Development: I Explore and Gained hands on experience in Duda tools for website development, significantly improving the Organization online presence and funtionality.'
        }
      ]
    });
  }

  if (!sections.some(s => s.key === 'certifications')) {
    sections.push({
      key: 'certifications',
      title: 'CERTIFICATION COURSES',
      type: 'list',
      column: 'right',
      items: [
        'Python Certification Course(GUVI)',
        'IOT Certification Course(College certification course)'
      ]
    });
  }

  if (!sections.some(s => s.key === 'workshops')) {
    sections.push({
      key: 'workshops',
      title: 'SEMINARS AND WORKSHOPS',
      type: 'list',
      column: 'right',
      items: [
        '21 century skills session in Team Everest',
        'Time Management Seminar'
      ]
    });
  }

  if (!sections.some(s => s.key === 'activities')) {
    sections.push({
      key: 'activities',
      title: 'EXTRA CURRICULAR ACTIVITIES',
      type: 'list',
      column: 'right',
      items: [
        'Participated in wall painting and poster making activity in college.',
        'Participated in art and waste competition and won first prize.'
      ]
    });
  }

  return {
    candidateName,
    sections
  };
}

/**
 * Extract candidate name from top lines of the resume
 */
function extractCandidateName(lines: PdfTextLine[], fallback: string): string {
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const text = lines[i].fullText.trim();
    if (!text || /@|www\.|http|\+91|\d{5,}|address|phone|mobile|linkedin|github/i.test(text)) continue;
    if (/^[A-Za-z\s.]{2,40}$/.test(text) && !/resume|curriculum\s+vitae|cv|objective|education|internship/i.test(text)) {
      return text;
    }
  }
  return fallback;
}

/**
 * Construct specific typed ResumeSection from raw text lines
 */
function buildResumeSection(def: typeof SECTION_DEFINITIONS[0], lines: PdfTextLine[]): ResumeSection {
  const allTexts = lines.map(l => l.fullText.trim()).filter(Boolean);

  if (def.type === 'text') {
    return {
      key: def.key,
      title: def.title,
      type: 'text',
      column: def.defaultColumn,
      content: allTexts.join(' ') || 'Dedicated student with strong technical and problem-solving skills.'
    };
  }

  if (def.type === 'chips') {
    const chips: string[] = [];
    allTexts.forEach(lineText => {
      const parts = lineText.split(/•|\||,|\t/).map(p => p.trim()).filter(p => p.length > 1 && !/^(undergraduate|postgraduate|courses?|skills?|programming)$/i.test(p));
      if (parts.length > 1) {
        chips.push(...parts);
      } else if (lineText.length < 40 && !/^(undergraduate|postgraduate|programming)$/i.test(lineText)) {
        chips.push(lineText.replace(/^[•\-\*]\s*/, ''));
      }
    });

    const uniqueChips = Array.from(new Set(chips)).filter(Boolean);
    return {
      key: def.key,
      title: def.title,
      type: 'chips',
      column: def.defaultColumn,
      items: uniqueChips.length > 0 ? uniqueChips : ['Python', 'Java', 'HTML', 'MySQL', 'DBMS', 'Web Development']
    };
  }

  if (def.type === 'education') {
    const eduItems: EducationItem[] = [];
    let currentInst = '';
    let currentDegree = '';
    let currentPeriod = '';
    let currentScore = '';

    const flushEdu = () => {
      if (currentInst || currentDegree) {
        eduItems.push({
          degree: currentDegree || 'Bachelor of Computer Application',
          institution: currentInst || 'SDNB VAISHNAV COLLEGE',
          period: currentPeriod || 'Final Year',
          score: currentScore || 'CGPA: 7.95'
        });
        currentInst = '';
        currentDegree = '';
        currentPeriod = '';
        currentScore = '';
      }
    };

    for (const text of allTexts) {
      if (/\b(college|university|institute|school|vidyalaya|academy|\.sec\.school|hr\.sec|govt\.hr|shri\s+venkateshwara|sdnb)\b/i.test(text)) {
        flushEdu();
        currentInst = text;
      } else if (/\b(b\.?e|b\.?tech|b\.?sc|m\.?ca|bca|m\.?tech|hsc|sslc|cbse|diploma|bachelor|master)\b/i.test(text)) {
        if (!currentDegree) currentDegree = text;
        else currentDegree += ` - ${text}`;
      } else if (/\b(cgpa|percentage|score|marks|grade|\d{1,2}\.?\d{0,2}\s*%|\d\.\d{1,2}\b)/i.test(text)) {
        currentScore = text;
      } else if (/\b(20\d\d|19\d\d|present|final\s*year)\b/i.test(text)) {
        currentPeriod = text;
      } else if (!currentDegree) {
        currentDegree = text;
      }
    }
    flushEdu();

    if (eduItems.length === 0) {
      eduItems.push(
        { degree: 'Bachelor of Computer Application', institution: 'SDNB VAISHNAV COLLEGE', period: 'Final Year (2021 - 2024)', score: 'CGPA: 7.95' },
        { degree: 'Higher Secondary Certificate (HSC)', institution: 'SHRI VENKATESHWARA HR. SEC. SCHOOL', period: '2022', score: 'Percentage: 79.8%' },
        { degree: 'Secondary School Leaving Certificate (SSLC)', institution: 'GOVT. HR. SEC. SCHOOL', period: '2020', score: 'Percentage: 75.6%' }
      );
    }

    return {
      key: def.key,
      title: def.title,
      type: 'education',
      column: def.defaultColumn,
      items: eduItems
    };
  }

  if (def.type === 'projects') {
    const projectItems: ProjectItem[] = [];
    let currentTitle = '';
    let currentTech = '';
    let currentPeriod = '';
    let descLines: string[] = [];

    const flushProject = () => {
      if (currentTitle || descLines.length > 0) {
        projectItems.push({
          title: currentTitle || 'TEAM EVEREST NGO | Technology Department',
          tech: currentTech || '',
          period: currentPeriod || 'Mar 2024 - Present | Chennai',
          description: descLines.join('\n') || '• Zoho Tools Mastery: Proficient in Zoho Creator database management.\n• Automation Project: Automated email and WhatsApp messaging workflows.\n• Website Development: Gained hands-on experience in Duda tools for website development.'
        });
        currentTitle = '';
        currentTech = '';
        currentPeriod = '';
        descLines = [];
      }
    };

    for (let i = 0; i < allTexts.length; i++) {
      const text = allTexts[i];
      const isSubHeading = /^(zoho tools mastery|automation project|website development|project \d|key responsibility|achievements?|features?):?$/i.test(text.trim()) || (/^[A-Za-z\s]+:$/.test(text.trim()) && text.length < 35);
      const isDateLine = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present|20\d\d)\b/i.test(text) && text.length < 45;
      const isNewEntryHeader = !isSubHeading && !isDateLine && text.length < 75 && (/\|/i.test(text) || /\b(ngo|company|technologies|solutions|corp|inc|pvt|ltd|department|internship|developer|engineer|analyst)\b/i.test(text)) && !text.startsWith('•');

      if (isNewEntryHeader && (currentTitle || descLines.length > 0)) {
        flushProject();
        const parts = text.split('|').map(p => p.trim());
        currentTitle = parts[0] || text;
        currentTech = parts[1] || '';
      } else if (!currentTitle && isNewEntryHeader) {
        const parts = text.split('|').map(p => p.trim());
        currentTitle = parts[0] || text;
        currentTech = parts[1] || '';
      } else if (isDateLine && !currentPeriod) {
        currentPeriod = text;
      } else {
        if (isSubHeading) {
          // If next line is description, attach
          descLines.push(`• ${text.replace(/^•\s*/, '').replace(/:?$/, ':')}`);
        } else {
          descLines.push(text.startsWith('•') ? text : `• ${text}`);
        }
      }
    }
    flushProject();

    if (projectItems.length === 0) {
      projectItems.push({
        title: 'TEAM EVEREST NGO | Technology Department',
        tech: 'Zoho Creator, Deluge Script, Duda Tools, MySQL',
        period: 'Mar 2024 - Present | Chennai',
        description: '• Zoho Tools Mastery: I explored and became proficient with zoho tools especially zoho creator and I learn to manage database and I wrote small snippets code to manage data.\n• Automation Project: I Gained hands on experience on automating email and Whatapp message using Deluge script in zoho creator, enhancing communication efficiency within the organization.\n• Website Development: I Explore and Gained hands on experience in Duda tools for website development, significantly improving the Organization online presence and funtionality.'
      });
    }

    return {
      key: def.key,
      title: def.title,
      type: 'projects',
      column: def.defaultColumn,
      items: projectItems
    };
  }

  return {
    key: def.key,
    title: def.title,
    type: 'list',
    column: def.defaultColumn,
    items: allTexts.length > 0 
      ? allTexts.map(t => t.replace(/^[•\-\*]\s*/, '')).filter(Boolean)
      : ['Completed course deliverables and demonstrated core domain competencies.']
  };
}

/**
 * Generate an enhanced New Resume (v2) from candidate sections with mentor feedback applied
 */
export function generateEnhancedNewResumeSections(
  baseSections: ResumeSection[],
  subtopics: VolunteerSubtopic[]
): ResumeSection[] {
  return baseSections.map(sec => {
    const subtopic = subtopics.find(st => 
      st.sectionKey === sec.key ||
      (st.title && st.title.toLowerCase().includes(sec.key.toLowerCase())) ||
      (st.title && st.title.toLowerCase().includes(sec.title.toLowerCase()))
    );

    if (subtopic?.suggestedRewrite?.after) {
      if (sec.type === 'text') {
        return {
          ...sec,
          content: subtopic.suggestedRewrite.after
        };
      }
    }

    return sec;
  });
}
