import {
  Button,
  Form,
  LocaleConsumer,
  Notification,
  Space,
  Tooltip,
} from '@douyinfe/semi-ui';
import { UserApis } from '../../service/UserApis.ts';
import { useState } from 'react';
import styles from './LoginOrRegisterPage.module.scss';
import logo from '../../assets/image/logo.svg';
import { IconHelpCircleStroked } from '@douyinfe/semi-icons';

export const RegisterComponent = ({ setIsLogin }: { setIsLogin: any }) => {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState(' ');

  async function doRegister(localeData: any) {
    // Check if username is valid
    const validPattern = /^[a-zA-Z][a-zA-Z0-9_.]{5,19}$/;
    if (!validPattern.test(registerUsername)) {
      setErrorMessage(localeData.invalidUsername);
      return;
    }

    // Check if email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(registerEmail)) {
      setErrorMessage(localeData.invalidEmail);
      return;
    }

    // Check if password and confirm password match
    if (registerPassword !== registerPasswordConfirm) {
      setErrorMessage(localeData.passwordNotMatch);
      return;
    }

    // Check if password meets criteria
    const hasUpperCase = /[A-Z]/.test(registerPassword);
    const hasLowerCase = /[a-z]/.test(registerPassword);
    const hasNumber = /\d/.test(registerPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(registerPassword);
    const lengthValid = registerPassword.length >= 6;
    const criteriaMet =
      [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean)
        .length >= 3;
    if (!lengthValid || !criteriaMet) {
      setErrorMessage(localeData.passwordError);
      return;
    }

    const response = await UserApis.registerUser({
      username: registerUsername,
      email: registerEmail,
      password: registerPassword,
      confirmPassword: registerPasswordConfirm,
    });
    if (response.success) {
      Notification.success({
        position: 'top',
        title: 'Welcome!!!',
        content: localeData.registerSuccess,
        duration: 3,
      });
      // 3 seconds later, redirect to login page
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsLogin(true);
    } else {
      Notification.error({
        position: 'top',
        title: 'Error',
        content: response.message,
        duration: 10,
      });
    }
  }

  return (
    <LocaleConsumer componentName={'RegisterComponent'}>
      {(localeData: any, localeCode: string, dateFnsLocale: any) => (
        <Space vertical className={styles.loginOrRegister}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <img width={100} height={100} src={logo} alt={'FCT logo'} />
            </div>
            <div className={styles.titles}>
              <div className={styles.title}>{localeData.title}</div>
              <div className={styles.subtitle}>{localeData.text}</div>
            </div>
          </div>
          <div className={styles.form}>
            <Form className={styles.inputs}>
              <Form.Input
                label={{ text: localeData.username }}
                field="username"
                placeholder={localeData.usernamePlaceholder}
                fieldStyle={{ alignSelf: 'stretch', padding: 0 }}
                onChange={(e) => setRegisterUsername(e)}
                onBlur={() => {
                  const validPattern = /^[a-zA-Z][a-zA-Z0-9_.]{5,19}$/;
                  if (!validPattern.test(registerUsername)) {
                    setErrorMessage(localeData.invalidUsername);
                  } else {
                    setErrorMessage(' ');
                  }
                }}
              />
              <Form.Input
                label={
                  <div className={'flex items-center'}>
                    <span className={'mr-1'}>{localeData.email}</span>
                    <Tooltip content={localeData.emailTooltip}>
                      <IconHelpCircleStroked />
                    </Tooltip>
                  </div>
                }
                field="register.email"
                placeholder={localeData.emailPlaceholder}
                fieldStyle={{ alignSelf: 'stretch', padding: 0 }}
                onChange={(e) => setRegisterEmail(e)}
                onBlur={() => {
                  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailPattern.test(registerEmail)) {
                    setErrorMessage(localeData.invalidEmail);
                  } else {
                    setErrorMessage(' ');
                  }
                }}
              />

              <Form.Input
                mode={'password'}
                label={
                  <div className={'flex items-center'}>
                    <span className={'mr-1'}>{localeData.password}</span>
                    <Tooltip content={localeData.passwordTooltip}>
                      <IconHelpCircleStroked />
                    </Tooltip>
                  </div>
                }
                field="password"
                placeholder={localeData.passwordPlaceholder}
                fieldStyle={{ alignSelf: 'stretch', padding: 0 }}
                onChange={(e) => setRegisterPassword(e)}
                // 失去焦点时，校验密码是否符合规则
                onBlur={() => {
                  const hasUpperCase = /[A-Z]/.test(registerPassword);
                  const hasLowerCase = /[a-z]/.test(registerPassword);
                  const hasNumber = /\d/.test(registerPassword);
                  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(
                    registerPassword,
                  );
                  const lengthValid = registerPassword.length >= 6;

                  const criteriaMet =
                    [
                      hasUpperCase,
                      hasLowerCase,
                      hasNumber,
                      hasSpecialChar,
                    ].filter(Boolean).length >= 3;

                  if (!lengthValid || !criteriaMet) {
                    setErrorMessage(localeData.passwordError);
                  } else {
                    setErrorMessage(' ');
                  }
                }}
              />
              <Form.Input
                mode={'password'}
                label={{ text: localeData.confirmPassword }}
                field="password-confirm"
                placeholder={localeData.confirmPasswordPlaceholder}
                fieldStyle={{ alignSelf: 'stretch', padding: 0 }}
                onChange={(e) => setRegisterPasswordConfirm(e)}
                onBlur={() => {
                  if (registerPassword !== registerPasswordConfirm) {
                    setErrorMessage(localeData.passwordMismatch);
                  } else {
                    setErrorMessage(' ');
                  }
                }}
              />
            </Form>
            <div className={styles.errorMessage}>
              <p>{errorMessage}</p>
            </div>
            <Button
              theme="solid"
              className={styles.button}
              onClick={(e) => {
                doRegister(localeData);
              }}
            >
              {localeData.register}
            </Button>
            <Button
              theme={'outline'}
              className={styles.button}
              onClick={() => {
                setIsLogin(true);
              }}
            >
              {localeData.loginPrompt}
            </Button>
          </div>
        </Space>
      )}
    </LocaleConsumer>
  );
};
