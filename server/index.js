import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zohoProxyMiddleware } from './proxyMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// --------------------------------------------------
// Simple .env parser if running outside of Vite
// EXISTING CODE - UNCHANGED
// --------------------------------------------------

const envPath = path.join(rootDir, '.env');

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(
    envPath,
    'utf-8'
  );

  content
    .split('\n')
    .forEach(line => {
      const trimmed =
        line.trim();

      if (
        !trimmed ||
        trimmed.startsWith('#')
      ) {
        return;
      }

      const eqIdx =
        trimmed.indexOf('=');

      if (eqIdx !== -1) {
        const key =
          trimmed
            .slice(0, eqIdx)
            .trim();

        const val =
          trimmed
            .slice(eqIdx + 1)
            .trim();

        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
}

const PORT =
  process.env.PORT ||
  5001;


// ==================================================
// SUPABASE MODULE LOADER
//
// Dynamic imports are intentionally used here.
//
// Reason:
// index.js manually loads .env above.
// Static imports would execute before the .env parser.
// ==================================================

let supabaseModulesPromise = null;

async function getSupabaseModules() {
  if (!supabaseModulesPromise) {
    supabaseModulesPromise =
      Promise.all([
        import('./supabaseClient.js'),
        import('./volunteerSync.js'),
        import('./studentSync.js'),
        import('./mappingSync.js'),
        import('./resumeSync.js')
      ]).then(
        ([
          supabaseModule,
          volunteerSyncModule,
          studentSyncModule,
          mappingSyncModule,
          resumeSyncModule
        ]) => {
          return {
            supabase:
              supabaseModule.supabase,

            syncVolunteerByOtp:
              volunteerSyncModule
                .syncVolunteerByOtp,

            syncStudentsToSupabase:
              studentSyncModule
                .syncStudentsToSupabase,

            syncVolunteerStudentMappings:
              mappingSyncModule
                .syncVolunteerStudentMappings,

            syncResumesToSupabase:
              resumeSyncModule
                .syncResumesToSupabase
          };
        }
      );
  }

  return supabaseModulesPromise;
}


// ==================================================
// JSON RESPONSE HELPER
// ==================================================

function sendJson(
  res,
  statusCode,
  payload
) {
  res.statusCode =
    statusCode;

  res.setHeader(
    'Content-Type',
    'application/json; charset=utf-8'
  );

  res.end(
    JSON.stringify(payload)
  );
}


// ==================================================
// REQUEST BODY READER
// ==================================================

function readJsonBody(req) {
  return new Promise(
    (resolve, reject) => {
      let body = '';

      const MAX_BODY_SIZE =
        1024 * 1024;

      req.on(
        'data',
        chunk => {
          body +=
            chunk.toString();

          if (
            Buffer.byteLength(body) >
            MAX_BODY_SIZE
          ) {
            reject(
              new Error(
                'Request body is too large'
              )
            );

            req.destroy();
          }
        }
      );

      req.on(
        'end',
        () => {
          if (!body.trim()) {
            resolve({});
            return;
          }

          try {
            resolve(
              JSON.parse(body)
            );
          } catch (_) {
            reject(
              new Error(
                'Invalid JSON request body'
              )
            );
          }
        }
      );

      req.on(
        'error',
        reject
      );
    }
  );
}


// ==================================================
// CREATE PRIVATE RESUME SIGNED URL
// ==================================================

async function createResumeSignedUrl(
  supabase,
  resume
) {
  if (
    !resume ||
    !resume.storage_bucket ||
    !resume.storage_path
  ) {
    return null;
  }

  const {
    data,
    error
  } = await supabase.storage
    .from(
      resume.storage_bucket
    )
    .createSignedUrl(
      resume.storage_path,
      60 * 60
    );

  if (error) {
    console.warn(
      '[Supabase Login] Unable to create resume signed URL:',
      error.message
    );

    return null;
  }

  return (
    data?.signedUrl ||
    null
  );
}


// ==================================================
// READ VOLUNTEER DASHBOARD FROM SUPABASE
// ==================================================

async function getVolunteerFromSupabase(
  vOtp
) {
  const {
    supabase
  } =
    await getSupabaseModules();

  // --------------------------------------------------
  // VOLUNTEER
  // --------------------------------------------------

  const {
    data: volunteer,
    error: volunteerError
  } = await supabase
    .from('volunteers')
    .select('*')
    .eq(
      'v_otp',
      vOtp
    )
    .maybeSingle();

  if (volunteerError) {
    throw new Error(
      `Unable to read volunteer from Supabase: ${volunteerError.message}`
    );
  }

  if (!volunteer) {
    return null;
  }

  // --------------------------------------------------
  // VOLUNTEER -> STUDENT MAPPINGS
  // --------------------------------------------------

  const {
    data: mappings,
    error: mappingError
  } = await supabase
    .from(
      'volunteer_student_mappings'
    )
    .select(
      'student_id,event_code,mapping_status,assigned_at'
    )
    .eq(
      'volunteer_id',
      volunteer.id
    );

  if (mappingError) {
    throw new Error(
      `Unable to read volunteer-student mappings: ${mappingError.message}`
    );
  }

  const studentIds =
    Array.from(
      new Set(
        (mappings || [])
          .map(
            item =>
              item.student_id
          )
          .filter(Boolean)
      )
    );

  // --------------------------------------------------
  // NO ASSIGNED STUDENTS
  // --------------------------------------------------

  if (
    studentIds.length === 0
  ) {
    return {
      success: true,

      source:
        'supabase',

      volunteerName:
        volunteer.full_name ||
        'Volunteer',

      volunteer,

      students: [],

      totalStudents:
        0,

      message:
        'No students assigned'
    };
  }

  // --------------------------------------------------
  // STUDENTS
  // --------------------------------------------------

  const {
    data: students,
    error: studentsError
  } = await supabase
    .from('students')
    .select('*')
    .in(
      'id',
      studentIds
    );

  if (studentsError) {
    throw new Error(
      `Unable to read students from Supabase: ${studentsError.message}`
    );
  }

  // --------------------------------------------------
  // CURRENT RESUMES
  // --------------------------------------------------

  const {
    data: resumes,
    error: resumesError
  } = await supabase
    .from('resumes')
    .select('*')
    .in(
      'student_id',
      studentIds
    )
    .eq(
      'is_current',
      true
    );

  if (resumesError) {
    throw new Error(
      `Unable to read resumes from Supabase: ${resumesError.message}`
    );
  }

  // --------------------------------------------------
  // MAP CURRENT RESUME BY STUDENT
  // --------------------------------------------------

  const resumeByStudent =
    new Map();

  for (
    const resume
    of resumes || []
  ) {
    if (
      !resumeByStudent.has(
        resume.student_id
      )
    ) {
      resumeByStudent.set(
        resume.student_id,
        resume
      );
    }
  }

  // --------------------------------------------------
  // CREATE FRONTEND STUDENT RESPONSE
  // --------------------------------------------------

  const responseStudents = [];

  for (
    const student
    of students || []
  ) {
    const resume =
      resumeByStudent.get(
        student.id
      ) ||
      null;

    const signedResumeUrl =
      await createResumeSignedUrl(
        supabase,
        resume
      );

    responseStudents.push({
      // Supabase internal ID
      supabaseId:
        student.id,

      // Zoho record reference
      zohoRecordId:
        student.zoho_record_id,

      // Existing frontend-style values
      id:
        student.student_id ||
        student.id,

      studentId:
        student.student_id ||
        '',

      name:
        student.name ||
        'Student',

      sOtp:
        student.s_otp ||
        '',

      otp:
        student.s_otp ||
        '',

      email:
        student.email ||
        '',

      phone:
        student.phone ||
        '',

      whatsapp:
        student.whatsapp ||
        '',

      gender:
        student.gender ||
        '',

      eventCode:
        student.event_code ||
        '',

      // Resume
      hasResumeUploaded:
        Boolean(resume),

      resumeAttachment:
        signedResumeUrl ||
        '',

      resume: resume
        ? {
          id:
            resume.id,

          fileName:
            resume.original_file_name,

          mimeType:
            resume.mime_type,

          fileSize:
            resume.file_size,

          version:
            resume.version,

          storagePath:
            resume.storage_path,

          signedUrl:
            signedResumeUrl
        }
        : null
    });
  }

  // --------------------------------------------------
  // KEEP MAPPING ORDER
  // --------------------------------------------------

  const studentOrder =
    new Map(
      studentIds.map(
        (id, index) => [
          id,
          index
        ]
      )
    );

  responseStudents.sort(
    (a, b) => {
      return (
        (
          studentOrder.get(
            a.supabaseId
          ) ?? 9999
        ) -
        (
          studentOrder.get(
            b.supabaseId
          ) ?? 9999
        )
      );
    }
  );

  // --------------------------------------------------
  // SUCCESS
  // --------------------------------------------------

  return {
    success: true,

    source:
      'supabase',

    volunteerName:
      volunteer.full_name ||
      'Volunteer',

    volunteer,

    students:
      responseStudents,

    totalStudents:
      responseStudents.length,

    message:
      'Volunteer data fetched from Supabase'
  };
}


// ==================================================
// ZOHO -> SUPABASE FALLBACK SYNC
//
// IMPORTANT:
//
// ZOHO CREATOR:
// - READ ONLY
// - NO CREATE
// - NO UPDATE
// - NO DELETE
//
// SUPABASE:
// - Volunteer UPSERT
// - Student UPSERT
// - Mapping INSERT / UPDATE
// - Resume Storage / Metadata
// ==================================================

async function syncVolunteerFromZoho(
  vOtp
) {
  const {
    syncVolunteerByOtp,
    syncStudentsToSupabase,
    syncVolunteerStudentMappings,
    syncResumesToSupabase
  } =
    await getSupabaseModules();

  // --------------------------------------------------
  // STEP 1
  // VOLUNTEER + STUDENTS
  // --------------------------------------------------

  const volunteerResult =
    await syncVolunteerByOtp(
      vOtp
    );

  if (
    !volunteerResult ||
    !volunteerResult.success
  ) {
    return {
      success: false,

      message:
        volunteerResult
          ?.message ||
        'Volunteer not found'
    };
  }

  const sourceStudents =
    Array.isArray(
      volunteerResult.students
    )
      ? volunteerResult.students
      : [];

  // --------------------------------------------------
  // STEP 2
  // STUDENTS
  // --------------------------------------------------

  const studentResult =
    await syncStudentsToSupabase(
      sourceStudents
    );

  if (
    !studentResult ||
    !studentResult.success
  ) {
    return {
      success: false,

      message:
        studentResult
          ?.message ||
        'Student sync failed'
    };
  }

  // --------------------------------------------------
  // STEP 3
  // MAPPINGS
  // --------------------------------------------------

  const mappingResult =
    await syncVolunteerStudentMappings(
      volunteerResult.volunteer,
      studentResult.students || []
    );

  if (
    !mappingResult ||
    !mappingResult.success
  ) {
    return {
      success: false,

      message:
        mappingResult
          ?.message ||
        'Mapping sync failed'
    };
  }

  // --------------------------------------------------
  // STEP 4
  // RESUMES
  // --------------------------------------------------

  const resumeResult =
    await syncResumesToSupabase(
      sourceStudents,
      studentResult.students || []
    );

  if (
    !resumeResult ||
    !resumeResult.success
  ) {
    return {
      success: false,

      message:
        resumeResult
          ?.message ||
        'Resume sync failed'
    };
  }

  return {
    success: true,

    volunteer:
      volunteerResult.volunteer,

    students:
      studentResult.students || [],

    mappings:
      mappingResult.mappings || [],

    resumes:
      resumeResult.resumes || []
  };
}


// ==================================================
// VOLUNTEER LOGIN ROUTE
//
// POST /api/volunteer/login
//
// BODY:
// {
//   "vOtp": "GE7084"
// }
// ==================================================

async function handleVolunteerLogin(
  req,
  res
) {
  let body;

  try {
    body =
      await readJsonBody(req);
  } catch (error) {
    sendJson(
      res,
      400,
      {
        success: false,
        message:
          error.message
      }
    );

    return;
  }

  const vOtp =
    String(
      body?.vOtp ||
      body?.v_otp ||
      ''
    ).trim();

  if (!vOtp) {
    sendJson(
      res,
      400,
      {
        success: false,
        message:
          'Volunteer OTP is required'
      }
    );

    return;
  }

  try {
    // --------------------------------------------------
    // FIRST TRY SUPABASE
    // --------------------------------------------------

    let result =
      await getVolunteerFromSupabase(
        vOtp
      );

    if (result) {
      console.log(
        `[Volunteer Login] Supabase cache hit: ${vOtp}`
      );

      sendJson(
        res,
        200,
        result
      );

      return;
    }

    // --------------------------------------------------
    // SUPABASE MISS
    // FALL BACK TO READ-ONLY ZOHO
    // --------------------------------------------------

    console.log(
      `[Volunteer Login] Supabase cache miss. Reading Zoho: ${vOtp}`
    );

    const syncResult =
      await syncVolunteerFromZoho(
        vOtp
      );

    if (
      !syncResult ||
      !syncResult.success
    ) {
      sendJson(
        res,
        404,
        {
          success: false,

          source:
            'zoho',

          message:
            syncResult
              ?.message ||
            'Volunteer not found'
        }
      );

      return;
    }

    // --------------------------------------------------
    // READ AGAIN FROM SUPABASE
    // --------------------------------------------------

    result =
      await getVolunteerFromSupabase(
        vOtp
      );

    if (!result) {
      throw new Error(
        'Volunteer was synced but could not be read from Supabase'
      );
    }

    result.source =
      'zoho-sync';

    console.log(
      `[Volunteer Login] Zoho -> Supabase sync completed: ${vOtp}`
    );

    sendJson(
      res,
      200,
      result
    );
  } catch (error) {
    console.error(
      '[Volunteer Login] Error:',
      error
    );

    sendJson(
      res,
      500,
      {
        success: false,

        message:
          error?.message ||
          'Unable to process volunteer login'
      }
    );
  }
}


// ==================================================
// HTTP SERVER
// ==================================================

const server =
  http.createServer(
    async (
      req,
      res
    ) => {
      // --------------------------------------------------
      // Add CORS headers for local development
      // EXISTING BEHAVIOUR PRESERVED
      // --------------------------------------------------

      res.setHeader(
        'Access-Control-Allow-Origin',
        '*'
      );

      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS'
      );

      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
      );

      if (
        req.method ===
        'OPTIONS'
      ) {
        res.statusCode =
          204;

        res.end();

        return;
      }

      // --------------------------------------------------
      // NEW:
      // SUPABASE-FIRST VOLUNTEER LOGIN
      // --------------------------------------------------

      if (
        req.method === 'POST' &&
        req.url ===
        '/api/volunteer/login'
      ) {
        await handleVolunteerLogin(
          req,
          res
        );

        return;
      }

      // --------------------------------------------------
      // EXISTING ZOHO PROXY
      // UNCHANGED
      // --------------------------------------------------

      zohoProxyMiddleware(
        req,
        res,
        () => {
          res.statusCode =
            404;

          res.setHeader(
            'Content-Type',
            'application/json'
          );

          res.end(
            JSON.stringify({
              error:
                'Endpoint not found'
            })
          );
        }
      );
    }
  );


// ==================================================
// START SERVER
// EXISTING PORT PRESERVED
// ==================================================

server.listen(
  PORT,
  () => {
    console.log(
      `[Zoho Backend Proxy] Running on http://localhost:${PORT}`
    );

    console.log(
      `[Supabase Volunteer Login] POST http://localhost:${PORT}/api/volunteer/login`
    );
  }
);