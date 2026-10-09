import { env } from '../../env';

var jwt = require('jsonwebtoken');

export function signToken(userId: string | number): string {
    return jwt.sign(
        {
            id: userId,
        },
        env.secret.jwt,
        {
            expiresIn: 7 * 24 * 60 * 60, // expires in 7 days
        },
    );
}
