import { supabase } from './supabaseClient.js';
import { fetchResumeStream } from './zohoService.js';
import { logSyncEvent } from './syncLogger.js';

/**
 * RESUME SYNC
 *
 * ZOHO CREATOR:
 * - READ / DOWNLOAD ONLY
 * - NO CREATE
 * - NO UPDATE
 * - NO DELETE
 *
 * SUPABASE:
 * - Upload resume to private "resumes" bucket
 * - Insert / update resume metadata
 * - Maintain resume versions
 *
 * Allowed:
 * - PDF
 * - DOC
 * - DOCX
 *
 * Not Allowed:
 * - JPG
 * - JPEG
 * - PNG
 * - Images / screenshots
 */

const STORAGE_BUCKET = 'resumes';

const ALLOWED_TYPES = {
    pdf: 'application/pdf',

    doc: 'application/msword',

    docx:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};


// --------------------------------------------------
// SAFE FILE NAME
// --------------------------------------------------

function sanitizeFileName(fileName = 'resume.pdf') {
    return String(fileName)
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');
}


// --------------------------------------------------
// GET FILE NAME FROM ZOHO ATTACHMENT URL
// --------------------------------------------------

function getFileNameFromAttachment(
    attachmentUrl,
    fallbackName = 'resume.pdf'
) {
    try {
        const url = new URL(
            attachmentUrl,
            'https://creator.zoho.com'
        );

        const filepath =
            url.searchParams.get('filepath');

        if (filepath) {
            return sanitizeFileName(
                decodeURIComponent(filepath)
            );
        }
    } catch (_) {
        // Safe fallback below
    }

    return sanitizeFileName(fallbackName);
}


// --------------------------------------------------
// GET EXTENSION
// --------------------------------------------------

function getFileExtension(fileName = '') {
    const parts =
        String(fileName)
            .toLowerCase()
            .split('.');

    if (parts.length < 2) {
        return '';
    }

    return parts.pop();
}


// --------------------------------------------------
// BASIC FILE SIGNATURE VALIDATION
// No OCR / no dependency
// --------------------------------------------------

function isValidFileBuffer(
    buffer,
    extension
) {
    if (
        !Buffer.isBuffer(buffer) ||
        buffer.length === 0
    ) {
        return false;
    }

    // PDF -> %PDF
    if (extension === 'pdf') {
        return (
            buffer.length >= 4 &&
            buffer[0] === 0x25 &&
            buffer[1] === 0x50 &&
            buffer[2] === 0x44 &&
            buffer[3] === 0x46
        );
    }

    // Legacy DOC -> OLE Compound File
    if (extension === 'doc') {
        const signature = [
            0xD0,
            0xCF,
            0x11,
            0xE0,
            0xA1,
            0xB1,
            0x1A,
            0xE1
        ];

        if (buffer.length < signature.length) {
            return false;
        }

        return signature.every(
            (byte, index) =>
                buffer[index] === byte
        );
    }

    // DOCX -> ZIP container
    if (extension === 'docx') {
        return (
            buffer.length >= 4 &&
            buffer[0] === 0x50 &&
            buffer[1] === 0x4B &&
            (
                (
                    buffer[2] === 0x03 &&
                    buffer[3] === 0x04
                ) ||
                (
                    buffer[2] === 0x05 &&
                    buffer[3] === 0x06
                ) ||
                (
                    buffer[2] === 0x07 &&
                    buffer[3] === 0x08
                )
            )
        );
    }

    return false;
}


// --------------------------------------------------
// FIND MATCHING SUPABASE STUDENT
// --------------------------------------------------

