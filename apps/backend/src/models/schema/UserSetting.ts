import Sequelize, { ModelAttributes, Model } from 'sequelize';
import { sequelize } from '../db-config-mysql';
import { Defaultconfig } from '../db-config-mysql';

/*
CREATE TABLE `user_setting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `default_game_version` int DEFAULT NULL,
  `enable_notification` tinyint(1) DEFAULT '1',
  `notification_items` text COLLATE utf8mb4_general_ci,
  `is_deleted` tinyint(1) DEFAULT '0',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
 */
const UserSettingSchema: ModelAttributes = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: Sequelize.BIGINT,
    },
    default_game_version: {
        type: Sequelize.INTEGER,
    },
    enable_notification: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    notification_items: {
        type: Sequelize.TEXT,
    },
    is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    create_time: {
        type: Sequelize.DATE,
    },
    update_time: {
        type: Sequelize.DATE,
    },
};

export class UserSettingModel extends Model {
    public id!: number;
    public user_id!: number;
    public default_game_version!: number;
    public enable_notification!: boolean;
    public notification_items!: string;
    public is_deleted!: boolean;
    public create_time!: Date;
    public update_time!: Date;
}

UserSettingModel.init(UserSettingSchema, {
    ...Defaultconfig,
    sequelize,
    tableName: 'user_setting',
});
