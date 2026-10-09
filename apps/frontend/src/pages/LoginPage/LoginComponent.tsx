import {
  Button,
  Form,
  LocaleConsumer,
  Notification,
  Space,
} from '@douyinfe/semi-ui';
import { UserApis } from '../../service/UserApis.ts';
import { setToken } from '../../common/common.ts';
import styles from './LoginOrRegisterPage.module.scss';
import { useState } from 'react';
import logo from '../../assets/image/logo.svg';

export const LoginComponent = ({ setIsLogin }: { setIsLogin: any }) => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  async function doLogin() {
    const response = await UserApis.loginUser({
      username: loginUsername,
      password: loginPassword,
    });
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
      console.log(`[doLogin] data: ${JSON.stringify(data)}`);
      setToken(token);
      Notification.success({
        position: 'top',
        title: 'Success',
        content: 'Welcome back, ' + username + '!',
        duration: 3,
      });

      // Navigate({ to: '/players' });
      window.location.href = '/players';
    } else {
      // console.log(`[doLogin] message: ${message}`);
      Notification.error({
        position: 'top',
        title: 'Error',
        content: message,
        duration: 3,
      });
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
            <Form className={styles.inputs}>
              <Form.Input
                label={{ text: localeData.usernameEmail }}
                field="email"
                placeholder={localeData.usernameEmailPlaceholder}
                fieldStyle={{ alignSelf: 'stretch', padding: 0 }}
                onChange={(e) => setLoginUsername(e)}
              />
              <Form.Input
                mode={'password'}
                label={{ text: localeData.password }}
                field="password"
                placeholder={localeData.passwordPlaceholder}
                fieldStyle={{ alignSelf: 'stretch', padding: 0 }}
                onChange={(e) => setLoginPassword(e)}
              />
            </Form>
            <Button theme="solid" className={styles.button} onClick={doLogin}>
              {localeData.login}
            </Button>
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
