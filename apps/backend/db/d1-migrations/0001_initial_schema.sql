-- Initial D1 / SQLite schema. Add a new migration for subsequent changes.

CREATE TABLE "user" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "username" TEXT NOT NULL,
  "email" TEXT,
  "is_email_verified" INTEGER DEFAULT '0',
  "last_send_email_time" TEXT DEFAULT NULL,
  "password" TEXT NOT NULL,
  "token" TEXT,
  "is_deleted" INTEGER DEFAULT '0',
  "create_time" TEXT DEFAULT CURRENT_TIMESTAMP,
  "update_time" TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "user_secret_key" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "user_id" INTEGER DEFAULT NULL,
  "secret_key" TEXT,
  "is_deleted" INTEGER DEFAULT '0',
  "create_time" TEXT DEFAULT CURRENT_TIMESTAMP,
  "update_time" TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "user_setting" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "user_id" INTEGER NOT NULL,
  "default_game_version" INTEGER DEFAULT NULL,
  "enable_notification" INTEGER DEFAULT '1',
  "notification_items" TEXT,
  "is_deleted" INTEGER DEFAULT '0',
  "create_time" TEXT DEFAULT CURRENT_TIMESTAMP,
  "update_time" TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "user_activity" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "user_id" INTEGER NOT NULL,
  "activity_time" TEXT DEFAULT NULL,
  "is_deleted" INTEGER DEFAULT '0',
  "create_time" TEXT DEFAULT CURRENT_TIMESTAMP,
  "update_time" TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "player" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "user_id" INTEGER NOT NULL,
  "game_version" INTEGER DEFAULT NULL,
  "save_id" INTEGER DEFAULT NULL,
  "player_id" INTEGER DEFAULT NULL,
  "player_name" TEXT,
  "birthdate" INTEGER DEFAULT NULL,
  "age" INTEGER DEFAULT NULL,
  "overallrating" INTEGER DEFAULT NULL,
  "potential" INTEGER DEFAULT NULL,
  "nationality" TEXT,
  "height" INTEGER DEFAULT NULL,
  "weight" INTEGER DEFAULT NULL,
  "preferredfoot" TEXT,
  "preferredposition1" TEXT,
  "preferredposition2" TEXT,
  "preferredposition3" TEXT,
  "preferredposition4" TEXT,
  "skillmoves" INTEGER DEFAULT NULL,
  "weakfootabilitytypecode" INTEGER DEFAULT NULL,
  "attackingworkrate" TEXT,
  "defensiveworkrate" TEXT,
  "acceleration" INTEGER DEFAULT NULL,
  "sprintspeed" INTEGER DEFAULT NULL,
  "positioning" INTEGER DEFAULT NULL,
  "finishing" INTEGER DEFAULT NULL,
  "shotpower" INTEGER DEFAULT NULL,
  "longshots" INTEGER DEFAULT NULL,
  "volleys" INTEGER DEFAULT NULL,
  "penalties" INTEGER DEFAULT NULL,
  "vision" INTEGER DEFAULT NULL,
  "crossing" INTEGER DEFAULT NULL,
  "freekickaccuracy" INTEGER DEFAULT NULL,
  "shortpassing" INTEGER DEFAULT NULL,
  "longpassing" INTEGER DEFAULT NULL,
  "curve" INTEGER DEFAULT NULL,
  "agility" INTEGER DEFAULT NULL,
  "balance" INTEGER DEFAULT NULL,
  "reactions" INTEGER DEFAULT NULL,
  "ballcontrol" INTEGER DEFAULT NULL,
  "dribbling" INTEGER DEFAULT NULL,
  "composure" INTEGER DEFAULT NULL,
  "interceptions" INTEGER DEFAULT NULL,
  "headingaccuracy" INTEGER DEFAULT NULL,
  "defensiveawareness" INTEGER DEFAULT NULL,
  "standingtackle" INTEGER DEFAULT NULL,
  "slidingtackle" INTEGER DEFAULT NULL,
  "jumping" INTEGER DEFAULT NULL,
  "stamina" INTEGER DEFAULT NULL,
  "strength" INTEGER DEFAULT NULL,
  "aggression" INTEGER DEFAULT NULL,
  "gkdiving" INTEGER DEFAULT NULL,
  "gkhandling" INTEGER DEFAULT NULL,
  "gkkicking" INTEGER DEFAULT NULL,
  "gkpositioning" INTEGER DEFAULT NULL,
  "gkreflexes" INTEGER DEFAULT NULL,
  "play_styles" TEXT DEFAULT NULL,
  "is_archived" INTEGER DEFAULT '0',
  "is_deleted" INTEGER DEFAULT '0',
  "create_time" TEXT DEFAULT CURRENT_TIMESTAMP,
  "update_time" TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "player_status_history" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "user_id" INTEGER DEFAULT NULL,
  "game_version" INTEGER DEFAULT NULL,
  "save_id" INTEGER DEFAULT NULL,
  "player_id" INTEGER DEFAULT NULL,
  "in_game_date" TEXT DEFAULT NULL,
  "overallrating" INTEGER DEFAULT NULL,
  "potential" INTEGER DEFAULT NULL,
  "is_deleted" INTEGER DEFAULT '0',
  "create_time" TEXT DEFAULT CURRENT_TIMESTAMP,
  "update_time" TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "user_notification" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "user_id" INTEGER NOT NULL,
  "game_version" INTEGER NOT NULL,
  "in_game_date" TEXT NOT NULL,
  "message_type" TEXT NOT NULL,
  "message_subtype" TEXT NOT NULL,
  "player_id" INTEGER NOT NULL,
  "old_overall_rating" INTEGER DEFAULT NULL,
  "overall_rating" INTEGER DEFAULT NULL,
  "old_potential" INTEGER DEFAULT NULL,
  "potential" INTEGER DEFAULT NULL,
  "old_skillmoves" INTEGER DEFAULT NULL,
  "skillmoves" INTEGER DEFAULT NULL,
  "old_weakfoot" INTEGER DEFAULT NULL,
  "weakfoot" INTEGER DEFAULT NULL,
  "old_play_styles" TEXT,
  "play_styles" TEXT,
  "is_read" INTEGER DEFAULT '0',
  "is_deleted" INTEGER DEFAULT '0',
  "create_time" TEXT DEFAULT CURRENT_TIMESTAMP,
  "update_time" TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX uq_username ON user(username COLLATE NOCASE);
CREATE UNIQUE INDEX uq_secret_user ON user_secret_key(user_id);
CREATE UNIQUE INDEX uq_secret_key ON user_secret_key(secret_key);
CREATE UNIQUE INDEX uq_setting_user ON user_setting(user_id);
CREATE UNIQUE INDEX uq_player ON player(user_id, game_version, player_id);
CREATE UNIQUE INDEX uq_history ON player_status_history(user_id, game_version, player_id, in_game_date);
CREATE INDEX idx_history_user_version ON player_status_history(user_id, game_version, in_game_date);
CREATE INDEX idx_notification_user_version ON user_notification(user_id, game_version, is_deleted, is_read, id);
CREATE INDEX idx_activity_user_time ON user_activity(user_id, activity_time);
CREATE INDEX idx_user_created ON user(create_time);
