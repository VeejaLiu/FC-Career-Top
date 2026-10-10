import { useEffect, useState } from 'react';
import {
  Banner,
  Button,
  CodeHighlight,
  LocaleConsumer,
  Notification,
  Spin,
  Steps,
} from '@douyinfe/semi-ui';
import { IconCopy, IconRefresh, IconExternalOpen } from '@douyinfe/semi-icons';
import { UserApis } from '../../service/UserApis.ts';
import { createLuaScript } from '../../constant/user-script.ts';
import { GAME_VERSIONS, isGameVersion } from '../../constant/game-versions';
import { getDefaultGameVersion } from '../../common/common.ts';
import './GetStartedPage.css';

const postPlayerURL =
  import.meta.env.VITE_POST_PLAYER_URL || 'http://localhost:8888';

export default function GetStartedPage() {
  const [code, setCode] = useState('');
  const [gameVersion, setGameVersion] = useState<number | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const [retryCount, setRetryCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setCode('');
    setCopied(false);

    async function loadScript() {
      try {
        const [key, version] = await Promise.all([
          UserApis.getSecretKey(),
          getDefaultGameVersion(),
        ]);
        if (!key || !isGameVersion(version)) {
          throw new Error('Script configuration unavailable');
        }
        if (cancelled) return;
        setCode(createLuaScript(version, key, postPlayerURL));
        setGameVersion(version);
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    void loadScript();
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  async function copyScript(locale: any) {
    if (status !== 'ready') return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      Notification.success({
        position: 'topRight',
        title: locale.SUCCESS,
        content: locale.SUCCESS_MESSAGE,
        duration: 3,
      });
    } catch {
      Notification.error({
        position: 'topRight',
        title: locale.ERROR,
        content: locale.ERROR_MESSAGE,
        duration: 3,
      });
    }
  }

  return (
    <LocaleConsumer componentName="GetStartedPage">
      {(locale: any) => (
        <div className="get-started-page">
          <h1>{locale.Title}</h1>
          <div className="get-started-layout">
            <section className="get-started-instructions">
              <Steps direction="vertical" type="basic" current={-1}>
                <Steps.Step
                  title={locale.STEP_1.Title.replace(/^\d+\.\s*/, '')}
                  description={
                    <div className="get-started-downloads">
                      <span>{locale.STEP_1.DownloadLink}</span>
                      {GAME_VERSIONS.map((version) => (
                        <a
                          key={version}
                          href={`https://github.com/xAranaktu/FC-${version}-Live-Editor`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          FC {version} Live Editor
                        </a>
                      ))}
                    </div>
                  }
                />
                <Steps.Step
                  title={locale.STEP_2.Title.replace(/^\d+\.\s*/, '')}
                  description={locale.STEP_2.Description}
                />
                <Steps.Step
                  title={locale.STEP_3.Title.replace(/^\d+\.\s*/, '')}
                  description={locale.STEP_3.Description}
                />
                <Steps.Step
                  title={locale.STEP_4.Title.replace(/^\d+\.\s*/, '')}
                  description={
                    <div className="get-started-script">
                      <p>{locale.STEP_4.Description}</p>
                      <Banner
                        type="warning"
                        closeIcon={null}
                        description={locale.CODE_NOT_SHARE_WARNING}
                      />
                      <div className="get-started-code-toolbar">
                        <span>
                          {status === 'ready'
                            ? `FC ${gameVersion} · Lua`
                            : 'Lua'}
                        </span>
                        <Button
                          icon={<IconCopy />}
                          theme="solid"
                          disabled={status !== 'ready'}
                          onClick={() => {
                            void copyScript(locale);
                          }}
                        >
                          {copied
                            ? locale.SUCCESS_MESSAGE
                            : locale.COPY_TO_CLIPBOARD}
                        </Button>
                      </div>
                      <div
                        className="get-started-code"
                        aria-busy={status === 'loading'}
                      >
                        {status === 'ready' ? (
                          <CodeHighlight
                            code={code}
                            language="lua"
                            defaultTheme
                            lineNumber={false}
                          />
                        ) : (
                          <div className="get-started-code-state" role="status">
                            {status === 'loading' ? (
                              <>
                                <Spin size="small" />
                                {locale.SCRIPT_LOADING}
                              </>
                            ) : (
                              <>
                                <span>{locale.SCRIPT_ERROR_HELP}</span>
                                <Button
                                  theme="borderless"
                                  icon={<IconRefresh />}
                                  onClick={() =>
                                    setRetryCount((count) => count + 1)
                                  }
                                >
                                  {locale.RETRY}
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  }
                />
              </Steps>
            </section>
            <aside className="get-started-sidebar">
              <section
                className="get-started-tutorial"
                aria-labelledby="get-started-video-title"
              >
                <h2 id="get-started-video-title">
                  {locale.VIDEO_TUTORIAL_TITLE}
                </h2>
                <div className="get-started-video">
                  <iframe
                    src="https://www.youtube.com/embed/MELZu08Gzfw?start=402"
                    title={locale.VIDEO_TUTORIAL_TITLE}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </section>
              <div className="get-started-help">
                <span>{locale.NEED_HELP}</span>
                <a
                  href="https://discord.gg/aKfWAtbJ8F"
                  target="_blank"
                  rel="noreferrer"
                >
                  {locale.JOIN_DISCORD}
                  <IconExternalOpen size="small" />
                </a>
              </div>
            </aside>
          </div>
        </div>
      )}
    </LocaleConsumer>
  );
}
