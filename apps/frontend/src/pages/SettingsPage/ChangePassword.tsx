import { Input, Notification } from '@douyinfe/semi-ui';
import * as React from 'react';
import { UserApis } from '../../service/UserApis.ts';

export interface ApiSecretKeyComponentProps {
  localeData: any;
}

function ChangePasswordComponent({
  localeData,
}: ApiSecretKeyComponentProps): React.ReactElement {
  const [oldPassword, setOldPassword] = React.useState<string>('');
  const [newPassword, setNewPassword] = React.useState<string>('');
  const [confirmNewPassword, setCofirmNewPassword] = React.useState<string>('');

  const changePassword = async (localeData: any) => {
    console.log(`Old Password: ${oldPassword}`);
    console.log(`New Password: ${newPassword}`);
    console.log(`Confirm New Password: ${confirmNewPassword}`);

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Notification.error({
        title: localeData.ChangePasswordNotification.ErrorTitle,
        content: localeData.ChangePasswordNotification.INVALID_PASSWORD,
        duration: 3,
        position: 'top',
      });

      return;
    }
    if (newPassword !== confirmNewPassword) {
      // Show error message
      Notification.error({
        title: localeData.ChangePasswordNotification.ErrorTitle,
        content: localeData.ChangePasswordNotification.PASSWORD_MISMATCH,
        duration: 3,
        position: 'top',
      });
      return;
    }

    // Call API to change password
    const res = await UserApis.changePassword({
      oldPassword,
      newPassword,
      confirmNewPassword,
    });
    console.log(`[changePassword] res: ${JSON.stringify(res)}`);
    if (res.success) {
      Notification.success({
        title: localeData.ChangePasswordNotification.SUCCESS,
        content: localeData.ChangePasswordNotification.SUCCESS_MESSAGE,
        duration: 3,
        position: 'top',
      });
    } else {
      switch (res?.code) {
        case 'PASSWORD_UPDATE_MISMATCH':
          Notification.warning({
            title: localeData.ChangePasswordNotification.ErrorTitle,
            content: localeData.ChangePasswordNotification.PASSWORD_MISMATCH,
            duration: 3,
            position: 'top',
          });
          break;
        case 'PASSWORD_UPDATE_INCORRECT_OLD':
          Notification.warning({
            title: localeData.ChangePasswordNotification.ErrorTitle,
            content:
              localeData.ChangePasswordNotification.INCORRECT_OLD_PASSWORD,
            duration: 3,
            position: 'top',
          });
          break;
        case 'PASSWORD_UPDATE_SAME_AS_OLD':
          Notification.warning({
            title: localeData.ChangePasswordNotification.ErrorTitle,
            content: localeData.ChangePasswordNotification.PASSWORD_SAME_AS_OLD,
            duration: 3,
            position: 'top',
          });
          break;
        case 'PASSWORD_UPDATE_USER_NOT_FOUND':
          Notification.error({
            title: localeData.ChangePasswordNotification.ErrorTitle,
            content: localeData.ChangePasswordNotification.USER_NOT_FOUND,
            duration: 3,
            position: 'top',
          });
          break;
        case 'PASSWORD_UPDATE_SYSTEM_ERROR':
        default:
          Notification.error({
            title: localeData.ChangePasswordNotification.UnknownErrorTitle,
            content:
              localeData.ChangePasswordNotification.UnknownErrorDescription,
            duration: 3,
            position: 'top',
          });
          break;
      }
    }
  };

  return (
    <div className="mt-2 p-4 border border-gray-900 rounded-md">
      <div
        style={{
          display: 'flex',
          marginTop: '8px',
          alignItems: 'center',
        }}
      >
        <span style={{ width: '300px', fontWeight: 'bold' }}>
          {localeData.OldPassword}
        </span>
        <Input
          mode="password"
          autoComplete={'current-password'}
          onChange={(e: string) => setOldPassword(e)}
        />
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: '8px',
          alignItems: 'center',
        }}
      >
        <span className="font-bold w-[300px]">{localeData.NewPassword}</span>
        <Input
          mode="password"
          autoComplete={'new-password'}
          onChange={(e: string) => setNewPassword(e)}
        />
      </div>
      <div className="flex items-center mt-2">
        <span className="font-bold w-[300px]">
          {localeData.ConfirmNewPassword}
        </span>
        <Input
          mode="password"
          autoComplete={'new-password'}
          onChange={(e: string) => setCofirmNewPassword(e)}
        />
      </div>
      <div className="flex justify-end">
        <button
          className="flex whitespace-nowrap border border-[#d1d9e0] mt-4 rounded-md px-8 py-1 bg-[#f6f8fa] hover:bg-[#f0f2f5]"
          onClick={() => changePassword(localeData)}
        >
          {localeData.ChangePassword}
        </button>
      </div>
    </div>
  );
}

export default ChangePasswordComponent;
