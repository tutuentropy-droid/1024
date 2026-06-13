import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, MapPin, Calendar, Users, BookOpen, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getPoemsByDynastyId, getEventsByDynastyId, getEventsBySubPeriodId } from '@/data';
import type { Dynasty, DynastySubPeriod, Poem } from '@/types';

interface SubPeriodNodeProps {
  subPeriod: DynastySubPeriod;
  poems: Poem[];
  dynastyColor: string;
  onSelectPoem: (poemId: string) => void;
  index: number;
}

const SubPeriodNode = ({ subPeriod, poems, dynastyColor, onSelectPoem, index }: SubPeriodNodeProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const events = getEventsBySubPeriodId(subPeriod.id);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100 + 200);
    return () => clearTimeout(timer);
  }, [index]);

  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} BC`;
    return `${year} AD`;
  };

  const handleStartLearning = () => {
    if (poems.length > 0) {
      navigate(`/card/${poems[0].id}`);
    }
  };

  return (
    <div
      ref={nodeRef}
      className={cn(
        'relative pl-6 pb-6 ml-4 transition-all duration-500',
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      )}
    >
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-paper-300 to-paper-400" />
      
      <div
        className={cn(
          'absolute left-0 top-2 w-3 h-3 rounded-full border-3 transition-all duration-300 cursor-pointer z-10',
          'bg-paper-50 border-paper-400 -translate-x-[5px] hover:border-cinnabar-200'
        )}
        style={{ borderColor: isExpanded ? dynastyColor : undefined }}
        onClick={() => setIsExpanded(!isExpanded)}
      />

      <div
        className={cn(
          'ml-3 card-sm cursor-pointer transition-all duration-300',
          isExpanded && 'ring-2 ring-opacity-30 shadow-md'
        )}
        style={{ borderLeftColor: dynastyColor, borderLeftWidth: '3px' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="title-display text-lg text-ink-400">{subPeriod.name}</h4>
              <span
                className="stamp text-xs"
                style={{ transform: 'rotate(-1deg)' }}
              >
                {poems.length} 首诗词
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink-100">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatYear(subPeriod.startYear)} - {formatYear(subPeriod.endYear)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-ink-100" />
            ) : (
              <ChevronRight className="w-4 h-4 text-ink-100" />
            )}
          </div>
        </div>

        <p className="text-xs text-ink-200 mb-3 leading-relaxed">
          {subPeriod.description.slice(0, 80)}...
        </p>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {subPeriod.keyFeatures.slice(0, 3).map((feature, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 text-xs rounded-full"
              style={{ backgroundColor: `${dynastyColor}15`, color: dynastyColor }}
            >
              {feature}
            </span>
          ))}
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-paper-200 animate-fade-in-up">
            {poems.length > 0 && (
              <div className="mb-3">
                <h5 className="text-xs font-medium text-ink-300 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cinnabar-300" />
                  经典诗词
                </h5>
                <div className="space-y-1.5">
                  {poems.map((poem) => (
                    <div
                      key={poem.id}
                      className="p-2 bg-paper-100 rounded-lg hover:bg-paper-200 transition-colors cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/card/${poem.id}`);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-kai text-sm text-ink-300">
                            《{poem.title}》
                          </p>
                          <p className="text-xs text-ink-100">
                            {poem.author}
                          </p>
                        </div>
                        <span
                          className={cn(
                            'text-xs px-1.5 py-0.5 rounded',
                            poem.difficulty === 'easy' && 'bg-jade-50 text-jade-300',
                            poem.difficulty === 'medium' && 'bg-gold-50 text-gold-300',
                            poem.difficulty === 'hard' && 'bg-cinnabar-50 text-cinnabar-300'
                          )}
                        >
                          {poem.difficulty === 'easy' ? '易' : poem.difficulty === 'medium' ? '中' : '难'}
                        </span>
                      </div>
                      {events.length > 0 && (
                        <p className="text-xs text-ink-100 mt-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-gold-300" />
                          反映史实：{events[0].name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {events.length > 0 && (
              <div className="mb-3">
                <h5 className="text-xs font-medium text-ink-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cobalt-300" />
                  历史事件
                </h5>
                <div className="space-y-1.5">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="p-2 bg-gold-50/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-ink-300">
                          {event.name}
                        </span>
                        <span className="text-xs text-ink-100">
                          {formatYear(event.year)}
                        </span>
                      </div>
                      <p className="text-xs text-ink-200 leading-relaxed">
                        {event.description.slice(0, 50)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              className="w-full btn-secondary text-center text-sm flex items-center justify-center gap-1.5"
              onClick={(e) => {
                e.stopPropagation();
                handleStartLearning();
              }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              学习此阶段
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface DynastyNodeProps {
  dynasty: Dynasty;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (id: string) => void;
  onExpand: (id: string) => void;
  index: number;
}

const DynastyNode = ({ dynasty, isSelected, isExpanded, onSelect, onExpand, index }: DynastyNodeProps) => {
  const navigate = useNavigate();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { getSubPeriodsByDynastyId, getPoemsBySubPeriodId, userProgress } = useAppStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  const poems = getPoemsByDynastyId(dynasty.id);
  const events = getEventsByDynastyId(dynasty.id);
  const subPeriods = getSubPeriodsByDynastyId(dynasty.id);

  const handleClick = () => {
    if (!isExpanded) {
      onExpand(dynasty.id);
    }
    onSelect(dynasty.id);
  };

  const handleStartLearning = () => {
    if (poems.length > 0) {
      navigate(`/card/${poems[0].id}`);
    }
  };

  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} BC`;
    return `${year} AD`;
  };

  const getStudiedCount = () => {
    return poems.filter(p => userProgress.poemProgress[p.id]?.isStudied).length;
  };

  return (
    <div
      ref={nodeRef}
      className={cn(
        'relative pl-8 pb-12 transition-all duration-700',
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
      )}
    >
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-paper-300 to-paper-400" />
      
      <div
        className={cn(
          'absolute left-0 top-2 w-4 h-4 rounded-full border-4 transition-all duration-300 cursor-pointer z-10',
          isSelected
            ? 'bg-cinnabar-300 border-cinnabar-300 shadow-stamp -translate-x-[7px]'
            : 'bg-paper-50 border-paper-400 -translate-x-[7px] hover:border-cinnabar-200'
        )}
        onClick={handleClick}
      />

      <div
        className={cn(
          'ml-4 card cursor-pointer transition-all duration-300',
          isSelected && 'ring-2 ring-cinnabar-300/50 shadow-lg'
        )}
        onClick={handleClick}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="title-display text-xl text-ink-400">{dynasty.name}</h3>
              <span
                className="stamp text-xs"
                style={{ transform: 'rotate(-2deg)' }}
              >
                {getStudiedCount()}/{poems.length} 已学习
              </span>
              {userProgress.currentDifficulty && (
                <span className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full',
                  userProgress.currentDifficulty === 'easy' && 'bg-jade-50 text-jade-300',
                  userProgress.currentDifficulty === 'medium' && 'bg-gold-50 text-gold-300',
                  userProgress.currentDifficulty === 'hard' && 'bg-cinnabar-50 text-cinnabar-300'
                )}>
                  {userProgress.currentDifficulty === 'easy' ? '简单模式' : 
                   userProgress.currentDifficulty === 'medium' ? '中等模式' : '困难模式'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-ink-100">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatYear(dynasty.startYear)} - {formatYear(dynasty.endYear)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {dynasty.capital}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: dynasty.color }}
            />
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-ink-100" />
            ) : (
              <ChevronRight className="w-5 h-5 text-ink-100" />
            )}
          </div>
        </div>

        <p className="text-sm text-ink-200 mb-4 leading-relaxed">
          {dynasty.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {dynasty.famousPoets.slice(0, 4).map((poet, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 bg-cobalt-50 text-cobalt-300 text-xs rounded-full"
            >
              <Users className="w-3 h-3" />
              {poet}
            </span>
          ))}
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-paper-200 animate-fade-in-up">
            {subPeriods.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-ink-300 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cinnabar-300" />
                  详细子时间线
                </h4>
                <div className="space-y-0">
                  {subPeriods.map((subPeriod, subIndex) => (
                    <SubPeriodNode
                      key={subPeriod.id}
                      subPeriod={subPeriod}
                      poems={getPoemsBySubPeriodId(subPeriod.id)}
                      dynastyColor={dynasty.color}
                      onSelectPoem={(poemId) => navigate(`/card/${poemId}`)}
                      index={subIndex}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <h4 className="text-sm font-medium text-ink-300 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cinnabar-300" />
                代表诗词
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {poems.map((poem) => (
                  <div
                    key={poem.id}
                    className={cn(
                      'p-3 rounded-lg hover:bg-paper-200 transition-colors cursor-pointer group',
                      userProgress.poemProgress[poem.id]?.isStudied 
                        ? 'bg-jade-50/50 border border-jade-100' 
                        : 'bg-paper-100'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/card/${poem.id}`);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-kai text-sm text-ink-300 mb-1">
                          《{poem.title}》
                        </p>
                        <p className="text-xs text-ink-100">
                          {poem.author}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'text-xs px-1.5 py-0.5 rounded',
                          poem.difficulty === 'easy' && 'bg-jade-50 text-jade-300',
                          poem.difficulty === 'medium' && 'bg-gold-50 text-gold-300',
                          poem.difficulty === 'hard' && 'bg-cinnabar-50 text-cinnabar-300'
                        )}
                      >
                        {poem.difficulty === 'easy' ? '易' : 
                         poem.difficulty === 'medium' ? '中' : '难'}
                      </span>
                    </div>
                    <p className="text-xs text-ink-100 mt-1">
                      {poem.famousLine.slice(0, 15)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {events.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-ink-300 mb-2">关键历史事件</h4>
                <div className="space-y-2">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-2 bg-gold-50/50 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-gold-300 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-ink-300">
                          {event.name} ({formatYear(event.year)})
                        </p>
                        <p className="text-xs text-ink-100 mt-0.5">
                          {event.description.slice(0, 50)}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              className="w-full btn-primary text-center flex items-center justify-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleStartLearning();
              }}
            >
              <BookOpen className="w-4 h-4" />
              开始学习
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DynastyTimeline = () => {
  const { dynasties, selectedDynastyId, selectDynasty, userProgress } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSelect = (id: string) => {
    selectDynasty(selectedDynastyId === id ? null : id);
    if (selectedDynastyId !== id) {
      setExpandedId(id);
    }
  };

  return (
    <div className="relative py-8">
      {userProgress.totalQuizzesTaken > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-cobalt-50 to-gold-50 rounded-xl border border-cobalt-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink-300 mb-1">智能学习进度</p>
              <p className="text-xs text-ink-200">
                已完成 {userProgress.totalQuizzesTaken} 次测试，平均正确率 {(userProgress.averageAccuracy * 100).toFixed(0)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-cobalt-300">
                当前难度：{userProgress.currentDifficulty === 'easy' ? '简单' : 
                           userProgress.currentDifficulty === 'medium' ? '中等' : '困难'}
              </p>
              <p className="text-xs text-ink-200">
                已学习 {userProgress.totalPoemsStudied} 首诗词
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-paper-300 via-paper-400 to-paper-300" />
      
      <div className="space-y-0">
        {dynasties.map((dynasty, index) => (
          <DynastyNode
            key={dynasty.id}
            dynasty={dynasty}
            isSelected={selectedDynastyId === dynasty.id}
            isExpanded={expandedId === dynasty.id}
            onSelect={handleSelect}
            onExpand={handleExpand}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default DynastyTimeline;