import { verifyVolunteerOtp, fetchResumeStream, getZohoConfig, getAccessToken } from './zohoService.js';

/**
 * Helper to parse JSON body from incoming request stream
 */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', err => reject(err));
  });
}

/**
 * Helper to send JSON response
 */
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

/**
 * Connect/Express compatible middleware for Zoho API proxying
 */
export function zohoProxyMiddleware(req, res, next) {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // 1. Health & config status endpoint
  if (pathname === '/api/health' && req.method === 'GET') {
    const config = getZohoConfig();
    const isConfigured = Boolean(config.customApiUrl && !config.customApiUrl.includes('YOUR_CUSTOM_API'));
    return sendJson(res, 200, {
      status: 'ok',
      configured: isConfigured,
      hasOAuth: config.hasOAuth
    });
  }

  // Debug probing endpoint
  if (pathname === '/api/debug-zoho' && req.method === 'POST') {
    readJsonBody(req).then(async body => {
      const config = getZohoConfig();
      const token = await getAccessToken();
      const targetUrl = body.url || config.customApiUrl;
      const resZoho = await fetch(targetUrl, {
        method: body.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Zoho-oauthtoken ${token}`
        },
        body: body.payload ? JSON.stringify(body.payload) : undefined
      });
      const t = await resZoho.text();
      return sendJson(res, 200, { status: resZoho.status, body: t });
    }).catch(err => sendJson(res, 500, { error: err.message }));
    return;
  }

  // 2. Volunteer OTP Login endpoint
  if (pathname === '/api/volunteer/login' && req.method === 'POST') {
    console.log('[Zoho Proxy] Received POST /api/volunteer/login');
    readJsonBody(req)
      .then(async body => {
        const vOtp = body.vOtp || body.V_OTP || body.otp;
        console.log(`[Zoho Proxy] Verifying Volunteer OTP: "${vOtp}"`);
        const result = await verifyVolunteerOtp(vOtp);
        if (!result.success) {
          console.warn(`[Zoho Proxy] Verification failed (Status ${result.status}): ${result.message}`);
          return sendJson(res, result.status || 400, {
            success: false,
            message: result.message
          });
        }
        console.log(`[Zoho Proxy] Verification succeeded for volunteer: "${result.volunteerName}" (${result.students?.length || 0} students)`);
        return sendJson(res, 200, result);
      })
      .catch(err => {
        console.error('[Zoho Proxy] Request parsing error:', err.message);
        return sendJson(res, 400, {
          success: false,
          message: err.message || 'Error processing login request'
        });
      });
    return;
  }

  // 3. Secure Resume Download/View Proxy
  if ((pathname === '/api/resume/download' || pathname === '/api/resume/view') && req.method === 'GET') {
    const resumeUrl = urlObj.searchParams.get('url');
    const defaultMode = pathname === '/api/resume/view' ? 'view' : 'download';
    const modeParam = urlObj.searchParams.get('mode');
    const mode = modeParam ? (modeParam === 'download' ? 'download' : 'view') : defaultMode;
    const studentName = urlObj.searchParams.get('name') || 'Student';

    if (!resumeUrl) {
      return sendJson(res, 400, { success: false, message: 'Missing resume URL parameter' });
    }

    fetchResumeStream(resumeUrl, mode, studentName)
      .then(result => {
        if (!result.success) {
          return sendJson(res, result.status || 500, { success: false, message: result.message });
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', result.contentType);
        res.setHeader('Content-Disposition', result.disposition);
        res.setHeader('Content-Length', result.buffer.length);
        res.setHeader('Accept-Ranges', 'bytes');
        res.end(result.buffer);
      })
      .catch(err => {
        return sendJson(res, 500, { success: false, message: err.message });
      });
    return;
  }

  // Not an API route, hand off to next middleware
  if (next) {
    next();
  }
}
