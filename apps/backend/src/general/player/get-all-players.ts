import { Logger } from '../../lib/logger';
import { PlayerDB, PlayerModel } from '../../models/schema/PlayerDB';

const logger = new Logger(__filename);

export const PLAYER_PRIMARY_POS_NAME = {
    0: 'GK',
    1: 'SW',
    2: 'RWB',
    3: 'RB',
    4: 'RCB',
    5: 'CB',
    6: 'LCB',
    7: 'LB',
    8: 'LWB',
    9: 'RDM',
    10: 'CDM',
    11: 'LDM',
    12: 'RM',
    13: 'RCM',
    14: 'CM',
    15: 'LCM',
    16: 'LM',
    17: 'RAM',
    18: 'CAM',
    19: 'LAM',
    20: 'RF',
    21: 'CF',
    22: 'LF',
    23: 'RW',
    24: 'RS',
    25: 'ST',
    26: 'LS',
    27: 'LW',
};

export const PLAYER_PRIMARY_POS_TYPE = {
    0: 'GK',
    1: 'DEF',
    2: 'DEF',
    3: 'DEF',
    4: 'DEF',
    5: 'DEF',
    6: 'DEF',
    7: 'DEF',
    8: 'DEF',
    9: 'MID',
    10: 'MID',
    11: 'MID',
    12: 'MID',
    13: 'MID',
    14: 'MID',
    15: 'MID',
    16: 'MID',
    17: 'MID',
    18: 'MID',
    19: 'MID',
    20: 'FOR',
    21: 'FOR',
    22: 'FOR',
    23: 'FOR',
    24: 'FOR',
    25: 'FOR',
    26: 'FOR',
    27: 'FOR',
};

export interface PlayerOverall {
    playerID: number;
    playerName: string;
    overallRating: number;
    potential: number;
    age: number;
    positionType: 'GK' | 'DEF' | 'MID' | 'FOR';
    position1: string;
    position2: string;
    position3: string;
    position4: string;
    imageUrl?: string;
    overallRanking?: number;
    potentialRanking?: number;
    skillMoves: number;
    weakFootAbilityTypeCode: number;
}

export async function getAllPlayers({
    userId,
    gameVersion,
}: {
    userId: string;
    gameVersion: number;
}): Promise<PlayerOverall[]> {
    try {
        if (!userId || !gameVersion) {
            logger.error(`[getAllPlayers] Invalid userId[${userId}] or gameVersion[${gameVersion}]`);
            return [];
        }

        const sqlRes: PlayerDB[] = await PlayerModel.findAll({
            attributes: [
                'player_id',
                'player_name',
                'overallrating',
                'potential',
                'age',
                'birthdate',
                'preferredposition1',
                'preferredposition2',
                'preferredposition3',
                'preferredposition4',
                'skillmoves',
                'weakfootabilitytypecode',
            ],
            where: {
                is_deleted: 0,
                is_archived: 0,
                user_id: userId,
                game_version: gameVersion,
            },
            raw: true,
        });

        if (sqlRes.length === 0) {
            logger.info(`[getAllPlayers] No players found for userId: ${userId}`);
            return [];
        }

        const result: PlayerOverall[] = [];
        for (let i = 0; i < sqlRes.length; i++) {
            const player = sqlRes[i];
            result.push({
                playerID: player.player_id,
                playerName: player.player_name,
                overallRating: player.overallrating,
                potential: player.potential,
                age: player.age,
                positionType: PLAYER_PRIMARY_POS_TYPE[player.preferredposition1],
                position1: PLAYER_PRIMARY_POS_NAME[player.preferredposition1],
                position2: PLAYER_PRIMARY_POS_NAME[player.preferredposition2],
                position3: PLAYER_PRIMARY_POS_NAME[player.preferredposition3],
                position4: PLAYER_PRIMARY_POS_NAME[player.preferredposition4],
                skillMoves: player.skillmoves,
                weakFootAbilityTypeCode: player.weakfootabilitytypecode,
            });
        }

        result.forEach((player) => {
            const samePositionPlayers = result.filter((p) => p.position1 === player.position1);
            // Get the overall rating ranking of the player
            const overallRanking = samePositionPlayers
                .map((p) => p.overallRating)
                .sort((a, b) => b - a)
                .indexOf(player.overallRating);
            // Get the potential ranking of the player
            const potentialRanking = samePositionPlayers
                .map((p) => p.potential)
                .sort((a, b) => b - a)
                .indexOf(player.potential);
            player.overallRanking = overallRanking + 1;
            player.potentialRanking = potentialRanking + 1;
        });

        return result;
    } catch (e) {
        logger.error(`[getAllPlayers] Error: ${e.message}`);
        return [];
    }
}
