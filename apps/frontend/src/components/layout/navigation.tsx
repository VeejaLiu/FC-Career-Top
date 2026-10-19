import { IconArticle, IconHistogram, IconUser } from '@douyinfe/semi-icons';
// Player details and trends live within Squad; existing deep links stay valid.
export const navigationItems = [
  { path: '/career', label: 'CareerHub', icon: <IconHistogram /> },
  { path: '/players', label: 'PlayersList', icon: <IconUser /> },
  { path: '/get-started', label: 'GetStarted', icon: <IconArticle /> },
] as const;
