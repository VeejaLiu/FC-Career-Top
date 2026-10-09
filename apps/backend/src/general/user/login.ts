import bcrypt from 'bcryptjs';
import { Logger } from '../../lib/logger';
import { signToken } from '../../lib/token/signToken';
import { UserModel } from '../../models/schema/UserDB';
import { Op } from 'sequelize';

const logger = new Logger(__filename);

export async function loginUser({ username, password }: { username: string; password: string }): Promise<{
    success: boolean;
    message: string;
    data?: any;
}> {
    try {
        if (!username || !password || username.length < 1 || password.length < 1) {
            logger.info(`[/user/login] Missing required fields`);
            return {
                success: false,
                message: 'User or password not matched',
            };
        }

        /*
         * Check if user already exists
         */
        const user = await UserModel.findOne({
            where: { [Op.or]: [{ username: username }, { email: username }] },
        });

        if (!user) {
            logger.info(`[/user/login] User not found`);
            return {
                success: false,
                message: 'User or password not matched',
            };
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            logger.info(`[/user/login] Password not matched`);
            return {
                success: false,
                message: 'User or password not matched',
            };
        }

        const userID = user.id;
        logger.info(`[/user/login] user[${userID}][${user.username}][${user.email}] logged in`);

        /*
         * Sign token
         */
        const token = signToken(userID);
        await UserModel.update({ token: token }, { where: { id: userID } });

        return {
            success: true,
            message: 'success',
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                token: token,
                createTime: user.create_time,
                updateTime: user.update_time,
            },
        };
    } catch (e) {
        logger.error(`[/user/register] ${e.message}`);
        return {
            success: false,
            message: 'Something went wrong',
        };
    }
}
