CREATE TABLE `player`
(
    `id`                      int NOT NULL AUTO_INCREMENT,
    `user_id`                 int NOT NULL,
    `save_id`                 int DEFAULT NULL,
    `player_id`               int DEFAULT NULL,
    `player_name`             text COLLATE utf8mb4_general_ci,
    `birthdate`               int DEFAULT NULL,
    `age`                     int DEFAULT NULL,
    `overallrating`           int DEFAULT NULL,
    `potential`               int DEFAULT NULL,
    `nationality`             text COLLATE utf8mb4_general_ci,
    `height`                  int DEFAULT NULL,
    `weight`                  int DEFAULT NULL,
    `preferredfoot`           text COLLATE utf8mb4_general_ci,
    `preferredposition1`      text COLLATE utf8mb4_general_ci,
    `preferredposition2`      text COLLATE utf8mb4_general_ci,
    `preferredposition3`      text COLLATE utf8mb4_general_ci,
    `preferredposition4`      text COLLATE utf8mb4_general_ci,
    `skillmoves`              int DEFAULT NULL,
    `weakfootabilitytypecode` int DEFAULT NULL,
    `attackingworkrate`       text COLLATE utf8mb4_general_ci,
    `defensiveworkrate`       text COLLATE utf8mb4_general_ci,
    `acceleration`            int DEFAULT NULL,
    `sprintspeed`             int DEFAULT NULL,
    `positioning`             int DEFAULT NULL,
    `finishing`               int DEFAULT NULL,
    `shotpower`               int DEFAULT NULL,
    `longshots`               int DEFAULT NULL,
    `volleys`                 int DEFAULT NULL,
    `penalties`               int DEFAULT NULL,
    `vision`                  int DEFAULT NULL,
    `crossing`                int DEFAULT NULL,
    `freekickaccuracy`        int DEFAULT NULL,
    `shortpassing`            int DEFAULT NULL,
    `longpassing`             int DEFAULT NULL,
    `curve`                   int DEFAULT NULL,
    `agility`                 int DEFAULT NULL,
    `balance`                 int DEFAULT NULL,
    `reactions`               int DEFAULT NULL,
    `ballcontrol`             int DEFAULT NULL,
    `dribbling`               int DEFAULT NULL,
    `composure`               int DEFAULT NULL,
    `interceptions`           int DEFAULT NULL,
    `headingaccuracy`         int DEFAULT NULL,
    `defensiveawareness`      int DEFAULT NULL,
    `standingtackle`          int DEFAULT NULL,
    `slidingtackle`           int DEFAULT NULL,
    `jumping`                 int DEFAULT NULL,
    `stamina`                 int DEFAULT NULL,
    `strength`                int DEFAULT NULL,
    `aggression`              int DEFAULT NULL,
    `gkdiving`                int DEFAULT NULL,
    `gkhandling`              int DEFAULT NULL,
    `gkkicking`               int DEFAULT NULL,
    `gkpositioning`           int DEFAULT NULL,
    `gkreflexes`              int DEFAULT NULL,
    `is_archived`             int DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_player_id` (`player_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `player_status_history`
(
    `id`            int NOT NULL AUTO_INCREMENT,
    `user_id`       int         DEFAULT NULL,
    `save_id`       int         DEFAULT NULL,
    `player_id`     int         DEFAULT NULL,
    `in_game_date`  varchar(20) DEFAULT NULL,
    `overallrating` int         DEFAULT NULL,
    `potential`     int         DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_player_id` (`player_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `user`
(
    `id`          int                                     NOT NULL AUTO_INCREMENT,
    `username`    text COLLATE utf8mb4_general_ci         NOT NULL,
    `email`       varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `password`    text COLLATE utf8mb4_general_ci         NOT NULL,
    `token`       text COLLATE utf8mb4_general_ci,
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `user_secret_key`
(
    `id`          int NOT NULL AUTO_INCREMENT,
    `user_id`     int      DEFAULT NULL,
    `secret_key`  text COLLATE utf8mb4_general_ci,
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

alter table player_status_history
    add column is_deleted  tinyint(1) default 0,
    add column create_time datetime   default current_timestamp,
    add column update_time datetime   default current_timestamp on update current_timestamp;

alter table player
    add column is_deleted  tinyint(1) default 0,
    add column create_time datetime   default current_timestamp,
    add column update_time datetime   default current_timestamp on update current_timestamp;

alter table user
    add column is_deleted tinyint(1) default 0 after token;

alter table user_secret_key
    add column is_deleted tinyint(1) default 0 after secret_key;

alter table user
    modify column id bigint not null auto_increment;

CREATE TABLE `user_setting`
(
    `id`                  int    NOT NULL AUTO_INCREMENT,
    `user_id`             BIGINT NOT NULL,
    `enable_notification` tinyint(1) DEFAULT 1,
    `notification_items`  text,
    `is_deleted`          tinyint(1) DEFAULT 0,
    `create_time`         datetime   DEFAULT CURRENT_TIMESTAMP,
    `update_time`         datetime   DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

ALTER TABLE user_setting
    ADD COLUMN `default_game_version` int DEFAULT NULL after user_id;
update user_setting
set default_game_version = 24
where 1 = 1;

alter table player
    add column game_version int after user_id;
update player
set game_version = 24
where 1 = 1;

alter table player_status_history
    add column game_version int after user_id;
update player_status_history
set game_version = 24
where 1 = 1;

CREATE TABLE `user_activity`
(
    `id`            bigint NOT NULL AUTO_INCREMENT,
    `user_id`       int    NOT NULL,
    `activity_time` datetime   DEFAULT NULL,
    `is_deleted`    tinyint(1) DEFAULT '0',
    `create_time`   datetime   DEFAULT CURRENT_TIMESTAMP,
    `update_time`   datetime   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_activity_time` (`activity_time`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE `user_notification`
(
    `id`                 bigint                                 NOT NULL AUTO_INCREMENT,
    `user_id`            int                                    NOT NULL,
    `game_version`       int                                    NOT NULL,
    `in_game_date`       varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
    `message_type`       varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
    `message_subtype`    varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
    `player_id`          int                                    NOT NULL,
    `old_overall_rating` int        DEFAULT NULL,
    `overall_rating`     int        DEFAULT NULL,
    `old_potential`      int        DEFAULT NULL,
    `potential`          int        DEFAULT NULL,
    `old_skillmoves`     int        DEFAULT NULL,
    `skillmoves`         int        DEFAULT NULL,
    `old_weakfoot`       int        DEFAULT NULL,
    `weakfoot`           int        DEFAULT NULL,
    `is_read`            tinyint(1) DEFAULT '0',
    `is_deleted`         tinyint(1) DEFAULT '0',
    `create_time`        datetime   DEFAULT CURRENT_TIMESTAMP,
    `update_time`        datetime   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_in_game_date` (`in_game_date`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

# 2025-01-08
ALTER TABLE player
ADD play_styles VARCHAR(2000) NULL AFTER gkreflexes;

# 2025-02-07
alter table user
add column `is_email_verified` tinyint(1) default 0 after email;
alter table user
add column `last_send_email_time` datetime after is_email_verified;

# 2025-03-03
# Add old_play_styles and play_styles columns to user_notification table
alter table user_notification add column old_play_styles text after weakfoot;
alter table user_notification add column play_styles text after old_play_styles;
