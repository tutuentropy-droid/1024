import type { Poem, QuizQuestion, QuizQuestionType, Dynasty, PoemLine } from '@/types';
import { getDynastyById, getDynastyByPoemId, getSubPeriodByPoemId } from '@/data';

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getLineText = (line: PoemLine | string): string => {
  return typeof line === 'string' ? line : line.text;
};

const generateFillBlankQuestion = (poem: Poem): QuizQuestion | null => {
  if (!poem.content || poem.content.length === 0) return null;

  const line = poem.content[Math.floor(Math.random() * poem.content.length)];
  const contentLine = getLineText(line);
  const chars = contentLine.split('');
  
  if (chars.length < 4) return null;

  const blankStart = Math.floor(Math.random() * (chars.length - 2));
  const blankLength = Math.min(2 + Math.floor(Math.random() * 2), chars.length - blankStart);
  const blank = chars.slice(blankStart, blankStart + blankLength).join('');
  const maskedLine = chars.map((c, i) => 
    i >= blankStart && i < blankStart + blankLength ? '□' : c
  ).join('');

  return {
    id: `q-fill-${poem.id}-${Date.now()}`,
    poemId: poem.id,
    type: 'fill_blank',
    question: `请补全诗句：\n${maskedLine}\n——${poem.author}《${poem.title}》`,
    correctAnswer: blank,
    explanation: `这句诗出自${poem.author}的《${poem.title}》。\n\n完整诗句：${contentLine}\n\n${poem.background}`,
    difficulty: poem.difficulty,
  };
};

const generateAuthorMatchQuestion = (poem: Poem, allPoems: Poem[]): QuizQuestion | null => {
  if (!poem.author) return null;

  const authors = [...new Set(allPoems.map(p => p.author).filter(a => a !== poem.author))];
  const wrongOptions = shuffleArray(authors).slice(0, 3);
  
  if (wrongOptions.length < 3) return null;

  const options = shuffleArray([poem.author, ...wrongOptions]);

  return {
    id: `q-author-${poem.id}-${Date.now()}`,
    poemId: poem.id,
    type: 'author_match',
    question: `请问诗句"${poem.famousLine}"的作者是谁？`,
    options,
    correctAnswer: poem.author,
    explanation: `${poem.famousLine}\n\n出自${poem.author}的《${poem.title}》。\n\n${poem.authorBio}`,
    difficulty: poem.difficulty,
  };
};

const generateDynastyMatchQuestion = (poem: Poem, allDynasties: Dynasty[]): QuizQuestion | null => {
  const dynasty = getDynastyByPoemId(poem.id);
  if (!dynasty) return null;

  const wrongDynasties = shuffleArray(
    allDynasties.filter(d => d.id !== dynasty.id)
  ).slice(0, 3);

  if (wrongDynasties.length < 3) return null;

  const options = shuffleArray([dynasty.name, ...wrongDynasties.map(d => d.name)]);

  return {
    id: `q-dynasty-${poem.id}-${Date.now()}`,
    poemId: poem.id,
    type: 'dynasty_match',
    question: `请问${poem.author}的《${poem.title}》是哪个朝代的作品？`,
    options,
    correctAnswer: dynasty.name,
    explanation: `《${poem.title}》是${dynasty.name}诗人${poem.author}的作品。\n\n${dynasty.description}`,
    difficulty: poem.difficulty,
  };
};

const generateSubPeriodMatchQuestion = (poem: Poem, allPoems: Poem[]): QuizQuestion | null => {
  const subPeriod = getSubPeriodByPoemId(poem.id);
  if (!subPeriod) return null;

  const allSubPeriods = [...new Set(allPoems
    .map(p => getSubPeriodByPoemId(p.id)?.name)
    .filter((name): name is string => name !== undefined && name !== subPeriod.name)
  )];
  
  const wrongOptions = shuffleArray(allSubPeriods).slice(0, 3);
  if (wrongOptions.length < 3) return null;

  const options = shuffleArray([subPeriod.name, ...wrongOptions]);

  return {
    id: `q-subperiod-${poem.id}-${Date.now()}`,
    poemId: poem.id,
    type: 'subperiod_match',
    question: `请问${poem.author}的《${poem.title}》属于哪个历史时期？`,
    options,
    correctAnswer: subPeriod.name,
    explanation: `《${poem.title}》创作于${subPeriod.name}时期（${subPeriod.startYear}-${subPeriod.endYear}年）。\n\n${subPeriod.description}`,
    difficulty: poem.difficulty === 'easy' ? 'medium' : poem.difficulty,
  };
};

