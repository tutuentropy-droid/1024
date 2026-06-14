import type { BackgroundMusic } from '@/types';

export const backgroundMusics: BackgroundMusic[] = [
  {
    id: 'music-default',
    name: '古韵悠扬',
    description: '经典古筝曲目，宁静致远',
    composer: '传统古曲',
    audioUrl: '/music/guzheng-classic.mp3',
    rarity: 'common',
    unlocked: true,
  },
  {
    id: 'music-beginner',
    name: '初学雅韵',
    description: '轻柔的琵琶伴奏，适合入门学习',
    composer: '传统古曲',
    audioUrl: '/music/pipa-light.mp3',
    rarity: 'common',
    unlocked: false,
  },
  {
    id: 'music-scholar',
    name: '书香琴韵',
    description: '古琴与笛子的协奏，书卷气十足',
    composer: '传统古曲',
    audioUrl: '/music/guqin-scholar.mp3',
    rarity: 'epic',
    unlocked: false,
  },
  {
    id: 'music-tang',
    name: '大唐盛世',
    description: '盛唐宫廷乐舞，气势恢宏',
    composer: '唐代宫廷乐师',
    dynastyId: 'tang',
    audioUrl: '/music/tang-court.mp3',
    rarity: 'epic',
    unlocked: false,
  },
  {
    id: 'music-song',
    name: '宋词雅乐',
    description: '宋代文人雅士的词乐',
    composer: '宋代词人',
    dynastyId: 'song',
    audioUrl: '/music/song-cipai.mp3',
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: 'music-yuan-opera',
    name: '元曲悠扬',
    description: '元曲唱腔与配乐',
    composer: '元代戏曲家',
    dynastyId: 'yuan',
    audioUrl: '/music/yuan-opera.mp3',
    rarity: 'rare',
    unlocked: false,
  },
  {
    id: 'music-racing',
    name: '鼓点急奏',
    description: '紧张激烈的战鼓节奏',
    composer: '传统战鼓',
    audioUrl: '/music/war-drums.mp3',
    rarity: 'rare',
    unlocked: false,
  },
];

export const getAllBackgroundMusics = (): BackgroundMusic[] => {
  return backgroundMusics;
};

export const getBackgroundMusicById = (id: string): BackgroundMusic | undefined => {
  return backgroundMusics.find(m => m.id === id);
};

export default backgroundMusics;
