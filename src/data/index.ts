import { dynasties } from './dynasties';
import { poems } from './poems';
import { events } from './events';
import { subPeriods } from './subPeriods';
import { comparisons } from './comparisons';
import type { Dynasty, Poem, HistoricalEvent, DynastySubPeriod, DynastyComparison, DailyChallenge, DailyChallengeItem } from '@/types';

export { dynasties, poems, events, subPeriods, comparisons };

export const getAllDynasties = (): Dynasty[] => {
  return dynasties.sort((a, b) => a.startYear - b.startYear);
};

export const getDynastyById = (id: string): Dynasty | undefined => {
  return dynasties.find(d => d.id === id);
};

export const getPoemsByDynastyId = (dynastyId: string): Poem[] => {
  return poems.filter(p => p.dynastyId === dynastyId);
};

export const getPoemById = (id: string): Poem | undefined => {
  return poems.find(p => p.id === id);
};

export const getEventsByDynastyId = (dynastyId: string): HistoricalEvent[] => {
  return events.filter(e => e.dynastyId === dynastyId);
};

export const getEventById = (id: string): HistoricalEvent | undefined => {
  return events.find(e => e.id === id);
};

export const getRelatedEventsByPoemId = (poemId: string): HistoricalEvent[] => {
  return events.filter(e => e.relatedPoems?.includes(poemId));
};

export const getDynastyByPoemId = (poemId: string): Dynasty | undefined => {
  const poem = poems.find(p => p.id === poemId);
  if (!poem) return undefined;
  return dynasties.find(d => d.id === poem.dynastyId);
};

export const getAllPoems = (): Poem[] => {
  return poems;
};

export const searchPoems = (keyword: string): Poem[] => {
  const lowerKeyword = keyword.toLowerCase();
  return poems.filter(p => 
    p.title.toLowerCase().includes(lowerKeyword) ||
    p.author.toLowerCase().includes(lowerKeyword) ||
    p.content.some(line => 
      (typeof line === 'string' ? line : line.text).toLowerCase().includes(lowerKeyword)
    ) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  );
};

export const getSubPeriodsByDynastyId = (dynastyId: string): DynastySubPeriod[] => {
  return subPeriods.filter(sp => sp.dynastyId === dynastyId);
};

export const getPoemsBySubPeriodId = (subPeriodId: string): Poem[] => {
  return poems.filter(p => p.subPeriodId === subPeriodId);
};

export const getEventsBySubPeriodId = (subPeriodId: string): HistoricalEvent[] => {
  return events.filter(e => e.subPeriodId === subPeriodId);
};

export const getSubPeriodById = (id: string): DynastySubPeriod | undefined => {
  return subPeriods.find(sp => sp.id === id);
};

export const getSubPeriodByPoemId = (poemId: string): DynastySubPeriod | undefined => {
  const poem = poems.find(p => p.id === poemId);
  if (!poem || !poem.subPeriodId) return undefined;
  return subPeriods.find(sp => sp.id === poem.subPeriodId);
};

export const getPoemsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Poem[] => {
  return poems.filter(p => p.difficulty === difficulty);
};

export const getAllSubPeriods = (): DynastySubPeriod[] => {
  return subPeriods.sort((a, b) => a.startYear - b.startYear);
};

export const getAllComparisons = (): DynastyComparison[] => {
  return comparisons;
};

export const getComparisonById = (id: string): DynastyComparison | undefined => {
  return comparisons.find(c => c.id === id);
};

export const getComparisonsByDynastyId = (dynastyId: string): DynastyComparison[] => {
  return comparisons.filter(c => c.dynastyAId === dynastyId || c.dynastyBId === dynastyId);
};

