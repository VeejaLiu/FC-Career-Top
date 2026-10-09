import { Logger } from '../../lib/logger';
import { UserSettingModel } from '../../models/schema/UserSetting';

const logger = new Logger(__filename);

export const NOTIFICATION_ITEMS = {
    PlayerUpdate_Overall: 'PlayerUpdate.Overall',
    PlayerUpdate_SkillMove: 'PlayerUpdate.SkillMove',
    PlayerUpdate_WeakFoot: 'PlayerUpdate.WeakFoot',
    PlayerUpdate_PlayStyles: 'PlayerUpdate.PlayStyles',
};

const DEFAULT_USER_SETTING = {
    enable_notification: true,
    notification_items: [
        NOTIFICATION_ITEMS.PlayerUpdate_Overall,
        NOTIFICATION_ITEMS.PlayerUpdate_SkillMove,
        NOTIFICATION_ITEMS.PlayerUpdate_WeakFoot,
        NOTIFICATION_ITEMS.PlayerUpdate_PlayStyles,
    ],
};

async function initUserSetting(userId: number | string) {
    await UserSettingModel.create({
        user_id: userId,
        default_game_version: 25,
        enable_notification: DEFAULT_USER_SETTING.enable_notification,
        notification_items: JSON.stringify(DEFAULT_USER_SETTING.notification_items),
    });
}

export async function getUserSetting({ userId }: { userId: number | string }): Promise<{
    success: boolean;
    message: string;
    data?: {
        userId: number | string;
        defaultGameVersion: number;
        enableNotification: boolean;
        notificationItems: {
            PlayerUpdate_Overall: boolean;
            PlayerUpdate_SkillMove: boolean;
            PlayerUpdate_WeakFoot: boolean;
            PlayerUpdate_PlayStyles: boolean;
        };
    };
}> {
    try {
        const userSetting = await UserSettingModel.findOne({
            where: { user_id: userId, is_deleted: false },
            raw: true,
        });
        if (!userSetting) {
            await initUserSetting(userId);
            return await getUserSetting({ userId });
        }

        return {
            success: true,
            message: 'success',
            data: {
                userId: userId,
                defaultGameVersion: userSetting.default_game_version,
                enableNotification: userSetting.enable_notification,
                notificationItems: {
                    PlayerUpdate_Overall: userSetting.notification_items.includes(
                        NOTIFICATION_ITEMS.PlayerUpdate_Overall,
                    ),
                    PlayerUpdate_SkillMove: userSetting.notification_items.includes(
                        NOTIFICATION_ITEMS.PlayerUpdate_SkillMove,
                    ),
                    PlayerUpdate_WeakFoot: userSetting.notification_items.includes(
                        NOTIFICATION_ITEMS.PlayerUpdate_WeakFoot,
                    ),
                    PlayerUpdate_PlayStyles: userSetting.notification_items.includes(
                        NOTIFICATION_ITEMS.PlayerUpdate_PlayStyles,
                    ),
                },
            },
        };
    } catch (e) {
        logger.error(`[getUserSetting] ${e.message}`);
        return {
            success: false,
            message: 'Something went wrong',
        };
    }
}
