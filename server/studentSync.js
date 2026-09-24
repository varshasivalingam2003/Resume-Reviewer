import { supabase } from './supabaseClient.js';
import { logSyncEvent } from './syncLogger.js';

/**
 * ZOHO DATA IS READ-ONLY
 *
 * This function receives students already fetched
 * from the existing Zoho read/verification flow.
 *
 * Zoho Creator:
 * - No create
 * - No update
 * - No delete
 *
 * Supabase:
 * - Insert / update student cache only
 */
export async function syncStudentsToSupabase(students = []) {
    if (!Array.isArray(students)) {
        throw new Error('Students must be an array');
    }

    if (students.length === 0) {
        return {
            success: true,
            message: 'No students to sync',
            students: []
        };
    }

    const now = new Date().toISOString();

    const records = [];

    for (const student of students) {
        const zohoRecordId = String(
            student.zohoRecordId || ''
        ).trim();

        // Student without actual Zoho record ID
        // should NOT be inserted into Supabase.
        if (!zohoRecordId) {
            console.warn(
                '[Student Sync] Skipping student without Zoho record ID:',
                student.studentId || student.name || 'Unknown'
            );

            await logSyncEvent({
                entityType: 'student',
                zohoRecordId: null,
                operation: 'sync',
                syncStatus: 'skipped',
                errorMessage: 'Missing Zoho record ID'
            });

            continue;
        }

        records.push({
            zoho_record_id: zohoRecordId,

            student_id:
                student.studentId
                    ? String(student.studentId)
                    : null,

            s_otp:
                student.sOtp
                    ? String(student.sOtp)
                    : null,

            name:
                student.name ||
                'Student',

            email:
                student.email ||
                null,

            phone:
                student.phone ||
                null,

            whatsapp:
                student.whatsapp ||
                null,

            gender:
                student.gender ||
                null,

            last_synced_at: now,
            updated_at: now
        });
    }

    if (records.length === 0) {
        return {
            success: false,
            message: 'No students had a valid Zoho record ID',
            students: []
        };
    }

    const {
        data,
        error
    } = await supabase
        .from('students')
        .upsert(
            records,
            {
                onConflict: 'zoho_record_id'
            }
        )
        .select();

    if (error) {
        console.error(
            '[Student Sync] Supabase error:',
            error
        );

        for (const rec of records) {
            await logSyncEvent({
                entityType: 'student',
                zohoRecordId: rec.zoho_record_id,
                operation: 'sync',
                syncStatus: 'failed',
                errorMessage: error.message
            });
        }

        throw error;
    }

    for (const student of (data || [])) {
        await logSyncEvent({
            entityType: 'student',
            zohoRecordId: student.zoho_record_id,
            operation: 'sync',
            syncStatus: 'success'
        });
    }

    return {
        success: true,
        message: `${data?.length || 0} student(s) synced to Supabase`,
        students: data || []
    };
}