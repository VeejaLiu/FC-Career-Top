-- One diagnostic group per customer/error/UTC day. No credentials or save data.
CREATE TABLE lua_error_report (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    report_day TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    game_version INTEGER NOT NULL CHECK (game_version IN (24,25,26,27)),
    script_version TEXT NOT NULL,
    editor_version TEXT NOT NULL,
    stage TEXT NOT NULL,
    message TEXT NOT NULL,
    traceback TEXT NOT NULL,
    event_id INTEGER,
    http_status INTEGER,
    career_date TEXT,
    occurrences INTEGER NOT NULL DEFAULT 1,
    first_seen TEXT NOT NULL DEFAULT (datetime('now')),
    last_seen TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, report_day, fingerprint)
);
CREATE INDEX lua_error_report_recent ON lua_error_report(last_seen DESC, id DESC);
CREATE INDEX lua_error_report_retention ON lua_error_report(report_day);
CREATE INDEX lua_error_report_user ON lua_error_report(user_id, last_seen DESC);
