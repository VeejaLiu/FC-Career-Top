import express from 'express';
import { bulkUpdatePlayer } from '../../general/player/bulk-update-player';
import { getAllPlayers } from '../../general/player/get-all-players';
import { getPlayerCount } from '../../general/player/get-player-count';
import { getAllPlayerTrends } from '../../general/player/get-all-player-trends';
import { verifyTokenMiddleware } from '../../lib/token/verifyTokenMiddleware';
import { verifySecretKey } from '../../lib/token/verifySecretKey';
import { getPlayerDetail } from '../../general/player/get-player-detail';
import { param, query } from 'express-validator';
import { validateErrorCheck } from '../../lib/express-validator/express-validator-middleware';

const router = express.Router();

/**
 * Get all players
 * GET /api/v1/player/
 */
router.get(
    '/',
    verifyTokenMiddleware,
    query('gameVersion')
        .isInt({ min: 24, max: 25 }) // only 24/25
        .withMessage('Game version must be 24 or 25'),
    validateErrorCheck,
    async (req: any, res) => {
        const { userId } = req.user;
        const { gameVersion } = req.query;
        const result = await getAllPlayers({
            userId: userId,
            gameVersion: parseInt(gameVersion),
        });
        res.send(result);
    },
);

/**
 * Get player details by id
 * GET /api/v1/player/detail/:playerID
 */
router.get(
    '/detail/:playerID',
    verifyTokenMiddleware,
    query('gameVersion')
        .isInt({ min: 24, max: 25 }) // only 24/25
        .withMessage('Game version must be 24 or 25'),
    param('playerID').isInt().withMessage('Player ID must be an integer'),
    validateErrorCheck,
    async (req: any, res) => {
        const { userId } = req.user;
        const { playerID } = req.params;
        const { gameVersion } = req.query;
        const result = await getPlayerDetail({
            userId,
            gameVersion: parseInt(gameVersion),
            playerID: parseInt(playerID),
        });
        res.send(result);
    },
);

/**
 * Get player count
 * GET /api/v1/player/count
 */
router.get(
    '/count',
    verifyTokenMiddleware,
    query('gameVersion')
        .isInt({ min: 24, max: 25 }) // only 24/25
        .withMessage('Game version must be 24 or 25'),
    validateErrorCheck,
    async (req: any, res) => {
        const { userId } = req.user;
        const { gameVersion } = req.query;
        const count = await getPlayerCount({
            userId: userId,
            gameVersion: parseInt(gameVersion),
        });
        res.send(count);
    },
);

/**
 * Get player trends
 * GET /api/v1/player/trends
 */
router.get(
    '/trends',
    verifyTokenMiddleware,
    query('gameVersion')
        .isInt({ min: 24, max: 25 }) // only 24/25
        .withMessage('Game version must be 24 or 25'),
    validateErrorCheck,
    async (req: any, res) => {
        const { userId } = req.user;
        const { gameVersion } = req.query;
        const result = await getAllPlayerTrends({
            userId: userId,
            gameVersion: parseInt(gameVersion),
        });
        res.send(result);
    },
);

/**
 * Create or update players in bulk
 * POST /api/v1/player/bulk
 */
router.post(
    '/bulk',
    verifySecretKey,
    query('gameVersion')
        .isInt({ min: 24, max: 25 }) // only 24/25
        .withMessage('Game version must be 24 or 25'),
    validateErrorCheck,
    async (req: any, res) => {
        res.send({ message: 'Got the message' });
        const { userId } = req.user;
        const { gameVersion } = req.query;
        await bulkUpdatePlayer({
            userId: userId,
            gameVersion: parseInt(gameVersion),
            players: req.body,
        });
    },
);

export default router;
