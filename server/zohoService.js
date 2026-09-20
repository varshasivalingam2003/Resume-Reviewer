/**
 * Server-side Zoho Creator Service & Secure Proxy
 * Handles Zoho OAuth token caching, Custom API communication, student record normalization,
 * and secure resume attachment streaming without exposing secrets to the frontend.
 */

import fs from 'node:fs';

let cachedAccessToken = null;
let tokenExpiresAt = 0;

/**
 * Get configuration from environment variables
 */
export function getZohoConfig() {
  const customApiUrl = process.env.ZOHO_CUSTOM_API_URL || '';
  const clientId = process.env.ZOHO_CLIENT_ID || '';
  const clientSecret = process.env.ZOHO_CLIENT_SECRET || '';
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN || '';
  const accountsUrl = (process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com').replace(/\/+$/, '');
  
  // Try to derive default creator domain from Custom API URL if available
  let defaultCreatorBase = 'https://creator.zoho.com';
  if (customApiUrl) {
    try {
      const parsed = new URL(customApiUrl);
      defaultCreatorBase = `${parsed.protocol}//${parsed.host}`;
    } catch (_) {}
  }
  const creatorBaseUrl = (process.env.ZOHO_CREATOR_BASE_URL || defaultCreatorBase).replace(/\/+$/, '');

  return {
    customApiUrl,
    clientId,
    clientSecret,
    refreshToken,
    accountsUrl,
    creatorBaseUrl,
    hasOAuth: Boolean(clientId && clientSecret && refreshToken)
  };
}

/**
 * Obtain or refresh a Zoho OAuth access token
 */
export async function getAccessToken() {
  const config = getZohoConfig();
  if (!config.hasOAuth) {
    return null;
  }

  // Return cached token if valid (with 5 min safety buffer)
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 300000) {
    return cachedAccessToken;
  }

  const tokenUrl = `${config.accountsUrl}/oauth/v2/token`;
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: config.refreshToken
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('[Zoho Proxy] OAuth token refresh failed:', errText);
    throw new Error('Failed to refresh Zoho OAuth token');
  }

  const data = await response.json();
  if (!data.access_token) {
    console.error('[Zoho Proxy] Invalid token response:', data);
    throw new Error(data.error || 'Zoho OAuth failed to return access token');
  }

  cachedAccessToken = data.access_token;
  const expiresIn = Number(data.expires_in) || 3600;
  tokenExpiresAt = Date.now() + (expiresIn * 1000);

  console.log(`[Zoho Proxy] OAuth token refreshed successfully. Scope: "${data.scope || 'N/A'}", expires in: ${expiresIn}s`);

  return cachedAccessToken;
}

/**
 * Normalizes student record from various Zoho Creator formats
 */
