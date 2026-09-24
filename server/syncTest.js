import { syncVolunteerByOtp } from './volunteerSync.js';
import { syncStudentsToSupabase } from './studentSync.js';
import { syncVolunteerStudentMappings } from './mappingSync.js';
import { syncResumesToSupabase } from './resumeSync.js';

/**
 * CONTROLLED ZOHO -> SUPABASE TEST
 *
 * ZOHO CREATOR:
 * - READ ONLY
 * - NO CREATE
 * - NO UPDATE
 * - NO DELETE
 *
 * SUPABASE:
 * - Volunteer UPSERT
 * - Student UPSERT
 * - Volunteer-Student Mapping INSERT / UPDATE
 * - Resume upload to private Storage
 * - Resume metadata INSERT / UPDATE
 */

async function runSyncTest() {
    const vOtp = String(process.argv[2] || '').trim();

    if (!vOtp) {
        console.error('');
        console.error('[Sync Test] Volunteer OTP is required.');
        console.error('');
        console.error('Example:');
        console.error(
            'node --env-file=.env server/syncTest.js GE7084'
        );
        console.error('');

        process.exitCode = 1;
        return;
    }

    try {
        console.log('');
        console.log('======================================');
        console.log('ZOHO -> SUPABASE SYNC TEST');
        console.log('======================================');
        console.log(`[Sync Test] Volunteer OTP: ${vOtp}`);
        console.log('[Sync Test] Zoho mode: READ ONLY');
        console.log('');

        // --------------------------------------------------
        // STEP 1
        // READ VOLUNTEER + ASSIGNED STUDENTS FROM ZOHO
        // WRITE VOLUNTEER ONLY TO SUPABASE
        // --------------------------------------------------

        console.log(
            '[Sync Test] Step 1: Syncing volunteer to Supabase...'
        );

        const volunteerResult =
            await syncVolunteerByOtp(vOtp);

        if (!volunteerResult?.success) {
            console.error(
                '[Sync Test] Volunteer sync failed:',
                volunteerResult?.message ||
                'Unknown volunteer sync error'
            );

            process.exitCode = 1;
            return;
        }

        console.log(
            '[Sync Test] Volunteer synced successfully.'
        );

        const assignedStudents =
            Array.isArray(volunteerResult.students)
                ? volunteerResult.students
                : [];

        console.log(
            `[Sync Test] Students received from Zoho: ${assignedStudents.length}`
        );

        // --------------------------------------------------
        // STEP 2
        // WRITE STUDENTS ONLY TO SUPABASE
        // --------------------------------------------------

        console.log('');
        console.log(
            '[Sync Test] Step 2: Syncing students to Supabase...'
        );

        const studentResult =
            await syncStudentsToSupabase(
                assignedStudents
            );

        if (!studentResult?.success) {
            console.error(
                '[Sync Test] Student sync failed:',
                studentResult?.message ||
                'Unknown student sync error'
            );

            process.exitCode = 1;
            return;
        }

        console.log(
            `[Sync Test] ${studentResult.students?.length || 0} student(s) synced successfully.`
        );

        // --------------------------------------------------
        // STEP 3
        // WRITE VOLUNTEER-STUDENT MAPPINGS TO SUPABASE
        // --------------------------------------------------

        console.log('');
        console.log(
            '[Sync Test] Step 3: Syncing volunteer-student mappings...'
        );

        const mappingResult =
            await syncVolunteerStudentMappings(
                volunteerResult.volunteer,
                studentResult.students || []
            );

        if (!mappingResult?.success) {
            console.error(
                '[Sync Test] Mapping sync failed:',
                mappingResult?.message ||
                'Unknown mapping sync error'
            );

            process.exitCode = 1;
            return;
        }

        console.log(
            `[Sync Test] ${mappingResult.mappings?.length || 0} mapping(s) synced successfully.`
        );

        // --------------------------------------------------
        // STEP 4
        // READ RESUME FILES FROM ZOHO
        // UPLOAD TO SUPABASE PRIVATE STORAGE
        // SAVE RESUME METADATA
        // --------------------------------------------------

        console.log('');
        console.log(
            '[Sync Test] Step 4: Syncing resumes to Supabase...'
        );

        const resumeResult =
            await syncResumesToSupabase(
                assignedStudents,
                studentResult.students || []
            );

        if (!resumeResult?.success) {
            console.error(
                '[Sync Test] Resume sync failed:',
                resumeResult?.message ||
                'Unknown resume sync error'
            );

            process.exitCode = 1;
            return;
        }

        console.log(
            `[Sync Test] ${resumeResult.counts?.synced ?? resumeResult.resumes?.length ?? 0} resume(s) synced successfully.`
        );

        if (
            Array.isArray(resumeResult.skipped) &&
            resumeResult.skipped.length > 0
        ) {
            console.log(
                `[Sync Test] ${resumeResult.skipped.length} resume(s) skipped.`
            );

            for (const item of resumeResult.skipped) {
                console.log(
                    `[Resume Skip] ${item.student || 'Unknown'}: ${item.reason || 'Unknown reason'}`
                );
            }
        }

        // --------------------------------------------------
        // FINAL RESULT
        // --------------------------------------------------

        console.log('');
        console.log('======================================');
        console.log('SYNC TEST COMPLETED');
        console.log('======================================');

        console.log(
            `Volunteer OTP: ${vOtp}`
        );

        console.log(
            `Students received: ${assignedStudents.length}`
        );

        console.log(
            `Students synced: ${studentResult.students?.length || 0}`
        );

        console.log(
            `Mappings synced: ${mappingResult.mappings?.length || 0}`
        );

        console.log(
            `Resumes processed: ${resumeResult.counts?.processed ?? assignedStudents.length}`
        );

        console.log(
            `Resumes synced: ${resumeResult.counts?.synced ?? resumeResult.resumes?.length ?? 0}`
        );

        console.log(
            `Resumes skipped: ${resumeResult.counts?.skipped ?? resumeResult.skipped?.length ?? 0}`
        );

        if (typeof resumeResult.counts?.failed === 'number' && resumeResult.counts.failed > 0) {
            console.log(
                `Resumes failed: ${resumeResult.counts.failed}`
            );
        }

        console.log('');
        console.log(
            'Zoho Creator records were READ ONLY.'
        );

        console.log(
            'No Zoho Creator record was created, updated, or deleted.'
        );

        console.log(
            'All writes were performed only in Supabase.'
        );

        console.log('======================================');
        console.log('');
    } catch (error) {
        console.error('');
        console.error('======================================');
        console.error('SYNC TEST FAILED');
        console.error('======================================');

        console.error(
            error?.message || error
        );

        console.error('======================================');
        console.error('');

        process.exitCode = 1;
    }
}

runSyncTest();