function findSyncedStudent(
    sourceStudent,
    syncedStudents
) {
    const sourceZohoId =
        String(
            sourceStudent?.zohoRecordId ||
            ''
        ).trim();

    const sourceStudentId =
        String(
            sourceStudent?.studentId ||
            ''
        ).trim();

    return syncedStudents.find(
        (student) => {
            const syncedZohoId =
                String(
                    student?.zoho_record_id ||
                    ''
                ).trim();

            const syncedStudentId =
                String(
                    student?.student_id ||
                    ''
                ).trim();

            if (
                sourceZohoId &&
                syncedZohoId === sourceZohoId
            ) {
                return true;
            }

            if (
                sourceStudentId &&
                syncedStudentId === sourceStudentId
            ) {
                return true;
            }

            return false;
        }
    );
}


// --------------------------------------------------
// SYNC RESUMES
// --------------------------------------------------

export async function syncResumesToSupabase(
    sourceStudents = [],
    syncedStudents = []
) {
    if (!Array.isArray(sourceStudents)) {
        throw new Error(
            'Source students must be an array'
        );
    }

    if (!Array.isArray(syncedStudents)) {
        throw new Error(
            'Synced students must be an array'
        );
    }

    if (sourceStudents.length === 0) {
        return {
            success: true,
            message: 'No resumes to sync',
            resumes: [],
            skipped: [],
            counts: {
                processed: 0,
                synced: 0,
                skipped: 0,
                failed: 0
            }
        };
    }

    const syncedResumes = [];
    const skipped = [];
    let processedCount = 0;
    let syncedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    // --------------------------------------------------
    // PROCESS EACH STUDENT
    // --------------------------------------------------

    for (const sourceStudent of sourceStudents) {
        const resumeAttachment =
            String(
                sourceStudent?.resumeAttachment ||
                ''
            ).trim();

        const studentName =
            String(
                sourceStudent?.name ||
                'Student'
            ).trim();

        const sourceZohoId =
            sourceStudent?.zohoRecordId
                ? String(sourceStudent.zohoRecordId).trim()
                : null;

        // --------------------------------------------------
        // RESUME NOT AVAILABLE
        // --------------------------------------------------

        if (!resumeAttachment) {
            processedCount += 1;
            skippedCount += 1;
            skipped.push({
                student:
                    studentName,

                reason:
                    'Resume not uploaded'
            });

            continue;
        }

        // --------------------------------------------------
        // FIND SUPABASE STUDENT ROW
        // --------------------------------------------------

        const syncedStudent =
            findSyncedStudent(
                sourceStudent,
                syncedStudents
            );

        if (!syncedStudent?.id) {
            processedCount += 1;
            skippedCount += 1;
            skipped.push({
                student:
                    studentName,

                reason:
                    'Matching Supabase student not found'
            });

            continue;
        }

        // --------------------------------------------------
        // GET ORIGINAL FILE NAME
        // --------------------------------------------------

        const fallbackName =
            `${sourceStudent.studentId || studentName}_Resume.pdf`;

        const originalFileName =
            getFileNameFromAttachment(
                resumeAttachment,
                fallbackName
            );

        const extension =
            getFileExtension(
                originalFileName
            );

        // --------------------------------------------------
        // ALLOW ONLY PDF / DOC / DOCX
        // --------------------------------------------------

        if (!ALLOWED_TYPES[extension]) {
            await logSyncEvent({
                entityType: 'resume',
                zohoRecordId: sourceZohoId,
                operation: 'sync',
                syncStatus: 'skipped',
                errorMessage: 'Unsupported file type'
            });

            processedCount += 1;
            skippedCount += 1;
            skipped.push({
                student:
                    studentName,

                file:
                    originalFileName,

                reason:
                    'Unsupported file type. Only PDF, DOC and DOCX are allowed.'
            });

            continue;
        }

        // --------------------------------------------------
        // READ-ONLY DOWNLOAD FROM ZOHO
        // --------------------------------------------------

        console.log(
            `[Resume Sync] Downloading resume for ${studentName}...`
        );

        const zohoFile =
            await fetchResumeStream(
                resumeAttachment,
                'view',
                studentName
            );

        if (
            !zohoFile ||
            !zohoFile.success
        ) {
            await logSyncEvent({
                entityType: 'resume',
                zohoRecordId: sourceZohoId,
                operation: 'sync',
                syncStatus: 'failed',
                errorMessage:
                    zohoFile?.message ||
                    'Unable to fetch resume from Zoho'
            });

            processedCount += 1;
            skippedCount += 1;
            failedCount += 1;
            skipped.push({
                student:
                    studentName,

                file:
                    originalFileName,

                reason:
                    zohoFile?.message ||
                    'Unable to fetch resume from Zoho'
            });

            continue;
        }

        const fileBuffer =
            zohoFile.buffer;

        // --------------------------------------------------
        // VERIFY ACTUAL FILE CONTENT
        // --------------------------------------------------

        if (
            !isValidFileBuffer(
                fileBuffer,
                extension
            )
        ) {
            await logSyncEvent({
                entityType: 'resume',
                zohoRecordId: sourceZohoId,
                operation: 'sync',
                syncStatus: 'failed',
                errorMessage:
                    'File content does not match an allowed PDF/DOC/DOCX format'
            });

            processedCount += 1;
            skippedCount += 1;
            failedCount += 1;
            skipped.push({
                student:
                    studentName,

                file:
                    originalFileName,

                reason:
                    'File content does not match an allowed PDF/DOC/DOCX format'
            });

            continue;
        }

        const mimeType =
            ALLOWED_TYPES[extension];

        const fileSize =
            fileBuffer.length;

        // Supabase bucket configured for 10 MB
        const MAX_FILE_SIZE =
            10 * 1024 * 1024;

        if (fileSize > MAX_FILE_SIZE) {
            await logSyncEvent({
                entityType: 'resume',
                zohoRecordId: sourceZohoId,
                operation: 'sync',
                syncStatus: 'failed',
                errorMessage:
                    'Resume exceeds the 10 MB file-size limit'
            });

            processedCount += 1;
            skippedCount += 1;
            failedCount += 1;
            skipped.push({
                student:
                    studentName,

                file:
                    originalFileName,

                reason:
                    'Resume exceeds the 10 MB file-size limit'
            });

            continue;
        }

        // --------------------------------------------------
        // CHECK CURRENT RESUME
        // --------------------------------------------------

        const {
            data: currentResume,
            error: currentResumeError
        } = await supabase
            .from('resumes')
            .select('*')
            .eq(
                'student_id',
                syncedStudent.id
            )
            .eq(
                'is_current',
                true
            )
            .order(
                'version',
                {
                    ascending: false
                }
            )
            .limit(1)
            .maybeSingle();

        if (currentResumeError) {
            await logSyncEvent({
                entityType: 'resume',
                zohoRecordId: sourceZohoId,
                operation: 'sync',
                syncStatus: 'failed',
                errorMessage:
                    `Unable to check existing resume: ${currentResumeError.message}`
            });

            throw new Error(
                `Unable to check existing resume: ${currentResumeError.message}`
            );
        }

        // --------------------------------------------------
        // SKIP SAME FILE WHEN NOTHING APPEARS CHANGED
        // --------------------------------------------------

        if (
            currentResume &&
            currentResume.original_file_name ===
            originalFileName &&
            Number(
                currentResume.file_size || 0
            ) === fileSize
        ) {
            console.log(
                `[Resume Sync] Existing resume unchanged for ${studentName}. Skipped.`
            );

            await logSyncEvent({
                entityType: 'resume',
                zohoRecordId: sourceZohoId,
                operation: 'sync',
                syncStatus: 'skipped',
                errorMessage: 'Resume unchanged',
                payload: {
                    student_id:
                        syncedStudent.id,
                    file_name:
                        originalFileName,
                    version:
                        currentResume.version,
                    storage_path:
                        currentResume.storage_path
                }
            });

            processedCount += 1;
            skippedCount += 1;

            continue;
        }

        // --------------------------------------------------
        // VERSION
        // --------------------------------------------------

        const nextVersion =
            currentResume
                ? Number(
                    currentResume.version || 1
                ) + 1
                : 1;

        const safeFileName =
            sanitizeFileName(
                originalFileName
            );

        const storagePath =
            `${syncedStudent.id}/v${nextVersion}/${safeFileName}`;

        // --------------------------------------------------
        // UPLOAD TO PRIVATE SUPABASE STORAGE
        // --------------------------------------------------

        const {
            error: uploadError
        } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(
                storagePath,
                fileBuffer,
                {
                    contentType:
                        mimeType,

                    upsert:
                        false,

                    cacheControl:
                        '3600'
                }
            );

        if (uploadError) {
            console.error(
                `[Resume Sync] Storage upload failed for ${studentName}:`,
                uploadError
            );

            await logSyncEvent({
                entityType: 'resume',
                zohoRecordId: sourceZohoId,
                operation: 'sync',
                syncStatus: 'failed',
                errorMessage:
                    `Resume upload failed: ${uploadError.message}`
            });

            throw new Error(
                `Resume upload failed: ${uploadError.message}`
            );
        }

        // --------------------------------------------------
        // INSERT RESUME METADATA
        // --------------------------------------------------

        const now =
            new Date().toISOString();

        const resumeRecord = {
            student_id:
                syncedStudent.id,

            zoho_record_id:
                sourceStudent.zohoRecordId
                    ? String(
                        sourceStudent.zohoRecordId
                    )
                    : null,

            original_file_name:
                originalFileName,

            storage_bucket:
                STORAGE_BUCKET,

            storage_path:
                storagePath,

            mime_type:
                mimeType,

            file_size:
                fileSize,

            version:
                nextVersion,

            source:
                'zoho',

            is_current:
                true,

            uploaded_at:
                now,

            created_at:
                now,

            updated_at:
                now
        };

        const {
            data: insertedResume,
            error: insertError
        } = await supabase
            .from('resumes')
            .insert(
                resumeRecord
            )
            .select()
            .single();

        if (insertError) {
            // Remove only the newly uploaded Supabase file
            // if metadata insertion failed.
            await supabase.storage
                .from(STORAGE_BUCKET)
                .remove([
                    storagePath
                ]);

            await logSyncEvent({
                entityType: 'resume',
                zohoRecordId: sourceZohoId,
                operation: 'sync',
                syncStatus: 'failed',
                errorMessage:
                    `Resume metadata insert failed: ${insertError.message}`
            });

            throw new Error(
                `Resume metadata insert failed: ${insertError.message}`
            );
        }

        // --------------------------------------------------
        // MARK PREVIOUS SUPABASE VERSION AS NOT CURRENT
        // --------------------------------------------------

        if (currentResume?.id) {
            const {
                error: previousUpdateError
            } = await supabase
                .from('resumes')
                .update({
                    is_current:
                        false,

                    updated_at:
                        now
                })
                .eq(
                    'id',
                    currentResume.id
                );

            if (previousUpdateError) {
                console.warn(
                    '[Resume Sync] New resume uploaded, but previous version could not be marked inactive:',
                    previousUpdateError.message
                );
            }
        }

        syncedResumes.push(
            insertedResume
        );

        processedCount += 1;
        syncedCount += 1;

        await logSyncEvent({
            entityType: 'resume',
            zohoRecordId: sourceZohoId,
            operation: 'sync',
            syncStatus: 'success',
            payload: {
                student_id:
                    syncedStudent.id,
                file_name:
                    originalFileName,
                version:
                    nextVersion,
                storage_path:
                    storagePath
            }
        });

        console.log(
            `[Resume Sync] Resume synced for ${studentName} -> version ${nextVersion}`
        );
    }

    // --------------------------------------------------
    // RESULT
    // --------------------------------------------------

    return {
        success: true,

        message:
            `${syncedCount} resume(s) synced, ${skippedCount} skipped`,

        resumes:
            syncedResumes,

        skipped:
            skipped,

        counts: {
            processed: processedCount,
            synced: syncedCount,
            skipped: skippedCount,
            failed: failedCount
        }
    };
}