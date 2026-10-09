import Sequelize, { ModelAttributes, Model } from 'sequelize';
import { sequelize } from '../db-config-mysql';
import { Defaultconfig } from '../db-config-mysql';

/*
CREATE TABLE `user_activity` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `activity_time` datetime DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_activity_time` (`activity_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
 */
const UserActivitySchema: ModelAttributes = {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: Sequelize.INTEGER,
    },
    activity_time: {
        type: Sequelize.DATE,
    },
    is_deleted: {
        type: Sequelize.BOOLEAN,
    },
    create_time: {
        type: Sequelize.DATE,
    },
    update_time: {
        type: Sequelize.DATE,
    },
};

export class UserActivityModel extends Model {
    public id!: number;
    public user_id!: number;
    public activity_time!: Date;
    public is_deleted!: boolean;
    public create_time!: Date;
    public update_time!: Date;

    public static async getRawByID({ id }: { id: number }) {
        const res = await UserActivityModel.findOne({
            where: { id },
            raw: true,
        });
        if (!res) {
            throw new Error(`User activity not found with id: ${id}`);
        }
        return res;
    }
}

UserActivityModel.init(UserActivitySchema, {
    ...Defaultconfig,
    sequelize,
    tableName: 'user_activity',
});
