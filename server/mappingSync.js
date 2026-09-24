import { supabase } from './supabaseClient.js';
import { logSyncEvent } from './syncLogger.js';

/**
 * VOLUNTEER <-> STUDENT MAPPING SYNC
 *
 * ZOHO CREATOR:
 * - NO CREATE
 * - NO UPDATE
 * - NO DELETE
 * - This file does NOT call Zoho at all.
 *
 * SUPABASE:
 * - Creates / updates only volunteer_student_mappings
 *
 * Expected inputs:
 * - volunteer = Supabase volunteer row
 * - students  = Supabase student rows
 */
export async function syncVolunteerStudentMappings(
    volunteer,
    students = []
) {
    // --------------------------------------------------
    // VALIDATE VOLUNTEER
    // --------------------------------------------------

    if (
        !volunteer ||
        !volunteer.id
    ) {
        throw new Error(
            'Supabase volunteer record is required for mapping sync'
        );
    }

    // --------------------------------------------------
    // VALIDATE STUDENTS
    // --------------------------------------------------

    if (!Array.isArray(students)) {
        throw new Error(
            'Students must be an array'
        );
    }

    if (students.length === 0) {
        return {
            success: true,
            message: 'No students available for mapping',
            mappings: []
        };
    }

    const syncedMappings = [];

    const now =
        new Date().toISOString();

    // Use event code only if it already exists
    // on the synced volunteer record.
    const eventCode =
        volunteer.event_code
            ? String(volunteer.event_code).trim()
            : null;

    // --------------------------------------------------
    // PROCESS EACH STUDENT
    // --------------------------------------------------

    for (const student of students) {
        if (
            !student ||
            !student.id
        ) {
            console.warn(
                '[Mapping Sync] Skipping student without Supabase ID'
            );

            continue;
        }

        const volunteerId =
            String(volunteer.id).trim();

        const studentId =
            String(student.id).trim();

        // --------------------------------------------------
        // CHECK EXISTING MAPPING
        //
        // We intentionally check manually because event_code
        // can be NULL. PostgreSQL UNIQUE constraints allow
        // multiple NULL values, so relying only on UPSERT
        // could create duplicate mappings.
        // --------------------------------------------------

        let existingQuery = supabase
            .from('volunteer_student_mappings')
            .select('*')
            .eq(
                'volunteer_id',
                volunteerId
            )
            .eq(
                'student_id',
                studentId
            );

        if (eventCode) {
            existingQuery =
                existingQuery.eq(
                    'event_code',
                    eventCode
                );
        } else {
            existingQuery =
                existingQuery.is(
                    'event_code',
                    null
                );
        }

        const {
            data: existingMappings,
            error: existingError
        } = await existingQuery.limit(1);

        if (existingError) {
            console.error(
                '[Mapping Sync] Existing mapping check failed:',
                existingError
            );

            await logSyncEvent({
                entityType: 'mapping',
                zohoRecordId: null,
                operation: 'sync',
                syncStatus: 'failed',
                errorMessage: `Mapping lookup failed: ${existingError.message}`,
                payload: {
                    volunteer_supabase_id: volunteerId,
                    student_supabase_id: studentId,
                    event_code: eventCode
                }
            });

            throw new Error(
                `Mapping lookup failed: ${existingError.message}`
            );
        }

        const existingMapping =
            existingMappings?.[0] ||
            null;

        // --------------------------------------------------
        // UPDATE EXISTING SUPABASE MAPPING
        // --------------------------------------------------

        if (existingMapping) {
            const {
                data,
                error
            } = await supabase
                .from(
                    'volunteer_student_mappings'
                )
                .update({
                    mapping_status: 'Active',
                    updated_at: now
                })
                .eq(
                    'id',
                    existingMapping.id
                )
                .select()
                .single();

            if (error) {
                console.error(
                    '[Mapping Sync] Mapping update failed:',
                    error
                );

                await logSyncEvent({
                    entityType: 'mapping',
                    zohoRecordId: null,
                    operation: 'sync',
                    syncStatus: 'failed',
                    errorMessage: `Mapping update failed: ${error.message}`,
                    payload: {
                        volunteer_supabase_id: volunteerId,
                        student_supabase_id: studentId,
                        event_code: eventCode
                    }
                });

                throw new Error(
                    `Mapping update failed: ${error.message}`
                );
            }

            await logSyncEvent({
                entityType: 'mapping',
                zohoRecordId: null,
                operation: 'sync',
                syncStatus: 'success',
                payload: {
                    volunteer_supabase_id: volunteerId,
                    student_supabase_id: studentId,
                    event_code: eventCode
                }
            });

            syncedMappings.push(data);

            continue;
        }

        // --------------------------------------------------
        // CREATE NEW SUPABASE MAPPING
        // --------------------------------------------------

        const mappingRecord = {
            volunteer_id:
                volunteerId,

            student_id:
                studentId,

            event_code:
                eventCode,

            mapping_status:
                'Active',

            assigned_at:
                now,

            created_at:
                now,

            updated_at:
                now
        };

        const {
            data,
            error
        } = await supabase
            .from(
                'volunteer_student_mappings'
            )
            .insert(
                mappingRecord
            )
            .select()
            .single();

        if (error) {
            console.error(
                '[Mapping Sync] Mapping insert failed:',
                error
            );

            await logSyncEvent({
                entityType: 'mapping',
                zohoRecordId: null,
                operation: 'sync',
                syncStatus: 'failed',
                errorMessage: `Mapping insert failed: ${error.message}`,
                payload: {
                    volunteer_supabase_id: volunteerId,
                    student_supabase_id: studentId,
                    event_code: eventCode
                }
            });

            throw new Error(
                `Mapping insert failed: ${error.message}`
            );
        }

        await logSyncEvent({
            entityType: 'mapping',
            zohoRecordId: null,
            operation: 'sync',
            syncStatus: 'success',
            payload: {
                volunteer_supabase_id: volunteerId,
                student_supabase_id: studentId,
                event_code: eventCode
            }
        });

        syncedMappings.push(data);
    }

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    console.log(
        `[Mapping Sync] ${syncedMappings.length} mapping(s) synced successfully.`
    );

    return {
        success: true,

        message:
            `${syncedMappings.length} volunteer-student mapping(s) synced to Supabase`,

        mappings:
            syncedMappings
    };
}