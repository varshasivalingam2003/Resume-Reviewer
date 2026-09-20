import { Student } from '../data/studentsData';

export interface VolunteerLoginResponse {
  success: boolean;
  volunteerName?: string;
  students?: Student[];
  message?: string;
}

/**
 * Client service to communicate with our secure backend proxy
 */
export async function loginVolunteerWithApi(vOtp: string): Promise<VolunteerLoginResponse> {
  const cleanOtp = String(vOtp || '').trim();
  if (!cleanOtp) {
    return { success: false, message: 'Please enter your 6-digit volunteer OTP.' };
  }

  try {
    const response = await fetch('/api/volunteer/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ vOtp: cleanOtp })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || (response.status === 401 ? 'Invalid Volunteer OTP' : 'Unable to connect to Zoho Creator backend.')
      };
    }

    return {
      success: true,
      volunteerName: data.volunteerName || 'Volunteer',
      students: data.students || [],
      message: data.message
    };
  } catch (err: any) {
    console.error('API call to /api/volunteer/login failed:', err);
    return {
      success: false,
      message: 'Unable to connect to server. Please check your connection and ensure the server is running.'
    };
  }
}

/**
 * Generate secure URL for viewing resume inline
 */
export function getResumeViewUrl(resumeAttachment: string, studentName = 'Student'): string {
  if (!resumeAttachment) return '';
  return `/api/resume/download?url=${encodeURIComponent(resumeAttachment)}&mode=view&name=${encodeURIComponent(studentName)}`;
}

/**
 * Generate secure URL for downloading resume file
 */
export function getResumeDownloadUrl(resumeAttachment: string, studentName = 'Student'): string {
  if (!resumeAttachment) return '';
  return `/api/resume/download?url=${encodeURIComponent(resumeAttachment)}&mode=download&name=${encodeURIComponent(studentName)}`;
}
