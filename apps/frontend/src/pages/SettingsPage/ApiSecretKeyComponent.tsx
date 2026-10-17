import {
  IconCopy,
  IconEyeClosed,
  IconEyeOpened,
  IconRefresh2,
} from '@douyinfe/semi-icons';
import { Modal, Notification } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { UserApis } from '../../service/UserApis';

export default function ApiSecretKeyComponent({
  localeData: copy,
}: {
  localeData: any;
}) {
  const [secretKey, setSecretKey] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(false);
  async function load() {
    setLoading(true);
    setSecretKey(await UserApis.getSecretKey());
    setLoading(false);
  }
  useEffect(() => {
    void load();
  }, []);
  async function refresh() {
    if (loading) return;
    setLoading(true);
    const key = await UserApis.doRefreshSecretKey();
    if (key) {
      setSecretKey(key);
      setRevealed(false);
      setConfirm(false);
      Notification.success({ title: copy.KeyRefreshSuccess, duration: 3 });
    } else Notification.error({ title: copy.SaveFailed, duration: 3 });
    setLoading(false);
  }
  async function copyKey() {
    try {
      await navigator.clipboard.writeText(secretKey);
      Notification.success({ title: copy.CopySuccessMessage, duration: 3 });
    } catch {
      Notification.error({ title: copy.FailedToCopyMessage, duration: 3 });
    }
  }
  return (
    <section className="settings-section" aria-labelledby="upload-key-heading">
      <div className="settings-section-heading">
        <h2 id="upload-key-heading">{copy.APISecretKey}</h2>
        <p>{copy.KeyDescription}</p>
      </div>
      <div className="settings-key-row">
        <code className="settings-key-display" aria-label={copy.APISecretKey}>
          {loading
            ? copy.Loading
            : revealed
              ? secretKey
              : '••••••••••••••••••••••••'}
        </code>
        <button
          className="settings-button settings-key-reveal"
          disabled={loading || !secretKey}
          aria-label={revealed ? copy.HideKey : copy.ShowKey}
          aria-pressed={revealed}
          onClick={() => setRevealed((value) => !value)}
        >
          {revealed ? <IconEyeClosed /> : <IconEyeOpened />}
        </button>
        <button
          className="settings-button"
          disabled={loading || !secretKey}
          onClick={() => void copyKey()}
        >
          <IconCopy />
          <span>{copy.Copy}</span>
        </button>
        <button
          className="settings-button"
          disabled={loading || !secretKey}
          onClick={() => setConfirm(true)}
        >
          <IconRefresh2 />
          <span>{copy.RegenerateKey}</span>
        </button>
      </div>
      {!loading && !secretKey && (
        <div className="settings-load-error" role="alert">
          {copy.LoadFailed}
          <button className="settings-button" onClick={() => void load()}>
            {copy.Retry}
          </button>
        </div>
      )}
      <p className="settings-key-note">{copy.KeyPrivateNote}</p>
      <Modal
        title={copy.RegenerateKey}
        visible={confirm}
        onCancel={() => {
          if (!loading) setConfirm(false);
        }}
        maskClosable={!loading}
        closable={!loading}
        centered
        contentClassName="fct-dialog"
        style={{ maxWidth: 'calc(100vw - 32px)' }}
        width={440}
        footer={
          <div className="settings-dialog-actions">
            <button
              className="settings-button"
              disabled={loading}
              onClick={() => setConfirm(false)}
            >
              {copy.Cancel}
            </button>
            <button
              className="settings-button settings-button-primary"
              disabled={loading}
              onClick={() => void refresh()}
            >
              {loading ? copy.Loading : copy.RegenerateKey}
            </button>
          </div>
        }
      >
        <p>{copy.KeyRegenerateNotice}</p>
      </Modal>
    </section>
  );
}
