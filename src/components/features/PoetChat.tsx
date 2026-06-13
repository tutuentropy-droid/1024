import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Info, BookOpen, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store';
import { getVirtualPoetById } from '@/data';
import { cn } from '@/lib/utils';

interface PoetChatProps {
  poetId: string;
  onClose: () => void;
}

const PoetChat = ({ poetId, onClose }: PoetChatProps) => {
  const { chatMessages, sendChatMessage, selectPoet } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const poet = getVirtualPoetById(poetId);
  const messages = chatMessages[poetId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg.isUser) {
        setIsTyping(false);
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const msg = inputValue.trim();
    setInputValue('');
    setIsTyping(true);
    sendChatMessage(poetId, msg);
    setTimeout(() => setIsTyping(false), 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    '请介绍一下你自己',
    '你所处的时代背景是怎样的？',
    '你最有名的诗句是什么？',
    '你和其他诗人有什么故事？',
  ];

  if (!poet) return null;

  const dynastyColors: Record<string, string> = {
    tang: '#C41E3A',
    song: '#2B5C8A',
    nanbeichao: '#2E8B57',
  };

  const dynastyNames: Record<string, string> = {
    tang: '唐朝',
    song: '宋朝',
    nanbeichao: '南北朝',
  };

  const color = dynastyColors[poet.dynastyId] || '#C41E3A';
  const dynastyName = dynastyNames[poet.dynastyId] || '';

  return (
    <div className="fixed inset-0 bg-ink-400/50 flex items-center justify-center z-50 p-4">
      <div className="bg-paper-50 rounded-2xl w-full max-w-lg h-[80vh] flex flex-col shadow-2xl animate-fade-in-up overflow-hidden">
        <div
          className="p-4 flex items-center gap-3 flex-shrink-0"
          style={{ backgroundColor: color + '15' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: color + '30' }}
          >
            {poet.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-ink-400">{poet.name}</h3>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: color + '20', color }}
              >
                {dynastyName}
              </span>
            </div>
            <p className="text-xs text-ink-100 truncate">{poet.styleName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-paper-200 transition-colors"
          >
            <X className="w-5 h-5 text-ink-200" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-paper-100/50">
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-2 animate-fade-in-up',
                msg.isUser ? 'flex-row-reverse' : 'flex-row'
              )}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0',
                  msg.isUser ? 'bg-cinnabar-100' : ''
                )}
                style={{
                  backgroundColor: msg.isUser ? undefined : color + '20',
                }}
              >
                {msg.isUser ? '👤' : poet.avatar}
              </div>
              <div
                className={cn(
                  'max-w-[80%] px-4 py-2 rounded-2xl',
                  msg.isUser
                    ? 'bg-cinnabar-300 text-paper-50 rounded-tr-sm'
                    : 'bg-paper-50 text-ink-300 rounded-tl-sm border border-paper-200'
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                style={{ backgroundColor: color + '20' }}
              >
                {poet.avatar}
              </div>
              <div className="bg-paper-50 px-4 py-3 rounded-2xl rounded-tl-sm border border-paper-200">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-ink-100 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-ink-100 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-ink-100 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="px-4 py-2 bg-paper-100/30 border-t border-paper-200">
            <p className="text-xs text-ink-100 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              快速提问
            </p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputValue(q);
                    inputRef.current?.focus();
                  }}
                  className="px-3 py-1.5 text-xs bg-paper-50 border border-paper-200 rounded-full text-ink-200 hover:bg-paper-200 hover:text-ink-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 border-t border-paper-200 bg-paper-50 flex-shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`向${poet.name}提问...`}
              className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-paper-100 border border-paper-200 text-ink-300 placeholder:text-ink-100 focus:outline-none focus:border-cinnabar-300 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="px-4 py-2.5 bg-cinnabar-300 text-paper-50 rounded-xl hover:bg-cinnabar-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoetChat;
