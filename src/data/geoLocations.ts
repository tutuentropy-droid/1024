import type { GeoLocation } from '@/types';

export const geoLocations: GeoLocation[] = [
  {
    id: 'geo-changan',
    name: '长安',
    modernName: '西安',
    x: 50,
    y: 40,
    dynastyId: 'tang',
    poemIds: ['poem-tang-1', 'poem-tang-sheng-1'],
    eventIds: ['event-tang-2'],
    description: '唐朝都城，当时世界上最大的城市之一，丝绸之路的起点。',
  },
  {
    id: 'geo-luoyang',
    name: '洛阳',
    modernName: '洛阳',
    x: 58,
    y: 42,
    dynastyId: 'han',
    poemIds: [],
    eventIds: ['event-han-2'],
    description: '东汉都城，丝绸之路的东方起点之一。',
  },
  {
    id: 'geo-kaifeng',
    name: '东京',
    modernName: '开封',
    x: 60,
    y: 45,
    dynastyId: 'song',
    poemIds: ['poem-song-1'],
    eventIds: ['event-song-1', 'event-song-2'],
    description: '北宋都城，当时世界上最繁华的城市之一。',
  },
  {
    id: 'geo-hangzhou',
    name: '临安',
    modernName: '杭州',
    x: 72,
    y: 52,
    dynastyId: 'song',
    poemIds: ['poem-song-3', 'poem-song-4'],
    eventIds: ['event-song-3'],
    description: '南宋都城，经济文化繁荣，有"上有天堂，下有苏杭"的美誉。',
  },
  {
    id: 'geo-dadu',
    name: '大都',
    modernName: '北京',
    x: 65,
    y: 30,
    dynastyId: 'yuan',
    poemIds: ['poem-yuan-1'],
    eventIds: ['event-yuan-1'],
    description: '元朝都城，是当时世界上最大的城市之一。',
  },
];

export const getAllGeoLocations = (): GeoLocation[] => {
  return geoLocations;
};

export const getGeoLocationsByDynastyId = (dynastyId: string): GeoLocation[] => {
  return geoLocations.filter(g => g.dynastyId === dynastyId);
};

export const getGeoLocationById = (id: string): GeoLocation | undefined => {
  return geoLocations.find(g => g.id === id);
};
