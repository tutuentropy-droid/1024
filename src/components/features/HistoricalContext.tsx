import { useState, useMemo } from 'react';
import { Clock, X, Calendar, Sparkles, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getEventsAroundPoem, getDynastyByPoemId, getPoemById } from '@/data';

interface HistoricalContextProps {
  poemId: string;
}

const formatYear = (year: number): string => {
  if (year < 0) return `${Math.abs(year)} BC`;
  return `${year} AD`;
};

const HistoricalContext = ({ poemId }: HistoricalContextProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const poem = useMemo(() => getPoemById(poemId), [poemId]);
  const dynasty = useMemo(() => poem ? getDynastyByPoemId(poem.id) : undefined, [poem]);

  const events = useMemo(() => {
    if (!poem) return [];
    return getEventsAroundPoem(poem.id, 5);
  }, [poem]);

  const refYear = useMemo(() => {
    if (!dynasty) return 0;
    return Math.floor((dynasty.startYear + dynasty.endYear) / 2);
  }, [dynasty]);

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.year - b.year),
    [events]
  );

  if (!poem || !dynasty) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-secondary inline-flex items-center gap-2 text-sm"
      >
        <Clock className="w-4 h-4" />
        历史语境
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink-400/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-2xl max-h-[85vh] bg-gradient-to-br from-paper-50 via-paper-100 to-paper-200 rounded-2xl shadow-card border border-paper-300 overflow-hidden animate-fade-in-up">
            <div className="sticky top-0 z-10 bg-gradient-to-r from-paper-100 to-paper-200 border-b border-paper-300 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: dynasty.color }}
                />
                <h2 className="title-display text-xl text-ink-400">
                  历史语境
                </h2>
                <Sparkles className="w-4 h-4 text-gold-300" />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-paper-200 text-ink-200 hover:bg-paper-300 transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pt-4 pb-2">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="title-display text-lg text-ink-400">
                  《{poem.title}》
                </h3>
                <span
                  className="stamp text-xs"
                  style={{ transform: 'rotate(-2deg)' }}
                >
                  {dynasty.name}
                </span>
              </div>
              <p className="text-sm text-ink-200 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                {poem.author} · {formatYear(dynasty.startYear)} - {formatYear(dynasty.endYear)}
              </p>
            </div>

            <div className="ink-divider mx-6" />

            <div className="px-6 py-4 flex items-center gap-3">
              <div
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-paper-50"
                style={{ backgroundColor: dynasty.color }}
              >
                参考年份：{formatYear(refYear)}
              </div>
              <span className="text-xs text-ink-100">
                诗歌创作前后 ±5 年的历史脉络
              </span>
            </div>

            <div className="px-6 pb-6 overflow-y-auto max-h-[50vh] scrollbar-hide">
              {sortedEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-10 h-10 text-ink-100 mx-auto mb-3" />
                  <p className="text-ink-200">该时期暂无收录的历史事件</p>
                </div>
              ) : (
                <div className="relative">
                  <div
                    className="absolute left-[7px] top-0 bottom-0 w-[2px] rounded-full"
                    style={{
                      background: `linear-gradient(to bottom, ${dynasty.color}40, ${dynasty.color}20, ${dynasty.color}40)`,
                    }}
                  />

                  <div className="absolute left-0 right-0 h-full pointer-events-none">
                    <div
                      className="absolute left-0 right-0 rounded-lg opacity-10"
                      style={{
                        backgroundColor: dynasty.color,
                        top: `${Math.max(0, ((refYear - 5) - sortedEvents[0].year) / Math.max(1, sortedEvents[sortedEvents.length - 1].year - sortedEvents[0].year) * 100)}%`,
                        height: `${Math.max(20, (10 / Math.max(1, sortedEvents[sortedEvents.length - 1].year - sortedEvents[0].year)) * 100)}%`,
                      }}
                    />
                  </div>

                  <div className="space-y-4">
                    {sortedEvents.map((event, index) => {
                      const isRefYear = event.year === refYear;
                      const isNearRefYear = Math.abs(event.year - refYear) <= 2;

                      return (
                        <div
                          key={event.id}
                          className={cn(
                            'relative pl-8 animate-fade-in-up',
                            isRefYear && 'z-10'
                          )}
                          style={{ animationDelay: `${index * 80}ms` }}
                        >
                          <div
                            className={cn(
                              'absolute left-0 top-2 w-4 h-4 rounded-full border-3 z-10 -translate-x-0 transition-all duration-300',
                              isRefYear
                                ? 'border-cinnabar-300 bg-cinnabar-300 shadow-stamp'
                                : isNearRefYear
                                  ? 'bg-paper-50 border-cinnabar-200'
                                  : 'bg-paper-50 border-paper-400'
                            )}
                            style={{
                              borderColor: isRefYear || isNearRefYear ? undefined : dynasty.color,
                            }}
                          />

                          {isRefYear && (
                            <div className="absolute left-6 top-1.5 w-2 h-2 bg-cinnabar-300 rounded-full animate-pulse" />
                          )}

                          <div
                            className={cn(
                              'p-4 rounded-xl border transition-all duration-300',
                              isRefYear
                                ? 'bg-cinnabar-50 border-cinnabar-200 shadow-md'
                                : isNearRefYear
                                  ? 'bg-paper-50 border-paper-200'
                                  : 'bg-paper-50/60 border-paper-200/60'
                            )}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {isRefYear && (
                                  <span className="stamp text-xs bg-cinnabar-300 text-paper-50">
                                    诗词年代
                                  </span>
                                )}
                                <h4 className={cn(
                                  'font-medium',
                                  isRefYear ? 'text-cinnabar-300' : 'text-ink-400'
                                )}>
                                  {event.name}
                                </h4>
                              </div>
                              <span className={cn(
                                'text-xs px-2 py-0.5 rounded-full flex-shrink-0',
                                isRefYear
                                  ? 'bg-cinnabar-100 text-cinnabar-400'
                                  : 'bg-paper-200 text-ink-100'
                              )}>
                                {formatYear(event.year)}
                              </span>
                            </div>

                            <p className="text-sm text-ink-300 leading-relaxed mb-2">
                              {event.description}
                            </p>

                            <div className="pt-2 border-t border-paper-200">
                              <p className="text-xs text-ink-200 flex items-start gap-1.5">
                                <Sparkles className="w-3 h-3 text-gold-300 flex-shrink-0 mt-0.5" />
                                <span>
                                  <span className="font-medium text-gold-400">影响：</span>
                                  {event.impact}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-paper-300 px-6 py-3 bg-paper-100 flex items-center justify-between">
              <p className="text-xs text-ink-100 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                共 {sortedEvents.length} 个历史事件
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary text-sm inline-flex items-center gap-1.5"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                收起面板
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoricalContext;
