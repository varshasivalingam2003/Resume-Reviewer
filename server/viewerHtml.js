/**
 * Standalone Responsive HTML5 PDF Viewer with Integrated Natural Privacy Blur
 * Used when volunteers click "View Resume" on the Dashboard or "Open in New Tab" in the Workspace.
 * Automatically redacts phone, email, address, photo, and social links with in-place canvas Gaussian blur.
 */
export function generateViewerHtml({ resumeUrl, studentName = 'Student' }) {
  const safeName = studentName.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const rawPdfUrl = `/api/resume/download?url=${encodeURIComponent(resumeUrl)}&mode=raw&name=${encodeURIComponent(studentName)}`;
  const downloadPdfUrl = `/api/resume/download?url=${encodeURIComponent(resumeUrl)}&mode=download&name=${encodeURIComponent(studentName)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeName} - Resume Review Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <script src="/pdf.min.js"></script>
  <script>
    if (window['pdfjs-dist/build/pdf']) {
      window.pdfjsLib = window['pdfjs-dist/build/pdf'];
    }
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }
  </script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    /* Toolbar */
    .viewer-navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #1e293b;
      border-bottom: 1px solid #334155;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }
    .viewer-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .student-title {
      font-size: 15px;
      font-weight: 700;
      color: #f8fafc;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .privacy-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 9px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
      border-radius: 9999px;
      font-size: 11.5px;
      font-weight: 600;
    }
    .viewer-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .ctrl-group {
      display: inline-flex;
      align-items: center;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 6px;
      overflow: hidden;
    }
    .ctrl-btn {
      background: transparent;
      border: none;
      color: #cbd5e1;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 600;
      padding: 6px 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, color 0.15s;
    }
    .ctrl-btn:hover:not(:disabled) {
      background: #334155;
      color: #ffffff;
    }
    .ctrl-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .ctrl-label {
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      padding: 0 10px;
      user-select: none;
    }
    .action-btn {
      background: #2563eb;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      padding: 6px 14px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      transition: background 0.15s;
    }
    .action-btn:hover {
      background: #1d4ed8;
    }
    .action-btn.secondary {
      background: #334155;
      color: #f1f5f9;
    }
    .action-btn.secondary:hover {
      background: #475569;
    }
    /* Main Canvas Area */
    .viewer-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 16px;
      overflow-y: auto;
      gap: 24px;
    }
    .page-container {
      position: relative;
      background: #ffffff;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
      border-radius: 6px;
      overflow: hidden;
      margin: 0 auto;
    }
    .page-canvas {
      display: block;
    }
    /* Natural blur overlay - completely borderless */
    .privacy-mask-layer {
      position: absolute;
      background: transparent;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      border: none;
      box-shadow: none;
      outline: none;
      pointer-events: none;
      z-index: 10;
    }
    /* Loading Spinner */
    .loading-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      margin-top: 80px;
      color: #94a3b8;
    }
    .spinner {
      width: 38px;
      height: 38px;
      border: 3px solid rgba(148, 163, 184, 0.2);
      border-top-color: #38bdf8;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media print {
      .viewer-navbar { display: none !important; }
      body { background: #fff !important; }
      .viewer-body { padding: 0 !important; }
      .page-container { box-shadow: none !important; page-break-after: always; }
    }
  </style>
</head>
<body>
  <header class="viewer-navbar">
    <div class="viewer-meta">
      <span class="student-title">📄 ${safeName}'s Resume</span>
      <span class="privacy-tag">🛡️ Privacy Protected Preview</span>
    </div>

    <div class="viewer-controls">
      <!-- Page Navigation -->
      <div class="ctrl-group">
        <button id="btnPrevPage" class="ctrl-btn" title="Previous Page">◀</button>
        <span id="pageIndicator" class="ctrl-label">Page 1 / 1</span>
        <button id="btnNextPage" class="ctrl-btn" title="Next Page">▶</button>
      </div>

      <!-- Zoom Controls -->
      <div class="ctrl-group">
        <button id="btnZoomOut" class="ctrl-btn" title="Zoom Out">−</button>
        <span id="zoomIndicator" class="ctrl-label">100%</span>
        <button id="btnZoomIn" class="ctrl-btn" title="Zoom In">+</button>
        <button id="btnZoomReset" class="ctrl-btn" title="Reset Zoom">Fit</button>
      </div>

      <!-- Actions -->
      <button onclick="window.print()" class="action-btn secondary" title="Print Naturally Blurred Resume">🖨️ Print</button>
      <a href="${downloadPdfUrl}" class="action-btn" title="Download Resume File">⬇ Download</a>
    </div>
  </header>

  <main class="viewer-body" id="viewerBody">
    <div class="loading-wrap" id="loadingIndicator">
      <div class="spinner"></div>
      <p>Loading resume and applying natural privacy protection...</p>
    </div>
    <div id="pagesContainer"></div>
  </main>

  <script>
    (function() {
      const RAW_PDF_URL = ${JSON.stringify(rawPdfUrl)};
      let pdfDoc = null;
      let currentPageNum = 1;
      let totalPages = 1;
      let zoomLevel = 100;
      let renderTask = null;

      const viewerBody = document.getElementById('viewerBody');
      const loadingIndicator = document.getElementById('loadingIndicator');
      const pagesContainer = document.getElementById('pagesContainer');
      const pageIndicator = document.getElementById('pageIndicator');
      const zoomIndicator = document.getElementById('zoomIndicator');
      const btnPrevPage = document.getElementById('btnPrevPage');
      const btnNextPage = document.getElementById('btnNextPage');
      const btnZoomIn = document.getElementById('btnZoomIn');
      const btnZoomOut = document.getElementById('btnZoomOut');
      const btnZoomReset = document.getElementById('btnZoomReset');

      // Helper checks
      const isContactHeaderLine = (t) => {
        const norm = (t || '').replace(/[^a-zA-Z]/g, '').toLowerCase();
        return norm === 'contact' || norm === 'contactinfo' || norm === 'contactdetails' ||
               norm === 'contactinformation' || norm === 'personaldetails' || norm === 'personalinfo' ||
               norm === 'reachme' || norm === 'getintouch';
      };

      const isAcademicHeading = (t) => {
        return /^(education|technical\\s+skills|skills|projects|experience|work\\s+experience|internship|certifications?|activities|declaration|career\\s+objective|summary|profile|about\\s+me)\\b/i.test((t || '').trim()) ||
               /\\b(b\\.?e|b\\.?tech|b\\.?sc|m\\.?tech|m\\.?ca|cgpa|percentage|hsc|sslc|cbse|autonomous|university|college|school|curriculum)\\b/i.test(t || '');
      };

      const isNonPersonalContent = (t) => {
        return /^(profile|summary|about\\s+me|career\\s+objective|objective|education|technical\\s+skills|skills|projects?|experience|internship|certifications?|activities|languages?|achievements?|declaration|linkedin|github|portfolio|cgpa|degree|college|university)/i.test((t || '').trim()) ||
               /\\b(commerce|graduate|b\\.?e\\.?|b\\.?tech|m\\.?tech|cgpa|hsc|sslc|autonomous|university|college|curriculum)\\b/i.test(t || '');
      };

      const normalizedAddressRegex = /(?:permanent|current|residential|present|communication|postal)?address|door|flat|plot|house|dno|hno|street|road|rd|lane|nagar|colony|layout|salai|cross|main|kovil|temple|apartment|apt|block|thiruvottiyur|tambaram|velachery|guindy|chennai|coimbatore|madurai|trichy|salem|bangalore|bengaluru|hyderabad|mumbai|delhi|kolkata|pune|kerala|tamilnadu|karnataka|andhra|india|pincode|spkovil|\\b\\d{6}\\b/i;

      const emailRegex = /[A-Za-z0-9._%+-]+(?:\\s*@\\s*|\\s*\\[at\\]\\s*)[A-Za-z0-9.-]+\\s*\\.[A-Za-z]{2,}/i;
      const phoneRegex = /(?:\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{2,5}\\)?[-.\\s]?\\d{3,5}[-.\\s]?\\d{3,5}|\\b[6-9]\\d{4}[\\s.-]?\\d{5}\\b|\\b[6-9]\\d{9}\\b|\\+91[\\s-]?\\d{10}/;

      function getColSegments(lineItems) {
        const sorted = [...lineItems].sort((a, b) => a.tx - b.tx);
        const segs = [];
        let cur = [];
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
      }

      function itemsInCol(lineItems, colMinX, colMaxX) {
        const colMid = (colMinX + colMaxX) / 2;
        const colHalf = (colMaxX - colMinX) / 2 + 25;
        return lineItems.filter(it => {
          const itMid = it.tx + it.width / 2;
          return Math.abs(itMid - colMid) <= colHalf;
        });
      }

      async function renderPage(pageNum) {
        if (!pdfDoc) return;
        if (renderTask) {
          try { renderTask.cancel(); } catch(_) {}
        }

        pagesContainer.innerHTML = '';
        loadingIndicator.style.display = 'flex';

        const page = await pdfDoc.getPage(pageNum);
        const unscaledViewport = page.getViewport({ scale: 1 });
        const targetWidth = Math.min(window.innerWidth - 48, 860);
        const baseScale = targetWidth / unscaledViewport.width;
        const scale = baseScale * (zoomLevel / 100);
        const viewport = page.getViewport({ scale });

        const pageWrap = document.createElement('div');
        pageWrap.className = 'page-container';
        pageWrap.style.width = Math.round(viewport.width) + 'px';
        pageWrap.style.height = Math.round(viewport.height) + 'px';

        const canvas = document.createElement('canvas');
        canvas.className = 'page-canvas';
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        canvas.style.width = Math.round(viewport.width) + 'px';
        canvas.style.height = Math.round(viewport.height) + 'px';
        pageWrap.appendChild(canvas);
        pagesContainer.appendChild(pageWrap);

        const ctx = canvas.getContext('2d');
        renderTask = page.render({ canvasContext: ctx, viewport: viewport });
        await renderTask.promise;

        // PDF stream is permanently sanitized and naturally blurred by Python (PyMuPDF + OpenCV)
        loadingIndicator.style.display = 'none';
        updateControls();
      }

      function updateControls() {
        pageIndicator.textContent = 'Page ' + currentPageNum + ' / ' + totalPages;
        zoomIndicator.textContent = zoomLevel + '%';
        btnPrevPage.disabled = currentPageNum <= 1;
        btnNextPage.disabled = currentPageNum >= totalPages;
      }

      btnPrevPage.addEventListener('click', () => {
        if (currentPageNum > 1) {
          currentPageNum--;
          renderPage(currentPageNum);
        }
      });

      btnNextPage.addEventListener('click', () => {
        if (currentPageNum < totalPages) {
          currentPageNum++;
          renderPage(currentPageNum);
        }
      });

      btnZoomIn.addEventListener('click', () => {
        if (zoomLevel < 200) {
          zoomLevel += 15;
          renderPage(currentPageNum);
        }
      });

      btnZoomOut.addEventListener('click', () => {
        if (zoomLevel > 60) {
          zoomLevel -= 15;
          renderPage(currentPageNum);
        }
      });

      btnZoomReset.addEventListener('click', () => {
        zoomLevel = 100;
        renderPage(currentPageNum);
      });

      // Load Document
      async function init() {
        try {
          const pdfjs = window.pdfjsLib;
          if (!pdfjs) throw new Error('PDF.js engine is not ready');
          const loadingTask = pdfjs.getDocument({ url: RAW_PDF_URL });
          pdfDoc = await loadingTask.promise;
          totalPages = pdfDoc.numPages || 1;
          renderPage(1);
        } catch(err) {
          console.error('Failed to load PDF in viewer:', err);
          loadingIndicator.innerHTML = '<p style="color: #ef4444; font-weight: 600;">⚠️ Could not render resume PDF.</p><p style="margin-top: 6px; font-size: 13px;">Please check the original attachment or download the file directly.</p>';
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    })();
  </script>
</body>
</html>`;
}
