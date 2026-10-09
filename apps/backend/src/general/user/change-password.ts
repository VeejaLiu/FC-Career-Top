import { Logger } from '../../lib/logger';
import { UserModel } from '../../models/schema/UserDB';
import bcrypt from 'bcryptjs';

const logger = new Logger(__filename);

const PASSWORD_MISMATCH = {
    success: false,
    message: 'New password not matched',
    code: 'PASSWORD_UPDATE_MISMATCH',
};

const OLD_PASSWORD_INCORRECT = {
    success: false,
    message: 'Old password not matched',
    code: 'PASSWORD_UPDATE_INCORRECT_OLD',
};

const PASSWORD_SAME_AS_OLD = {
    success: false,
    message: 'New password is same as old password',
    code: 'PASSWORD_UPDATE_SAME_AS_OLD',
};

const PASSWORD_UPDATED = {
    success: true,
    message: 'Password updated',
    code: 'PASSWORD_UPDATE_SUCCESS',
};

const PASSWORD_UPDATE_ERROR = {
    success: false,
    message: 'An error occurred while updating the password',
    code: 'PASSWORD_UPDATE_SYSTEM_ERROR',
};

const USER_NOT_FOUND = {
    success: false,
    message: 'User not found',
    code: 'PASSWORD_UPDATE_USER_NOT_FOUND',
};

export async function changePassword({
    userId,
    oldPassword,
    newPassword,
    confirmNewPassword,
}: {
    userId: number;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}): Promise<{
    success: boolean;
    message: string;
    code?: string;
}> {
    logger.info(`Attempting to change password for user ID: ${userId}`);

    try {
        if (newPassword !== confirmNewPassword) {
            logger.info(
                `Password change attempt for user ID: ${userId} - New passwords don't match - Code: ${PASSWORD_MISMATCH.code}`,
            );
            return PASSWORD_MISMATCH;
        }

        const user = await UserModel.findOne({ where: { id: userId } });

        if (!user) {
            logger.warn(`User not found for ID: ${userId} - Code: ${USER_NOT_FOUND.code}`);
            return USER_NOT_FOUND;
        }

        // Check if old password matches
        const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatched) {
            logger.info(
                `Password change attempt for user ID: ${userId} - Old password incorrect - Code: ${OLD_PASSWORD_INCORRECT.code}`,
            );
            return OLD_PASSWORD_INCORRECT;
        }

        // Check if new password is same as old password
        const isNewPasswordSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isNewPasswordSameAsOld) {
            logger.info(
                `Password change attempt for user ID: ${userId} - New password is same as old password - Code: ${PASSWORD_MISMATCH.code}`,
            );
            return PASSWORD_SAME_AS_OLD;
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.update({ password: hashedPassword }, { where: { id: userId } });

        logger.info(`Password successfully updated for user ID: ${userId} - Code: ${PASSWORD_UPDATED.code}`);
        return PASSWORD_UPDATED;
    } catch (error) {
        logger.error(
            `Error updating password for user ID: ${userId} - ${error.message} - Code: ${PASSWORD_UPDATE_ERROR.code}`,
            error,
        );
        return PASSWORD_UPDATE_ERROR;
    }
}
