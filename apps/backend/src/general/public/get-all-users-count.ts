import { UserModel } from '../../models/schema/UserDB';
import { Logger } from '../../lib/logger';

const logger = new Logger(__filename);

export async function getAllUsersCount(): Promise<number> {
    try {
        const result = await UserModel.count({ where: { is_deleted: false } });
        return result;
    } catch (e) {
        logger.error(`[getAllUsersCount] e.message: ${e.message}`);
        logger.error(`[getAllUsersCount] e.stack: ${e.stack}`);
        return 0;
    }
}
