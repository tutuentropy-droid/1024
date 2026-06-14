import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  AppStore, UserProgress, QuizResult, Poem, DailyChallengeResult,
  VirtualPoet, SocialPost, ChatMessage, Puzzle, Poster, Almanac,
  NoteItem, WrongQuestion, PoemQuote, StudyGroup, PuzzlePiece,
  AIImage, AudioTheaterProgress, AdventureProgress, AdventureScene,
  VoiceLearnCard, WrongQuestionGroup, TimeCapsule, StudyBuddy, 
  StudyBuddyMessage, DailyPoemHistory, AnimationScene, HistoricalEvent,
  UserAchievements, CreationSubmission, RaceGame, RaceQuestion, RacePlayer
} from '@/types';
import { 
  dynasties, poems, events, getPoemById, getAllDynasties, 
  getPoemsByDynastyId, getSubPeriodsByDynastyId, 
  getPoemsBySubPeriodId, getPoemsByDifficulty, subPeriods,
  getAllSubPeriods, comparisons, generateDailyChallengeData,
  virtualPoets, socialPosts, getVirtualPoetById,
  getAllAudioTheaters, getAudioTheaterById, getAllAdventures, getAdventureById,
  getAllGeoLocations, getGeoLocationsByDynastyId, getEventById,
  achievements, skins, bgms, creationWorkshops, getAchievementById, getSkinById, getBgmById
} from '@/data';

const initialUserProgress: UserProgress = {
  id: 'user-1',
  lastStudyTime: 0,
  totalPoemsStudied: 0,
  totalQuizzesTaken: 0,
  averageAccuracy: 0,
  poemProgress: {},
  quizResults: [],
  currentDifficulty: 'easy',
  poemOrderPreference: [],
  subPeriodProgress: {},
  completedDynasties: [],
  dailyChallengeResults: [],
};

const initialStudyGroup: StudyGroup = {
  id: 'group-1',
  name: '诗史共学小组',
  members: [
    { id: 'user-1', name: '我', avatar: '👤', contribution: 0, isOnline: true, lastActive: Date.now() },
    { id: 'member-1', name: '诗友小明', avatar: '🧑', contribution: 3, isOnline: true, lastActive: Date.now() },
    { id: 'member-2', name: '词客小红', avatar: '👩', contribution: 5, isOnline: false, lastActive: Date.now() - 3600000 },
    { id: 'member-3', name: '史学者阿华', avatar: '👨', contribution: 2, isOnline: true, lastActive: Date.now() },
    { id: 'member-4', name: '文青小雅', avatar: '👧', contribution: 4, isOnline: false, lastActive: Date.now() - 7200000 },
  ],
  currentPuzzleId: null,
  completedPuzzles: [],
  createdAt: Date.now(),
};

const initialStudyBuddy: StudyBuddy = {
  id: 'buddy-1',
  name: '小诗童',
  avatar: '🧒',
  personality: 'encouraging',
  level: 1,
  experience: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  currentStreak: 0,
  longestStreak: 0,
  unlockedBadges: ['初心者'],
  lastInteraction: Date.now(),
};

const initialUserAchievements: UserAchievements = {
  unlockedAchievementIds: [],
  unlockedSkinIds: ['skin-default'],
  unlockedBgmIds: ['bgm-default'],
  currentSkinId: 'skin-default',
  currentBgmId: 'bgm-default',
  titles: [],
  currentTitle: '',
};

const generateTimeCapsuleAnalysis = (
  targetType: 'poet' | 'event',
  target: VirtualPoet | HistoricalEvent | undefined,
  userPrediction: string
): { analysis: string; comparisonPoints: string[]; accuracy: number; creativity: number; tags: string[] } => {
  if (!target) {
    return {
      analysis: '目标对象不存在。',
      comparisonPoints: [],
      accuracy: 0,
      creativity: 0,
      tags: [],
    };
  }

  const lowerPrediction = userPrediction.toLowerCase();
  const comparisonPoints: string[] = [];
  let accuracyScore = 40;
  let creativityScore = 50;
  const tags: string[] = [];

  if (targetType === 'poet') {
    const poet = target as VirtualPoet;
    const dynasty = dynasties.find(d => d.id === poet.dynastyId);

    if (lowerPrediction.includes('手机') || lowerPrediction.includes('电话') || lowerPrediction.includes('互联网')) {
      comparisonPoints.push(`若${poet.name}拥有现代通讯工具，其诗作可能会更加即时地反映社会动态，而非仅靠书信传递。`);
      comparisonPoints.push(`历史上${poet.name}的诗作多是经过反复推敲而成，与现代即时通讯的快速表达风格迥异。`);
      accuracyScore += 15;
      creativityScore += 20;
      tags.push('科技穿越', '通讯革命');
    }

    if (lowerPrediction.includes('安史之乱') || lowerPrediction.includes('战乱') || lowerPrediction.includes('战争')) {
      comparisonPoints.push(`${poet.name}生活的时代确实经历过重大历史变故，其诗作中多有忧国忧民的情怀。`);
      comparisonPoints.push(`历史上的${poet.name}以写实著称，其作品被誉为"诗史"，真实记录了时代变迁。`);
      accuracyScore += 25;
      creativityScore += 10;
      tags.push('战乱题材', '诗史精神');
    }

    if (lowerPrediction.includes('社交') || lowerPrediction.includes('朋友圈') || lowerPrediction.includes('微博')) {
      comparisonPoints.push(`古代文人通过诗文唱和进行社交，${poet.name}与当时许多名士都有诗作往来。`);
      comparisonPoints.push(`若有现代社交媒体，${poet.name}的粉丝量想必十分可观，其每首新作都会引发热议。`);
      accuracyScore += 10;
      creativityScore += 25;
      tags.push('文人社交', '传播影响');
    }

    if (lowerPrediction.includes('ai') || lowerPrediction.includes('人工智能') || lowerPrediction.includes('机器')) {
      comparisonPoints.push(`${poet.name}的创作源于生活体验和情感积淀，这是人工智能难以复制的。`);
      comparisonPoints.push(`AI可以模仿${poet.name}的风格，但无法替代其独特的人生经历和思想深度。`);
      accuracyScore += 20;
      creativityScore += 15;
      tags.push('AI对比', '创作本质');
    }

    if (comparisonPoints.length === 0) {
      comparisonPoints.push(`你的猜想很有想象力！${poet.name}作为${dynasty?.name || '那个'}时代的大诗人，${poet.personality.slice(0, 30)}。`);
      comparisonPoints.push(`历史上${poet.name}以其独特的创作风格闻名，代表作品有${poet.famousWorks.slice(0, 2).join('、')}等。`);
      comparisonPoints.push(`穿越时空的假设虽然有趣，但更重要的是理解诗人所处的历史背景和创作心境。`);
      accuracyScore += 30;
      creativityScore += 20;
      tags.push('创意想象', '历史思考');
    }
  } else {
    const event = target as HistoricalEvent;
    const dynasty = dynasties.find(d => d.id === event.dynastyId);

    if (lowerPrediction.includes('如果') || lowerPrediction.includes('假如') || lowerPrediction.includes('要是')) {
      comparisonPoints.push(`历史没有如果，但${event.name}确实对${dynasty?.name || '当时'}的社会产生了深远影响。`);
      comparisonPoints.push(`${event.description.slice(0, 50)}——这是${event.name}的真实历史面貌。`);
      accuracyScore += 20;
      creativityScore += 25;
      tags.push('历史假设', '反事实思考');
    }

    if (lowerPrediction.includes('改变') || lowerPrediction.includes('阻止') || lowerPrediction.includes('避免')) {
      comparisonPoints.push(`${event.name}的发生有其历史必然性，是多种社会矛盾积累的结果。`);
      comparisonPoints.push(`该事件的影响：${event.impact.slice(0, 60)}`);
      accuracyScore += 30;
      creativityScore += 15;
      tags.push('历史必然性', '影响分析');
    }

    if (lowerPrediction.includes('现代人') || lowerPrediction.includes('穿越') || lowerPrediction.includes('回到')) {
      comparisonPoints.push(`现代人若身处${event.name}的时代，会面临巨大的文化冲击和生存挑战。`);
      comparisonPoints.push(`理解历史事件需要放在具体的时代背景中，不能用现代标准简单评判。`);
      accuracyScore += 25;
      creativityScore += 30;
      tags.push('时空穿越', '历史视角');
    }

    if (comparisonPoints.length === 0) {
      comparisonPoints.push(`${event.name}发生于公元${event.year}年，是${dynasty?.name || '中国历史'}上的重要事件。`);
      comparisonPoints.push(`事件背景：${event.description.slice(0, 80)}`);
      comparisonPoints.push(`历史影响：${event.impact.slice(0, 80)}`);
      accuracyScore += 35;
      creativityScore += 20;
      tags.push('历史事件', '深度分析');
    }
  }

  if (userPrediction.length > 50) creativityScore += 10;
  if (userPrediction.length > 100) creativityScore += 10;

  accuracyScore = Math.min(95, Math.max(20, accuracyScore));
  creativityScore = Math.min(98, Math.max(30, creativityScore));

  const analysis = `
【时空对照分析】

你的猜想："${userPrediction.slice(0, 60)}${userPrediction.length > 60 ? '...' : ''}"

历史真实与你的猜想对比：

${comparisonPoints.map((point, i) => `${i + 1}. ${point}`).join('\n\n')}

【评分】
📊 历史契合度：${accuracyScore}分
💡 创意指数：${creativityScore}分

${accuracyScore >= 70 ? '你对历史有相当深入的了解！' : '继续学习，你的历史洞察力会越来越强！'}
${creativityScore >= 70 ? '你的想象力非常丰富，很有创意思维！' : '不妨大胆想象，历史有无限可能。'}
  `.trim();

  return {
    analysis,
    comparisonPoints,
    accuracy: accuracyScore,
    creativity: creativityScore,
    tags,
  };
};

