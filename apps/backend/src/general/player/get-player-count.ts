import { Logger } from '../../lib/logger';
import { PlayerModel } from '../../models/schema/PlayerDB';

const logger = new Logger(__filename);

export async function getPlayerCount({
    userId,
    gameVersion,
}: {
    userId: string;
    gameVersion: number;
}): Promise<number> {
    try {
        const count = await PlayerModel.count({
            where: {
                is_archived: 0,
                user_id: userId,
                game_version: gameVersion,
            },
        });
        return count;
    } catch (e) {
        logger.error(`[getPlayerCount] error: ${e}`);
        return 0;
    }
}
