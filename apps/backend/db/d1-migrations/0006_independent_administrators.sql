-- Expand first: preserve login hashes and retire the old customer identity.
-- Deploy the independent-auth API before applying 0007 in production.
CREATE TABLE admin_account (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL COLLATE NOCASE UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'operator' CHECK(role IN ('owner','operator')),
    is_disabled INTEGER NOT NULL DEFAULT 0 CHECK(is_disabled IN (0,1)),
    last_login_time TEXT,
    create_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE admin_session (
    id TEXT PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES admin_account(id),
    token_hash TEXT NOT NULL UNIQUE,
    user_agent TEXT NOT NULL DEFAULT '',
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);
CREATE INDEX idx_admin_session_account ON admin_session(admin_id,expires_at);
CREATE TABLE admin_audit_event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_admin_id INTEGER REFERENCES admin_account(id),
    actor_username TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT CHECK(target_type IN ('user','administrator','session')),
    target_id TEXT,
    details TEXT NOT NULL DEFAULT '{}',
    create_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE _admin_migration_users (user_id INTEGER PRIMARY KEY);
INSERT INTO _admin_migration_users SELECT id FROM user WHERE is_admin=1 AND is_deleted=0;
INSERT INTO admin_account(id,username,password_hash,role,is_disabled,create_time,update_time)
SELECT id,username,password,'owner',is_disabled,create_time,update_time FROM user
WHERE id IN (SELECT user_id FROM _admin_migration_users);
INSERT INTO admin_audit_event(id,actor_admin_id,actor_username,action,target_type,target_id,details,create_time)
SELECT l.id,a.id,COALESCE(a.username,l.actor_email),l.action,
CASE WHEN l.action IN ('login','logout','bootstrap-admin') THEN 'administrator' ELSE 'user' END,
CAST(l.target_user_id AS TEXT),l.details,l.create_time
FROM admin_audit_log l LEFT JOIN admin_account a ON a.id=l.actor_id;
UPDATE user SET is_deleted=1,token=NULL WHERE id IN (SELECT user_id FROM _admin_migration_users);
INSERT INTO admin_audit_event(actor_admin_id,actor_username,action,target_type,target_id)
SELECT id,username,'migrate-administrator','administrator',CAST(id AS TEXT) FROM admin_account
WHERE id IN (SELECT user_id FROM _admin_migration_users);
