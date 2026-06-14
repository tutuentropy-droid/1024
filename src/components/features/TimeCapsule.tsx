import { useState } from 'react';
import { Clock, Sparkles, User, Calendar, Trash2, ChevronRight, Lightbulb, Target } from 'lucide-react';
import { useAppStore } from '@/store';
import { getAllVirtualPoets, getAllDynasties, getEventsByDynastyId } from '@/data';
import { cn } from '@/lib/utils';

const TimeCapsule = () => {
  const { timeCapsules, selectedTimeCapsuleId, createTimeCapsule, selectTimeCapsule, deleteTimeCapsule } = useAppStore();
  const [targetType, setTargetType] = useState<'poet' | 'event'>('poet');
  const [selectedDynastyId, setSelectedDynastyId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [prediction, setPrediction] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const poets = getAllVirtualPoets();
  const dynasties = getAllDynasties();

  const filteredPoets = selectedDynastyId
    ? poets.filter(p => p.dynastyId === selectedDynastyId)
    : poets;

  const events = selectedDynastyId ? getEventsByDynastyId(selectedDynastyId) : [];

  const selectedCapsule = timeCapsules.find(c => c.id === selectedTimeCapsuleId);

  const handleCreate = () => {
    if (!selectedTargetId || !prediction.trim()) return;
    setIsCreating(true);
    setTimeout(() => {
      createTimeCapsule(targetType, selectedTargetId, prediction.trim());
      setPrediction('');
      setIsCreating(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-400 rounded-full text-sm mb-4">
            <Clock className="w-4 h-4" />
            时空穿越 · 创意无限
          </div>
          <h1 className="title-display text-4xl md:text-5xl text-ink-400 mb-4">
            诗词史时间胶囊
          </h1>
          <p className="text-lg text-ink-200 max-w-2xl mx-auto">
            假如古人有手机，假如历史可以重来……写下你的奇思妙想，AI 为你生成历史对照分析
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-paper-50 to-paper-100 rounded-2xl p-6 shadow-lg border border-paper-200">
              <h2 className="title-display text-xl text-ink-400 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                创建时间胶囊
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">
                    选择类型
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setTargetType('poet'); setSelectedTargetId(''); }}
                      className={cn(
                        'flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300',
                        targetType === 'poet'
                          ? 'bg-gradient-to-r from-violet-400 to-purple-500 text-white shadow-md'
                          : 'bg-paper-200 text-ink-200 hover:bg-paper-300'
                      )}
                    >
                      👤 历史人物
                    </button>
                    <button
                      onClick={() => { setTargetType('event'); setSelectedTargetId(''); }}
                      className={cn(
                        'flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300',
                        targetType === 'event'
                          ? 'bg-gradient-to-r from-violet-400 to-purple-500 text-white shadow-md'
                          : 'bg-paper-200 text-ink-200 hover:bg-paper-300'
                      )}
                    >
                      📜 历史事件
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">
                    选择朝代
                  </label>
                  <select
                    value={selectedDynastyId || ''}
                    onChange={(e) => { setSelectedDynastyId(e.target.value || null); setSelectedTargetId(''); }}
                    className="w-full px-4 py-3 bg-paper-50 border border-paper-200 rounded-xl text-sm text-ink-300 focus:outline-none focus:border-violet-300 transition-colors"
                  >
                    <option value="">全部朝代</option>
                    {dynasties.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">
                    选择{targetType === 'poet' ? '诗人' : '事件'}
                  </label>
                  <select
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    className="w-full px-4 py-3 bg-paper-50 border border-paper-200 rounded-xl text-sm text-ink-300 focus:outline-none focus:border-violet-300 transition-colors"
                  >
                    <option value="">请选择{targetType === 'poet' ? '一位诗人' : '一个事件'}</option>
                    {targetType === 'poet'
                      ? filteredPoets.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))
                      : events.map(e => (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        ))
                    }
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-300 mb-2">
                    你的奇思妙想
                  </label>
                  <textarea
                    value={prediction}
                    onChange={(e) => setPrediction(e.target.value)}
                    placeholder="例如：假如杜甫有手机，他会怎么写安史之乱？"
                    rows={5}
                    className="w-full px-4 py-3 bg-paper-50 border border-paper-200 rounded-xl text-sm text-ink-300 placeholder:text-ink-100 focus:outline-none focus:border-violet-300 transition-colors resize-none"
                  />
                  <p className="text-xs text-ink-100 mt-2">
                    提示：可以从科技、社会、文化等角度展开想象
                  </p>
                </div>

                <button
                  onClick={handleCreate}
                  disabled={!selectedTargetId || !prediction.trim() || isCreating}
                  className={cn(
                    'w-full py-4 rounded-xl text-base font-medium transition-all duration-300 flex items-center justify-center gap-2',
                    selectedTargetId && prediction.trim() && !isCreating
                      ? 'bg-gradient-to-r from-violet-400 to-purple-500 text-white hover:shadow-lg hover:scale-[1.02]'
                      : 'bg-paper-200 text-ink-100 cursor-not-allowed'
                  )}
                >
                  {isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      AI 正在生成分析...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      生成时空对照分析
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
              <h3 className="title-display text-lg text-violet-400 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                灵感提示
              </h3>
              <ul className="space-y-2 text-sm text-ink-200">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">✨</span>
                  假如李白有朋友圈，他会发什么内容？
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">✨</span>
                  如果秦始皇统一了文字互联网会怎样？
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">✨</span>
                  假如宋代有外卖，苏轼会写什么诗？
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5">✨</span>
                  如果安史之乱有直播，杜甫会怎么报道？
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            {selectedCapsule ? (
              <div className="bg-gradient-to-br from-paper-50 to-paper-100 rounded-2xl shadow-lg border border-paper-200 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-400 to-purple-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="title-display text-lg text-white">
                        {selectedCapsule.targetName}
                      </h3>
                      <p className="text-sm text-white/80">
                        {selectedCapsule.targetType === 'poet' ? '历史人物' : '历史事件'}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteTimeCapsule(selectedCapsule.id)}
                      className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-violet-400" />
                      <span className="text-sm font-medium text-violet-400">你的猜想</span>
                    </div>
                    <p className="text-ink-300 leading-relaxed">
                      {selectedCapsule.userPrediction}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-violet-400" />
                      <span className="text-sm font-medium text-ink-300">AI 对照分析</span>
                    </div>
                    <div className="whitespace-pre-line text-sm text-ink-200 leading-relaxed">
                      {selectedCapsule.aiAnalysis}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 bg-gold-50 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-gold-400">
                        {selectedCapsule.historicalAccuracy}
                      </div>
                      <div className="text-xs text-ink-200 mt-1">历史契合度</div>
                    </div>
                    <div className="flex-1 bg-emerald-50 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-emerald-500">
                        {selectedCapsule.creativityScore}
                      </div>
                      <div className="text-xs text-ink-200 mt-1">创意指数</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedCapsule.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-violet-100 text-violet-400 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-paper-50 to-paper-100 rounded-2xl p-12 shadow-lg border border-paper-200 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-violet-100 rounded-full flex items-center justify-center">
                  <Clock className="w-10 h-10 text-violet-400" />
                </div>
                <h3 className="title-display text-xl text-ink-400 mb-2">
                  暂无胶囊
                </h3>
                <p className="text-ink-200">
                  创建一个时间胶囊，开启你的时空之旅吧！
                </p>
              </div>
            )}

            <div className="bg-gradient-to-br from-paper-50 to-paper-100 rounded-2xl p-6 shadow-lg border border-paper-200">
              <h3 className="title-display text-lg text-ink-400 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-400" />
                我的时间胶囊 ({timeCapsules.length})
              </h3>

              {timeCapsules.length === 0 ? (
                <p className="text-center text-ink-100 py-8">
                  还没有时间胶囊，快去创建吧~
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                  {timeCapsules.map((capsule) => (
                    <button
                      key={capsule.id}
                      onClick={() => selectTimeCapsule(capsule.id)}
                      className={cn(
                        'w-full p-4 rounded-xl text-left transition-all duration-300 flex items-center gap-3',
                        selectedTimeCapsuleId === capsule.id
                          ? 'bg-violet-100 border border-violet-200'
                          : 'bg-paper-50 border border-paper-200 hover:bg-paper-100'
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                        {capsule.targetType === 'poet' ? '👤' : '📜'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-ink-300 text-sm truncate">
                          {capsule.targetName}
                        </div>
                        <div className="text-xs text-ink-100 truncate mt-0.5">
                          {capsule.userPrediction.slice(0, 30)}...
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gold-400">
                            契合度 {capsule.historicalAccuracy}
                          </span>
                          <span className="text-xs text-emerald-500">
                            创意 {capsule.creativityScore}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-ink-100 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeCapsule;