const generateStudyBuddyResponse = (
  buddy: StudyBuddy,
  userMessage: string,
  userProgress: UserProgress,
  difficulty: 'easy' | 'medium' | 'hard'
): { message: string; type: StudyBuddyMessage['type']; difficulty?: 'easy' | 'medium' | 'hard'; relatedPoemId?: string } => {
  const lowerMsg = userMessage.toLowerCase();

  const personalityGreetings: Record<StudyBuddy['personality'], string[]> = {
    encouraging: [
      '你好呀！今天学习什么诗词呢？',
      '欢迎回来！我们一起加油哦~',
      '又见面啦！今天也要元气满满地学习！',
    ],
    challenging: [
      '来了？准备好接受今天的挑战了吗？',
      '今天想挑战什么难度的题目？',
      '别偷懒，快开始今天的学习吧。',
    ],
    playful: [
      '嘿嘿，又来学诗啦？',
      '哇！你来啦！今天有好多有趣的诗词等着我们~',
      '小诗童在此！我们来玩诗词游戏吧~',
    ],
    scholarly: [
      '同学好，今日欲习何诗？',
      '学而时习之，不亦说乎。',
      '今日学习，可有疑难？',
    ],
  };

  const personalityEncouragements: Record<StudyBuddy['personality'], string[]> = {
    encouraging: [
      '太棒了！你学得真快~',
      '答对了！继续保持这个势头！',
      '真厉害！我就知道你可以的！',
      '进步神速，为你骄傲！',
    ],
    challenging: [
      '嗯，还算不错。不过还可以更好。',
      '答对了，但别骄傲，还有更难的。',
      '基础还行，挑战一下更高难度？',
      '不错的表现，但这只是开始。',
    ],
    playful: [
      '耶！答对啦！🎉',
      '哇塞，你好厉害！',
      '嘻嘻，又答对了，好棒好棒~',
      '厉害厉害，给你点个赞！👍',
    ],
    scholarly: [
      '答得好，学有所得。',
      '甚是不错，继续精进。',
      '学有所成，可喜可贺。',
      '此言有理，可见用心。',
    ],
  };

  if (lowerMsg.includes('你好') || lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('在吗')) {
    const greetings = personalityGreetings[buddy.personality];
    return {
      message: greetings[Math.floor(Math.random() * greetings.length)],
      type: 'greeting',
    };
  }

  if (lowerMsg.includes('今天学什么') || lowerMsg.includes('推荐') || lowerMsg.includes('学什么')) {
    const studiedCount = userProgress.totalPoemsStudied;
    const totalCount = poems.length;
    const progress = Math.round((studiedCount / totalCount) * 100);

    let recommendation = '';
    if (difficulty === 'easy') {
      recommendation = '今天可以从简单的诗词开始，先复习一下之前学过的内容，再学一两首新诗~';
    } else if (difficulty === 'medium') {
      recommendation = '今天可以尝试中等难度的诗词，注意理解诗词的历史背景哦。';
    } else {
      recommendation = '今天来挑战一下高难度的诗词吧！深入分析诗词的艺术特色和历史意蕴。';
    }

    return {
      message: `目前你已经学习了${studiedCount}首诗词，进度${progress}%。\n\n${recommendation}\n\n要不要我出几道题考考你？`,
      type: 'summary',
    };
  }

  if (lowerMsg.includes('出题') || lowerMsg.includes('考我') || lowerMsg.includes('问题')) {
    const randomPoem = poems[Math.floor(Math.random() * poems.length)];
    const questionTypes = [
      `"${randomPoem.famousLine}"，这句诗出自谁的作品？`,
      `${randomPoem.author}的《${randomPoem.title}》是哪个朝代的作品？`,
      `《${randomPoem.title}》的作者是谁？`,
    ];
    const question = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    return {
      message: `好呀，那我来考考你！\n\n${question}`,
      type: 'question',
      difficulty,
      relatedPoemId: randomPoem.id,
    };
  }

  if (lowerMsg.includes('太难了') || lowerMsg.includes('不会') || lowerMsg.includes('提示')) {
    return {
      message: '没关系，学习就是从不会到会的过程~ 我给你一点提示：想想这首诗的作者生活在哪个朝代，那个时候有什么著名的历史事件？',
      type: 'hint',
    };
  }

  if (lowerMsg.includes('谢谢') || lowerMsg.includes('感谢')) {
    return {
      message: personalityEncouragements[buddy.personality][0] + '\n\n不客气，我们一起进步！',
      type: 'encouragement',
    };
  }

  if (lowerMsg.includes('再见') || lowerMsg.includes('拜拜') || lowerMsg.includes('下次')) {
    return {
      message: '好的，下次见！记得每天都来学习哦~ 加油！💪',
      type: 'encouragement',
    };
  }

  const defaultResponses: Record<StudyBuddy['personality'], string[]> = {
    encouraging: [
      '嗯嗯，我明白你的意思。学习诗词需要慢慢来，我们一起努力！',
      '你说得对！学习历史和诗词确实很有意思呢~',
      '有什么不懂的尽管问我，我们一起探讨！',
      '今天学习了这么多，辛苦啦！休息一下也很重要哦~',
    ],
    challenging: [
      '嗯，思考得不错。但还可以更深入一些。',
      '这个角度挺有意思。不过别忘了从历史背景去理解。',
      '继续保持这种思考方式，你会进步很快的。',
      '学而不思则罔，多思考总是好的。',
    ],
    playful: [
      '哇，你说得好有道理！',
      '嘿嘿，和你聊天真开心~',
      '原来是这样呀！我又学到新知识了！',
      '好棒好棒，继续继续~',
    ],
    scholarly: [
      '此言有理，可与君共勉。',
      '学无止境，当精益求精。',
      '汝之所言，颇有见地。',
      '善哉善哉，勤学如斯。',
    ],
  };

  const responses = defaultResponses[buddy.personality];
  return {
    message: responses[Math.floor(Math.random() * responses.length)],
    type: 'feedback',
  };
};

const generateDailyPoemHistoryData = (): DailyPoemHistory => {
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('-').reduce((acc, v) => acc + parseInt(v), 0);
  
  const shuffledPoems = [...poems].sort((a, b) => {
    const ha = (a.id + seed).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const hb = (b.id + seed).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return ha - hb;
  });
  
  const selectedPoem = shuffledPoems[0];
  const dynasty = dynasties.find(d => d.id === selectedPoem.dynastyId)!;
  const poemContent = selectedPoem.content.map(l => l.text).join('\n');
  
  const insights = Object.values(selectedPoem.historicalInsight).filter(Boolean) as string[];
  const mainInsight = insights[0] || selectedPoem.background;
  
  const animationScenes: AnimationScene[] = [
    {
      id: 'scene-1',
      order: 1,
      title: '时代背景',
      description: `${dynasty.name}时期的社会风貌`,
      visualPrompt: `古代${dynasty.name}朝繁华的城市景象，宫殿楼阁，文人雅士`,
      narration: `${dynasty.name}是中国历史上${dynasty.description.slice(0, 30)}的朝代。在这样的时代背景下，诗词艺术达到了新的高峰。`,
      duration: 30,
    },
    {
      id: 'scene-2',
      order: 2,
      title: '诗人风采',
      description: `${selectedPoem.author}的人生故事`,
      visualPrompt: `古代诗人${selectedPoem.author}在山水间吟诗，身着古装，手持书卷`,
      narration: `${selectedPoem.author}，${selectedPoem.authorBio.slice(0, 50)}。其诗作风格独特，对后世影响深远。`,
      duration: 35,
    },
    {
      id: 'scene-3',
      order: 3,
      title: '诗词意境',
      description: `《${selectedPoem.title}》的诗意画面`,
      visualPrompt: `${selectedPoem.famousLine}的诗意图，水墨画风格`,
      narration: `《${selectedPoem.title}》是${selectedPoem.author}的代表作之一。"${selectedPoem.famousLine}"，这句诗意境深远，被后人广为传诵。`,
      duration: 40,
      poemLine: selectedPoem.famousLine,
    },
    {
      id: 'scene-4',
      order: 4,
      title: '历史回响',
      description: '诗词背后的历史深意',
      visualPrompt: `历史长河中的诗词文化传承，时光流逝的意象`,
      narration: `每一首诗词都是历史的见证。${mainInsight.slice(0, 60)}。以诗证史，以史解诗，让我们更好地理解中华文化的博大精深。`,
      duration: 35,
    },
  ];

  const keyPoints = [
    `${selectedPoem.author}是${dynasty.name}时期的重要诗人`,
    `《${selectedPoem.title}》创作于特定的历史背景下`,
    `"${selectedPoem.famousLine}"是广为传诵的名句`,
    `这首诗反映了当时的社会风貌和文人心态`,
    `从历史角度解读诗词，能更深刻理解其内涵`,
  ];

  const quizOptions = [
    selectedPoem.author,
    ...virtualPoets
      .filter(vp => vp.id !== selectedPoem.author)
      .slice(0, 3)
      .map(vp => vp.name),
  ].sort(() => Math.random() - 0.5);

  const correctAnswerIndex = quizOptions.indexOf(selectedPoem.author);

  return {
    date: today,
    poemId: selectedPoem.id,
    poemTitle: selectedPoem.title,
    poemAuthor: selectedPoem.author,
    poemContent,
    dynastyName: dynasty.name,
    dynastyId: dynasty.id,
    historicalBackground: selectedPoem.background,
    microLesson: {
      title: `三分钟读懂《${selectedPoem.title}》`,
      duration: 180,
      summary: `通过动画微课，了解${dynasty.name}时期的历史背景，理解${selectedPoem.author}创作《${selectedPoem.title}》的时代语境，感受诗词与历史的交融。`,
      keyPoints,
      quizQuestion: `《${selectedPoem.title}》的作者是谁？`,
      quizOptions,
      correctAnswerIndex: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
      explanation: `《${selectedPoem.title}》是${dynasty.name}诗人${selectedPoem.author}的代表作品。${selectedPoem.authorBio.slice(0, 40)}。`,
    },
    animationScenes,
    isRead: false,
    isFavorite: false,
  };
};

