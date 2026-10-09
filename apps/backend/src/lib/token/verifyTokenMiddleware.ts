import jwt from 'jsonwebtoken';
import { env } from '../../env';
import { Logger } from '../logger';
import { UserModel } from '../../models/schema/UserDB';
import { createNewUserActivity } from '../../general/user-activity/create-new-user-activity';

const JWT_SECRET = env.secret.jwt;

const logger = new Logger(__filename);

export async function verifyToken(token: string): Promise<{ success: boolean; data?: { id: number } }> {
    try {
        const decodeRes: any = jwt.verify(token, JWT_SECRET);
        // logger.info(`[verifyToken] decodeRes: ${JSON.stringify(decodeRes)}`);
        const { id, iat, exp } = decodeRes;
        if (Date.now() > exp * 1000) {
            logger.error(`[verifyToken] token expired`);
            return { success: false };
        }
        // verify if the token matches database
        const user = await UserModel.getRawByID({ id });
        if (!user) {
            logger.error(`[verifyToken] user[${id}] not found`);
            return { success: false };
        }
        if (user.token !== token) {
            logger.error(`[verifyToken] token not match`);
            return { success: false };
        }
        return { success: true, data: { id } };
    } catch (e) {
        logger.error(`[verifyToken] ERROR: ${e}`);
        return { success: false };
    }
}

/**
 * Verify token
 *   - if token is valid, set req.user = { userId: id }
 *   - if token is invalid, set req.user = undefined and return 401
 * @param req
 * @param res
 * @param next
 */
export function verifyTokenMiddleware(req: any, res: any, next: any) {
    const token = req.headers.token;
    if (token) {
        jwt.verify(req.headers.token, JWT_SECRET, async function (err, decode) {
            if (err) {
                logger.error(`[verifyTokenMiddleware] verify error: ${err}`);
                req.user = undefined;
                return res.status(401).send({
                    success: false,
                    message: 'Token is not valid',
                });
            } else {
                const { id, iat, exp } = decode;

                if (Date.now() > exp * 1000) {
                    logger.error(`[verifyTokenMiddleware] token expired`);
                    req.user = undefined;
                    return res.status(401).send({
                        success: false,
                        message: 'Token expired',
                    });
                }

                // verify if the token matches database
                const user = await UserModel.getRawByID({ id });
                if (!user) {
                    logger.error(`[verifyTokenMiddleware] user[${id}] not found`);
                    req.user = undefined;
                    return res.status(401).send({
                        success: false,
                        message: 'Token is not valid',
                    });
                }

                if (user.token !== token) {
                    logger.error(`[verifyTokenMiddleware] token not match`);
                    req.user = undefined;
                    return res.status(401).send({
                        success: false,
                        message: 'Token expired',
                    });
                }

                // record user activity
                createNewUserActivity({ userID: id }).then();

                req.user = { userId: id };
                next();
            }
        });
    } else {
        req.user = undefined;
        res.status(401).send({
            success: false,
            message: 'Missing token',
        });
    }
}