function normalizeStudent(raw, index = 0) {
  if (!raw || typeof raw !== 'object') return null;

  const name = raw.Student_Name || raw.student_name || raw.Name || raw.name || raw.StudentName || `Student ${index + 1}`;
  const studentId = String(raw.Student_ID || raw.student_id || raw.StudentID || raw.ID || raw.id || `STU-${1000 + index}`);
  const sOtp = String(raw.S_OTP || raw.s_otp || raw.SOtp || raw.otp || raw.OTP || '');
  const email = raw.Email || raw.email || raw.Email_Address || raw.email_address || '';
  const phone = raw.Phone || raw.phone || raw.Phone_Number || raw.phone_number || raw.Mobile || raw.mobile || '';
  const whatsapp = raw.WhatsApp || raw.whatsapp || raw.WhatsApp_Number || raw.whatsapp_number || phone;
  const gender = raw.Gender || raw.gender || '';
  const resumeAttachment = raw.Resume_Attachment || raw.resume_attachment || raw.Resume || raw.resume || raw.Attachment || raw.attachment || raw.Resume_Upload || raw.resume_upload || '';
  const hasResumeUploaded = Boolean(resumeAttachment && typeof resumeAttachment === 'string' && resumeAttachment.trim().length > 0);

  return {
    id: studentId || `student-${index + 1}`,
    studentId: studentId,
    name: name,
    sOtp: sOtp,
    otp: sOtp || '101010',
    email: email,
    phone: phone,
    whatsapp: whatsapp,
    gender: gender,
    resumeAttachment: resumeAttachment,
    hasResumeUploaded: hasResumeUploaded,

    // Sane fallback fields for the existing review workspace UI
    degree: raw.Degree || raw.degree || raw.Course || raw.course || 'B.Tech Computer Science',
    institution: raw.Institution || raw.institution || raw.College || raw.college || 'Institute of Technology',
    graduationYear: String(raw.Graduation_Year || raw.graduation_year || raw.Year || raw.year || '2025'),
    location: raw.Location || raw.location || 'India',
    github: raw.GitHub || raw.github || (email ? `github.com/${email.split('@')[0]}` : ''),
    linkedin: raw.LinkedIn || raw.linkedin || (name ? `linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}` : ''),
    avatar: raw.Avatar || raw.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80`,
    status: (raw.Status || raw.status || 'pending').toLowerCase().replace(/\s+/g, '_'),
    assignedDate: raw.Assigned_Date || raw.assigned_date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    totalPages: 2,
    rating: Number(raw.Rating || raw.rating) || 0,
    improveTags: Array.isArray(raw.Improve_Tags || raw.improveTags) ? (raw.Improve_Tags || raw.improveTags) : [],
    generalFeedback: raw.General_Feedback || raw.generalFeedback || '',
    volunteerSubtopics: Array.isArray(raw.Volunteer_Subtopics || raw.volunteerSubtopics) ? (raw.Volunteer_Subtopics || raw.volunteerSubtopics) : [],
    resumeSections: Array.isArray(raw.Resume_Sections || raw.resumeSections) ? (raw.Resume_Sections || raw.resumeSections) : []
  };
}

/**
 * Verify Volunteer OTP via Zoho Creator Custom API
 * @param {string} vOtp
 */
export async function verifyVolunteerOtp(vOtp) {
  const cleanOtp = String(vOtp || '').trim();
  if (!cleanOtp) {
    return { success: false, status: 400, message: 'Volunteer OTP is required' };
  }

  const config = getZohoConfig();
  if (!config.customApiUrl || config.customApiUrl.includes('YOUR_CUSTOM_API')) {
    return {
      success: false,
      status: 500,
      message: 'Zoho Creator Custom API URL is not configured. Please paste your Custom API URL into .env (ZOHO_CUSTOM_API_URL).'
    };
  }

  // Use configured Custom API URL directly
  const targetUrl = config.customApiUrl;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  // Attach OAuth token if configured
  if (config.hasOAuth) {
    try {
      const token = await getAccessToken();
      if (token) {
        headers['Authorization'] = `Zoho-oauthtoken ${token}`;
      }
    } catch (authErr) {
      console.error('[Zoho Proxy] Failed to get OAuth token:', authErr.message);
      return { success: false, status: 502, message: 'Zoho authentication failed: ' + authErr.message };
    }
  }

  // Exact request body required by Zoho Custom API
  const payload = {
    vOtp: cleanOtp
  };

  console.log(`[Zoho Proxy] Target Custom API URL: ${targetUrl}`);
  console.log(`[Zoho Proxy] Request Body:`, JSON.stringify(payload));

  let response;
  try {
    response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
  } catch (networkErr) {
    console.error('[Zoho Proxy] Network error calling Zoho Creator API:', networkErr.message);
    return {
      success: false,
      status: 503,
      message: 'Unable to connect to Zoho Creator backend. Please verify your network and Custom API URL.'
    };
  }

  const rawText = await response.text();
  console.log(`[Zoho Proxy] Zoho Custom API HTTP Status: ${response.status}`);
  console.log(`[Zoho Proxy] Safe Zoho Response:`, rawText);
  try {
    fs.writeFileSync('/Users/logesh/.gemini/antigravity-ide/brain/87b50c2b-bf47-48ff-8ef9-897b800d4751/scratch/last_zoho_response.json', rawText);
  } catch (_) {}

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (parseErr) {
    console.error('[Zoho Proxy] Non-JSON response from Zoho API:', rawText.slice(0, 300));
    return {
      success: false,
      status: 502,
      message: `Zoho Creator returned non-JSON response (HTTP ${response.status})`
    };
  }

  // Check if result contains a stringified JSON (common in Deluge returns)
  if (data && typeof data.result === 'string') {
    try {
      data.result = JSON.parse(data.result);
    } catch (_) {}
  }

  // Check for error responses from Zoho or Deluge
  const hasError = 
    response.status >= 400 ||
    data.code === 404 ||
    data.code === 401 ||
    data.code === 2945 ||
    data.code === 1030 ||
    data.code === 3001 ||
    data.status === 'error' ||
    data.status === 'failed' ||
    (typeof data.error === 'string' && data.error.length > 0);

  if (hasError) {
    const errorString = (
      data.description ||
      data.error || 
      data.message || 
      data.result?.message || 
      data.result?.error || 
      ''
    );

    const lower = errorString.toLowerCase();
    const isExplicitOtpError = 
      lower === 'invalid otp' || 
      lower === 'invalid volunteer otp' || 
      lower.includes('volunteer not found') || 
      lower.includes('incorrect otp');

    const safeMessage = isExplicitOtpError 
      ? 'Invalid Volunteer OTP' 
      : (errorString || `Zoho Creator error (HTTP ${response.status})`);

    return {
      success: false,
      status: response.status >= 400 ? response.status : 400,
      message: safeMessage
    };
  }

  // Extract Volunteer Name
  const volunteerName = 
    data.volunteer_name ||
    data.volunteerName ||
    data.Volunteer_Name ||
    data.volunteer?.name ||
    data.volunteer?.Volunteer_Name ||
    data.result?.volunteer_name ||
    data.result?.volunteer?.name ||
    data.result?.Volunteer_Name ||
    data.name ||
    'Volunteer';

  // Extract Students List
  let rawStudents = 
    data.students ||
    data.assigned_students ||
    data.result?.students ||
    data.result?.assigned_students ||
    data.data ||
    data.result?.data ||
    (Array.isArray(data.result) ? data.result : null) ||
    (Array.isArray(data) ? data : null);

  if (!rawStudents) {
    rawStudents = [];
  } else if (!Array.isArray(rawStudents) && typeof rawStudents === 'object') {
    // In case students was returned as an object map
    rawStudents = Object.values(rawStudents);
  }

  const students = rawStudents.map((s, idx) => normalizeStudent(s, idx)).filter(Boolean);

  if (students.length === 0) {
    return {
      success: true,
      volunteerName,
      students: [],
      message: 'No students assigned'
    };
  }

  return {
    success: true,
    volunteerName,
    students
  };
}

/**
 * Securely fetch resume attachment from Zoho Creator
 * @param {string} fileUrl
 * @param {'view'|'download'} mode
 * @param {string} studentName
 */
export async function fetchResumeStream(fileUrl, mode = 'view', studentName = 'Resume') {
  if (!fileUrl || typeof fileUrl !== 'string') {
    return { success: false, status: 400, message: 'Resume attachment URL is missing' };
  }

  let targetUrl = fileUrl.trim();

  // For Zoho Creator attachment download relative paths (/api/v2.1/...), creator.zoho.com is the required domain
  let creatorBase = (process.env.ZOHO_CREATOR_BASE_URL || 'https://creator.zoho.com').replace(/\/+$/, '');
  if (targetUrl.startsWith('/api/v2.1/')) {
    creatorBase = 'https://creator.zoho.com';
  }

  // If path is relative, prepend Zoho Creator base URL
  if (targetUrl.startsWith('/')) {
    targetUrl = `${creatorBase}${targetUrl}`;
  }

  // Extract student record ID safely from path for temporary debugging log
  const recordIdMatch = fileUrl.match(/\/report\/[^/]+\/([0-9]+)\//) || targetUrl.match(/\/report\/[^/]+\/([0-9]+)\//);
  const studentRecordId = recordIdMatch ? recordIdMatch[1] : 'N/A';

  // Safe temporary debug logs (no tokens or secrets logged)
  console.log(`[Zoho Resume Proxy] Student Record ID: ${studentRecordId}`);
  console.log(`[Zoho Resume Proxy] Relative Resume Path: ${fileUrl}`);
  console.log(`[Zoho Resume Proxy] Final Zoho Resume URL: ${targetUrl}`);

  const config = getZohoConfig();
  const headers = {};
  if (config.hasOAuth) {
    try {
      const token = await getAccessToken();
      if (token) {
        headers['Authorization'] = `Zoho-oauthtoken ${token}`;
      }
    } catch (err) {
      console.error('[Zoho Proxy] OAuth error on file fetch:', err.message);
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers
    });

    console.log(`[Zoho Resume Proxy] Zoho HTTP Status: ${response.status}`);
    console.log(`[Zoho Resume Proxy] Response Content-Type: ${response.headers.get('content-type')}`);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: `Failed to fetch resume from Zoho Creator (status ${response.status})`
      };
    }

    const rawContentType = response.headers.get('content-type') || 'application/pdf';
    // For PDF resumes, return clean application/pdf
    const contentType = rawContentType.toLowerCase().includes('application/pdf')
      ? 'application/pdf'
      : rawContentType;

    const safeBaseName = (studentName || 'Student').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeBaseName}_Resume.pdf`;

    const disposition = mode === 'download' 
      ? `attachment; filename="${filename}"`
      : `inline; filename="${filename}"`;

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      success: true,
      buffer,
      contentType,
      disposition
    };
  } catch (err) {
    console.error('[Zoho Proxy] Error streaming resume:', err.message);
    return {
      success: false,
      status: 500,
      message: 'Error fetching resume: ' + err.message
    };
  }
}
