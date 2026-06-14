import { useState } from 'react';
import { PenTool, BookOpen, History, Sparkles, Check, ChevronRight, Award, Star, BookMarked, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getPoemById, getEventById, getDynastyById } from '@/data';
import type { CreationWorkshop as CreationWorkshopType, CreationSubmission } from '@/types';

const CreationWorkshop = () => {
  const { creationWorkshops, submitCreation, creationSubmissions, unlockAchievement, checkAchievements } = useAppStore();
  const [selectedWorkshop, setSelectedWorkshop] = useState<CreationWorkshopType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [usedPoemIds, setUsedPoemIds] = useState<string[]>([]);
  const [usedEventIds, setUsedEventIds] = useState<string[]>([]);
  const [submission, setSubmission] = useState<CreationSubmission | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<'workshops' | 'history'>('workshops');

  const handleSelectWorkshop = (workshop: CreationWorkshopType) => {
    setSelectedWorkshop(workshop);
    setTitle('');
    setContent('');
    setUsedPoemIds([]);
    setUsedEventIds([]);
    setSubmission(null);
    setShowResult(false);
  };

  const togglePoem = (poemId: string) => {
    setUsedPoemIds(prev =>
      prev.includes(poemId)
        ? prev.filter(id => id !== poemId)
        : [...prev, poemId]
    );
  };

  const toggleEvent = (eventId: string) => {
    setUsedEventIds(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSubmit = () => {
    if (!selectedWorkshop || !title.trim() || !content.trim()) return;

    const result = submitCreation(
      selectedWorkshop.id,
      title,
      content,
      usedPoemIds,
      usedEventIds
    );
    setSubmission(result);
    setShowResult(true);

    const newlyUnlocked = checkAchievements();
    newlyUnlocked.forEach(id => unlockAchievement(id));
  };

  const handleBack = () => {
    setSelectedWorkshop(null);
    setSubmission(null);
    setShowResult(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-jade-300 bg-jade-50';
      case 'medium': return 'text-gold-300 bg-gold-50';
      case 'hard': return 'text-cinnabar-300 bg-cinnabar-50';
      default: return 'text-ink-200 bg-paper-100';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '入门';
      case 'medium': return '进阶';
      case 'hard': return '挑战';
      default: return difficulty;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-jade-300';
    if (score >= 60) return 'text-gold-300';
    return 'text-cinnabar-300';
  };

  if (selectedWorkshop && showResult && submission) {
    const dynasty = getDynastyById(selectedWorkshop.dynastyId);
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleBack}
              className="mb-6 text-ink-200 hover:text-ink-400 flex items-center gap-2 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              返回工坊列表
            </button>

            <div className="card animate-fade-in-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 text-gold-300 rounded-full text-sm mb-6">
                  <Award className="w-4 h-4" />
                  创作评分
                </div>
                <h1 className="title-display text-3xl text-ink-400 mb-2">
                  《{submission.title}》
                </h1>
                <p className="text-ink-200">
                  {dynasty?.name} · {selectedWorkshop.title}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="col-span-2 md:col-span-1 text-center p-4 bg-paper-50 rounded-xl">
                  <div className={cn(
                    'text-4xl font-bold mb-1',
                    getScoreColor(submission.score.total)
                  )}>
                    {submission.score.total}
                  </div>
                  <div className="text-xs text-ink-100">总分</div>
                </div>
                <div className="col-span-2 md:col-span-1 text-center p-4 bg-paper-50 rounded-xl">
                  <div className="text-2xl font-bold text-cobalt-300 mb-1">
                    {submission.score.historicalAccuracy}
                  </div>
                  <div className="text-xs text-ink-100">史实准确性</div>
                </div>
                <div className="col-span-2 md:col-span-1 text-center p-4 bg-paper-50 rounded-xl">
                  <div className="text-2xl font-bold text-rose-300 mb-1">
                    {submission.score.poeticUsage}
                  </div>
                  <div className="text-xs text-ink-100">用典水平</div>
                </div>
                <div className="col-span-1 text-center p-4 bg-paper-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-300 mb-1">
                    {submission.score.creativity}
                  </div>
                  <div className="text-xs text-ink-100">创意性</div>
                </div>
                <div className="col-span-1 text-center p-4 bg-paper-50 rounded-xl">
                  <div className="text-2xl font-bold text-jade-300 mb-1">
                    {submission.score.fluency}
                  </div>
                  <div className="text-xs text-ink-100">流畅度</div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="title-display text-lg text-ink-400 mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-cobalt-300" />
                  史实点评
                </h3>
                <div className="space-y-2">
                  {submission.feedback.historicalPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-2 text-ink-200 text-sm">
                      <Check className="w-4 h-4 text-jade-300 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="title-display text-lg text-ink-400 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-rose-300" />
                  用典点评
                </h3>
                <div className="space-y-2">
                  {submission.feedback.poeticPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-2 text-ink-200 text-sm">
                      <Star className="w-4 h-4 text-gold-300 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="title-display text-lg text-ink-400 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-gold-300" />
                  改进建议
                </h3>
                <div className="space-y-2">
                  {submission.feedback.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 text-ink-200 text-sm">
                      <span className="text-cobalt-300 flex-shrink-0">{index + 1}.</span>
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-paper-50 rounded-xl mb-6">
                <h4 className="text-sm font-medium text-ink-300 mb-2">你的作品</h4>
                <p className="text-ink-200 text-sm whitespace-pre-wrap">
                  {submission.content}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="btn-secondary flex-1"
                >
                  继续创作
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedWorkshop) {
    const dynasty = getDynastyById(selectedWorkshop.dynastyId);
    const requiredPoems = selectedWorkshop.requiredPoemIds.map(id => getPoemById(id)).filter(Boolean);
    const requiredEvents = selectedWorkshop.requiredEventIds.map(id => getEventById(id)).filter(Boolean);

    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleBack}
              className="mb-6 text-ink-200 hover:text-ink-400 flex items-center gap-2 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              返回工坊列表
            </button>

            <div className="card mb-6 animate-fade-in-up">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="title-display text-2xl text-ink-400 mb-2">
                    {selectedWorkshop.title}
                  </h1>
                  <p className="text-ink-200 text-sm mb-3">
                    {selectedWorkshop.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      getDifficultyColor(selectedWorkshop.difficulty)
                    )}>
                      {getDifficultyText(selectedWorkshop.difficulty)}
                    </span>
                    <span className="text-xs text-ink-100">
                      {dynasty?.name}
                    </span>
                  </div>
                </div>
                <PenTool className="w-8 h-8 text-cobalt-300" />
              </div>

              <div className="p-4 bg-gold-50 rounded-xl border border-gold-100">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-gold-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gold-300 mb-1">创作提示</p>
                    <p className="text-sm text-ink-200">
                      {selectedWorkshop.sampleTopic}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h3 className="title-display text-lg text-ink-400 mb-4 flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-rose-300" />
                可用诗词
                <span className="text-xs text-ink-100 font-normal">点击选择你要引用的诗词</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {requiredPoems.map((poem) => poem && (
                  <div
                    key={poem.id}
                    onClick={() => togglePoem(poem.id)}
                    className={cn(
                      'p-3 rounded-xl border-2 cursor-pointer transition-all duration-200',
                      usedPoemIds.includes(poem.id)
                        ? 'border-rose-300 bg-rose-50'
                        : 'border-paper-200 bg-paper-50 hover:border-rose-200'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-ink-400">
                        《{poem.title}》
                      </span>
                      {usedPoemIds.includes(poem.id) && (
                        <Check className="w-4 h-4 text-rose-300" />
                      )}
                    </div>
                    <p className="text-xs text-ink-200 line-clamp-1">
                      {poem.famousLine}
                    </p>
                    <p className="text-xs text-ink-100 mt-1">
                      —— {poem.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h3 className="title-display text-lg text-ink-400 mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-cobalt-300" />
                历史事件
                <span className="text-xs text-ink-100 font-normal">点击选择你要融入的历史事件</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {requiredEvents.map((event) => event && (
                  <div
                    key={event.id}
                    onClick={() => toggleEvent(event.id)}
                    className={cn(
                      'p-3 rounded-xl border-2 cursor-pointer transition-all duration-200',
                      usedEventIds.includes(event.id)
                        ? 'border-cobalt-300 bg-cobalt-50'
                        : 'border-paper-200 bg-paper-50 hover:border-cobalt-200'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-ink-400">
                        {event.name}
                      </span>
                      {usedEventIds.includes(event.id) && (
                        <Check className="w-4 h-4 text-cobalt-300" />
                      )}
                    </div>
                    <p className="text-xs text-ink-200 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <h3 className="title-display text-lg text-ink-400 mb-4 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-purple-300" />
                开始创作
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-ink-300 mb-2">
                  作品标题
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="给你的作品起个名字..."
                  className="w-full px-4 py-3 rounded-xl border border-paper-200 bg-paper-50 text-ink-400 placeholder-ink-100 focus:outline-none focus:border-cobalt-300 focus:ring-2 focus:ring-cobalt-100 transition-all"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-ink-300 mb-2">
                  作品内容
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="发挥你的才情，融入诗词与历史，创作一篇精彩的短文吧..."
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl border border-paper-200 bg-paper-50 text-ink-400 placeholder-ink-100 focus:outline-none focus:border-cobalt-300 focus:ring-2 focus:ring-cobalt-100 transition-all resize-none"
                />
                <div className="text-right text-xs text-ink-100 mt-1">
                  {content.length} 字
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!title.trim() || !content.trim()}
                className={cn(
                  'btn-primary w-full flex items-center justify-center gap-2',
                  (!title.trim() || !content.trim()) && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Sparkles className="w-5 h-5" />
                提交作品，获取AI点评
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-500 rounded-full text-sm mb-6">
              <PenTool className="w-4 h-4" />
              诗词史创作工坊
            </div>
            <h1 className="title-display text-4xl text-ink-400 mb-4">
              以诗为笔，以史为墨
            </h1>
            <p className="text-ink-200 max-w-lg mx-auto">
              运用所学诗词与历史事件，创作属于你的历史短文，AI将为你点评史实准确性与用典水平
            </p>
          </div>

          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab('workshops')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === 'workshops'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-ink-200 hover:bg-paper-100'
              )}
            >
              创作题目
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === 'history'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-ink-200 hover:bg-paper-100'
              )}
            >
              我的作品 ({creationSubmissions.length})
            </button>
          </div>

          {activeTab === 'workshops' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creationWorkshops.map((workshop, index) => {
                const dynasty = getDynastyById(workshop.dynastyId);
                return (
                  <div
                    key={workshop.id}
                    className="card cursor-pointer hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleSelectWorkshop(workshop)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="title-display text-xl text-ink-400 mb-2">
                          {workshop.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            getDifficultyColor(workshop.difficulty)
                          )}>
                            {getDifficultyText(workshop.difficulty)}
                          </span>
                          <span className="text-xs text-ink-100">
                            {dynasty?.name}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <PenTool className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-sm text-ink-200 mb-4 line-clamp-2">
                      {workshop.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-ink-100">
                        <BookOpen className="w-3 h-3" />
                        <span>{workshop.requiredPoemIds.length} 首诗词</span>
                        <span className="mx-1">·</span>
                        <History className="w-3 h-3" />
                        <span>{workshop.requiredEventIds.length} 个事件</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-ink-100 group-hover:text-purple-400 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              {creationSubmissions.length === 0 ? (
                <div className="card text-center py-12">
                  <BookMarked className="w-16 h-16 text-ink-100 mx-auto mb-4" />
                  <p className="text-ink-200 mb-2">还没有作品</p>
                  <p className="text-sm text-ink-100">
                    快去创作你的第一篇作品吧！
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {creationSubmissions.map((sub, index) => {
                    const workshop = creationWorkshops.find(w => w.id === sub.workshopId);
                    return (
                      <div
                        key={sub.id}
                        className="card animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="title-display text-lg text-ink-400 mb-1">
                              《{sub.title}》
                            </h3>
                            <p className="text-xs text-ink-100">
                              {workshop?.title} · {new Date(sub.submittedAt).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                          <div>
                            <span className={cn(
                              'text-2xl font-bold',
                              getScoreColor(sub.score.total)
                            )}>
                              {sub.score.total}
                            </span>
                            <span className="text-xs text-ink-100 ml-1">分</span>
                          </div>
                        </div>
                        <p className="text-sm text-ink-200 line-clamp-2 mb-3">
                          {sub.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-ink-100">
                          <span>史实 {sub.score.historicalAccuracy}分</span>
                          <span>用典 {sub.score.poeticUsage}分</span>
                          <span>创意 {sub.score.creativity}分</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreationWorkshop;
