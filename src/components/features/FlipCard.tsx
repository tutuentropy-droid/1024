import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RotateCcw, Heart, Check, BookOpen, User, Calendar, Tag, Building2, Coins, Users, Palette, Volume2, VolumeX, Languages, Pause, Lightbulb, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getPoemById, getDynastyByPoemId, getRelatedEventsByPoemId, getPoemsByDynastyId } from '@/data';
import type { Poem, PoemLine } from '@/types';
import HistoricalContext from './HistoricalContext';

interface FlipCardProps {
  poemId?: string;
  showNavigation?: boolean;
}

const formatYear = (year: number): string => {
  if (year < 0) return `${Math.abs(year)} BC`;
  return `${year} AD`;
};

const FlipCard = ({ poemId, showNavigation = true }: FlipCardProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const { userProgress, markPoemAsStudied, toggleFavorite, getOrderedPoems } = useAppStore();
  
  const currentPoemId = poemId || params.poemId;
  const poem = currentPoemId ? getPoemById(currentPoemId) : null;
  const dynasty = poem ? getDynastyByPoemId(poem.id) : null;
  const relatedEvents = poem ? getRelatedEventsByPoemId(poem.id) : [];
  
  const dynastyPoems = dynasty ? getPoemsByDynastyId(dynasty.id) : [];
  const currentIndex = poem ? dynastyPoems.findIndex(p => p.id === poem.id) : -1;
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [expandedLineIndex, setExpandedLineIndex] = useState<number | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const poemProgress = poem ? userProgress.poemProgress[poem.id] : undefined;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    setIsFlipped(false);
    setIsSpeaking(false);
    setExpandedLineIndex(null);
    setShowTranslation(false);
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, [currentPoemId]);

  const getPoemText = useCallback(() => {
    if (!poem) return '';
    return poem.content
      .map((line: PoemLine | string) => 
        typeof line === 'string' ? line : line.text
      )
      .join(' ');
  }, [poem]);

  const handleSpeak = useCallback(() => {
    if (!synthRef.current || !poem) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = getPoemText();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [isSpeaking, poem, getPoemText]);

  const toggleLineTranslation = (index: number) => {
    setExpandedLineIndex(expandedLineIndex === index ? null : index);
  };

  const getLineText = (line: PoemLine | string): string => {
    return typeof line === 'string' ? line : line.text;
  };

  const getLineTranslation = (line: PoemLine | string): string => {
    return typeof line === 'string' ? '' : line.translation;
  };

  const toggleAllTranslations = () => {
    setShowTranslation(!showTranslation);
    setExpandedLineIndex(null);
  };

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevPoem = dynastyPoems[currentIndex - 1];
      navigate(`/card/${prevPoem.id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < dynastyPoems.length - 1) {
      const nextPoem = dynastyPoems[currentIndex + 1];
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
    education: BookOpen,
    philosophy: Lightbulb,
  };

  const insightLabels: Record<string, string> = {
    politics: '政治',
    economy: '经济',
    society: '社会',
    culture: '文化',
    education: '教育',
    philosophy: '哲学',
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg bg-paper-200 text-ink-200 hover:bg-paper-300 transition-all duration-300"
            title="返回"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: dynasty.color }}
          />
          <div>
            <h2 className="title-display text-2xl text-ink-400">{dynasty.name}</h2>
            <p className="text-sm text-ink-100">
              第 {currentIndex + 1} / {dynastyPoems.length} 首
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
          <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="w-full h-full bg-gradient-to-br from-paper-50 via-paper-100 to-paper-200 p-6 md:p-10 flex flex-col shadow-card border border-paper-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {speechSupported && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak();
                      }}
                      className={cn(
                        'p-2 rounded-lg transition-all duration-300 flex items-center gap-1.5',
                        isSpeaking 
                          ? 'bg-cobalt-100 text-cobalt-400' 
                          : 'bg-paper-200 text-ink-200 hover:bg-paper-300'
                      )}
                      title={isSpeaking ? '暂停朗读' : '朗读诗词'}
                    >
                      {isSpeaking ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span className="text-xs">暂停</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span className="text-xs">朗读</span>
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAllTranslations();
                    }}
                    className={cn(
                      'p-2 rounded-lg transition-all duration-300 flex items-center gap-1.5',
                      showTranslation 
                        ? 'bg-jade-100 text-jade-400' 
                        : 'bg-paper-200 text-ink-200 hover:bg-paper-300'
                    )}
                    title={showTranslation ? '隐藏翻译' : '显示翻译'}
                  >
                    <Languages className="w-4 h-4" />
                    <span className="text-xs">{showTranslation ? '隐藏译' : '显示译'}</span>
                  </button>
                </div>
                <span className={cn(
                  'px-2 py-1 rounded text-xs font-medium',
                  poem.difficulty === 'easy' ? 'text-jade-300 bg-jade-50' :
                  poem.difficulty === 'medium' ? 'text-gold-300 bg-gold-50' :
                  'text-cinnabar-300 bg-cinnabar-50'
                )}>
                  {poem.difficulty === 'easy' ? '简单' : poem.difficulty === 'medium' ? '中等' : '困难'}
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <h3 className="title-display text-2xl md:text-3xl text-ink-400 mb-2">
                  《{poem.title}》
                </h3>
                <p className="text-ink-100 mb-6 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {poem.author}
                </p>
                
                <div className="space-y-3 mb-6 w-full max-w-lg">
                  {poem.content.map((line, index) => {
                    const lineText = getLineText(line);
                    const lineTranslation = getLineTranslation(line);
                    const isExpanded = expandedLineIndex === index;
                    const showThisTranslation = showTranslation || isExpanded;

                    return (
                      <div
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (lineTranslation) toggleLineTranslation(index);
                        }}
                        className={cn(
                          'p-3 rounded-xl transition-all duration-300',
                          lineTranslation && 'cursor-pointer hover:bg-paper-200/50',
                          (isExpanded || showTranslation) && 'bg-paper-200/50'
                        )}
                      >
                        <p className="poem-text text-lg md:text-xl leading-relaxed text-ink-400">
                          {lineText}
                        </p>
                        {(showThisTranslation && lineTranslation) && (
                          <p className={cn(
                            'text-sm mt-2 leading-relaxed transition-all duration-300',
                            'text-jade-400 font-medium',
                            isExpanded ? 'animate-fade-in-up' : ''
                          )}>
                            「{lineTranslation}」
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-auto pt-4 border-t border-paper-300 w-full">
                  <p className="text-xs text-ink-100 mb-1.5">名句</p>
                  <p className="font-kai text-base md:text-lg text-cinnabar-300">
                    {poem.famousLine}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-ink-100 flex items-center gap-2">
                <RotateCcw className="w-3 h-3" />
                点击卡片翻转查看历史解读 · 点击诗句查看白话翻译
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
                            {formatYear(event.year)}
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

          {currentPoemId && (
            <HistoricalContext poemId={currentPoemId} />
          )}
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
              disabled={currentIndex >= dynastyPoems.length - 1}
              className={cn(
                'p-3 rounded-lg transition-all duration-300',
                currentIndex >= dynastyPoems.length - 1
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
