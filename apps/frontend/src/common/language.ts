const supportedLanguages = ['en', 'zh', 'fr', 'de', 'ja'];
export const LANGUAGE_LOCAL_STORAGE_KEY = 'fcd-ui-default-language';

export function normalizeLanguage(language: string | null | undefined): string {
  const code = language?.trim().toLowerCase().split(/[-_]/)[0];
  return code && supportedLanguages.includes(code) ? code : 'en';
}
