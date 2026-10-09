import { Sequelize } from 'sequelize';
import { env } from '../env';
import { Logger } from '../lib/logger';

const logger = new Logger(__filename);

export const Defaultconfig = {
    timestamps: true,
    freezeTableName: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
};

export const sequelize = new Sequelize(
    env.mysql.database, // database name
    env.mysql.username, // username
    env.mysql.password, // password
    {
        host: env.mysql.host,
        dialect: 'mysql',
        pool: {
            max: 100,
            min: 0,
            acquire: 120000,
            idle: 5000,
        },
        logging: env.mysql.logging,
        // operatorsAliases: {},
        benchmark: true,
    },
);

export async function closeSequelize() {
    logger.info('Closing sequelize connection');
    await sequelize.close();
    logger.info('Sequelize connection closed');
}
