import { generateUploadKey } from '../../utils/UploadKey';
import { Logger } from '../../lib/logger';
import { UserSecretKeyModel } from '../../models/schema/UserSecretKeyDB';

const logger = new Logger(__filename);

export async function refreshSecretKey({ userId }: { userId: number | string }): Promise<{
    success: boolean;
    message: string;
    data?: any;
}> {
    try {
        const newSecretKey = generateUploadKey();

        // query first
        const existingUSK = await UserSecretKeyModel.findOne({
            where: { user_id: userId },
        });

        // If not exist, insert, else update
        if (!existingUSK) {
            await UserSecretKeyModel.create({
                user_id: userId,
                secret_key: newSecretKey,
            });
            logger.info(`[refreshSecretKey] Insert secret key success`);
        } else {
            await UserSecretKeyModel.update({ secret_key: newSecretKey }, { where: { user_id: userId } });
            logger.info(`[refreshSecretKey] Update secret key success`);
        }

        return {
            success: true,
            message: 'success',
            data: {
                secretKey: newSecretKey,
            },
        };
    } catch (e) {
        logger.error(`[refreshSecretKey] ${e.message}`);
        return {
            success: false,
            message: 'Something went wrong',
        };
    }
}
