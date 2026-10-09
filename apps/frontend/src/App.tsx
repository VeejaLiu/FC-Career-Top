import { Link, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  LocaleConsumer,
  Nav,
  Notification,
  Popover,
  Space,
  Tooltip,
} from '@douyinfe/semi-ui';
import './App.css';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { PlayerApis } from './service/PlayerApis.ts';
import PlayerListPage from './pages/PlayerListPage/PlayerListPage.tsx';
import PlayerTrendsPage from './pages/PlayerTrendsPage/PlayerTrendsPage.tsx';
import SettingsPage from './pages/SettingsPage/SettingsPage.tsx';
import {
  IconArticle,
  IconBell,
  IconBranch,
  IconExit,
  IconHistogram,
  IconIdCard,
  IconSetting,
  IconUser,
} from '@douyinfe/semi-icons';
import GetStartedPage from './pages/GetStartedPage/GetStartedPage.tsx';
import { WebsocketNotification } from './components/WebsocketNotification.tsx';
import PlayerDetailPage from './pages/PlayerDetailPage/PlayerDetailPage.tsx';
import { UserApis } from './service/UserApis.ts';
import fc24Logo from '../public/fc24-logo.svg';
import fc25Logo from '../public/fc25-logo.png';
import {
  getDefaultGameVersion,
  removeDefaultGameVersion,
} from './common/common.ts';
import { LANGUAGE_LOCAL_STORAGE_KEY } from './components/Auth.tsx';
import { NotificationPopover } from './components/NotificationPopover.tsx';
import { NotificationApis } from './service/NotificationApis.ts';

import icon_english from './assets/image/language/english.png';
import icon_chinese from './assets/image/language/chinese.png';
import icon_france from './assets/image/language/france.png';
import icon_german from './assets/image/language/german.png';
import icon_japanese from './assets/image/language/japanese.png';
import { IconDiscord } from './common/icons.tsx';

function getLogoByVersion(defaultVersion: number) {
  switch (defaultVersion) {
    case 24:
      return <img src={fc24Logo} width={'100px'} alt={'FC 24 Logo'} />;
    case 25:
      return <img src={fc25Logo} width={'100px'} alt={'FC 25 Logo'} />;
    default:
      return <h4>No version chosen</h4>;
  }
}

