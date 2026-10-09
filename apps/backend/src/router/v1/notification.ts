import express from 'express';
import { verifyTokenMiddleware } from '../../lib/token/verifyTokenMiddleware';
import { body, query } from 'express-validator';
import { validateErrorCheck } from '../../lib/express-validator/express-validator-middleware';
import { getUserNotifications } from '../../general/notification/get-user-notifications';
import { markNotificationAsRead } from '../../general/notification/mark-notification-as-read';
import { markAllNotificationAsRead } from '../../general/notification/mark-all-notification-as-read';
import { getUnreadNotificationsCount } from '../../general/notification/get-unread-notifications-count';

const router = express.Router();

/**
 * Get unread notifications count
 */
router.get(
    '/unread-count',
    verifyTokenMiddleware,
    query('gameVersion')
        .isInt({ min: 24, max: 25 }) // only 24/25
        .withMessage('Game version must be 24 or 25'),
    validateErrorCheck,
    async (req: any, res) => {
        const { userId } = req.user;
        const { gameVersion } = req.query;
        const result = await getUnreadNotificationsCount({
            userId: userId,
            gameVersion: parseInt(gameVersion),
        });
        res.send({ count: result });
    },
);

/**
 * Get all notifications
 */
router.get(
    '/',
    verifyTokenMiddleware,
    query('gameVersion')
        .isInt({ min: 24, max: 25 }) // only 24/25
        .withMessage('Game version must be 24 or 25'),
    query('page').isInt({ min: 1 }).withMessage('page must be an integer'),
    query('limit').isInt({ min: 1 }).withMessage('limit must be an integer'),
    query('filter').optional().isString().withMessage('filter must be a string'),
    query('onlyUnread').isBoolean().withMessage('onlyUnread must be a boolean'),
    validateErrorCheck,
    async (req: any, res) => {
        const { userId } = req.user;
        const { gameVersion, page, limit, filter, onlyUnread } = req.query;
        const result = await getUserNotifications({
            userId: userId,
            gameVersion: parseInt(gameVersion),
            page: parseInt(page),
            limit: parseInt(limit),
            filter: filter,
            onlyUnread: onlyUnread === 'true',
        });
        res.send(result);
    },
);

/**
 * Mark notification as read
 */
router.post(
    '/mark-read',
    verifyTokenMiddleware,
    body('gameVersion').isInt({ min: 24, max: 25 }).withMessage('Game version must be 24 or 25'),
    body('id').isInt().withMessage('Notification ID must be an integer'),
    validateErrorCheck,
    async (req: any, res) => {
        const { userId } = req.user;
        const { id, gameVersion } = req.body;
        const result = await markNotificationAsRead({
            userId: userId,
            gameVersion: parseInt(gameVersion),
            id: id,
        });
        res.send(result);
    },
);

/**
 * Mark all notifications as read
 */
router.post(
    '/mark-all-read',
    verifyTokenMiddleware,
    body('gameVersion').isInt({ min: 24, max: 25 }).withMessage('Game version must be 24 or 25'),
    validateErrorCheck,
    async (req: any, res) => {
        const { userId } = req.user;
        const { gameVersion } = req.body;
        const result = await markAllNotificationAsRead({
            userId: userId,
            gameVersion: parseInt(gameVersion),
        });
        res.send(result);
    },
);
export default router;