const generateAIRResponse = (poet: VirtualPoet, userMessage: string): string => {
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('介绍') || lowerMsg.includes('你是谁') || lowerMsg.includes('自我介绍')) {
    return `某乃${poet.name}，字${poet.styleName.includes('居士') ? '' : '子美'}。${poet.bio.slice(0, 80)}。\n\n不知阁下欲与吾谈诗论道，还是询问生平？`;
  }
  
  if (lowerMsg.includes('时代') || lowerMsg.includes('背景') || lowerMsg.includes('朝代')) {
    const dynasty = dynasties.find(d => d.id === poet.dynastyId);
    return `吾生于${dynasty?.name || '那个'}时代，${dynasty?.description.slice(0, 60)}。\n\n彼时${poet.personality.slice(0, 40)}，故吾诗文中多有此时代之印记。`;
  }
  
  if (lowerMsg.includes('诗') || lowerMsg.includes('作品') || lowerMsg.includes('名句')) {
    const work = poet.famousWorks[Math.floor(Math.random() * poet.famousWorks.length)];
    const catchphrase = poet.catchphrases[Math.floor(Math.random() * poet.catchphrases.length)];
    return `吾之诗作，以${work}为代表。其中「${catchphrase}」一句，最为世人传诵。\n\n不知阁下钟爱吾哪首诗作？`;
  }
  
  if (lowerMsg.includes('杜甫') || lowerMsg.includes('子美')) {
    return `子美乃吾挚友！其诗沉郁顿挫，忧国忧民，实乃诗中圣哲。「安得广厦千万间，大庇天下寒士俱欢颜」，真乃仁人心声！`;
  }
  
  if (lowerMsg.includes('苏轼') || lowerMsg.includes('东坡')) {
    return `苏子瞻才情横溢，豁达乐观，虽屡遭贬谪而不改其志。「但愿人长久，千里共婵娟」，真乃千古绝唱！`;
  }
  
  if (lowerMsg.includes('朋友') || lowerMsg.includes('交友') || lowerMsg.includes('友人')) {
    return `吾生平交友广泛，与子美、摩诘、乐天等皆为好友。闲暇时，我们常把酒言欢，吟诗作文，好不惬意！`;
  }
  
  if (lowerMsg.includes('酒') || lowerMsg.includes('饮') || lowerMsg.includes('醉')) {
    return `「人生得意须尽欢，莫使金樽空对月！」酒乃吾诗中之友，醉时文思泉涌，佳句迭出。「举杯邀明月，对影成三人」，此乃吾独酌之乐也！`;
  }
  
  const randomCatchphrase = poet.catchphrases[Math.floor(Math.random() * poet.catchphrases.length)];
  
  const responses = [
    `阁下所言甚是！某以为，「${randomCatchphrase}」。不知阁下以为然否？`,
    `此问甚妙！某常言：「${randomCatchphrase}」。人生天地间，当有此等胸襟！`,
    `哈哈，与阁下言谈甚欢！某有一言相赠：「${randomCatchphrase}」。愿与君共勉！`,
    `读万卷书，行万里路。某平生游历四方，所见所闻，尽付诗文。「${randomCatchphrase}」，此乃某之心得也！`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      dynasties: getAllDynasties(),
      poems: poems,
      events: events,
      subPeriods: getAllSubPeriods(),
      comparisons: comparisons,
      userProgress: initialUserProgress,
      selectedDynastyId: null,
      selectedPoemId: null,
      dailyChallenge: null,
      virtualPoets: virtualPoets,
      socialPosts: socialPosts,
      chatMessages: {},
      selectedPoetId: null,
      puzzles: [],
      currentPuzzleId: null,
      posters: [],
      currentPosterId: null,
      almanacs: [],
      notes: [],
      wrongQuestions: [],
      poemQuotes: [],
      studyGroup: initialStudyGroup,
      aiImages: [],
      currentGeneratingImage: false,
      audioTheaters: getAllAudioTheaters(),
      audioTheaterProgress: {},
      currentAudioTheaterId: null,
      adventures: getAllAdventures(),
      currentAdventure: null,
      selectedAdventureId: null,
      geoLocations: getAllGeoLocations(),
      selectedMapLocationId: null,
      voiceLearnSession: null,
      timeCapsules: [],
      selectedTimeCapsuleId: null,
      studyBuddy: initialStudyBuddy,
      studyBuddyMessages: [],
      isStudyBuddyOpen: false,
      dailyPoemHistory: null,
      dailyPoemHistoryList: [],
      achievements: achievements,
      skins: skins,
      bgms: bgms,
      userAchievements: initialUserAchievements,
      creationWorkshops: creationWorkshops,
      creationSubmissions: [],
      currentRaceGame: null,
      raceHistory: [],

      selectDynasty: (id: string | null) => {
        set({ selectedDynastyId: id });
        if (id) {
          const dynastyPoems = getPoemsByDynastyId(id);
          if (dynastyPoems.length > 0 && !get().selectedPoemId) {
            set({ selectedPoemId: dynastyPoems[0].id });
          }
        }
      },

      selectPoem: (id: string | null) => {
        set({ selectedPoemId: id });
      },

      markPoemAsStudied: (poemId: string) => {
        set((state) => {
          const existingProgress = state.userProgress.poemProgress[poemId];
          const now = Date.now();
          
          const newPoemProgress = {
            ...state.userProgress.poemProgress,
            [poemId]: {
              poemId,
              isStudied: true,
              isFavorite: existingProgress?.isFavorite || false,
              studyCount: (existingProgress?.studyCount || 0) + 1,
              lastStudyTime: now,
              correctCount: existingProgress?.correctCount || 0,
              wrongCount: existingProgress?.wrongCount || 0,
            },
          };

          const studiedCount = Object.values(newPoemProgress).filter(p => p.isStudied).length;

          return {
            userProgress: {
              ...state.userProgress,
              lastStudyTime: now,
              totalPoemsStudied: studiedCount,
              poemProgress: newPoemProgress,
            },
          };
        });
      },

      toggleFavorite: (poemId: string) => {
        set((state) => {
          const existingProgress = state.userProgress.poemProgress[poemId];
          const now = Date.now();

          return {
            userProgress: {
              ...state.userProgress,
              poemProgress: {
                ...state.userProgress.poemProgress,
                [poemId]: {
                  poemId,
                  isStudied: existingProgress?.isStudied || false,
                  isFavorite: !existingProgress?.isFavorite,
                  studyCount: existingProgress?.studyCount || 0,
                  lastStudyTime: existingProgress?.lastStudyTime || now,
                  correctCount: existingProgress?.correctCount || 0,
                  wrongCount: existingProgress?.wrongCount || 0,
                },
              },
            },
          };
        });
      },

      recordPoemAnswer: (poemId: string, isCorrect: boolean) => {
        set((state) => {
          const existingProgress = state.userProgress.poemProgress[poemId];
          const now = Date.now();

          return {
            userProgress: {
              ...state.userProgress,
              poemProgress: {
                ...state.userProgress.poemProgress,
                [poemId]: {
                  poemId,
                  isStudied: existingProgress?.isStudied || true,
                  isFavorite: existingProgress?.isFavorite || false,
                  studyCount: existingProgress?.studyCount || 1,
                  lastStudyTime: now,
                  correctCount: (existingProgress?.correctCount || 0) + (isCorrect ? 1 : 0),
                  wrongCount: (existingProgress?.wrongCount || 0) + (isCorrect ? 0 : 1),
                },
              },
            },
          };
        });
      },

      saveQuizResult: (result: Omit<QuizResult, 'id' | 'date'>) => {
        set((state) => {
          const newResult: QuizResult = {
            ...result,
            id: `quiz-${Date.now()}`,
            date: Date.now(),
          };

          const allResults = [...state.userProgress.quizResults, newResult];
          const totalCorrect = allResults.reduce((sum, r) => sum + r.correctAnswers, 0);
          const totalQuestions = allResults.reduce((sum, r) => sum + r.totalQuestions, 0);
          const averageAccuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;

          const newDifficulty = state.adjustDifficulty(averageAccuracy);

          result.questionDetails.forEach(detail => {
            if (!detail.isCorrect) {
              const poem = getPoemById(detail.poemId);
              const wrongQ: WrongQuestion = {
                id: `wrong-${Date.now()}-${detail.questionId}`,
                questionId: detail.questionId,
                poemId: detail.poemId,
                question: detail.questionId,
                userAnswer: detail.userAnswer,
                correctAnswer: detail.correctAnswer,
                dynastyId: poem?.dynastyId || '',
                createdAt: Date.now(),
              };
              state.wrongQuestions.push(wrongQ);
            }
          });

          return {
            userProgress: {
              ...state.userProgress,
              totalQuizzesTaken: state.userProgress.totalQuizzesTaken + 1,
              averageAccuracy,
              quizResults: allResults,
              currentDifficulty: newDifficulty,
            },
            wrongQuestions: [...state.wrongQuestions],
          };
        });
      },

      adjustDifficulty: (accuracy: number): 'easy' | 'medium' | 'hard' => {
        if (accuracy >= 0.85) return 'hard';
        if (accuracy >= 0.6) return 'medium';
        return 'easy';
      },

      getStudiedPoemIds: () => {
        const state = get();
        return Object.values(state.userProgress.poemProgress)
          .filter(p => p.isStudied)
          .map(p => p.poemId);
      },

      getRecommendedPoem: () => {
        const state = get();
        const orderedPoems = state.getOrderedPoems();
        const studiedIds = state.getStudiedPoemIds();
        const unstudiedPoems = orderedPoems.filter(p => !studiedIds.includes(p.id));
        
        if (unstudiedPoems.length === 0) {
          return orderedPoems[0] || null;
        }
        
        return unstudiedPoems[0];
      },

      getOrderedPoems: (): Poem[] => {
        const state = get();
        const currentDifficulty = state.userProgress.currentDifficulty;
        const allPoems = [...state.poems];
        
        const difficultyOrder: Record<string, number> = {
          easy: 0,
          medium: 1,
          hard: 2,
        };

        const userPreference = state.userProgress.poemOrderPreference;
        
        if (userPreference.length > 0) {
          const preferredPoems = userPreference
            .map(id => allPoems.find(p => p.id === id))
            .filter((p): p is Poem => p !== undefined);
          const otherPoems = allPoems.filter(p => !userPreference.includes(p.id));
          return [...preferredPoems, ...otherPoems];
        }

        return allPoems.sort((a, b) => {
          const aDifficulty = difficultyOrder[a.difficulty] || 1;
          const bDifficulty = difficultyOrder[b.difficulty] || 1;
          const currentDiffOrder = difficultyOrder[currentDifficulty] || 1;
          
          const aDiff = Math.abs(aDifficulty - currentDiffOrder);
          const bDiff = Math.abs(bDifficulty - currentDiffOrder);
          
          if (aDiff !== bDiff) return aDiff - bDiff;
          return aDifficulty - bDifficulty;
        });
      },

      getSubPeriodsByDynastyId: (dynastyId: string) => {
        return getSubPeriodsByDynastyId(dynastyId);
      },

      getPoemsBySubPeriodId: (subPeriodId: string) => {
        return getPoemsBySubPeriodId(subPeriodId);
      },

      markDynastyCompleted: (dynastyId: string) => {
        set((state) => {
          if (state.userProgress.completedDynasties.includes(dynastyId)) return state;
          return {
            userProgress: {
              ...state.userProgress,
              completedDynasties: [...state.userProgress.completedDynasties, dynastyId],
            },
          };
        });
      },

      saveDailyChallengeResult: (result: DailyChallengeResult) => {
        set((state) => {
          const existing = state.userProgress.dailyChallengeResults.find(r => r.date === result.date);
          if (existing) return state;
          return {
            userProgress: {
              ...state.userProgress,
              dailyChallengeResults: [...state.userProgress.dailyChallengeResults, result],
            },
          };
        });
      },

      generateDailyChallenge: () => {
        const challenge = generateDailyChallengeData();
        set({ dailyChallenge: challenge });
      },

      getDynastyCompletionStats: () => {
        const state = get();
        const allDynastyIds = state.dynasties.map(d => d.id);
        const completed = state.userProgress.completedDynasties.length;
        const total = allDynastyIds.length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        return { completed, total, percentage };
      },

      selectPoet: (poetId: string | null) => {
        set({ selectedPoetId: poetId });
        
        if (poetId) {
          const state = get();
          const existingMessages = state.chatMessages[poetId];
          if (!existingMessages || existingMessages.length === 0) {
            const poet = getVirtualPoetById(poetId);
            if (poet) {
              const greeting: ChatMessage = {
                id: `msg-${Date.now()}`,
                content: `某乃${poet.name}，字${poet.styleName}。不知阁下来访，有何见教？`,
                isUser: false,
                timestamp: Date.now(),
              };
              set({
                chatMessages: {
                  ...state.chatMessages,
                  [poetId]: [greeting],
                },
              });
            }
          }
        }
      },

      likeSocialPost: (postId: string) => {
        set((state) => {
          const updatedPosts = state.socialPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                likedByUser: !post.likedByUser,
                likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
              };
            }
            return post;
          });
          return { socialPosts: updatedPosts };
        });
      },

      commentSocialPost: (postId: string, poetId: string, content: string) => {
        set((state) => {
          const updatedPosts = state.socialPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: `comment-${Date.now()}`,
                    poetId,
                    content,
                    timestamp: Date.now(),
                  },
                ],
              };
            }
            return post;
          });
          return { socialPosts: updatedPosts };
        });
      },

      sendChatMessage: (poetId: string, content: string) => {
        set((state) => {
          const userMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            content,
            isUser: true,
            timestamp: Date.now(),
          };

          const existingMessages = state.chatMessages[poetId] || [];
          const updatedMessages = [...existingMessages, userMessage];

          const poet = getVirtualPoetById(poetId);
          if (poet) {
            setTimeout(() => {
              const aiResponse = generateAIRResponse(poet, content);
              const aiMessage: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                content: aiResponse,
                isUser: false,
                timestamp: Date.now(),
              };
              
              set((state) => ({
                chatMessages: {
                  ...state.chatMessages,
                  [poetId]: [...(state.chatMessages[poetId] || []), aiMessage],
                },
              }));
            }, 1000 + Math.random() * 1000);
          }

          return {
            chatMessages: {
              ...state.chatMessages,
              [poetId]: updatedMessages,
            },
          };
        });
      },

      startPuzzle: (dynastyId: string) => {
        set((state) => {
          const dynasty = state.dynasties.find(d => d.id === dynastyId);
          if (!dynasty) return state;

          const existingPuzzle = state.puzzles.find(p => p.dynastyId === dynastyId);
          if (existingPuzzle) {
            return { currentPuzzleId: existingPuzzle.id };
          }

          const dynastyEvents = events.filter(e => e.dynastyId === dynastyId);
          const dynastyPoets = virtualPoets.filter(p => p.dynastyId === dynastyId);
          const dynastyPoems = poems.filter(p => p.dynastyId === dynastyId);

          const pieces: PuzzlePiece[] = [];
          let position = 0;

          dynastyEvents.slice(0, 3).forEach(event => {
            pieces.push({
              id: `piece-event-${event.id}`,
              dynastyId,
              position: position++,
              content: event.name,
              type: 'event',
              isPlaced: false,
            });
          });

          dynastyPoets.slice(0, 3).forEach(poet => {
            pieces.push({
              id: `piece-poet-${poet.id}`,
              dynastyId,
              position: position++,
              content: poet.name,
              type: 'poet',
              isPlaced: false,
            });
          });

          dynastyPoems.slice(0, 2).forEach(poem => {
            pieces.push({
              id: `piece-poem-${poem.id}`,
              dynastyId,
              position: position++,
              content: poem.famousLine,
              type: 'poem',
              isPlaced: false,
            });
          });

          pieces.push({
            id: `piece-achievement-${dynastyId}`,
            dynastyId,
            position: position++,
            content: dynasty.keyEvents[0] || '盛世',
            type: 'achievement',
            isPlaced: false,
          });

          const newPuzzle: Puzzle = {
            id: `puzzle-${dynastyId}-${Date.now()}`,
            dynastyId,
            name: `${dynasty.name}拼图`,
            pieces,
            totalPieces: pieces.length,
            isCompleted: false,
          };

          return {
            puzzles: [...state.puzzles, newPuzzle],
            currentPuzzleId: newPuzzle.id,
          };
        });
      },

      placePuzzlePiece: (puzzleId: string, pieceId: string, memberId: string) => {
        set((state) => {
          const updatedPuzzles = state.puzzles.map(puzzle => {
            if (puzzle.id === puzzleId) {
              const updatedPieces = puzzle.pieces.map(piece => {
                if (piece.id === pieceId && !piece.isPlaced) {
                  return { ...piece, isPlaced: true, placedBy: memberId };
                }
                return piece;
              });

              const allPlaced = updatedPieces.every(p => p.isPlaced);

              return {
                ...puzzle,
                pieces: updatedPieces,
                isCompleted: allPlaced,
                completedAt: allPlaced ? Date.now() : undefined,
              };
            }
            return puzzle;
          });

          const updatedGroup = state.studyGroup ? {
            ...state.studyGroup,
            members: state.studyGroup.members.map(member => {
              if (member.id === memberId) {
                return { ...member, contribution: member.contribution + 1 };
              }
              return member;
            }),
          } : state.studyGroup;

          return { puzzles: updatedPuzzles, studyGroup: updatedGroup };
        });
      },

      completePuzzle: (puzzleId: string) => {
        set((state) => {
          const updatedPuzzles = state.puzzles.map(puzzle => {
            if (puzzle.id === puzzleId) {
              return { ...puzzle, isCompleted: true, completedAt: Date.now() };
            }
            return puzzle;
          });

          const puzzle = state.puzzles.find(p => p.id === puzzleId);
          const updatedGroup = state.studyGroup && puzzle ? {
            ...state.studyGroup,
            completedPuzzles: [...state.studyGroup.completedPuzzles, puzzleId],
            currentPuzzleId: null,
          } : state.studyGroup;

          return { puzzles: updatedPuzzles, studyGroup: updatedGroup };
        });
      },

      generatePoster: (dynastyId: string) => {
        set((state) => {
          const dynasty = state.dynasties.find(d => d.id === dynastyId);
          if (!dynasty) return state;

          const dynastyPoems = poems.filter(p => p.dynastyId === dynastyId);
          const dynastyEvents = events.filter(e => e.dynastyId === dynastyId);
          const dynastyPoets = virtualPoets.filter(p => p.dynastyId === dynastyId);

          const colorSchemes: Record<string, { bg: string; text: string; accent: string }> = {
            tang: { bg: '#FFF5F5', text: '#742A2A', accent: '#C41E3A' },
            song: { bg: '#F0F7FF', text: '#1E3A5F', accent: '#2B5C8A' },
            han: { bg: '#F0F4F8', text: '#1A365D', accent: '#6B95BC' },
            yuan: { bg: '#FAF7F2', text: '#5C4A3D', accent: '#C7B594' },
            ming: { bg: '#FFF8F0', text: '#7A5C2E', accent: '#FFC97D' },
            qing: { bg: '#FFF5F5', text: '#742A2A', accent: '#E89AA6' },
            nanbeichao: { bg: '#F0FFF4', text: '#1A4731', accent: '#2E8B57' },
          };

          const colors = colorSchemes[dynastyId] || colorSchemes.tang;

          const timelineContent = dynastyEvents
            .slice(0, 4)
            .map(e => `${e.year}年：${e.name}`)
            .join('\n');

          const poemsContent = dynastyPoems
            .slice(0, 3)
            .map(p => `《${p.title}》- ${p.author}\n「${p.famousLine}」`)
            .join('\n\n');

          const poetsContent = dynastyPoets
            .slice(0, 4)
            .map(p => `${p.name}（${p.styleName}）`)
            .join('、');

          const studiedCount = dynastyPoems.filter(
            p => state.userProgress.poemProgress[p.id]?.isStudied
          ).length;

          const newPoster: Poster = {
            id: `poster-${dynastyId}-${Date.now()}`,
            dynastyId,
            title: `${dynasty.name}知识海报`,
            subtitle: `${dynasty.startYear > 0 ? '公元' : '公元前'}${Math.abs(dynasty.startYear)}年 - ${dynasty.endYear > 0 ? '公元' : '公元前'}${Math.abs(dynasty.endYear)}年`,
            sections: [
              { id: 's1', type: 'title', title: '朝代简介', content: dynasty.description },
              { id: 's2', type: 'timeline', title: '重要事件', content: timelineContent },
              { id: 's3', type: 'poems', title: '经典诗词', content: poemsContent },
              { id: 's4', type: 'poets', title: '代表诗人', content: poetsContent },
              { id: 's5', type: 'stats', title: '学习统计', content: `已学诗词：${studiedCount}/${dynastyPoems.length}首\n都城：${dynasty.capital}` },
            ],
            backgroundColor: colors.bg,
            textColor: colors.text,
            accentColor: colors.accent,
            createdAt: Date.now(),
            isGenerated: true,
          };

          return {
            posters: [...state.posters, newPoster],
            currentPosterId: newPoster.id,
          };
        });
      },

      selectPoster: (posterId: string | null) => {
        set({ currentPosterId: posterId });
      },

      addNote: (note: Omit<NoteItem, 'id' | 'createdAt'>) => {
        set((state) => {
          const newNote: NoteItem = {
            ...note,
            id: `note-${Date.now()}`,
            createdAt: Date.now(),
          };
          return { notes: [...state.notes, newNote] };
        });
      },

      addWrongQuestion: (question: Omit<WrongQuestion, 'id' | 'createdAt'>) => {
        set((state) => {
          const newQuestion: WrongQuestion = {
            ...question,
            id: `wrong-${Date.now()}`,
            createdAt: Date.now(),
          };
          return { wrongQuestions: [...state.wrongQuestions, newQuestion] };
        });
      },

      addPoemQuote: (quote: Omit<PoemQuote, 'id'>) => {
        set((state) => {
          const newQuote: PoemQuote = {
            ...quote,
            id: `quote-${Date.now()}`,
          };
          return { poemQuotes: [...state.poemQuotes, newQuote] };
        });
      },

      generateAlmanac: (dynastyId: string) => {
        set((state) => {
          const dynasty = state.dynasties.find(d => d.id === dynastyId);
          if (!dynasty) return state;

          const dynastyNotes = state.notes.filter(n => n.dynastyId === dynastyId);
          const dynastyWrongQuestions = state.wrongQuestions.filter(q => q.dynastyId === dynastyId);
          
          const dynastyPoemIds = poems.filter(p => p.dynastyId === dynastyId).map(p => p.id);
          const dynastyPoemQuotes = state.poemQuotes.filter(q => dynastyPoemIds.includes(q.poemId));
          
          const dynastyPoems = poems.filter(p => p.dynastyId === dynastyId);
          const studiedPoems = dynastyPoems.filter(
            p => state.userProgress.poemProgress[p.id]?.isStudied
          );

          const quizzesForDynasty = state.userProgress.quizResults.filter(r => {
            return r.questionDetails.some(d => dynastyPoemIds.includes(d.poemId));
          });

          const totalQuestions = quizzesForDynasty.reduce((sum, r) => sum + r.totalQuestions, 0);
          const totalCorrect = quizzesForDynasty.reduce((sum, r) => sum + r.correctAnswers, 0);

          const formatYear = (year: number) => 
            year > 0 ? `公元${year}年` : `公元前${Math.abs(year)}年`;

          const newAlmanac: Almanac = {
            id: `almanac-${dynastyId}-${Date.now()}`,
            dynastyId,
            dynastyName: dynasty.name,
            period: `${formatYear(dynasty.startYear)} - ${formatYear(dynasty.endYear)}`,
            notes: dynastyNotes,
            wrongQuestions: dynastyWrongQuestions,
            poemQuotes: dynastyPoemQuotes,
            stats: {
              poemsStudied: studiedPoems.length,
              quizzesTaken: quizzesForDynasty.length,
              averageAccuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
              studyTime: quizzesForDynasty.reduce((sum, r) => sum + r.timeSpent, 0),
            },
            generatedAt: Date.now(),
            isDownloaded: false,
          };

          return { almanacs: [...state.almanacs, newAlmanac] };
        });
      },

      markAlmanacDownloaded: (almanacId: string) => {
        set((state) => {
          const updatedAlmanacs = state.almanacs.map(almanac => {
            if (almanac.id === almanacId) {
              return { ...almanac, isDownloaded: true };
            }
            return almanac;
          });
          return { almanacs: updatedAlmanacs };
        });
      },

      joinStudyGroup: (groupId: string) => {
        set({ studyGroup: initialStudyGroup });
      },

      leaveStudyGroup: () => {
        set({ studyGroup: null });
      },

      generateAIImage: async (poemId: string, style: AIImage['style'] = 'ink') => {
        const poem = getPoemById(poemId);
        if (!poem) return;

        set({ currentGeneratingImage: true });

        const dynasty = dynasties.find(d => d.id === poem.dynastyId);
        const dynastyName = dynasty?.name || '中国古代';
        
        const stylePrompts: Record<AIImage['style'], string> = {
          ink: 'traditional Chinese ink wash painting style, minimalist, elegant, black and white with subtle colors',
          watercolor: 'watercolor painting style, soft colors, dreamy atmosphere, artistic brushstrokes',
          oil: 'oil painting style, rich colors, dramatic lighting, classical art',
          anime: 'anime style, vibrant colors, detailed illustration, modern aesthetic',
          realistic: 'photorealistic style, highly detailed, historical accuracy, cinematic lighting'
        };

        const prompt = `${poem.famousLine} - A scene from ${dynastyName} China, depicting the mood and atmosphere of the poem "${poem.title}" by ${poem.author}. ${stylePrompts[style]}. Historical scene, ancient Chinese architecture, traditional clothing, the essence of classical Chinese poetry.`;

        const imageSize = 'landscape_16_9';
        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=${imageSize}`;

        await new Promise(resolve => setTimeout(resolve, 1500));

        const newImage: AIImage = {
          id: `ai-image-${poemId}-${Date.now()}`,
          poemId,
          imageUrl,
          prompt,
          style,
          createdAt: Date.now(),
          isFavorite: false
        };

        set((state) => ({
          aiImages: [...state.aiImages, newImage],
          currentGeneratingImage: false
        }));
      },

      toggleAIImageFavorite: (imageId: string) => {
        set((state) => ({
          aiImages: state.aiImages.map(img => 
            img.id === imageId ? { ...img, isFavorite: !img.isFavorite } : img
          )
        }));
      },

      getAIImagesByPoemId: (poemId: string) => {
        return get().aiImages.filter(img => img.poemId === poemId);
      },

      selectAudioTheater: (theaterId: string | null) => {
        set({ currentAudioTheaterId: theaterId });
      },

      markAudioTheaterPlayed: (theaterId: string) => {
        set((state) => {
          const existing = state.audioTheaterProgress[theaterId];
          return {
            audioTheaterProgress: {
              ...state.audioTheaterProgress,
              [theaterId]: {
                theaterId,
                isCompleted: true,
                lastPlayedAt: Date.now(),
                playCount: (existing?.playCount || 0) + 1
              }
            }
          };
        });
      },

      startAdventure: (adventureId: string) => {
        const adventure = getAdventureById(adventureId);
        if (!adventure) return;

        const progress: AdventureProgress = {
          adventureId,
          currentSceneId: adventure.startSceneId,
          visitedSceneIds: [adventure.startSceneId],
          choicesMade: {},
          score: 0,
          isCompleted: false,
          poemsUnlocked: []
        };

        set({ currentAdventure: progress, selectedAdventureId: adventureId });
      },

      makeAdventureChoice: (sceneId: string, choiceId: string) => {
        set((state) => {
          if (!state.currentAdventure) return state;

          const adventure = getAdventureById(state.currentAdventure.adventureId);
          if (!adventure) return state;

          const scene = adventure.scenes[sceneId];
          if (!scene) return state;

          const choice = scene.choices.find(c => c.id === choiceId);
          if (!choice) return state;

          const isSuccess = choice.consequence.type === 'success';
          const scoreDelta = isSuccess ? 100 : choice.consequence.type === 'neutral' ? 50 : 0;

          const newPoemsUnlocked = choice.consequence.poemReveal 
            ? [...state.currentAdventure.poemsUnlocked, choice.consequence.poemReveal.poemId]
            : state.currentAdventure.poemsUnlocked;

          const isCompleted = choice.consequence.nextSceneId === null || 
            (choice.consequence.nextSceneId && choice.consequence.nextSceneId.includes('good'));

          const nextSceneId = choice.consequence.nextSceneId;

          return {
            currentAdventure: {
              ...state.currentAdventure,
              currentSceneId: nextSceneId || state.currentAdventure.currentSceneId,
              visitedSceneIds: nextSceneId && !state.currentAdventure.visitedSceneIds.includes(nextSceneId)
                ? [...state.currentAdventure.visitedSceneIds, nextSceneId]
                : state.currentAdventure.visitedSceneIds,
              choicesMade: {
                ...state.currentAdventure.choicesMade,
                [sceneId]: choiceId
              },
              score: state.currentAdventure.score + scoreDelta,
              isCompleted: isCompleted || state.currentAdventure.isCompleted,
              completedAt: isCompleted ? Date.now() : undefined,
              poemsUnlocked: [...new Set(newPoemsUnlocked)]
            }
          };
        });
      },

      resetAdventure: () => {
        set({ currentAdventure: null });
      },

      selectAdventure: (adventureId: string | null) => {
        set({ selectedAdventureId: adventureId });
      },

      selectMapLocation: (locationId: string | null) => {
        set({ selectedMapLocationId: locationId });
      },

      startVoiceLearnSession: (query: string) => {
        const state = get();
        const lowerQuery = query.toLowerCase();
        const cards: VoiceLearnCard[] = [];

        const matchedDynasty = state.dynasties.find(d =>
          d.name.includes(query) || lowerQuery.includes(d.id)
        );

        if (matchedDynasty) {
          const dynastyPoems = poems.filter(p => p.dynastyId === matchedDynasty.id);
          const dynastyEvents = events.filter(e => e.dynastyId === matchedDynasty.id);

          cards.push({
            id: `vc-dynasty-${matchedDynasty.id}`,
            type: 'dynasty',
            dynastyId: matchedDynasty.id,
            title: matchedDynasty.name,
            content: matchedDynasty.description,
            year: matchedDynasty.startYear,
            audioText: `${matchedDynasty.name}，${matchedDynasty.description}`,
          });

          dynastyEvents.slice(0, 3).forEach(event => {
            cards.push({
              id: `vc-event-${event.id}`,
              type: 'event',
              dynastyId: matchedDynasty.id,
              title: event.name,
              content: event.description,
              year: event.year,
              audioText: `${event.name}，${event.description}。其影响是：${event.impact}`,
            });
          });

          dynastyPoems.slice(0, 5).forEach(poem => {
            cards.push({
              id: `vc-poem-${poem.id}`,
              type: 'poem',
              dynastyId: matchedDynasty.id,
              title: `《${poem.title}》— ${poem.author}`,
              content: poem.famousLine,
              famousLine: poem.famousLine,
              audioText: `${poem.author}的《${poem.title}》，名句：${poem.famousLine}。背景：${poem.background}`,
            });
          });
        } else {
          const matchedPoems = state.poems.filter(p =>
            p.title.includes(query) ||
            p.author.includes(query) ||
            p.famousLine.includes(query) ||
            p.content.some(line => line.text.includes(query))
          );

          if (matchedPoems.length > 0) {
            matchedPoems.slice(0, 8).forEach(poem => {
              const dynasty = state.dynasties.find(d => d.id === poem.dynastyId);
              cards.push({
                id: `vc-poem-${poem.id}`,
                type: 'poem',
                dynastyId: poem.dynastyId,
                title: `《${poem.title}》— ${poem.author}`,
                content: poem.famousLine,
                famousLine: poem.famousLine,
                audioText: `${dynasty?.name || ''}诗人${poem.author}的《${poem.title}》，名句：${poem.famousLine}。${poem.background}`,
              });
            });
          } else {
            state.dynasties.forEach(dynasty => {
              cards.push({
                id: `vc-dynasty-${dynasty.id}`,
                type: 'dynasty',
                dynastyId: dynasty.id,
                title: dynasty.name,
                content: dynasty.description,
                year: dynasty.startYear,
                audioText: `${dynasty.name}，${dynasty.description}`,
              });
            });
          }
        }

        const testQuestions = cards
          .filter(c => c.type === 'poem' || c.type === 'event')
          .slice(0, 5)
          .map(c => c.id);

        set({
          voiceLearnSession: {
            id: `vls-${Date.now()}`,
            query,
            cards,
            currentCardIndex: 0,
            isPlaying: false,
            startedAt: Date.now(),
            testStarted: false,
            testQuestions,
            testAnswers: {},
          },
        });
      },

      advanceVoiceCard: () => {
        set((state) => {
          if (!state.voiceLearnSession) return state;
          const nextIndex = state.voiceLearnSession.currentCardIndex + 1;
          if (nextIndex >= state.voiceLearnSession.cards.length) return state;
          return {
            voiceLearnSession: {
              ...state.voiceLearnSession,
              currentCardIndex: nextIndex,
            },
          };
        });
      },

      toggleVoicePlayback: () => {
        set((state) => {
          if (!state.voiceLearnSession) return state;
          return {
            voiceLearnSession: {
              ...state.voiceLearnSession,
              isPlaying: !state.voiceLearnSession.isPlaying,
            },
          };
        });
      },

      startVoiceTest: () => {
        set((state) => {
          if (!state.voiceLearnSession) return state;
          return {
            voiceLearnSession: {
              ...state.voiceLearnSession,
              testStarted: true,
            },
          };
        });
      },

      answerVoiceTest: (questionId: string, answer: string) => {
        set((state) => {
          if (!state.voiceLearnSession) return state;
          return {
            voiceLearnSession: {
              ...state.voiceLearnSession,
              testAnswers: {
                ...state.voiceLearnSession.testAnswers,
                [questionId]: answer,
              },
            },
          };
        });
      },

      endVoiceLearnSession: () => {
        set({ voiceLearnSession: null });
      },

      getWrongQuestionGroups: (): WrongQuestionGroup[] => {
        const state = get();
        const groups: Record<string, WrongQuestionGroup & { subPeriodGroups?: Record<string, { name: string; questions: typeof state.wrongQuestions }> }> = {};

        state.wrongQuestions.forEach(q => {
          if (!groups[q.dynastyId]) {
            const dynasty = state.dynasties.find(d => d.id === q.dynastyId);
            if (!dynasty) return;
            const fmt = (y: number) => y < 0 ? `公元前${Math.abs(y)}年` : `公元${y}年`;
            groups[q.dynastyId] = {
              dynastyId: q.dynastyId,
              dynastyName: dynasty.name,
              dynastyColor: dynasty.color,
              period: `${fmt(dynasty.startYear)} - ${fmt(dynasty.endYear)}`,
              questions: [],
              recommendedPoemIds: [],
              subPeriodGroups: {},
            };
          }
          groups[q.dynastyId].questions.push(q);

          const poem = getPoemById(q.poemId);
          if (poem?.subPeriodId && groups[q.dynastyId].subPeriodGroups) {
            const subPeriod = subPeriods.find(sp => sp.id === poem.subPeriodId);
            if (subPeriod) {
              if (!groups[q.dynastyId].subPeriodGroups![poem.subPeriodId]) {
                groups[q.dynastyId].subPeriodGroups![poem.subPeriodId] = {
                  name: subPeriod.name,
                  questions: [],
                };
              }
              groups[q.dynastyId].subPeriodGroups![poem.subPeriodId].questions.push(q);
            }
          }
        });

        Object.keys(groups).forEach(dynastyId => {
          const group = groups[dynastyId];
          const wrongPoemIds = [...new Set(group.questions.map(q => q.poemId))];
          const dynastyPoems = poems.filter(p => p.dynastyId === dynastyId);
          const wrongPoemTags = wrongPoemIds
            .map(pid => poems.find(p => p.id === pid))
            .filter(Boolean)
            .flatMap(p => p!.tags);
          const wrongSubPeriodIds = [...new Set(
            wrongPoemIds
              .map(pid => poems.find(p => p.id === pid)?.subPeriodId)
              .filter(Boolean)
          )] as string[];
          const wrongQuestionTypes = [...new Set(group.questions.map(q => {
            const poem = getPoemById(q.poemId);
            return poem?.difficulty || 'medium';
          }))];

          const scoredRecommendations = dynastyPoems
            .filter(p => !wrongPoemIds.includes(p.id))
            .map(p => {
              let score = 0;
              const matchingTags = p.tags.filter(t => wrongPoemTags.includes(t)).length;
              score += matchingTags * 10;
              if (wrongSubPeriodIds.includes(p.subPeriodId || '')) score += 15;
              if (wrongQuestionTypes.includes(p.difficulty)) score += 8;
              score += (state.userProgress.poemProgress[p.id]?.wrongCount || 0) * 5;
              score -= (state.userProgress.poemProgress[p.id]?.correctCount || 0) * 2;
              return { poem: p, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 4);

          const highlyRecommended = scoredRecommendations.filter(sr => sr.score > 0).map(sr => sr.poem.id);
          const fallbackCount = 4 - highlyRecommended.length;
          const fallback = dynastyPoems
            .filter(p => !wrongPoemIds.includes(p.id) && !highlyRecommended.includes(p.id))
            .slice(0, fallbackCount)
            .map(p => p.id);

          group.recommendedPoemIds = [...highlyRecommended, ...fallback];
        });

        return Object.values(groups).sort((a, b) => {
          const dynastyA = state.dynasties.find(d => d.id === a.dynastyId);
          const dynastyB = state.dynasties.find(d => d.id === b.dynastyId);
          return (dynastyA?.startYear || 0) - (dynastyB?.startYear || 0);
        });
      },

      getRecommendedPractice: (dynastyId: string): string[] => {
        const state = get();
        const dynastyWrongPoemIds = [...new Set(
          state.wrongQuestions
            .filter(q => q.dynastyId === dynastyId)
            .map(q => q.poemId)
        )];
        const dynastyPoems = poems.filter(p => p.dynastyId === dynastyId);
        const wrongTags = dynastyWrongPoemIds
          .map(pid => poems.find(p => p.id === pid))
          .filter(Boolean)
          .flatMap(p => p!.tags);

        return dynastyPoems
          .filter(p => {
            if (dynastyWrongPoemIds.includes(p.id)) return true;
            return p.tags.some(t => wrongTags.includes(t));
          })
          .slice(0, 5)
          .map(p => p.id);
      },

      removeWrongQuestion: (questionId: string) => {
        set((state) => ({
          wrongQuestions: state.wrongQuestions.filter(q => q.id !== questionId),
        }));
      },

      createTimeCapsule: (targetType: 'poet' | 'event', targetId: string, userPrediction: string) => {
        set((state) => {
          let target: VirtualPoet | HistoricalEvent | undefined;
          let targetName = '';
          let dynastyId = '';

          if (targetType === 'poet') {
            target = getVirtualPoetById(targetId);
            if (target) {
              targetName = target.name;
              dynastyId = target.dynastyId;
            }
          } else {
            target = getEventById(targetId);
            if (target) {
              targetName = target.name;
              dynastyId = target.dynastyId;
            }
          }

          const { analysis, comparisonPoints, accuracy, creativity, tags } = generateTimeCapsuleAnalysis(
            targetType,
            target,
            userPrediction
          );

          const newCapsule: TimeCapsule = {
            id: `capsule-${Date.now()}`,
            targetType,
            targetId,
            targetName,
            userPrediction,
            aiAnalysis: analysis,
            comparisonPoints,
            historicalAccuracy: accuracy,
            creativityScore: creativity,
            createdAt: Date.now(),
            dynastyId,
            tags,
          };

          return {
            timeCapsules: [newCapsule, ...state.timeCapsules],
            selectedTimeCapsuleId: newCapsule.id,
          };
        });
      },

      selectTimeCapsule: (id: string | null) => {
        set({ selectedTimeCapsuleId: id });
      },

      deleteTimeCapsule: (id: string) => {
        set((state) => ({
          timeCapsules: state.timeCapsules.filter(c => c.id !== id),
          selectedTimeCapsuleId: state.selectedTimeCapsuleId === id ? null : state.selectedTimeCapsuleId,
        }));
      },

      getTimeCapsulesByDynasty: (dynastyId: string): TimeCapsule[] => {
        const state = get();
        return state.timeCapsules.filter(c => c.dynastyId === dynastyId);
      },

      toggleStudyBuddy: () => {
        set((state) => {
          const isOpen = !state.isStudyBuddyOpen;
          if (isOpen && state.studyBuddyMessages.length === 0) {
            const greeting: StudyBuddyMessage = {
              id: `msg-${Date.now()}`,
              content: '你好呀！我是小诗童，你的诗词学习伙伴~ 有什么想了解的吗？',
              isUser: false,
              timestamp: Date.now(),
              type: 'greeting',
            };
            return {
              isStudyBuddyOpen: isOpen,
              studyBuddyMessages: [greeting],
              studyBuddy: {
                ...state.studyBuddy,
                lastInteraction: Date.now(),
              },
            };
          }
          return { isStudyBuddyOpen: isOpen };
        });
      },

      sendStudyBuddyMessage: (content: string) => {
        set((state) => {
          const userMessage: StudyBuddyMessage = {
            id: `msg-${Date.now()}`,
            content,
            isUser: true,
            timestamp: Date.now(),
            type: 'feedback',
          };

          const difficulty = state.getStudyBuddyDifficulty();
          const { message, type } = generateStudyBuddyResponse(
            state.studyBuddy,
            content,
            state.userProgress,
            difficulty
          );

          const buddyMessage: StudyBuddyMessage = {
            id: `msg-${Date.now() + 1}`,
            content: message,
            isUser: false,
            timestamp: Date.now(),
            type,
            difficulty,
          };

          const newMessages = [...state.studyBuddyMessages, userMessage, buddyMessage];

          let newExp = state.studyBuddy.experience + 5;
          let newLevel = state.studyBuddy.level;
          const expForNextLevel = newLevel * 100;
          if (newExp >= expForNextLevel) {
            newLevel += 1;
            newExp = newExp - expForNextLevel;
          }

          return {
            studyBuddyMessages: newMessages,
            studyBuddy: {
              ...state.studyBuddy,
              experience: newExp,
              level: newLevel,
              lastInteraction: Date.now(),
            },
          };
        });
      },

      getStudyBuddyDifficulty: (): 'easy' | 'medium' | 'hard' => {
        const state = get();
        const accuracy = state.userProgress.averageAccuracy;
        const totalQuizzes = state.userProgress.totalQuizzesTaken;
        
        if (totalQuizzes < 3) return 'easy';
        if (accuracy >= 0.8) return 'hard';
        if (accuracy >= 0.5) return 'medium';
        return 'easy';
      },

      adjustStudyBuddyPersonality: () => {
        set((state) => {
          const accuracy = state.userProgress.averageAccuracy;
          const totalPoems = state.userProgress.totalPoemsStudied;
          
          let personality: StudyBuddy['personality'] = 'encouraging';
          if (totalPoems > 20 && accuracy > 0.7) {
            personality = 'challenging';
          } else if (totalPoems > 10) {
            personality = 'playful';
          } else if (accuracy > 0.8) {
            personality = 'scholarly';
          }

          return {
            studyBuddy: {
              ...state.studyBuddy,
              personality,
            },
          };
        });
      },

      generateDailyPoemHistory: () => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const existing = state.dailyPoemHistoryList.find(d => d.date === today);
          
          if (existing) {
            return {
              dailyPoemHistory: existing,
            };
          }

          const newDaily = generateDailyPoemHistoryData();
          return {
            dailyPoemHistory: newDaily,
            dailyPoemHistoryList: [newDaily, ...state.dailyPoemHistoryList].slice(0, 30),
          };
        });
      },

      markDailyPoemAsRead: (date: string) => {
        set((state) => ({
          dailyPoemHistoryList: state.dailyPoemHistoryList.map(d =>
            d.date === date ? { ...d, isRead: true } : d
          ),
          dailyPoemHistory: state.dailyPoemHistory?.date === date
            ? { ...state.dailyPoemHistory, isRead: true }
            : state.dailyPoemHistory,
        }));
      },

      toggleDailyPoemFavorite: (date: string) => {
        set((state) => ({
          dailyPoemHistoryList: state.dailyPoemHistoryList.map(d =>
            d.date === date ? { ...d, isFavorite: !d.isFavorite } : d
          ),
          dailyPoemHistory: state.dailyPoemHistory?.date === date
            ? { ...state.dailyPoemHistory, isFavorite: !state.dailyPoemHistory.isFavorite }
            : state.dailyPoemHistory,
        }));
      },

      getDailyPoemHistoryByDate: (date: string): DailyPoemHistory | undefined => {
        const state = get();
        return state.dailyPoemHistoryList.find(d => d.date === date);
      },

      checkAchievements: (): string[] => {
        const state = get();
        const { userProgress, userAchievements, creationSubmissions, raceHistory } = state;
        const newlyUnlocked: string[] = [];

        for (const achievement of state.achievements) {
          if (userAchievements.unlockedAchievementIds.includes(achievement.id)) continue;

          let isUnlocked = false;
          const req = achievement.requirement;

          switch (req.type) {
            case 'study_count':
              isUnlocked = userProgress.totalPoemsStudied >= req.target;
              break;
            case 'accuracy':
              isUnlocked = userProgress.averageAccuracy * 100 >= req.target;
              break;
            case 'dynasty_complete':
              if (req.dynastyId) {
                isUnlocked = userProgress.completedDynasties.includes(req.dynastyId);
              }
              break;
            case 'creation_count':
              isUnlocked = creationSubmissions.length >= req.target;
              break;
            case 'race_win':
              const wins = raceHistory.filter(g => g.winnerId === 'player-1').length;
              isUnlocked = wins >= req.target;
              break;
            case 'streak':
              isUnlocked = state.studyBuddy.currentStreak >= req.target;
              break;
          }

          if (isUnlocked) {
            newlyUnlocked.push(achievement.id);
          }
        }

        return newlyUnlocked;
      },

      unlockAchievement: (achievementId: string) => {
        set((state) => {
          if (state.userAchievements.unlockedAchievementIds.includes(achievementId)) {
            return {};
          }

          const achievement = getAchievementById(achievementId);
          if (!achievement) return {};

          const newUnlockedSkins = [...state.userAchievements.unlockedSkinIds];
          const newUnlockedBgms = [...state.userAchievements.unlockedBgmIds];
          const newTitles = [...state.userAchievements.titles];

          if (achievement.rewardType === 'skin' && !newUnlockedSkins.includes(achievement.rewardId)) {
            newUnlockedSkins.push(achievement.rewardId);
          } else if (achievement.rewardType === 'bgm' && !newUnlockedBgms.includes(achievement.rewardId)) {
            newUnlockedBgms.push(achievement.rewardId);
          } else if (achievement.rewardType === 'title') {
            const titleMap: Record<string, string> = {
              'title-yuan-master': '元曲行家',
              'title-talented': '才高八斗',
              'title-beginner-writer': '初习文墨',
              'title-persistent': '持之以恒',
            };
            const titleName = titleMap[achievement.rewardId] || achievement.rewardId;
            if (!newTitles.includes(titleName)) {
              newTitles.push(titleName);
            }
          }

          return {
            userAchievements: {
              ...state.userAchievements,
              unlockedAchievementIds: [...state.userAchievements.unlockedAchievementIds, achievementId],
              unlockedSkinIds: newUnlockedSkins,
              unlockedBgmIds: newUnlockedBgms,
              titles: newTitles,
            },
          };
        });
      },

      setCurrentSkin: (skinId: string) => {
        set((state) => {
          if (!state.userAchievements.unlockedSkinIds.includes(skinId)) return {};
          return {
            userAchievements: {
              ...state.userAchievements,
              currentSkinId: skinId,
            },
          };
        });
      },

      setCurrentBgm: (bgmId: string) => {
        set((state) => {
          if (!state.userAchievements.unlockedBgmIds.includes(bgmId)) return {};
          return {
            userAchievements: {
              ...state.userAchievements,
              currentBgmId: bgmId,
            },
          };
        });
      },

      setCurrentTitle: (title: string) => {
        set((state) => {
          if (!state.userAchievements.titles.includes(title)) return {};
          return {
            userAchievements: {
              ...state.userAchievements,
              currentTitle: title,
            },
          };
        });
      },

      getCreationWorkshops: () => {
        return get().creationWorkshops;
      },

      submitCreation: (workshopId: string, title: string, content: string, usedPoemIds: string[], usedEventIds: string[]): CreationSubmission => {
        const state = get();
        const workshop = state.creationWorkshops.find(w => w.id === workshopId);

        let historicalAccuracy = 50;
        let poeticUsage = 50;
        let creativity = 50;
        let fluency = 50;

        const historicalPoints: string[] = [];
        const poeticPoints: string[] = [];
        const suggestions: string[] = [];

        if (usedEventIds.length > 0) {
          historicalAccuracy += usedEventIds.length * 10;
          historicalPoints.push(`正确引用了${usedEventIds.length}个历史事件，史实基础扎实。`);
        } else {
          suggestions.push('建议在创作中融入更多历史事件，增强史实性。');
        }

        if (usedPoemIds.length >= 2) {
          poeticUsage += usedPoemIds.length * 8;
          poeticPoints.push(`巧妙化用了${usedPoemIds.length}句诗词，文采斐然。`);
        } else {
          suggestions.push('可以尝试引用更多诗词名句，提升文学性。');
        }

        const contentLength = content.length;
        if (contentLength > 200) {
          fluency += 15;
          creativity += 10;
        }
        if (contentLength > 500) {
          fluency += 10;
          creativity += 15;
          historicalPoints.push('内容充实，论述详尽。');
        }

        if (workshop) {
          const requiredPoemsUsed = workshop.requiredPoemIds.filter(id => usedPoemIds.includes(id)).length;
          if (requiredPoemsUsed === workshop.requiredPoemIds.length) {
            poeticUsage += 10;
            poeticPoints.push('完美使用了题目要求的所有诗句！');
          } else if (requiredPoemsUsed > 0) {
            poeticPoints.push(`使用了${requiredPoemsUsed}/${workshop.requiredPoemIds.length}首指定诗词。`);
          }

          const requiredEventsUsed = workshop.requiredEventIds.filter(id => usedEventIds.includes(id)).length;
          if (requiredEventsUsed === workshop.requiredEventIds.length) {
            historicalAccuracy += 10;
            historicalPoints.push('完美结合了所有指定的历史事件！');
          }
        }

        historicalAccuracy = Math.min(100, historicalAccuracy);
        poeticUsage = Math.min(100, poeticUsage);
        creativity = Math.min(100, creativity);
        fluency = Math.min(100, fluency);

        const total = Math.round((historicalAccuracy + poeticUsage + creativity + fluency) / 4);

        if (total >= 80) {
          suggestions.push('作品优秀！继续保持，挑战更高难度吧。');
        } else if (total >= 60) {
          suggestions.push('写得不错，还有提升空间，加油！');
        } else {
          suggestions.push('多学习积累，相信下次会更好！');
        }

        const submission: CreationSubmission = {
          id: `submission-${Date.now()}`,
          workshopId,
          title,
          content,
          usedPoemIds,
          usedEventIds,
          score: {
            total,
            historicalAccuracy,
            poeticUsage,
            creativity,
            fluency,
          },
          feedback: {
            historicalPoints,
            poeticPoints,
            suggestions,
          },
          submittedAt: Date.now(),
        };

        set((state) => ({
          creationSubmissions: [submission, ...state.creationSubmissions],
        }));

        return submission;
      },

      getCreationSubmissions: () => {
        return get().creationSubmissions;
      },

      startRaceGame: (mode: 'single' | 'dual') => {
        const state = get();
        const questions: RaceQuestion[] = [];

        const shuffledPoems = [...poems].sort(() => Math.random() - 0.5).slice(0, 8);
        const shuffledEvents = [...events].sort(() => Math.random() - 0.5).slice(0, 4);

        const allDynasties = getAllDynasties();
        const dynastyNames = allDynasties.map(d => d.name);

        for (let i = 0; i < 8; i++) {
          const poem = shuffledPoems[i];
          const correctDynasty = allDynasties.find(d => d.id === poem.dynastyId)!;
          const wrongOptions = dynastyNames
            .filter(name => name !== correctDynasty.name)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

          const options = [...wrongOptions, correctDynasty.name].sort(() => Math.random() - 0.5);

          questions.push({
            id: `race-q-${i}`,
            type: 'poem_to_dynasty',
            question: `「${poem.famousLine}」出自哪个朝代？`,
            options,
            correctAnswer: correctDynasty.name,
            poemId: poem.id,
            dynastyId: poem.dynastyId,
          });
        }

        for (let i = 0; i < 4; i++) {
          const event = shuffledEvents[i];
          const correctDynasty = allDynasties.find(d => d.id === event.dynastyId)!;
          const wrongOptions = dynastyNames
            .filter(name => name !== correctDynasty.name)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

          const options = [...wrongOptions, correctDynasty.name].sort(() => Math.random() - 0.5);

          questions.push({
            id: `race-e-${i}`,
            type: 'event_to_dynasty',
            question: `「${event.name}」发生在哪个朝代？`,
            options,
            correctAnswer: correctDynasty.name,
            eventId: event.id,
            dynastyId: event.dynastyId,
          });
        }

        const shuffledQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 10);

        const players: RacePlayer[] = [
          {
            id: 'player-1',
            name: '我',
            avatar: '👤',
            isCurrentUser: true,
            score: 0,
            correctCount: 0,
            totalTime: 0,
            currentAnswer: null,
            isReady: true,
          },
        ];

        if (mode === 'dual') {
          players.push({
            id: 'player-2',
            name: '诗友小文',
            avatar: '🧑',
            isCurrentUser: false,
            score: 0,
            correctCount: 0,
            totalTime: 0,
            currentAnswer: null,
            isReady: true,
          });
        }

        const game: RaceGame = {
          id: `race-${Date.now()}`,
          status: 'playing',
          players,
          questions: shuffledQuestions,
          currentQuestionIndex: 0,
          startTime: Date.now(),
          winnerId: null,
        };

        set({ currentRaceGame: game });
      },

      answerRaceQuestion: (answer: string) => {
        set((state) => {
          if (!state.currentRaceGame || state.currentRaceGame.status !== 'playing') return {};

          const game = state.currentRaceGame;
          const currentQuestion = game.questions[game.currentQuestionIndex];
          const isCorrect = answer === currentQuestion.correctAnswer;
          const timeTaken = (Date.now() - (game.startTime || Date.now())) / 1000;

          const updatedPlayers = game.players.map((player) => {
            if (player.isCurrentUser) {
              return {
                ...player,
                currentAnswer: answer,
                correctCount: player.correctCount + (isCorrect ? 1 : 0),
                score: player.score + (isCorrect ? Math.max(10, 100 - Math.floor(timeTaken * 2)) : 0),
                totalTime: timeTaken,
              };
            } else {
              const aiCorrect = Math.random() > 0.3;
              const aiTime = timeTaken + (Math.random() * 2 - 1);
              return {
                ...player,
                currentAnswer: aiCorrect ? currentQuestion.correctAnswer : currentQuestion.options[Math.floor(Math.random() * currentQuestion.options.length)],
                correctCount: player.correctCount + (aiCorrect ? 1 : 0),
                score: player.score + (aiCorrect ? Math.max(10, 100 - Math.floor(aiTime * 2)) : 0),
                totalTime: aiTime,
              };
            }
          });

          const nextIndex = game.currentQuestionIndex + 1;
          const isFinished = nextIndex >= game.questions.length;

          let winnerId: string | null = null;
          if (isFinished) {
            const sortedPlayers = [...updatedPlayers].sort((a, b) => {
              if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
              return a.totalTime - b.totalTime;
            });
            winnerId = sortedPlayers[0].id;
          }

          return {
            currentRaceGame: {
              ...game,
              players: updatedPlayers,
              currentQuestionIndex: nextIndex,
              status: isFinished ? 'finished' : 'playing',
              winnerId,
            },
          };
        });
      },

      finishRaceGame: () => {
        set((state) => {
          if (!state.currentRaceGame) return {};
          return {
            raceHistory: [state.currentRaceGame, ...state.raceHistory].slice(0, 20),
            currentRaceGame: null,
          };
        });
      },

      getRaceHistory: () => {
        return get().raceHistory;
      },
    }),
    {
      name: 'shishi-zhixue-storage',
      partialize: (state) => ({
        userProgress: state.userProgress,
        selectedDynastyId: state.selectedDynastyId,
        selectedPoemId: state.selectedPoemId,
        chatMessages: state.chatMessages,
        puzzles: state.puzzles,
        posters: state.posters,
        almanacs: state.almanacs,
        notes: state.notes,
        wrongQuestions: state.wrongQuestions,
        poemQuotes: state.poemQuotes,
        socialPosts: state.socialPosts,
        studyGroup: state.studyGroup,
        aiImages: state.aiImages,
        audioTheaterProgress: state.audioTheaterProgress,
        currentAdventure: state.currentAdventure,
        selectedAdventureId: state.selectedAdventureId,
        currentAudioTheaterId: state.currentAudioTheaterId,
        selectedMapLocationId: state.selectedMapLocationId,
        timeCapsules: state.timeCapsules,
        studyBuddy: state.studyBuddy,
        studyBuddyMessages: state.studyBuddyMessages,
        dailyPoemHistoryList: state.dailyPoemHistoryList,
        userAchievements: state.userAchievements,
        creationSubmissions: state.creationSubmissions,
        raceHistory: state.raceHistory,
      }),
    }
  )
);

export default useAppStore;
