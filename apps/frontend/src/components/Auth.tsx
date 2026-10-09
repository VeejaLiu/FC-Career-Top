import { useEffect, useState } from 'react';
import App from '../App.tsx';
import { UserApis } from '../service/UserApis.ts';
import { LocaleProvider, Spin } from '@douyinfe/semi-ui';
import LoginOrRegisterPage from '../pages/LoginPage/LoginOrRegisterPage.tsx';

import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';
import fr from '@douyinfe/semi-ui/lib/es/locale/source/fr';
import de from '@douyinfe/semi-ui/lib/es/locale/source/de';
import ja_JP from '@douyinfe/semi-ui/lib/es/locale/source/ja_JP';

import custom_zh_CN from '../locales/zh_CN.ts';
import custom_en_GB from '../locales/en_GB.ts';
import custom_fr_FR from '../locales/fr_FR.ts';
import custom_de_DE from '../locales/de_DE.ts';
import custom_ja_JP from '../locales/ja_JP.ts';

export const LANGUAGE_LOCAL_STORAGE_KEY = 'fcd-ui-default-language';

// [
//     "zh-CN",
//     "en",
//     "en-GB",
//     "en-US",
//     "zh",
//     "fr",
//     "fr-FR",
//     "de",
//     "de-DE",
//     "ja",
//     "ja-JP",
//     "ja-JP",
// ]
const SUPPORTED_LANGUAGES: any = {
  // English
  en: { ...en_GB, ...custom_en_GB },
  en_GB: { ...en_GB, ...custom_en_GB },
  en_US: { ...en_GB, ...custom_en_GB },

  // Chinese
  zh: { ...zh_CN, ...custom_zh_CN },
  zh_CN: { ...zh_CN, ...custom_zh_CN },

  // French
  fr: { ...fr, ...custom_fr_FR },
  fr_FR: { ...fr, ...custom_fr_FR },
  // German
  de: { ...de, ...custom_de_DE },
  de_DE: { ...de, ...custom_de_DE },

  // Japanese
  ja: { ...ja_JP, ...custom_ja_JP },
  ja_JP: { ...ja_JP, ...custom_ja_JP },
};

export const Auth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [locale, setLocale] = useState(SUPPORTED_LANGUAGES.zh_CN);

  const getDefaultLanguage = () => {
    let defaultLanguage: any = 'en_GB';

    // Get from local storage first
    defaultLanguage = localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY);
    if (defaultLanguage) {
      console.log(`Get from local storage`, defaultLanguage);
      return defaultLanguage;
    }

    // Get the browser language
    const languages = navigator.languages
      ? navigator.languages
      : [navigator.language];

    console.log('languages', languages);
    console.log(`SUPPORTED_LANGUAGES`, SUPPORTED_LANGUAGES);
    for (let i = 0; i < languages.length; i++) {
      const language = languages[i].replace('-', '_');
      if (language in SUPPORTED_LANGUAGES) {
        // save the language into local storage
        defaultLanguage = language;
        localStorage.setItem(LANGUAGE_LOCAL_STORAGE_KEY, defaultLanguage);
        break;
      }
    }

    return defaultLanguage;
  };

  const getLoginStatus = async () => {
    const result = await UserApis.verifyToken();
    setIsAuthenticated(result);
    setIsLoading(false);
  };

  useEffect(() => {
    const browserLanguage = getDefaultLanguage();
    console.log('browserLanguage', browserLanguage);
    if (browserLanguage in SUPPORTED_LANGUAGES) {
      // console.log('setLocale', SUPPORTED_LANGUAGES[browserLanguage]);
      setLocale(SUPPORTED_LANGUAGES[browserLanguage]);
    }

    getLoginStatus().then();
  }, []);

  return (
    <LocaleProvider locale={locale}>
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100vh',
          }}
        >
          <Spin size="large" />
        </div>
      ) : isAuthenticated ? (
        <App />
      ) : (
        <LoginOrRegisterPage />
      )}
    </LocaleProvider>
  );
};
