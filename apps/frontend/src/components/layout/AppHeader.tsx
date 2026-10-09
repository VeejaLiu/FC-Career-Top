import { useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  LocaleConsumer,
  Notification,
  Tooltip,
} from '@douyinfe/semi-ui';
import {
  IconBell,
  IconBranch,
  IconExit,
  IconSetting,
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
import { IconDiscord } from '../../common/icons';
import { PlayerApis } from '../../service/PlayerApis';
import { UserApis } from '../../service/UserApis';
import { NotificationApis } from '../../service/NotificationApis';
import { NotificationPopover } from '../NotificationPopover';
import { navigationItems } from './navigation';
import { ResponsivePopover } from '../ResponsivePopover';
import fc24Logo from '../../../public/fc24-logo.svg';
import fc25Logo from '../../../public/fc25-logo.png';

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
          {version !== 0 && (
            <img
              className="app-game-logo"
              src={version === 24 ? fc24Logo : fc25Logo}
              alt={`FC ${version}`}
            />
          )}
          <span className="app-brand-title">{locale.title}</span>
          <Dropdown
            trigger="click"
            position="bottomLeft"
            render={
              <Dropdown.Menu>
                {[24, 25].map((gameVersion) => (
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
              className="version-switcher"
              aria-label={locale.switchVersion}
              disabled={switching}
            >
              <IconBranch />
              {version > 0 && (
                <span className="version-switcher-version">{version}</span>
              )}
              <span className="version-switcher-label">
                {locale.switchVersion}
              </span>
            </button>
          </Dropdown>
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
  const [unreadCount, setUnreadCount] = useState(0);
  const currentLanguage = normalizeLanguage(
    localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY) || navigator.language,
  );
  const selectedLanguage =
    languageOptions.find((option) => option.key === currentLanguage) ||
    languageOptions[0];
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
              <Tooltip content={locale.JoinDiscord} position="bottom">
                <Button
                  className="discord-button"
                  theme="borderless"
                  aria-label="Discord"
                  icon={<IconDiscord classname="fill-[#5a65e9]" />}
                  onClick={() =>
                    window.open(
                      'https://discord.gg/aKfWAtbJ8F',
                      '_blank',
                      'noopener,noreferrer',
                    )
                  }
                />
              </Tooltip>
              <Dropdown
                trigger="click"
                position="bottomRight"
                render={
                  <Dropdown.Menu>
                    {languageOptions.map((option) => (
                      <Dropdown.Item
                        key={option.key}
                        onClick={() => {
                          localStorage.setItem(
                            LANGUAGE_LOCAL_STORAGE_KEY,
                            option.key,
                          );
                          window.location.reload();
                        }}
                      >
                        <img src={option.icon} alt="" width={20} />
                        <span className="ml-2">{option.label}</span>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                }
              >
                <button
                  type="button"
                  className="language-switcher"
                  aria-label={selectedLanguage.label}
                >
                  <img src={selectedLanguage.icon} alt="" />
                  <span>{selectedLanguage.label}</span>
                </button>
              </Dropdown>
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
                    <button
                      type="button"
                      className="header-icon-button"
                      aria-label={notificationLocale.Title}
                    >
                      <Badge count={unreadCount || undefined} theme="solid">
                        <IconBell size="large" />
                      </Badge>
                    </button>
                  </ResponsivePopover>
                )}
              </LocaleConsumer>
              <Dropdown
                position="bottomRight"
                trigger="click"
                render={
                  <Dropdown.Menu>
                    <Dropdown.Item disabled>
                      {locale.Hello}
                      {username || 'Guest'}
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      icon={<IconSetting />}
                      onClick={() => navigate('/settings')}
                    >
                      {locale.Settings}
                    </Dropdown.Item>
                    <Dropdown.Item
                      icon={<IconExit />}
                      onClick={async () => {
                        if (await UserApis.doLogout())
                          window.location.assign('/');
                        else
                          Notification.error({
                            title: 'Error',
                            content: 'Failed to logout, please try again',
                            duration: 3,
                          });
                      }}
                    >
                      {locale.Logout}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                <button
                  type="button"
                  className="header-icon-button"
                  aria-label={locale.Settings}
                >
                  <Avatar size="small" color="light-blue">
                    {username.charAt(0).toUpperCase()}
                  </Avatar>
                </button>
              </Dropdown>
            </div>
          </div>
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
