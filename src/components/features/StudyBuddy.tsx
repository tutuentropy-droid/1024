import { useState, useRef, useEffect } from 'react';
import { X, Send, Star, Trophy, Zap, MessageCircle, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

const StudyBuddy = () => {
  const { studyBuddy, studyBuddyMessages, isStudyBuddyOpen, toggleStudyBuddy, sendStudyBuddyMessage, getStudyBuddyDifficulty } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const difficulty = getStudyBuddyDifficulty();

  const personalityLabels: Record<string, { label: string; color: string }> = {
    encouraging: { label: '鼓励型', color: 'text-emerald-500 bg-emerald-50' },
    challenging: { label: '挑战型', color: 'text-cinnabar-400 bg-cinnabar-50' },
    playful: { label: '活泼型', color: 'text-violet-400 bg-violet-50' },
    scholarly: { label: '学者型', color: 'text-cobalt-400 bg-cobalt-50' },
  };

  const difficultyLabels: Record<string, { label: string; color: string }> = {
    easy: { label: '简单', color: 'text-emerald-500 bg-emerald-50' },
    medium: { label: '中等', color: 'text-gold-400 bg-gold-50' },
    hard: { label: '困难', color: 'text-cinnabar-400 bg-cinnabar-50' },
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isStudyBuddyOpen) {
      scrollToBottom();
    }
  }, [studyBuddyMessages, isStudyBuddyOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendStudyBuddyMessage(inputValue.trim());
    setInputValue('');
  };

  const quickQuestions = [
    '今天学什么？',
    '出道题考我',
    '太难了',
    '我要休息',
  ];

  const handleQuickQuestion = (question: string) => {
    sendStudyBuddyMessage(question);
  };

  if (!isStudyBuddyOpen) {
    return (
      <button
        onClick={toggleStudyBuddy}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-10 right-0 bg-ink-400 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          小诗童陪你学诗
          <div className="absolute -bottom-1 right-4 w-2 h-2 bg-ink-400 rotate-45" />
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] animate-fade-in-up">
      <div className="bg-gradient-to-br from-paper-50 via-paper-100 to-paper-200 rounded-2xl shadow-2xl border border-paper-300 overflow-hidden">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-violet-400 to-purple-500 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl backdrop-blur-sm">
                  {studyBuddy.avatar}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="title-display text-lg text-white">
                  {studyBuddy.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
                    Lv.{studyBuddy.level}
                  </span>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    personalityLabels[studyBuddy.personality]?.color || 'bg-white/20 text-white'
                  )}>
                    {personalityLabels[studyBuddy.personality]?.label || '鼓励型'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={toggleStudyBuddy}
              className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-white/80 mb-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                经验值
              </span>
              <span>{studyBuddy.experience} / {studyBuddy.level * 100}</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-300 to-gold-400 rounded-full transition-all duration-500"
                style={{ width: `${(studyBuddy.experience / (studyBuddy.level * 100)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-paper-100 border-b border-paper-200">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-ink-200">
              <Trophy className="w-3.5 h-3.5 text-gold-400" />
              <span>答题 {studyBuddy.totalQuestions}</span>
            </div>
            <div className="flex items-center gap-1.5 text-ink-200">
              <Star className="w-3.5 h-3.5 text-emerald-500" />
              <span>正确率 {studyBuddy.totalQuestions > 0 ? Math.round((studyBuddy.correctAnswers / studyBuddy.totalQuestions) * 100) : 0}%</span>
            </div>
            <div className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full',
              difficultyLabels[difficulty]?.color
            )}>
              <Sparkles className="w-3 h-3" />
              <span>{difficultyLabels[difficulty]?.label}</span>
            </div>
          </div>
        </div>

        <div className="h-72 overflow-y-auto scrollbar-hide p-4 space-y-3">
          {studyBuddyMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-2.5',
                message.isUser ? 'flex-row-reverse' : ''
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0',
                  message.isUser
                    ? 'bg-cobalt-100 text-cobalt-400'
                    : 'bg-gradient-to-br from-violet-400 to-purple-500 text-white'
                )}
              >
                {message.isUser ? '👤' : studyBuddy.avatar}
              </div>
              <div
                className={cn(
                  'max-w-[75%] p-3 rounded-2xl',
                  message.isUser
                    ? 'bg-gradient-to-br from-cobalt-300 to-cobalt-400 text-white rounded-br-sm'
                    : 'bg-paper-50 text-ink-300 border border-paper-200 rounded-bl-sm'
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {message.content}
                </p>
                {message.difficulty && !message.isUser && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded',
                      difficultyLabels[message.difficulty]?.color
                    )}>
                      {difficultyLabels[message.difficulty]?.label}难度
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 py-3 border-t border-paper-200 bg-paper-100">
          <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(q)}
                className="flex-shrink-0 px-3 py-1.5 text-xs bg-paper-50 text-ink-200 rounded-full border border-paper-200 hover:bg-violet-50 hover:text-violet-400 hover:border-violet-200 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
              placeholder="和小诗童聊聊..."
              className="flex-1 px-4 py-2.5 bg-paper-50 border border-paper-200 rounded-xl text-sm text-ink-300 placeholder:text-ink-100 focus:outline-none focus:border-violet-300 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={cn(
                'p-2.5 rounded-xl transition-all duration-300',
                inputValue.trim()
                  ? 'bg-gradient-to-br from-violet-400 to-purple-500 text-white hover:shadow-md'
                  : 'bg-paper-200 text-ink-100 cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyBuddy;
