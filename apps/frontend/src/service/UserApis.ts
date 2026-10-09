import axios from 'axios';
import { BACKEND_URL } from '../constant';
import { Notification } from '@douyinfe/semi-ui';
import { getToken, removeToken } from '../common/common.ts';

export class UserApis {
  /**
   * Register user
   */
  static async registerUser({
    email,
    password,
    confirmPassword,
  }: {
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/register`, {
        email,
        password,
        confirmPassword,
      });

      if (response.status !== 200) {
        return {
          success: false,
          message: 'Something went wrong, please try again',
        };
      }
      return response.data;
    } catch (e: any) {
      if (e?.response?.data?.message)
        return { success: false, message: e.response.data.message };
      const errorStatus = e?.response?.status;
      // 400
      // {
      // 	"errors": [
      // 		{
      // 			"type": "field",
      // 			"value": "221231231232",
      // 			"msg": "Email must be a valid email",
      // 			"path": "email",
      // 			"location": "body"
      // 		}
      // 	]
      // }
      console.error('e.response.status: ', errorStatus);

      if (errorStatus === 400) {
        const { errors } = e?.response?.data || {};
        if (errors && errors.length > 0) {
          const errorMessages: string[] = errors.map((error: any) => error.msg);
          return {
            success: false,
            message: errorMessages.join(', '),
          };
        }
      }

      return {
        success: false,
        message: 'Something went wrong, please try again',
      };
    }
  }

  /**
   * Login user
   */
  static async loginUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/login`, {
        email,
        password,
      });
      return response.data;
    } catch (e: any) {
      return {
        success: false,
        message: 'Something went wrong, please try again',
      };
    }
  }

  /**
   * verify user token
   */
  static async verifyToken(): Promise<boolean> {
    try {
      const token = getToken();

      if (!token) {
        return false;
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/verify-token`,
        {},
        { headers: { token } },
      );
      if (response?.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (e: any) {
      if (e.message === 'Network Error') {
        Notification.error({
          title: 'Network Error',
          content: 'Please check your network connection',
          duration: 10,
        });
      }
      return false;
    }
  }

  static async doLogout(): Promise<boolean> {
    try {
      const token = getToken();
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/logout`,
        {},
        {
          headers: {
            Accept: '*/*',
            token: token,
          },
        },
      );
      if (response.status !== 200) {
        return false;
      }
      if (!response.data.success) {
        return false;
      }

      removeToken();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get user secret key
   */
  static async getSecretKey(): Promise<string> {
    try {
      const token = getToken();
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/secret`, {
        headers: {
          Accept: '*/*',
          token: token,
        },
      });

      if (response.status !== 200) {
        return '';
      }
      if (!response.data.success) {
        return '';
      }
      return response.data.data.secretKey;
    } catch (e) {
      return '';
    }
  }

  static async doRefreshSecretKey(): Promise<string> {
    try {
      const token = getToken();
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/secret/refresh`,
        {},
        {
          headers: {
            Accept: '*/*',
            token: token,
          },
        },
      );
      if (response.status !== 200) {
        return '';
      }
      if (!response.data.success) {
        return '';
      }
      return response.data.data.secretKey;
    } catch (e) {
      return '';
    }
  }

  /**
   * Get user setting
   */
  static async getUserSetting(): Promise<{
    userId?: number | string;
    defaultGameVersion?: number;
    enableNotification?: boolean;
    notificationItems?: {
      PlayerUpdate_Overall: boolean;
      PlayerUpdate_SkillMove: boolean;
      PlayerUpdate_WeakFoot: boolean;
    };
  } | null> {
    try {
      const token = getToken();
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/setting`, {
        headers: {
          Accept: '*/*',
          token: token,
        },
      });

      if (response.status !== 200) {
        return null;
      }
      if (!response.data.success) {
        return null;
      }
      return response.data.data;
    } catch (e) {
      return null;
    }
  }

  static async updateUserSetting({
    category,
    subItem,
    value,
  }: {
    category: string;
    subItem?: string;
    value: boolean | number;
  }) {
    try {
      const token = getToken();

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/setting`,
        {
          category,
          subItem,
          value,
        },
        {
          headers: {
            Accept: '*/*',
            token: token,
          },
        },
      );
      return response.data;
    } catch (e) {
      return {
        success: false,
        message: 'Failed to update user setting',
      };
    }
  }

  static async getUserInfo(): Promise<{
    userID: string;
    username: string;
    email: string;
    isEmailVerified: boolean;
    lastSendEmailTime: number;
  } | null> {
    try {
      const token = getToken();
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/info`, {
        headers: {
          Accept: '*/*',
          token: token,
        },
      });

      if (response.status !== 200) {
        return null;
      }
      if (!response.data.success) {
        return null;
      }
      return response.data.data;
    } catch (e) {
      return null;
    }
  }

  static async sendVerificationEmail() {
    try {
      const token = getToken();
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/email/verify`,
        {},
        {
          headers: {
            Accept: '*/*',
            token: token,
          },
        },
      );
      return response.data;
    } catch (e) {
      return {
        success: false,
        message: 'Failed to send verification email',
      };
    }
  }

  static async changePassword({
    oldPassword,
    newPassword,
    confirmNewPassword,
  }: {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    try {
      const token = getToken();
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/password`,
        {
          oldPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          headers: {
            Accept: '*/*',
            token: token,
          },
        },
      );
      return response.data;
    } catch (e) {
      return {
        success: false,
        message: 'Failed to change password',
      };
    }
  }

  /**
   * Change email
   *
   * @param newEmail new email
   */
  static async changeEmail({ newEmail }: { newEmail: string }) {
    try {
      const token = getToken();
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/email/change`,
        { newEmail: newEmail },
        {
          headers: {
            Accept: '*/*',
            token: token,
          },
        },
      );
      return response.data;
    } catch (e) {
      return {
        success: false,
        message: 'Failed to change email',
      };
    }
  }
}
