import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, X, BookOpen, Clock, ChevronRight, Filter,
  Navigation, Sparkles, User, Calendar, Mountain, Compass,
  ZoomIn, ZoomOut, Maximize2, Play, Pause, RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getPoemById, getDynastyById, getEventById, getSubPeriodsByDynastyId } from '@/data';
import type { GeoLocation, Poem, HistoricalEvent } from '@/types';

interface JourneyTrail {
  poetName: string;
  dynastyId: string;
  locations: { locId: string; poemId: string; year: number; description: string }[];
}

const journeyTrails: JourneyTrail[] = [
  {
    poetName: '李白',
    dynastyId: 'tang',
    locations: [
      { locId: 'loc-changan', poemId: 'poem-tang-sheng-2', year: 742, description: '供奉翰林，醉写清平调' },
      { locId: 'loc-lushan', poemId: 'poem-tang-1', year: 756, description: '望庐山瀑布，留下千古绝唱' },
      { locId: 'loc-youzhoutai', poemId: 'poem-tang-chu-1', year: 752, description: '北游燕赵，登幽州台怀古' },
    ],
  },
  {
    poetName: '杜甫',
    dynastyId: 'tang',
    locations: [
      { locId: 'loc-changan', poemId: 'poem-tang-4', year: 757, description: '安史之乱中身陷长安' },
      { locId: 'loc-qinhuai', poemId: 'poem-tang-5', year: 770, description: '漂泊秦淮河畔，终老孤舟' },
    ],
  },
  {
    poetName: '苏轼',
    dynastyId: 'song',
    locations: [
      { locId: 'loc-kaifeng', poemId: 'poem-song-north-1', year: 1071, description: '在京为官，参与王安石变法' },
      { locId: 'loc-huangzhou', poemId: 'poem-song-1', year: 1082, description: '贬谪黄州，赤壁怀古' },
      { locId: 'loc-linAn', poemId: 'poem-song-3', year: 1089, description: '知杭州，疏浚西湖筑苏堤' },
    ],
  },
];

