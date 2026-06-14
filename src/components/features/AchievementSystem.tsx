import { useState } from 'react';
import { Trophy, Palette, Music, Lock, Check, Star, Sparkles, Crown, Flame } from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import type { Achievement, Skin, BackgroundMusic } from '@/types';

const AchievementSystem = () => {
  const { 
    achievements, 
    skins, 
    backgroundMusics, 
    userAchievements,
    setCurrentSkin,
    setCurrentMusic,
    checkAchievements
  } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'achievements' | 'skins' | 'music'>('achievements');

  const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
    common: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200' },
    rare: { bg: 'bg-blue-100', text: 'text-blue-500', border: 'border-blue-200' },
    epic: { bg: 'bg-purple-100', text: 'text-purple-500', border: 'border-purple-200' },
    legendary: { bg: 'bg-gold-50', text: 'text-gold-300', border: 'border-gold-200' },
  };

  const rarityLabels: Record<string, string> = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  };

  const categoryLabels: Record<string, string> = {
    dynasty: '朝代',
    poem: '诗词',
    quiz: '测试',
    social: '社交',
    special: '特殊',
  };

  const unlockedCount = userAchievements.unlockedAchievements.length;
  const totalCount = achievements.length;
  const progressPercent = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const isAchievementUnlocked = (achievementId: string) => 
    userAchievements.unlockedAchievements.includes(achievementId);

  const isSkinUnlocked = (skinId: string) => 
    userAchievements.unlockedSkins.includes(skinId);

  const isMusicUnlocked = (musicId: string) => 
    userAchievements.unlockedMusics.includes(musicId);

  const handleCheckAchievements = () => {
    checkAchievements();
  };

  const renderAchievements = () => {
    const categories = ['dynasty', 'poem', 'quiz', 'special'] as const;
    
    return (
      <div className="space-y-8">
        <div className="card bg-gradient-to-r from-gold-50 to-purple-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-ink-200 mb-1">成就进度</div>
              <div className="text-2xl font-bold text-ink-400">
                {unlockedCount} / {totalCount}
              </div>
            </div>
            <div className="text-4xl">
              {unlockedCount >= totalCount ? '🏆' : unlockedCount >= totalCount * 0.5 ? '⭐' : '🎯'}
            </div>
          </div>
          <div className="h-3 bg-paper-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-gold-300 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <button
            onClick={handleCheckAchievements}
            className="mt-4 text-sm text-purple-500 hover:text-purple-600 font-medium"
          >
            检查成就 →
          </button>
        </div>

        {categories.map(category => {
          const categoryAchievements = achievements.filter(a => a.category === category);
          const unlockedInCategory = categoryAchievements.filter(a => isAchievementUnlocked(a.id)).length;
          
          if (categoryAchievements.length === 0) return null;

          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="title-display text-lg text-ink-400">
                  {categoryLabels[category]}成就
                </h3>
                <span className="text-sm text-ink-100">
                  {unlockedInCategory}/{categoryAchievements.length}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryAchievements.map(achievement => {
                  const unlocked = isAchievementUnlocked(achievement.id);
                  const colors = rarityColors[achievement.rarity];
                  
                  return (
                    <div
                      key={achievement.id}
                      className={cn(
                        'card relative overflow-hidden transition-all',
                        unlocked ? 'opacity-100' : 'opacity-60'
                      )}
                    >
                      <div className={cn(
                        'absolute top-0 right-0 w-16 h-16 -translate-y-8 translate-x-8 rounded-full',
                        colors.bg
                      )} />
                      
                      <div className="relative flex items-start gap-4">
                        <div className={cn(
                          'w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0',
                          unlocked ? colors.bg : 'bg-gray-100'
                        )}>
                          {unlocked ? (
                            achievement.icon
                          ) : (
                            <Lock className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-ink-400">
                              {achievement.name}
                            </h4>
                            {unlocked && (
                              <Check className="w-4 h-4 text-jade-300" />
                            )}
                          </div>
                          <p className="text-sm text-ink-200 mb-2">
                            {achievement.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded-full',
                              colors.bg, colors.text
                            )}>
                              {rarityLabels[achievement.rarity]}
                            </span>
                            {unlocked && achievement.reward && (
                              <span className="text-xs text-ink-100">
                                奖励：{achievement.reward.type === 'skin' ? '皮肤' : achievement.reward.type === 'music' ? '音乐' : '称号'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSkins = () => (
    <div className="space-y-6">
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-3">
          <Palette className="w-8 h-8 text-purple-500" />
          <div>
            <div className="font-medium text-ink-400">皮肤系统</div>
            <div className="text-sm text-ink-200">
              已解锁 {userAchievements.unlockedSkins.length} / {skins.length} 款皮肤
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skins.map(skin => {
          const unlocked = isSkinUnlocked(skin.id);
          const isCurrent = userAchievements.currentSkinId === skin.id;
          const colors = rarityColors[skin.rarity];
          
          return (
            <div
              key={skin.id}
              className={cn(
                'card relative overflow-hidden transition-all',
                !unlocked && 'opacity-60',
                isCurrent && 'ring-2 ring-purple-400'
              )}
            >
              <div 
                className="h-20 rounded-lg mb-4"
                style={{ 
                  background: `linear-gradient(135deg, ${skin.theme.primary}, ${skin.theme.accent})` 
                }}
              />
              
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-ink-400 flex items-center gap-2">
                    {skin.name}
                    {isCurrent && (
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-500 rounded-full">
                        使用中
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-ink-200 mt-1">
                    {skin.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  colors.bg, colors.text
                )}>
                  {rarityLabels[skin.rarity]}
                </span>
                
                {unlocked ? (
                  <button
                    onClick={() => setCurrentSkin(skin.id)}
                    disabled={isCurrent}
                    className={cn(
                      'text-sm px-3 py-1 rounded-lg transition-all',
                      isCurrent 
                        ? 'bg-paper-100 text-ink-100 cursor-default' 
                        : 'bg-purple-100 text-purple-500 hover:bg-purple-200'
                    )}
                  >
                    {isCurrent ? '已使用' : '使用'}
                  </button>
                ) : (
                  <span className="text-xs text-ink-100 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    未解锁
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMusic = () => (
    <div className="space-y-6">
      <div className="card bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center gap-3">
          <Music className="w-8 h-8 text-blue-500" />
          <div>
            <div className="font-medium text-ink-400">背景音乐</div>
            <div className="text-sm text-ink-200">
              已解锁 {userAchievements.unlockedMusics.length} / {backgroundMusics.length} 首音乐
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {backgroundMusics.map(music => {
          const unlocked = isMusicUnlocked(music.id);
          const isCurrent = userAchievements.currentMusicId === music.id;
          const colors = rarityColors[music.rarity];
          
          return (
            <div
              key={music.id}
              className={cn(
                'card flex items-center gap-4 transition-all',
                !unlocked && 'opacity-60',
                isCurrent && 'ring-2 ring-blue-400'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                isCurrent ? 'bg-blue-100' : 'bg-paper-100'
              )}>
                {isCurrent ? (
                  <div className="flex items-end gap-0.5 h-5">
                    <div className="w-1 bg-blue-400 rounded-full animate-pulse" style={{ height: '60%' }} />
                    <div className="w-1 bg-blue-400 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '0.1s' }} />
                    <div className="w-1 bg-blue-400 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0.2s' }} />
                    <div className="w-1 bg-blue-400 rounded-full animate-pulse" style={{ height: '80%', animationDelay: '0.3s' }} />
                  </div>
                ) : (
                  <Music className={cn('w-5 h-5', unlocked ? 'text-blue-400' : 'text-gray-300')} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-ink-400">
                    {music.name}
                  </h4>
                  <span className={cn(
                    'text-xs px-1.5 py-0.5 rounded',
                    colors.bg, colors.text
                  )}>
                    {rarityLabels[music.rarity]}
                  </span>
                </div>
                <p className="text-sm text-ink-200 mt-0.5">
                  {music.description}
                </p>
                {music.composer && (
                  <p className="text-xs text-ink-100 mt-1">
                    {music.composer}
                  </p>
                )}
              </div>

              {unlocked ? (
                <button
                  onClick={() => setCurrentMusic(music.id)}
                  disabled={isCurrent}
                  className={cn(
                    'text-sm px-3 py-1.5 rounded-lg transition-all flex-shrink-0',
                    isCurrent 
                      ? 'bg-blue-100 text-blue-500 cursor-default' 
                      : 'bg-blue-100 text-blue-500 hover:bg-blue-200'
                  )}
                >
                  {isCurrent ? '播放中' : '使用'}
                </button>
              ) : (
                <span className="text-ink-100 flex items-center gap-1 flex-shrink-0">
                  <Lock className="w-4 h-4" />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="card bg-paper-50">
        <div className="text-sm text-ink-200 text-center">
          💡 通过完成成就解锁更多皮肤和背景音乐
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-500 rounded-full text-sm mb-6">
            <Trophy className="w-4 h-4" />
            成就系统
          </div>
          <h1 className="title-display text-4xl text-ink-400 mb-4">
            我的成就
          </h1>
          <p className="text-ink-200 max-w-md mx-auto">
            完成学习目标解锁成就，获得专属皮肤和背景音乐奖励
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('achievements')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2',
              activeTab === 'achievements'
                ? 'bg-purple-500 text-white'
                : 'bg-paper-100 text-ink-200 hover:bg-paper-200'
            )}
          >
            <Trophy className="w-4 h-4" />
            成就
          </button>
          <button
            onClick={() => setActiveTab('skins')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2',
              activeTab === 'skins'
                ? 'bg-purple-500 text-white'
                : 'bg-paper-100 text-ink-200 hover:bg-paper-200'
            )}
          >
            <Palette className="w-4 h-4" />
            皮肤
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2',
              activeTab === 'music'
                ? 'bg-purple-500 text-white'
                : 'bg-paper-100 text-ink-200 hover:bg-paper-200'
            )}
          >
            <Music className="w-4 h-4" />
            音乐
          </button>
        </div>

        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'skins' && renderSkins()}
        {activeTab === 'music' && renderMusic()}
      </div>
    </div>
  );
};

export default AchievementSystem;
