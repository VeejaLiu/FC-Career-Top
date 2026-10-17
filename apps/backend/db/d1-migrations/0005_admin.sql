-- Admin rights are granted explicitly by an operator, never by public registration.
ALTER TABLE user ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0 CHECK(is_admin IN (0,1));
ALTER TABLE user ADD COLUMN is_disabled INTEGER NOT NULL DEFAULT 0 CHECK(is_disabled IN (0,1));
CREATE TABLE admin_audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_id INTEGER NOT NULL,
    actor_email TEXT NOT NULL,
    action TEXT NOT NULL,
    target_user_id INTEGER,
    details TEXT NOT NULL DEFAULT '{}',
    create_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_admin_audit_created ON admin_audit_log(id DESC);
