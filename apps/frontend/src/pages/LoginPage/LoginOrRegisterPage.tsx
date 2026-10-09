import { LocaleConsumer, Select, Space } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { LoginComponent } from './LoginComponent.tsx';
import { RegisterComponent } from './RegisterComponent.tsx';
import { ContactUsComponent } from './ContactUsComponent.tsx';
import {
  LANGUAGE_LOCAL_STORAGE_KEY,
  normalizeLanguage,
} from '../../common/language.ts';
import { languageOptions } from '../../common/language-options';
import './LoginPage.css';

const LoginOrRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <LocaleConsumer componentName={'LoginComponent'}>
      {(localeData: any, localeCode: string, dateFnsLocale: any) => (
        <Space className="auth-page" vertical>
          <Select
            className={'mt-1'}
            placeholder=""
            defaultValue={normalizeLanguage(
              localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY),
            )}
            onChange={(value) => {
              if (typeof value === 'string') {
                localStorage.setItem(LANGUAGE_LOCAL_STORAGE_KEY, value);
                window.location.reload();
              }
            }}
          >
            {languageOptions.map((option) => (
              <Select.Option key={option.key} value={option.key}>
                <div className="flex items-center">
                  <img src={option.icon} alt="" width={20} />
                  <span className="ml-4">{option.label}</span>
                </div>
              </Select.Option>
            ))}
          </Select>

          {isLogin ? (
            <LoginComponent setIsLogin={setIsLogin} />
          ) : (
            <RegisterComponent setIsLogin={setIsLogin} />
          )}
          <ContactUsComponent />
          <div className="auth-tutorial">
            <h1 className="text-xl font-bold mb-1">
              {localeData.VideoTutorial}
            </h1>
            <iframe
              loading="lazy"
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
};

export default LoginOrRegisterPage;
