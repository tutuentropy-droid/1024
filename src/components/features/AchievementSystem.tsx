import { useState } from 'react';
import { Award, Trophy, Palette, Music, Crown, Lock, Check, Star, Sparkles, Target, BookOpen, Zap, PenTool, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import type { Achievement, Skin, BGM } from '@/types';

const AchievementSystem = () => {
  const { achievements, skins, bgms, userAchievements, setCurrentSkin, setCurrentBgm, setCurrentTitle } = useAppStore();
  const [activeTab, setActiveTab] = useState<'achievements' | 'skins' | 'bgms' | 'titles'>('achievements');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: '全部', icon: Star },
    { id: 'dynasty', name: '朝代', icon: Crown },
    { id: 'poem', name: '诗词', icon: BookOpen },
    { id: 'quiz', name: '答题', icon: Target },
    { id: 'creation', name: '创作', icon: PenTool },
    { id: 'race', name: '竞速', icon: Zap },
    { id: 'special', name: '特殊', icon: Sparkles },
  ];

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-ink-200 bg-paper-100 border-paper-200';
      case 'rare': return 'text-cobalt-300 bg-cobalt-50 border-cobalt-200';
      case 'epic': return 'text-purple-500 bg-purple-50 border-purple-200';
      case 'legendary': return 'text-gold-300 bg-gold-50 border-gold-200';
      default: return 'text-ink-200 bg-paper-100 border-paper-200';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return '普通';
      case 'rare': return '稀有';
      case 'epic': return '史诗';
      case 'legendary': return '传说';
      default: return rarity;
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-cobalt-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'legendary': return 'from-gold-300 to-orange-400';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const isUnlocked = (achievementId: string) => {
    return userAchievements.unlockedAchievementIds.includes(achievementId);
  };

  const unlockedCount = userAchievements.unlockedAchievementIds.length;
  const totalCount = achievements.length;
  const progressPercent = (unlockedCount / totalCount) * 100;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 text-gold-300 rounded-full text-sm mb-6">
              <Trophy className="w-4 h-4" />
              成就系统
            </div>
            <h1 className="title-display text-4xl text-ink-400 mb-4">
              我的成就
            </h1>
            <p className="text-ink-200 max-w-lg mx-auto">
              完成学习目标，解锁成就，获得专属皮肤和背景音乐
            </p>
          </div>

          <div className="card mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="title-display text-lg text-ink-400 mb-1">
                  成就进度
                </h3>
                <p className="text-sm text-ink-200">
                  已解锁 {unlockedCount} / {totalCount} 个成就
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gold-300">
                  {Math.round(progressPercent)}%
                </p>
              </div>
            </div>
            <div className="h-3 bg-paper-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-300 to-orange-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            {[
              { id: 'achievements', name: '成就', icon: Award },
              { id: 'skins', name: '皮肤', icon: Palette },
              { id: 'bgms', name: '音乐', icon: Music },
              { id: 'titles', name: '称号', icon: Crown },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                    activeTab === tab.id
                      ? 'bg-gold-100 text-gold-500'
                      : 'text-ink-200 hover:bg-paper-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {activeTab === 'achievements' && (
            <>
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                        selectedCategory === cat.id
                          ? 'bg-purple-100 text-purple-600'
                          : 'text-ink-200 hover:bg-paper-100'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAchievements.map((achievement, index) => {
                  const unlocked = isUnlocked(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={cn(
                        'card transition-all duration-300 animate-fade-in-up',
                        !unlocked && 'opacity-60'
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl',
                          unlocked
                            ? `bg-gradient-to-br ${getRarityGradient(achievement.rarity)}`
                            : 'bg-paper-200'
                        )}>
                          {unlocked ? (
                            <span>{achievement.icon}</span>
                          ) : (
                            <Lock className="w-6 h-6 text-ink-100" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className={cn(
                              'title-display text-lg',
                              unlocked ? 'text-ink-400' : 'text-ink-200'
                            )}>
                              {achievement.name}
                            </h3>
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ml-2',
                              getRarityColor(achievement.rarity)
                            )}>
                              {getRarityText(achievement.rarity)}
                            </span>
                          </div>
                          <p className="text-sm text-ink-200 mb-2">
                            {achievement.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-ink-100">
                            <span>奖励：</span>
                            {achievement.rewardType === 'skin' && (
                              <span className="flex items-center gap-1">
                                <Palette className="w-3 h-3" />
                                专属皮肤
                              </span>
                            )}
                            {achievement.rewardType === 'bgm' && (
                              <span className="flex items-center gap-1">
                                <Music className="w-3 h-3" />
                                背景音乐
                              </span>
                            )}
                            {achievement.rewardType === 'title' && (
                              <span className="flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                专属称号
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === 'skins' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {skins.map((skin, index) => {
                const unlocked = userAchievements.unlockedSkinIds.includes(skin.id);
                const isCurrent = userAchievements.currentSkinId === skin.id;
                return (
                  <div
                    key={skin.id}
                    className={cn(
                      'card transition-all duration-300 animate-fade-in-up',
                      isCurrent && 'ring-2 ring-gold-300',
                      !unlocked && 'opacity-50'
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className="h-24 rounded-xl mb-4"
                      style={{
                        backgroundColor: skin.theme.backgroundColor,
                        backgroundImage: `linear-gradient(135deg, ${skin.theme.primaryColor}20, ${skin.theme.secondaryColor}20)`,
                      }}
                    >
                      <div className="h-full flex items-center justify-center">
                        <div
                          className="w-12 h-12 rounded-full"
                          style={{ backgroundColor: skin.theme.primaryColor }}
                        />
                      </div>
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="title-display text-base text-ink-400">
                          {skin.name}
                        </h3>
                        <span className={cn(
                          'text-xs px-1.5 py-0.5 rounded',
                          getRarityColor(skin.rarity)
                        )}>
                          {getRarityText(skin.rarity)}
                        </span>
                      </div>
                      {isCurrent && (
                        <Check className="w-5 h-5 text-gold-300" />
                      )}
                    </div>
                    <p className="text-xs text-ink-200 mb-3">
                      {skin.description}
                    </p>
                    {unlocked && !isCurrent && (
                      <button
                        onClick={() => setCurrentSkin(skin.id)}
                        className="w-full py-2 text-sm bg-paper-100 text-ink-300 rounded-lg hover:bg-paper-200 transition-colors"
                      >
                        使用
                      </button>
                    )}
                    {!unlocked && (
                      <div className="flex items-center justify-center gap-1 text-xs text-ink-100 py-2">
                        <Lock className="w-3 h-3" />
                        未解锁
                      </div>
                    )}
                    {isCurrent && (
                      <div className="text-center text-xs text-gold-300 py-2">
                        使用中
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'bgms' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bgms.map((bgm, index) => {
                const unlocked = userAchievements.unlockedBgmIds.includes(bgm.id);
                const isCurrent = userAchievements.currentBgmId === bgm.id;
                return (
                  <div
                    key={bgm.id}
                    className={cn(
                      'card transition-all duration-300 animate-fade-in-up',
                      isCurrent && 'ring-2 ring-gold-300',
                      !unlocked && 'opacity-50'
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
                        unlocked
                          ? 'bg-gradient-to-br from-purple-400 to-pink-400'
                          : 'bg-paper-200'
                      )}>
                        {unlocked ? (
                          <Music className="w-6 h-6 text-white" />
                        ) : (
                          <Lock className="w-5 h-5 text-ink-100" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="title-display text-base text-ink-400">
                            {bgm.name}
                          </h3>
                          <span className={cn(
                            'text-xs px-1.5 py-0.5 rounded',
                            getRarityColor(bgm.rarity)
                          )}>
                            {getRarityText(bgm.rarity)}
                          </span>
                        </div>
                        <p className="text-xs text-ink-200 mb-1">
                          {bgm.description}
                        </p>
                        <p className="text-xs text-ink-100">
                          风格：{bgm.style} · 时长：{Math.floor(bgm.duration / 60)}:{(bgm.duration % 60).toString().padStart(2, '0')}
                        </p>
                      </div>
                      <div>
                        {unlocked && !isCurrent && (
                          <button
                            onClick={() => setCurrentBgm(bgm.id)}
                            className="px-3 py-1.5 text-xs bg-paper-100 text-ink-300 rounded-lg hover:bg-paper-200 transition-colors"
                          >
                            使用
                          </button>
                        )}
                        {isCurrent && (
                          <Check className="w-5 h-5 text-gold-300" />
                        )}
                        {!unlocked && (
                          <Lock className="w-4 h-4 text-ink-100" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'titles' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userAchievements.titles.length === 0 ? (
                <div className="col-span-full card text-center py-12">
                  <Crown className="w-12 h-12 text-ink-100 mx-auto mb-3" />
                  <p className="text-ink-200 text-sm">还没有获得称号</p>
                  <p className="text-ink-100 text-xs mt-1">完成成就解锁专属称号</p>
                </div>
              ) : (
                userAchievements.titles.map((title, index) => {
                  const isCurrent = userAchievements.currentTitle === title;
                  return (
                    <div
                      key={index}
                      className={cn(
                        'card text-center p-4 cursor-pointer transition-all',
                        isCurrent && 'ring-2 ring-gold-300'
                      )}
                      onClick={() => setCurrentTitle(title)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="text-3xl mb-2">👑</div>
                      <p className="text-sm font-medium text-ink-400 mb-1">
                        {title}
                      </p>
                      {isCurrent && (
                        <span className="text-xs text-gold-300">使用中</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementSystem;
