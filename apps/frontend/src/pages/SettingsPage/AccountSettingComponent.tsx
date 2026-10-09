import * as React from 'react';
import { useEffect } from 'react';
import ChangePasswordComponent from './ChangePassword.tsx';
import { UserApis } from '../../service/UserApis.ts';

export interface ApiSecretKeyComponentProps {
  localeData: any;
}

function AccountSettingComponent({
  localeData,
}: ApiSecretKeyComponentProps): React.ReactElement {
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

        <div className="flex mt-2">
          <div style={{ width: '300px' }}>
            <h5>{localeData?.AccountEmail}</h5>
          </div>
          <span style={{ color: 'gray', fontWeight: 500 }}>
            {accountInfo?.email}
          </span>
        </div>
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
