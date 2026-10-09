import { UserSecretKeyModel } from '../../models/schema/UserSecretKeyDB';
import { Logger } from '../logger';

const logger = new Logger(__filename);

/**
 * Verify secret key
 *
 * @param req
 * @param res
 * @param next
 */
export async function verifySecretKey(req: any, res: any, next: any) {
    const secretKey = req.headers['secret-key'];
    if (!secretKey || secretKey.length === 0) {
        logger.error('[verifySecretKey] Missing secret key');
        return res.status(401).json({ message: 'Missing secret key' });
    }

    // query from the database
    const qRes: UserSecretKeyModel = await UserSecretKeyModel.findOne({
        where: { secret_key: secretKey },
        raw: true,
    });

    if (!qRes) {
        logger.info('[verifySecretKey] wrong secret key');
        return res.status(401).json({ message: 'Missing secret key' });
    }

    const userId = qRes.user_id;
    req.user = { userId };

    logger.info('[verifySecretKey] secret key verified, userId:', userId);

    next();
}