const generateTranslationMatchQuestion = (poem: Poem): QuizQuestion | null => {
  if (!poem.content || poem.content.length === 0) return null;

  const lineWithTranslation = poem.content.find(
    line => typeof line !== 'string' && line.translation
  );
  if (!lineWithTranslation || typeof lineWithTranslation === 'string') return null;

  const originalText = lineWithTranslation.text;
  const correctTranslation = lineWithTranslation.translation;

  const wrongTranslations = [
    '描述了边塞的壮丽风光',
    '表达了对故乡的思念之情',
    '抒发了怀才不遇的苦闷',
    '赞美了友人的高尚品德',
  ];
  
  const wrongOptions = shuffleArray(wrongTranslations).slice(0, 3);
  const options = shuffleArray([correctTranslation, ...wrongOptions]);

  return {
    id: `q-translation-${poem.id}-${Date.now()}`,
    poemId: poem.id,
    type: 'translation_match',
    question: `请问诗句"${originalText}"的白话翻译是？`,
    options,
    correctAnswer: correctTranslation,
    explanation: `原句：${originalText}\n\n翻译：${correctTranslation}\n\n这句诗出自${poem.author}的《${poem.title}》。`,
    difficulty: poem.difficulty,
  };
};

const generateHistoryUnderstandQuestion = (poem: Poem): QuizQuestion | null => {
  const insights = poem.historicalInsight;
  if (!insights) return null;

  const insightTypes: (keyof typeof insights)[] = ['politics', 'economy', 'society', 'culture'];
  const availableTypes = insightTypes.filter(t => insights[t]);
  
  if (availableTypes.length === 0) return null;

  const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  const insight = insights[selectedType];

  if (!insight) return null;

  const typeLabels: Record<string, string> = {
    politics: '政治',
    economy: '经济',
    society: '社会',
    culture: '文化',
  };

  const questionTemplates = [
    `从${poem.author}的《${poem.title}》中，我们可以了解到当时哪个方面的历史情况？`,
    `"${poem.famousLine}"这句诗反映了${poem.author}所处时代的什么${typeLabels[selectedType]}状况？`,
    `《${poem.title}》这首诗有助于我们理解${poem.author}时代的哪方面历史？`,
  ];

  const question = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];

  const baseOptions = [
    `反映了当时的${typeLabels[selectedType]}状况`,
    `描写了诗人的个人情感`,
    `记录了神话传说故事`,
    `介绍了科学技术发展`,
  ];

  const options = shuffleArray(baseOptions);

  return {
    id: `q-history-${poem.id}-${Date.now()}`,
    poemId: poem.id,
    type: 'history_understand',
    question,
    options,
    correctAnswer: `反映了当时的${typeLabels[selectedType]}状况`,
    explanation: `历史解读：\n\n${insight}\n\n这正是"以诗证史"的学习方法，通过诗词了解背后的历史。`,
    difficulty: poem.difficulty === 'hard' ? 'hard' : 'medium',
  };
};

export const generateQuestions = (
  poems: Poem[],
  allDynasties: Dynasty[],
  count: number = 5,
  targetDifficulty?: 'easy' | 'medium' | 'hard'
): QuizQuestion[] => {
  if (poems.length === 0) return [];

  const questions: QuizQuestion[] = [];
  const usedPoemIds = new Set<string>();
  const questionTypes: QuizQuestionType[] = [
    'fill_blank', 
    'author_match', 
    'dynasty_match', 
    'subperiod_match',
    'translation_match',
    'history_understand'
  ];

  let attempts = 0;
  const maxAttempts = count * 10;

  const sortedPoems = targetDifficulty 
    ? [...poems].sort((a, b) => {
        const diffOrder: Record<string, number> = { easy: 0, medium: 1, hard: 2 };
        const targetOrder = diffOrder[targetDifficulty];
        const aDiff = Math.abs(diffOrder[a.difficulty] - targetOrder);
        const bDiff = Math.abs(diffOrder[b.difficulty] - targetOrder);
        return aDiff - bDiff;
      })
    : poems;

  while (questions.length < count && attempts < maxAttempts) {
    attempts++;
    
    const availablePoems = sortedPoems.filter(p => !usedPoemIds.has(p.id));
    if (availablePoems.length === 0) break;

    const poem = availablePoems[Math.floor(Math.random() * Math.min(availablePoems.length, 5))];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    let question: QuizQuestion | null = null;

    switch (questionType) {
      case 'fill_blank':
        question = generateFillBlankQuestion(poem);
        break;
      case 'author_match':
        question = generateAuthorMatchQuestion(poem, poems);
        break;
      case 'dynasty_match':
        question = generateDynastyMatchQuestion(poem, allDynasties);
        break;
      case 'subperiod_match':
        question = generateSubPeriodMatchQuestion(poem, poems);
        break;
      case 'translation_match':
        question = generateTranslationMatchQuestion(poem);
        break;
      case 'history_understand':
        question = generateHistoryUnderstandQuestion(poem);
        break;
    }

    if (question) {
      questions.push(question);
      usedPoemIds.add(poem.id);
    }
  }

  return shuffleArray(questions);
};

export const checkAnswer = (question: QuizQuestion, userAnswer: string): boolean => {
  if (question.type === 'fill_blank') {
    return userAnswer.trim() === question.correctAnswer.trim();
  }
  return userAnswer === question.correctAnswer;
};

export const getQuestionTypeLabel = (type: QuizQuestionType): string => {
  const labels: Record<QuizQuestionType, string> = {
    fill_blank: '填空题',
    author_match: '作者匹配',
    dynasty_match: '朝代匹配',
    subperiod_match: '时期匹配',
    translation_match: '翻译理解',
    history_understand: '历史理解',
  };
  return labels[type];
};
