import { Logger } from '../../lib/logger';
import { UserModel } from '../../models/schema/UserDB';

const logger = new Logger(__filename);

export async function logoutUser({ userId }: { userId: string }): Promise<{
    success: boolean;
    message: string;
    data?: any;
}> {
    try {
        if (!userId) {
            logger.info(`[logoutUser] Missing required fields`);
            return {
                success: false,
                message: 'Missing required fields',
            };
        }

        /*
         * Check if user already exists
         */
        const user = await UserModel.findOne({ where: { id: userId } });
        if (!user) {
            logger.info(`[logoutUser] User not found`);
            return {
                success: false,
                message: 'User not found or already logged out',
            };
        }

        /*
         * Revoking token
         */
        await UserModel.update({ token: '' }, { where: { id: userId } });
        return {
            success: true,
            message: 'success',
        };
    } catch (e) {
        logger.error(`[logoutUser] ${e.message}`);
        return {
            success: false,
            message: 'Something went wrong',
        };
    }
}
