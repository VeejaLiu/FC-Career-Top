import { LocaleConsumer, Select, Space } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { LoginComponent } from './LoginComponent.tsx';
import { RegisterComponent } from './RegisterComponent.tsx';
import { ContactUsComponent } from './ContactUsComponent.tsx';
import { LANGUAGE_LOCAL_STORAGE_KEY } from '../../components/Auth.tsx';

import icon_english from '../../assets/image/language/english.png';
import icon_chinese from '../../assets/image/language/chinese.png';
import icon_france from '../../assets/image/language/france.png';
import icon_german from '../../assets/image/language/german.png';
import icon_japanese from '../../assets/image/language/japanese.png';

const LoginOrRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <LocaleConsumer componentName={'LoginComponent'}>
      {(localeData: any, localeCode: string, dateFnsLocale: any) => (
        <Space
          style={{
            width: '100%',
            height: '100%',
          }}
          vertical
        >
          <Select
            className={'mt-1'}
            placeholder=""
            defaultValue={
              localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY) || 'en'
            }
            onChange={(value) => {
              if (typeof value === 'string') {
                localStorage.setItem(LANGUAGE_LOCAL_STORAGE_KEY, value);
                window.location.reload();
              }
            }}
          >
            <Select.Option value="en">
              <div className="flex items-center">
                <img src={icon_english} alt={'English'} width={20} />
                <span className="ml-4">English(US)</span>
              </div>
            </Select.Option>

            <Select.Option value="zh">
              <div className="flex items-center">
                <img src={icon_chinese} alt={'简体中文'} width={20} />
                <span className="ml-4">简体中文</span>
              </div>
            </Select.Option>

            <Select.Option value="fr">
              <div className="flex items-center">
                <img src={icon_france} alt={'Français'} width={20} />
                <span className="ml-4">Français</span>
              </div>
            </Select.Option>

            <Select.Option value="de">
              <div className="flex items-center">
                <img src={icon_german} alt={'Deutsch'} width={20} />
                <span className="ml-4">Deutsch</span>
              </div>
            </Select.Option>

            <Select.Option value="ja">
              <div className="flex items-center">
                <img src={icon_japanese} alt={'日本語'} width={20} />
                <span className="ml-4">日本語</span>
              </div>
            </Select.Option>
          </Select>

          {isLogin ? (
            <LoginComponent setIsLogin={setIsLogin} />
          ) : (
            <RegisterComponent setIsLogin={setIsLogin} />
          )}
          <ContactUsComponent />
          <div className="mt-20 items-center">
            <h1 className="text-xl font-bold mb-1">
              {localeData.VideoTutorial}
            </h1>
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
};

export default LoginOrRegisterPage;
