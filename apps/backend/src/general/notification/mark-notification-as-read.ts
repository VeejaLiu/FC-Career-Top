import { UserNotificationModel } from '../../models/schema/UserNotificationDB';

import { Logger } from '../../lib/logger';
const logger = new Logger(__filename);

/**
 * Mark notification as read
 * @param userId
 * @param gameVersion
 * @param id
 * @returns
 */
export async function markNotificationAsRead({
    userId,
    gameVersion,
    id,
}: {
    userId: number;
    gameVersion: number;
    id: number;
}): Promise<any> {
    try {
        const notification = await UserNotificationModel.findOne({
            where: {
                id: id,
                user_id: userId,
                game_version: gameVersion,
            },
        });
        if (!notification) {
            logger.error(`Notification not found. [${JSON.stringify({ userId, id })}]`);
            throw new Error('Notification not found');
        }
        notification.is_read = 1;
        await notification.save();
        return { success: true, message: 'Notification marked as read' };
    } catch (error) {
        logger.error(error);
        return { success: false, message: 'Failed to mark notification as read' };
    }
}
