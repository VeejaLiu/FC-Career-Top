import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLoginComponent } from '../LoginPage/GoogleLoginComponent';
import { UserApis } from '../../service/UserApis';

export default function AccountSettingComponent({
  localeData: copy,
}: {
  localeData: any;
}) {
  const [account, setAccount] =
    useState<Awaited<ReturnType<typeof UserApis.getUserInfo>>>(null);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    setAccount(await UserApis.getUserInfo());
    setLoading(false);
  }
  useEffect(() => {
    void load();
  }, []);
  return (
    <section className="settings-section" aria-labelledby="account-heading">
      <div className="settings-section-heading">
        <h2 id="account-heading">{copy.AccountInfo}</h2>
        <p>{copy.AccountDescription}</p>
      </div>
      {loading ? (
        <p className="settings-loading" role="status">
          {copy.Loading}
        </p>
      ) : !account ? (
        <div className="settings-load-error" role="alert">
          {copy.LoadFailed}
          <button className="settings-button" onClick={() => void load()}>
            {copy.Retry}
          </button>
        </div>
      ) : (
        <>
          <dl className="settings-details">
            <div className="settings-detail-row">
              <dt>{copy.AccountUsername}</dt>
              <dd>{account.username}</dd>
            </div>
            <div className="settings-detail-row">
              <dt>{copy.AccountEmail}</dt>
              <dd>{account.email}</dd>
            </div>
          </dl>
          <div className="settings-method-row">
            <div className="settings-method-name">
              <strong>Google</strong>
              <p>
                {account.googleLoginEnabled
                  ? copy.GoogleConnectedDescription
                  : copy.GoogleConnectDescription}
              </p>
            </div>
            <span
              className={`settings-status${account.googleLoginEnabled ? ' settings-status-active' : ''}`}
            >
              <span aria-hidden="true" />
              {account.googleLoginEnabled
                ? copy.GoogleConnected
                : copy.GoogleNotConnected}
            </span>
          </div>
          {!account.googleLoginEnabled && (
            <div className="settings-google-connect">
              <GoogleLoginComponent linkAccount />
            </div>
          )}
          <div className="settings-method-row">
            <div className="settings-method-name">
              <strong>{copy.PasswordLogin}</strong>
              <p>
                {account.emailLoginEnabled
                  ? copy.PasswordDescription
                  : copy.GoogleOnlyDescription}
              </p>
            </div>
            {account.emailLoginEnabled ? (
              <Link className="settings-button" to="/settings/password">
                {copy.AccountChangePassword}
              </Link>
            ) : (
              <span className="settings-status">{copy.NotEnabled}</span>
            )}
          </div>
        </>
      )}
    </section>
  );
}
