import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send, Calendar, Tag, User, ChevronRight, Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getVirtualPoetById, getDynastyById } from '@/data';
import PoetChat from '@/components/features/PoetChat';

const formatTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return new Date(timestamp).toLocaleDateString('zh-CN');
};

const SocialPage = () => {
  const { socialPosts, likeSocialPost, commentSocialPost, selectedPoetId, selectPoet } = useAppStore();
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showChat, setShowChat] = useState(false);
  const commentEndRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleLike = (postId: string) => {
    likeSocialPost(postId);
  };

  const handleComment = (postId: string, poetId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    commentSocialPost(postId, poetId, content);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handlePoetClick = (poetId: string) => {
    selectPoet(poetId);
    setShowChat(true);
  };

  const toggleComments = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  useEffect(() => {
    if (expandedPostId && commentEndRefs.current[expandedPostId]) {
      commentEndRefs.current[expandedPostId]?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [expandedPostId, socialPosts]);

  const currentPoet = selectedPoetId ? getVirtualPoetById(selectedPoetId) : null;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-500 rounded-full text-sm mb-4">
            <MessageSquare className="w-4 h-4" />
            穿越千年的对话
          </div>
          <h1 className="title-display text-4xl text-ink-400 mb-3">
            文人朋友圈
          </h1>
          <p className="text-ink-200 max-w-2xl mx-auto">
            穿越千年与李白、杜甫等大诗人互动，看他们的日常动态，AI第一人称回答你的历史问题
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {[...socialPosts].reverse().map((post, index) => {
            const poet = getVirtualPoetById(post.poetId);
            const dynasty = poet ? getDynastyById(poet.dynastyId) : null;
            const isExpanded = expandedPostId === post.id;

            return (
              <div
                key={post.id}
                className="card animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: dynasty?.color + '20' }}
                    onClick={() => poet && handlePoetClick(poet.id)}
                  >
                    {poet?.avatar || '👤'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="font-medium text-ink-400 cursor-pointer hover:text-cinnabar-300 transition-colors"
                        onClick={() => poet && handlePoetClick(poet.id)}
                      >
                        {poet?.name || '匿名诗人'}
                      </span>
                      <span className="text-xs text-ink-100">
                        {poet?.styleName}
                      </span>
                      {dynasty && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: dynasty.color + '20', color: dynasty.color }}
                        >
                          {dynasty.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-ink-100">
                      <Calendar className="w-3 h-3" />
                      {formatTime(post.timestamp)}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-ink-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-400 text-xs rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-paper-200">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300',
                      post.likedByUser
                        ? 'bg-cinnabar-50 text-cinnabar-300'
                        : 'text-ink-200 hover:bg-paper-200'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', post.likedByUser && 'fill-current')} />
                    <span className="text-sm">{post.likes}</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300',
                      isExpanded
                        ? 'bg-cobalt-50 text-cobalt-300'
                        : 'text-ink-200 hover:bg-paper-200'
                    )}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{post.comments.length}</span>
                  </button>

                  <div className="flex-1" />

                  <button
                    onClick={() => poet && handlePoetClick(poet.id)}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-ink-200 hover:bg-paper-200 transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">私信</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-paper-200 animate-fade-in-up">
                    {post.comments.length > 0 && (
                      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-hide">
                        {post.comments.map((comment) => {
                          const commentPoet = getVirtualPoetById(comment.poetId);
                          const commentDynasty = commentPoet ? getDynastyById(commentPoet.dynastyId) : null;

                          return (
                            <div
                              key={comment.id}
                              className="flex items-start gap-3 p-3 bg-paper-50 rounded-lg"
                            >
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                                style={{ backgroundColor: commentDynasty?.color + '20' }}
                              >
                                {commentPoet?.avatar || '👤'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium text-ink-300">
                                    {commentPoet?.name || '匿名'}
                                  </span>
                                  <span className="text-xs text-ink-100">
                                    {formatTime(comment.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm text-ink-200 leading-relaxed">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={el => commentEndRefs.current[post.id] = el} />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({
                          ...prev,
                          [post.id]: e.target.value
                        }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleComment(post.id, 'poet-libai');
                          }
                        }}
                        placeholder="发表你的评论（以李白身份）..."
                        className="flex-1 px-4 py-2 bg-paper-50 border border-paper-200 rounded-lg text-sm text-ink-300 placeholder:text-ink-100 focus:outline-none focus:border-cobalt-300 transition-colors"
                      />
                      <button
                        onClick={() => handleComment(post.id, 'poet-libai')}
                        disabled={!commentInputs[post.id]?.trim()}
                        className={cn(
                          'p-2 rounded-lg transition-all duration-300',
                          commentInputs[post.id]?.trim()
                            ? 'bg-cobalt-300 text-paper-50 hover:bg-cobalt-400'
                            : 'bg-paper-200 text-ink-100 cursor-not-allowed'
                        )}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showChat && currentPoet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink-400/60 backdrop-blur-sm"
            onClick={() => {
              setShowChat(false);
              selectPoet(null);
            }}
          />
          <PoetChat />
        </div>
      )}
    </div>
  );
};

export default SocialPage;
