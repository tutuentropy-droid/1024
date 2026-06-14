import type { Skin } from '@/types';

export const skins: Skin[] = [
  {
    id: 'skin-default',
    name: '经典古韵',
    description: '默认主题，典雅古朴的传统风格',
    theme: {
      primary: '#C41E3A',
      secondary: '#2B5C8A',
      accent: '#D4AF37',
      background: '#FAF8F5',
      cardBg: '#FFFFFF',
      text: '#2D3748',
    },
    rarity: 'common',
    unlocked: true,
  },
  {
    id: 'skin-tang-gold',
    name: '盛唐金辉',
    description: '盛唐气象，金碧辉煌的皇家风格',
    theme: {
      primary: '#D4AF37',
      secondary: '#8B0000',
      accent: '#FFD700',
      background: '#FFF8E7',
      cardBg: '#FFFEF0',
      text: '#5C4033',
    },
    rarity: 'epic',
    unlocked: false,
  },
  {
    id: 'skin-song-blue',
    name: '宋词雅韵',
    description: '宋代文人清雅风格，淡墨山水',
    theme: {
      primary: '#2B5C8A',
      secondary: '#6B95BC',
      accent: '#7BC49A',
      background: '#F0F7FF',
      cardBg: '#FFFFFF',
      text: '#1E3A5F',
    },
    rarity: 'epic',
    unlocked: false,
  },
  {
    id: 'skin-spring',
    name: '春意盎然',
    description: '春暖花开，生机勃勃的清新风格',
    theme: {
      primary: '#7BC49A',
      secondary: '#FFB6C1',
      accent: '#FFD700',
      background: '#F0FFF4',
      cardBg: '#FFFFFF',
      text: '#2D3748',
    },
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: 'skin-fire',
    name: '烈焰赤心',
    description: '热情似火，燃烧的学习激情',
    theme: {
      primary: '#FF4500',
      secondary: '#FF6347',
      accent: '#FFD700',
      background: '#FFF5F5',
      cardBg: '#FFFFFF',
      text: '#2D3748',
    },
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: 'skin-lightning',
    name: '雷霆万钧',
    description: '电光石火，竞速达人专属',
    theme: {
      primary: '#FFD700',
      secondary: '#1E90FF',
      accent: '#FF6347',
      background: '#F0F8FF',
      cardBg: '#FFFFFF',
      text: '#2D3748',
    },
    rarity: 'epic',
    unlocked: false,
  },
  {
    id: 'skin-royal',
    name: '至尊典藏',
    description: '学富五车的尊贵象征',
    theme: {
      primary: '#800080',
      secondary: '#FFD700',
      accent: '#C71585',
      background: '#FAF5FF',
      cardBg: '#FFFFFF',
      text: '#2D3748',
    },
    rarity: 'legendary',
    unlocked: false,
  },
  {
    id: 'skin-ink',
    name: '水墨丹青',
    description: '传统水墨画风格，意境深远',
    theme: {
      primary: '#2D3748',
      secondary: '#4A5568',
      accent: '#718096',
      background: '#F7FAFC',
      cardBg: '#FFFFFF',
      text: '#1A202C',
    },
    rarity: 'rare',
    unlocked: false,
  },
];

export const getAllSkins = (): Skin[] => {
  return skins;
};

export const getSkinById = (id: string): Skin | undefined => {
  return skins.find(s => s.id === id);
};

export default skins;
