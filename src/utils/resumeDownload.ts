import { Student, getResumeSectionsForVersion } from '../data/studentsData';

/**
 * Generates and triggers download of an ATS-compliant, print-ready resume document.
 * Matches the selected version ('old' or 'new').
 */
export const downloadResumeDocument = (student: Student, version: 'old' | 'new') => {
  const sections = getResumeSectionsForVersion(student, version);
  const versionTitle = version === 'old' ? 'Original Submission (Pre-Review v1)' : 'Revised & Optimized Resume (Post-Feedback v2)';
  const fileName = `${student.name.replace(/\s+/g, '_')}_${version === 'old' ? 'Original_v1' : 'Revised_v2'}_Resume.html`;

  const sectionsHtml = sections.map(sec => {
    let contentHtml = '';

    if (sec.type === 'text') {
      contentHtml = `<p style="margin: 4px 0; font-size: 13px; line-height: 1.6; color: #334155;">${sec.content || ''}</p>`;
    } else if (sec.type === 'education') {
      const items = (sec.items as any[]) || [];
      contentHtml = items.map(edu => `
        <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 13.5px; color: #0F172A;">
            <span>${edu.degree}</span>
            <span style="font-weight: 500; color: #64748B;">${edu.period}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12.5px; color: #475569;">
            <span>${edu.institution}</span>
            <span style="font-weight: 600; color: #2563EB;">${edu.score}</span>
          </div>
        </div>
      `).join('');
    } else if (sec.type === 'chips') {
      const skills = (sec.items as string[]) || [];
      contentHtml = `
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
          ${skills.map(skill => `<span style="background: #F1F5F9; border: 1px solid #CBD5E1; color: #1E293B; font-weight: 600; font-size: 11.5px; padding: 3px 8px; border-radius: 4px;">${skill}</span>`).join('')}
        </div>
      `;
    } else if (sec.type === 'projects') {
      const projects = (sec.items as any[]) || [];
      contentHtml = projects.map(proj => `
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 13.5px; color: #0F172A;">
            <span>${proj.title}</span>
            <span style="font-weight: 500; font-size: 12px; color: #64748B;">${proj.period}</span>
          </div>
          <div style="font-size: 11.5px; font-weight: 600; color: #2563EB; margin: 2px 0 4px;">
            Technologies: ${proj.tech}
          </div>
          <p style="margin: 0; font-size: 12.5px; line-height: 1.5; color: #334155;">
            ${proj.description}
          </p>
        </div>
      `).join('');
    } else if (sec.type === 'list') {
      const listItems = (sec.items as string[]) || [];
      contentHtml = `
        <ul style="margin: 4px 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.6;">
          ${listItems.map(item => `<li>${item}</li>`).join('')}
        </ul>
      `;
    }

    return `
      <section style="margin-bottom: 18px;">
        <h2 style="font-size: 13px; font-weight: 800; letter-spacing: 0.05em; color: #0F172A; text-transform: uppercase; border-bottom: 1.5px solid #0F172A; padding-bottom: 3px; margin: 0 0 8px 0;">
          ${sec.title}
        </h2>
        ${contentHtml}
      </section>
    `;
  }).join('');

  const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${student.name} - Resume (${version === 'old' ? 'v1 Original' : 'v2 Revised'})</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 30px;
      background: #FFFFFF;
      color: #0F172A;
      box-sizing: border-box;
      max-width: 820px;
      margin: 0 auto;
    }
    .version-watermark {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      background: ${version === 'old' ? '#F1F5F9' : '#DCFCE7'};
      color: ${version === 'old' ? '#475569' : '#166534'};
      border: 1px solid ${version === 'old' ? '#CBD5E1' : '#86EFAC'};
      margin-bottom: 12px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 16px; padding: 12px 16px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <strong>Resume Document (${versionTitle})</strong>
      <div style="font-size: 12px; color: #64748B;">Ready to print or save to PDF (Ctrl+P / Cmd+P)</div>
    </div>
    <button onclick="window.print()" style="background: #2563EB; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: 600; cursor: pointer;">
      Print to PDF
    </button>
  </div>

  <div class="version-watermark">
    Document Version: ${versionTitle}
  </div>

  <header style="border-bottom: 2px solid #0F172A; padding-bottom: 10px; margin-bottom: 16px;">
    <h1 style="margin: 0 0 4px 0; font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.5px;">
      ${student.name}
    </h1>
    <div style="font-size: 14px; font-weight: 600; color: #2563EB; margin-bottom: 6px;">
      ${student.degree} Candidate • ${student.institution}
    </div>
    <div style="font-size: 12.5px; color: #475569; display: flex; flex-wrap: wrap; gap: 12px;">
      <span>✉ ${student.email}</span>
      <span>☎ ${student.phone}</span>
      <span>📍 ${student.location}</span>
      ${student.github ? `<span>🔗 ${student.github}</span>` : ''}
      ${student.linkedin ? `<span>💼 ${student.linkedin}</span>` : ''}
    </div>
  </header>

  <main>
    ${sectionsHtml}
  </main>
</body>
</html>`;

  // Trigger client-side file download
  const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
