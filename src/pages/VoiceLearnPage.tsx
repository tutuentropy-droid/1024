import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Mic, MicOff, Play, Pause, SkipForward, SkipBack, BookOpen, Clock, Trophy,
  Check, X, Volume2, RotateCcw, Sparkles, Brain, Send, Wand2,
  ChevronLeft, ChevronRight, Lightbulb, Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getPoemById, getDynastyById, getSubPeriodById, getEventById } from '@/data';
import type { VoiceLearnCard, Poem, HistoricalEvent, Dynasty } from '@/types';

interface VoiceTestQuestion {
  id: string;
  cardId: string;
  type: 'multiple_choice' | 'fill_blank' | 'match' | 'order';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  relatedLine?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const fuzzyMatch = (text: string, keywords: string[]): number => {
  const lowerText = text.toLowerCase();
  let score = 0;
  keywords.forEach(kw => {
    if (lowerText.includes(kw.toLowerCase())) score += 1;
  });
  return score;
};

const generateAdvancedTestQuestions = (cards: VoiceLearnCard[]): VoiceTestQuestion[] => {
  const questions: VoiceTestQuestion[] = [];
  const poemCards = cards.filter(c => c.type === 'poem');
  const eventCards = cards.filter(c => c.type === 'event');
  const dynastyCards = cards.filter(c => c.type === 'dynasty');

  poemCards.slice(0, 4).forEach((card, idx) => {
    const poem = getPoemById(card.id.replace('vc-poem-', ''));
    if (!poem) return;

    questions.push({
      id: `q-poem-${idx}-1`,
      cardId: card.id,
      type: 'multiple_choice',
      question: `《${poem.title}》的作者是谁？`,
      options: generateAuthorOptions(poem.author),
      correctAnswer: poem.author,
      explanation: `${poem.author}，${poem.authorBio}`,
      difficulty: 'easy',
    });

    if (poem.content.length >= 2) {
      const randomIdx = Math.floor(Math.random() * (poem.content.length - 1));
      const line = poem.content[randomIdx].text;
      const nextLine = poem.content[randomIdx + 1].text;
      questions.push({
        id: `q-poem-${idx}-2`,
        cardId: card.id,
        type: 'fill_blank',
        question: `请补全诗句：「${line.replace(/[，。！？、；]/g, '____')}」\n下一句是？`,
        correctAnswer: nextLine,
        explanation: `《${poem.title}》诗句：「${line}${nextLine}」`,
        relatedLine: card.famousLine,
        difficulty: 'medium',
      });
    }

    const dynasty = getDynastyById(poem.dynastyId);
    const wrongDynasties = ['汉', '唐', '宋', '元', '明', '清', '南北朝']
      .filter(d => d !== dynasty?.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    questions.push({
      id: `q-poem-${idx}-3`,
      cardId: card.id,
      type: 'multiple_choice',
      question: `《${poem.title}》创作于哪个朝代？`,
      options: shuffleArray([dynasty?.name || '唐', ...wrongDynasties]),
      correctAnswer: dynasty?.name || '唐',
      explanation: `《${poem.title}》是${dynasty?.name}${poem.author}的作品。${poem.background}`,
      relatedLine: card.famousLine,
      difficulty: poem.difficulty,
    });

    if (poem.tags.length > 0) {
      const wrongTags = ['田园诗', '边塞诗', '咏史诗', '送别诗', '爱情诗', '山水诗']
        .filter(t => !poem.tags.includes(t))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      questions.push({
        id: `q-poem-${idx}-4`,
        cardId: card.id,
        type: 'multiple_choice',
        question: `《${poem.title}》属于哪一类诗歌？`,
        options: shuffleArray([poem.tags[0], ...wrongTags]),
        correctAnswer: poem.tags[0],
        explanation: `${poem.tags.join('、')}类诗歌的代表作。${poem.historicalInsight.culture || poem.historicalInsight.society || ''}`,
        difficulty: 'hard',
      });
    }
  });

  eventCards.slice(0, 3).forEach((card, idx) => {
    const event = getEventById(card.id.replace('vc-event-', ''));
    if (!event) return;

    questions.push({
      id: `q-event-${idx}-1`,
      cardId: card.id,
      type: 'multiple_choice',
      question: `「${event.name}」发生在哪一年？`,
      options: [
        event.year > 0 ? `${event.year}年` : `公元前${Math.abs(event.year)}年`,
        event.year > 0 ? `${event.year - 10}年` : `公元前${Math.abs(event.year) - 10}年`,
        event.year > 0 ? `${event.year + 15}年` : `公元前${Math.abs(event.year) + 15}年`,
        event.year > 0 ? `${event.year + 30}年` : `公元前${Math.abs(event.year) + 30}年`,
      ].sort(() => Math.random() - 0.5),
      correctAnswer: event.year > 0 ? `${event.year}年` : `公元前${Math.abs(event.year)}年`,
      explanation: event.impact,
      difficulty: 'medium',
    });

    const dynasty = getDynastyById(event.dynastyId);
    questions.push({
      id: `q-event-${idx}-2`,
      cardId: card.id,
      type: 'fill_blank',
      question: `「${event.name}」是____时期的重要历史事件。`,
      correctAnswer: dynasty?.name || '唐',
      explanation: `${dynasty?.name}时期，${event.description}其影响是：${event.impact}`,
      difficulty: 'easy',
    });
  });

  dynastyCards.slice(0, 2).forEach((card, idx) => {
    const dynasty = getDynastyById(card.dynastyId);
    if (!dynasty) return;

    questions.push({
      id: `q-dynasty-${idx}-1`,
      cardId: card.id,
      type: 'multiple_choice',
      question: `${dynasty.name}的都城是哪里？`,
      options: generateCapitalOptions(dynasty.capital),
      correctAnswer: dynasty.capital,
      explanation: `${dynasty.name}都城：${dynasty.capital}。${dynasty.description}`,
      difficulty: 'easy',
    });

    questions.push({
      id: `q-dynasty-${idx}-2`,
      cardId: card.id,
      type: 'fill_blank',
      question: `${dynasty.name}时期历时约____年。\n（提示：从${dynasty.startYear > 0 ? dynasty.startYear : '公元前' + Math.abs(dynasty.startYear)}年到${dynasty.endYear > 0 ? dynasty.endYear : '公元前' + Math.abs(dynasty.endYear)}年）`,
      correctAnswer: String(dynasty.endYear - dynasty.startYear),
      explanation: `${dynasty.name}历时${dynasty.endYear - dynasty.startYear}年，涌现了${dynasty.famousPoets.slice(0, 3).join('、')}等著名诗人。`,
      difficulty: 'hard',
    });
  });

  return questions.slice(0, 8);
};

const generateAuthorOptions = (correctAuthor: string): string[] => {
  const allAuthors = ['李白', '杜甫', '王维', '白居易', '苏轼', '李清照', '辛弃疾', '陆游', '王勃', '陈子昂', '陶渊明', '谢灵运', '纳兰性德', '龚自珍', '于谦', '关汉卿'];
  const wrongs = allAuthors.filter(a => a !== correctAuthor).sort(() => Math.random() - 0.5).slice(0, 3);
  return shuffleArray([correctAuthor, ...wrongs]);
};

const generateCapitalOptions = (correct: string): string[] => {
  const allCapitals = ['长安（今西安）', '洛阳', '东京（今开封）', '临安（今杭州）', '建康（今南京）', '大都（今北京）', '北京', '南京'];
  const wrongs = allCapitals.filter(c => !c.includes(correct.slice(0, 2)) && !correct.includes(c.slice(0, 2))).sort(() => Math.random() - 0.5).slice(0, 3);
  return shuffleArray([correct, ...wrongs]);
};

const shuffleArray = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const VoiceLearnPage = () => {
  const {
    dynasties,
    poems,
    events,
    subPeriods,
    voiceLearnSession,
    startVoiceLearnSession,
    advanceVoiceCard,
    toggleVoicePlayback,
    startVoiceTest,
    answerVoiceTest,
    endVoiceLearnSession,
  } = useAppStore();

  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [manualQuery, setManualQuery] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [advancedTestQuestions, setAdvancedTestQuestions] = useState<VoiceTestQuestion[]>([]);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SR);
    setTtsSupported(!!window.speechSynthesis);
    synthRef.current = window.speechSynthesis;

    if (SR) {
      const recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'zh-CN';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setVoiceText(transcript);
        if (event.results[0].isFinal) {
          handleVoiceQuery(transcript);
          setIsListening(false);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleVoiceQuery = useCallback((query: string) => {
    if (!query.trim()) return;
    startVoiceLearnSession(query.trim());
  }, [startVoiceLearnSession]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setVoiceText('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    if (onEnd) {
      utterance.onend = onEnd;
    }
    synthRef.current.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
  }, []);

  const handleManualSearch = () => {
    if (manualQuery.trim()) {
      startVoiceLearnSession(manualQuery.trim());
      setManualQuery('');
    }
  };

  const currentCard = voiceLearnSession?.cards[voiceLearnSession.currentCardIndex];
  const isLastCard = voiceLearnSession ? voiceLearnSession.currentCardIndex >= voiceLearnSession.cards.length - 1 : true;
  const isFirstCard = voiceLearnSession ? voiceLearnSession.currentCardIndex === 0 : true;

  const handlePlayCard = () => {
    if (!currentCard) return;
    if (voiceLearnSession?.isPlaying) {
      stopSpeaking();
      toggleVoicePlayback();
    } else {
      speak(currentCard.audioText, () => {
        if (autoAdvance && !isLastCard) {
          setTimeout(() => {
            if (voiceLearnSession) {
              advanceVoiceCard();
              const nextCard = voiceLearnSession.cards[voiceLearnSession.currentCardIndex + 1];
              if (nextCard) {
                speak(nextCard.audioText);
              }
            }
          }, 800);
        } else {
          toggleVoicePlayback();
        }
      });
      toggleVoicePlayback();
    }
  };

  const handleNextCard = () => {
    stopSpeaking();
    if (voiceLearnSession?.isPlaying) toggleVoicePlayback();
    advanceVoiceCard();
  };

  const handlePrevCard = () => {
    stopSpeaking();
    if (voiceLearnSession?.isPlaying) toggleVoicePlayback();
    const state = useAppStore.getState();
    if (state.voiceLearnSession && state.voiceLearnSession.currentCardIndex > 0) {
      useAppStore.setState({
        voiceLearnSession: {
          ...state.voiceLearnSession,
          currentCardIndex: state.voiceLearnSession.currentCardIndex - 1,
        },
      });
    }
  };

  const handleStartTest = () => {
    stopSpeaking();
    if (voiceLearnSession?.isPlaying) toggleVoicePlayback();
    const questions = generateAdvancedTestQuestions(voiceLearnSession?.cards || []);
    setAdvancedTestQuestions(questions);
    startVoiceTest();
  };

  const getCardIcon = (type: VoiceLearnCard['type']) => {
    switch (type) {
      case 'dynasty': return <Clock className="w-5 h-5" />;
      case 'poem': return <BookOpen className="w-5 h-5" />;
      case 'event': return <Trophy className="w-5 h-5" />;
    }
  };

  const getCardColor = (type: VoiceLearnCard['type'], dynastyId: string) => {
    const dynasty = dynasties.find(d => d.id === dynastyId);
    const baseColor = dynasty?.color || '#999';
    switch (type) {
      case 'dynasty': return { bg: `${baseColor}15`, border: `${baseColor}40`, text: baseColor, glow: `${baseColor}10` };
      case 'poem': return { bg: '#C41E3A12', border: '#C41E3A35', text: '#C41E3A', glow: '#C41E3A08' };
      case 'event': return { bg: '#DAA52012', border: '#DAA52035', text: '#B8860B', glow: '#DAA52008' };
    }
  };

  const smartSuggestions = useMemo(() => {
    const dynastyNames = dynasties.map(d => ({ label: d.name, desc: `${d.famousPoets.slice(0, 2).join('、')}等诗人` }));
    const famousLines = poems.slice(0, 6).map(p => ({
      label: p.famousLine.length > 8 ? p.famousLine.slice(0, 8) + '…' : p.famousLine,
      desc: `${p.author}《${p.title}》`,
      searchText: p.famousLine,
    }));
    return { dynastyNames, famousLines };
  }, [dynasties, poems]);

  if (!voiceLearnSession) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-cobalt-50 to-cinnabar-50 rounded-full border border-cobalt-100 mb-4">
                <Wand2 className="w-3.5 h-3.5 text-cobalt-400" />
                <span className="text-xs text-ink-200">AI驱动的语音交互学习</span>
              </div>
              <h1 className="title-display text-4xl text-ink-400 mb-3">
                语音指令学习
              </h1>
              <p className="text-ink-200 leading-relaxed">
                口述朝代、诗人或诗句，系统自动匹配知识卡片并语音播放，然后开始智能测试
              </p>
            </div>

            <div className="card text-center py-10 mb-8 animate-fade-in-up relative overflow-hidden" style={{ animationDelay: '100ms' }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cinnabar-100/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cobalt-100/40 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className={cn(
                  'w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-500',
                  isListening
                    ? 'bg-gradient-to-br from-cinnabar-300 to-cinnabar-400 shadow-2xl shadow-cinnabar-300/40 scale-105'
                    : 'bg-gradient-to-br from-cinnabar-200 via-cinnabar-300 to-cinnabar-400 shadow-xl'
                )}>
                  {isListening ? (
                    <div className="relative">
                      <MicOff className="w-14 h-14 text-paper-50" />
                      <div className="absolute inset-0 animate-ping rounded-full bg-cinnabar-300/40" />
                    </div>
                  ) : (
                    <Mic className="w-14 h-14 text-paper-50" />
                  )}
                </div>

                <h2 className="title-display text-2xl text-ink-400 mb-2">
                  {isListening ? '正在聆听...' : '说出你的指令'}
                </h2>

                <div className="min-h-[48px] mb-6 flex items-center justify-center">
                  {isListening ? (
                    <p className="text-cinnabar-300 font-medium animate-pulse">
                      {voiceText || '请说出朝代、诗人或诗句...'}
                    </p>
                  ) : (
                    <p className="text-ink-200 max-w-md mx-auto text-sm">
                      点击麦克风按钮，说出朝代（如"唐朝"）、诗人（如"李白"）或诗句（如"飞流直下三千尺"）
                    </p>
                  )}
                </div>

                {isListening && (
                  <div className="flex items-center justify-center gap-1 mb-6 h-8">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-cinnabar-300 rounded-full animate-wave"
                        style={{
                          height: `${Math.random() * 24 + 8}px`,
                          animationDelay: `${i * 0.05}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                <button
                  onClick={toggleListening}
                  disabled={!speechSupported}
                  className={cn(
                    'px-8 py-3.5 rounded-2xl text-white text-lg font-medium transition-all duration-300 inline-flex items-center gap-3 shadow-lg',
                    isListening
                      ? 'bg-gradient-to-r from-cinnabar-400 to-cinnabar-500 hover:from-cinnabar-500 hover:to-cinnabar-600 shadow-cinnabar-300/30'
                      : 'bg-gradient-to-r from-cinnabar-300 to-cinnabar-400 hover:from-cinnabar-400 hover:to-cinnabar-500 shadow-cinnabar-200/30 hover:shadow-cinnabar-300/40',
                    !speechSupported && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isListening ? (
                    <><MicOff className="w-5 h-5" />停止聆听</>
                  ) : (
                    <><Mic className="w-5 h-5" />开始语音输入</>
                  )}
                </button>

                {!speechSupported && (
                  <p className="text-xs text-cinnabar-300 mt-4 bg-cinnabar-50 inline-block px-3 py-1 rounded-full">
                    您的浏览器不支持语音识别，请使用手动输入
                  </p>
                )}
              </div>
            </div>

            <div className="card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h3 className="text-sm font-medium text-ink-300 mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-cobalt-400" />
                手动输入搜索
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={manualQuery}
                  onChange={e => setManualQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
                  placeholder="输入朝代名称、诗人或诗句关键词..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-paper-300 bg-paper-50 text-ink-300 placeholder-ink-100 focus:outline-none focus:border-cinnabar-300 transition-all duration-200 focus:shadow-md focus:shadow-cinnabar-100"
                />
                <button
                  onClick={handleManualSearch}
                  disabled={!manualQuery.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-7 rounded-xl"
                >
                  搜索
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="card p-6">
                <h3 className="text-sm font-medium text-ink-300 mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-cinnabar-400" />
                  按朝代探索
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {smartSuggestions.dynastyNames.map(item => (
                    <button
                      key={item.label}
                      onClick={() => handleVoiceQuery(item.label)}
                      className="p-3 rounded-xl bg-gradient-to-br from-paper-50 to-paper-100 border border-paper-200 hover:border-cinnabar-200 hover:from-cinnabar-50 hover:to-white transition-all duration-200 text-left group"
                    >
                      <span className="text-sm font-medium text-ink-300 group-hover:text-cinnabar-300 transition-colors font-kai">
                        {item.label}
                      </span>
                      <p className="text-xs text-ink-100 mt-0.5 line-clamp-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-sm font-medium text-ink-300 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  按名句搜索
                </h3>
                <div className="space-y-2.5">
                  {smartSuggestions.famousLines.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleVoiceQuery(item.searchText)}
                      className="w-full p-3 rounded-xl bg-gradient-to-br from-gold-50/60 to-paper-50 border border-gold-100 hover:border-gold-200 hover:from-gold-50 transition-all duration-200 text-left group"
                    >
                      <span className="text-sm font-kai text-ink-300 group-hover:text-gold-500 transition-colors">
                        「{item.label}」
                      </span>
                      <p className="text-xs text-ink-100 mt-0.5">— {item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (voiceLearnSession.testStarted) {
    return (
      <VoiceTestView
        session={voiceLearnSession}
        questions={advancedTestQuestions}
        onAnswer={answerVoiceTest}
        onEnd={endVoiceLearnSession}
        speak={speak}
      />
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6 animate-fade-in-up">
            <div>
              <h2 className="title-display text-2xl text-ink-400">
                知识卡片播放
              </h2>
              <p className="text-sm text-ink-200 mt-1">
                搜索：<span className="text-cinnabar-300 font-medium">「{voiceLearnSession.query}」</span>
                <span className="mx-2 text-ink-100">·</span>
                共 <span className="font-semibold">{voiceLearnSession.cards.length}</span> 张卡片
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-ink-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={e => setAutoAdvance(e.target.checked)}
                  className="w-4 h-4 rounded text-cinnabar-300 focus:ring-cinnabar-300"
                />
                自动连播
              </label>
              <button
                onClick={() => {
                  stopSpeaking();
                  endVoiceLearnSession();
                }}
                className="p-2 rounded-lg text-ink-200 hover:text-cinnabar-300 hover:bg-cinnabar-50 transition-colors"
                title="返回搜索"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between text-sm text-ink-200 mb-2">
              <span>卡片 {voiceLearnSession.currentCardIndex + 1} / {voiceLearnSession.cards.length}</span>
              <span className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-cinnabar-300" />
                  {voiceLearnSession.cards.filter(c => c.type === 'poem').length} 诗词
                </span>
                <span className="inline-flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-gold-400" />
                  {voiceLearnSession.cards.filter(c => c.type === 'event').length} 事件
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cobalt-400" />
                  {voiceLearnSession.cards.filter(c => c.type === 'dynasty').length} 朝代
                </span>
              </span>
            </div>
            <div className="h-2.5 bg-paper-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-cinnabar-300 via-gold-300 to-cobalt-300 transition-all duration-700 ease-out rounded-full"
                style={{ width: `${((voiceLearnSession.currentCardIndex + 1) / voiceLearnSession.cards.length) * 100}%` }}
              />
            </div>
          </div>

          {currentCard && (
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div
                className="card p-8 mb-6 border-2 relative overflow-hidden"
                style={{
                  backgroundColor: getCardColor(currentCard.type, currentCard.dynastyId).bg,
                  borderColor: getCardColor(currentCard.type, currentCard.dynastyId).border,
                }}
              >
                <div
                  className="absolute inset-0 opacity-50 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 90% 10%, ${getCardColor(currentCard.type, currentCard.dynastyId).glow}, transparent 50%)`,
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: getCardColor(currentCard.type, currentCard.dynastyId).text + '18' }}
                    >
                      <span style={{ color: getCardColor(currentCard.type, currentCard.dynastyId).text }}>
                        {getCardIcon(currentCard.type)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                        style={{
                          backgroundColor: getCardColor(currentCard.type, currentCard.dynastyId).text + '18',
                          color: getCardColor(currentCard.type, currentCard.dynastyId).text,
                        }}
                      >
                        {currentCard.type === 'dynasty' ? '朝代概览' : currentCard.type === 'poem' ? '诗词鉴赏' : '历史事件'}
                      </span>
                    </div>
                    {currentCard.year !== undefined && (
                      <span className="text-sm text-ink-200 bg-paper-100 px-3 py-1 rounded-full font-medium">
                        {currentCard.year > 0 ? `公元${currentCard.year}年` : `公元前${Math.abs(currentCard.year)}年`}
                      </span>
                    )}
                  </div>

                  <h3 className="title-display text-3xl text-ink-400 mb-5 leading-snug">
                    {currentCard.title}
                  </h3>

                  <div className="p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 mb-5 shadow-sm">
                    <p className="text-ink-300 leading-[1.9] text-base">
                      {currentCard.content}
                    </p>
                  </div>

                  {currentCard.famousLine && (
                    <div className="p-5 bg-gradient-to-br from-cinnabar-50/80 to-white rounded-2xl border border-cinnabar-100/80 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-gold-500" />
                        <span className="text-xs font-semibold text-gold-500 uppercase tracking-wide">千古名句</span>
                      </div>
                      <p className="font-kai text-xl text-cinnabar-400 text-center py-2">
                        「{currentCard.famousLine}」
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={handlePrevCard}
                  disabled={isFirstCard}
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300',
                    isFirstCard
                      ? 'bg-paper-100 text-ink-100 cursor-not-allowed'
                      : 'bg-paper-200 hover:bg-paper-300 text-ink-300 hover:shadow-md'
                  )}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handlePlayCard}
                  disabled={!ttsSupported}
                  className={cn(
                    'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl',
                    voiceLearnSession.isPlaying
                      ? 'bg-gradient-to-br from-cinnabar-400 to-cinnabar-500 hover:from-cinnabar-500 hover:to-cinnabar-600 text-paper-50 shadow-cinnabar-300/40 scale-105'
                      : 'bg-gradient-to-br from-cobalt-300 to-cobalt-400 hover:from-cobalt-400 hover:to-cobalt-500 text-paper-50 shadow-cobalt-300/30 hover:shadow-cobalt-300/40 hover:scale-105',
                    !ttsSupported && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {voiceLearnSession.isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Volume2 className="w-8 h-8" />
                  )}
                </button>

                <button
                  onClick={handleNextCard}
                  disabled={isLastCard}
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300',
                    isLastCard
                      ? 'bg-paper-100 text-ink-100 cursor-not-allowed'
                      : 'bg-paper-200 hover:bg-paper-300 text-ink-300 hover:shadow-md'
                  )}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex gap-1.5 overflow-x-auto py-1 max-w-md">
                  {voiceLearnSession.cards.map((card, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        stopSpeaking();
                        if (voiceLearnSession?.isPlaying) toggleVoicePlayback();
                        const state = useAppStore.getState();
                        if (state.voiceLearnSession) {
                          useAppStore.setState({
                            voiceLearnSession: { ...state.voiceLearnSession, currentCardIndex: index },
                          });
                        }
                      }}
                      className={cn(
                        'h-2 rounded-full transition-all duration-300 flex-shrink-0',
                        index === voiceLearnSession.currentCardIndex
                          ? 'bg-gradient-to-r from-cinnabar-300 to-cinnabar-400 w-10 shadow-sm'
                          : index < voiceLearnSession.currentCardIndex
                            ? 'bg-cinnabar-200 w-5'
                            : 'bg-paper-300 w-5 hover:bg-paper-400'
                      )}
                      title={`卡片 ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleStartTest}
                  disabled={voiceLearnSession.testQuestions.length === 0}
                  className="btn-primary inline-flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl shadow-lg shadow-cinnabar-200/30 hover:shadow-cinnabar-300/40 transition-shadow"
                >
                  <Brain className="w-4.5 h-4.5" />
                  <span>开始智能测试</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1">
                    {generateAdvancedTestQuestions(voiceLearnSession.cards).length}题
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VoiceTestView = ({ session, questions, onAnswer, onEnd, speak }: {
  session: any;
  questions: VoiceTestQuestion[];
  onAnswer: (questionId: string, answer: string) => void;
  onEnd: () => void;
  speak: (text: string) => void;
}) => {
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [fillInput, setFillInput] = useState('');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [wrongQuestions, setWrongQuestions] = useState<{ question: VoiceTestQuestion; userAnswer: string }[]>([]);

  const currentQ = questions[currentTestIndex];
  const isCorrect = selectedAnswer === currentQ?.correctAnswer || fillInput.trim() === currentQ?.correctAnswer;

  useEffect(() => {
    setShowResult(false);
    setSelectedAnswer(null);
    setFillInput('');
  }, [currentTestIndex]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    const finalAnswer = answer;
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: finalAnswer }));
    onAnswer(currentQ.cardId, finalAnswer);

    if (finalAnswer !== currentQ.correctAnswer) {
      setWrongQuestions(prev => [...prev, { question: currentQ, userAnswer: finalAnswer }]);
    }
  };

  const handleFillSubmit = () => {
    if (showResult || !fillInput.trim()) return;
    handleAnswer(fillInput.trim());
  };

  const handleNext = () => {
    if (currentTestIndex < questions.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
    }
  };

  const correctCount = questions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
  const answeredCount = Object.keys(userAnswers).length;

  if (answeredCount >= questions.length) {
    const accuracy = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="card text-center py-12 animate-fade-in-up overflow-hidden relative">
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-gold-200/40 to-transparent rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className={cn(
                  'w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center shadow-2xl',
                  accuracy >= 80 ? 'bg-gradient-to-br from-jade-300 to-jade-500 shadow-jade-300/40' :
                  accuracy >= 60 ? 'bg-gradient-to-br from-gold-300 to-gold-500 shadow-gold-300/40' :
                  'bg-gradient-to-br from-cinnabar-300 to-cinnabar-500 shadow-cinnabar-300/40'
                )}>
                  <Trophy className="w-14 h-14 text-paper-50" />
                </div>

                <h2 className="title-display text-3xl text-ink-400 mb-2">测试完成！</h2>
                <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-cinnabar-400 via-gold-500 to-cobalt-400 bg-clip-text text-transparent">
                  {accuracy.toFixed(0)}分
                </div>
                <p className="text-ink-200 mb-8 max-w-md mx-auto">
                  {accuracy >= 90 ? '太棒了！你对这段诗词史了如指掌！🏆' :
                   accuracy >= 80 ? '出色！你对这段诗词史掌握得很好！👍' :
                   accuracy >= 60 ? '不错！继续巩固会更好！💪' :
                   '加油！多看几遍知识卡片再来挑战吧！📚'}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                  <div className="p-4 bg-jade-50/80 rounded-2xl border border-jade-100">
                    <div className="text-3xl font-bold text-jade-400 mb-1">{correctCount}</div>
                    <div className="text-xs text-ink-100">正确</div>
                  </div>
                  <div className="p-4 bg-cinnabar-50/80 rounded-2xl border border-cinnabar-100">
                    <div className="text-3xl font-bold text-cinnabar-400 mb-1">{questions.length - correctCount}</div>
                    <div className="text-xs text-ink-100">错误</div>
                  </div>
                  <div className="p-4 bg-cobalt-50/80 rounded-2xl border border-cobalt-100">
                    <div className="text-3xl font-bold text-cobalt-400 mb-1">{questions.length}</div>
                    <div className="text-xs text-ink-100">总题数</div>
                  </div>
                </div>

                {wrongQuestions.length > 0 && (
                  <div className="mb-8 text-left max-w-lg mx-auto">
                    <h3 className="text-sm font-semibold text-ink-300 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-gold-500" />
                      错题回顾（{wrongQuestions.length}题）
                    </h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {wrongQuestions.map(({ question, userAnswer }, idx) => (
                        <div key={idx} className="p-4 bg-cinnabar-50/60 rounded-xl border border-cinnabar-100">
                          <p className="text-sm text-ink-300 mb-2 line-clamp-2">{question.question}</p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-2 py-1 bg-cinnabar-100 text-cinnabar-400 rounded-lg line-through">
                              你的答案：{userAnswer || '未作答'}
                            </span>
                            <span className="px-2 py-1 bg-jade-100 text-jade-500 rounded-lg font-medium">
                              正确：{question.correctAnswer}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-4">
                  <button onClick={onEnd} className="btn-primary inline-flex items-center gap-2 px-7 py-3 rounded-xl shadow-lg">
                    <RotateCcw className="w-4.5 h-4.5" />
                    继续学习
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="title-display text-2xl text-ink-400">智能知识测试</h2>
              <p className="text-sm text-ink-200 mt-1">
                搜索：<span className="text-cinnabar-300">「{session.query}」</span>
              </p>
            </div>
            <button onClick={onEnd} className="p-2 rounded-lg text-ink-200 hover:text-cinnabar-300 hover:bg-cinnabar-50 transition-colors">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-ink-200 mb-2">
              <span>第 {currentTestIndex + 1} / {questions.length} 题</span>
              <span className="inline-flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-jade-400">
                  <Check className="w-3.5 h-3.5" />
                  {correctCount}
                </span>
                <span className="inline-flex items-center gap-1 text-cinnabar-400">
                  <X className="w-3.5 h-3.5" />
                  {answeredCount - correctCount}
                </span>
              </span>
            </div>
            <div className="h-2.5 bg-paper-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-cinnabar-300 via-gold-300 to-cobalt-300 transition-all duration-700 ease-out rounded-full"
                style={{ width: `${((currentTestIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="card p-8 mb-6 animate-fade-in-up shadow-lg">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={cn(
                  'stamp text-xs px-2.5 py-1 inline-flex items-center gap-1',
                  currentQ.difficulty === 'easy' && 'bg-jade-50 text-jade-400 border-jade-100',
                  currentQ.difficulty === 'medium' && 'bg-gold-50 text-gold-500 border-gold-100',
                  currentQ.difficulty === 'hard' && 'bg-cinnabar-50 text-cinnabar-400 border-cinnabar-100',
                )}>
                  {currentQ.type === 'fill_blank' ? '填空题' :
                   currentQ.type === 'multiple_choice' ? '选择题' : '问答题'}
                  <span className="ml-1">
                    {currentQ.difficulty === 'easy' ? '★' : currentQ.difficulty === 'medium' ? '★★' : '★★★'}
                  </span>
                </span>
              </div>
              <h3 className="text-lg md:text-xl text-ink-300 leading-relaxed whitespace-pre-line font-medium">
                {currentQ.question}
              </h3>
            </div>

            {currentQ.type === 'fill_blank' ? (
              <div className="mb-6">
                <input
                  type="text"
                  value={fillInput}
                  onChange={e => !showResult && setFillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleFillSubmit()}
                  disabled={showResult}
                  placeholder="请输入你的答案..."
                  className={cn(
                    'w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 text-lg',
                    'bg-paper-50 text-ink-300 placeholder-ink-100',
                    'focus:outline-none focus:border-cobalt-300 focus:shadow-md focus:shadow-cobalt-100',
                    showResult && isCorrect && 'border-jade-300 bg-jade-50',
                    showResult && !isCorrect && 'border-cinnabar-300 bg-cinnabar-50'
                  )}
                />
                {!showResult && (
                  <button
                    onClick={handleFillSubmit}
                    disabled={!fillInput.trim()}
                    className="mt-4 btn-primary w-full py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    提交答案
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {currentQ.options?.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrectOption = option === currentQ.correctAnswer;

                  let buttonClass = 'border-paper-300 bg-paper-50 hover:border-cobalt-200 hover:bg-cobalt-50/70';
                  if (showResult) {
                    if (isCorrectOption) {
                      buttonClass = 'border-jade-300 bg-jade-50/80 text-jade-500 shadow-jade-100 shadow-sm';
                    } else if (isSelected && !isCorrectOption) {
                      buttonClass = 'border-cinnabar-300 bg-cinnabar-50/80 text-cinnabar-500 shadow-cinnabar-100 shadow-sm';
                    } else {
                      buttonClass = 'border-paper-200 bg-paper-50/50 text-ink-100';
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                      className={cn(
                        'w-full p-4 rounded-xl border-2 text-left transition-all duration-300',
                        'flex items-center gap-4',
                        buttonClass,
                        !showResult && 'hover:shadow-md hover:-translate-y-0.5'
                      )}
                    >
                      <span className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200',
                        showResult && isCorrectOption ? 'bg-jade-400 text-white shadow-sm' :
                        showResult && isSelected && !isCorrectOption ? 'bg-cinnabar-400 text-white shadow-sm' :
                        'bg-gradient-to-br from-paper-100 to-paper-200 text-ink-200 group-hover:from-cobalt-100 group-hover:to-cobalt-200'
                      )}>
                        {showResult && isCorrectOption ? <Check className="w-5 h-5" /> :
                         showResult && isSelected && !isCorrectOption ? <X className="w-5 h-5" /> :
                         String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1 text-base leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {showResult && (
              <>
                <div className={cn(
                  'p-5 rounded-2xl mb-5 border',
                  isCorrect
                    ? 'bg-gradient-to-br from-jade-50 to-white border-jade-200'
                    : 'bg-gradient-to-br from-cinnabar-50 to-white border-cinnabar-200'
                )}>
                  <p className={cn(
                    'text-base font-semibold mb-2 flex items-center gap-2',
                    isCorrect ? 'text-jade-500' : 'text-cinnabar-500'
                  )}>
                    {isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    {isCorrect ? '回答正确！太棒了！🎉' : '回答错误，再接再厉！💪'}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-ink-200 mb-2">
                      <span className="font-medium">正确答案：</span>
                      <span className="text-jade-500 font-bold">{currentQ.correctAnswer}</span>
                    </p>
                  )}
                  <p className="text-sm text-ink-300 leading-relaxed whitespace-pre-line">
                    <span className="font-medium text-ink-200">📖 解析：</span>
                    {currentQ.explanation}
                  </p>
                </div>

                {currentQ.relatedLine && (
                  <div className="p-4 bg-cinnabar-50/60 rounded-2xl border border-cinnabar-100 mb-5 text-center">
                    <p className="font-kai text-lg text-cinnabar-400">「{currentQ.relatedLine}」</p>
                  </div>
                )}
              </>
            )}

            {showResult && (
              <button
                onClick={handleNext}
                className="btn-primary w-full inline-flex items-center justify-center gap-2.5 py-3.5 rounded-xl shadow-lg shadow-cinnabar-200/30 hover:shadow-cinnabar-300/40 transition-shadow text-lg"
              >
                {currentTestIndex < questions.length - 1 ? (
                  <><span>下一题</span><ChevronRight className="w-5 h-5" /></>
                ) : (
                  <><Trophy className="w-5 h-5" /><span>查看测试结果</span></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceLearnPage;
