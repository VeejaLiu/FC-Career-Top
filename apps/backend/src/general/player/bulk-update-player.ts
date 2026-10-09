import { DateUtils } from '../../utils/Date';
import { Logger } from '../../lib/logger';
import { PlayerModel } from '../../models/schema/PlayerDB';
import { PlayerStatusHistoryModel } from '../../models/schema/PlayerStatusHistoryDB';
import { sendMessageToUser } from '../../lib/ws/websocket-server';
import { getUserSetting, NOTIFICATION_ITEMS } from '../user/get-user-setting';
import { UserNotificationModel } from '../../models/schema/UserNotificationDB';

const logger = new Logger(__filename);

async function sendPlayerUpdateNotification({
    userId,
    gameVersion,
    inGameDate,
    playerID,
    playerName,
    existingPlayer,
    overallrating,
    potential,
    skillmoves,
    weakfootabilitytypecode,
    playerStyles,
}: {
    userId: number;
    gameVersion: number;
    inGameDate: string;
    playerID: number;
    playerName: string;
    existingPlayer: PlayerModel;
    overallrating: number;
    potential: number;
    skillmoves: number;
    weakfootabilitytypecode: number;
    playerStyles: string;
}) {
    try {
        const userSettingRes = await getUserSetting({ userId });
        if (!userSettingRes.success) {
            return;
        }
        const userSetting = userSettingRes.data;

        if (!userSetting.enableNotification) {
            return;
        }

        // date format: '1991-1-1' -> '1991-01-01'
        const [y, m, d] = inGameDate.split('-').map((v: string) => Number(v));
        const dateStr = `${y}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`;

        /*
         * Check if overallrating or potential has changed
         */
        if (
            (Number(existingPlayer.overallrating) !== Number(overallrating) ||
                Number(existingPlayer.potential) !== Number(potential)) &&
            userSetting.notificationItems.PlayerUpdate_Overall
        ) {
            logger.info(
                `[sendPlayerUpdateNotification][userID=${userId}] playerID=${playerID}, playerName=${playerName}, overallrating=${existingPlayer.overallrating} -> ${overallrating}`,
            );
            logger.info(
                `[sendPlayerUpdateNotification][userID=${userId}] playerID=${playerID}, playerName=${playerName}, potential=${existingPlayer.potential} -> ${potential}`,
            );
            const notification = await UserNotificationModel.create({
                user_id: userId,
                game_version: gameVersion,
                in_game_date: dateStr,
                message_type: 'PlayerUpdate',
                message_subtype: NOTIFICATION_ITEMS.PlayerUpdate_Overall,
                player_id: playerID,
                old_overall_rating: existingPlayer.overallrating,
                overall_rating: overallrating,
                old_potential: existingPlayer.potential,
                potential: potential,
                is_read: 0,
            });

            sendMessageToUser({
                userId: userId,
                message: {
                    type: NOTIFICATION_ITEMS.PlayerUpdate_Overall,
                    payload: {
                        playerID: playerID,
                        playerName: playerName,
                        oldOverallrating: existingPlayer.overallrating,
                        overallrating: overallrating,
                        oldPotential: existingPlayer.potential,
                        potential: potential,
                        userNotificationID: notification.id,
                    },
                },
            });
        }

        /*
         * Check if SkillMoves has changed
         */
        if (
            Number(existingPlayer.skillmoves) !== Number(skillmoves) &&
            userSetting.notificationItems.PlayerUpdate_SkillMove
        ) {
            const notification = await UserNotificationModel.create({
                user_id: userId,
                game_version: gameVersion,
                in_game_date: dateStr,
                message_type: 'PlayerUpdate',
                message_subtype: NOTIFICATION_ITEMS.PlayerUpdate_SkillMove,
                player_id: playerID,
                old_skillmoves: existingPlayer.skillmoves,
                skillmoves: skillmoves,
                is_read: 0,
            });

            sendMessageToUser({
                userId: userId,
                message: {
                    type: NOTIFICATION_ITEMS.PlayerUpdate_SkillMove,
                    payload: {
                        playerID: playerID,
                        playerName: playerName,
                        oldSkillMoves: existingPlayer.skillmoves,
                        skillMoves: skillmoves,
                        userNotificationID: notification.id,
                    },
                },
            });
        }

        /*
         * Check if WeakFootAbilityTypeCode has changed
         */
        if (
            Number(existingPlayer.weakfootabilitytypecode) !== Number(weakfootabilitytypecode) &&
            userSetting.notificationItems.PlayerUpdate_WeakFoot
        ) {
            const notification = await UserNotificationModel.create({
                user_id: userId,
                game_version: gameVersion,
                in_game_date: dateStr,
                message_type: 'PlayerUpdate',
                message_subtype: NOTIFICATION_ITEMS.PlayerUpdate_WeakFoot,
                player_id: playerID,
                old_weakfoot: existingPlayer.weakfootabilitytypecode,
                weakfoot: weakfootabilitytypecode,
                is_read: 0,
            });

            sendMessageToUser({
                userId: userId,
                message: {
                    type: NOTIFICATION_ITEMS.PlayerUpdate_WeakFoot,
                    payload: {
                        playerID: playerID,
                        playerName: playerName,
                        oldWeakFootAbilityTypeCode: existingPlayer.weakfootabilitytypecode,
                        weakFootAbilityTypeCode: weakfootabilitytypecode,
                        userNotificationID: notification.id,
                    },
                },
            });
        }

        /*
         * Check if player's PlayerStyle has changed
         */
        if (existingPlayer.play_styles !== playerStyles && userSetting.notificationItems.PlayerUpdate_PlayStyles) {
            const notification = await UserNotificationModel.create({
                user_id: userId,
                game_version: gameVersion,
                in_game_date: dateStr,
                message_type: 'PlayerUpdate',
                message_subtype: NOTIFICATION_ITEMS.PlayerUpdate_PlayStyles,
                player_id: playerID,
                old_play_styles: existingPlayer.play_styles,
                play_styles: playerStyles,
                is_read: 0,
            });
            sendMessageToUser({
                userId: userId,
                message: {
                    type: NOTIFICATION_ITEMS.PlayerUpdate_PlayStyles,
                    payload: {
                        playerID: playerID,
                        playerName: playerName,
                        oldPlayStyles: existingPlayer.play_styles,
                        playStyles: playerStyles,
                        userNotificationID: notification.id,
                    },
                },
            });
        }
    } catch (e) {
        logger.error(`[sendPlayerUpdateNotification][userID=${userId}] error: ${e}`);
    }
}