export const generateComparison = (dynastyAId: string, dynastyBId: string): DynastyComparison | null => {
  const dynA = dynasties.find(d => d.id === dynastyAId);
  const dynB = dynasties.find(d => d.id === dynastyBId);
  if (!dynA || !dynB) return null;

  const existing = comparisons.find(
    c => (c.dynastyAId === dynastyAId && c.dynastyBId === dynastyBId) ||
         (c.dynastyAId === dynastyBId && c.dynastyBId === dynastyAId)
  );
  if (existing) return existing;

  const poemsA = poems.filter(p => p.dynastyId === dynastyAId);
  const poemsB = poems.filter(p => p.dynastyId === dynastyBId);
  const eventsA = events.filter(e => e.dynastyId === dynastyAId);
  const eventsB = events.filter(e => e.dynastyId === dynastyBId);

  const formatYearRange = (start: number, end: number): string => {
    const fmt = (y: number) => y < 0 ? `公元前${Math.abs(y)}年` : `公元${y}年`;
    return `${fmt(start)} - ${fmt(end)}`;
  };

  const durationA = dynA.endYear - dynA.startYear;
  const durationB = dynB.endYear - dynB.startYear;
  const isAOlder = dynA.startYear < dynB.startYear;

  const getPoliticalDesc = (dyn: typeof dynA, evts: HistoricalEvent[]): string => {
    if (evts.length === 0) return `${dyn.name}时期政治记录暂缺。`;
    const keyEvent = evts.find(e => e.impact.includes('统一') || e.impact.includes('盛世') || e.impact.includes('改革'));
    if (keyEvent) return keyEvent.impact;
    return evts[0].impact;
  };

  const getLiteraryForm = (dyn: typeof dynA, pms: Poem[]): string => {
    const authors = [...new Set(pms.map(p => p.author))].slice(0, 3);
    const tags = [...new Set(pms.flatMap(p => p.tags))].slice(0, 3);
    return `${dyn.name}时期代表诗人有${authors.join('、')}等，主要文学题材包括${tags.join('、')}。`;
  };

  const getCoreImagery = (pms: Poem[]): string => {
    const lines = pms.map(p => p.famousLine).slice(0, 3);
    return lines.map(l => `「${l}」`).join('；');
  };

  const getSocialContext = (dyn: typeof dynA, evts: HistoricalEvent[]): string => {
    const isWarPeriod = evts.some(e => e.name.includes('战') || e.name.includes('乱') || e.name.includes('起义') || e.name.includes('篡'));
    const isPeacePeriod = evts.some(e => e.name.includes('盛世') || e.name.includes('之治') || e.name.includes('中兴'));
    if (isWarPeriod) return `${dyn.name}社会动荡，战乱频繁，人民生活困苦，文人多以诗歌反映社会现实和抒发忧愤。`;
    if (isPeacePeriod) return `${dyn.name}社会相对安定，经济繁荣，文化昌盛，文人创作空间广阔，题材多样。`;
    return `${dyn.name}社会状况复杂，既有稳定发展时期，也有动荡变革阶段，文学创作呈现出丰富的时代特征。`;
  };

  const sortedDynA = isAOlder ? dynA : dynB;
  const sortedDynB = isAOlder ? dynB : dynA;
  const sortedPoemsA = isAOlder ? poemsA : poemsB;
  const sortedPoemsB = isAOlder ? poemsB : poemsA;
  const sortedEventsA = isAOlder ? eventsA : eventsB;
  const sortedEventsB = isAOlder ? eventsB : eventsA;

  return {
    id: `comp-auto-${dynastyAId}-${dynastyBId}`,
    dynastyAId: sortedDynA.id,
    dynastyBId: sortedDynB.id,
    title: `${sortedDynA.name}与${sortedDynB.name}诗词意象对比`,
    description: `${sortedDynA.name}（${formatYearRange(sortedDynA.startYear, sortedDynA.endYear)}）与${sortedDynB.name}（${formatYearRange(sortedDynB.startYear, sortedDynB.endYear)}）相隔${Math.abs(sortedDynB.startYear - sortedDynA.endYear)}年，两个朝代的诗词呈现出不同的时代特征和文化意蕴。`,
    dimensions: [
      {
        dimension: '历史时期',
        dynastyAValue: `${sortedDynA.name}（${formatYearRange(sortedDynA.startYear, sortedDynA.endYear)}），历时${durationA}年。${sortedDynA.description.slice(0, 60)}…`,
        dynastyBValue: `${sortedDynB.name}（${formatYearRange(sortedDynB.startYear, sortedDynB.endYear)}），历时${durationB}年。${sortedDynB.description.slice(0, 60)}…`,
      },
      {
        dimension: '政治格局',
        dynastyAValue: getPoliticalDesc(sortedDynA, sortedEventsA),
        dynastyBValue: getPoliticalDesc(sortedDynB, sortedEventsB),
      },
      {
        dimension: '文学风貌',
        dynastyAValue: getLiteraryForm(sortedDynA, sortedPoemsA),
        dynastyBValue: getLiteraryForm(sortedDynB, sortedPoemsB),
      },
      {
        dimension: '核心意象',
        dynastyAValue: getCoreImagery(sortedPoemsA),
        dynastyBValue: getCoreImagery(sortedPoemsB),
      },
      {
        dimension: '社会背景',
        dynastyAValue: getSocialContext(sortedDynA, sortedEventsA),
        dynastyBValue: getSocialContext(sortedDynB, sortedEventsB),
      },
      {
        dimension: '代表诗人',
        dynastyAValue: sortedDynA.famousPoets.slice(0, 4).join('、'),
        dynastyBValue: sortedDynB.famousPoets.slice(0, 4).join('、'),
      },
    ],
    conclusion: `${sortedDynA.name}与${sortedDynB.name}处于中国历史的不同阶段，${sortedDynA.name}的诗词反映了其独特的时代精神，${sortedDynB.name}则呈现出不同的文化特征。两个朝代的诗词对比，展现了中华文学在不同历史条件下的丰富面貌。`,
  };
};

