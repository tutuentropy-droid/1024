import { useState, useEffect } from 'react';
import { Calendar, Clock, Heart, Play, Pause, ChevronLeft, ChevronRight, Star, BookOpen, Sparkles, CheckCircle, Lightbulb } from 'lucide-react';
import { useAppStore } from '@/store';
import { getDynastyById } from '@/data';
import { cn } from '@/lib/utils';

const DailyPoemHistory = () => {
  const { dailyPoemHistory, dailyPoemHistoryList, generateDailyPoemHistory, markDailyPoemAsRead, toggleDailyPoemFavorite } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  useEffect(() => {
    generateDailyPoemHistory();
  }, [generateDailyPoemHistory]);

  useEffect(() => {
    if (dailyPoemHistory && !dailyPoemHistory.isRead) {
      markDailyPoemAsRead(dailyPoemHistory.date);
    }
  }, [dailyPoemHistory, markDailyPoemAsRead]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && dailyPoemHistory) {
      interval = setInterval(() => {
        setCurrentSceneIndex((prev) => {
          if (prev >= dailyPoemHistory.animationScenes.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, dailyPoemHistory]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
      setIsPlaying(false);
    }
  };

  const handleNextScene = () => {
    if (dailyPoemHistory && currentSceneIndex < dailyPoemHistory.animationScenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
      setIsPlaying(false);
    }
  };

  const handleQuizAnswer = (index: number) => {
    setSelectedQuizAnswer(index);
    setShowQuizResult(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const dynasty = dailyPoemHistory ? getDynastyById(dailyPoemHistory.dynastyId) : null;

  const currentScene = dailyPoemHistory?.animationScenes[currentSceneIndex];

  if (!dailyPoemHistory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-ink-100 border-t-violet-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-ink-200">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 text-gold-400 rounded-full text-sm mb-4">
            <Calendar className="w-4 h-4" />
            每日一诗 · 以史解诗
          </div>
          <h1 className="title-display text-4xl md:text-5xl text-ink-400 mb-3">
            今日诗词
          </h1>
          <p className="text-lg text-ink-200">
            {formatDate(dailyPoemHistory.date)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-paper-50 to-paper-100 rounded-2xl shadow-lg border border-paper-200 overflow-hidden mb-8">
          <div 
            className="relative h-64 md:h-80 bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-ink-wash opacity-30" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8 animate-fade-in-up">
                <p className="text-3xl md:text-4xl title-display text-ink-400 mb-4 leading-relaxed">
                  {currentScene?.poemLine || dailyPoemHistory.poemContent.split('\n')[0]}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span 
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ backgroundColor: (dynasty?.color || '#8b5cf6') + '20', color: dynasty?.color || '#8b5cf6' }}
                  >
                    {dailyPoemHistory.dynastyName}
                  </span>
                  <span className="text-ink-200 text-sm">
                    {dailyPoemHistory.poemAuthor}
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <button
                onClick={handlePrevScene}
                disabled={currentSceneIndex === 0}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  currentSceneIndex === 0
                    ? 'bg-paper-200/50 text-ink-100 cursor-not-allowed'
                    : 'bg-paper-50/80 text-ink-300 hover:bg-paper-100'
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handlePlayPause}
                className="p-3 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <button
                onClick={handleNextScene}
                disabled={currentSceneIndex >= dailyPoemHistory.animationScenes.length - 1}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  currentSceneIndex >= dailyPoemHistory.animationScenes.length - 1
                    ? 'bg-paper-200/50 text-ink-100 cursor-not-allowed'
                    : 'bg-paper-50/80 text-ink-300 hover:bg-paper-100'
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-ink-200" />
              <span className="text-sm text-ink-200">
                {Math.round(dailyPoemHistory.microLesson.duration / 60)}分钟微课
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="title-display text-2xl text-ink-400">
                  《{dailyPoemHistory.poemTitle}》
                </h2>
                <p className="text-ink-200 mt-1">
                  {dailyPoemHistory.dynastyName} · {dailyPoemHistory.poemAuthor}
                </p>
              </div>
              <button
                onClick={() => toggleDailyPoemFavorite(dailyPoemHistory.date)}
                className={cn(
                  'p-3 rounded-xl transition-all duration-300',
                  dailyPoemHistory.isFavorite
                    ? 'bg-rose-50 text-rose-400'
                    : 'bg-paper-200 text-ink-200 hover:bg-paper-300'
                )}
              >
                <Heart className={cn('w-5 h-5', dailyPoemHistory.isFavorite && 'fill-current')} />
              </button>
            </div>

            <div className="bg-paper-50 rounded-xl p-5 border border-paper-200 mb-6">
              <h3 className="title-display text-lg text-ink-400 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-400" />
                诗词原文
              </h3>
              <div className="whitespace-pre-line text-ink-300 leading-loose text-lg text-center py-4">
                {dailyPoemHistory.poemContent}
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-100 mb-6">
              <h3 className="title-display text-lg text-violet-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                历史背景
              </h3>
              <p className="text-ink-200 leading-relaxed">
                {dailyPoemHistory.historicalBackground}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gold-50 to-amber-50 rounded-xl p-5 border border-gold-100 mb-6">
              <h3 className="title-display text-lg text-gold-400 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                {dailyPoemHistory.microLesson.title}
              </h3>
              
              <div className="space-y-3 mb-4">
                {dailyPoemHistory.microLesson.keyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-400 text-white text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-ink-200 text-sm leading-relaxed pt-0.5">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-ink-200 italic">
                {dailyPoemHistory.microLesson.summary}
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
              <h3 className="title-display text-lg text-emerald-600 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                每日小测
              </h3>
              
              <p className="text-ink-300 font-medium mb-4">
                {dailyPoemHistory.microLesson.quizQuestion}
              </p>

              <div className="space-y-2">
                {dailyPoemHistory.microLesson.quizOptions.map((option, i) => {
                  const isCorrect = i === dailyPoemHistory.microLesson.correctAnswerIndex;
                  const isSelected = selectedQuizAnswer === i;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => !showQuizResult && handleQuizAnswer(i)}
                      disabled={showQuizResult}
                      className={cn(
                        'w-full p-3 rounded-xl text-left transition-all duration-300 flex items-center gap-3',
                        showQuizResult
                          ? isCorrect
                            ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-700'
                            : isSelected
                              ? 'bg-rose-100 border-2 border-rose-400 text-rose-700'
                              : 'bg-white/50 border border-paper-200 text-ink-200'
                          : isSelected
                            ? 'bg-emerald-50 border-2 border-emerald-300'
                            : 'bg-white/50 border border-paper-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                      )}
                    >
                      <span className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                        showQuizResult
                          ? isCorrect
                            ? 'bg-emerald-400 text-white'
                            : isSelected
                              ? 'bg-rose-400 text-white'
                              : 'bg-paper-200 text-ink-200'
                          : 'bg-paper-200 text-ink-200'
                      )}>
                        {showQuizResult && isCorrect ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </span>
                      <span className="text-sm">{option}</span>
                    </button>
                  );
                })}
              </div>

              {showQuizResult && (
                <div className={cn(
                  'mt-4 p-4 rounded-xl',
                  selectedQuizAnswer === dailyPoemHistory.microLesson.correctAnswerIndex
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-50 text-rose-600'
                )}>
                  <p className="font-medium mb-1">
                    {selectedQuizAnswer === dailyPoemHistory.microLesson.correctAnswerIndex
                      ? '🎉 回答正确！'
                      : '😅 答错了，再想想~'
                    }
                  </p>
                  <p className="text-sm opacity-90">
                    {dailyPoemHistory.microLesson.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {dailyPoemHistoryList.length > 0 && (
          <div className="bg-gradient-to-br from-paper-50 to-paper-100 rounded-2xl shadow-lg border border-paper-200 p-6">
            <h3 className="title-display text-lg text-ink-400 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-400" />
              历史推送 ({dailyPoemHistoryList.length})
            </h3>
            
            <div className="space-y-3">
              {dailyPoemHistoryList.slice(1).map((item) => (
                <button
                  key={item.date}
                  onClick={() => {
                    markDailyPoemAsRead(item.date);
                  }}
                  className="w-full p-4 rounded-xl bg-paper-50 border border-paper-200 hover:bg-paper-100 transition-colors text-left flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-ink-300 truncate">
                      《{item.poemTitle}》
                    </div>
                    <div className="text-sm text-ink-200 truncate">
                      {item.dynastyName} · {item.poemAuthor}
                    </div>
                    <div className="text-xs text-ink-100 mt-1">
                      {formatDate(item.date)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.isFavorite && <Heart className="w-4 h-4 text-rose-400 fill-current" />}
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-violet-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyPoemHistory;