async function bulkUpdatePlayer24({ userId, players }: { players: any[]; userId: number }) {
    // Query all existing players
    const existingPlayers = await PlayerModel.findAll({
        attributes: ['player_id'],
        where: {
            user_id: userId,
            game_version: 24,
            is_archived: false,
        },
        raw: true,
    });
    const existingPlayerIDs = existingPlayers.map((p) => p.player_id);
    const existingPlayerSet = new Set(existingPlayerIDs);
    logger.info(`[bulkUpdatePlayer24][userId=${userId}] existingPlayers.length=${existingPlayers.length}`);
    logger.info(`[bulkUpdatePlayer24][userId=${userId}] new players count: ${players.length}`);
    logger.info(`[bulkUpdatePlayer24][userId=${userId}] new players: ${players.map((p) => p.playerID).join(',')}`);

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        let {
            // -- player
            playerID,
            playerName,
            currentDate,
            // overallrating,
            overallrating,
            potential,
            // -- personal
            birthdate,
            nationality,
            height,
            weight,
            // -- player details
            preferredfoot,
            preferredposition1,
            preferredposition2,
            preferredposition3,
            preferredposition4,
            skillmoves,
            weakfootabilitytypecode,
            attackingworkrate,
            defensiveworkrate,
            // -- Player Styles
            playerStyles,
            // -- pace
            acceleration,
            sprintspeed,
            // -- attacking
            positioning,
            finishing,
            shotpower,
            longshots,
            volleys,
            penalties,
            // -- passing
            vision,
            crossing,
            freekickaccuracy,
            shortpassing,
            longpassing,
            curve,
            // -- dribbling
            agility,
            balance,
            reactions,
            ballcontrol,
            dribbling,
            composure,
            // -- defending
            interceptions,
            headingaccuracy,
            defensiveawareness,
            standingtackle,
            slidingtackle,
            // -- physical
            jumping,
            stamina,
            strength,
            aggression,
            // -- goalkeeping
            gkdiving,
            gkhandling,
            gkkicking,
            gkpositioning,
            gkreflexes,
        } = player;

        // Some player names have single quotes, escape them, lime O'Connell
        playerName = playerName?.replace(/'/g, "''");

        // remove playerID from existingPlayerSet
        if (existingPlayerSet.has(playerID)) {
            existingPlayerSet.delete(playerID);
        }

        // convert currentDate to age, currentDate is in format 'yyyy-mm-dd'
        const [y, m, d] = currentDate.split('-').map((v: string) => Number(v));
        const playerAge = Math.floor((new DateUtils(y, m, d).toGregorianDays() - birthdate) / 365.25);

        // logger.info(
        //     `[bulkUpdatePlayer] [i=${i}]` +
        //         `playerID=${playerID}, ` +
        //         `playerName=[${playerName}], ` +
        //         `currentDate=${currentDate}, ` +
        //         `overallrating=${overallrating}, ` +
        //         `potential=${potential}, ` +
        //         `birthdate=${birthdate}`,
        // );

        // query first
        const existingPlayer = await PlayerModel.findOne({
            where: {
                user_id: userId,
                game_version: 24,
                player_id: playerID,
            },
        });
        if (!existingPlayer) {
            await PlayerModel.create({
                // user id
                user_id: userId,
                // game version
                game_version: 24,
                // basic info
                player_id: playerID,
                player_name: playerName,
                overallrating,
                potential,
                // personal info
                birthdate,
                nationality,
                height,
                weight,
                age: playerAge,
                // player details
                preferredfoot,
                preferredposition1,
                preferredposition2,
                preferredposition3,
                preferredposition4,
                skillmoves,
                weakfootabilitytypecode,
                attackingworkrate,
                defensiveworkrate,
                // pace
                acceleration,
                sprintspeed,
                // attacking
                positioning,
                finishing,
                shotpower,
                longshots,
                volleys,
                penalties,
                // passing
                vision,
                crossing,
                freekickaccuracy,
                shortpassing,
                longpassing,
                curve,
                // dribbling
                agility,
                balance,
                reactions,
                ballcontrol,
                dribbling,
                composure,
                // defending
                interceptions,
                headingaccuracy,
                defensiveawareness,
                standingtackle,
                slidingtackle,
                // physical
                jumping,
                stamina,
                strength,
                aggression,
                // goalkeeping
                gkdiving,
                gkhandling,
                gkkicking,
                gkpositioning,
                gkreflexes,
            });
            // logger.info(`[bulkUpdatePlayer] Created new player: playerID=${playerID}`);
        } else {
            sendPlayerUpdateNotification({
                userId,
                gameVersion: 24,
                inGameDate: currentDate,
                playerID,
                playerName,
                existingPlayer,
                overallrating,
                potential,
                skillmoves,
                weakfootabilitytypecode,
                playerStyles,
            }).then();
            const result = await PlayerModel.update(
                {
                    // basic info
                    player_name: playerName,
                    overallrating,
                    potential,
                    // personal info
                    birthdate,
                    nationality,
                    height,
                    weight,
                    age: playerAge,
                    // player details
                    preferredfoot,
                    preferredposition1,
                    preferredposition2,
                    preferredposition3,
                    preferredposition4,
                    skillmoves,
                    weakfootabilitytypecode,
                    attackingworkrate,
                    defensiveworkrate,
                    // pace
                    acceleration,
                    sprintspeed,
                    // attacking
                    positioning,
                    finishing,
                    shotpower,
                    longshots,
                    volleys,
                    penalties,
                    // passing
                    vision,
                    crossing,
                    freekickaccuracy,
                    shortpassing,
                    longpassing,
                    curve,
                    // dribbling
                    agility,
                    balance,
                    reactions,
                    ballcontrol,
                    dribbling,
                    composure,
                    // defending
                    interceptions,
                    headingaccuracy,
                    defensiveawareness,
                    standingtackle,
                    slidingtackle,
                    // physical
                    jumping,
                    stamina,
                    strength,
                    aggression,
                    // goalkeeping
                    gkdiving,
                    gkhandling,
                    gkkicking,
                    gkpositioning,
                    gkreflexes,
                    // meta info
                    is_archived: 0,
                },
                {
                    where: {
                        user_id: userId,
                        game_version: 24,
                        player_id: playerID,
                    },
                },
            );
        }

        /*
         * Update player_status_history
         */
        // date format: '1991-1-1' -> '1991-01-01'
        const dateStr = `${y}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`;
        // query by player_id and in_game_date
        const existingPSH = await PlayerStatusHistoryModel.findOne({
            where: {
                user_id: userId,
                game_version: 24,
                in_game_date: dateStr,
                player_id: playerID,
            },
        });
        if (!existingPSH) {
            await PlayerStatusHistoryModel.create({
                player_id: playerID,
                game_version: 24,
                in_game_date: dateStr,
                overallrating,
                potential,
                user_id: userId,
            });
        } else {
            logger.warn(
                `[bulkUpdatePlayer24][userId=${userId}] player_status_history already exists: playerID=${playerID}, date=${dateStr}`,
            );
            // update
            await PlayerStatusHistoryModel.update(
                { overallrating, potential },
                {
                    where: {
                        user_id: userId,
                        game_version: 24,
                        in_game_date: dateStr,
                        player_id: playerID,
                    },
                },
            );
        }
    }

    // archive players that are not in the new list
    if (existingPlayerSet.size > 0) {
        logger.info(
            `[bulkUpdatePlayer24][userID=${userId}] Archive players: ${Array.from(existingPlayerSet).join(',')}`,
        );
        const archivePlayerIDs = Array.from(existingPlayerSet);
        await PlayerModel.update(
            { is_archived: 1 },
            {
                where: {
                    user_id: userId,
                    game_version: 24,
                    player_id: archivePlayerIDs,
                },
            },
        );
    }
}

