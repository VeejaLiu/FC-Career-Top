import { uploadKeyAliases } from '../utils/UploadKey';
import { resolveCareer } from './careers';
import { HttpError } from './http';

// Read a bounded stream even when Content-Length is absent or dishonest.
export async function luaErrorBody(request: Request): Promise<unknown> {
    const limit = 16 * 1024;
    if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json')
        throw new HttpError(415, 'JSON is required');
    if (Number(request.headers.get('Content-Length')) > limit) throw new HttpError(413, 'Diagnostic exceeds 16 KB');
    const reader = request.body?.getReader();
    let text = '';
    let bytes = 0;
    const decoder = new TextDecoder();
    if (reader) {
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                bytes += value.byteLength;
                if (bytes > limit) {
                    await reader.cancel();
                    throw new HttpError(413, 'Diagnostic exceeds 16 KB');
                }
                text += decoder.decode(value, { stream: true });
            }
            text += decoder.decode();
        } finally {
            reader.releaseLock();
        }
    }
    try {
        return JSON.parse(text);
    } catch {
        throw new HttpError(400, 'Invalid JSON');
    }
}

function redact(value: string, key: string): string {
    for (const secret of uploadKeyAliases(key)) value = value.split(secret).join('[redacted]');
    return value
        .replace(/\bfc[td]-[a-f0-9]{32,}\b/gi, '[redacted]')
        .replace(
            /((?:secret[-_ ]?key|authorization|password|token)["']?\s*[=:]\s*["']?)(?:Bearer\s+)?[^\s,;"']+/gi,
            '$1[redacted]',
        )
        .replace(/https?:\/\/[^\s<>"']+/gi, (url) => {
            try {
                const parsed = new URL(url);
                return parsed.origin + parsed.pathname;
            } catch {
                return '[url]';
            }
        })
        .replace(/([a-z]:[\\/]Users[\\/])[^\\/\r\n]+/gi, '$1[user]')
        .replace(/(\/(?:Users|home)\/)[^/\r\n]+/g, '$1[user]')
        .replace(/\b[^\s@]+@[^\s@]+\.[a-z]{2,}\b/gi, '[email]')
        .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');
}

export async function saveLuaError(db: D1Database, userId: number, key: string, input: unknown): Promise<void> {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new HttpError(400, 'Invalid diagnostic');
    const data = input as Record<string, unknown>;
    const string = (name: string, max: number, required = true): string => {
        const value = data[name];
        if (!required && value === undefined) return '';
        if (typeof value !== 'string' || value.length > max || (required && !value.trim()))
            throw new HttpError(400, `Invalid diagnostic ${name}`);
        return redact(value, key);
    };
    const gameVersion = data.gameVersion;
    if (typeof gameVersion !== 'number' || ![24, 25, 26, 27].includes(gameVersion))
        throw new HttpError(400, 'Invalid diagnostic gameVersion');
    const scriptVersion = string('scriptVersion', 64);
    const editorVersion = string('editorVersion', 80);
    const stage = string('stage', 64);
    if (!/^[a-zA-Z0-9_.-]+$/.test(scriptVersion) || !/^[a-z][a-z0-9_.-]*$/.test(stage))
        throw new HttpError(400, 'Invalid diagnostic version or stage');
    const message = string('message', 2000);
    const traceback = string('traceback', 6000, false);
    const integer = (name: string, max: number): number | null => {
        const value = data[name];
        if (value === undefined) return null;
        if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0 || value > max)
            throw new HttpError(400, `Invalid diagnostic ${name}`);
        return value;
    };
    const eventId = integer('eventId', 0xffffffff);
    const httpStatus = integer('httpStatus', 599);
    let careerDate: string | null = null;
    if (data.careerDate !== undefined) {
        if (typeof data.careerDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.careerDate))
            throw new HttpError(400, 'Invalid diagnostic careerDate');
        const parsed = new Date(data.careerDate + 'T00:00:00Z');
        if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== data.careerDate)
            throw new HttpError(400, 'Invalid diagnostic careerDate');
        careerDate = data.careerDate;
    }
    const career = await resolveCareer(db, userId, gameVersion, data.careerId);
    const digest = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(JSON.stringify([gameVersion, scriptVersion, editorVersion, stage, message])),
    );
    const fingerprint = Array.from(new Uint8Array(digest), (v) => v.toString(16).padStart(2, '0')).join('');
    await db.batch([
        db
            .prepare('UPDATE career SET last_attempt=CURRENT_TIMESTAMP,last_error=? WHERE user_id=? AND id=?')
            .bind(`${stage}: ${message}`, userId, career.id),
        db.prepare("DELETE FROM lua_error_report WHERE report_day < date('now','-29 days')"),
        db
            .prepare(
                `INSERT INTO lua_error_report
            (user_id,report_day,fingerprint,game_version,script_version,editor_version,stage,message,traceback,event_id,http_status,career_date)
            VALUES (?,date('now'),?,?,?,?,?,?,?,?,?,?)
            ON CONFLICT(user_id,report_day,fingerprint) DO UPDATE SET
            occurrences=occurrences+1,last_seen=datetime('now'),traceback=excluded.traceback,
            event_id=excluded.event_id,http_status=excluded.http_status,career_date=excluded.career_date`,
            )
            .bind(
                userId,
                fingerprint,
                gameVersion,
                scriptVersion,
                editorVersion,
                stage,
                message,
                traceback,
                eventId,
                httpStatus,
                careerDate,
            ),
    ]);
}
