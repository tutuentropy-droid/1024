import { useState, useMemo, useEffect } from 'react';
import { Lock, Unlock, Eye, Sparkles, ChevronLeft, Info, BookOpen, Calendar, User } from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

const nodeIcons: Record<string, typeof BookOpen> = {
  concept: Sparkles,
  poem: BookOpen,
  event: Calendar,
  poet: User,
};

const nodeColors: Record<string, { bg: string; border: string; text: string }> = {
  concept: { bg: 'bg-gradient-to-br from-gold-200 to-gold-300', border: 'border-gold-400', text: 'text-gold-700' },
  poem: { bg: 'bg-gradient-to-br from-cinnabar-100 to-cinnabar-200', border: 'border-cinnabar-300', text: 'text-cinnabar-600' },
  event: { bg: 'bg-gradient-to-br from-cobalt-100 to-cobalt-200', border: 'border-cobalt-300', text: 'text-cobalt-600' },
  poet: { bg: 'bg-gradient-to-br from-jade-100 to-jade-200', border: 'border-jade-300', text: 'text-jade-600' },
};

const DynastyMemoryAtlas = () => {
  const {
    dynasties,
    dynastyMemoryAtlases,
    userProgress,
    unlockMemoryAtlas,
    incrementAtlasViewCount,
    getDynastyCompletionStats,
  } = useAppStore();

  const [selectedDynastyId, setSelectedDynastyId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const selectedAtlas = selectedDynastyId ? dynastyMemoryAtlases[selectedDynastyId] : null;
  const selectedDynasty = selectedDynastyId ? dynasties.find(d => d.id === selectedDynastyId) : null;

  useEffect(() => {
    if (selectedDynastyId && selectedAtlas?.isUnlocked) {
      incrementAtlasViewCount(selectedDynastyId);
      setImageLoaded(false);
    }
  }, [selectedDynastyId, selectedAtlas?.isUnlocked]);

  const dynastyProgressList = useMemo(() => {
    return dynasties.map(dynasty => {
      const atlas = dynastyMemoryAtlases[dynasty.id];
      const isUnlocked = atlas?.isUnlocked || false;
      const dynastyPoems = dynasty.poemIds || [];
      const studiedCount = dynastyPoems.filter(
        id => userProgress.poemProgress[id]?.isStudied
      ).length;
      const progress = dynastyPoems.length > 0 ? (studiedCount / dynastyPoems.length) * 100 : 0;
      const canUnlock = studiedCount >= Math.ceil(dynastyPoems.length * 0.6) && !isUnlocked;

      return {
        dynasty,
        atlas,
        isUnlocked,
        studiedCount,
        totalCount: dynastyPoems.length,
        progress,
        canUnlock,
      };
    });
  }, [dynasties, dynastyMemoryAtlases, userProgress.poemProgress]);

  const handleUnlockDynasty = (dynastyId: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      unlockMemoryAtlas(dynastyId);
      setIsGenerating(false);
      setSelectedDynastyId(dynastyId);
    }, 2000);
  };

  const getRelatedConnections = (nodeId: string) => {
    if (!selectedAtlas) return [];
    return selectedAtlas.connections.filter(
      conn => conn.fromId === nodeId || conn.toId === nodeId
    );
  };

  const getRelatedNodeIds = (nodeId: string) => {
    const connections = getRelatedConnections(nodeId);
    const ids = new Set<string>();
    connections.forEach(conn => {
      ids.add(conn.fromId);
      ids.add(conn.toId);
    });
    return ids;
  };

  const hoveredNode = selectedAtlas?.nodes.find(n => n.id === hoveredNodeId);
  const relatedNodeIds = hoveredNodeId ? getRelatedNodeIds(hoveredNodeId) : new Set<string>();
  const relatedConnections = hoveredNodeId ? getRelatedConnections(hoveredNodeId) : [];

  if (selectedAtlas && selectedDynasty) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setSelectedDynastyId(null)}
              className="mb-6 inline-flex items-center gap-2 text-ink-200 hover:text-ink-400 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              返回图鉴列表
            </button>

            <div className="text-center mb-8 animate-fade-in-up">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-4"
                style={{ backgroundColor: `${selectedDynasty.color}15`, color: selectedDynasty.color }}
              >
                <Sparkles className="w-4 h-4" />
                诗词史记忆图鉴
              </div>
              <h1 className="title-display text-4xl text-ink-400 mb-2">
                {selectedDynasty.name}全景知识图谱
              </h1>
              <p className="text-ink-200 max-w-2xl mx-auto">
                {selectedDynasty.description}
              </p>
            </div>

            <div className="card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-paper-100 to-paper-200">
                {selectedAtlas.generatedImageUrl && (
                  <img
                    src={selectedAtlas.generatedImageUrl}
                    alt={`${selectedDynasty.name}知识图谱背景`}
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at center, ${selectedDynasty.color}08 0%, transparent 70%)` }}
                />

                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#9CA3AF" />
                    </marker>
                  </defs>

                  {selectedAtlas.connections.map(conn => {
                    const fromNode = selectedAtlas.nodes.find(n => n.id === conn.fromId);
                    const toNode = selectedAtlas.nodes.find(n => n.id === conn.toId);
                    if (!fromNode || !toNode) return null;

                    const isRelated = hoveredNodeId && (
                      conn.fromId === hoveredNodeId || conn.toId === hoveredNodeId
                    );
                    const isDimmed = hoveredNodeId && !isRelated;

                    return (
                      <g key={conn.id}>
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={isRelated ? selectedDynasty.color : '#D1D5DB'}
                          strokeWidth={isRelated ? 0.4 : 0.15}
                          strokeDasharray={conn.lineStyle === 'dashed' ? '1,0.5' : 'none'}
                          className={cn(
                            'transition-all duration-300',
                            isDimmed ? 'opacity-20' : 'opacity-100'
                          )}
                          filter={isRelated ? 'url(#glow)' : undefined}
                        />
                        {isRelated && (
                          <text
                            x={(fromNode.x + toNode.x) / 2}
                            y={(fromNode.y + toNode.y) / 2 - 1}
                            textAnchor="middle"
                            fontSize="2"
                            fill={selectedDynasty.color}
                            className="font-medium"
                          >
                            {conn.label}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {selectedAtlas.nodes.map(node => {
                    const colors = nodeColors[node.type] || nodeColors.concept;
                    const isHovered = node.id === hoveredNodeId;
                    const isRelated = relatedNodeIds.has(node.id);
                    const isDimmed = hoveredNodeId && !isHovered && !isRelated;
                    const Icon = nodeIcons[node.type] || Sparkles;

                    return (
                      <g
                        key={node.id}
                        className="cursor-pointer transition-all duration-300"
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        style={{
                          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                          transformOrigin: `${node.x}px ${node.y}px`,
                          opacity: isDimmed ? 0.4 : 1,
                        }}
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isHovered ? 5 : 4}
                          className={cn(
                            'transition-all duration-300',
                            isHovered ? 'fill-current' : ''
                          )}
                          style={{
                            fill: isHovered ? `${selectedDynasty.color}20` : 'white',
                            stroke: selectedDynasty.color,
                            strokeWidth: isHovered ? 0.5 : 0.3,
                            filter: isHovered ? 'url(#glow)' : undefined,
                          }}
                        />
                        <text
                          x={node.x}
                          y={node.y + 0.5}
                          textAnchor="middle"
                          fontSize="2.2"
                          className={cn('font-bold', colors.text)}
                          fill={isHovered ? selectedDynasty.color : undefined}
                        >
                          {node.type === 'poem' ? '📜' : node.type === 'event' ? '📅' : node.type === 'poet' ? '👤' : '✨'}
                        </text>
                        <text
                          x={node.x}
                          y={node.y + 6}
                          textAnchor="middle"
                          fontSize="1.8"
                          className={isHovered ? 'font-medium' : ''}
                          fill={isHovered ? selectedDynasty.color : '#374151'}
                        >
                          {node.label.length > 8 ? node.label.slice(0, 8) + '...' : node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {hoveredNode && (
                  <div
                    className="absolute z-10 p-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-paper-200 max-w-xs animate-fade-in"
                    style={{
                      left: `${hoveredNode.x}%`,
                      top: `${hoveredNode.y}%`,
                      transform: 'translate(-50%, -120%)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${selectedDynasty.color}15` }}
                      >
                        {hoveredNode.type === 'poem' && <BookOpen className="w-4 h-4" style={{ color: selectedDynasty.color }} />}
                        {hoveredNode.type === 'event' && <Calendar className="w-4 h-4" style={{ color: selectedDynasty.color }} />}
                        {hoveredNode.type === 'poet' && <User className="w-4 h-4" style={{ color: selectedDynasty.color }} />}
                        {hoveredNode.type === 'concept' && <Sparkles className="w-4 h-4" style={{ color: selectedDynasty.color }} />}
                      </div>
                      <div>
                        <h4 className="font-medium text-ink-400 text-sm">{hoveredNode.label}</h4>
                        <span className="text-xs text-ink-100 capitalize">
                          {hoveredNode.type === 'poem' ? '诗词' : hoveredNode.type === 'event' ? '历史事件' : hoveredNode.type === 'poet' ? '诗人' : '核心概念'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-ink-200 whitespace-pre-line">{hoveredNode.content}</p>
                    {relatedConnections.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-paper-100">
                        <p className="text-xs text-ink-100 mb-2">关联关系：</p>
                        <div className="space-y-1">
                          {relatedConnections.slice(0, 3).map(conn => (
                            <div key={conn.id} className="text-xs text-ink-200 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedDynasty.color }} />
                              {conn.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-ink-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-cinnabar-300" />
                    <span>诗词节点</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-cobalt-300" />
                    <span>历史事件</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-jade-300" />
                    <span>代表诗人</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>已浏览 {selectedAtlas.viewCount} 次</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cinnabar-50 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-cinnabar-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-ink-400">诗词节点</h3>
                    <p className="text-xs text-ink-100">{selectedAtlas.nodes.filter(n => n.type === 'poem').length} 首经典诗词</p>
                  </div>
                </div>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cobalt-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-cobalt-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-ink-400">历史事件</h3>
                    <p className="text-xs text-ink-100">{selectedAtlas.nodes.filter(n => n.type === 'event').length} 个重大事件</p>
                  </div>
                </div>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-jade-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-jade-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-ink-400">代表诗人</h3>
                    <p className="text-xs text-ink-100">{selectedAtlas.nodes.filter(n => n.type === 'poet').length} 位文学大家</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <p className="text-sm text-ink-100 mb-3">
                💡 鼠标悬停在节点上，查看诗句与历史事件的关联关系
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = getDynastyCompletionStats();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 text-gold-400 rounded-full text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              诗词史记忆图鉴
            </div>
            <h1 className="title-display text-4xl text-ink-400 mb-4">
              朝代知识图谱
            </h1>
            <p className="text-ink-200 max-w-2xl mx-auto">
              每学完一个朝代，解锁一张AI绘制的全景知识图谱。
              鼠标悬停可查看诗词与历史事件的关联脉络。
            </p>
          </div>

          <div className="card mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-ink-300 flex items-center gap-2">
                <Info className="w-5 h-5 text-gold-400" />
                图鉴进度
              </h2>
              <span className="text-sm text-ink-200">
                已解锁 {stats.completed}/{stats.total} 个朝代
              </span>
            </div>
            <div className="h-3 bg-paper-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-300 to-gold-400 transition-all duration-1000"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-ink-100">
              完成一个朝代 60% 以上的诗词学习，即可解锁该朝代的全景知识图谱
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dynastyProgressList.map((item, index) => {
              const { dynasty, isUnlocked, studiedCount, totalCount, progress, canUnlock } = item;

              return (
                <div
                  key={dynasty.id}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 animate-fade-in-up',
                    isUnlocked
                      ? 'bg-white border-gold-200 hover:border-gold-400 hover:shadow-lg cursor-pointer'
                      : canUnlock
                        ? 'bg-paper-50 border-gold-200/50 hover:border-gold-300 cursor-pointer'
                        : 'bg-paper-50/50 border-paper-200/50'
                  )}
                  style={{ animationDelay: `${index * 100 + 200}ms` }}
                  onClick={() => {
                    if (isUnlocked) {
                      setSelectedDynastyId(dynasty.id);
                    } else if (canUnlock) {
                      handleUnlockDynasty(dynasty.id);
                    }
                  }}
                >
                  <div
                    className="h-32 relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${dynasty.color}20, ${dynasty.color}40)` }}
                  >
                    {isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl opacity-30">
                          {dynasty.id === 'tang' && '🏛️'}
                          {dynasty.id === 'song' && '🏯'}
                          {dynasty.id === 'han' && '📜'}
                          {dynasty.id === 'yuan' && '🎭'}
                          {dynasty.id === 'ming' && '⛵'}
                          {dynasty.id === 'qing' && '🏯'}
                          {dynasty.id === 'nanbeichao' && '🏔️'}
                        </div>
                      </div>
                    )}

                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-paper-200/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 bg-paper-100 rounded-full flex items-center justify-center">
                            <Lock className="w-8 h-8 text-ink-200" />
                          </div>
                          {canUnlock ? (
                            <p className="text-sm text-gold-500 font-medium">点击解锁</p>
                          ) : (
                            <p className="text-xs text-ink-200">继续学习解锁</p>
                          )}
                        </div>
                      </div>
                    )}

                    {isUnlocked && (
                      <div className="absolute top-3 right-3">
                        <div className="w-7 h-7 bg-gold-400 rounded-full flex items-center justify-center shadow-md">
                          <Unlock className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dynasty.color }}
                      />
                      <h3 className="title-display text-xl text-ink-400">{dynasty.name}</h3>
                    </div>

                    <p className="text-sm text-ink-200 line-clamp-2 mb-4">
                      {dynasty.description}
                    </p>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-ink-100 mb-1.5">
                        <span>学习进度</span>
                        <span>{studiedCount}/{totalCount} 首</span>
                      </div>
                      <div className="h-2 bg-paper-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: isUnlocked ? '#DAA520' : dynasty.color,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {dynasty.famousPoets.slice(0, 3).map((poet, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${dynasty.color}15`,
                            color: dynasty.color,
                          }}
                        >
                          {poet}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isUnlocked && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300" />
                  )}
                </div>
              );
            })}
          </div>

          {isGenerating && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-400/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-8 max-w-sm text-center animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 border-4 border-gold-200 rounded-full" />
                  <div className="absolute inset-0 border-4 border-gold-400 rounded-full border-t-transparent animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-gold-400" />
                </div>
                <h3 className="title-display text-xl text-ink-400 mb-2">正在生成知识图谱</h3>
                <p className="text-sm text-ink-200">
                  AI 正在为你绘制全景知识图谱，请稍候...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynastyMemoryAtlas;
