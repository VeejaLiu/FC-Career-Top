import { Logger } from '../../lib/logger';
import { refreshSecretKey } from './refresh-secret-key';
import { UserSecretKeyModel } from '../../models/schema/UserSecretKeyDB';

const logger = new Logger(__filename);

export async function getSecretKey({ userId }: { userId: string }): Promise<{
    success: boolean;
    message: string;
    data?: any;
}> {
    try {
        const userSecretKey = await UserSecretKeyModel.findOne({
            where: { user_id: userId },
        });

        if (!userSecretKey || !userSecretKey.secret_key) {
            return await refreshSecretKey({ userId });
        }

        return {
            success: true,
            message: 'success',
            data: { secretKey: userSecretKey.secret_key },
        };
    } catch (e) {
        logger.error(`[getSecretKey] ${e.message}`);
        return {
            success: false,
            message: 'Something went wrong',
        };
    }
}
