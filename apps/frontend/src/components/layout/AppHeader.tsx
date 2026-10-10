import { useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Dropdown,
  LocaleConsumer,
  Notification,
  SideSheet,
} from '@douyinfe/semi-ui';
import {
  IconBell,
  IconChevronDown,
  IconExit,
  IconSetting,
  IconTick,
} from '@douyinfe/semi-icons';
import {
  getDefaultGameVersion,
  removeDefaultGameVersion,
} from '../../common/common';
import {
  LANGUAGE_LOCAL_STORAGE_KEY,
  normalizeLanguage,
} from '../../common/language';
import { languageOptions } from '../../common/language-options';
import { PlayerApis } from '../../service/PlayerApis';
import { UserApis } from '../../service/UserApis';
import { NotificationApis } from '../../service/NotificationApis';
import { NotificationPopover } from '../NotificationPopover';
import { navigationItems } from './navigation';
import { ResponsivePopover } from '../ResponsivePopover';
import { HeaderIconButton } from './HeaderIconButton';
import fc24Logo from '../../../public/fc24-logo.svg';
import fc25Logo from '../../../public/fc25-logo.png';
import { GAME_VERSIONS } from '../../constant/game-versions';

function WebsiteLogo() {
  const [version, setVersion] = useState(0);
  const [switching, setSwitching] = useState(false);
  useEffect(() => {
    getDefaultGameVersion().then(setVersion);
  }, []);

  return (
    <LocaleConsumer componentName="WebsiteLogoComponent">
      {(locale: any) => (
        <div className="app-brand">
          <Dropdown
            trigger="click"
            position="bottomLeft"
            render={
              <Dropdown.Menu>
                {GAME_VERSIONS.map((gameVersion) => (
                  <Dropdown.Item
                    key={gameVersion}
                    disabled={switching}
                    onClick={async () => {
                      setSwitching(true);
                      const updated = await UserApis.updateUserSetting({
                        category: 'default_game_version',
                        value: gameVersion,
                      });
                      if (updated?.success) {
                        removeDefaultGameVersion();
                        window.location.reload();
                      } else {
                        setSwitching(false);
                        Notification.error({
                          title: 'Error',
                          content: updated?.message || 'Please try again',
                        });
                      }
                    }}
                  >
                    FC {gameVersion}
                    {version === gameVersion ? ` (${locale.current})` : ''}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            }
          >
            <button
              type="button"
              className="game-version-switcher"
              aria-label={`${locale.switchVersion}: FC ${version || '…'}`}
              disabled={switching}
            >
              {version === 24 || version === 25 ? (
                <img
                  className="app-game-logo"
                  src={version === 24 ? fc24Logo : fc25Logo}
                  alt={`FC ${version}`}
                />
              ) : (
                <span className="app-game-wordmark">FC {version || '…'}</span>
              )}
              <IconChevronDown size="small" />
            </button>
          </Dropdown>
          <span className="app-brand-title">{locale.title}</span>
        </div>
      )}
    </LocaleConsumer>
  );
}

export function AppHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [playerCount, setPlayerCount] = useState(0);
  const [username, setUsername] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const currentLanguage = normalizeLanguage(
    localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY) || navigator.language,
  );
  const refreshUnread = useCallback(
    async () =>
      setUnreadCount(await NotificationApis.getUnreadNotificationsCount()),
    [],
  );

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const [count, unread] = await Promise.all([
        PlayerApis.getPlayerCount(),
        NotificationApis.getUnreadNotificationsCount(),
      ]);
      if (active) {
        setPlayerCount(count);
        setUnreadCount(unread);
      }
    };
    refresh();
    UserApis.getUserInfo().then((user) => {
      if (active) setUsername(user?.username || '');
    });
    window.addEventListener('fct-notifications-updated', refresh);
    return () => {
      active = false;
      window.removeEventListener('fct-notifications-updated', refresh);
    };
  }, []);

  return (
    <LocaleConsumer componentName="Navbar">
      {(locale: any) => (
        <header className="app-header">
          <div className="app-header-top">
            <WebsiteLogo />
            <div className="app-header-actions">
              <LocaleConsumer componentName="NotificationPopover">
                {(notificationLocale: any) => (
                  <ResponsivePopover
                    title={notificationLocale.Title}
                    desktopWidth={440}
                    mobileClassName="mobile-notifications"
                    content={
                      <NotificationPopover updateUnreadCount={refreshUnread} />
                    }
                  >
                    <HeaderIconButton
                      aria-label={notificationLocale.Title}
                      unreadCount={unreadCount}
                    >
                      <IconBell size="large" />
                    </HeaderIconButton>
                  </ResponsivePopover>
                )}
              </LocaleConsumer>
              <HeaderIconButton
                aria-label={locale.MyAccount}
                aria-expanded={accountOpen}
                aria-controls="account-sheet-content"
                onClick={() => setAccountOpen(true)}
              >
                <Avatar size="small" color="light-blue">
                  {username.charAt(0).toUpperCase()}
                </Avatar>
              </HeaderIconButton>
            </div>
          </div>
          <SideSheet
            className="account-sheet"
            title={locale.MyAccount}
            aria-label={locale.MyAccount}
            visible={accountOpen}
            placement="right"
            width="min(360px, 100vw)"
            onCancel={() => setAccountOpen(false)}
            footer={
              <button
                type="button"
                className="account-sheet-action"
                onClick={async () => {
                  if (await UserApis.doLogout()) window.location.assign('/');
                  else
                    Notification.error({
                      title: 'Error',
                      content: 'Failed to logout, please try again',
                    });
                }}
              >
                <IconExit />
                {locale.Logout}
              </button>
            }
          >
            <div id="account-sheet-content" className="account-sheet-content">
              <div className="account-sheet-profile">
                <Avatar color="light-blue">
                  {username.charAt(0).toUpperCase()}
                </Avatar>
                <strong>{username || 'Guest'}</strong>
              </div>
              <button
                type="button"
                className="account-sheet-action"
                onClick={() => {
                  setAccountOpen(false);
                  navigate('/settings');
                }}
              >
                <IconSetting />
                {locale.Settings}
              </button>
              <section
                className="account-sheet-languages"
                aria-label={locale.Language}
              >
                <h2>{locale.Language}</h2>
                {languageOptions.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className="account-sheet-language"
                    aria-pressed={option.key === currentLanguage}
                    onClick={() => {
                      if (option.key === currentLanguage) return;
                      localStorage.setItem(
                        LANGUAGE_LOCAL_STORAGE_KEY,
                        option.key,
                      );
                      window.location.reload();
                    }}
                  >
                    <img
                      className="account-language-flag"
                      src={option.icon}
                      alt=""
                    />
                    <span>{option.label}</span>
                    {option.key === currentLanguage && (
                      <IconTick size="small" />
                    )}
                  </button>
                ))}
              </section>
            </div>
          </SideSheet>
          <nav className="app-navigation" aria-label="FC Career Top">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `app-navigation-link ${isActive || (item.path === '/players' && pathname === '/') ? 'active' : ''}`
                }
              >
                {item.icon}
                <span>
                  {locale[item.label]}
                  {item.path === '/players' ? ` (${playerCount})` : ''}
                </span>
              </NavLink>
            ))}
          </nav>
        </header>
      )}
    </LocaleConsumer>
  );
}
