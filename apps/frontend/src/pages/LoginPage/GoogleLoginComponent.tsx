import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@douyinfe/semi-ui';
import axios from 'axios';
import { BACKEND_URL } from '../../constant';
import { getToken, setToken } from '../../common/common';
import { googleCopy } from './google-copy';
import './GoogleLogin.css';

type GoogleIdentity = {
  initialize: (options: {
    client_id: string;
    nonce: string;
    callback: (response: { credential: string }) => void;
    auto_select: boolean;
  }) => void;
  renderButton: (
    element: HTMLElement,
    options: {
      type: string;
      theme: string;
      size: string;
      text: string;
      width: number;
    },
  ) => void;
};
declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdentity } };
  }
}
let library: Promise<GoogleIdentity> | undefined;
function loadGoogle() {
  if (window.google?.accounts.id)
    return Promise.resolve(window.google.accounts.id);
  if (!library) {
    library = new Promise<GoogleIdentity>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      const timer = window.setTimeout(() => {
        script.remove();
        library = undefined;
        reject(new Error('Google load timeout'));
      }, 15000);
      script.onload = () => {
        window.clearTimeout(timer);
        if (window.google?.accounts.id) resolve(window.google.accounts.id);
        else {
          script.remove();
          library = undefined;
          reject(new Error('Google unavailable'));
        }
      };
      script.onerror = () => {
        window.clearTimeout(timer);
        script.remove();
        library = undefined;
        reject(new Error('Google load failed'));
      };
      document.head.appendChild(script);
    });
  }
  return library;
}

export function GoogleLoginComponent({
  linkAccount = false,
}: {
  linkAccount?: boolean;
}) {
  const copy = googleCopy();
  const button = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const signIn = useCallback(
    async function signIn(credential: string, nonce: string) {
      if (inFlight.current) return;
      inFlight.current = true;
      setBusy(true);
      setError('');
      try {
        const { data } = await axios.post(
          `${BACKEND_URL}/api/v1/user/google`,
          {
            credential,
            nonce,
          },
          linkAccount ? { headers: { token: getToken() || '' } } : undefined,
        );
        if (!data.success || !data.data?.token) throw new Error(copy.failure);
        setToken(data.data.token);
        if (linkAccount) window.location.reload();
        else window.location.assign('/players');
      } catch (error) {
        setError(
          axios.isAxiosError(error) &&
            error.response?.data?.code ===
              'GOOGLE_EXISTING_EMAIL_LOGIN_REQUIRED'
            ? copy.existingEmail
            : copy.failure,
        );
      } finally {
        inFlight.current = false;
        setBusy(false);
      }
    },
    [copy.failure, copy.existingEmail, linkAccount],
  );

  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    setLoading(true);
    setError('');
    if (button.current) button.current.replaceChildren();
    async function initialize() {
      try {
        const [{ data }, google] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/v1/user/google/challenge`),
          loadGoogle(),
        ]);
        if (cancelled || !button.current) return;
        if (!data.success) throw new Error('Not configured');
        google.initialize({
          client_id: data.data.clientId,
          nonce: data.data.nonce,
          auto_select: false,
          callback: ({ credential }) => {
            if (!cancelled) void signIn(credential, data.data.nonce);
          },
        });
        const element = button.current;
        let renderedWidth = 0;
        const render = () => {
          if (cancelled) return;
          const width = Math.max(120, Math.min(400, element.clientWidth));
          if (width === renderedWidth) return;
          renderedWidth = width;
          element.replaceChildren();
          google.renderButton(element, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            width,
          });
        };
        render();
        observer = new ResizeObserver(render);
        observer.observe(element);
        setLoading(false);
      } catch {
        if (!cancelled) {
          setLoading(false);
          setError(copy.unavailable);
        }
      }
    }
    void initialize();
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [attempt, copy.unavailable, signIn]);

  return (
    <div className="google-auth">
      {!linkAccount && (
        <div className="google-auth-divider">
          <span>{copy.or}</span>
        </div>
      )}
      <div
        ref={button}
        className={`google-auth-button${busy ? ' google-auth-busy' : ''}`}
      />
      {(loading || busy) && <p role="status">{copy.loading}</p>}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <Button onClick={() => setAttempt((n) => n + 1)}>{copy.retry}</Button>
        </div>
      )}
    </div>
  );
}

export function AuthPolicyLinks() {
  const copy = googleCopy();
  return (
    <div className="auth-policy-links">
      <a
        href="https://www.fccareer.top/privacy"
        target="_blank"
        rel="noopener noreferrer"
      >
        {copy.privacy}
      </a>
      <a
        href="https://www.fccareer.top/terms"
        target="_blank"
        rel="noopener noreferrer"
      >
        {copy.terms}
      </a>
    </div>
  );
}
