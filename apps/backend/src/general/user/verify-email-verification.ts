// 验证邮箱链接
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/schema/UserDB';
import { env } from '../../env';
import { VerificationPayload } from './send-email-verification';
import { Logger } from '../../lib/logger';

const logger = new Logger(__filename);

const EmailVerificationSuccessHTML = `
<html>
    <head>
        <title>Email Verification Success</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: green; }
        </style>
    </head>
    <body>
        <h1>Email Verification Successful</h1>
        <h1>邮箱验证成功</h1>
        <p>Your email has been successfully verified.</p>
        <p>您的邮箱已成功验证。</p>
    </body>
</html>
`;

const EmailVerificationFailedHTML = `
<html>
    <head>
        <title>Email Verification Failed</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .message { margin: 30px 0; }
            .error { color: #d32f2f; }
        </style>
    </head>
    <body>
        <h1>Email Verification Failed</h1>
        <h1>邮箱验证失败</h1>
        <div class="message error">
            <p>Sorry, we couldn't verify your email.</p>
            <p>抱歉，我们无法验证您的邮箱。</p>
        </div>
        <div class="message">
            <p>{{errorMessage}}</p>
        </div>
    </body>  
</html>
`;

export async function verifyEmailVerification({ token }: { token: string }): Promise<{
    success: boolean;
    code?: string;
    html?: string;
    userId?: number;
    error?: string;
}> {
    logger.info(`Verifying email verification token, token.length=${token.length}`);

    try {
        // 验证并解码 JWT token
        const decoded = jwt.verify(token, env.secret.jwt) as VerificationPayload;
        logger.debug('Token decoded successfully', { userId: decoded.userId });

        // 验证 token 类型
        if (decoded.type !== 'email_verification') {
            logger.warn(`Invalid token type received, expected "email_verification" but got "${decoded.type}"`);
            return {
                success: false,
                code: 'INVALID_TOKEN_TYPE',
                html: EmailVerificationFailedHTML.replace('{{errorMessage}}', 'Invalid token. 无效的令牌。'),
                error: 'Invalid token type',
            };
        }

        // 验证 nonce（可选）
        // const isValidNonce = await validateNonce(decoded.nonce, decoded.userId);
        // if (!isValidNonce) {
        //     return {
        //         success: false,
        //         error: 'Token has already been used',
        //     };
        // }

        // 验证用户信息
        const user = await UserModel.getRawByID({ id: decoded.userId });
        if (!user) {
            logger.warn('User not found during email verification');
            return {
                success: false,
                code: 'USER_NOT_FOUND',
                html: EmailVerificationFailedHTML.replace(
                    '{{errorMessage}}',
                    'Invalid verification link. 无效的验证链接。',
                ),
                error: 'User not found',
            };
        }

        // 验证用户是否已验证邮箱
        if (user.is_email_verified) {
            logger.info('This user has already verified their email');
            return {
                success: false,
                code: 'EMAIL_ALREADY_VERIFIED',
                html: EmailVerificationFailedHTML.replace(
                    '{{errorMessage}}',
                    'Email already verified for this account. 该账户的邮箱已验证。',
                ),
                error: 'Email already verified',
            };
        }

        // 验证邮箱是否匹配
        if (user.email !== decoded.email) {
            logger.warn('Email mismatch during verification');
            return {
                success: false,
                code: 'EMAIL_MISMATCH',
                html: EmailVerificationFailedHTML.replace(
                    '{{errorMessage}}',
                    'Invalid verification link. 无效的验证链接。',
                ),
                error: 'Email mismatch',
            };
        }

        // // 可选：删除已使用的 nonce
        // await removeNonce(decoded.nonce, decoded.userId);

        // 更新用户邮箱验证状态
        logger.info('Updating user email verification status');
        await UserModel.update({ is_email_verified: true }, { where: { id: decoded.userId } });

        // 返回验证成功结果
        logger.info('Email verification successful');
        return {
            success: true,
            html: EmailVerificationSuccessHTML,
            userId: decoded.userId,
        };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.warn('Email verification token expired');
            return {
                success: false,
                code: 'TOKEN_EXPIRED',
                html: EmailVerificationFailedHTML.replace(
                    '{{errorMessage}}',
                    'This verification link has expired. 该验证链接已过期。',
                ),
                error: 'Token has expired',
            };
        }

        if (error instanceof jwt.JsonWebTokenError) {
            logger.warn('Invalid JWT token');
            return {
                success: false,
                code: 'INVALID_TOKEN',
                html: EmailVerificationFailedHTML.replace(
                    '{{errorMessage}}',
                    'Invalid verification link. 无效的验证链接。',
                ),
                error: 'Invalid token',
            };
        }

        logger.error(
            `Unexpected error during email verification ${JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            })}`,
        );

        return {
            success: false,
            code: 'VERIFICATION_ERROR',
            html: EmailVerificationFailedHTML.replace(
                '{{errorMessage}}',
                'An unexpected error occurred. Please try again later. If the problem persists, please contact us. 发生了一个意外错误。请稍后再试。如果问题仍然存在，请联系我们。',
            ),
            error: 'Invalid token',
        };
    }
}
