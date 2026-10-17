-- Contract only after the independent-auth API has been deployed.
-- Abort rather than deleting customer game data attached to a migrated identity.
CREATE TABLE _admin_cleanup_guard (remaining INTEGER NOT NULL CHECK(remaining=0));
INSERT INTO _admin_cleanup_guard SELECT
    (SELECT count(*) FROM player WHERE user_id IN (SELECT user_id FROM _admin_migration_users)) +
    (SELECT count(*) FROM player_status_history WHERE user_id IN (SELECT user_id FROM _admin_migration_users)) +
    (SELECT count(*) FROM user_notification WHERE user_id IN (SELECT user_id FROM _admin_migration_users));
DELETE FROM user_secret_key WHERE user_id IN (SELECT user_id FROM _admin_migration_users);
DELETE FROM user_setting WHERE user_id IN (SELECT user_id FROM _admin_migration_users);
DELETE FROM user_activity WHERE user_id IN (SELECT user_id FROM _admin_migration_users);
DELETE FROM user WHERE id IN (SELECT user_id FROM _admin_migration_users);
DROP TABLE admin_audit_log;
DROP TABLE _admin_migration_users;
DROP TABLE _admin_cleanup_guard;
ALTER TABLE user DROP COLUMN is_admin;
