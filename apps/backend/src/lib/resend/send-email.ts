import { Resend } from 'resend';
import { env } from '../../env';
import { Logger } from '../logger';

const logger = new Logger(__filename);

const resend = new Resend(env.resend.API_KEY);

export async function sendVerificationCodeEmail({
    email,
    verificationCode,
}: {
    email: string;
    verificationCode: string;
}) {
    await resend.emails.send({
        from: 'No Reply <no-reply@fccareer.top>',
        to: [email],
        subject: 'Your Verification Code for [FCCareer.Top]',
        html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased; background-color: #f4f4f5;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f5;">
          <tr>
            <td style="padding: 20px 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 40px 30px;">
                    <!-- Header -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="text-align: center; padding-bottom: 30px;">
                          <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #18181b;">Verification Code</h1>
                        </td>
                      </tr>
                    </table>

                    <!-- Content -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding: 0 0 20px;">
                          <p style="margin: 0; font-size: 16px; line-height: 24px; color: #3f3f46;">Hello,</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 20px;">
                          <p style="margin: 0; font-size: 16px; line-height: 24px; color: #3f3f46;">Your verification code is:</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 20px;">
                          <div style="background-color: #f4f4f5; border-radius: 4px; padding: 16px; text-align: center;">
                            <span style="font-family: monospace; font-size: 32px; font-weight: bold; color: #18181b; letter-spacing: 4px;">${verificationCode}</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 20px;">
                          <p style="margin: 0; font-size: 16px; line-height: 24px; color: #3f3f46;">This code will expire in 10 minutes. If you didn't request this code, please ignore this email.</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Footer -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-top: 30px; border-top: 1px solid #e4e4e7;">
                          <p style="margin: 0; font-size: 14px; line-height: 20px; color: #71717a; text-align: center;">
                            This is an automated message, please do not reply to this email.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    });
}

export async function sendVerificationLinkEmail({
    email,
    username,
    verificationLink,
}: {
    email: string;
    username: string;
    verificationLink: string;
}) {
    try {
        const sendRes = await resend.emails.send({
            from: 'No Reply <no-reply@fccareer.top>',
            to: [email],
            subject: 'Verify Your Email Address [FCCareer.Top]',
            html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased; background-color: #f4f4f5;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f5;">
              <tr>
                <td style="padding: 20px 0;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
                    <tr>
                      <td style="padding: 40px 30px;">
                        <!-- Header -->
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="text-align: center; padding-bottom: 30px;">
                              <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #18181b;">Verify Your Email Address</h1>
                            </td>
                          </tr>
                        </table>
    
                        <!-- Content -->
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding: 0 0 20px;">
                              <p style="margin: 0; font-size: 16px; line-height: 24px; color: #3f3f46;">Hello, ${username}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 0 0 20px;">
                              <p style="margin: 0; font-size: 16px; line-height: 24px; color: #3f3f46;">Thank you for signing up for FCT. To complete your registration, please verify your email address by clicking the button below:</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 20px 0;">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                  <td align="center">
                                    <a href="${verificationLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; text-align: center; font-size: 16px;">Verify Email Address</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 20px 0;">
                              <p style="margin: 0; font-size: 14px; line-height: 20px; color: #71717a;">If the button doesn't work, you can also copy and paste this link into your browser:</p>
                              <p style="margin: 10px 0 0; font-size: 14px; line-height: 20px; color: #2563eb; word-break: break-all;">
                                ${verificationLink}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 20px 0;">
                              <p style="margin: 0; font-size: 16px; line-height: 24px; color: #3f3f46;">This verification link will expire in 24 hours for security reasons. If you didn't create an account with FC Career Top, you can safely ignore this email.</p>
                            </td>
                          </tr>
                        </table>
    
                        <!-- Footer -->
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding-top: 30px; border-top: 1px solid #e4e4e7;">
                              <p style="margin: 0 0 10px; font-size: 14px; line-height: 20px; color: #71717a; text-align: center;">
                                If you have any questions, please don't hesitate to contact our support team.
                              </p>
                              <p style="margin: 0; font-size: 14px; line-height: 20px; color: #71717a; text-align: center;">
                                © 2025 FC Career Top. All rights reserved.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
        });
        logger.info(`[sendVerificationLinkEmail] Email sent to ${email}, response: ${JSON.stringify(sendRes)}`);
    } catch (e) {
        logger.error(`[sendVerificationLinkEmail] Error: ${e.message}`);
    }
}
