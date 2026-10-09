import { Logger } from '../../lib/logger';
import { UserActivityModel } from '../../models/schema/UserActivityDB';

const logger = new Logger(__filename);

export async function createNewUserActivity({ userID }: { userID: string }): Promise<void> {
    try {
        const now = new Date();
        // logger.info(`[createNewUserActivity] userID: ${userID}, time: ${now}`);

        await UserActivityModel.create({ user_id: userID, activity_time: now });
    } catch (e) {
        logger.error(`[createNewUserActivity] ${e}`);
    }
}
