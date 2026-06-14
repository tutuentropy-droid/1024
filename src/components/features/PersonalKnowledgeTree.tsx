import { useState, useEffect, useRef } from 'react';
import {
  Download, Share2, RefreshCw, TreeDeciduous, BookOpen, Calendar,
  User, Sparkles, ChevronRight, Check, X, Copy, Twitter, MessageCircle
} from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import type { KnowledgeTreeNode, ExportImageConfig } from '@/types';

const nodeColors: Record<string, { bg: string; border: string; text: string }> = {
  concept: { bg: 'from-gold-200 to-gold-300', border: 'border-gold-400', text: 'text-gold-700' },
  dynasty: { bg: 'from-cobalt-200 to-cobalt-300', border: 'border-cobalt-400', text: 'text-cobalt-700' },
  poem: { bg: 'from-cinnabar-100 to-cinnabar-200', border: 'border-cinnabar-300', text: 'text-cinnabar-600' },
  event: { bg: 'from-purple-100 to-purple-200', border: 'border-purple-300', text: 'text-purple-600' },
  poet: { bg: 'from-jade-100 to-jade-200', border: 'border-jade-300', text: 'text-jade-600' },
};

const nodeIcons: Record<string, typeof BookOpen> = {
  concept: Sparkles,
  dynasty: TreeDeciduous,
  poem: BookOpen,
  event: Calendar,
  poet: User,
};

