import { useState } from 'react';
import { PenTool, BookOpen, History, Sparkles, Award, ChevronRight, Lightbulb, BookMarked } from 'lucide-react';
import { useAppStore } from '@/store';
import { getAllCreationTopics, getCreationTopicById, getPoemById, getEventById } from '@/data';
import { cn } from '@/lib/utils';
import type { CreationWorkshopResult, CreationWorkshopTopic } from '@/types';

const CreationWorkshop = () => {
  const { submitCreationWorkshop, currentWorkshopTopicId, selectWorkshopTopic, creationWorkshopResults } = useAppStore();
  const [essay, setEssay] = useState('');
  const [result, setResult] = useState<CreationWorkshopResult | null>(null);
  const [activeTab, setActiveTab] = useState<'topics' | 'history'>('topics');

  const topics = getAllCreationTopics();
  const selectedTopic = currentWorkshopTopicId ? getCreationTopicById(currentWorkshopTopicId) : null;

  const difficultyColors: Record<string, string> = {
    easy: 'text-jade-300 bg-jade-50',
    medium: 'text-gold-300 bg-gold-50',
    hard: 'text-cinnabar-300 bg-cinnabar-50',
  };

  const difficultyLabels: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };

  const handleSubmit = () => {
    if (!currentWorkshopTopicId || essay.trim().length < 20) return;
    const newResult = submitCreationWorkshop(currentWorkshopTopicId, essay);
    setResult(newResult);
  };

  const handleSelectTopic = (topic: CreationWorkshopTopic) => {
    selectWorkshopTopic(topic.id);
    setEssay('');
    setResult(null);
  };

  const handleBack = () => {
    selectWorkshopTopic(null);
    setEssay('');
    setResult(null);
  };

  if (!selectedTopic) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 text-gold-300 rounded-full text-sm mb-6">
              <PenTool className="w-4 h-4" />
              创作工坊
            </div>
            <h1 className="title-display text-4xl text-ink-400 mb-4">
              诗词史创作工坊
            </h1>
            <p className="text-ink-200 max-w-2xl mx-auto">
              运用你所学的诗词和历史知识，改写一段短文，AI将为你打分并指出史实和用典的准确性
            </p>
          </div>

          <div className="flex gap-2 mb-6 justify-center">
            <button
              onClick={() => setActiveTab('topics')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === 'topics'
                  ? 'bg-cinnabar-300 text-white'
                  : 'bg-paper-100 text-ink-200 hover:bg-paper-200'
              )}
            >
              创作主题
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === 'history'
                  ? 'bg-cinnabar-300 text-white'
                  : 'bg-paper-100 text-ink-200 hover:bg-paper-200'
              )}
            >
              我的作品 ({creationWorkshopResults.length})
            </button>
          </div>

          {activeTab === 'topics' ? (
            <div className="grid gap-4 md:grid-cols-2">
              {topics.map((topic) => {
                const relatedPoems = topic.relatedPoemIds.map(id => getPoemById(id)).filter(Boolean);
                const relatedEvents = topic.relatedEventIds.map(id => getEventById(id)).filter(Boolean);

                return (
                  <div
                    key={topic.id}
                    className="card cursor-pointer hover:-translate-y-1 transition-all duration-300"
                    onClick={() => handleSelectTopic(topic)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="title-display text-xl text-ink-400">
                        {topic.title}
                      </h3>
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        difficultyColors[topic.difficulty]
                      )}>
                        {difficultyLabels[topic.difficulty]}
                      </span>
                    </div>
                    
                    <p className="text-sm text-ink-200 mb-4">
                      {topic.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {topic.keywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-paper-100 text-ink-200 rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-paper-200 pt-4 mt-4">
                      <div className="flex items-center gap-4 text-xs text-ink-100">
                        <div className="flex items-center gap-1">
                          <BookMarked className="w-4 h-4" />
                          <span>{relatedPoems.length}首诗词</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <History className="w-4 h-4" />
                          <span>{relatedEvents.length}个事件</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end text-sm text-cinnabar-300 font-medium">
                      开始创作
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {creationWorkshopResults.length === 0 ? (
                <div className="card text-center py-12">
                  <PenTool className="w-12 h-12 text-ink-100 mx-auto mb-4" />
                  <p className="text-ink-200">还没有作品，快去创作吧！</p>
                </div>
              ) : (
                creationWorkshopResults.map((res) => {
                  const topic = getCreationTopicById(res.topicId);
                  return (
                    <div key={res.id} className="card">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="title-display text-lg text-ink-400">
                          {topic?.title || '未知主题'}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-gold-300" />
                          <span className="text-xl font-bold text-gold-300">
                            {res.score}分
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-ink-200 line-clamp-3 mb-4">
                        {res.userEssay}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-ink-100">
                        <span>史实准确度: {res.historicalAccuracy}%</span>
                        <span>用典: {res.poeticUsage}%</span>
                        <span>创意: {res.creativity}%</span>
                      </div>
                      <div className="text-xs text-ink-100 mt-2">
                        {new Date(res.createdAt).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const relatedPoems = selectedTopic.relatedPoemIds.map(id => getPoemById(id)).filter(Boolean);
  const relatedEvents = selectedTopic.relatedEventIds.map(id => getEventById(id)).filter(Boolean);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={handleBack}
          className="text-sm text-ink-200 hover:text-ink-300 mb-6 inline-flex items-center gap-1"
        >
          ← 返回主题列表
        </button>

        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className={cn(
                'text-xs px-2 py-1 rounded-full mb-2 inline-block',
                difficultyColors[selectedTopic.difficulty]
              )}>
                {difficultyLabels[selectedTopic.difficulty]}
              </span>
              <h1 className="title-display text-2xl text-ink-400">
                {selectedTopic.title}
              </h1>
            </div>
          </div>
          <p className="text-ink-200 mb-6">
            {selectedTopic.description}
          </p>

          <div className="bg-paper-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-ink-300 mb-3">
              <Lightbulb className="w-4 h-4" />
              <span className="font-medium">写作提示</span>
            </div>
            <p className="text-sm text-ink-200 mb-4">
              范文参考：
            </p>
            <p className="text-sm text-ink-100 italic">
              &ldquo;{selectedTopic.sampleEssay}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-paper-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-ink-300 mb-3">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">相关诗词</span>
              </div>
              <div className="space-y-2">
                {relatedPoems.map(poem => (
                  <div key={poem?.id} className="text-xs text-ink-200">
                    <div className="font-medium">《{poem?.title}》- {poem?.author}</div>
                    <div className="text-ink-100">"{poem?.famousLine}"</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-paper-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-ink-300 mb-3">
                <History className="w-4 h-4" />
                <span className="font-medium">相关历史事件</span>
              </div>
              <div className="space-y-2">
                {relatedEvents.map(event => (
                  <div key={event?.id} className="text-xs text-ink-200">
                    <div className="font-medium">{event?.name}</div>
                    <div className="text-ink-100">公元{event?.year}年</div>
                  </div>
                ))}
                {relatedEvents.length === 0 && (
                  <div className="text-xs text-ink-100">暂无相关事件</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {!result ? (
          <div className="card">
            <h2 className="title-display text-xl text-ink-400 mb-4">
              开始创作
            </h2>
            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="在这里写下你的短文创作，尝试融入诗词名句和历史典故..."
              className="w-full h-48 p-4 border border-paper-200 rounded-xl text-ink-300 placeholder-ink-100 resize-none focus:outline-none focus:ring-2 focus:ring-cinnabar-200"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-ink-100">
                {essay.length} 字
              </span>
              <button
                onClick={handleSubmit}
                disabled={essay.trim().length < 20}
                className={cn(
                  'btn-primary inline-flex items-center gap-2',
                  essay.trim().length < 20 && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Sparkles className="w-4 h-4" />
                提交评分
              </button>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-50 mb-4">
                <Award className="w-10 h-10 text-gold-300" />
              </div>
              <h2 className="title-display text-3xl text-ink-400 mb-2">
                创作评分
              </h2>
              <div className="text-5xl font-bold text-gold-300 mb-6">
                {result.score} 分
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-paper-50 rounded-xl">
                <div className="text-2xl font-bold text-cobalt-300">
                  {result.historicalAccuracy}%
                </div>
                <div className="text-xs text-ink-200 mt-1">史实准确度</div>
              </div>
              <div className="text-center p-4 bg-paper-50 rounded-xl">
                <div className="text-2xl font-bold text-jade-300">
                  {result.poeticUsage}%
                </div>
                <div className="text-xs text-ink-200 mt-1">诗词用典</div>
              </div>
              <div className="text-center p-4 bg-paper-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-500">
                  {result.creativity}%
                </div>
                <div className="text-xs text-ink-200 mt-1">创意指数</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="title-display text-lg text-ink-400 mb-3">
                AI 点评
              </h3>
              <div className="space-y-2">
                {result.feedback.map((item, idx) => (
                  <div key={idx} className="text-sm text-ink-200 flex items-start gap-2">
                    <span className="text-gold-300">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {result.poeticAllusions.length > 0 && (
              <div className="mb-6">
                <h3 className="title-display text-lg text-ink-400 mb-3">
                  诗词典故分析
                </h3>
                <div className="space-y-3">
                  {result.poeticAllusions.map(allusion => (
                    <div
                      key={allusion.id}
                      className="p-3 bg-jade-50 rounded-xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <BookMarked className="w-4 h-4 text-jade-300" />
                        <span className="text-sm font-medium text-jade-500">
                          {allusion.author}《{allusion.poemTitle}》
                        </span>
                      </div>
                      <p className="text-sm text-ink-200">
                        "{allusion.usedLine}"
                      </p>
                      <p className="text-xs text-ink-100 mt-2">
                        {allusion.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.historicalIssues.length > 0 && (
              <div className="mb-6">
                <h3 className="title-display text-lg text-ink-400 mb-3">
                  史实问题
                </h3>
                <div className="space-y-3">
                  {result.historicalIssues.map(issue => (
                    <div
                      key={issue.id}
                      className={cn(
                        'p-3 rounded-xl',
                        issue.type === 'error' ? 'bg-cinnabar-50' :
                        issue.type === 'warning' ? 'bg-gold-50' : 'bg-paper-50'
                      )}
                    >
                      <div className={cn(
                        'text-sm font-medium mb-1',
                        issue.type === 'error' ? 'text-cinnabar-300' :
                        issue.type === 'warning' ? 'text-gold-300' : 'text-ink-300'
                      )}>
                        {issue.description}
                      </div>
                      <p className="text-xs text-ink-200">
                        正确史实：{issue.correctFact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setResult(null)}
                className="btn-secondary flex-1"
              >
                继续修改
              </button>
              <button
                onClick={handleBack}
                className="btn-primary flex-1"
              >
                换个主题
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreationWorkshop;
