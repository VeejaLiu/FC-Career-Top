import english from '../assets/image/language/english.png';
import chinese from '../assets/image/language/chinese.png';
import french from '../assets/image/language/france.png';
import german from '../assets/image/language/german.png';
import japanese from '../assets/image/language/japanese.png';

export const languageOptions = [
  { key: 'en', label: 'English(US)', icon: english },
  { key: 'zh', label: '简体中文', icon: chinese },
  { key: 'fr', label: 'Français', icon: french },
  { key: 'de', label: 'Deutsch', icon: german },
  { key: 'ja', label: '日本語', icon: japanese },
] as const;