const PoetryMapPage = () => {
  const navigate = useNavigate();
  const { geoLocations, dynasties, subPeriods, selectedMapLocationId, selectMapLocation } = useAppStore();
  const [selectedDynastyFilter, setSelectedDynastyFilter] = useState<string | null>(null);
  const [selectedSubPeriodFilter, setSelectedSubPeriodFilter] = useState<string | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [activePoetTrail, setActivePoetTrail] = useState<string | null>(null);
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayIndex, setAutoPlayIndex] = useState(0);

  const filteredLocations = useMemo(() => {
    let result = geoLocations;
    if (selectedDynastyFilter) {
      result = result.filter(loc => loc.dynastyId === selectedDynastyFilter);
    }
    if (selectedSubPeriodFilter) {
      const subPeriodPoems = subPeriods.find(sp => sp.id === selectedSubPeriodFilter)?.poemIds || [];
      result = result.filter(loc => loc.poemIds.some(pid => subPeriodPoems.includes(pid)));
    }
    return result;
  }, [geoLocations, selectedDynastyFilter, selectedSubPeriodFilter, subPeriods]);

  const selectedLocation = selectedMapLocationId
    ? geoLocations.find(loc => loc.id === selectedMapLocationId)
    : null;

  const groupedLocations = useMemo(() => {
    const groups: Record<string, GeoLocation[]> = {};
    filteredLocations.forEach(loc => {
      if (!groups[loc.dynastyId]) groups[loc.dynastyId] = [];
      groups[loc.dynastyId].push(loc);
    });
    return groups;
  }, [filteredLocations]);

  const availableSubPeriods = useMemo(() => {
    if (!selectedDynastyFilter) return [];
    return getSubPeriodsByDynastyId(selectedDynastyFilter);
  }, [selectedDynastyFilter]);

  const activeTrail = useMemo(() => {
    if (!activePoetTrail) return null;
    const trail = journeyTrails.find(t => t.poetName === activePoetTrail);
    if (!trail) return null;
    return {
      ...trail,
      locs: trail.locations
        .map(l => ({ ...l, location: geoLocations.find(gl => gl.id === l.locId) }))
        .filter(l => l.location) as (typeof trail.locations[0] & { location: GeoLocation })[],
    };
  }, [activePoetTrail, geoLocations]);

  const getDynastyColor = (dynastyId: string) => {
    const dynasty = dynasties.find(d => d.id === dynastyId);
    return dynasty?.color || '#999';
  };

  const totalPoemsCount = useMemo(() => {
    return filteredLocations.reduce((sum, loc) => sum + loc.poemIds.length, 0);
  }, [filteredLocations]);

  const autoPlayLocations = useMemo(() => {
    if (!selectedDynastyFilter) return filteredLocations;
    return filteredLocations;
  }, [filteredLocations, selectedDynastyFilter]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setAutoPlayIndex(prev => {
        const next = prev + 1;
        if (next >= autoPlayLocations.length) {
          setIsAutoPlaying(false);
          return 0;
        }
        selectMapLocation(autoPlayLocations[next].id);
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayLocations, selectMapLocation]);

  const handleAutoPlayToggle = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
    } else {
      setIsAutoPlaying(true);
      setAutoPlayIndex(0);
      if (autoPlayLocations.length > 0) {
        selectMapLocation(autoPlayLocations[0].id);
      }
    }
  };

  return (
    <div className={cn(
      'min-h-screen transition-all duration-500',
      isImmersiveMode && 'bg-gradient-to-br from-paper-100 to-paper-200'
    )}>
      <div className={cn(
        'py-6 transition-all duration-500',
        isImmersiveMode && 'py-3'
      )}>
        <div className={cn(
          'container mx-auto px-4 transition-all duration-500',
          isImmersiveMode && 'max-w-full px-2'
        )}>
          <div className={cn(
            'transition-all duration-500',
            isImmersiveMode ? 'max-w-full' : 'max-w-6xl mx-auto'
          )}>
            {!isImmersiveMode && (
              <div className="text-center mb-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-cinnabar-50 to-gold-50 rounded-full border border-cinnabar-100 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span className="text-xs text-ink-200">沉浸式诗词地理探索</span>
                </div>
                <h1 className="title-display text-4xl text-ink-400 mb-3">
                  诗词史沉浸式地图
                </h1>
                <p className="text-ink-200">
                  漫步诗词地理，点击地名探寻诗作与历史，跟随诗人足迹游历山河
                </p>
              </div>
            )}

            <div className={cn(
              'flex flex-wrap items-center gap-2 mb-6 animate-fade-in-up',
              !isImmersiveMode && 'mb-6',
              isImmersiveMode && 'mb-3 px-2'
            )} style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-2 text-sm text-ink-200 mr-2">
                <Filter className="w-4 h-4" />
                {!isImmersiveMode && <span>朝代筛选：</span>}
              </div>
              <button
                onClick={() => { setSelectedDynastyFilter(null); setSelectedSubPeriodFilter(null); }}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm transition-all duration-300',
                  !selectedDynastyFilter
                    ? 'bg-cinnabar-300 text-paper-50 shadow-md'
                    : 'bg-paper-200 text-ink-200 hover:bg-paper-300'
                )}
              >
                全部
              </button>
              {dynasties.map(dynasty => {
                const hasLocations = geoLocations.some(loc => loc.dynastyId === dynasty.id);
                if (!hasLocations) return null;
                return (
                  <button
                    key={dynasty.id}
                    onClick={() => {
                      setSelectedDynastyFilter(
                        selectedDynastyFilter === dynasty.id ? null : dynasty.id
                      );
                      setSelectedSubPeriodFilter(null);
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm transition-all duration-300',
                      selectedDynastyFilter === dynasty.id
                        ? 'text-paper-50 shadow-md'
                        : 'text-ink-200 hover:opacity-80'
                    )}
                    style={selectedDynastyFilter === dynasty.id
                      ? { backgroundColor: dynasty.color }
                      : { backgroundColor: `${dynasty.color}20`, color: dynasty.color }
                    }
                  >
                    {dynasty.name}
                  </button>
                );
              })}

              <div className="w-px h-6 bg-paper-300 mx-1" />

              <button
                onClick={handleAutoPlayToggle}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm transition-all duration-300 inline-flex items-center gap-1.5',
                  isAutoPlaying
                    ? 'bg-gold-300 text-paper-50 shadow-md'
                    : 'bg-paper-200 text-ink-200 hover:bg-paper-300'
                )}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isAutoPlaying ? '暂停导览' : '自动导览'}
              </button>

              <button
                onClick={() => setIsImmersiveMode(!isImmersiveMode)}
                className="px-3 py-1.5 rounded-full text-sm transition-all duration-300 bg-paper-200 text-ink-200 hover:bg-paper-300 inline-flex items-center gap-1.5 ml-auto"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                {isImmersiveMode ? '退出沉浸' : '沉浸模式'}
              </button>
            </div>

            {availableSubPeriods.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in-up px-2" style={{ animationDelay: '150ms' }}>
                <div className="flex items-center gap-2 text-sm text-ink-200 mr-2">
                  <Calendar className="w-4 h-4" />
                  <span>分期：</span>
                </div>
                <button
                  onClick={() => setSelectedSubPeriodFilter(null)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs transition-all duration-300',
                    !selectedSubPeriodFilter
                      ? 'bg-ink-300 text-paper-50'
                      : 'bg-paper-200 text-ink-200 hover:bg-paper-300'
                  )}
                >
                  全部时期
                </button>
                {availableSubPeriods.map(sp => (
                  <button
                    key={sp.id}
                    onClick={() => setSelectedSubPeriodFilter(
                      selectedSubPeriodFilter === sp.id ? null : sp.id
                    )}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs transition-all duration-300',
                      selectedSubPeriodFilter === sp.id
                        ? 'text-paper-50 shadow-sm'
                        : 'text-ink-200 hover:opacity-80'
                    )}
                    style={selectedSubPeriodFilter === sp.id
                      ? { backgroundColor: getDynastyColor(sp.dynastyId) }
                      : { backgroundColor: `${getDynastyColor(sp.dynastyId)}15`, color: getDynastyColor(sp.dynastyId) }
                    }
                  >
                    {sp.name}
                  </button>
                ))}
              </div>
            )}

            {selectedDynastyFilter && (
              <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in-up px-2" style={{ animationDelay: '170ms' }}>
                <div className="flex items-center gap-2 text-sm text-ink-200 mr-2">
                  <Navigation className="w-4 h-4" />
                  <span>诗人足迹：</span>
                </div>
                {journeyTrails
                  .filter(t => t.dynastyId === selectedDynastyFilter)
                  .map(trail => (
                    <button
                      key={trail.poetName}
                      onClick={() => setActivePoetTrail(
                        activePoetTrail === trail.poetName ? null : trail.poetName
                      )}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm transition-all duration-300 inline-flex items-center gap-1.5',
                        activePoetTrail === trail.poetName
                          ? 'ring-2 ring-offset-1 shadow-md text-paper-50'
                          : 'bg-paper-100 text-ink-200 hover:bg-paper-200'
                      )}
                      style={activePoetTrail === trail.poetName
                        ? { backgroundColor: getDynastyColor(trail.dynastyId), ['--tw-ring-color' as any]: getDynastyColor(trail.dynastyId) }
                        : {}
                      }
                    >
                      <User className="w-3.5 h-3.5" />
                      {trail.poetName}游踪
                    </button>
                  ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={cn(
                'lg:col-span-2 animate-fade-in-up',
                isImmersiveMode && 'lg:col-span-3'
              )} style={{ animationDelay: '200ms' }}>
                <div className="card p-2 relative overflow-hidden group" style={{ minHeight: isImmersiveMode ? '65vh' : '480px' }}>
                  <div className="absolute top-3 right-3 z-20 flex gap-2">
                    <button
                      onClick={() => setZoom(z => Math.min(z + 0.2, 1.6))}
                      className="w-8 h-8 rounded-lg bg-paper-50/90 backdrop-blur-sm border border-paper-200 flex items-center justify-center text-ink-200 hover:text-ink-400 hover:bg-paper-100 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))}
                      className="w-8 h-8 rounded-lg bg-paper-50/90 backdrop-blur-sm border border-paper-200 flex items-center justify-center text-ink-200 hover:text-ink-400 hover:bg-paper-100 transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoom(1)}
                      className="w-8 h-8 rounded-lg bg-paper-50/90 backdrop-blur-sm border border-paper-200 flex items-center justify-center text-ink-200 hover:text-ink-400 hover:bg-paper-100 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <svg
                    viewBox="0 0 100 80"
                    className="w-full h-auto transition-transform duration-500 ease-out"
                    style={{
                      minHeight: isImmersiveMode ? '60vh' : '440px',
                      transform: `scale(${zoom})`,
                      transformOrigin: 'center center'
                    }}
                  >
                    <defs>
                      <radialGradient id="mapBg" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#F5F0E8" />
                        <stop offset="100%" stopColor="#E8DFCE" />
                      </radialGradient>
                      {dynasties.map(dynasty => (
                        <radialGradient key={dynasty.id} id={`glow-${dynasty.id}`} cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor={dynasty.color} stopOpacity="0.4" />
                          <stop offset="100%" stopColor={dynasty.color} stopOpacity="0" />
                        </radialGradient>
                      ))}
                      <filter id="markerShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodOpacity="0.35" />
                      </filter>
                      <filter id="trailGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <pattern id="paperTexture" patternUnits="userSpaceOnUse" width="4" height="4">
                        <rect width="4" height="4" fill="transparent" />
                        <circle cx="2" cy="2" r="0.15" fill="#C4B99A" opacity="0.2" />
                      </pattern>
                    </defs>

                    <rect x="0" y="0" width="100" height="80" fill="url(#mapBg)" rx="4" />
                    <rect x="0" y="0" width="100" height="80" fill="url(#paperTexture)" rx="4" />

                    <path
                      d="M18,8 L28,6 L38,5 L48,6 L58,5 L68,7 L78,6 L85,10 L88,18 L90,28 L88,38 L85,45 L82,50 L78,55 L72,60 L65,65 L58,68 L50,70 L42,68 L35,64 L28,58 L22,52 L18,45 L15,38 L14,30 L15,20 L17,12 Z"
                      fill="none"
                      stroke="#B8A888"
                      strokeWidth="0.6"
                      strokeDasharray="3,1.5"
                      opacity="0.5"
                    />

                    <path
                      d="M20,10 L30,8 L40,7 L50,8 L60,7 L70,9 L80,12 L84,20 L86,30 L84,40 L80,48 L76,53 L70,58 L62,63 L54,66 L46,68 L38,66 L30,60 L24,54 L20,46 L17,38 L16,28 L18,18 Z"
                      fill="#EBE3D3"
                      stroke="#A89878"
                      strokeWidth="0.8"
                      opacity="0.5"
                    />

                    <path
                      d="M35,20 Q45,18 55,22 Q65,26 62,34 Q58,42 50,45 Q42,48 38,44 Q34,40 35,20 Z"
                      fill="#D4C9B0"
                      opacity="0.25"
                    />
                    <path
                      d="M58,30 Q70,28 75,36 Q80,44 74,52 Q68,60 60,56 Q52,52 50,44 Q48,36 58,30 Z"
                      fill="#D4C9B0"
                      opacity="0.2"
                    />
                    <path
                      d="M25,35 Q32,33 35,40 Q38,47 32,52 Q26,57 22,52 Q18,47 20,40 Q22,35 25,35 Z"
                      fill="#D4C9B0"
                      opacity="0.2"
                    />

                    <line x1="15" y1="40" x2="90" y2="40" stroke="#C4B99A" strokeWidth="0.15" strokeDasharray="1,0.5" />
                    <line x1="55" y1="5" x2="55" y2="75" stroke="#C4B99A" strokeWidth="0.15" strokeDasharray="1,0.5" />

                    <text x="8" y="20" fill="#B8A888" fontSize="3.5" fontFamily="serif" fontWeight="bold">北</text>
                    <text x="8" y="62" fill="#B8A888" fontSize="3.5" fontFamily="serif" fontWeight="bold">南</text>
                    <text x="4" y="42" fill="#B8A888" fontSize="3.5" fontFamily="serif" fontWeight="bold">西</text>
                    <text x="93" y="42" fill="#B8A888" fontSize="3.5" fontFamily="serif" fontWeight="bold">东</text>

                    <text x="44" y="18" fill="#B8A888" fontSize="2.8" fontFamily="serif" opacity="0.55">河套</text>
                    <text x="28" y="37" fill="#B8A888" fontSize="2.8" fontFamily="serif" opacity="0.55">西域</text>
                    <text x="59" y="33" fill="#B8A888" fontSize="2.8" fontFamily="serif" opacity="0.55">中原</text>
                    <text x="71" y="50" fill="#B8A888" fontSize="2.8" fontFamily="serif" opacity="0.55">江南</text>
                    <text x="54" y="62" fill="#B8A888" fontSize="2.8" fontFamily="serif" opacity="0.55">岭南</text>
                    <text x="78" y="32" fill="#B8A888" fontSize="2.5" fontFamily="serif" opacity="0.45">关东</text>
                    <text x="38" y="58" fill="#B8A888" fontSize="2.5" fontFamily="serif" opacity="0.45">巴蜀</text>

                    {activeTrail && activeTrail.locs.length >= 2 && (
                      <g className="animate-fade-in">
                        {activeTrail.locs.slice(0, -1).map((loc, idx) => {
                          const next = activeTrail.locs[idx + 1];
                          const color = getDynastyColor(activeTrail.dynastyId);
                          const midX = (loc.location.x + next.location.x) / 2;
                          const midY = (loc.location.y + next.location.y) / 2 - 3;
                          return (
                            <g key={`trail-${idx}`}>
                              <path
                                d={`M ${loc.location.x} ${loc.location.y} Q ${midX} ${midY} ${next.location.x} ${next.location.y}`}
                                fill="none"
                                stroke={color}
                                strokeWidth="0.5"
                                strokeDasharray="1.2,0.8"
                                opacity="0.7"
                                filter="url(#trailGlow)"
                                className="animate-draw-line"
                              />
                              <circle cx={midX} cy={midY - 0.5} r="0.8" fill={color} opacity="0.6" />
                              <text x={midX} y={midY - 2} textAnchor="middle" fill={color} fontSize="1.8" fontFamily="serif">
                                {idx + 1}→{idx + 2}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    )}

                    {filteredLocations.map(loc => {
                      const color = getDynastyColor(loc.dynastyId);
                      const isSelected = selectedMapLocationId === loc.id;
                      const isHovered = hoveredLocation === loc.id;
                      const isOnTrail = activeTrail?.locs.some(l => l.locId === loc.id);
                      const trailOrder = activeTrail?.locs.findIndex(l => l.locId === loc.id);

                      return (
                        <g
                          key={loc.id}
                          onClick={() => selectMapLocation(loc.id)}
                          onMouseEnter={() => setHoveredLocation(loc.id)}
                          onMouseLeave={() => setHoveredLocation(null)}
                          className="cursor-pointer"
                        >
                          {(isSelected || isHovered) && (
                            <circle
                              cx={loc.x}
                              cy={loc.y}
                              r="7"
                              fill={`url(#glow-${loc.dynastyId})`}
                              className="animate-pulse-slow"
                            />
                          )}

                          {isOnTrail && (
                            <circle
                              cx={loc.x}
                              cy={loc.y}
                              r="4"
                              fill="none"
                              stroke={color}
                              strokeWidth="0.4"
                              strokeDasharray="0.8,0.4"
                              opacity="0.8"
                            />
                          )}

                          <circle
                            cx={loc.x}
                            cy={loc.y}
                            r={isSelected ? 3 : isHovered ? 2.6 : 2.1}
                            fill={color}
                            stroke="white"
                            strokeWidth="0.6"
                            filter="url(#markerShadow)"
                            className="transition-all duration-300"
                            style={{
                              transformOrigin: `${loc.x}px ${loc.y}px`,
                              animation: isSelected ? 'bounce-in 0.5s ease-out' : 'marker-pulse 2.5s ease-in-out infinite',
                              animationDelay: `${Math.random() * 0.5}s`,
                            }}
                          />

                          {isOnTrail && trailOrder !== undefined && (
                            <circle
                              cx={loc.x}
                              cy={loc.y}
                              r="1.2"
                              fill="white"
                            />
                          )}

                          {(isSelected || isHovered || loc.poemIds.length > 2) && (
                            <text
                              x={loc.x}
                              y={loc.y - 4.2}
                              textAnchor="middle"
                              fill={color}
                              fontSize={isSelected ? 3.3 : isHovered ? 3 : 2.5}
                              fontWeight={isSelected ? 'bold' : '600'}
                              fontFamily="serif"
                              className="pointer-events-none drop-shadow-sm"
                              style={{
                                paintOrder: 'stroke',
                                stroke: 'rgba(255,255,255,0.9)',
                                strokeWidth: '0.4'
                              }}
                            >
                              {loc.name}
                            </text>
                          )}

                          {loc.poemIds.length >= 3 && !isSelected && !isHovered && (
                            <g>
                              <circle
                                cx={loc.x + 2.5}
                                cy={loc.y - 2.5}
                                r="1.3"
                                fill={color}
                                stroke="white"
                                strokeWidth="0.35"
                              />
                              <text
                                x={loc.x + 2.5}
                                y={loc.y - 2}
                                textAnchor="middle"
                                fill="white"
                                fontSize="1.5"
                                fontWeight="bold"
                                className="pointer-events-none"
                              >
                                {loc.poemIds.length}
                              </text>
                            </g>
                          )}

                          {isHovered && !isSelected && (
                            <g className="animate-fade-in">
                              <rect
                                x={loc.x - 10}
                                y={loc.y + 3.5}
                                width="20"
                                height="5.5"
                                rx="1.2"
                                fill="white"
                                stroke={color}
                                strokeWidth="0.35"
                                opacity="0.97"
                                filter="url(#markerShadow)"
                              />
                              <text
                                x={loc.x}
                                y={loc.y + 5.8}
                                textAnchor="middle"
                                fill="#444"
                                fontSize="1.9"
                                fontFamily="sans-serif"
                                className="pointer-events-none"
                              >
                                {loc.poemIds.length}首诗词 · {loc.eventIds.length}事件
                              </text>
                              <text
                                x={loc.x}
                                y={loc.y + 7.8}
                                textAnchor="middle"
                                fill="#888"
                                fontSize="1.5"
                                className="pointer-events-none"
                              >
                                {loc.modernName}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}

                    {selectedLocation && (
                      <g className="animate-fade-in">
                        <line
                          x1={selectedLocation.x}
                          y1={selectedLocation.y}
                          x2={selectedLocation.x + 22}
                          y2={selectedLocation.y - 18}
                          stroke={getDynastyColor(selectedLocation.dynastyId)}
                          strokeWidth="0.35"
                          strokeDasharray="1.2,0.6"
                          opacity="0.7"
                        />
                        <circle
                          cx={selectedLocation.x + 22}
                          cy={selectedLocation.y - 18}
                          r="0.8"
                          fill={getDynastyColor(selectedLocation.dynastyId)}
                        />
                      </g>
                    )}

                    {isAutoPlaying && autoPlayLocations.length > 0 && (
                      <g className="animate-fade-in">
                        <rect
                          x="2"
                          y="2"
                          width="28"
                          height="5"
                          rx="1"
                          fill="white"
                          stroke={getDynastyColor(autoPlayLocations[0].dynastyId)}
                          strokeWidth="0.3"
                          opacity="0.95"
                        />
                        <text x="5" y="5.2" fill="#666" fontSize="2.2" fontFamily="sans-serif">
                          导览中 {autoPlayIndex + 1}/{autoPlayLocations.length}
                        </text>
                      </g>
                    )}
                  </svg>

                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="bg-paper-50/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-paper-200 text-xs text-ink-200 inline-flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {filteredLocations.length} 处地标 · {totalPoemsCount} 首诗词
                    </div>
                    <div className="bg-paper-50/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-paper-200 text-xs text-ink-200 inline-flex items-center gap-1.5">
                      <Mountain className="w-3 h-3" />
                      {activeTrail ? `${activeTrail.poetName}足迹` : '暂无轨迹'}
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-paper-50/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-paper-200 text-xs text-ink-200 inline-flex items-center gap-1.5">
                    <Compass className="w-3 h-3" />
                    缩放 {(zoom * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {(selectedLocation || !isImmersiveMode) && (
                <div className={cn(
                  'animate-fade-in-up',
                  isImmersiveMode && 'hidden'
                )} style={{ animationDelay: '300ms' }}>
                  {selectedLocation ? (
                    <LocationDetail
                      location={selectedLocation}
                      trailInfo={activeTrail?.locs.find(l => l.locId === selectedLocation.id)}
                      poetName={activeTrail?.poetName}
                      onClose={() => selectMapLocation(null)}
                      onNavigate={navigate}
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="card p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-paper-200 to-paper-300 rounded-full flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-ink-100" />
                        </div>
                        <h3 className="title-display text-xl text-ink-300 mb-2">
                          选择地点
                        </h3>
                        <p className="text-ink-100 text-sm">
                          点击地图上的标记，探索该地的诗词与历史故事
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-ink-300 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          诗词地理概览
                        </h3>
                        {Object.entries(groupedLocations).map(([dynastyId, locations]) => {
                          const dynasty = dynasties.find(d => d.id === dynastyId);
                          if (!dynasty) return null;
                          return (
                            <div key={dynastyId} className="card p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div
                                  className="w-3 h-3 rounded-full shadow-sm"
                                  style={{ backgroundColor: dynasty.color }}
                                />
                                <span className="font-medium text-ink-300 text-sm">{dynasty.name}</span>
                                <span className="text-xs text-ink-100">
                                  {locations.reduce((s, l) => s + l.poemIds.length, 0)}首·{locations.length}处
                                </span>
                              </div>
                              <div className="space-y-2">
                                {locations.map(loc => (
                                  <button
                                    key={loc.id}
                                    onClick={() => selectMapLocation(loc.id)}
                                    className="w-full text-left p-2.5 rounded-lg bg-paper-50 hover:bg-paper-100 transition-all duration-200 flex items-center justify-between group border border-transparent hover:border-paper-200"
                                  >
                                    <div>
                                      <span className="text-sm text-ink-300 font-kai">{loc.name}</span>
                                      <span className="text-xs text-ink-100 ml-2">{loc.modernName}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-ink-100">
                                      <span className="px-1.5 py-0.5 rounded bg-paper-200">{loc.poemIds.length}首</span>
                                      <ChevronRight className="w-3 h-3 group-hover:text-cinnabar-300 transition-colors" />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedLocation && isImmersiveMode && (
                <div className="lg:col-span-3 animate-fade-in-up mt-2">
                  <LocationDetail
                    location={selectedLocation}
                    trailInfo={activeTrail?.locs.find(l => l.locId === selectedLocation.id)}
                    poetName={activeTrail?.poetName}
                    onClose={() => selectMapLocation(null)}
                    onNavigate={navigate}
                    isImmersive
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LocationDetail = ({
  location,
  trailInfo,
  poetName,
  onClose,
  onNavigate,
  isImmersive = false
}: {
  location: GeoLocation;
  trailInfo?: { year: number; description: string; poemId: string };
  poetName?: string;
  onClose: () => void;
  onNavigate: ReturnType<typeof useNavigate>;
  isImmersive?: boolean;
}) => {
  const { dynasties } = useAppStore();
  const dynasty = dynasties.find(d => d.id === location.dynastyId);
  const subPeriods = getSubPeriodsByDynastyId(location.dynastyId);
  const locationPoems = location.poemIds
    .map(id => getPoemById(id))
    .filter(Boolean) as Poem[];
  const locationEvents = location.eventIds
    .map(id => getEventById(id))
    .filter(Boolean) as HistoricalEvent[];

  const groupedBySubPeriod = useMemo(() => {
    const groups: Record<string, Poem[]> = {};
    const uncategorized: Poem[] = [];
    locationPoems.forEach(poem => {
      if (poem.subPeriodId) {
        if (!groups[poem.subPeriodId]) groups[poem.subPeriodId] = [];
        groups[poem.subPeriodId].push(poem);
      } else {
        uncategorized.push(poem);
      }
    });
    return { groups, uncategorized };
  }, [locationPoems]);

  return (
    <div className={cn(
      'card overflow-hidden',
      isImmersive && 'shadow-xl'
    )}>
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${dynasty?.color || '#666'} 0%, ${dynasty?.color || '#666'}cc 100%)`
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <pattern id="diagLines" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="1" opacity="0.3" />
            </pattern>
            <rect width="100" height="100" fill="url(#diagLines)" />
          </svg>
        </div>

        <div className="p-6 relative z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors backdrop-blur-sm"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-2 mb-3 text-white/85 text-sm">
            <MapPin className="w-4 h-4" />
            {dynasty?.name}
            {trailInfo && poetName && (
              <>
                <span className="text-white/50">·</span>
                <span className="inline-flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {poetName}足迹
                </span>
              </>
            )}
          </div>
          <h2 className="title-display text-3xl md:text-4xl mb-1 text-white drop-shadow-sm">
            {location.name}
          </h2>
          <p className="text-white/85 text-sm md:text-base">今{location.modernName}</p>
          {trailInfo && (
            <div className="mt-4 p-3 bg-white/15 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="flex items-center gap-2 text-white/90 text-xs mb-1">
                <Calendar className="w-3.5 h-3.5" />
                {trailInfo.year > 0 ? `公元${trailInfo.year}年` : `公元前${Math.abs(trailInfo.year)}年`}
              </div>
              <p className="text-white text-sm">{trailInfo.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className={cn('p-6', isImmersive && 'p-8')}>
        <div className="mb-6 p-4 bg-gradient-to-r from-paper-100 to-gold-50/50 rounded-xl border border-gold-100/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mountain className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h4 className="font-medium text-ink-300 text-sm mb-1">地理文化</h4>
              <p className="text-ink-200 text-sm leading-relaxed">
                {location.description}
              </p>
            </div>
          </div>
        </div>

        {locationEvents.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-ink-300 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-400" />
              历史事件
              <span className="text-xs text-ink-100 font-normal">· {locationEvents.length}件</span>
            </h3>
            <div className="relative pl-4 space-y-4">
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-gold-200 via-gold-300 to-gold-200 rounded-full" />
              {locationEvents.map((event, idx) => {
                const eventSubPeriod = subPeriods.find(sp => sp.id === event.subPeriodId);
                return (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold-300 border-2 border-white shadow-sm" />
                    <div className="p-4 bg-gradient-to-br from-gold-50/80 to-paper-50 rounded-xl border border-gold-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs bg-gradient-to-r from-gold-200 to-gold-300 text-gold-500 px-2 py-0.5 rounded-full font-medium">
                          {event.year > 0 ? `${event.year}年` : `公元前${Math.abs(event.year)}年`}
                        </span>
                        <span className="text-sm font-semibold text-ink-300">{event.name}</span>
                        {eventSubPeriod && (
                          <span className="text-xs text-ink-100 bg-paper-200 px-1.5 py-0.5 rounded">
                            {eventSubPeriod.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-200 mb-2 leading-relaxed">{event.description}</p>
                      <div className="p-2.5 bg-white/60 rounded-lg border-l-2 border-gold-200">
                        <p className="text-xs text-ink-100 leading-relaxed">
                          <span className="text-gold-400 font-medium">历史影响：</span>
                          {event.impact}
                        </p>
                      </div>
                      {event.relatedPoems && event.relatedPoems.length > 0 && (
                        <div className="mt-2.5 pt-2.5 border-t border-gold-100 flex flex-wrap gap-1.5">
                          {event.relatedPoems.slice(0, 3).map(pid => {
                            const p = getPoemById(pid);
                            if (!p) return null;
                            return (
                              <button
                                key={pid}
                                onClick={() => onNavigate(`/card/${pid}`)}
                                className="text-xs px-2 py-0.5 rounded-full bg-cinnabar-50 text-cinnabar-300 hover:bg-cinnabar-100 transition-colors"
                              >
                                《{p.title}》
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {locationPoems.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-ink-300 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cinnabar-300" />
              相关诗作
              <span className="text-xs text-ink-100 font-normal">· {locationPoems.length}首</span>
            </h3>

            {Object.keys(groupedBySubPeriod.groups).length > 1 && (
              <div className="mb-4 space-y-4">
                {subPeriods.filter(sp => groupedBySubPeriod.groups[sp.id]).map(sp => (
                  <div key={sp.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 rounded-full" style={{ backgroundColor: dynasty?.color || '#666' }} />
                      <h4 className="text-xs font-medium text-ink-200">{sp.name}</h4>
                      <span className="text-xs text-ink-100">
                        ({sp.startYear > 0 ? sp.startYear : `前${Math.abs(sp.startYear)}`}
                        -
                        {sp.endYear > 0 ? sp.endYear : `前${Math.abs(sp.endYear)}`})
                      </span>
                    </div>
                    <div className="space-y-2.5 pl-3">
                      {groupedBySubPeriod.groups[sp.id].map(poem => (
                        <PoemCard
                          key={poem.id}
                          poem={poem}
                          dynastyColor={dynasty?.color || '#666'}
                          onNavigate={onNavigate}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                {groupedBySubPeriod.uncategorized.length > 0 && (
                  <div className="space-y-2.5">
                    {groupedBySubPeriod.uncategorized.map(poem => (
                      <PoemCard
                        key={poem.id}
                        poem={poem}
                        dynastyColor={dynasty?.color || '#666'}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {(Object.keys(groupedBySubPeriod.groups).length <= 1) && (
              <div className="space-y-2.5">
                {locationPoems.map(poem => (
                  <PoemCard
                    key={poem.id}
                    poem={poem}
                    dynastyColor={dynasty?.color || '#666'}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PoemCard = ({
  poem,
  dynastyColor,
  onNavigate
}: {
  poem: Poem;
  dynastyColor: string;
  onNavigate: ReturnType<typeof useNavigate>;
}) => (
  <button
    onClick={() => onNavigate(`/card/${poem.id}`)}
    className="w-full text-left p-4 bg-gradient-to-br from-paper-50 to-white rounded-xl border border-paper-200 hover:border-cinnabar-200 hover:shadow-lg transition-all duration-300 group"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="font-kai text-base text-ink-300 group-hover:text-cinnabar-300 transition-colors">
            《{poem.title}》
          </span>
          <span className="text-xs text-ink-100">{poem.author}</span>
        </div>
        <p className="text-xs text-cinnabar-300 font-kai mb-2 inline-block px-2 py-1 bg-cinnabar-50/60 rounded-lg border border-cinnabar-100/50">
          「{poem.famousLine}」
        </p>
        <p className="text-xs text-ink-100 line-clamp-2 leading-relaxed">
          {poem.background}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {poem.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${dynastyColor}12`, color: dynastyColor }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-ink-100 group-hover:text-cinnabar-300 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
    </div>
  </button>
);

export default PoetryMapPage;
