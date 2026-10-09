import { Logger } from '../../lib/logger';
import { PLAYER_PRIMARY_POS_NAME, PLAYER_PRIMARY_POS_TYPE } from './get-all-players';
import { PlayerModel } from '../../models/schema/PlayerDB';
import { PlayerStatusHistoryModel } from '../../models/schema/PlayerStatusHistoryDB';

const logger = new Logger(__filename);

export interface PlayerTrend {
    inGameDate: string;
    overallRating: number;
    potential: number;
}

interface PlayerTrendData {
    playerID: number;
    playerName: string;
    preferredposition1: string;
    positionType: string;
    trends: PlayerTrend[];
}

async function getTrendsForSinglePlayer({
    userID,
    player,
    gameVersion,
}: {
    userID: number | string;
    player: {
        player_id: number;
        player_name: string;
        preferredposition1: string;
    };
    gameVersion: number;
}): Promise<PlayerTrendData> {
    const playerTrends: {
        player_id: number;
        in_game_date: string;
        overallrating: number;
        potential: number;
    }[] = await PlayerStatusHistoryModel.findAll({
        attributes: ['player_id', 'in_game_date', 'overallrating', 'potential'],
        where: {
            player_id: player.player_id,
            user_id: userID,
            game_version: gameVersion,
        },
        order: [['in_game_date', 'DESC']],
        raw: true,
    });

    let trends = playerTrends
        .sort((a, b) => {
            return new Date(a.in_game_date).getTime() - new Date(b.in_game_date).getTime();
        })
        .map((trend) => {
            return {
                inGameDate: trend.in_game_date,
                overallRating: trend.overallrating,
                potential: trend.potential,
            };
        });
    if (!trends || trends.length === 0) {
        logger.info(`[getTrendsForSinglePlayer] No trends found for playerID: ${player.player_id}`);
        trends = [];
    }
    return {
        playerID: player.player_id,
        playerName: player.player_name,
        positionType: PLAYER_PRIMARY_POS_TYPE[player.preferredposition1],
        preferredposition1: PLAYER_PRIMARY_POS_NAME[player.preferredposition1],
        trends: trends,
    };
}

export async function getAllPlayerTrends({
    userId,
    gameVersion,
}: {
    userId: string;
    gameVersion: number;
}): Promise<PlayerTrendData[]> {
    try {
        const players: {
            player_id: number;
            player_name: string;
            preferredposition1: string;
        }[] = await PlayerModel.findAll({
            attributes: ['player_id', 'player_name', 'preferredposition1'],
            where: {
                user_id: userId,
                game_version: gameVersion,
                is_archived: false,
                is_deleted: false,
            },
            raw: true,
        });
        // logger.info(
        //     `[getAllPlayerTrends] ${players?.length} players found, playerIDs: ${players?.map((p) => p.player_id)}`,
        // );
        if (!players || players.length === 0) {
            logger.info(`[getAllPlayerTrends] No players found`);
            return [];
        }

        // query all player trends
        const promises = [];

        for (let i = 0; i < players.length; i++) {
            promises.push(
                getTrendsForSinglePlayer({
                    userID: userId,
                    player: players[i],
                    gameVersion: gameVersion,
                }),
            );
        }
        const result = (await Promise.all(promises)).filter((r) => r);
        // logger.info(`[getAllPlayerTrends] ${result?.length} player trends(not null) found`);
        return result;
    } catch (e) {
        logger.error(`[getAllPlayerTrends] ${e.stack}`);
        return [];
    }
}