function WebsiteLogoComponent() {
  const [defaultGameVersion, setDefaultGameVersion] = React.useState<number>(0);

  const fetchDefaultGameVersion = async () => {
    const gameVersion = await getDefaultGameVersion();
    setDefaultGameVersion(gameVersion);
  };

  useEffect(() => {
    fetchDefaultGameVersion().then();
  }, []);

  return (
    <LocaleConsumer componentName={'WebsiteLogoComponent'}>
      {(localeData: any, localeCode: string, dateFnsLocale: any) => (
        <Space className="p-4 bg-[#151616] text-white">
          <div>{getLogoByVersion(defaultGameVersion)}</div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              fontStyle: 'italic',
              fontFamily: 'Bebas Neue, Arial, sans-serif',
            }}
          >
            {localeData.title}
          </div>
          <Dropdown
            trigger={'click'}
            position={'bottom'}
            render={
              <Dropdown.Menu>
                {[
                  { name: 'FC 24', version: 24 },
                  { name: 'FC 25', version: 25 },
                ].map((value, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={async () => {
                      removeDefaultGameVersion();
                      await UserApis.updateUserSetting({
                        category: 'default_game_version',
                        value: value.version,
                      });
                      window.location.reload();
                    }}
                  >
                    <div>
                      {value.name}
                      <span className="font-bold ml-2">
                        {defaultGameVersion === value.version &&
                          `(${localeData.current})`}
                      </span>
                    </div>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            }
          >
            <div className="flex items-center cursor-pointer bg-gray-600 hover:bg-gray-500 rounded-full px-4 py-1 transition duration-300 ease-in-out transform hover:scale-105 whitespace-nowrap">
              <IconBranch
                size={'large'}
                style={{ cursor: 'pointer', color: '#94f17a' }}
              />
              <span className="ml-2 font-bold">{localeData.switchVersion}</span>
            </div>
          </Dropdown>
        </Space>
      )}
    </LocaleConsumer>
  );
}

const languageOptions = [
  { key: 'en', label: 'English(US)', icon: icon_english },
  { key: 'zh', label: '简体中文', icon: icon_chinese },
  { key: 'fr', label: 'Français', icon: icon_france },
  { key: 'de', label: 'Deutsch', icon: icon_german },
  { key: 'ja', label: '日本語', icon: icon_japanese },
];

export default function App() {
  const navigate = useNavigate();
  const [playerCount, setPlayerCount] = useState(0);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const fetchPlayerCount = async () => {
    const count = await PlayerApis.getPlayerCount();
    setPlayerCount(count);
  };

  const fetchUnreadNotificationCount = async () => {
    const count = await NotificationApis.getUnreadNotificationsCount();
    setUnreadNotificationCount(count);
  };

  const fetchUsername = async () => {
    const userInfo = await UserApis.getUserInfo();
    setUserInfo(userInfo);
  };

  // 定义处理语言切换的函数
  const handleLanguageChange = (lang: string) => {
    localStorage.setItem(LANGUAGE_LOCAL_STORAGE_KEY, lang);
    window.location.reload();
  };

  const doLogout = async () => {
    UserApis.doLogout().then((result) => {
      if (result) {
        Notification.success({
          title: 'Success',
          content: 'Logged out successfully',
          duration: 3,
        });
        window.location.href = '/';
      } else {
        Notification.error({
          title: 'Error',
          content: 'Failed to logout, please try again',
          duration: 3,
        });
        return;
      }
    });
  };

  useEffect(() => {
    fetchPlayerCount().then();
    fetchUsername().then();
    fetchUnreadNotificationCount().then();
    const language = localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY);
    if (language) {
      setCurrentLanguage(language);
    } else {
      const browserLanguage = navigator.language.split('-')[0];
      const matchedLanguage = languageOptions.find(
        (option) => option.key === browserLanguage,
      );
      if (matchedLanguage) {
        setCurrentLanguage(matchedLanguage.key);
        localStorage.setItem(LANGUAGE_LOCAL_STORAGE_KEY, matchedLanguage.key);
      }
    }
  }, []);

  return (
    <LocaleConsumer componentName={'Navbar'}>
      {(localeData: any, localeCode: string, dateFnsLocale: any) => (
        <>
          <WebsocketNotification />
          <Routes>
            <Route
              path="/"
              element={
                <Space vertical className="root">
                  {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}

                  <Nav
                    className="nav"
                    header={<WebsiteLogoComponent />}
                    mode="horizontal"
                    renderWrapper={({
                      itemElement,
                      isSubNav,
                      isInSubNav,
                      props,
                    }) => {
                      const routerMap: Record<string, string> = {
                        Players: '/players',
                        PlayerDetail: '/players-detail',
                        PlayersTrends: '/players-trends',
                        Settings: '/settings',
                        GetStarted: '/get-started',
                      };
                      return (
                        <Link
                          style={{ textDecoration: 'none' }}
                          to={routerMap[props.itemKey || '']}
                        >
                          {itemElement}
                        </Link>
                      );
                    }}
                    items={[
                      {
                        text: `${localeData.PlayersList} (${playerCount})`,
                        itemKey: 'Players',
                        icon: <IconUser />,
                      },
                      {
                        text: localeData.PlayerDetail,
                        itemKey: 'PlayerDetail',
                        icon: <IconIdCard />,
                      },
                      {
                        text: localeData.PlayersTrends,
                        itemKey: 'PlayersTrends',
                        icon: <IconHistogram />,
                      },
                      {
                        text: localeData.GetStarted,
                        itemKey: 'GetStarted',
                        icon: <IconArticle />,
                      },
                    ]}
                    footer={
                      <div
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          display: 'flex',
                        }}
                      >
                        <Tooltip
                          content={localeData.JoinDiscord}
                          position={'bottom'}
                        >
                          <Button
                            theme="borderless"
                            icon={
                              <IconDiscord
                                classname={
                                  'fill-white bg-[#5a65e9] rounded-full p-1 hover:bg-[#4b5ae0] transition duration-300 ease-in-out transform hover:scale-110 hover:rotate-45'
                                }
                              />
                            }
                            style={{
                              color: 'var(--semi-color-text-2)',
                              // marginRight: '12px',
                            }}
                            onClick={() => {
                              window.open('https://discord.gg/aKfWAtbJ8F');
                            }}
                          />
                        </Tooltip>

                        <Dropdown
                          position={'bottom'}
                          render={
                            <Dropdown.Menu>
                              {languageOptions.map((option) => (
                                <Dropdown.Item
                                  key={option.key}
                                  onClick={() =>
                                    handleLanguageChange(option.key)
                                  }
                                >
                                  <div className="flex items-center">
                                    <img
                                      src={option.icon}
                                      alt={option.label}
                                      width={20}
                                    />
                                    <span className="ml-2">{option.label}</span>
                                  </div>
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          }
                        >
                          <div
                            className={
                              'flex items-center bg-gray-200 px-4 p-1 rounded-full font-bold'
                            }
                          >
                            <img
                              src={
                                languageOptions?.find((o) => {
                                  return o.key === currentLanguage;
                                })?.icon
                              }
                              alt={
                                languageOptions?.find((o) => {
                                  return o.key === currentLanguage;
                                })?.label
                              }
                              width={20}
                            />
                            <span className="ml-4">
                              {
                                languageOptions?.find((o) => {
                                  return o.key === currentLanguage;
                                })?.label
                              }
                            </span>
                          </div>
                        </Dropdown>

                        <Popover
                          style={{
                            width: '440px',
                            maxHeight: '90vh',
                          }}
                          position={'bottomRight'}
                          content={
                            <NotificationPopover
                              updateUnreadCount={fetchUnreadNotificationCount}
                            />
                          }
                          trigger="click"
                        >
                          <Button
                            theme="borderless"
                            icon={<IconBell size="extra-large" />}
                            style={{
                              color: 'var(--semi-color-text-2)',
                              marginRight: '12px',
                              display: 'relative',
                            }}
                          ></Button>
                          {unreadNotificationCount > 0 && (
                            <Badge
                              count={unreadNotificationCount}
                              theme="solid"
                              style={{
                                position: 'absolute',
                                backgroundColor: 'red',
                                top: '-25px',
                                right: '10px',
                              }}
                            ></Badge>
                          )}
                        </Popover>
                        <Dropdown
                          position="bottomRight"
                          trigger={'click'}
                          render={
                            <Dropdown.Menu>
                              <Dropdown.Item disabled={true}>
                                {localeData.Hello}
                                {userInfo?.username || 'Guest'}
                              </Dropdown.Item>

                              <Dropdown.Divider />

                              <Dropdown.Item
                                icon={<IconSetting />}
                                onClick={() => {
                                  navigate('/settings');
                                }}
                              >
                                {localeData.Settings}
                              </Dropdown.Item>

                              <Dropdown.Item
                                icon={<IconExit />}
                                onClick={doLogout}
                              >
                                {localeData.Logout}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          }
                        >
                          <Avatar
                            size="small"
                            color="light-blue"
                            style={{ marginRight: '12px' }}
                          >
                            {userInfo?.username?.charAt(0)?.toUpperCase()}
                          </Avatar>
                        </Dropdown>
                      </div>
                    }
                  ></Nav>
                  <div className={'content'}>
                    <Outlet />
                  </div>
                </Space>
              }
            >
              <Route index element={<PlayerListPage />} />
              <Route path="players" element={<PlayerListPage />} />
              <Route path="players-trends" element={<PlayerTrendsPage />} />
              <Route path="players-detail" element={<PlayerDetailPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="get-started" element={<GetStartedPage />} />
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </>
      )}
    </LocaleConsumer>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>404 Not Found</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
