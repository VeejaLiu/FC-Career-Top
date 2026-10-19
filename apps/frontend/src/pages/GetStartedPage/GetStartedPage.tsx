import { careerUiCopy } from '../CareerPage/ui-copy';
import type { Career } from '../../service/CareerApis';
import { careerCopy } from '../CareerPage/copy';
import { activeCareer } from '../../service/CareerApis';
import { SyncStatus } from '../CareerPage/SyncStatus';
import { useEffect, useState } from 'react';
import {
  Button,
  CodeHighlight,
  LocaleConsumer,
  Notification,
  Spin,
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
  const ui = careerUiCopy(),
    t = careerCopy();
  const [liveCareer, setLiveCareer] = useState<Career>();
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
        const [key, version, career] = await Promise.all([
          UserApis.getSecretKey(),
          getDefaultGameVersion(),
          activeCareer(),
        ]);
        if (!key || !isGameVersion(version)) {
          throw new Error('Script configuration unavailable');
        }
        if (cancelled) return;
        setCode(createLuaScript(version, key, postPlayerURL, career.id));
        setGameVersion(version);
        setLiveCareer(career);
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
          <header className="get-started-heading">
            <h1>{t.setup}</h1>
            <p>{ui.pc}</p>
          </header>
          <div className="get-started-layout">
            <ol className="get-started-instructions">
              <li className="setup-step">
                <span className="setup-number" aria-hidden="true">
                  1
                </span>
                <div className="setup-step-body">
                  <h2>{ui.open}</h2>
                  <p>{ui.openHint}</p>
                  <div className="get-started-downloads">
                    {GAME_VERSIONS.filter(
                      (version) => !gameVersion || version === gameVersion,
                    ).map((version) => (
                      <a
                        key={version}
                        href={`https://github.com/xAranaktu/FC-${version}-Live-Editor`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        FC {version} Live Editor{' '}
                        <IconExternalOpen size="small" />
                      </a>
                    ))}
                  </div>
                </div>
              </li>
              <li className={`setup-step ${copied ? 'is-complete' : ''}`}>
                <span className="setup-number" aria-hidden="true">
                  {copied ? '✓' : '2'}
                </span>
                <div className="setup-step-body">
                  <h2>{ui.run}</h2>
                  <p>{ui.runHint}</p>
                  <div className="get-started-code-toolbar">
                    <span>
                      {gameVersion ? `FC ${gameVersion}` : 'FC'} ·{' '}
                      {liveCareer?.name || 'Lua'}
                    </span>
                    <Button
                      icon={<IconCopy />}
                      theme="solid"
                      disabled={status !== 'ready'}
                      onClick={() => void copyScript(locale)}
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
                      <details>
                        <summary>{t.viewScript}</summary>
                        <CodeHighlight
                          code={code}
                          language="lua"
                          defaultTheme
                          lineNumber={false}
                        />
                      </details>
                    ) : (
                      <div className="get-started-code-state" role="status">
                        {status === 'loading' ? (
                          <>
                            <Spin size="small" />
                            {locale.SCRIPT_LOADING}
                          </>
                        ) : (
                          <>
                            {locale.SCRIPT_ERROR_HELP}
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
                  <small className="setup-private">{ui.private}</small>
                </div>
              </li>
              <li
                className={`setup-step ${liveCareer?.last_upload ? 'is-complete' : ''}`}
              >
                <span className="setup-number" aria-hidden="true">
                  {liveCareer?.last_upload ? '✓' : '3'}
                </span>
                <div className="setup-step-body">
                  <h2>{ui.received}</h2>
                  <p>{ui.receivedHint}</p>
                  <SyncStatus onUpdate={setLiveCareer} />
                </div>
              </li>
            </ol>
            <aside className="get-started-sidebar">
              <details className="get-started-tutorial">
                <summary>{locale.VIDEO_TUTORIAL_TITLE}</summary>
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
              </details>
              <p className="setup-reconnect">{ui.reconnect}</p>
              <details className="get-started-details">
                <summary>{ui.details}</summary>
                <p>{t.setupHelp}</p>
                <p>{locale.DIAGNOSTICS_NOTICE}</p>
              </details>
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
