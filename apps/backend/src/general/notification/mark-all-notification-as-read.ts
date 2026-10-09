import { UserNotificationModel } from '../../models/schema/UserNotificationDB';

import { Logger } from '../../lib/logger';
const logger = new Logger(__filename);

/**
 * Mark all notifications as read
 * @param userId
 * @param gameVersion
 * @returns
 */
export async function markAllNotificationAsRead({
    userId,
    gameVersion,
}: {
    userId: number;
    gameVersion: number;
}): Promise<any> {
    try {
        await UserNotificationModel.update(
            {
                is_read: 1,
            },
            {
                where: {
                    user_id: userId,
                    game_version: gameVersion,
                    is_read: 0,
                    is_deleted: 0,
                },
            },
        );
        return { success: true, message: 'All notifications marked as read' };
    } catch (error) {
        logger.error(error);
        return { success: false, message: 'Failed to mark all notifications as read' };
    }
}
