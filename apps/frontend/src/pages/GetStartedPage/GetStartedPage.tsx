import * as React from 'react';
import { useEffect } from 'react';
import {
  Banner,
  Button,
  CodeHighlight,
  LocaleConsumer,
  Notification,
  Space,
  Steps,
} from '@douyinfe/semi-ui';
import { UserApis } from '../../service/UserApis.ts';
import { luaScript_FC24 } from '../../constant/user-script.ts';
import { luaScript_FC25 } from '../../constant/user-script.ts';
import { getDefaultGameVersion } from '../../common/common.ts';
import { IconCopy } from '@douyinfe/semi-icons';

const PostPlayerURL =
  import.meta.env.VITE_POST_PLAYER_URL || 'http://localhost:8888';

function SettingsPage(): React.ReactElement {
  const [codeStr, setCodeStr] = React.useState(luaScript_FC24);
  const [isSecretLoading, setIsSecretLoading] = React.useState(true);
  async function getLuaCode() {
    const key = await UserApis.getSecretKey();
    const gameVersion = await getDefaultGameVersion();

    switch (gameVersion) {
      case 24:
        setCodeStr(
          luaScript_FC24
            .replace('{{user-secret-key}}', key)
            .replace('{{post-player-url}}', PostPlayerURL),
        );
        break;
      case 25:
        setCodeStr(
          luaScript_FC25
            .replace('{{user-secret-key}}', key)
            .replace('{{post-player-url}}', PostPlayerURL),
        );
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    getLuaCode().then(
      () => {
        setIsSecretLoading(false);
      },
      (e) => {
        Notification.error({
          title: 'Error',
          content: 'Failed to fetch secret key. Please try again later.',
          duration: 3,
        });
      },
    );
  }, []);

  return (
    <LocaleConsumer componentName={'GetStartedPage'}>
      {(localeData: any, localeCode: string, dateFnsLocale: any) => (
        <Space className={'w-full'} vertical align={'start'}>
          <div className={'p-6 w-full relative'}>
            <h1 className={'text-3xl font-bold mb-4'}>{localeData?.Title}</h1>

            <Steps direction="vertical" type="basic" current={3}>
              <Steps.Step
                title={localeData.STEP_1.Title}
                description={
                  <div>
                    <p>{localeData.STEP_1.DownloadLink}</p>
                    <p className={'ml-2 underline'}>
                      <a
                        href="https://www.patreon.com/collection/779838?view=expanded"
                        target="_blank"
                        rel="noreferrer"
                      >
                        FC 25 Live Editor
                      </a>
                    </p>
                    <p className={'ml-2 underline'}>
                      <a
                        href="https://www.patreon.com/collection/96422?view=expanded"
                        target="_blank"
                        rel="noreferrer"
                      >
                        FC 24 Live Editor
                      </a>
                    </p>
                  </div>
                }
              />
              <Steps.Step
                title={localeData.STEP_2.Title}
                description={localeData.STEP_2.Description}
              />
              <Steps.Step
                title={localeData.STEP_3.Title}
                description={localeData.STEP_3.Description}
              />
              <Steps.Step
                title={localeData.STEP_4.Title}
                description={
                  <div>
                    <p>{localeData?.STEP_4.Description}</p>
                    <Banner
                      type="warning"
                      closeIcon={null}
                      description={localeData?.CODE_NOT_SHARE_WARNING}
                    />
                    <div
                      style={{
                        maxHeight: '200px',
                        overflow: 'scroll',
                        border: '1px solid #AAA',
                      }}
                    >
                      <CodeHighlight
                        code={codeStr}
                        language="JavaScript"
                        className={'code-highlight'}
                        defaultTheme={true}
                        lineNumber={false}
                        style={{}}
                      ></CodeHighlight>
                    </div>
                    <Button
                      icon={<IconCopy />}
                      className={'items-center mt-2'}
                      type="tertiary"
                      disabled={isSecretLoading}
                      onClick={() => {
                        navigator.clipboard
                          .writeText(codeStr)
                          .then((r) => {
                            console.log('Copied');
                            Notification.success({
                              position: 'topRight',
                              title: localeData.SUCCESS,
                              content: localeData.SUCCESS_MESSAGE,
                              duration: 3,
                            });
                          })
                          .catch((e) => {
                            Notification.error({
                              position: 'topRight',
                              title: localeData.ERROR,
                              content: localeData.ERROR_MESSAGE,
                              duration: 3,
                            });
                          });
                      }}
                    >
                      {localeData.COPY_TO_CLIPBOARD}
                    </Button>
                  </div>
                }
              />
            </Steps>
          </div>

          <div className={'mt-20 p-6'}>
            <h1 className={'text-3xl font-bold mb-3'}>
              {localeData?.VIDEO_TUTORIAL_TITLE}
            </h1>
            <h1 className={'mb-3'}>{localeData?.VIDEO_TUTORIAL_DESCRIPTION}</h1>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/MELZu08Gzfw?si=46TTH44UdnOceDqj&amp;start=402"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </Space>
      )}
    </LocaleConsumer>
  );
}

export default SettingsPage;
