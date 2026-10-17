import { useCallback, useEffect, useRef, useState } from 'react';
import { LocaleConsumer, Notification, Switch } from '@douyinfe/semi-ui';
import { UserApis } from '../../service/UserApis';
import ApiSecretKeyComponent from './ApiSecretKeyComponent';
import AccountSettingComponent from './AccountSettingComponent';
import './SettingsPage.css';

function SettingsContent({ copy }: { copy: any }) {
  const [settings, setSettings] =
    useState<Awaited<ReturnType<typeof UserApis.getUserSetting>>>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const saving = useRef(false);
  const load = useCallback(async () => {
    setLoading(true);
    setSettings(await UserApis.getUserSetting());
    setLoading(false);
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  async function update(category: string, value: boolean, subItem?: string) {
    if (saving.current) return;
    saving.current = true;
    setLoading(true);
    const result = await UserApis.updateUserSetting({
      category,
      subItem,
      value,
    });
    if (!result.success)
      Notification.error({ title: copy.SaveFailed, duration: 3 });
    await load();
    saving.current = false;
  }
  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    if (await UserApis.doLogout()) window.location.assign('/');
    else {
      Notification.error({ title: copy.LogoutFailed, duration: 3 });
      setLoggingOut(false);
    }
  }
  const notificationItems = [
    {
      label: copy.PlayerOverallPotentialUpdate,
      setting: 'PlayerUpdate_Overall' as const,
      subItem: 'PlayerUpdate.Overall',
    },
    {
      label: copy.PlayerSkillMoveUpdate,
      setting: 'PlayerUpdate_SkillMove' as const,
      subItem: 'PlayerUpdate.SkillMove',
    },
    {
      label: copy.PlayerWeakFootUpdate,
      setting: 'PlayerUpdate_WeakFoot' as const,
      subItem: 'PlayerUpdate.WeakFoot',
    },
  ];
  return (
    <div className="page-container settings-page">
      <header className="settings-page-heading">
        <h1>{copy.Settings}</h1>
        <p>{copy.SettingsDescription}</p>
      </header>
      <AccountSettingComponent localeData={copy} />
      <section
        className="settings-section"
        aria-labelledby="notifications-heading"
      >
        <div className="settings-section-heading">
          <h2 id="notifications-heading">{copy.Notifications}</h2>
          <p>{copy.NotificationsDescription}</p>
        </div>
        {!loading && !settings && (
          <div className="settings-load-error" role="alert">
            {copy.LoadFailed}
            <button className="settings-button" onClick={() => void load()}>
              {copy.Retry}
            </button>
          </div>
        )}
        <div className="settings-switch-row settings-switch-master">
          <div className="settings-field-label">
            <strong>{copy.EnableNotifications}</strong>
          </div>
          <Switch
            aria-label={copy.EnableNotifications}
            checked={Boolean(settings?.enableNotification)}
            loading={loading}
            disabled={loading || !settings}
            onChange={(value) => void update('enable_notification', value)}
          />
        </div>
        {notificationItems.map((item) => (
          <div className="settings-switch-row" key={item.setting}>
            <div className="settings-field-label">{item.label}</div>
            <Switch
              aria-label={item.label}
              checked={Boolean(
                settings?.enableNotification &&
                  settings.notificationItems?.[item.setting],
              )}
              loading={loading}
              disabled={loading || !settings?.enableNotification}
              onChange={(value) =>
                void update('notification_items', value, item.subItem)
              }
            />
          </div>
        ))}
      </section>
      <ApiSecretKeyComponent localeData={copy} />
      <section className="settings-session">
        <div>
          <h2>{copy.Logout}</h2>
          <p>{copy.LogoutDescription}</p>
        </div>
        <button
          className="settings-button settings-button-danger"
          disabled={loggingOut}
          onClick={() => void logout()}
        >
          {copy.ClickToLogout}
        </button>
      </section>
    </div>
  );
}
export default function SettingsPage() {
  return (
    <LocaleConsumer componentName="SettingsPage">
      {(copy: any) => <SettingsContent copy={copy} />}
    </LocaleConsumer>
  );
}
