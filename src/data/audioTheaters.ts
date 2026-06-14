import type { AudioTheater } from '@/types';

export const audioTheaters: AudioTheater[] = [];

export const getAllAudioTheaters = (): AudioTheater[] => {
  return audioTheaters;
};

export const getAudioTheaterById = (id: string): AudioTheater | undefined => {
  return audioTheaters.find(t => t.id === id);
};

export const getAudioTheatersByDynastyId = (dynastyId: string): AudioTheater[] => {
  return audioTheaters.filter(t => t.dynastyId === dynastyId);
};