export const getEventsAroundYear = (year: number, range: number = 5): HistoricalEvent[] => {
  return events.filter(e => e.year >= year - range && e.year <= year + range)
    .sort((a, b) => a.year - b.year);
};

export const getEventsAroundPoem = (poemId: string, range: number = 5): HistoricalEvent[] => {
  const poem = poems.find(p => p.id === poemId);
  if (!poem) return [];
  const dynasty = dynasties.find(d => d.id === poem.dynastyId);
  if (!dynasty) return [];
  const midYear = Math.floor((dynasty.startYear + dynasty.endYear) / 2);
  const subPeriod = poem.subPeriodId ? subPeriods.find(sp => sp.id === poem.subPeriodId) : null;
  const refYear = subPeriod ? Math.floor((subPeriod.startYear + subPeriod.endYear) / 2) : midYear;
  return getEventsAroundYear(refYear, range);
};

export const generateDailyChallengeData = (): DailyChallenge => {
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('-').reduce((acc, v) => acc + parseInt(v), 0);
  
  const shuffledPoems = [...poems].sort((a, b) => {
    const ha = (a.id + seed).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const hb = (b.id + seed).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return ha - hb;
  });
  
  const selectedPoems = shuffledPoems.slice(0, 5);
  
  const items: DailyChallengeItem[] = selectedPoems.map((poem, index) => {
    const dynasty = dynasties.find(d => d.id === poem.dynastyId)!;
    return {
      poemId: poem.id,
      famousLine: poem.famousLine,
      dynastyId: poem.dynastyId,
      dynastyName: dynasty.name,
      startYear: dynasty.startYear,
      order: index,
    };
  });
  
  const sortedByYear = [...items].sort((a, b) => a.startYear - b.startYear);
  const correctOrder = sortedByYear.map(item => items.indexOf(item));
  
  const knowledgePoints = selectedPoems.map(poem => {
    const dynasty = dynasties.find(d => d.id === poem.dynastyId)!;
    const insights = Object.values(poem.historicalInsight).filter(Boolean);
    return `${dynasty.name}·${poem.author}《${poem.title}》：${insights[0] || poem.background.slice(0, 50)}`;
  });
  
  return {
    date: today,
    items,
    correctOrder,
    knowledgePoints,
  };
};
