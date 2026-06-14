import type { CreationWorkshopTopic } from '@/types';

export const creationWorkshopTopics: CreationWorkshopTopic[] = [
  {
    id: 'topic-tang-prosperity',
    title: '我眼中的开元盛世',
    description: '结合所学唐诗，描绘你想象中的开元盛世景象',
    dynastyId: 'tang',
    relatedEventIds: ['event-tang-2'],
    relatedPoemIds: ['poem-tang-1', 'poem-tang-3'],
    difficulty: 'easy',
    sampleEssay: '开元盛世，是唐朝最辉煌的时代。走在长安的大街上，"长安一片月，万户捣衣声"，繁华的都市里，文人墨客吟诗作赋，好一派盛世景象。',
    keywords: ['开元盛世', '长安', '李白', '杜甫', '繁华'],
  },
  {
    id: 'topic-tang-war',
    title: '安史之乱中的诗人',
    description: '以安史之乱为背景，描写诗人在战乱中的遭遇与感受',
    dynastyId: 'tang',
    relatedEventIds: ['event-tang-3'],
    relatedPoemIds: ['poem-tang-4', 'poem-tang-sheng-2'],
    difficulty: 'medium',
    sampleEssay: '安史之乱爆发后，长安城破，百姓流离失所。杜甫目睹了"国破山河在，城春草木深"的惨状，用他的诗笔记录下了这个时代的苦难。',
    keywords: ['安史之乱', '杜甫', '忧国忧民', '战乱', '春望'],
  },
  {
    id: 'topic-song-life',
    title: '宋朝人的日常生活',
    description: '结合宋词，想象宋朝普通人的一天是怎样度过的',
    dynastyId: 'song',
    relatedEventIds: ['event-song-1'],
    relatedPoemIds: ['poem-song-1', 'poem-song-2'],
    difficulty: 'easy',
    sampleEssay: '清晨，东京城的集市开始热闹起来。"竹外桃花三两枝，春江水暖鸭先知"，苏轼笔下的春天，是那样的生机盎然，充满生活气息。',
    keywords: ['宋朝', '苏轼', '日常生活', '市井', '清明上河图'],
  },
  {
    id: 'topic-song-hero',
    title: '梦回大宋，精忠报国',
    description: '如果你穿越到南宋，会怎样面对那个动荡的年代',
    dynastyId: 'song',
    relatedEventIds: ['event-song-3'],
    relatedPoemIds: ['poem-song-4', 'poem-song-3'],
    difficulty: 'hard',
    sampleEssay: '靖康之耻，犹未雪。若我生于南宋，定当如辛弃疾一般"了却君王天下事，赢得生前身后名"，投笔从戎，收复中原。',
    keywords: ['南宋', '辛弃疾', '岳飞', '爱国', '靖康之变'],
  },
  {
    id: 'topic-han-ambition',
    title: '大风起兮云飞扬',
    description: '以汉朝建立为背景，抒写建功立业的豪情壮志',
    dynastyId: 'han',
    relatedEventIds: [],
    relatedPoemIds: ['poem-han-1', 'poem-han-2'],
    difficulty: 'medium',
    sampleEssay: '"大风起兮云飞扬，威加海内兮归故乡"，汉高祖刘邦的这首《大风歌》，道尽了开国君主的豪迈与感慨。汉朝四百年基业，由此开启。',
    keywords: ['汉朝', '刘邦', '项羽', '楚汉争霸', '建功立业'],
  },
  {
    id: 'topic-yuan-opera',
    title: '元曲里的人间百态',
    description: '从元曲中感受元朝社会的众生相',
    dynastyId: 'yuan',
    relatedEventIds: [],
    relatedPoemIds: ['poem-yuan-1', 'poem-yuan-2'],
    difficulty: 'medium',
    sampleEssay: '"枯藤老树昏鸦，小桥流水人家"，马致远的小令，寥寥数笔便勾勒出一幅秋日黄昏的游子思乡图。元曲，就是这样贴近人间烟火。',
    keywords: ['元曲', '马致远', '关汉卿', '散曲', '杂剧'],
  },
  {
    id: 'topic-ming-ambition',
    title: '明朝那些事儿',
    description: '以诗词描绘明朝的历史风云与人物风采',
    dynastyId: 'ming',
    relatedEventIds: [],
    relatedPoemIds: ['poem-ming-1', 'poem-ming-2'],
    difficulty: 'medium',
    sampleEssay: '"粉身碎骨浑不怕，要留清白在人间"，于谦的这首《石灰吟》，正是他一生的写照。明朝有这样的忠臣义士，怎能不让人敬佩。',
    keywords: ['明朝', '于谦', '郑和', '历史', '气节'],
  },
  {
    id: 'topic-qing-change',
    title: '晚清风云录',
    description: '结合龚自珍等诗人的作品，感受晚清社会的变革',
    dynastyId: 'qing',
    relatedEventIds: [],
    relatedPoemIds: ['poem-qing-2', 'poem-qing-3'],
    difficulty: 'hard',
    sampleEssay: '"九州生气恃风雷，万马齐喑究可哀"，龚自珍的诗，喊出了晚清社会的沉闷与呼唤变革的心声。那是一个风雨如晦的年代。',
    keywords: ['清朝', '龚自珍', '鸦片战争', '变革', '纳兰性德'],
  },
];

export const getAllCreationTopics = (): CreationWorkshopTopic[] => {
  return creationWorkshopTopics;
};

export const getCreationTopicById = (id: string): CreationWorkshopTopic | undefined => {
  return creationWorkshopTopics.find(t => t.id === id);
};

export const getCreationTopicsByDynasty = (dynastyId: string): CreationWorkshopTopic[] => {
  return creationWorkshopTopics.filter(t => t.dynastyId === dynastyId);
};

export const getCreationTopicsByDifficulty = (
  difficulty: 'easy' | 'medium' | 'hard'
): CreationWorkshopTopic[] => {
  return creationWorkshopTopics.filter(t => t.difficulty === difficulty);
};

export default creationWorkshopTopics;
