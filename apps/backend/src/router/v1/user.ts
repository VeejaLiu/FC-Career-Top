import express from 'express';
import { Logger } from '../../lib/logger';
import { registerUserWithLock } from '../../general/user/register';
import { loginUser } from '../../general/user/login';
import { verifyTokenMiddleware } from '../../lib/token/verifyTokenMiddleware';
import { logoutUser } from '../../general/user/logout';
import { getSecretKey } from '../../general/user/get-secret-key';
import { refreshSecretKey } from '../../general/user/refresh-secret-key';
import { getUserSetting } from '../../general/user/get-user-setting';
import { updateUserSetting } from '../../general/user/update-user-setting';
import { getUserInfo } from '../../general/user/get-user-info';
import { body } from 'express-validator';
import { validateErrorCheck } from '../../lib/express-validator/express-validator-middleware';
import { changePassword } from '../../general/user/change-password';
import { sendEmailVerificationWithLock } from '../../general/user/send-email-verification';
import { changeUserEmail } from '../../general/user/change-user-email';

const router = express.Router();

const logger = new Logger(__filename);

/**
 * User registration
 * POST {{backend-url}}/api/v1/user/register
 */
router.post(
    '/register',
    body('email').isEmail().withMessage('Email must be a valid email'),
    validateErrorCheck,
    async (req: any, res: any) => {
        const { username, email, password, rc } = req.body;
        const result = await registerUserWithLock({
            username: username,
            email: email,
            password: password,
        });
        res.status(200).send(result);
    },
);

/**
 * User login
 * POST {{backend-url}}/api/v1/user/login
 */
router.post(
    '/login',
    body('username').isString().withMessage('Username must be a string'),
    body('password').isString().withMessage('Password must be a string'),
    validateErrorCheck,
    async (req: any, res: any) => {
        const { username, password } = req.body;
        const result = await loginUser({
            username: username,
            password: password,
        });
        res.status(200).send(result);
    },
);

/**
 * Get user's info
 * GET {{backend-url}}/api/v1/user/info
 */
router.get('/info', verifyTokenMiddleware, async (req: any, res: any) => {
    const { userId } = req.user;
    const result = await getUserInfo({
        userId: userId,
    });
    res.status(200).send(result);
});

/**
 * Verify user token
 * POST {{backend-url}}/api/v1/user/verify-token
 */
router.post('/verify-token', verifyTokenMiddleware, async (req: any, res: any) => {
    res.status(200).send({ success: true, message: 'Token is valid' });
});

/**
 * Change user password
 * POST {{backend-url}}/api/v1/user/password
 */
router.post(
    '/password',
    body('oldPassword').isString().withMessage('Old password must be a string'),
    body('newPassword').isString().withMessage('New password must be a string'),
    body('confirmNewPassword').isString().withMessage('Confirm new password must be a string'),
    validateErrorCheck,
    verifyTokenMiddleware,
    async (req: any, res: any) => {
        const { userId } = req.user;
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const result = await changePassword({
            userId: userId,
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword,
        });
        res.status(200).send(result);
    },
);

/**
 * User logout
 * POST {{backend-url}}/api/v1/user/logout
 */
router.post('/logout', verifyTokenMiddleware, async (req: any, res: any) => {
    const { userId } = req.user;
    const result = await logoutUser({
        userId: userId,
    });
    res.status(200).send(result);
});

/**
 * Get user's secret key
 * GET {{backend-url}}/api/v1/user/secret
 */
router.get('/secret', verifyTokenMiddleware, async (req: any, res: any) => {
    const { userId } = req.user;
    const result = await getSecretKey({
        userId: userId,
    });
    res.status(200).send(result);
});

/**
 * Refresh user's secret key
 * POST {{backend-url}}/api/v1/user/secret/refresh
 */
router.post('/secret/refresh', verifyTokenMiddleware, async (req: any, res: any) => {
    const { userId } = req.user;
    const result = await refreshSecretKey({
        userId: userId,
    });
    res.status(200).send(result);
});

/**
 * Get user setting
 * GET {{backend-url}}/api/v1/user/setting
 */
router.get('/setting', verifyTokenMiddleware, async (req: any, res: any) => {
    const { userId } = req.user;
    const result = await getUserSetting({
        userId: userId,
    });
    res.status(200).send(result);
});

/**
 * Update user setting
 * POST {{backend-url}}/api/v1/user/setting
 */
router.post('/setting', verifyTokenMiddleware, async (req: any, res: any) => {
    const { userId } = req.user;
    const { category, subItem, value } = req.body;
    const result = await updateUserSetting({
        userId: userId,
        category: category,
        subItem: subItem,
        value: value,
    });
    res.status(200).send(result);
});

/**
 * Verify user email
 * POST {{backend-url}}/api/v1/user/email/verify
 */
router.post('/email/verify', verifyTokenMiddleware, async (req: any, res: any) => {
    const { userId } = req.user;
    await sendEmailVerificationWithLock({ userId: userId });
    res.status(200).send({ success: true, message: 'Verification email sent' });
});

/**
 * Change the email
 * POST {{backend-url}}/api/v1/user/email/change
 */
router.post(
    '/email/change',
    body('newEmail').isEmail().withMessage('Email must be a valid email'),
    validateErrorCheck,
    verifyTokenMiddleware,
    async (req: any, res: any) => {
        const { userId } = req.user;
        const { newEmail } = req.body;
        const result = await changeUserEmail({
            userId: userId,
            newEmail: newEmail,
        });
        res.status(200).send(result);
    },
);

export default router;
