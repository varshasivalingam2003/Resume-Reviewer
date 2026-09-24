import { supabase } from './supabaseClient.js';
import { verifyVolunteerOtp } from './zohoService.js';
import { logSyncEvent } from './syncLogger.js';

/**
 * VOLUNTEER SYNC
 *
 * ZOHO CREATOR:
 * - READ ONLY
 * - NO CREATE
 * - NO UPDATE
 * - NO DELETE
 *
 * SUPABASE:
 * - INSERT / UPDATE VOLUNTEER CACHE ONLY
 */
export async function syncVolunteerByOtp(vOtp) {
    // --------------------------------------------------
    // CLEAN VOLUNTEER OTP
    // --------------------------------------------------

    const cleanOtp = String(
        vOtp || ''
    ).trim();

    if (!cleanOtp) {
        throw new Error(
            'Volunteer OTP is required'
        );
    }

    // --------------------------------------------------
    // STEP 1
    // READ VOLUNTEER + STUDENTS FROM ZOHO
    // --------------------------------------------------

    const zohoResult =
        await verifyVolunteerOtp(cleanOtp);

    if (
        !zohoResult ||
        !zohoResult.success
    ) {
        await logSyncEvent({
            entityType: 'volunteer',
            zohoRecordId: null,
            operation: 'sync',
            syncStatus: 'failed',
            errorMessage:
                zohoResult?.message ||
                'Volunteer not found in Zoho'
        });

        return {
            success: false,
            message:
                zohoResult?.message ||
                'Volunteer not found in Zoho'
        };
    }

    // --------------------------------------------------
    // STEP 2
    // GET ZOHO VOLUNTEER RECORD ID
    // --------------------------------------------------

    const zohoRecordId = String(
        zohoResult.volunteerRecordId || ''
    ).trim();

    // Supabase volunteers.zoho_record_id
    // is NOT NULL.
    // So never insert without real Zoho record ID.

    if (!zohoRecordId) {
        console.error(
            '[Volunteer Sync] Zoho volunteer record ID missing'
        );

        await logSyncEvent({
            entityType: 'volunteer',
            zohoRecordId: null,
            operation: 'sync',
            syncStatus: 'failed',
            errorMessage:
                'Zoho volunteer record ID was not returned by the Custom API'
        });

        return {
            success: false,
            message:
                'Zoho volunteer record ID was not returned by the Custom API'
        };
    }

    // --------------------------------------------------
    // STEP 3
    // GET VOLUNTEER OTP
    // --------------------------------------------------

    const volunteerOtp = String(
        zohoResult.volunteerOtp ||
        cleanOtp
    ).trim();

    if (!volunteerOtp) {
        await logSyncEvent({
            entityType: 'volunteer',
            zohoRecordId:
                zohoRecordId || null,
            operation: 'sync',
            syncStatus: 'failed',
            errorMessage:
                'Volunteer OTP is missing'
        });

        return {
            success: false,
            message:
                'Volunteer OTP is missing'
        };
    }

    // --------------------------------------------------
    // STEP 4
    // GET VOLUNTEER NAME
    // --------------------------------------------------

    const volunteerName = String(
        zohoResult.volunteerName ||
        'Volunteer'
    ).trim();

    // --------------------------------------------------
    // STEP 5
    // PREPARE SUPABASE VOLUNTEER RECORD
    // --------------------------------------------------

    const now =
        new Date().toISOString();

    const volunteerRecord = {
        zoho_record_id:
            zohoRecordId,

        v_otp:
            volunteerOtp,

        full_name:
            volunteerName,

        last_synced_at:
            now,

        updated_at:
            now
    };

    // --------------------------------------------------
    // STEP 6
    // WRITE ONLY TO SUPABASE
    // --------------------------------------------------

    const {
        data,
        error
    } = await supabase
        .from('volunteers')
        .upsert(
            volunteerRecord,
            {
                onConflict:
                    'zoho_record_id'
            }
        )
        .select()
        .single();

    // --------------------------------------------------
    // SUPABASE ERROR
    // --------------------------------------------------

    if (error) {
        console.error(
            '[Volunteer Sync] Supabase error:',
            error
        );

        await logSyncEvent({
            entityType: 'volunteer',
            zohoRecordId:
                zohoRecordId,
            operation: 'sync',
            syncStatus: 'failed',
            errorMessage:
                error.message
        });

        throw new Error(
            `Volunteer Supabase sync failed: ${error.message}`
        );
    }

    // --------------------------------------------------
    // STEP 7
    // STUDENTS FROM ZOHO RESULT
    // --------------------------------------------------

    const students =
        Array.isArray(
            zohoResult.students
        )
            ? zohoResult.students
            : [];

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    console.log(
        `[Volunteer Sync] Volunteer synced: ${volunteerOtp}`
    );

    console.log(
        `[Volunteer Sync] Assigned students received: ${students.length}`
    );

    await logSyncEvent({
        entityType: 'volunteer',
        zohoRecordId: zohoRecordId,
        operation: 'sync',
        syncStatus: 'success',
        errorMessage: null
    });

    return {
        success: true,

        message:
            'Volunteer synced to Supabase',

        volunteer:
            data,

        students:
            students
    };
}