-- Apply after deploying the career-aware API, before publishing the new UI.
-- Capture any final writes by the previous API while 0011 was being deployed.
INSERT OR IGNORE INTO career(user_id,game_version,name,is_legacy)
 SELECT user_id,game_version,'Default career',1 FROM (
 SELECT user_id,game_version FROM player UNION SELECT user_id,game_version FROM player_status_history
 UNION SELECT user_id,game_version FROM user_notification) WHERE user_id IS NOT NULL AND game_version IN (24,25,26,27);
UPDATE player SET save_id=(SELECT id FROM career WHERE career.user_id=player.user_id AND career.game_version=player.game_version AND is_legacy=1) WHERE save_id IS NULL;
UPDATE player_status_history SET save_id=(SELECT id FROM career WHERE career.user_id=player_status_history.user_id AND career.game_version=player_status_history.game_version AND is_legacy=1) WHERE save_id IS NULL;
UPDATE user_notification SET save_id=(SELECT id FROM career WHERE career.user_id=user_notification.user_id AND career.game_version=user_notification.game_version AND is_legacy=1) WHERE save_id IS NULL;
DROP INDEX uq_player;
DROP INDEX uq_history;
UPDATE career SET
 last_upload=(SELECT max(update_time) FROM player WHERE save_id=career.id),
 last_game_date=(SELECT max(in_game_date) FROM player_status_history WHERE save_id=career.id),
 player_count=(SELECT count(*) FROM player WHERE save_id=career.id AND is_archived=0 AND is_deleted=0)
WHERE is_legacy=1;
