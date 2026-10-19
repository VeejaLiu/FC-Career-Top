import { lazy, Suspense, useEffect, useState } from 'react';
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
import {
  LANGUAGE_LOCAL_STORAGE_KEY,
  normalizeLanguage,
} from '../common/language.ts';

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

const CareerPage = lazy(() => import('../pages/CareerPage/CareerPage'));

export const Auth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [locale, setLocale] = useState(SUPPORTED_LANGUAGES.zh_CN);

  const getDefaultLanguage = () => {
    let defaultLanguage: any = 'en_GB';

    // Get from local storage first
    defaultLanguage = localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY);
    if (defaultLanguage) {
      return normalizeLanguage(defaultLanguage);
    }

    // Get the browser language
    const languages = navigator.languages
      ? navigator.languages
      : [navigator.language];

    for (let i = 0; i < languages.length; i++) {
      const language = languages[i].replace('-', '_');
      if (language in SUPPORTED_LANGUAGES) {
        // save the language into local storage
        defaultLanguage = language;
        localStorage.setItem(LANGUAGE_LOCAL_STORAGE_KEY, defaultLanguage);
        break;
      }
    }

    return normalizeLanguage(defaultLanguage);
  };

  const getLoginStatus = async () => {
    const result = await UserApis.verifyToken();
    setIsAuthenticated(result);
    setIsLoading(false);
  };

  useEffect(() => {
    const browserLanguage = getDefaultLanguage();
    if (browserLanguage in SUPPORTED_LANGUAGES) {
      setLocale(SUPPORTED_LANGUAGES[browserLanguage]);
    }
    document.documentElement.lang = browserLanguage.replace('_', '-');
    const syncLanguage = (event: StorageEvent) => {
      if (event.key !== LANGUAGE_LOCAL_STORAGE_KEY) return;
      const next = normalizeLanguage(event.newValue || navigator.language);
      setLocale(SUPPORTED_LANGUAGES[next] || SUPPORTED_LANGUAGES.en);
      document.documentElement.lang = next.replace('_', '-');
    };
    window.addEventListener('storage', syncLanguage);

    if (window.location.pathname === '/demo') setIsLoading(false);
    else getLoginStatus().then();
    return () => window.removeEventListener('storage', syncLanguage);
  }, []);

  return (
    <LocaleProvider locale={locale}>
      {window.location.pathname === '/demo' ? (
        <Suspense fallback={<Spin size="large" />}>
          <CareerPage demo />
        </Suspense>
      ) : isLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            minHeight: '100dvh',
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
