import Sequelize, { ModelAttributes, Model } from 'sequelize';
import { sequelize } from '../db-config-mysql';
import { Defaultconfig } from '../db-config-mysql';
import { PLAYER_PRIMARY_POS_NAME } from '../../general/player/get-all-players';

/*
CREATE TABLE `user_notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `game_version` int NOT NULL,
  `in_game_date` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `message_type` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `message_subtype` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `player_id` int NOT NULL,
  `old_overall_rating` int DEFAULT NULL,
  `overall_rating` int DEFAULT NULL,
  `old_potential` int DEFAULT NULL,
  `potential` int DEFAULT NULL,
  `old_skillmoves` int DEFAULT NULL,
  `skillmoves` int DEFAULT NULL,
  `old_weakfoot` int DEFAULT NULL,
  `weakfoot` int DEFAULT NULL,
  `old_play_styles` text COLLATE utf8mb4_general_ci,
  `play_styles` text COLLATE utf8mb4_general_ci,
  `is_read` tinyint(1) DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_in_game_date` (`in_game_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
 */
const UserNotificationSchema: ModelAttributes = {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: Sequelize.INTEGER,
    },
    game_version: {
        type: Sequelize.INTEGER,
    },
    in_game_date: {
        type: Sequelize.STRING,
    },
    message_type: {
        type: Sequelize.STRING,
    },
    message_subtype: {
        type: Sequelize.STRING,
    },
    player_id: {
        type: Sequelize.INTEGER,
    },
    old_overall_rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    overall_rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    old_potential: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    potential: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    old_skillmoves: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    skillmoves: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    old_weakfoot: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    weakfoot: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    old_play_styles: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    play_styles: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    is_read: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
    },
    is_deleted: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
    },
    create_time: {
        type: Sequelize.DATE,
    },
    update_time: {
        type: Sequelize.DATE,
    },
};

export interface UserNotificationDb {
    id?: number;
    user_id?: number;
    game_version?: number;
    in_game_date?: string;
    message_type?: string;
    message_subtype?: string;
    player_id?: number;
    old_overall_rating?: number;
    overall_rating?: number;
    old_potential?: number;
    potential?: number;
    old_skillmoves?: number;
    skillmoves?: number;
    old_weakfoot?: number;
    weakfoot?: number;
    old_play_styles?: string;
    play_styles?: string;
    is_read?: number;
    is_deleted?: number;
    create_time?: Date;
    update_time?: Date;
}

export class UserNotificationModel extends Model<UserNotificationDb> {
    public id!: number;
    public user_id!: number;
    public game_version!: number;
    public in_game_date!: string;
    public message_type!: string;
    public message_subtype!: string;
    public player_id!: number;
    public old_overall_rating!: number | null;
    public overall_rating!: number | null;
    public old_potential!: number | null;
    public potential!: number | null;
    public old_skillmoves!: number | null;
    public skillmoves!: number | null;
    public old_weakfoot!: number | null;
    public weakfoot!: number | null;
    public old_play_styles!: string | null;
    public play_styles!: string | null;
    public is_read!: number;
    public is_deleted!: number;
    public create_time!: Date;
    public update_time!: Date;

    /**
     * Get raw data by id
     *
     * @param id
     */
    public static async getRawById(id: number): Promise<UserNotificationDb | null> {
        return await UserNotificationModel.findOne({
            where: { id },
            raw: true,
        });
    }
}

UserNotificationModel.init(UserNotificationSchema, {
    ...Defaultconfig,
    sequelize,
    tableName: 'user_notification',
});
