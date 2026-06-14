import type { BGM } from '@/types';

export const bgms: BGM[] = [
  {
    id: 'bgm-default',
    name: '古韵悠扬',
    description: '经典古风背景音乐',
    style: '古典',
    duration: 180,
    rarity: 'common',
  },
  {
    id: 'bgm-spring-morning',
    name: '春晓晨曲',
    description: '清新明快的春日旋律',
    style: '清新',
    duration: 200,
    rarity: 'common',
  },
  {
    id: 'bgm-han-dynasty',
    name: '汉宫秋月',
    description: '庄严肃穆的汉代古乐',
    style: '庄重',
    duration: 240,
    rarity: 'rare',
  },
  {
    id: 'bgm-racing',
    name: '疾风劲草',
    description: '紧张刺激的竞速音乐',
    style: '激昂',
    duration: 150,
    rarity: 'rare',
  },
  {
    id: 'bgm-tang-flourish',
    name: '盛世华章',
    description: '辉煌大气的盛唐乐章',
    style: '辉煌',
    duration: 300,
    rarity: 'epic',
  },
  {
    id: 'bgm-song-elegant',
    name: '宋词雅韵',
    description: '婉约细腻的宋代曲调',
    style: '婉约',
    duration: 220,
    rarity: 'epic',
  },
];

export const getBgmById = (id: string): BGM | undefined => {
  return bgms.find(b => b.id === id);
};
