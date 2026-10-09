import express from 'express';
import { query } from 'express-validator';
import { validateErrorCheck } from '../../lib/express-validator/express-validator-middleware';
import { getDailyNewUsersCount } from '../../general/public/get-daily-new-users-count';
import { getAllUsersCount } from '../../general/public/get-all-users-count';
import { verifyEmailVerification } from '../../general/user/verify-email-verification';

const router = express.Router();

/**
 * Get daily new users count
 */
router.get(
    '/daily-new-users-count',
    query('pastDays').isInt({ min: 1, max: 90 }).withMessage('Past days must be between 1 and 90'),
    validateErrorCheck,
    async (req: any, res: any) => {
        const { pastDays } = req.query;
        const result = await getDailyNewUsersCount({
            pastDays: parseInt(pastDays),
        });
        return res.json(result);
    },
);

/**
 * Get all registered user count
 */
router.get('/users-count', async (req: any, res: any) => {
    const result: number = await getAllUsersCount();
    return res.json({ count: result });
});

/**
 * Verify user email
 */
router.get(
    '/verify-email',
    query('token').isString().notEmpty().withMessage('Token is required'),
    validateErrorCheck,
    async (req: any, res: any) => {
        const { token } = req.query;

        const verificationResult = await verifyEmailVerification({ token });

        if (verificationResult.success) {
            res.setHeader('Content-Type', 'text/html');
            return res.send(verificationResult.html);
        }
        res.status(400);
        res.setHeader('Content-Type', 'text/html');
        return res.send(verificationResult.html);
    },
);

export default router;
