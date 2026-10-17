import {
  LANGUAGE_LOCAL_STORAGE_KEY,
  normalizeLanguage,
} from '../../common/language';

const copies = {
  en: {
    existingEmail:
      'This email already has an account. Sign in with its original method, then connect Google in Settings.',
    or: 'or',
    loading: 'Loading Google sign-in…',
    unavailable: 'Google sign-in is unavailable. Please try again.',
    retry: 'Try again',
    failure: 'Sign-in failed. Please try again.',
    googleOnly: 'You sign in with Google. No password is required.',
    privacy: 'Privacy',
    terms: 'Terms',
  },
  zh: {
    existingEmail:
      '此邮箱已有账号，请先使用原方式登录，再到设置中连接 Google。',
    or: '或',
    loading: '正在加载 Google 登录…',
    unavailable: 'Google 登录暂时不可用，请重试。',
    retry: '重试',
    failure: '登录失败，请重试。',
    googleOnly: '您使用 Google 登录，无需密码。',
    privacy: '隐私政策',
    terms: '服务条款',
  },
  fr: {
    existingEmail:
      'Ce compte existe déjà. Connectez-vous avec la méthode habituelle, puis associez Google dans les paramètres.',
    or: 'ou',
    loading: 'Chargement de la connexion Google…',
    unavailable: 'La connexion Google est indisponible. Réessayez.',
    retry: 'Réessayer',
    failure: 'Échec de la connexion. Réessayez.',
    googleOnly: 'Vous vous connectez avec Google. Aucun mot de passe requis.',
    privacy: 'Confidentialité',
    terms: 'Conditions',
  },
  de: {
    existingEmail:
      'Dieses Konto besteht bereits. Melde dich wie bisher an und verbinde Google in den Einstellungen.',
    or: 'oder',
    loading: 'Google-Anmeldung wird geladen…',
    unavailable:
      'Google-Anmeldung ist nicht verfügbar. Bitte erneut versuchen.',
    retry: 'Erneut versuchen',
    failure: 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.',
    googleOnly: 'Du meldest dich mit Google an. Kein Passwort erforderlich.',
    privacy: 'Datenschutz',
    terms: 'Bedingungen',
  },
  ja: {
    existingEmail:
      'このメールアドレスには既存のアカウントがあります。従来の方法でログインし、設定で Google と連携してください。',
    or: 'または',
    loading: 'Google ログインを読み込み中…',
    unavailable: 'Google ログインを利用できません。再試行してください。',
    retry: '再試行',
    failure: 'ログインに失敗しました。再試行してください。',
    googleOnly: 'Google でログインしています。パスワードは不要です。',
    privacy: 'プライバシー',
    terms: '利用規約',
  },
};
export function googleCopy() {
  return copies[
    normalizeLanguage(
      localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY),
    ) as keyof typeof copies
  ];
}
