import type { Skin } from '@/types';

export const skins: Skin[] = [
  {
    id: 'skin-default',
    name: '经典书卷',
    description: '古朴典雅的经典主题',
    theme: {
      primaryColor: '#c53d43',
      secondaryColor: '#2c5282',
      accentColor: '#d69e2e',
      backgroundColor: '#faf5ee',
    },
    rarity: 'common',
  },
  {
    id: 'skin-beginner',
    name: '初入学堂',
    description: '清新淡雅的初学者主题',
    theme: {
      primaryColor: '#38a169',
      secondaryColor: '#2d3748',
      accentColor: '#ed8936',
      backgroundColor: '#f7fafc',
    },
    rarity: 'common',
  },
  {
    id: 'skin-tang-gold',
    name: '盛唐金辉',
    description: '金碧辉煌的盛唐风格',
    theme: {
      primaryColor: '#d69e2e',
      secondaryColor: '#c53d43',
      accentColor: '#805ad5',
      backgroundColor: '#fefcbf',
    },
    rarity: 'epic',
  },
  {
    id: 'skin-song-ink',
    name: '宋韵水墨',
    description: '淡雅水墨的宋代风韵',
    theme: {
      primaryColor: '#2d3748',
      secondaryColor: '#4a5568',
      accentColor: '#718096',
      backgroundColor: '#edf2f7',
    },
    rarity: 'epic',
  },
  {
    id: 'skin-scholar',
    name: '文人雅士',
    description: '温文尔雅的学者主题',
    theme: {
      primaryColor: '#2c5282',
      secondaryColor: '#2b6cb0',
      accentColor: '#3182ce',
      backgroundColor: '#ebf8ff',
    },
    rarity: 'rare',
  },
  {
    id: 'skin-master',
    name: '鸿儒巨匠',
    description: '深沉厚重的大师主题',
    theme: {
      primaryColor: '#742a2a',
      secondaryColor: '#744210',
      accentColor: '#5a67d8',
      backgroundColor: '#fffaf0',
    },
    rarity: 'epic',
  },
  {
    id: 'skin-poet',
    name: '诗仙风骨',
    description: '飘逸洒脱的诗人主题',
    theme: {
      primaryColor: '#6b46c1',
      secondaryColor: '#805ad5',
      accentColor: '#9f7aea',
      backgroundColor: '#faf5ff',
    },
    rarity: 'rare',
  },
  {
    id: 'skin-champion',
    name: '竞技王者',
    description: '热血澎湃的冠军主题',
    theme: {
      primaryColor: '#e53e3e',
      secondaryColor: '#dd6b20',
      accentColor: '#d69e2e',
      backgroundColor: '#fff5f5',
    },
    rarity: 'epic',
  },
  {
    id: 'skin-legendary',
    name: '传说典藏',
    description: '稀世珍藏的传说主题',
    theme: {
      primaryColor: '#805ad5',
      secondaryColor: '#d53f8c',
      accentColor: '#dd6b20',
      backgroundColor: '#faf5ff',
    },
    rarity: 'legendary',
  },
];

export const getSkinById = (id: string): Skin | undefined => {
  return skins.find(s => s.id === id);
};
