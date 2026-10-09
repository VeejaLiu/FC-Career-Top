import { Banner, Input, Notification } from '@douyinfe/semi-ui';
import * as React from 'react';
import { UserApis } from '../../service/UserApis.ts';

function ChangeEmailComponent({
  localeData,
  changeEmailDone,
}: {
  localeData: any;
  changeEmailDone?: any;
}): React.ReactElement {
  const [newEmail, setNewEmail] = React.useState<string>('');

  const changeEmail = async (localeData: any) => {
    console.log(`New Email: ${newEmail}`);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail || newEmail === '' || !emailPattern.test(newEmail)) {
      Notification.warning({
        title: localeData.ChangeEmailNotification.ErrorTitle,
        content: <div>{localeData.ChangeEmailNotification.INVALID_EMAIL}</div>,
        duration: 3,
        position: 'top',
      });
      return;
    }

    // Call API to change password
    const res = await UserApis.changeEmail({ newEmail: newEmail });
    console.log(`[changeEmail] res: ${JSON.stringify(res)}`);
    if (res.success) {
      Notification.success({
        title: localeData.ChangeEmailNotification.SUCCESS,
        content: localeData.ChangeEmailNotification.SUCCESS_MESSAGE,
        duration: 3,
        position: 'top',
      });
      changeEmailDone();
    } else {
      switch (res?.code) {
        case 'EMAIL_UPDATE_DUPLICATE':
          Notification.error({
            title: localeData.ChangeEmailNotification.ErrorTitle,
            content: localeData.ChangeEmailNotification.EMAIL_DUPLICATE,
            duration: 3,
            position: 'top',
          });
          break;

        case 'EMAIL_UPDATE_REDUNDANT_VALUE':
          Notification.error({
            title: localeData.ChangeEmailNotification.ErrorTitle,
            content: localeData.ChangeEmailNotification.EMAIL_SAME_AS_OLD,
            duration: 3,
            position: 'top',
          });
          break;

        default:
          Notification.error({
            title: localeData.ChangeEmailNotification.UnknownErrorTitle,
            content: localeData.ChangeEmailNotification.UnknownErrorDescription,
            duration: 3,
            position: 'top',
          });
      }
    }
  };

  return (
    <div className="mt-2 p-4 border border-gray-900 rounded-md">
      <Banner type="warning" description={localeData?.NeedVerifyEmail} />

      <div className="flex items-center mt-4 mb-4">
        <Input
          autoComplete={'off'}
          placeholder={localeData.NewEmailInputPlaceholder}
          type="email"
          onChange={(e: string) => setNewEmail(e)}
        />
        <button
          className="flex whitespace-nowrap border border-[#d1d9e0] rounded-md px-4 py-1 ml-2 bg-[#f6f8fa] hover:bg-[#f0f2f5]"
          onClick={() => changeEmail(localeData)}
        >
          {localeData.ChangeEmail}
        </button>
      </div>
    </div>
  );
}

export default ChangeEmailComponent;
