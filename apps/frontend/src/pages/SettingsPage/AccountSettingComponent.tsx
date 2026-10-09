import * as React from 'react';
import { useEffect } from 'react';
import ChangePasswordComponent from './ChangePassword.tsx';
import { UserApis } from '../../service/UserApis.ts';
import { Banner, Toast, Tooltip } from '@douyinfe/semi-ui';
import ChangeEmailComponent from './ChangeEmail.tsx';

export interface ApiSecretKeyComponentProps {
  localeData: any;
}

function AccountSettingComponent({
  localeData,
}: ApiSecretKeyComponentProps): React.ReactElement {
  const [showChangeEmail, setShowChangeEmail] = React.useState<boolean>(false);
  const [showChangePassword, setShowChangePassword] =
    React.useState<boolean>(false);

  const [accountInfo, setAccountInfo] = React.useState<{
    userID?: string;
    username?: string;
    email?: string;
    isEmailVerified?: boolean;
    lastSendEmailTime?: number;
  }>({});

  async function fetchAccountInfo() {
    const res = await UserApis.getUserInfo();
    console.log(`[fetchAccountInfo] res: ${JSON.stringify(res)}`);
    if (!res) {
      return;
    }
    setAccountInfo(res);
  }

  useEffect(() => {
    fetchAccountInfo().then();
  }, []);

  return (
    <>
      <div className={'font-bold text-xl mt-6 mb-2'}>
        {localeData?.AccountInfo}
      </div>

      {/* Warning Banner */}
      {!accountInfo.isEmailVerified && (
        <Banner
          type="warning"
          description={localeData?.AccountUnverifiedWarningBanner}
        />
      )}

      <div className="w-full p-4 border border-gray-200 rounded-md">
        {/* Account Info - Username */}
        <div className="flex">
          <div style={{ width: '300px' }}>
            <h5>{localeData?.AccountUsername}</h5>
          </div>
          <span style={{ color: 'gray', fontWeight: 500 }}>
            {accountInfo?.username}
          </span>
        </div>

        {/* Account Info - Email */}
        <div className="flex mt-2">
          <div style={{ width: '300px' }}>
            <h5>{localeData?.AccountEmail}</h5>
          </div>
          <span style={{ color: 'gray', fontWeight: 500 }}>
            {accountInfo?.email}
          </span>

          {/* If the email is not verified, show the "Verify" button */}
          {accountInfo?.isEmailVerified ? (
            <span>
              <span className="ml-2 bg-green-300 p-1 px-2 rounded-full whitespace-nowrap">
                {localeData?.AccountEmailVerified}
              </span>
            </span>
          ) : (
            <span>
              <Tooltip content={localeData?.AccountEmailUnverifiedTooltip}>
                <span
                  className="ml-2 bg-yellow-200 p-1 cursor-pointer rounded underline"
                  onClick={async () => {
                    // 10 minutes interval
                    const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
                    const currentTime = new Date().valueOf();

                    if (
                      accountInfo.lastSendEmailTime &&
                      currentTime - accountInfo.lastSendEmailTime < tenMinutes
                    ) {
                      const waitTime = Math.ceil(
                        (tenMinutes -
                          (currentTime - accountInfo.lastSendEmailTime)) /
                          1000,
                      ); // Calculate remaining wait time in seconds
                      Toast.warning(
                        localeData.AccountEmailSendTooFrequently.replace(
                          '{waitSeconds}',
                          waitTime.toString(),
                        ),
                      );
                      return;
                    } else {
                      await UserApis.sendVerificationEmail();
                      Toast.success(localeData.AccountEmailSendToast);
                      fetchAccountInfo().then();
                    }
                  }}
                >
                  {localeData?.AccountEmailUnverified}
                </span>
              </Tooltip>
            </span>
          )}

          {/* Account Info - Change email */}
          <span>
            <span
              className="ml-2 p-1 px-2 rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200 hover:text-black whitespace-nowrap"
              title="Click to change email"
              onClick={() => setShowChangeEmail(!showChangeEmail)}
            >
              {localeData.AccountChangeEmail}
            </span>
          </span>
        </div>

        {showChangeEmail && (
          <ChangeEmailComponent
            localeData={localeData}
            changeEmailDone={fetchAccountInfo}
          />
        )}

        {/* Account Info - Change Password ---- START*/}
        <div className="mt-2">
          <div className="flex">
            <div style={{ width: '300px' }}>
              <h5>{localeData?.AccountChangePassword}</h5>
            </div>
            <span>
              <a
                style={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                {localeData.AccountClickToChange}
              </a>
            </span>
          </div>
          {showChangePassword && (
            <ChangePasswordComponent localeData={localeData} />
          )}
        </div>
        {/* Account Info - Change Password ---- END*/}
      </div>
    </>
  );
}

export default AccountSettingComponent;
