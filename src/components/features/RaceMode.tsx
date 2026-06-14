import { useState, useEffect, useCallback } from 'react';
import { Zap, Trophy, Clock, Check, X, Play, Users, User, ChevronRight, Award, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import type { RaceGame, RaceQuestion } from '@/types';

const RaceMode = () => {
  const { currentRaceGame, startRaceGame, answerRaceQuestion, finishRaceGame, raceHistory, unlockAchievement, checkAchievements } = useAppStore();
  const [gameMode, setGameMode] = useState<'menu' | 'playing' | 'result'>('menu');
  const [selectedMode, setSelectedMode] = useState<'single' | 'dual'>('single');
  const [timeLeft, setTimeLeft] = useState(0);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

  useEffect(() => {
    if (currentRaceGame?.status === 'finished') {
      setGameMode('result');
      finishRaceGame();
      const newlyUnlocked = checkAchievements();
      newlyUnlocked.forEach(id => unlockAchievement(id));
    }
  }, [currentRaceGame?.status]);

  useEffect(() => {
    let timer: number;
    if (gameMode === 'playing' && currentRaceGame?.status === 'playing') {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameMode, currentRaceGame?.status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartGame = (mode: 'single' | 'dual') => {
    setSelectedMode(mode);
    startRaceGame(mode);
    setTimeLeft(0);
    setGameMode('playing');
  };

  const handleAnswer = (answer: string) => {
    if (!currentRaceGame || showAnswerFeedback) return;

    const currentQuestion = currentRaceGame.questions[currentRaceGame.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    setLastAnswerCorrect(isCorrect);
    setShowAnswerFeedback(true);

    setTimeout(() => {
      answerRaceQuestion(answer);
      setShowAnswerFeedback(false);
    }, 800);
  };

  const handleBackToMenu = () => {
    setGameMode('menu');
    setTimeLeft(0);
  };

  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-400 rounded-full text-sm mb-6">
                <Zap className="w-4 h-4" />
                双人竞速
              </div>
              <h1 className="title-display text-4xl text-ink-400 mb-4">
                诗词朝代竞速
              </h1>
              <p className="text-ink-200 max-w-lg mx-auto">
                匹配诗句与朝代，比一比谁更快更准！
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div
                className="card cursor-pointer hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                onClick={() => handleStartGame('single')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cobalt-400 flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="title-display text-xl text-ink-400 mb-1">
                      单人练习
                    </h3>
                    <p className="text-sm text-ink-200">
                      个人挑战，提升速度与准确率
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-ink-100" />
                </div>
              </div>

              <div
                className="card cursor-pointer hover:-translate-y-1 transition-all duration-300 animate-fade-in-up ring-2 ring-orange-200"
                style={{ animationDelay: '100ms' }}
                onClick={() => handleStartGame('dual')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center flex-shrink-0">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="title-display text-xl text-ink-400">
                        双人对战
                      </h3>
                      <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full">
                        推荐
                      </span>
                    </div>
                    <p className="text-sm text-ink-200">
                      与AI对手竞速，看谁答得又快又准
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-ink-100" />
                </div>
              </div>
            </div>

            {raceHistory.length > 0 && (
              <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h3 className="title-display text-lg text-ink-400 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-gold-300" />
                  最近记录
                </h3>
                <div className="space-y-3">
                  {raceHistory.slice(0, 5).map((game, index) => {
                    const player = game.players.find(p => p.isCurrentUser);
                    const isWinner = game.winnerId === 'player-1';
                    return (
                      <div key={game.id} className="card">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isWinner ? (
                              <Crown className="w-6 h-6 text-gold-300" />
                            ) : (
                              <Award className="w-6 h-6 text-ink-100" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-ink-400">
                                {isWinner ? '胜利' : '失败'}
                              </p>
                              <p className="text-xs text-ink-100">
                                {player?.correctCount}/{game.questions.length} 正确
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-ink-400">
                              {player?.score} 分
                            </p>
                            <p className="text-xs text-ink-100">
                              {formatTime(Math.floor(player?.totalTime || 0))}
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
        </div>
      </div>
    );
  }

  if (gameMode === 'playing' && currentRaceGame) {
    const currentQuestion = currentRaceGame.questions[currentRaceGame.currentQuestionIndex];
    const progress = ((currentRaceGame.currentQuestionIndex) / currentRaceGame.questions.length) * 100;
    const currentPlayer = currentRaceGame.players.find(p => p.isCurrentUser);
    const opponent = currentRaceGame.players.find(p => !p.isCurrentUser);

    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6 animate-fade-in-up">
              <button
                onClick={handleBackToMenu}
                className="text-ink-200 hover:text-ink-400 flex items-center gap-2 text-sm transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                退出
              </button>
              <div className="flex items-center gap-2 text-ink-400">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-2xl font-mono font-bold">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="w-16" />
            </div>

            {selectedMode === 'dual' && opponent && (
              <div className="flex items-center justify-between mb-6 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-cobalt-100 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-400">我</p>
                    <p className="text-xs text-cobalt-300">{currentPlayer?.score} 分</p>
                  </div>
                </div>
                <div className="text-ink-100 text-sm">VS</div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-ink-400">{opponent.name}</p>
                    <p className="text-xs text-rose-300">{opponent.score} 分</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <span className="text-lg">{opponent.avatar}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="flex justify-between text-xs text-ink-100 mb-2">
                <span>第 {currentRaceGame.currentQuestionIndex + 1} / {currentRaceGame.questions.length} 题</span>
                <span>{currentPlayer?.correctCount} 正确</span>
              </div>
              <div className="h-2 bg-paper-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cobalt-300 to-cobalt-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="card mb-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <div className="text-center py-8">
                <div className="inline-block px-3 py-1 bg-purple-50 text-purple-400 rounded-full text-xs mb-4">
                  {currentQuestion.type === 'poem_to_dynasty' ? '诗句配朝代' : '事件配朝代'}
                </div>
                <h2 className="title-display text-2xl text-ink-400 mb-2">
                  {currentQuestion.question}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = showAnswerFeedback && option === currentQuestion.correctAnswer;
                const isWrong = showAnswerFeedback && lastAnswerCorrect === false && option === currentQuestion.correctAnswer === false && false;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={showAnswerFeedback}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all duration-200',
                      showAnswerFeedback
                        ? option === currentQuestion.correctAnswer
                          ? 'border-jade-300 bg-jade-50'
                          : 'border-paper-200 bg-paper-50 opacity-50'
                        : 'border-paper-200 bg-paper-50 hover:border-cobalt-300 hover:bg-cobalt-50 active:scale-95'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-ink-400 font-medium">{option}</span>
                      {showAnswerFeedback && option === currentQuestion.correctAnswer && (
                        <Check className="w-5 h-5 text-jade-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'result') {
    const player = currentRaceGame?.players.find(p => p.isCurrentUser);
    const opponent = currentRaceGame?.players.find(p => !p.isCurrentUser);
    const isWinner = currentRaceGame?.winnerId === 'player-1';

    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8 animate-fade-in-up">
              <div className="text-6xl mb-4">
                {isWinner ? '🏆' : '💪'}
              </div>
              <h1 className="title-display text-3xl text-ink-400 mb-2">
                {isWinner ? '恭喜获胜！' : '再接再厉！'}
              </h1>
              <p className="text-ink-200">
                {isWinner ? '你展现了出色的诗词历史功底' : '继续学习，下次一定能赢！'}
              </p>
            </div>

            <div className="card mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="text-center mb-6">
                <p className="text-sm text-ink-200 mb-2">最终得分</p>
                <p className="text-5xl font-bold text-cobalt-300">
                  {player?.score}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-paper-50 rounded-xl">
                  <p className="text-2xl font-bold text-jade-300">
                    {player?.correctCount}
                  </p>
                  <p className="text-xs text-ink-100">正确数</p>
                </div>
                <div className="p-3 bg-paper-50 rounded-xl">
                  <p className="text-2xl font-bold text-rose-300">
                    {currentRaceGame ? currentRaceGame.questions.length - (player?.correctCount || 0) : 0}
                  </p>
                  <p className="text-xs text-ink-100">错误数</p>
                </div>
                <div className="p-3 bg-paper-50 rounded-xl">
                  <p className="text-2xl font-bold text-gold-300">
                    {formatTime(Math.floor(player?.totalTime || 0))}
                  </p>
                  <p className="text-xs text-ink-100">用时</p>
                </div>
              </div>
            </div>

            {selectedMode === 'dual' && opponent && (
              <div className="card mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h3 className="title-display text-lg text-ink-400 mb-4 text-center">
                  对战结果
                </h3>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-cobalt-100 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">👤</span>
                    </div>
                    <p className="text-sm font-medium text-ink-400">我</p>
                    <p className="text-lg font-bold text-cobalt-300">{player?.score}分</p>
                    {isWinner && <Crown className="w-5 h-5 text-gold-300 mx-auto mt-1" />}
                  </div>
                  <div className="text-ink-100 text-sm">VS</div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">{opponent.avatar}</span>
                    </div>
                    <p className="text-sm font-medium text-ink-400">{opponent.name}</p>
                    <p className="text-lg font-bold text-rose-300">{opponent.score}分</p>
                    {!isWinner && <Crown className="w-5 h-5 text-gold-300 mx-auto mt-1" />}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <button
                onClick={handleBackToMenu}
                className="btn-secondary flex-1"
              >
                返回
              </button>
              <button
                onClick={() => handleStartGame(selectedMode)}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                再来一局
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RaceMode;