async function bulkUpdatePlayer25({ userId, players }: { players: any[]; userId: number }) {
    // Query all existing players
    const existingPlayers = await PlayerModel.findAll({
        attributes: ['player_id'],
        where: {
            user_id: userId,
            game_version: 25,
            is_archived: false,
        },
        raw: true,
    });
    const existingPlayerIDs = existingPlayers.map((p) => p.player_id);
    const existingPlayerSet = new Set(existingPlayerIDs);
    logger.info(`[bulkUpdatePlayer25][userId=${userId}] existingPlayers.length=${existingPlayers.length}`);
    logger.info(`[bulkUpdatePlayer25][userId=${userId}] new players count: ${players.length}`);
    logger.info(`[bulkUpdatePlayer25][userId=${userId}] new players: ${players.map((p) => p.playerID).join(',')}`);

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        let {
            // -- player
            playerID,
            playerName,
            currentDate,
            // overallrating,
            overallrating,
            potential,
            // -- personal
            birthdate,
            nationality,
            height,
            weight,
            // -- player details
            preferredfoot,
            preferredposition1,
            preferredposition2,
            preferredposition3,
            preferredposition4,
            skillmoves,
            weakfootabilitytypecode,
            // attackingworkrate, // not in FC 25
            // defensiveworkrate, // not in FC 25
            // -- Player Styles
            playerStyles,
            // -- pace
            acceleration,
            sprintspeed,
            // -- attacking
            positioning,
            finishing,
            shotpower,
            longshots,
            volleys,
            penalties,
            // -- passing
            vision,
            crossing,
            freekickaccuracy,
            shortpassing,
            longpassing,
            curve,
            // -- dribbling
            agility,
            balance,
            reactions,
            ballcontrol,
            dribbling,
            composure,
            // -- defending
            interceptions,
            headingaccuracy,
            defensiveawareness,
            standingtackle,
            slidingtackle,
            // -- physical
            jumping,
            stamina,
            strength,
            aggression,
            // -- goalkeeping
            gkdiving,
            gkhandling,
            gkkicking,
            gkpositioning,
            gkreflexes,
        } = player;

        // Some player names have single quotes, escape them, lime O'Connell
        playerName = playerName?.replace(/'/g, "''");

        // remove playerID from existingPlayerSet
        if (existingPlayerSet.has(playerID)) {
            existingPlayerSet.delete(playerID);
        }

        // convert currentDate to age, currentDate is in format 'yyyy-mm-dd'
        const [y, m, d] = currentDate.split('-').map((v: string) => Number(v));
        const playerAge = Math.floor((new DateUtils(y, m, d).toGregorianDays() - birthdate) / 365.25);

        // logger.info(
        //     `[bulkUpdatePlayer] [i=${i}]` +
        //         `playerID=${playerID}, ` +
        //         `playerName=[${playerName}], ` +
        //         `currentDate=${currentDate}, ` +
        //         `overallrating=${overallrating}, ` +
        //         `potential=${potential}, ` +
        //         `birthdate=${birthdate}`,
        // );

        // query first
        const existingPlayer = await PlayerModel.findOne({
            where: {
                user_id: userId,
                game_version: 25,
                player_id: playerID,
            },
        });
        if (!existingPlayer) {
            await PlayerModel.create({
                // user id
                user_id: userId,
                // game version
                game_version: 25,
                // basic info
                player_id: playerID,
                player_name: playerName,
                overallrating,
                potential,
                // personal info
                birthdate,
                nationality,
                height,
                weight,
                age: playerAge,
                // player details
                preferredfoot,
                preferredposition1,
                preferredposition2,
                preferredposition3,
                preferredposition4,
                skillmoves,
                weakfootabilitytypecode,
                // attackingworkrate,
                // defensiveworkrate,
                // pace
                acceleration,
                sprintspeed,
                // attacking
                positioning,
                finishing,
                shotpower,
                longshots,
                volleys,
                penalties,
                // passing
                vision,
                crossing,
                freekickaccuracy,
                shortpassing,
                longpassing,
                curve,
                // dribbling
                agility,
                balance,
                reactions,
                ballcontrol,
                dribbling,
                composure,
                // defending
                interceptions,
                headingaccuracy,
                defensiveawareness,
                standingtackle,
                slidingtackle,
                // physical
                jumping,
                stamina,
                strength,
                aggression,
                // goalkeeping
                gkdiving,
                gkhandling,
                gkkicking,
                gkpositioning,
                gkreflexes,
            });
            // logger.info(`[bulkUpdatePlayer] Created new player: playerID=${playerID}`);
        } else {
            sendPlayerUpdateNotification({
                userId,
                gameVersion: 25,
                inGameDate: currentDate,
                playerID,
                playerName,
                existingPlayer,
                overallrating,
                potential,
                skillmoves,
                weakfootabilitytypecode,
                playerStyles,
            }).then();
            const result = await PlayerModel.update(
                {
                    // basic info
                    player_name: playerName,
                    overallrating,
                    potential,
                    // personal info
                    birthdate,
                    nationality,
                    height,
                    weight,
                    age: playerAge,
                    // player details
                    preferredfoot,
                    preferredposition1,
                    preferredposition2,
                    preferredposition3,
                    preferredposition4,
                    skillmoves,
                    weakfootabilitytypecode,
                    // attackingworkrate,
                    // defensiveworkrate,
                    // pace
                    acceleration,
                    sprintspeed,
                    // attacking
                    positioning,
                    finishing,
                    shotpower,
                    longshots,
                    volleys,
                    penalties,
                    // passing
                    vision,
                    crossing,
                    freekickaccuracy,
                    shortpassing,
                    longpassing,
                    curve,
                    // dribbling
                    agility,
                    balance,
                    reactions,
                    ballcontrol,
                    dribbling,
                    composure,
                    // defending
                    interceptions,
                    headingaccuracy,
                    defensiveawareness,
                    standingtackle,
                    slidingtackle,
                    // physical
                    jumping,
                    stamina,
                    strength,
                    aggression,
                    // goalkeeping
                    gkdiving,
                    gkhandling,
                    gkkicking,
                    gkpositioning,
                    gkreflexes,
                    // meta info
                    is_archived: 0,
                },
                {
                    where: {
                        user_id: userId,
                        game_version: 25,
                        player_id: playerID,
                    },
                },
            );
        }

        /*
         * Update player_status_history
         */
        // date format: '1991-1-1' -> '1991-01-01'
        const dateStr = `${y}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`;
        // query by player_id and in_game_date
        const existingPSH = await PlayerStatusHistoryModel.findOne({
            where: {
                user_id: userId,
                game_version: 25,
                in_game_date: dateStr,
                player_id: playerID,
            },
        });
        if (!existingPSH) {
            await PlayerStatusHistoryModel.create({
                player_id: playerID,
                game_version: 25,
                in_game_date: dateStr,
                overallrating,
                potential,
                user_id: userId,
            });
        } else {
            logger.warn(
                `[bulkUpdatePlayer25][userId=${userId}] player_status_history already exists: playerID=${playerID}, date=${dateStr}`,
            );
            // update
            await PlayerStatusHistoryModel.update(
                { overallrating, potential },
                {
                    where: {
                        user_id: userId,
                        game_version: 25,
                        in_game_date: dateStr,
                        player_id: playerID,
                    },
                },
            );
        }
    }

    // archive players that are not in the new list
    if (existingPlayerSet.size > 0) {
        logger.info(
            `[bulkUpdatePlayer25][userID=${userId}] Archive players: ${Array.from(existingPlayerSet).join(',')}`,
        );
        const archivePlayerIDs = Array.from(existingPlayerSet);
        await PlayerModel.update(
            { is_archived: 1 },
            {
                where: {
                    user_id: userId,
                    game_version: 25,
                    player_id: archivePlayerIDs,
                },
            },
        );
    }
}

export async function bulkUpdatePlayer({
    userId,
    gameVersion,
    players,
}: {
    userId: number;
    gameVersion: number;
    players: any[];
}) {
    try {
        logger.info(
            `[bulkUpdatePlayer][userId=${userId}][gameVersion=${gameVersion}] players.length=${players.length}`,
        );
        if (!players || players.length === 0) {
            logger.warn(`[bulkUpdatePlayer][userId=${userId}] empty players`);
            return;
        }
        if (players.length > 200) {
            logger.error(`[bulkUpdatePlayer][userId=${userId}] too many players: ${players.length}`);
            return;
        }

        if (gameVersion !== 24 && gameVersion !== 25) {
            logger.error(`[bulkUpdatePlayer][userId=${userId}] unsupported game version: ${gameVersion}`);
            return;
        }

        switch (gameVersion) {
            case 24:
                await bulkUpdatePlayer24({ userId, players });
                break;
            case 25:
                await bulkUpdatePlayer25({ userId, players });
                break;
            default:
                logger.error(`[bulkUpdatePlayer][userId=${userId}] unsupported game version: ${gameVersion}`);
                break;
        }
    } catch (e) {
        logger.error(`[bulkUpdatePlayer][userID=${userId}] error: ${e}`);
    }
}
