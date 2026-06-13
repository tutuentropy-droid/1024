import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send, Users, Hash, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store';
import { getVirtualPoetById, getAllVirtualPoets } from '@/data';
import { cn } from '@/lib/utils';
import PoetChat from '@/components/features/PoetChat';

const SocialPage = () => {
  const { socialPosts, likeSocialPost, commentSocialPost, virtualPoets, selectedPoetId, selectPoet, chatMessages } = useAppStore();
  const [showChat, setShowChat] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [activeDynastyFilter, setActiveDynastyFilter] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString('zh-CN');
  };

  const handleLike = (postId: string) => {
    likeSocialPost(postId);
  };

  const handleComment = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    commentSocialPost(postId, 'poet-libai', content);
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const toggleComments = (postId: string) => {
    setExpandedComments({ ...expandedComments, [postId]: !expandedComments[postId] });
  };

  const filteredPosts = activeDynastyFilter
    ? socialPosts.filter(post => {
        const poet = getVirtualPoetById(post.poetId);
        return poet?.dynastyId === activeDynastyFilter;
      })
    : socialPosts;

  const sortedPosts = [...filteredPosts].sort((a, b) => b.timestamp - a.timestamp);

  const dynasties = [
    { id: 'tang', name: '唐朝', color: '#C41E3A' },
    { id: 'song', name: '宋朝', color: '#2B5C8A' },
    { id: 'nanbeichao', name: '南北朝', color: '#2E8B57' },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cinnabar-50 text-cinnabar-300 rounded-full text-sm mb-4">
              <Users className="w-4 h-4" />
              文人朋友圈
            </div>
            <h1 className="title-display text-4xl text-ink-400 mb-3">
              诗友动态 · 墨香流转
            </h1>
            <p className="text-ink-200 max-w-xl mx-auto">
              穿越千年，与李白、杜甫、苏轼等大诗人互动，感受古人的诗意人生
            </p>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveDynastyFilter(null)}
              className={cn(
                'px-4 py-2 rounded-full text-sm transition-all duration-200',
                !activeDynastyFilter
                  ? 'bg-ink-400 text-paper-50'
                  : 'bg-paper-200 text-ink-200 hover:bg-paper-300'
              )}
            >
              全部
            </button>
            {dynasties.map(dynasty => (
              <button
                key={dynasty.id}
                onClick={() => setActiveDynastyFilter(dynasty.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm transition-all duration-200',
                  activeDynastyFilter === dynasty.id
                    ? 'text-paper-50'
                    : 'bg-paper-200 text-ink-200 hover:bg-paper-300'
                )}
                style={{
                  backgroundColor: activeDynastyFilter === dynasty.id ? dynasty.color : undefined,
                }}
              >
                {dynasty.name}
              </button>
            ))}
          </div>

          <div className="space-y-4" ref={scrollRef}>
            {sortedPosts.map((post, index) => {
              const poet = getVirtualPoetById(post.poetId);
              const dynasty = poet ? dynasties.find(d => d.id === poet.dynastyId) : null;
              const isExpanded = expandedComments[post.id];
              return (
                <div
                  key={post.id}
                  className="card animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: dynasty?.color + '20' }}
                      onClick={() => {
                        selectPoet(post.poetId);
                        setShowChat(true);
                      }}
                    >
                      {poet?.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="font-medium text-ink-400 cursor-pointer hover:text-cinnabar-300 transition-colors"
                          onClick={() => {
                            selectPoet(post.poetId);
                            setShowChat(true);
                          }}
                        >
                          {poet?.name}
                        </span>
                        {poet?.styleName && (
                          <span className="text-xs text-ink-100">
                            （{poet.styleName}）
                          </span>
                        )}
                        {dynasty && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: dynasty.color + '15', color: dynasty.color }}
                          >
                            {dynasty.name}
                          </span>
                        )}
                        <span className="text-xs text-ink-100 ml-auto">
                          {formatTime(post.timestamp)}
                        </span>
                      </div>

                      <p className="text-ink-300 leading-relaxed mb-3 whitespace-pre-line">
                        {post.content}
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 text-xs text-cobalt-300 bg-cobalt-50 px-2 py-1 rounded-full"
                            >
                              <Hash className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-3 border-t border-paper-200">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-1.5 text-ink-100 hover:text-cinnabar-300 transition-colors text-sm"
                        >
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center gap-1.5 text-ink-100 hover:text-cobalt-300 transition-colors text-sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments.length}</span>
                        </button>
                        <button
                          onClick={() => {
                            selectPoet(post.poetId);
                            setShowChat(true);
                          }}
                          className="ml-auto flex items-center gap-1.5 text-jade-300 hover:text-jade-400 transition-colors text-sm"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>与TA对话</span>
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-paper-200">
                          <div className="space-y-3 mb-4">
                            {post.comments.map(comment => {
                              const commentPoet = getVirtualPoetById(comment.poetId);
                              return (
                                <div key={comment.id} className="flex gap-2">
                                  <div className="w-8 h-8 rounded-full bg-paper-200 flex items-center justify-center text-sm flex-shrink-0">
                                    {commentPoet?.avatar}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="text-sm font-medium text-ink-300">
                                        {commentPoet?.name}
                                      </span>
                                      <span className="text-xs text-ink-100">
                                        {formatTime(comment.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-ink-200">{comment.content}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                              placeholder="写下你的评论..."
                              className="flex-1 px-3 py-2 text-sm rounded-lg bg-paper-100 border border-paper-200 text-ink-300 placeholder:text-ink-100 focus:outline-none focus:border-cinnabar-300 transition-colors"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleComment(post.id);
                              }}
                            />
                            <button
                              onClick={() => handleComment(post.id)}
                              disabled={!commentInputs[post.id]?.trim()}
                              className="px-3 py-2 bg-cinnabar-300 text-paper-50 rounded-lg hover:bg-cinnabar-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 card">
            <h3 className="title-display text-lg text-ink-400 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-cinnabar-300" />
              推荐诗人
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {getAllVirtualPoets().slice(0, 5).map(poet => {
                const dynasty = dynasties.find(d => d.id === poet.dynastyId);
                return (
                  <div
                    key={poet.id}
                    onClick={() => {
                      selectPoet(poet.id);
                      setShowChat(true);
                    }}
                    className="p-3 rounded-xl bg-paper-100 hover:bg-paper-200 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 text-center"
                  >
                    <div
                      className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: dynasty?.color + '20' }}
                    >
                      {poet.avatar}
                    </div>
                    <p className="text-sm font-medium text-ink-300">{poet.name}</p>
                    <p className="text-xs text-ink-100">{poet.styleName}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showChat && selectedPoetId && (
        <PoetChat
          poetId={selectedPoetId}
          onClose={() => {
            setShowChat(false);
            selectPoet(null);
          }}
        />
      )}
    </div>
  );
};

export default SocialPage;
