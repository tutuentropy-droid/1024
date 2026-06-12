import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, MapPin, Calendar, Users, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getPoemsByDynastyId, getEventsByDynastyId } from '@/data';
import type { Dynasty } from '@/types';

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  const poems = getPoemsByDynastyId(dynasty.id);
  const events = getEventsByDynastyId(dynasty.id);

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
                {poems.length} 首诗词
              </span>
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
            <div className="mb-4">
              <h4 className="text-sm font-medium text-ink-300 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cinnabar-300" />
                代表诗词
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {poems.map((poem) => (
                  <div
                    key={poem.id}
                    className="p-3 bg-paper-100 rounded-lg hover:bg-paper-200 transition-colors cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/card/${poem.id}`);
                    }}
                  >
                    <p className="font-kai text-sm text-ink-300 mb-1">
                      《{poem.title}》
                    </p>
                    <p className="text-xs text-ink-100">
                      {poem.author} · {poem.famousLine.slice(0, 15)}...
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
  const { dynasties, selectedDynastyId, selectDynasty } = useAppStore();
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
