import { useState, useEffect } from 'react';
import { Zap, Trophy, Clock, Check, X, Users, Play, RotateCcw, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store';
import { getAllDynasties } from '@/data';
import { cn } from '@/lib/utils';

const RacingMode = () => {
  const { racingGame, startRacingGame, answerRacingQuestion, endRacingGame, racingHistory, userAchievements } = useAppStore();
  const [showHint, setShowHint] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [gamePhase, setGamePhase] = useState<'menu' | 'countdown' | 'playing' | 'finished'>('menu');
  const [player2Name, setPlayer2Name] = useState('诗友小明');

  const dynasties = getAllDynasties();

  useEffect(() => {
    if (gamePhase === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (gamePhase === 'countdown' && countdown === 0) {
      setGamePhase('playing');
      startRacingGame(player2Name);
    }
  }, [countdown, gamePhase, player2Name, startRacingGame]);

  useEffect(() => {
    if (racingGame?.status === 'finished' && gamePhase === 'playing') {
      setGamePhase('finished');
      setTimeout(() => endRacingGame(), 100);
    }
  }, [racingGame?.status, gamePhase, endRacingGame]);

  const handleStartGame = () => {
    setCountdown(3);
    setGamePhase('countdown');
    setLastAnswer(null);
  };

  const handleAnswer = (dynastyId: string) => {
    if (!racingGame || racingGame.status !== 'playing') return;
    
    const isCorrect = answerRacingQuestion(dynastyId);
    setLastAnswer(isCorrect);
    setShowHint(false);
    
    setTimeout(() => setLastAnswer(null), 800);
  };

  const currentItem = racingGame?.items[racingGame.currentItemIndex];
  const currentPlayer = racingGame?.players[racingGame.currentTurn];
  const isPlayer1Turn = racingGame?.currentTurn === 0;

  const renderMenu = () => (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-500 rounded-full text-sm mb-6">
            <Zap className="w-4 h-4" />
            双人竞速
          </div>
          <h1 className="title-display text-4xl text-ink-400 mb-4">
            诗词朝代竞速
          </h1>
          <p className="text-ink-200 max-w-md mx-auto">
            两人依次匹配诗句与朝代，用时短者胜。考验你的诗词历史知识储备！
          </p>
        </div>

        <div className="card mb-6">
          <h3 className="title-display text-lg text-ink-400 mb-4">
            游戏规则
          </h3>
          <div className="space-y-3 text-sm text-ink-200">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </span>
              <span>每局共10道题，7道诗句匹配，3道历史事件匹配</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </span>
              <span>两人轮流答题，答对得分，答错不扣分</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </span>
              <span>答题越快得分越高，最高分100分，最低分20分</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                4
              </span>
              <span>总分高者获胜，同分则用时少者胜</span>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <label className="block text-sm text-ink-300 mb-2">
            对手昵称
          </label>
          <input
            type="text"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            className="w-full p-3 border border-paper-200 rounded-xl text-ink-300 focus:outline-none focus:ring-2 focus:ring-purple-200"
            placeholder="输入对手昵称"
          />
        </div>

        <div className="card mb-6 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-ink-200 mb-1">我的战绩</div>
              <div className="text-2xl font-bold text-purple-500">
                {userAchievements.racingWins} 胜
              </div>
            </div>
            <Trophy className="w-12 h-12 text-gold-300" />
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="w-full btn-primary text-lg py-4 inline-flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          开始对战
        </button>

        {racingHistory.length > 0 && (
          <div className="mt-8">
            <h3 className="title-display text-lg text-ink-400 mb-4">
              最近对战记录
            </h3>
            <div className="space-y-3">
              {racingHistory.slice(0, 5).map((game) => {
                const isWinner = game.winnerId === 'player-1';
                const p1 = game.players[0];
                const p2 = game.players[1];
                return (
                  <div key={game.id} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          isWinner ? 'bg-gold-100' : 'bg-paper-100'
                        )}>
                          {isWinner ? <Trophy className="w-5 h-5 text-gold-300" /> : <span>👤</span>}
                        </div>
                        <div>
                          <div className="font-medium text-ink-400">
                            {isWinner ? '胜利' : '失败'}
                          </div>
                          <div className="text-xs text-ink-100">
                            {p1.score} : {p2.score}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-ink-200">
                          vs {p2.name}
                        </div>
                        <div className="text-xs text-ink-100">
                          {new Date(Number(game.id.split('-')[1])).toLocaleDateString('zh-CN')}
                        </div>
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
  );

  const renderCountdown = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl font-bold text-purple-500 animate-bounce">
          {countdown}
        </div>
        <div className="text-xl text-ink-200 mt-4">准备开始...</div>
      </div>
    </div>
  );

  const renderGame = () => {
    if (!racingGame || !currentItem || !currentPlayer) return null;

    const p1 = racingGame.players[0];
    const p2 = racingGame.players[1];

    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className={cn(
              'flex items-center gap-3 p-3 rounded-xl transition-all',
              isPlayer1Turn ? 'bg-purple-100 ring-2 ring-purple-300' : 'bg-paper-50'
            )}>
              <div className="text-2xl">👤</div>
              <div>
                <div className="font-medium text-ink-400">{p1.name}</div>
                <div className="text-lg font-bold text-purple-500">{p1.score}分</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-ink-100">
                第 {racingGame.currentItemIndex + 1} / {racingGame.totalRounds} 题
              </div>
              <div className="text-xs text-ink-100">
                {isPlayer1Turn ? '你的回合' : '对手回合'}
              </div>
            </div>
            
            <div className={cn(
              'flex items-center gap-3 p-3 rounded-xl transition-all',
              !isPlayer1Turn ? 'bg-pink-100 ring-2 ring-pink-300' : 'bg-paper-50'
            )}>
              <div>
                <div className="font-medium text-ink-400 text-right">{p2.name}</div>
                <div className="text-lg font-bold text-pink-500 text-right">{p2.score}分</div>
              </div>
              <div className="text-2xl">🧑</div>
            </div>
          </div>

          <div className={cn(
            'card text-center mb-8 transition-all duration-300',
            lastAnswer === true && 'ring-4 ring-jade-300',
            lastAnswer === false && 'ring-4 ring-cinnabar-300'
          )}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-100 rounded-full text-xs text-ink-200 mb-4">
              {currentItem.type === 'poem' ? (
                <>
                  <span>📜</span> 诗句匹配
                </>
              ) : (
                <>
                  <span>📅</span> 历史事件
                </>
              )}
            </div>
            
            <div className="title-display text-2xl text-ink-400 mb-6 py-8">
              {currentItem.content}
            </div>

            {showHint && currentItem.hint && (
              <div className="text-sm text-gold-300 bg-gold-50 py-2 px-4 rounded-lg inline-block mb-4">
                💡 {currentItem.hint}
              </div>
            )}

            {lastAnswer !== null && (
              <div className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4',
                lastAnswer ? 'bg-jade-100 text-jade-500' : 'bg-cinnabar-100 text-cinnabar-300'
              )}>
                {lastAnswer ? (
                  <><Check className="w-4 h-4" /> 回答正确！</>
                ) : (
                  <><X className="w-4 h-4" /> 回答错误</>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {dynasties.map(dynasty => (
              <button
                key={dynasty.id}
                onClick={() => handleAnswer(dynasty.id)}
                disabled={!isPlayer1Turn || lastAnswer !== null}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all text-left',
                  isPlayer1Turn && lastAnswer === null
                    ? 'border-paper-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer'
                    : 'border-paper-100 bg-paper-50 opacity-50 cursor-not-allowed'
                )}
                style={{ borderColor: isPlayer1Turn && lastAnswer === null ? undefined : undefined }}
              >
                <div className="font-medium text-ink-400">{dynasty.name}</div>
                <div className="text-xs text-ink-100 mt-1">
                  {dynasty.startYear > 0 ? '公元' : '公元前'}{Math.abs(dynasty.startYear)}年 - {dynasty.endYear > 0 ? '公元' : '公元前'}{Math.abs(dynasty.endYear)}年
                </div>
              </button>
            ))}
          </div>

          {isPlayer1Turn && lastAnswer === null && !showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="w-full btn-secondary text-sm"
            >
              💡 提示（不扣分）
            </button>
          )}

          {!isPlayer1Turn && lastAnswer === null && (
            <div className="text-center text-ink-200">
              <div className="animate-pulse">对手思考中...</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFinished = () => {
    if (!racingGame) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-ink-200">对局已结束</p>
            <button
              onClick={() => setGamePhase('menu')}
              className="btn-primary mt-6 inline-flex items-center gap-2"
            >
              返回主菜单
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    const p1 = racingGame.players[0];
    const p2 = racingGame.players[1];
    const isWinner = racingGame.winnerId === 'player-1';

    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {isWinner ? '🏆' : '😔'}
            </div>
            <h1 className="title-display text-3xl text-ink-400 mb-2">
              {isWinner ? '恭喜获胜！' : '再接再厉！'}
            </h1>
            <p className="text-ink-200">
              {isWinner ? '你的诗词历史知识真厉害！' : '继续学习，下次一定能赢！'}
            </p>
          </div>

          <div className="card mb-6">
            <h3 className="title-display text-lg text-ink-400 mb-6 text-center">
              对战结果
            </h3>
            
            <div className="flex items-center justify-between mb-6">
              <div className="text-center flex-1">
                <div className="text-3xl mb-2">👤</div>
                <div className="font-medium text-ink-400">{p1.name}</div>
                <div className={cn(
                  'text-3xl font-bold mt-2',
                  isWinner ? 'text-gold-300' : 'text-ink-200'
                )}>
                  {p1.score}
                </div>
                <div className="text-xs text-ink-100 mt-1">
                  答对 {p1.correctAnswers} 题
                </div>
              </div>
              
              <div className="text-2xl font-bold text-ink-100 px-6">
                VS
              </div>
              
              <div className="text-center flex-1">
                <div className="text-3xl mb-2">🧑</div>
                <div className="font-medium text-ink-400">{p2.name}</div>
                <div className={cn(
                  'text-3xl font-bold mt-2',
                  !isWinner ? 'text-gold-300' : 'text-ink-200'
                )}>
                  {p2.score}
                </div>
                <div className="text-xs text-ink-100 mt-1">
                  答对 {p2.correctAnswers} 题
                </div>
              </div>
            </div>

            {isWinner && (
              <div className="bg-gold-50 rounded-xl p-4 text-center">
                <Trophy className="w-8 h-8 text-gold-300 mx-auto mb-2" />
                <div className="text-gold-300 font-medium">获得 +50 积分</div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setGamePhase('menu')}
              className="btn-secondary flex-1 inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              返回
            </button>
            <button
              onClick={handleStartGame}
              className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              再来一局
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (gamePhase === 'menu') return renderMenu();
  if (gamePhase === 'countdown') return renderCountdown();
  if (gamePhase === 'playing') return renderGame();
  if (gamePhase === 'finished') return renderFinished();

  return renderMenu();
};

export default RacingMode;
