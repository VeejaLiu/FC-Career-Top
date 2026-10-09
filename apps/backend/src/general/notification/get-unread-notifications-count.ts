import { Logger } from '../../lib/logger';
import { UserNotificationModel } from '../../models/schema/UserNotificationDB';

const logger = new Logger(__filename);

/**
 * Get unread notifications count
 *
 * @param userId
 * @param gameVersion
 */
export async function getUnreadNotificationsCount({
    userId,
    gameVersion,
}: {
    userId: string;
    gameVersion: number;
}): Promise<number> {
    try {
        const unreadCount = await UserNotificationModel.count({
            where: {
                user_id: userId,
                game_version: gameVersion,
                is_read: 0,
                is_deleted: 0,
            },
        });
        return unreadCount || 0;
    } catch (e) {
        logger.error(e);
        return 0;
    }
}
