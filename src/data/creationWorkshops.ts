import type { CreationWorkshop } from '@/types';

export const creationWorkshops: CreationWorkshop[] = [
  {
    id: 'workshop-tang-1',
    title: '盛唐气象',
    description: '用盛唐的诗句和历史事件，描绘你心中的开元盛世',
    dynastyId: 'tang',
    requiredPoemIds: ['poem-tang-1', 'poem-tang-sheng-1'],
    requiredEventIds: ['event-tang-2'],
    difficulty: 'easy',
    sampleTopic: '假如你生活在开元盛世，描写你在长安街头的所见所闻',
  },
  {
    id: 'workshop-tang-2',
    title: '安史之乱',
    description: '以安史之乱为背景，用杜甫、李白的诗句讲述乱世故事',
    dynastyId: 'tang',
    requiredPoemIds: ['poem-tang-sheng-2', 'poem-tang-4'],
    requiredEventIds: ['event-tang-3'],
    difficulty: 'medium',
    sampleTopic: '战乱中一位诗人的流亡之路',
  },
  {
    id: 'workshop-song-1',
    title: '靖康之耻',
    description: '用宋词抒发靖康之变后的家国之痛',
    dynastyId: 'song',
    requiredPoemIds: ['poem-song-2', 'poem-song-3'],
    requiredEventIds: ['event-song-3'],
    difficulty: 'medium',
    sampleTopic: '南渡后一位词人的心声',
  },
  {
    id: 'workshop-han-1',
    title: '丝路驼铃',
    description: '以张骞出使西域为背景，描绘丝绸之路的壮丽',
    dynastyId: 'han',
    requiredPoemIds: ['poem-han-west-1'],
    requiredEventIds: ['event-han-2'],
    difficulty: 'easy',
    sampleTopic: '一位商队旅人沿着丝绸之路西行的见闻',
  },
  {
    id: 'workshop-yuan-1',
    title: '大元风貌',
    description: '用元曲描绘元朝疆域的辽阔与多元文化',
    dynastyId: 'yuan',
    requiredPoemIds: ['poem-yuan-1'],
    requiredEventIds: ['event-yuan-1'],
    difficulty: 'medium',
    sampleTopic: '大都城内各色人等的生活场景',
  },
  {
    id: 'workshop-mixed-1',
    title: '穿越千年',
    description: '选择多个朝代的诗句和事件，创作一篇穿越故事',
    dynastyId: 'tang',
    requiredPoemIds: ['poem-tang-1', 'poem-song-1'],
    requiredEventIds: ['event-tang-2', 'event-song-2'],
    difficulty: 'hard',
    sampleTopic: '一个现代人穿越到古代的奇遇经历',
  },
];

export const getCreationWorkshopById = (id: string): CreationWorkshop | undefined => {
  return creationWorkshops.find(w => w.id === id);
};

export const getCreationWorkshopsByDynastyId = (dynastyId: string): CreationWorkshop[] => {
  return creationWorkshops.filter(w => w.dynastyId === dynastyId);
};
