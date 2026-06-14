import { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, RotateCcw, Coffee, BookOpen, Clock, Flame, Trophy,
  Sparkles, ChevronDown, X, Share2, Heart
} from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

const FocusTimer = () => {
  const {
    dynasties,
    focusTimerState,
    startFocusSession,
    pauseFocusSession,
    resumeFocusSession,
    resetFocusSession,
    tickFocusTimer,
    getBreakSurprisePoem,
  } = useAppStore();

  const [selectedDynastyId, setSelectedDynastyId] = useState<string>('');
  const [showDynastySelector, setShowDynastySelector] = useState(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const surpriseShownRef = useRef(false);

  const { isRunning, timeRemaining, currentSession, totalFocusTime, completedSessions, currentStreak, longestStreak } = focusTimerState;
  const isBreak = currentSession?.isCompleted ?? false;
  const surprisePoem = getBreakSurprisePoem();

  const selectedDynasty = dynasties.find(d => d.id === selectedDynastyId);
  const totalDuration = isBreak ? 5 * 60 : 25 * 60;
  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && timeRemaining > 0) {
      interval = window.setInterval(() => {
        tickFocusTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining, tickFocusTimer]);

  useEffect(() => {
    if (isBreak && !surpriseShownRef.current && surprisePoem) {
      setShowSurpriseModal(true);
      surpriseShownRef.current = true;
    }
    if (!isBreak) {
      surpriseShownRef.current = false;
    }
  }, [isBreak, surprisePoem]);

  const handleStart = () => {
    if (!currentSession) {
      startFocusSession(selectedDynastyId || undefined);
    } else {
      resumeFocusSession();
    }
  };

  const handlePause = () => {
    pauseFocusSession();
  };

  const handleReset = () => {
    resetFocusSession();
    surpriseShownRef.current = false;
    setShowSurpriseModal(false);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    if (h > 0) {
      return `${h}小时${m}分钟`;
    }
    return `${m}分钟`;
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cobalt-50 text-cobalt-500 rounded-full text-sm mb-4">
              <Clock className="w-4 h-4" />
              学习专注计时器
            </div>
            <h1 className="title-display text-4xl text-ink-400 mb-4">
              沉浸式诗词学习
            </h1>
            <p className="text-ink-200 max-w-xl mx-auto">
              专注25分钟，静心品读诗词。每完成一个专注时段，将为你推荐一首朝代诗词作为休息彩蛋。
            </p>
          </div>

          <div className="card p-8 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="relative inline-block mx-auto mb-8">
              <div className="flex justify-center">
                <svg width="280" height="280" className="transform -rotate-90">
                  <circle
                    cx="140"
                    cy="140"
                    r="120"
                    stroke="#F3F4F6"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="140"
                    cy="140"
                    r="120"
                    stroke={isBreak ? '#10B981' : '#6366F1'}
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-linear"
                    style={{
                      filter: `drop-shadow(0 0 8px ${isBreak ? '#10B98150' : '#6366F150'})`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    {isBreak ? (
                      <Coffee className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-cobalt-500" />
                    )}
                    <span className={cn(
                      'text-sm font-medium',
                      isBreak ? 'text-emerald-500' : 'text-cobalt-500'
                    )}>
                      {isBreak ? '休息时间' : '专注学习'}
                    </span>
                  </div>
                  <div className="text-6xl font-bold text-ink-400 tabular-nums tracking-tight">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-ink-100 mt-2">
                    {totalDuration / 60} 分钟 {isBreak ? '小憩' : '专注'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className={cn(
                    'flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95',
                    isBreak
                      ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 hover:shadow-lg hover:shadow-emerald-200'
                      : 'bg-gradient-to-r from-cobalt-400 to-cobalt-500 hover:shadow-lg hover:shadow-cobalt-200'
                  )}
                >
                  <Play className="w-5 h-5" />
                  {currentSession ? '继续' : '开始专注'}
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-amber-400 to-amber-500 hover:shadow-lg hover:shadow-amber-200 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Pause className="w-5 h-5" />
                  暂停
                </button>
              )}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-ink-300 bg-paper-100 hover:bg-paper-200 transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5" />
                重置
              </button>
            </div>

            <div className="pt-6 border-t border-paper-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-xl bg-paper-50">
                  <div className="flex items-center justify-center gap-1.5 text-ink-100 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">累计专注</span>
                  </div>
                  <div className="text-xl font-bold text-ink-400">
                    {formatTime(totalFocusTime)}
                  </div>
                </div>
                <div className="text-center p-3 rounded-xl bg-paper-50">
                  <div className="flex items-center justify-center gap-1.5 text-ink-100 mb-1">
                    <Trophy className="w-4 h-4" />
                    <span className="text-xs">完成时段</span>
                  </div>
                  <div className="text-xl font-bold text-ink-400">
                    {completedSessions} 次
                  </div>
                </div>
                <div className="text-center p-3 rounded-xl bg-paper-50">
                  <div className="flex items-center justify-center gap-1.5 text-ink-100 mb-1">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-xs">当前连续</span>
                  </div>
                  <div className="text-xl font-bold text-ink-400">
                    {currentStreak} 次
                  </div>
                </div>
                <div className="text-center p-3 rounded-xl bg-paper-50">
                  <div className="flex items-center justify-center gap-1.5 text-ink-100 mb-1">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <span className="text-xs">最长连续</span>
                  </div>
                  <div className="text-xl font-bold text-ink-400">
                    {longestStreak} 次
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="font-medium text-ink-300 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cobalt-400" />
              选择专注学习的朝代
            </h3>
            <div className="relative">
              <button
                onClick={() => setShowDynastySelector(!showDynastySelector)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-paper-50 hover:bg-paper-100 transition-colors border border-paper-200"
                disabled={isRunning}
              >
                <div className="flex items-center gap-3">
                  {selectedDynasty ? (
                    <>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: selectedDynasty.color }}
                      />
                      <span className="font-medium text-ink-400">{selectedDynasty.name}</span>
                      <span className="text-sm text-ink-100">{selectedDynasty.famousPoets.slice(0, 3).join('、')}</span>
                    </>
                  ) : (
                    <span className="text-ink-200">选择一个朝代（可选，将影响休息彩蛋推荐）</span>
                  )}
                </div>
                <ChevronDown className={cn(
                  'w-5 h-5 text-ink-200 transition-transform',
                  showDynastySelector && 'rotate-180'
                )} />
              </button>
              {showDynastySelector && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-paper-200 overflow-hidden z-10">
                  <div
                    className="p-3 hover:bg-paper-50 cursor-pointer transition-colors border-b border-paper-100"
                    onClick={() => {
                      setSelectedDynastyId('');
                      setShowDynastySelector(false);
                    }}
                  >
                    <span className="text-ink-300">全部朝代（随机推荐）</span>
                  </div>
                  {dynasties.map(dynasty => (
                    <div
                      key={dynasty.id}
                      className={cn(
                        'p-3 hover:bg-paper-50 cursor-pointer transition-colors flex items-center gap-3',
                        selectedDynastyId === dynasty.id && 'bg-cobalt-50'
                      )}
                      onClick={() => {
                        setSelectedDynastyId(dynasty.id);
                        setShowDynastySelector(false);
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dynasty.color }}
                      />
                      <div>
                        <div className="font-medium text-ink-400">{dynasty.name}</div>
                        <div className="text-xs text-ink-100">{dynasty.startYear > 0 ? '公元' : '公元前'}{Math.abs(dynasty.startYear)}年 - {dynasty.endYear}年</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <h3 className="font-medium text-ink-300 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-400" />
              专注小贴士
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-cobalt-50 to-cobalt-100/50">
                <div className="text-2xl mb-2">🧘</div>
                <h4 className="font-medium text-ink-400 mb-1">静心凝神</h4>
                <p className="text-sm text-ink-200">放下手机，深呼吸三次，让思绪沉淀在诗词的意境中。</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                <div className="text-2xl mb-2">📖</div>
                <h4 className="font-medium text-ink-400 mb-1">品读诗句</h4>
                <p className="text-sm text-ink-200">逐字逐句品味诗词，体会作者当时的心境与历史背景。</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-gold-50 to-gold-100/50">
                <div className="text-2xl mb-2">☕</div>
                <h4 className="font-medium text-ink-400 mb-1">适时休息</h4>
                <p className="text-sm text-ink-200">每25分钟后休息5分钟，劳逸结合更有助于记忆与理解。</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSurpriseModal && surprisePoem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-400/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-fade-in">
            <div
              className="h-2"
              style={{
                background: `linear-gradient(90deg, ${dynasties.find(d => d.id === surprisePoem.dynastyId)?.color || '#6366F1'}, ${dynasties.find(d => d.id === surprisePoem.dynastyId)?.color || '#8B5CF6'})`,
              }}
            />
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-300 to-gold-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="title-display text-xl text-ink-400">休息彩蛋</h3>
                    <p className="text-xs text-ink-100">专注学习奖励</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSurpriseModal(false)}
                  className="p-2 rounded-full hover:bg-paper-100 transition-colors"
                >
                  <X className="w-5 h-5 text-ink-200" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-paper-50 to-paper-100 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: `${dynasties.find(d => d.id === surprisePoem.dynastyId)?.color || '#6366F1'}15`,
                      color: dynasties.find(d => d.id === surprisePoem.dynastyId)?.color || '#6366F1',
                    }}
                  >
                    {dynasties.find(d => d.id === surprisePoem.dynastyId)?.name || '诗词'}
                  </span>
                  <span className="text-xs text-ink-100">难度：{surprisePoem.difficulty === 'easy' ? '简单' : surprisePoem.difficulty === 'medium' ? '中等' : '困难'}</span>
                </div>
                <h4 className="title-display text-2xl text-ink-400 mb-2 text-center">
                  《{surprisePoem.title}》
                </h4>
                <p className="text-center text-ink-200 mb-4">—— {surprisePoem.author}</p>
                <div className="text-center space-y-1">
                  {surprisePoem.content.map((line, i) => (
                    <p key={i} className="text-ink-300 leading-relaxed">
                      {line.text}
                    </p>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-cobalt-50 rounded-xl mb-6">
                <p className="text-sm text-cobalt-700">
                  <span className="font-medium">💡 名句：</span>
                  {surprisePoem.famousLine}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSurpriseModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cobalt-400 to-cobalt-500 text-white font-medium hover:shadow-lg hover:shadow-cobalt-200 transition-all"
                >
                  继续休息
                </button>
                <button className="p-3 rounded-xl bg-paper-100 hover:bg-paper-200 transition-colors">
                  <Heart className="w-5 h-5 text-ink-300" />
                </button>
                <button className="p-3 rounded-xl bg-paper-100 hover:bg-paper-200 transition-colors">
                  <Share2 className="w-5 h-5 text-ink-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusTimer;
