import Sequelize, { Model, ModelAttributes, Op } from 'sequelize';
import { Defaultconfig, sequelize } from '../db-config-mysql';
import { doRawQuery } from '../index';

/*
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `is_email_verified` tinyint(1) DEFAULT '0',
  `last_send_email_time` datetime DEFAULT NULL,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `is_deleted` tinyint(1) DEFAULT '0',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
 */
const UserSchema: ModelAttributes = {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: Sequelize.TEXT,
    },
    email: {
        type: Sequelize.STRING(255),
    },
    is_email_verified: {
        type: Sequelize.BOOLEAN,
    },
    last_send_email_time: {
        type: Sequelize.DATE,
    },
    password: {
        type: Sequelize.TEXT,
    },
    token: {
        type: Sequelize.TEXT,
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

export interface UserDb {
    id: number;
    username: string;
    email: string;
    is_email_verified: boolean;
    last_send_email_time: Date;
    password: string;
    token: string;
    is_deleted: boolean;
    create_time: Date;
    update_time: Date;
}

export class UserModel extends Model<UserDb> {
    public id!: number;
    public username!: string;
    public email!: string;
    public is_email_verified!: boolean;
    public last_send_email_time!: Date;
    public password!: string;
    public token!: string;
    public is_deleted!: boolean;
    public create_time!: Date;
    public update_time!: Date;

    public static async getRawByID({ id }: { id: number }) {
        const res = await UserModel.findOne({
            where: { id },
            raw: true,
        });
        if (!res) {
            throw new Error(`User not found with id: ${id}`);
        }
        return res;
    }

    public static async isUsernameOrEmailExist({
        username,
        email,
    }: {
        username: string;
        email: string;
    }): Promise<boolean> {
        const user = await doRawQuery({
            query: `SELECT * FROM user WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)`,
            params: [username, email],
        });
        return user.length > 0;
    }

    /**
     * Get daily new users count
     *
     * @param startDate - start date, format: 'YYYY-MM-DD'
     * @param endDate - end date, format: 'YYYY-MM-DD'
     *
     */
    static async getDailyNewUsersCount({
        startDate,
        endDate,
    }: {
        startDate: string;
        endDate: string;
    }): Promise<{ createDate: string; c: number }[]> {
        const result: {
            createDate: string;
            c: number;
        }[] = await doRawQuery({
            query: `
                SELECT COUNT(*) AS c, DATE_FORMAT(create_time, '%Y-%m-%d') AS createDate
                FROM user
                WHERE DATE_FORMAT(create_time, '%Y-%m-%d') BETWEEN ? AND ?
                GROUP BY createDate
                ORDER BY createDate DESC`,
            params: [startDate, endDate],
        });
        return result;
    }
}

UserModel.init(UserSchema, {
    ...Defaultconfig,
    sequelize,
    tableName: 'user',
});
