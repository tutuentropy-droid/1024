import { dynasties } from './dynasties';
import { poems } from './poems';
import { events } from './events';
import type { Dynasty, Poem, HistoricalEvent } from '@/types';

export { dynasties, poems, events };

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
    p.content.some(line => line.toLowerCase().includes(lowerKeyword)) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  );
};
