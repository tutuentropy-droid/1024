import { useState, useEffect, useCallback } from 'react';
import { Zap, Check, X, ArrowUpDown, Lock, Unlock, Sparkles, RotateCcw, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getPoemById, getDynastyByPoemId } from '@/data';
import type { DailyChallengeItem } from '@/types';

const DailyChallenge = () => {
  const { dailyChallenge, generateDailyChallenge, saveDailyChallengeResult, userProgress } = useAppStore();
  const [userOrder, setUserOrder] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const todayResult = userProgress.dailyChallengeResults.find(
    r => r.date === new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    if (!dailyChallenge) {
      generateDailyChallenge();
    }
  }, [dailyChallenge, generateDailyChallenge]);

  useEffect(() => {
    if (dailyChallenge && !todayResult) {
      setUserOrder(dailyChallenge.items.map((_, i) => i));
      setIsSubmitted(false);
      setIsCorrect(false);
    } else if (todayResult && dailyChallenge) {
      setUserOrder(todayResult.userOrder);
      setIsSubmitted(true);
      setIsCorrect(todayResult.isCorrect);
    }
  }, [dailyChallenge, todayResult]);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    if (isSubmitted) return;
    setUserOrder(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, [isSubmitted]);

  const handleSubmit = () => {
    if (!dailyChallenge || isSubmitted) return;
    const correct = JSON.stringify(userOrder) === JSON.stringify(dailyChallenge.correctOrder);
    setIsCorrect(correct);
    setIsSubmitted(true);
    saveDailyChallengeResult({
      date: dailyChallenge.date,
      isCorrect: correct,
      userOrder,
      unlockedKnowledge: correct ? dailyChallenge.knowledgePoints : [],
    });
  };

  const handleReset = () => {
    if (dailyChallenge) {
      setUserOrder(dailyChallenge.items.map((_, i) => i));
    }
  };

  if (!dailyChallenge) return null;

  const orderedItems = userOrder.map(i => dailyChallenge.items[i]);

  const getDynastyColor = (dynastyId: string) => {
    const colors: Record<string, string> = {
      han: '#6B95BC',
      tang: '#E89AA6',
      song: '#7BC49A',
      yuan: '#C7B594',
      ming: '#FFC97D',
      qing: '#E89AA6',
    };
    return colors[dynastyId] || '#8B8680';
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 text-gold-300 rounded-full text-sm mb-6">
              <Zap className="w-4 h-4" />
              每日挑战
            </div>
            <h1 className="title-display text-4xl text-ink-400 mb-4">
              每日诗词史挑战赛
            </h1>
            <p className="text-ink-200 max-w-lg mx-auto">
              将五句诗词按朝代先后排序，正确解锁知识点
            </p>
          </div>

          <div className="card mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-ink-300 flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-cobalt-300" />
                按朝代先后排列诗词
              </h3>
              {!isSubmitted && (
                <button
                  onClick={handleReset}
                  className="text-xs text-ink-100 hover:text-ink-200 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  重置
                </button>
              )}
            </div>

            <div className="space-y-3">
              {orderedItems.map((item, displayIndex) => {
                const color = getDynancyColor(item.dynastyId);
                const isLocked = isSubmitted && !isCorrect;
                const isCorrectPosition = isSubmitted && userOrder[displayIndex] === dailyChallenge.correctOrder[displayIndex];

                return (
                  <div
                    key={item.poemId}
                    draggable={!isSubmitted}
                    onDragStart={() => setDragIndex(displayIndex)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIndex !== null && dragIndex !== displayIndex) {
                        moveItem(dragIndex, displayIndex);
                      }
                      setDragIndex(null);
                    }}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all duration-300',
                      isSubmitted
                        ? isCorrectPosition
                          ? 'border-jade-300 bg-jade-50'
                          : 'border-cinnabar-300 bg-cinnabar-50'
                        : dragIndex === displayIndex
                          ? 'border-cobalt-300 bg-cobalt-50 opacity-60'
                          : 'border-paper-200 bg-paper-50 hover:border-cobalt-200 hover:shadow-md cursor-grab active:cursor-grabbing'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                        isSubmitted
                          ? isCorrectPosition
                            ? 'bg-jade-300 text-white'
                            : 'bg-cinnabar-300 text-white'
                          : 'bg-paper-200 text-ink-200'
                      )}>
                        {displayIndex + 1}
                      </div>

                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="poem-text text-sm text-ink-300 line-clamp-1">
                          {item.famousLine}
                        </p>
                        <p className="text-xs text-ink-100 mt-0.5">
                          {item.dynastyName}
                        </p>
                      </div>

                      {isSubmitted && (
                        <div className="flex-shrink-0">
                          {isCorrectPosition ? (
                            <Check className="w-5 h-5 text-jade-300" />
                          ) : (
                            <X className="w-5 h-5 text-cinnabar-300" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {isSubmitted && !isCorrect && (
              <div className="mt-4 p-3 bg-cobalt-50 rounded-xl border border-cobalt-100">
                <p className="text-sm text-cobalt-300 font-medium mb-2">正确顺序：</p>
                <div className="space-y-1">
                  {dailyChallenge.correctOrder.map((itemIndex, displayIndex) => {
                    const item = dailyChallenge.items[itemIndex];
                    return (
                      <p key={displayIndex} className="text-xs text-ink-200">
                        {displayIndex + 1}. {item.famousLine} — {item.dynastyName}（{item.startYear < 0 ? `${Math.abs(item.startYear)} BC` : `${item.startYear} AD`}）
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2 animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              <Zap className="w-5 h-5" />
              提交排序
            </button>
          ) : isCorrect ? (
            <div className="card animate-fade-in-up border-2 border-jade-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-jade-300 to-jade-400 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-paper-50" />
                </div>
                <h3 className="title-display text-xl text-ink-400 mb-2">
                  挑战成功！
                </h3>
                <p className="text-sm text-ink-200">
                  你已正确排列所有诗词，解锁以下知识点
                </p>
              </div>

              <div className="space-y-3">
                {dailyChallenge.knowledgePoints.map((point, index) => (
                  <div
                    key={index}
                    className="p-4 bg-jade-50/50 rounded-xl border border-jade-100 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100 + 300}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-jade-300 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        <Unlock className="w-3 h-3" />
                      </div>
                      <p className="text-sm text-ink-300 leading-relaxed">
                        {point}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card animate-fade-in-up border-2 border-cinnabar-200">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cinnabar-300 to-cinnabar-400 rounded-full flex items-center justify-center">
                  <X className="w-8 h-8 text-paper-50" />
                </div>
                <h3 className="title-display text-xl text-ink-400 mb-2">
                  排序有误
                </h3>
                <p className="text-sm text-ink-200">
                  知识点尚未解锁，明天再来挑战吧！
                </p>
              </div>

              <div className="space-y-2">
                {dailyChallenge.knowledgePoints.map((_, index) => (
                  <div
                    key={index}
                    className="p-3 bg-paper-100 rounded-xl flex items-center gap-3"
                  >
                    <Lock className="w-4 h-4 text-ink-100" />
                    <span className="text-sm text-ink-100">知识点 {index + 1} 未解锁</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-ink-100">
            <Sparkles className="w-3 h-3 inline mr-1" />
            每日零点更新 · 正确排序解锁知识点
          </div>
        </div>
      </div>
    </div>
  );
};

function getDynancyColor(dynastyId: string): string {
  const colors: Record<string, string> = {
    han: '#6B95BC',
    tang: '#E89AA6',
    song: '#7BC49A',
    yuan: '#C7B594',
    ming: '#FFC97D',
    qing: '#E89AA6',
  };
  return colors[dynastyId] || '#8B8680';
}

export default DailyChallenge;
