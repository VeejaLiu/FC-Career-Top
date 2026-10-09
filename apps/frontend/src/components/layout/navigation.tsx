import {
  IconArticle,
  IconHistogram,
  IconIdCard,
  IconUser,
} from '@douyinfe/semi-icons';

// Shared by every viewport; add navigation destinations here.
export const navigationItems = [
  { path: '/players', label: 'PlayersList', icon: <IconUser /> },
  { path: '/players-detail', label: 'PlayerDetail', icon: <IconIdCard /> },
  { path: '/players-trends', label: 'PlayersTrends', icon: <IconHistogram /> },
  { path: '/get-started', label: 'GetStarted', icon: <IconArticle /> },
] as const;
