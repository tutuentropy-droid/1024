import { useState, useEffect, useMemo } from 'react';
import { Clock, BookOpen, Award, RotateCcw, ChevronRight, Sparkles, Zap, Lightbulb, X, Trophy, MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getDynastyById, getAdventureById, getPoemById } from '@/data';
import type { Adventure, AdventureScene, AdventureChoice } from '@/types';

const formatYear = (year: number): string => {
  if (year < 0) return `公元前${Math.abs(year)}年`;
  return `公元${year}年`;
};

const TimeMachinePage = () => {
  const [selectedAdventureId, setSelectedAdventureId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showConsequence, setShowConsequence] = useState(false);
  const [lastChoiceResult, setLastChoiceResult] = useState<{
    type: 'success' | 'failure' | 'neutral';
    message: string;
    poemReveal?: {
      poemId: string;
      famousLine: string;
      explanation: string;
    };
  } | null>(null);

  const adventures = useAppStore((state) => state.adventures);
  const currentAdventure = useAppStore((state) => state.currentAdventure);
  const startAdventure = useAppStore((state) => state.startAdventure);
  const makeAdventureChoice = useAppStore((state) => state.makeAdventureChoice);
  const resetAdventure = useAppStore((state) => state.resetAdventure);

  const selectedAdventure = useMemo(() => {
    if (currentAdventure) {
      return getAdventureById(currentAdventure.adventureId);
    }
    if (selectedAdventureId) {
      return getAdventureById(selectedAdventureId);
    }
    return null;
  }, [currentAdventure, selectedAdventureId]);

  const currentScene = useMemo(() => {
    if (!currentAdventure || !selectedAdventure) return null;
    return selectedAdventure.scenes[currentAdventure.currentSceneId];
  }, [currentAdventure, selectedAdventure]);

  const sceneImageUrl = useMemo(() => {
    if (!currentScene?.imagePrompt) return '';
    const encodedPrompt = encodeURIComponent(currentScene.imagePrompt);
    return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=landscape_16_9`;
  }, [currentScene]);

  const handleStartAdventure = (adventure: Adventure) => {
    setSelectedAdventureId(adventure.id);
    startAdventure(adventure.id);
  };

  const handleChoice = (scene: AdventureScene, choice: AdventureChoice) => {
    makeAdventureChoice(scene.id, choice.id);
    setLastChoiceResult({
      type: choice.consequence.type,
      message: choice.consequence.message,
      poemReveal: choice.consequence.poemReveal
    });
    setShowConsequence(true);
    setShowHint(false);
  };

  const handleContinue = () => {
    setShowConsequence(false);
    setLastChoiceResult(null);
  };

  const handleReset = () => {
    resetAdventure();
    setSelectedAdventureId(null);
    setShowConsequence(false);
    setLastChoiceResult(null);
    setShowHint(false);
  };

  const getChoiceRequiresKnowledge = (choice: AdventureChoice) => {
    if (!choice.requiredPoemKnowledge) return false;
    const { poemId } = choice.requiredPoemKnowledge;
    if (!poemId || !currentAdventure) return false;
    return !currentAdventure.poemsUnlocked.includes(poemId);
  };

  if (!currentAdventure || !selectedAdventure || !currentScene) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-500 rounded-full text-sm mb-4">
              <Zap className="w-4 h-4" />
              穿越历史的迷雾
            </div>
            <h1 className="title-display text-4xl text-ink-400 mb-3">
              时空穿梭机
            </h1>
            <p className="text-ink-200 max-w-2xl mx-auto">
              第一人称进入历史时刻，用你的诗词知识做出正确选择，改变历史的走向
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {adventures.map((adventure, index) => {
              const dynasty = getDynastyById(adventure.dynastyId);
              const requiredPoems = adventure.requiredPoemIds
                .map(id => getPoemById(id))
                .filter(Boolean);

              return (
                <div
                  key={adventure.id}
                  className="card group cursor-pointer animate-fade-in-up hover:-translate-y-2 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleStartAdventure(adventure)}
                >
                  <div className="relative mb-4">
                    <div
                      className="w-full h-48 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center overflow-hidden"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${dynasty?.color}30 0%, ${dynasty?.color}50 100%)`
                      }}
                    >
                      <Clock className="w-16 h-16 text-ink-100" />
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: dynasty?.color }}
                      />
                      <span className="text-xs text-ink-100 bg-paper-50/80 px-2 py-0.5 rounded-full">
                        {dynasty?.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <h3 className="title-display text-xl text-ink-400 group-hover:text-purple-500 transition-colors">
                      {adventure.title}
                    </h3>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs',
                      adventure.difficulty === 'easy' ? 'bg-jade-50 text-jade-300' :
                      adventure.difficulty === 'medium' ? 'bg-gold-50 text-gold-300' :
                      'bg-cinnabar-50 text-cinnabar-300'
                    )}>
                      {adventure.difficulty === 'easy' ? '简单' :
                       adventure.difficulty === 'medium' ? '中等' : '困难'}
                    </span>
                  </div>

                  <p className="text-sm text-ink-200 mb-4 line-clamp-2">
                    {adventure.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-ink-100 mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{formatYear(adventure.year)}</span>
                    <span className="mx-1">·</span>
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{requiredPoems.length} 首关联诗词</span>
                  </div>

                  <div className="pt-4 border-t border-paper-200">
                    <p className="text-xs text-ink-100 mb-2">需要掌握的诗词</p>
                    <div className="flex flex-wrap gap-2">
                      {requiredPoems.slice(0, 3).map((poem) => (
                        <span
                          key={poem?.id}
                          className="text-xs bg-purple-50 text-purple-500 px-2 py-0.5 rounded-full"
                        >
                          《{poem?.title}》
                        </span>
                      ))}
                      {requiredPoems.length > 3 && (
                        <span className="text-xs text-ink-100">
                          +{requiredPoems.length - 3} 首
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end">
                    <span className="text-purple-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      开始冒险
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const dynasty = getDynastyById(selectedAdventure.dynastyId);
  const isGameOver = currentAdventure.isCompleted;
  const visitedCount = currentAdventure.visitedSceneIds.length;
  const totalScenes = Object.keys(selectedAdventure.scenes).length;
  const progress = Math.min((visitedCount / totalScenes) * 100, 100);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-ink-200 hover:text-ink-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              返回列表
            </button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gold-300" />
                <span className="text-sm text-ink-200 font-medium">
                  {currentAdventure.score} 分
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-ink-200 font-medium">
                  已解锁 {currentAdventure.poemsUnlocked.length} 首
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-ink-100 mb-2">
              <span>冒险进度</span>
              <span>{visitedCount} / {totalScenes}</span>
            </div>
            <div className="h-2 bg-paper-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="card overflow-hidden animate-fade-in-up">
            {sceneImageUrl && (
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={sceneImageUrl}
                  alt={currentScene.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-400/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: dynasty?.color }}
                    />
                    <span className="text-xs text-paper-50/80">
                      {dynasty?.name} · {formatYear(selectedAdventure.year)}
                    </span>
                  </div>
                  <h2 className="title-display text-3xl text-paper-50">
                    {currentScene.title}
                  </h2>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-ink-200 mb-2">{currentScene.description}</p>
                <div className="bg-paper-50 rounded-xl p-4 border border-paper-200">
                  {currentScene.narrative.split('\n\n').map((para, idx) => (
                    <p key={idx} className="text-ink-300 leading-relaxed mb-3 last:mb-0">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {!isGameOver && !showConsequence && (
                <>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-ink-300 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      你会怎么做？
                    </h4>

                    <div className="space-y-3">
                      {currentScene.choices.map((choice, idx) => {
                        const requiresKnowledge = getChoiceRequiresKnowledge(choice);

                        return (
                          <button
                            key={choice.id}
                            onClick={() => handleChoice(currentScene, choice)}
                            className={cn(
                              'w-full text-left p-4 rounded-xl border-2 transition-all duration-300',
                              'hover:border-purple-300 hover:bg-purple-50',
                              'bg-paper-50 border-paper-200'
                            )}
                            style={{ animationDelay: `${idx * 100}ms` }}
                          >
                            <div className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-ink-300 font-medium mb-1">
                                  {choice.text}
                                </p>
                                {choice.requiredPoemKnowledge && (
                                  <p className="text-xs text-purple-500 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    需要诗词知识：{choice.requiredPoemKnowledge.hint}
                                  </p>
                                )}
                              </div>
                              <ChevronRight className="w-5 h-5 text-ink-100 flex-shrink-0" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {!showHint && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="text-xs text-ink-100 hover:text-purple-500 flex items-center gap-1 transition-colors"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      需要提示？
                    </button>
                  )}

                  {showHint && (
                    <div className="mt-4 p-4 bg-gold-50 rounded-xl border border-gold-200">
                      <p className="text-sm text-gold-400 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                          仔细回想学过的诗词，这些诗句中蕴含着古人的智慧和历史的经验。
                          正确的选择往往与诗词表达的意境和哲理相关。
                        </span>
                      </p>
                    </div>
                  )}
                </>
              )}

              {showConsequence && lastChoiceResult && (
                <div className="animate-fade-in-up">
                  <div className={cn(
                    'p-4 rounded-xl mb-4',
                    lastChoiceResult.type === 'success' && 'bg-jade-50 border border-jade-200',
                    lastChoiceResult.type === 'failure' && 'bg-cinnabar-50 border border-cinnabar-200',
                    lastChoiceResult.type === 'neutral' && 'bg-gold-50 border border-gold-200'
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      {lastChoiceResult.type === 'success' && (
                        <Trophy className="w-5 h-5 text-jade-300" />
                      )}
                      {lastChoiceResult.type === 'failure' && (
                        <X className="w-5 h-5 text-cinnabar-300" />
                      )}
                      {lastChoiceResult.type === 'neutral' && (
                        <Award className="w-5 h-5 text-gold-300" />
                      )}
                      <span className={cn(
                        'font-medium',
                        lastChoiceResult.type === 'success' && 'text-jade-300',
                        lastChoiceResult.type === 'failure' && 'text-cinnabar-300',
                        lastChoiceResult.type === 'neutral' && 'text-gold-300'
                      )}>
                        {lastChoiceResult.type === 'success' && '选择正确！'}
                        {lastChoiceResult.type === 'failure' && '这不是最佳选择...'}
                        {lastChoiceResult.type === 'neutral' && '继续前进'}
                      </span>
                    </div>
                    <p className="text-sm text-ink-300">
                      {lastChoiceResult.message}
                    </p>
                  </div>

                  {lastChoiceResult.poemReveal && (
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <span className="font-medium text-purple-500">
                          诗词解锁
                        </span>
                      </div>
                      <p className="text-lg font-kai text-cinnabar-300 mb-2">
                        「{lastChoiceResult.poemReveal.famousLine}」
                      </p>
                      <p className="text-sm text-ink-300">
                        {lastChoiceResult.poemReveal.explanation}
                      </p>
                      {(() => {
                        const poem = getPoemById(lastChoiceResult.poemReveal.poemId);
                        return poem ? (
                          <p className="text-xs text-ink-100 mt-2">
                            —— {poem.author}《{poem.title}》
                          </p>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {!isGameOver && (
                    <button
                      onClick={handleContinue}
                      className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                    >
                      继续冒险
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {isGameOver && (
                <div className="text-center animate-fade-in-up">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-gold-300" />
                  </div>
                  <h3 className="title-display text-2xl text-ink-400 mb-2">
                    冒险结束！
                  </h3>
                  <p className="text-ink-200 mb-6">
                    {currentAdventure.score >= 200
                      ? '恭喜你！你成功改变了历史，成为了时代的英雄！'
                      : currentAdventure.score >= 100
                      ? '你完成了冒险，虽然有些波折，但你学到了很多。'
                      : '这次冒险不太顺利，不过没关系，历史可以重来！'}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-paper-50 rounded-xl border border-paper-200">
                      <div className="text-2xl font-bold text-purple-500 mb-1">
                        {currentAdventure.score}
                      </div>
                      <div className="text-xs text-ink-100">总得分</div>
                    </div>
                    <div className="p-4 bg-paper-50 rounded-xl border border-paper-200">
                      <div className="text-2xl font-bold text-cobalt-300 mb-1">
                        {visitedCount}
                      </div>
                      <div className="text-xs text-ink-100">经历场景</div>
                    </div>
                    <div className="p-4 bg-paper-50 rounded-xl border border-paper-200">
                      <div className="text-2xl font-bold text-cinnabar-300 mb-1">
                        {currentAdventure.poemsUnlocked.length}
                      </div>
                      <div className="text-xs text-ink-100">解锁诗词</div>
                    </div>
                  </div>

                  {currentAdventure.poemsUnlocked.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-ink-300 mb-3 text-left">
                        本次冒险解锁的诗词
                      </h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {currentAdventure.poemsUnlocked.map((poemId) => {
                          const poem = getPoemById(poemId);
                          return poem ? (
                            <span
                              key={poemId}
                              className="text-xs bg-purple-50 text-purple-500 px-3 py-1.5 rounded-full"
                            >
                              《{poem.title}》· {poem.author}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleReset}
                      className="btn-secondary px-6 py-2 inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      选择其他冒险
                    </button>
                    <button
                      onClick={() => {
                        handleReset();
                        setTimeout(() => {
                          handleStartAdventure(selectedAdventure);
                        }, 100);
                      }}
                      className="btn-primary px-6 py-2 inline-flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      再玩一次
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeMachinePage;
