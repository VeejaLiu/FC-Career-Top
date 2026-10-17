-- Preserve every existing row in a legacy career. Old scripts keep this target.
CREATE TABLE career (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL,
 game_version INTEGER NOT NULL,
 name TEXT NOT NULL,
 is_legacy INTEGER NOT NULL DEFAULT 0,
 is_archived INTEGER NOT NULL DEFAULT 0,
 last_upload TEXT,
 last_game_date TEXT,
 player_count INTEGER NOT NULL DEFAULT 0,
 script_version TEXT,
 editor_version TEXT,
 last_attempt TEXT,
 last_error TEXT,
 upload_count INTEGER NOT NULL DEFAULT 0,
 create_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX uq_legacy_career ON career(user_id,game_version) WHERE is_legacy=1;
CREATE INDEX idx_career_user ON career(user_id,game_version,id);
INSERT INTO career(user_id,game_version,name,is_legacy)
 SELECT user_id,game_version,'Default career',1 FROM (
 SELECT user_id,game_version FROM player UNION SELECT user_id,game_version FROM player_status_history
 UNION SELECT user_id,game_version FROM user_notification) WHERE user_id IS NOT NULL AND game_version IN (24,25,26,27);
UPDATE player SET save_id=(SELECT id FROM career WHERE career.user_id=player.user_id AND career.game_version=player.game_version AND is_legacy=1);
UPDATE player_status_history SET save_id=(SELECT id FROM career WHERE career.user_id=player_status_history.user_id AND career.game_version=player_status_history.game_version AND is_legacy=1);
ALTER TABLE user_notification ADD COLUMN save_id INTEGER;
UPDATE user_notification SET save_id=(SELECT id FROM career WHERE career.user_id=user_notification.user_id AND career.game_version=user_notification.game_version AND is_legacy=1);
CREATE UNIQUE INDEX uq_player_career ON player(user_id,game_version,save_id,player_id);
CREATE UNIQUE INDEX uq_history_career ON player_status_history(user_id,game_version,save_id,player_id,in_game_date);
CREATE INDEX idx_history_career ON player_status_history(user_id,save_id,player_id,in_game_date);
CREATE INDEX idx_notification_career ON user_notification(user_id,save_id,is_deleted,is_read,id);
ALTER TABLE player_status_history ADD COLUMN details TEXT;
UPDATE career SET
 last_upload=(SELECT max(update_time) FROM player WHERE save_id=career.id),
 last_game_date=(SELECT max(in_game_date) FROM player_status_history WHERE save_id=career.id),
 player_count=(SELECT count(*) FROM player WHERE save_id=career.id AND is_archived=0 AND is_deleted=0);
CREATE TABLE player_watch (
 user_id INTEGER NOT NULL, save_id INTEGER NOT NULL, player_id INTEGER NOT NULL,
 PRIMARY KEY(user_id,save_id,player_id)
);
-- Successful upload events are distinct snapshots, not a row for each player.
CREATE TABLE career_upload (
 user_id INTEGER NOT NULL, save_id INTEGER NOT NULL, in_game_date TEXT NOT NULL,
 script_version TEXT NOT NULL, editor_version TEXT,
 first_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(user_id,save_id,in_game_date)
);
CREATE INDEX idx_upload_user ON career_upload(user_id,first_seen);
CREATE TABLE career_upload_daily (
 user_id INTEGER NOT NULL, day TEXT NOT NULL, script_version TEXT NOT NULL,
 successes INTEGER NOT NULL DEFAULT 0, failures INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY(user_id,day,script_version)
);
