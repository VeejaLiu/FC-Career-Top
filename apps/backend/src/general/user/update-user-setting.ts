import { Logger } from '../../lib/logger';
import { getUserSetting } from './get-user-setting';
import { UserSettingModel } from '../../models/schema/UserSetting';

const logger = new Logger(__filename);

export async function updateUserSetting({
    userId,
    category,
    subItem,
    value,
}: {
    userId: number | string;
    category: string;
    subItem?: string;
    value: boolean;
}): Promise<{
    success: boolean;
    message: string;
    data?: {
        userId: number | string;
        enableNotification: boolean;
        notificationItems: {
            PlayerUpdate_Overall: boolean;
            PlayerUpdate_SkillMove: boolean;
            PlayerUpdate_WeakFoot: boolean;
        };
    };
}> {
    try {
        logger.info(
            `[updateUserSetting] userId: ${userId}, category: ${category}, subItem: ${subItem}, value: ${value}`,
        );

        const userSetting = await UserSettingModel.findOne({
            where: { user_id: userId, is_deleted: false },
            raw: true,
        });
        if (userSetting) {
            switch (category) {
                case 'enable_notification':
                    await UserSettingModel.update({ enable_notification: value }, { where: { user_id: userId } });
                    break;
                case 'notification_items':
                    // ["PlayerUpdate.Overall","PlayerUpdate.SkillMove","PlayerUpdate.WeakFoot"]
                    const notificationItems = JSON.parse(userSetting.notification_items);
                    const notificationItemsSet = new Set(notificationItems);
                    if (value) {
                        notificationItemsSet.add(subItem);
                    } else {
                        notificationItemsSet.delete(subItem);
                    }
                    await UserSettingModel.update(
                        { notification_items: JSON.stringify(Array.from(notificationItemsSet)) },
                        { where: { user_id: userId } },
                    );
                    break;
                case 'default_game_version':
                    await UserSettingModel.update({ default_game_version: value }, { where: { user_id: userId } });
                    break;
                default:
                    break;
            }
        }

        return await getUserSetting({ userId });
    } catch (e) {
        logger.error(`[updateUserSetting] ${e.message}`);
        return {
            success: false,
            message: 'Something went wrong',
        };
    }
}
