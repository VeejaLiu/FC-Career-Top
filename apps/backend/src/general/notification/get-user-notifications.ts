import { UserNotificationModel } from '../../models/schema/UserNotificationDB';
import { Logger } from '../../lib/logger';
import { PLAYER_PRIMARY_POS_NAME } from '../player/get-all-players';
import { doRawQuery } from '../../models';

const logger = new Logger(__filename);

export async function getUserNotifications({
    userId,
    gameVersion,
    filter,
    onlyUnread = false,
    page = 0,
    limit = 10,
}: {
    gameVersion: number;
    userId: any;
    filter: 'PlayerUpdate.Overall' | 'PlayerUpdate.SkillMove' | 'PlayerUpdate.WeakFoot' | 'all';
    onlyUnread: boolean;
    page: number;
    limit: number;
}) {
    try {
        let filterSQL = '';

        const where = {
            user_id: userId,
            game_version: gameVersion,
            is_deleted: 0,
        };
        if (onlyUnread) {
            where['is_read'] = 0;
        }
        if (['PlayerUpdate.Overall', 'PlayerUpdate.SkillMove', 'PlayerUpdate.WeakFoot'].includes(filter)) {
            filterSQL = `AND un.message_subtype = '${filter}'`;
            where['message_subtype'] = filter;
        }

        const total = await UserNotificationModel.count({ where });

        const results = await doRawQuery({
            query: `
                SELECT un.*,
                       p.player_name,
                       p.preferredposition1
                FROM user_notification un
                         RIGHT JOIN player as p
                                    ON un.player_id = p.player_id
                WHERE un.user_id = ?
                  AND un.game_version = ?
                    ${filterSQL}
                  AND p.user_id = ?
                  AND p.game_version = ?
                  AND un.is_deleted = 0 
                  ${onlyUnread ? 'AND un.is_read = 0' : ''}
                  AND p.is_archived = 0
                ORDER BY un.in_game_date DESC, un.id DESC
                LIMIT ?, ?`,
            params: [userId, gameVersion, userId, gameVersion, (page - 1) * limit, limit],
        });

        return {
            total,
            items: results.map((result: any) => {
                return {
                    id: result.id,
                    user_id: result.user_id,
                    game_version: result.game_version,
                    in_game_date: result.in_game_date,
                    message_type: result.message_type,
                    message_subtype: result.message_subtype,
                    player_id: result.player_id,
                    player_position: PLAYER_PRIMARY_POS_NAME[result.preferredposition1],
                    player_name: result.player_name,
                    old_overall_rating: result.old_overall_rating,
                    overall_rating: result.overall_rating,
                    old_potential: result.old_potential,
                    potential: result.potential,
                    old_skillmoves: result.old_skillmoves,
                    skillmoves: result.skillmoves,
                    old_weakfoot: result.old_weakfoot,
                    weakfoot: result.weakfoot,
                    is_read: result.is_read,
                    create_time: result.create_time,
                };
            }),
        };
    } catch (error) {
        logger.error(error);
        return [];
    }
}
