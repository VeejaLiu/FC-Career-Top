import { GoogleLoginComponent } from './GoogleLoginComponent';
import {
  Button,
  Form,
  LocaleConsumer,
  Notification,
  Space,
} from '@douyinfe/semi-ui';
import { UserApis } from '../../service/UserApis.ts';
import { setToken } from '../../common/common.ts';
import { loginDestination } from '../../common/login-destination';
import styles from './LoginOrRegisterPage.module.scss';
import { useState } from 'react';
import logo from '../../assets/image/logo.svg';

export const LoginComponent = ({ setIsLogin }: { setIsLogin: any }) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [formError, setFormError] = useState('');

  async function doLogin(copy: any) {
    if (submitting) return;
    const element = document.getElementById(
      'sign-in-form',
    ) as HTMLFormElement | null;
    const fields = element ? new FormData(element) : null;
    const email = String(fields?.get('email') ?? loginEmail).trim();
    const password = String(fields?.get('password') ?? loginPassword);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) {
      setFormError(
        !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? copy.invalidEmail
          : copy.passwordRequired,
      );
      element
        ?.querySelector<HTMLInputElement>(
          !email ? 'input[name="email"]' : 'input[name="password"]',
        )
        ?.focus();
      return;
    }
    setFormError('');
    setSubmitting(true);
    const response = await UserApis.loginUser({
      email,
      password,
    });
    setSubmitting(false);
    const { success, message, data } = response;
    if (success) {
      // {
      //   "success":true,
      //   "message":"success",
      //   "data": {
      //     "id":1,
      //     "username":"sss",
      //     "email":"ssss@gmail.com",
      //     "token":"......",
      //   }
      // }
      const { username, token } = data;
      setToken(token);
      Notification.success({
        position: 'top',
        title: copy.loginSuccessTitle,
        content: copy.loggedInMessage.replace('{username}', username),
        duration: 3,
      });

      window.location.assign(loginDestination());
    } else {
      setFormError(
        message === 'Email or password not matched'
          ? /^fc[dt]-[a-f0-9-]{32,64}$/i.test(password)
            ? copy.uploadKeyAsPassword
            : copy.invalidCredentials
          : copy.loginFailed,
      );
    }
  }

  return (
    <LocaleConsumer componentName={'LoginComponent'}>
      {(localeData: any, localeCode: string, dateFnsLocale: any) => (
        <Space vertical className={styles.loginOrRegister}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.logo}>
              <img width={100} height={100} src={logo} alt={'FCT logo'} />
            </div>
            <div className={styles.titles}>
              <div className={styles.title}>{localeData.welcome}</div>
              <div className={styles.subtitle}>{'fccareer.top'}</div>
            </div>
          </div>

          {/* Form */}
          <div className={styles.form}>
            <Form
              id="sign-in-form"
              className={styles.inputs}
              method="post"
              onSubmit={() => void doLogin(localeData)}
            >
              <Form.Input
                label={{ text: localeData.usernameEmail }}
                field="email"
                type="email"
                name="email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                inputMode="email"
                placeholder={localeData.usernameEmailPlaceholder}
                fieldStyle={{ alignSelf: 'stretch', padding: 0 }}
                onChange={(e) => setLoginEmail(e)}
              />
              <Form.Input
                mode={'password'}
                label={{ text: localeData.password }}
                field="password"
                name="password"
                autoComplete="current-password"
                placeholder={localeData.passwordPlaceholder}
                fieldStyle={{ alignSelf: 'stretch', padding: 0 }}
                onChange={(e) => {
                  setLoginPassword(e);
                  setFormError('');
                }}
                onKeyDown={(event) =>
                  setCapsLock(event.getModifierState('CapsLock'))
                }
                onKeyUp={(event) =>
                  setCapsLock(event.getModifierState('CapsLock'))
                }
                onBlur={() => setCapsLock(false)}
              />
              {capsLock && (
                <p className="auth-form-hint" role="status">
                  {localeData.capsLockWarning}
                </p>
              )}
              {formError && (
                <p className="auth-form-error" role="alert">
                  {formError}
                </p>
              )}
              <Button
                theme="solid"
                className={styles.button}
                htmlType="submit"
                loading={submitting}
                disabled={submitting}
              >
                {localeData.login}
              </Button>
            </Form>
            <GoogleLoginComponent />
            <Button
              theme="outline"
              className={styles.button}
              onClick={() => {
                setIsLogin(false);
              }}
              size={'large'}
            >
              {localeData.registerPrompt}
            </Button>
          </div>
        </Space>
      )}
    </LocaleConsumer>
  );
};
