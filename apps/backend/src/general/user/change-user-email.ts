import { Logger } from '../../lib/logger';
import { UserModel } from '../../models/schema/UserDB';

const logger = new Logger(__filename);

const USER_NOT_FOUND = {
    success: false,
    message: 'User not found',
    code: 'EMAIL_UPDATE_USER_NOT_FOUND',
};

const EMAIL_SAME_AS_OLD = {
    success: false,
    message: 'New email is the same as the old one',
    code: 'EMAIL_UPDATE_REDUNDANT_VALUE',
};

const EMAIL_DUPLICATE = {
    success: false,
    message: 'New email is already in use',
    code: 'EMAIL_UPDATE_DUPLICATE',
};

const EMAIL_UPDATED = {
    success: true,
    message: 'Email updated',
    code: 'EMAIL_UPDATE_SUCCESS',
};

const EMAIL_UPDATE_ERROR = {
    success: false,
    message: 'An error occurred while updating the email',
    code: 'EMAIL_UPDATE_SYSTEM_ERROR',
};

export async function changeUserEmail({ userId, newEmail }: { userId: number; newEmail: string }): Promise<{
    success: boolean;
    message: string;
    code?: string; // Updated return type to include code
}> {
    logger.info(`Attempting to change email for user ID: ${userId} to: ${newEmail}`);

    try {
        const user = await UserModel.findOne({ where: { id: userId } });
        if (!user) {
            logger.warn(`User not found for ID: ${userId} - Code: ${USER_NOT_FOUND.code}`);

            return USER_NOT_FOUND;
        }

        // Check if the new email is the same as the old one
        if (user.email === newEmail) {
            logger.info(
                `Email change attempt for user ID: ${userId} - New email is the same as the current email - Code: ${EMAIL_SAME_AS_OLD.code}`,
            );
            return EMAIL_SAME_AS_OLD;
        }

        // Check if the new email is duplicate
        const duplicateUser = await UserModel.findOne({ where: { email: newEmail } });
        if (duplicateUser) {
            logger.info(
                `Email change attempt for user ID: ${userId} - New email is already in use - Code: ${EMAIL_SAME_AS_OLD.code}`,
            );
            return EMAIL_DUPLICATE;
        }

        logger.info(`Updating email for user ID: ${userId} from: ${user.email} to: ${newEmail}`);
        await user.update({
            email: newEmail,
            is_email_verified: false,
        });

        logger.info(`Email successfully updated for user ID: ${userId} - Code: ${EMAIL_UPDATED.code}`);
        return EMAIL_UPDATED;
    } catch (error) {
        logger.error(
            `Error updating email for user ID: ${userId} - ${error.message} - Code: ${EMAIL_UPDATE_ERROR.code}`,
            error,
        );
        return EMAIL_UPDATE_ERROR;
    }
}