const PersonalKnowledgeTree = () => {
  const {
    dynasties,
    userProgress,
    personalKnowledgeTrees,
    generateOrUpdateKnowledgeTree,
    incrementKnowledgeTreeExportCount,
    incrementKnowledgeTreeShareCount,
    getDynastyCompletionStats,
  } = useAppStore();

  const [selectedTheme, setSelectedTheme] = useState<ExportImageConfig['theme']>('ink');
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const tree = personalKnowledgeTrees[0];
  const stats = getDynastyCompletionStats();

  useEffect(() => {
    generateOrUpdateKnowledgeTree();
  }, [generateOrUpdateKnowledgeTree]);

  const getNodePosition = (node: KnowledgeTreeNode) => {
    return { x: node.x, y: node.y };
  };

  const getRelatedNodeIds = (nodeId: string) => {
    if (!tree) return new Set<string>();
    const ids = new Set<string>();
    tree.connections.forEach(conn => {
      if (conn.fromId === nodeId) ids.add(conn.toId);
      if (conn.toId === nodeId) ids.add(conn.fromId);
    });
    return ids;
  };

  const relatedNodeIds = hoveredNodeId ? getRelatedNodeIds(hoveredNodeId) : new Set<string>();
  const hoveredNode = tree?.nodes.find(n => n.id === hoveredNodeId);

  const exportThemeConfigs: Record<ExportImageConfig['theme'], { bg: string; textColor: string; accent: string }> = {
    ink: { bg: '#FAF7F2', textColor: '#2D2A26', accent: '#8B7355' },
    gold: { bg: '#FFFBF0', textColor: '#5C4A1F', accent: '#DAA520' },
    modern: { bg: '#F8FAFC', textColor: '#1E293B', accent: '#6366F1' },
  };

  const exportAsImage = async () => {
    if (!svgRef.current || !tree) return;
    setIsExporting(true);

    try {
      const svgEl = svgRef.current;
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgEl);

      const themeConfig = exportThemeConfigs[selectedTheme];
      svgString = svgString.replace(
        '<svg',
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 100 60" style="background-color: ${themeConfig.bg}"`
      );

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = themeConfig.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1200, 800);

        ctx.fillStyle = themeConfig.textColor;
        ctx.font = 'bold 28px serif';
        ctx.fillText('我的诗词史知识树', 40, 50);

        ctx.font = '16px sans-serif';
        ctx.fillStyle = themeConfig.accent;
        ctx.fillText(`已学习 ${stats.completed}/${stats.total} 个朝代 · ${userProgress.totalPoemsStudied} 首诗词`, 40, 80);

        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('诗史智学 · Personal Knowledge Tree', canvas.width - 260, canvas.height - 20);

        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `诗词史知识树_${new Date().toLocaleDateString('zh-CN')}.png`;
        link.href = pngUrl;
        link.click();

        URL.revokeObjectURL(url);
        incrementKnowledgeTreeExportCount();
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 2000);
        setIsExporting(false);
      };
      img.onerror = () => {
        setIsExporting(false);
      };
      img.src = url;
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  const shareText = `我已在「诗史智学」中学习了 ${stats.completed}/${stats.total} 个朝代，掌握了 ${userProgress.totalPoemsStudied} 首诗词！来一起探索中华诗词的浩瀚星河吧 ✨`;

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      incrementKnowledgeTreeShareCount();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  if (!tree) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-ink-200 animate-spin mx-auto mb-4" />
          <p className="text-ink-200">正在生成知识树...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-jade-50 text-jade-500 rounded-full text-sm mb-4">
              <TreeDeciduous className="w-4 h-4" />
              个人诗词史知识树
            </div>
            <h1 className="title-display text-4xl text-ink-400 mb-4">
              我的知识成长轨迹
            </h1>
            <p className="text-ink-200 max-w-2xl mx-auto">
              可视化展示你的诗词学习历程，从朝代到诗人，从诗词到历史事件，
              记录每一个知识节点的成长。支持导出图片分享到社交平台。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-cobalt-50 flex items-center justify-center">
                  <TreeDeciduous className="w-5 h-5 text-cobalt-400" />
                </div>
                <div>
                  <h3 className="font-medium text-ink-400">朝代节点</h3>
                  <p className="text-xs text-ink-100">已掌握朝代</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-ink-400">{stats.completed}/{stats.total}</p>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-cinnabar-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-cinnabar-400" />
                </div>
                <div>
                  <h3 className="font-medium text-ink-400">诗词节点</h3>
                  <p className="text-xs text-ink-100">已学习诗词</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-ink-400">{userProgress.totalPoemsStudied}</p>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-jade-50 flex items-center justify-center">
                  <User className="w-5 h-5 text-jade-400" />
                </div>
                <div>
                  <h3 className="font-medium text-ink-400">诗人节点</h3>
                  <p className="text-xs text-ink-100">认识的诗人</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-ink-400">
                {dynasties.reduce((acc, d) => acc + (userProgress.completedDynasties.includes(d.id) ? d.famousPoets.length : 0), 0)}
              </p>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-medium text-ink-400">知识连接</h3>
                  <p className="text-xs text-ink-100">节点关联数</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-ink-400">{tree.connections.length}</p>
            </div>
          </div>

          <div className="card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-medium text-ink-300 flex items-center gap-2">
                  <TreeDeciduous className="w-5 h-5 text-jade-400" />
                  知识树图谱
                </h3>
                <p className="text-sm text-ink-100 mt-1">鼠标悬停节点查看详情，点击可高亮相关连接</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowExportPanel(!showExportPanel);
                    setShowSharePanel(false);
                  }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
                    showExportPanel
                      ? 'bg-cobalt-500 text-white'
                      : 'bg-cobalt-50 text-cobalt-500 hover:bg-cobalt-100'
                  )}
                >
                  <Download className="w-4 h-4" />
                  导出图片
                </button>
                <button
                  onClick={() => {
                    setShowSharePanel(!showSharePanel);
                    setShowExportPanel(false);
                  }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
                    showSharePanel
                      ? 'bg-jade-500 text-white'
                      : 'bg-jade-50 text-jade-500 hover:bg-jade-100'
                  )}
                >
                  <Share2 className="w-4 h-4" />
                  分享
                </button>
              </div>
            </div>

            {showExportPanel && (
              <div className="mb-4 p-4 bg-paper-50 rounded-xl animate-fade-in">
                <h4 className="font-medium text-ink-400 mb-3">选择导出风格</h4>
                <div className="flex flex-wrap gap-3 mb-4">
                  {(['ink', 'gold', 'modern'] as const).map(theme => (
                    <button
                      key={theme}
                      onClick={() => setSelectedTheme(theme)}
                      className={cn(
                        'p-3 rounded-xl border-2 transition-all',
                        selectedTheme === theme
                          ? 'border-cobalt-400 bg-cobalt-50'
                          : 'border-paper-200 bg-white hover:border-paper-300'
                      )}
                    >
                      <div
                        className="w-16 h-10 rounded-lg mb-2"
                        style={{ backgroundColor: exportThemeConfigs[theme].bg }}
                      />
                      <p className="text-sm font-medium text-ink-400">
                        {theme === 'ink' ? '水墨古风' : theme === 'gold' ? '金色典雅' : '现代简约'}
                      </p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={exportAsImage}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cobalt-400 to-cobalt-500 text-white font-medium hover:shadow-lg hover:shadow-cobalt-200 transition-all disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      导出中...
                    </>
                  ) : exportSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      导出成功！
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      导出为PNG图片
                    </>
                  )}
                </button>
              </div>
            )}

            {showSharePanel && (
              <div className="mb-4 p-4 bg-paper-50 rounded-xl animate-fade-in">
                <h4 className="font-medium text-ink-400 mb-3">分享到社交平台</h4>
                <div className="bg-white rounded-xl p-4 mb-4 border border-paper-200">
                  <p className="text-ink-300 text-sm leading-relaxed">{shareText}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={copyShareText}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-paper-100 hover:bg-paper-200 text-ink-400 font-medium transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-jade-500" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        复制文案
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      incrementKnowledgeTreeShareCount();
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 font-medium transition-all"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </button>
                  <button
                    onClick={() => {
                      incrementKnowledgeTreeShareCount();
                      window.open(`https://service.weibo.com/share/share.php?title=${encodeURIComponent(shareText)}`, '_blank');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 font-medium transition-all"
                  >
