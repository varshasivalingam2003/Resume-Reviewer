import { supabase } from './supabaseClient.js';

/**
 * Reusable sync logger for recording Zoho -> Supabase sync events.
 *
 * Writes ONLY to public.zoho_sync_logs.
 * Non-blocking: never throws an error back to the caller.
 */
export async function logSyncEvent({
    entityType,
    zohoRecordId = null,
    operation,
    syncStatus,
    errorMessage = null,
    payload = null,
    retryCount = 0
}) {
    try {
        const logRecord = {
            entity_type: entityType,
            zoho_record_id: zohoRecordId ? String(zohoRecordId) : null,
            operation: operation,
            sync_status: syncStatus,
            error_message: errorMessage ? String(errorMessage) : null,
            payload: payload ?? null,
            retry_count: typeof retryCount === 'number' ? retryCount : 0
        };

        const { data, error } = await supabase
            .from('zoho_sync_logs')
            .insert(logRecord)
            .select()
            .single();

        if (error) {
            console.error('[Sync Logger] Failed to log sync event:', error.message || error);
            return { success: false };
        }

        return { success: true, log: data };
    } catch (err) {
        console.error('[Sync Logger] Unexpected error during sync logging:', err.message || err);
        return { success: false };
    }
}
