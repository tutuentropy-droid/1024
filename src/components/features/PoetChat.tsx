import { useState, useRef, useEffect } from 'react';
import { Send, X, User, Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getVirtualPoetById, getDynastyById } from '@/data';

const PoetChat = () => {
  const { selectedPoetId, chatMessages, sendChatMessage, selectPoet } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const poet = selectedPoetId ? getVirtualPoetById(selectedPoetId) : null;
  const dynasty = poet ? getDynastyById(poet.dynastyId) : null;
  const messages = selectedPoetId ? chatMessages[selectedPoetId] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !selectedPoetId) return;
    sendChatMessage(selectedPoetId, inputValue.trim());
    setInputValue('');
  };

  const handleClose = () => {
    selectPoet(null);
  };

  if (!poet) return null;

  return (
    <div className="relative w-full max-w-lg max-h-[80vh] bg-gradient-to-br from-paper-50 via-paper-100 to-paper-200 rounded-2xl shadow-2xl border border-paper-300 overflow-hidden animate-fade-in-up">
      <div className="sticky top-0 z-10 bg-gradient-to-r from-paper-100 to-paper-200 border-b border-paper-300 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
            style={{ backgroundColor: dynasty?.color + '20' }}
          >
            {poet.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="title-display text-lg text-ink-400">
                {poet.name}
              </h3>
              {dynasty && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: dynasty.color + '20', color: dynasty.color }}
                >
                  {dynasty.name}
                </span>
              )}
            </div>
            <p className="text-xs text-ink-100">
              {poet.styleName}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-2 rounded-lg bg-paper-200 text-ink-200 hover:bg-paper-300 transition-all duration-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 h-96 overflow-y-auto scrollbar-hide">
        <div className="mb-4 p-4 bg-gold-50 rounded-xl border border-gold-100">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gold-500 mb-1">诗人简介</p>
              <p className="text-sm text-ink-200 leading-relaxed">
                {poet.bio.slice(0, 100)}...
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3',
                message.isUser ? 'flex-row-reverse' : ''
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0',
                  message.isUser
                    ? 'bg-cobalt-100 text-cobalt-400'
                    : 'bg-ink-100 text-ink-300'
                )}
              >
                {message.isUser ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={cn(
                  'max-w-[80%] p-3 rounded-xl',
                  message.isUser
                    ? 'bg-cobalt-300 text-paper-50 rounded-br-none'
                    : 'bg-paper-50 text-ink-300 border border-paper-200 rounded-bl-none'
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-paper-300 bg-paper-100">
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
            placeholder={`与${poet.name}对话...`}
            className="flex-1 px-4 py-3 bg-paper-50 border border-paper-200 rounded-xl text-sm text-ink-300 placeholder:text-ink-100 focus:outline-none focus:border-cobalt-300 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={cn(
              'p-3 rounded-xl transition-all duration-300',
              inputValue.trim()
                ? 'bg-gradient-to-br from-cobalt-300 to-cobalt-400 text-paper-50 hover:shadow-lg'
                : 'bg-paper-200 text-ink-100 cursor-not-allowed'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoetChat;
