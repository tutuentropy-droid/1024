import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RotateCcw, Heart, Check, BookOpen, User, Calendar, Tag, Building2, Coins, Users, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getPoemById, getDynastyByPoemId, getAllPoems, getRelatedEventsByPoemId } from '@/data';
import type { Poem } from '@/types';

interface FlipCardProps {
  poemId?: string;
  showNavigation?: boolean;
}

const FlipCard = ({ poemId, showNavigation = true }: FlipCardProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const { userProgress, markPoemAsStudied, toggleFavorite } = useAppStore();
  
  const currentPoemId = poemId || params.poemId;
  const poem = currentPoemId ? getPoemById(currentPoemId) : null;
  const dynasty = poem ? getDynastyByPoemId(poem.id) : null;
  const relatedEvents = poem ? getRelatedEventsByPoemId(poem.id) : [];
  
  const allPoems = getAllPoems();
  const currentIndex = poem ? allPoems.findIndex(p => p.id === poem.id) : -1;
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const poemProgress = poem ? userProgress.poemProgress[poem.id] : undefined;

  useEffect(() => {
    setIsFlipped(false);
  }, [currentPoemId]);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevPoem = allPoems[currentIndex - 1];
      navigate(`/card/${prevPoem.id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < allPoems.length - 1) {
      const nextPoem = allPoems[currentIndex + 1];
      navigate(`/card/${nextPoem.id}`);
    }
  };

  const handleMarkStudied = () => {
    if (poem) {
      markPoemAsStudied(poem.id);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleToggleFavorite = () => {
    if (poem) {
      toggleFavorite(poem.id);
    }
  };

  if (!poem || !dynasty) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-ink-100">未找到该诗词</p>
      </div>
    );
  }

  const insightIcons: Record<string, typeof Building2> = {
    politics: Building2,
    economy: Coins,
    society: Users,
    culture: Palette,
  };

  const insightLabels: Record<string, string> = {
    politics: '政治',
    economy: '经济',
    society: '社会',
    culture: '文化',
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: dynasty.color }}
          />
          <div>
            <h2 className="title-display text-2xl text-ink-400">{dynasty.name}</h2>
            <p className="text-sm text-ink-100">
              第 {currentIndex + 1} / {allPoems.length} 首
            </p>
          </div>
        </div>
        
        {poemProgress?.isStudied && (
          <span className="stamp flex items-center gap-1 text-xs">
            <Check className="w-3 h-3" />
            已学习
          </span>
        )}
      </div>

      <div className="perspective-1000 w-full">
        <div
          className={cn(
            'relative w-full h-[500px] md:h-[550px] transition-transform duration-600 preserve-3d cursor-pointer',
            isFlipped && 'rotate-y-180'
          )}
          style={{ transformStyle: 'preserve-3d' }}
          onClick={handleFlip}
        >
          <div
            className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="w-full h-full bg-gradient-to-br from-paper-50 via-paper-100 to-paper-200 p-8 md:p-12 flex flex-col shadow-card border border-paper-300">
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <h3 className="title-display text-3xl md:text-4xl text-ink-400 mb-2">
                  《{poem.title}》
                </h3>
                <p className="text-ink-100 mb-8 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {poem.author}
                </p>
                
                <div className="space-y-4 mb-8">
                  {poem.content.map((line, index) => (
                    <p
                      key={index}
                      className="poem-text text-xl md:text-2xl leading-relaxed"
                    >
                      {line}
                    </p>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-paper-300 w-full">
                  <p className="text-sm text-ink-100 mb-2">名句</p>
                  <p className="font-kai text-lg text-cinnabar-300">
                    {poem.famousLine}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-ink-100 flex items-center gap-2">
                <RotateCcw className="w-3 h-3" />
                点击卡片翻转查看历史解读
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden rotate-y-180"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-gold-50 via-paper-100 to-gold-100 p-6 md:p-8 overflow-y-auto scrollbar-hide">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-ink-200 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  创作背景
                </h4>
                <p className="text-sm text-ink-300 leading-relaxed">
                  {poem.background}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-ink-200 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  作者简介
                </h4>
                <p className="text-sm text-ink-300 leading-relaxed">
                  {poem.authorBio}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-ink-200 mb-3">历史解读</h4>
                <div className="space-y-4">
                  {Object.entries(poem.historicalInsight).map(([key, value]) => {
                    const Icon = insightIcons[key] || Building2;
                    return (
                      <div key={key} className="p-4 bg-paper-50/80 rounded-xl border border-paper-200">
                        <h5 className="text-sm font-medium text-cobalt-300 mb-2 flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {insightLabels[key] || key}
                        </h5>
                        <p className="text-sm text-ink-300 leading-relaxed">
                          {value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {relatedEvents.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-ink-200 mb-3">相关历史事件</h4>
                  <div className="space-y-2">
                    {relatedEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 bg-jade-50/50 rounded-lg border border-jade-100"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-jade-300">
                            {event.name}
                          </span>
                          <span className="text-xs text-ink-100">
                            {event.year} AD
                          </span>
                        </div>
                        <p className="text-xs text-ink-200">
                          {event.description.slice(0, 60)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {poem.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-cobalt-50 text-cobalt-300 text-xs rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-ink-100 flex items-center gap-2">
                <RotateCcw className="w-3 h-3" />
                点击卡片翻转查看诗词
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleFavorite}
            className={cn(
              'p-3 rounded-lg transition-all duration-300',
              poemProgress?.isFavorite
                ? 'bg-cinnabar-50 text-cinnabar-300'
                : 'bg-paper-200 text-ink-200 hover:bg-paper-300'
            )}
          >
            <Heart className={cn(
              'w-5 h-5',
              poemProgress?.isFavorite && 'fill-current'
            )} />
          </button>
          
          <button
            onClick={handleMarkStudied}
            className={cn(
              'px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2',
              poemProgress?.isStudied
                ? 'bg-jade-50 text-jade-300'
                : 'btn-secondary'
            )}
          >
            <Check className="w-4 h-4" />
            {poemProgress?.isStudied ? '已学习' : '标记已学习'}
          </button>
        </div>

        {showSuccess && (
          <div className="absolute left-1/2 -translate-x-1/2 bg-jade-300 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-up">
            学习进度已保存！
          </div>
        )}

        {showNavigation && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className={cn(
                'p-3 rounded-lg transition-all duration-300',
                currentIndex <= 0
                  ? 'bg-paper-200 text-ink-100 cursor-not-allowed'
                  : 'bg-cobalt-50 text-cobalt-300 hover:bg-cobalt-100'
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= allPoems.length - 1}
              className={cn(
                'p-3 rounded-lg transition-all duration-300',
                currentIndex >= allPoems.length - 1
                  ? 'bg-paper-200 text-ink-100 cursor-not-allowed'
                  : 'bg-cobalt-50 text-cobalt-300 hover:bg-cobalt-100'
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlipCard;
