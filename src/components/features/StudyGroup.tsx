import { useState } from 'react';
import { Users, Puzzle, Image, MessageCircle, BookOpen, Trophy, ChevronRight, Crown, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import DynastyPuzzle from './DynastyPuzzle';
import KnowledgePoster from './KnowledgePoster';
import SocialPage from '@/pages/SocialPage';
import AlmanacGenerator from './AlmanacGenerator';

type TabType = 'home' | 'puzzle' | 'poster' | 'social' | 'almanac';

const StudyGroup = () => {
  const { studyGroup, userProgress, dynasties, generateAlmanac } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const tabs = [
    { id: 'home' as TabType, label: '小组首页', icon: Users },
    { id: 'puzzle' as TabType, label: '朝代拼图', icon: Puzzle },
    { id: 'poster' as TabType, label: '知识海报', icon: Image },
    { id: 'social' as TabType, label: '文人朋友圈', icon: MessageCircle },
    { id: 'almanac' as TabType, label: '学习年鉴', icon: BookOpen },
  ];

  const completedDynasties = userProgress.completedDynasties;

  const renderContent = () => {
    switch (activeTab) {
      case 'puzzle':
        return <DynastyPuzzle />;
      case 'poster':
        return <KnowledgePoster />;
      case 'social':
        return <SocialPage />;
      case 'almanac':
        return <AlmanacGenerator />;
      default:
        return null;
    }
  };

  if (activeTab !== 'home') {
    return (
      <div>
        <div className="sticky top-[73px] z-40 bg-paper-50 border-b border-paper-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 py-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('home')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2',
                  'text-ink-200 hover:bg-paper-100'
                )}
              >
                <Users className="w-4 h-4" />
                小组首页
              </button>
              {tabs.filter(t => t.id !== 'home').map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2',
                      activeTab === tab.id
                        ? 'bg-cinnabar-100 text-cinnabar-300'
                        : 'text-ink-200 hover:bg-paper-100'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cinnabar-50 text-cinnabar-300 rounded-full text-sm mb-4">
              <Users className="w-4 h-4" />
              共学诗史小组
            </div>
            <h1 className="title-display text-4xl text-ink-400 mb-3">
              诗友同行 · 共筑华章
            </h1>
            <p className="text-ink-200 max-w-xl mx-auto">
              与志同道合的诗友一起，拼朝代、做海报、交朋友、记笔记，共同探索中华诗词的魅力
            </p>
          </div>

          <div className="sticky top-[73px] z-40 bg-paper-50 border-b border-paper-200 mb-8 rounded-t-xl">
            <div className="flex items-center gap-2 py-3 overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2',
                      activeTab === tab.id
                        ? 'bg-cinnabar-100 text-cinnabar-300'
                        : 'text-ink-200 hover:bg-paper-100'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {studyGroup && (
            <div className="card mb-8 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="title-display text-2xl text-ink-400 mb-1">
                    {studyGroup.name}
                  </h2>
                  <p className="text-sm text-ink-100">
                    {studyGroup.members.length} 名成员 · 已完成 {studyGroup.completedPuzzles.length} 个拼图
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-gold-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {studyGroup.members.map((member, index) => (
                  <div 
                    key={member.id}
                    className={cn(
                      'p-4 rounded-xl text-center transition-all duration-300',
                      member.id === 'user-1' 
                        ? 'bg-gradient-to-br from-cinnabar-50 to-cinnabar-100 border-2 border-cinnabar-200' 
                        : 'bg-paper-50 border border-paper-200'
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative inline-block mb-2">
                      <span className="text-3xl">{member.avatar}</span>
                      {member.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-jade-400 rounded-full border-2 border-paper-50" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-ink-300">{member.name}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Crown className="w-3.5 h-3.5 text-gold-400" />
                      <span className="text-xs text-ink-100">{member.contribution} 贡献</span>
                    </div>
                    {member.id === 'user-1' && (
                      <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-cinnabar-200 text-cinnabar-300 rounded-full">
                        我
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-purple-50 text-center">
                  <Puzzle className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-ink-400">
                    {studyGroup.completedPuzzles.length}
                  </p>
                  <p className="text-xs text-ink-100">完成拼图</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 text-center">
                  <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-ink-400">
                    {studyGroup.members.reduce((sum, m) => sum + m.contribution, 0)}
                  </p>
                  <p className="text-xs text-ink-100">总贡献值</p>
                </div>
                <div className="p-4 rounded-xl bg-jade-50 text-center">
                  <Users className="w-6 h-6 text-jade-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-ink-400">
                    {studyGroup.members.filter(m => m.isOnline).length}
                  </p>
                  <p className="text-xs text-ink-100">在线成员</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div 
              onClick={() => setActiveTab('puzzle')}
              className="card cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Puzzle className="w-7 h-7 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="title-display text-lg text-ink-400 mb-2 flex items-center gap-2">
                    朝代拼图
                    <Sparkles className="w-4 h-4 text-gold-400" />
                  </h3>
                  <p className="text-sm text-ink-200 mb-3">
                    与小组成员协作，将散落的历史碎片拼成完整的朝代画卷
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-100">
                      已完成 {studyGroup?.completedPuzzles.length || 0} 个
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-purple-600">
                      开始挑战
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('poster')}
              className="card cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: '50ms' }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Image className="w-7 h-7 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="title-display text-lg text-ink-400 mb-2 flex items-center gap-2">
                    知识海报
                    <Sparkles className="w-4 h-4 text-gold-400" />
                  </h3>
                  <p className="text-sm text-ink-200 mb-3">
                    完成拼图后自动生成精美知识海报，可下载打印收藏
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-100">
                      可生成 {dynasties.length} 个朝代海报
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                      查看海报
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('social')}
              className="card cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-7 h-7 text-rose-600" />
                </div>
                <div className="flex-1">
                  <h3 className="title-display text-lg text-ink-400 mb-2 flex items-center gap-2">
                    文人朋友圈
                    <Sparkles className="w-4 h-4 text-gold-400" />
                  </h3>
                  <p className="text-sm text-ink-200 mb-3">
                    穿越千年与李白、杜甫等大诗人互动，AI第一人称回答历史问题
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-100">
                      10+ 位虚拟诗人等你对话
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-rose-600">
                      去逛一逛
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('almanac')}
              className="card cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: '150ms' }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-jade-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-7 h-7 text-jade-600" />
                </div>
                <div className="flex-1">
                  <h3 className="title-display text-lg text-ink-400 mb-2 flex items-center gap-2">
                    学习年鉴
                    <Sparkles className="w-4 h-4 text-gold-400" />
                  </h3>
                  <p className="text-sm text-ink-200 mb-3">
                    学习完朝代后自动生成PDF年鉴，含笔记、错题和诗词摘抄
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-100">
                      {completedDynasties.length} 个朝代可生成
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-jade-600">
                      生成年鉴
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {completedDynasties.length > 0 && (
            <div className="card animate-fade-in-up">
              <h3 className="title-display text-lg text-ink-400 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold-400" />
                已完成的朝代
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {completedDynasties.map((dynastyId, index) => {
                  const dynasty = dynasties.find(d => d.id === dynastyId);
                  if (!dynasty) return null;
                  return (
                    <div 
                      key={dynastyId}
                      className="p-4 rounded-xl bg-gradient-to-br from-gold-50 to-gold-100 border border-gold-200 text-center"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div 
                        className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: dynasty.color + '30', color: dynasty.color }}
                      >
                        {dynasty.name.charAt(0)}
                      </div>
                      <p className="text-sm font-medium text-ink-300">{dynasty.name}</p>
                      <p className="text-xs text-gold-600 mt-1">已完成</p>
                      <button
                        onClick={() => generateAlmanac(dynastyId)}
                        className="mt-2 w-full px-2 py-1 text-xs bg-gold-200 text-gold-700 rounded-md hover:bg-gold-300 transition-colors"
                      >
                        生成年鉴
                      </button>
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
};

export default StudyGroup;
