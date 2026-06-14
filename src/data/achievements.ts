import type { Achievement } from '@/types';

export const achievements: Achievement[] = [
  {
    id: 'achievement-tang-master',
    name: '盛唐通',
    description: '完成唐朝所有诗词学习',
    icon: '🏆',
    category: 'dynasty',
    rarity: 'epic',
    requirement: {
      type: 'dynasty_completed',
      target: 1,
      dynastyId: 'tang',
    },
    reward: {
      type: 'skin',
      id: 'skin-tang-gold',
    },
  },
  {
    id: 'achievement-song-master',
    name: '宋词百晓生',
    description: '完成宋朝所有诗词学习',
    icon: '📜',
    category: 'dynasty',
    rarity: 'epic',
    requirement: {
      type: 'dynasty_completed',
      target: 1,
      dynastyId: 'song',
    },
    reward: {
      type: 'skin',
      id: 'skin-song-blue',
    },
  },
  {
    id: 'achievement-han-master',
    name: '汉赋大家',
    description: '完成汉朝所有诗词学习',
    icon: '🏯',
    category: 'dynasty',
    rarity: 'rare',
    requirement: {
      type: 'dynasty_completed',
      target: 1,
      dynastyId: 'han',
    },
    reward: {
      type: 'title',
      id: 'title-han-scholar',
    },
  },
  {
    id: 'achievement-poems-10',
    name: '诗词入门',
    description: '学习10首诗词',
    icon: '📖',
    category: 'poem',
    rarity: 'common',
    requirement: {
      type: 'poems_studied',
      target: 10,
    },
    reward: {
      type: 'music',
      id: 'music-beginner',
    },
  },
  {
    id: 'achievement-poems-25',
    name: '诗韵初成',
    description: '学习25首诗词',
    icon: '🌸',
    category: 'poem',
    rarity: 'rare',
    requirement: {
      type: 'poems_studied',
      target: 25,
    },
    reward: {
      type: 'skin',
      id: 'skin-spring',
    },
  },
  {
    id: 'achievement-poems-50',
    name: '满腹诗书',
    description: '学习50首诗词',
    icon: '📚',
    category: 'poem',
    rarity: 'epic',
    requirement: {
      type: 'poems_studied',
      target: 50,
    },
    reward: {
      type: 'music',
      id: 'music-scholar',
    },
  },
  {
    id: 'achievement-quiz-80',
    name: '才高八斗',
    description: '测试正确率达到80%以上',
    icon: '🎯',
    category: 'quiz',
    rarity: 'rare',
    requirement: {
      type: 'quiz_accuracy',
      target: 80,
    },
    reward: {
      type: 'title',
      id: 'title-quiz-master',
    },
  },
  {
    id: 'achievement-streak-7',
    name: '坚持不懈',
    description: '连续学习7天',
    icon: '🔥',
    category: 'special',
    rarity: 'rare',
    requirement: {
      type: 'streak_days',
      target: 7,
    },
    reward: {
      type: 'skin',
      id: 'skin-fire',
    },
  },
  {
    id: 'achievement-racing-5',
    name: '竞速达人',
    description: '赢得5场双人竞速比赛',
    icon: '⚡',
    category: 'special',
    rarity: 'epic',
    requirement: {
      type: 'racing_wins',
      target: 5,
    },
    reward: {
      type: 'skin',
      id: 'skin-lightning',
    },
  },
  {
    id: 'achievement-total-1000',
    name: '学富五车',
    description: '总积分达到1000分',
    icon: '👑',
    category: 'special',
    rarity: 'legendary',
    requirement: {
      type: 'total_score',
      target: 1000,
    },
    reward: {
      type: 'skin',
      id: 'skin-royal',
    },
  },
  {
    id: 'achievement-yuan-master',
    name: '元曲名家',
    description: '完成元朝所有诗词学习',
    icon: '🎭',
    category: 'dynasty',
    rarity: 'rare',
    requirement: {
      type: 'dynasty_completed',
      target: 1,
      dynastyId: 'yuan',
    },
    reward: {
      type: 'music',
      id: 'music-yuan-opera',
    },
  },
  {
    id: 'achievement-qing-master',
    name: '清词鉴赏家',
    description: '完成清朝所有诗词学习',
    icon: '🎋',
    category: 'dynasty',
    rarity: 'rare',
    requirement: {
      type: 'dynasty_completed',
      target: 1,
      dynastyId: 'qing',
    },
    reward: {
      type: 'title',
      id: 'title-qing-expert',
    },
  },
];

export const getAllAchievements = (): Achievement[] => {
  return achievements;
};

export const getAchievementById = (id: string): Achievement | undefined => {
  return achievements.find(a => a.id === id);
};

export const getAchievementsByCategory = (category: Achievement['category']): Achievement[] => {
  return achievements.filter(a => a.category === category);
};

export default achievements;
