import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipBack, SkipForward, Clock, BookOpen, Calendar, Check, Lock, ChevronRight, X, Sparkles, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getDynastyById, getPoemById } from '@/data';
import type { AudioTheater } from '@/types';

const formatYear = (year: number): string => {
  if (year < 0) return `公元前${Math.abs(year)}年`;
  return `公元${year}年`;
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AudioTheaterPage = () => {
  const [selectedTheater, setSelectedTheater] = useState<AudioTheater | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);

  const audioTheaters = useAppStore((state) => state.audioTheaters);
  const audioTheaterProgress = useAppStore((state) => state.audioTheaterProgress);
  const markAudioTheaterPlayed = useAppStore((state) => state.markAudioTheaterPlayed);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const paragraphs = selectedTheater
    ? selectedTheater.storyContent.split('\n\n').filter(p => p.trim())
    : [];

  const handlePlay = useCallback(() => {
    if (!synthRef.current || !selectedTheater) return;

    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    if (synthRef.current.paused) {
      synthRef.current.resume();
      setIsPlaying(true);
      startTimer();
      return;
    }

    const textToSpeak = selectedTheater.storyContent;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = isMuted ? 0 : 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentTime(0);
      setCurrentParagraphIndex(0);
      startTimer();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentTime(selectedTheater.duration);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      markAudioTheaterPlayed(selectedTheater.id);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [isPlaying, selectedTheater, isMuted, markAudioTheaterPlayed]);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1;
        if (selectedTheater) {
          const progress = next / selectedTheater.duration;
          const paraIndex = Math.min(
            Math.floor(progress * paragraphs.length),
            paragraphs.length - 1
          );
          setCurrentParagraphIndex(paraIndex);
        }
        return next;
      });
    }, 1000);
  }, [selectedTheater, paragraphs.length]);

  const handleReset = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentParagraphIndex(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    if (utteranceRef.current) {
      utteranceRef.current.volume = isMuted ? 1 : 0;
    }
  }, [isMuted]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
    const progress = newTime / (selectedTheater?.duration || 1);
    setCurrentParagraphIndex(Math.min(
      Math.floor(progress * paragraphs.length),
      paragraphs.length - 1
    ));
  }, [selectedTheater, paragraphs.length]);

  const handleSelectTheater = (theater: AudioTheater) => {
    setSelectedTheater(theater);
    setShowPlayer(true);
    handleReset();
  };

  const progress = selectedTheater
    ? (currentTime / selectedTheater.duration) * 100
    : 0;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 text-gold-300 rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            聆听历史的声音
          </div>
          <h1 className="title-display text-4xl text-ink-400 mb-3">
            诗词史有声剧场
          </h1>
          <p className="text-ink-200 max-w-2xl mx-auto">
            重大历史事件改编为2分钟音频故事，经典诗句作旁白，让历史在耳边鲜活起来
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {audioTheaters.map((theater, index) => {
            const dynasty = getDynastyById(theater.dynastyId);
            const progress = audioTheaterProgress[theater.id];
            const isCompleted = progress?.isCompleted;

            return (
              <div
                key={theater.id}
                className="card group cursor-pointer animate-fade-in-up hover:-translate-y-2 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleSelectTheater(theater)}
              >
                <div className="relative mb-4">
                  <div
                    className="w-full h-40 rounded-xl bg-gradient-to-br from-paper-200 to-paper-300 flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${dynasty?.color}20 0%, ${dynasty?.color}40 100%)`
                    }}
                  >
                    <Music className="w-12 h-12 text-ink-100" />
                  </div>
                  {isCompleted && (
                    <div className="absolute top-3 right-3">
                      <span className="stamp bg-jade-300 text-paper-50 text-xs">
                        已收听
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: dynasty?.color }}
                    />
                    <span className="text-xs text-ink-100 bg-paper-50/80 px-2 py-0.5 rounded-full">
                      {dynasty?.name}
                    </span>
                  </div>
                </div>

                <h3 className="title-display text-xl text-ink-400 mb-2 group-hover:text-cobalt-300 transition-colors">
                  {theater.title}
                </h3>

                <p className="text-sm text-ink-200 mb-4 line-clamp-2">
                  {theater.description}
                </p>

                <div className="flex items-center justify-between text-xs text-ink-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatYear(theater.year)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDuration(theater.duration)}
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full',
                    theater.difficulty === 'easy' ? 'bg-jade-50 text-jade-300' :
                    theater.difficulty === 'medium' ? 'bg-gold-50 text-gold-300' :
                    'bg-cinnabar-50 text-cinnabar-300'
                  )}>
                    {theater.difficulty === 'easy' ? '入门' :
                     theater.difficulty === 'medium' ? '进阶' : '挑战'}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-paper-200">
                  <p className="text-xs text-ink-100 mb-2">旁白诗句</p>
                  <div className="space-y-1">
                    {theater.narratorPoemLines.slice(0, 2).map((line, idx) => (
                      <p key={idx} className="text-sm font-kai text-cinnabar-300 line-clamp-1">
                        「{line}」
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-ink-100 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {theater.relatedPoemIds.length} 首相关诗词
                  </span>
                  <span className="text-cobalt-300 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    立即收听
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showPlayer && selectedTheater && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink-400/60 backdrop-blur-sm"
            onClick={() => {
              setShowPlayer(false);
              handleReset();
            }}
          />

          <div className="relative w-full max-w-2xl bg-gradient-to-br from-paper-50 via-paper-100 to-paper-200 rounded-t-2xl md:rounded-2xl shadow-2xl border border-paper-300 overflow-hidden animate-slide-up">
            <div className="sticky top-0 z-10 bg-gradient-to-r from-paper-100 to-paper-200 border-b border-paper-300 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-gold-300" />
                <h2 className="title-display text-lg text-ink-400">
                  正在播放
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowPlayer(false);
                  handleReset();
                }}
                className="p-2 rounded-lg bg-paper-200 text-ink-200 hover:bg-paper-300 transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="title-display text-2xl text-ink-400 mb-2">
                  {selectedTheater.title}
                </h3>
                <p className="text-sm text-ink-200">
                  {formatYear(selectedTheater.year)} · {formatDuration(selectedTheater.duration)}
                </p>
              </div>

              <div className="bg-paper-50 rounded-xl border border-paper-200 p-4 mb-6 max-h-60 overflow-y-auto scrollbar-hide">
                {paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className={cn(
                      'text-sm leading-relaxed mb-3 transition-all duration-500',
                      idx === currentParagraphIndex
                        ? 'text-ink-400 font-medium bg-gold-50/50 -mx-2 px-2 py-1 rounded-lg'
                        : idx < currentParagraphIndex
                        ? 'text-ink-200'
                        : 'text-ink-100'
                    )}
                  >
                    {para}
                  </p>
                ))}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-ink-100 mb-2">
                  <span>{formatDuration(currentTime)}</span>
                  <span>{formatDuration(selectedTheater.duration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={selectedTheater.duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-paper-200 rounded-full appearance-none cursor-pointer accent-cobalt-300"
                />
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={handleReset}
                  className="p-3 rounded-full bg-paper-200 text-ink-200 hover:bg-paper-300 transition-all"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={handlePlay}
                  className="p-5 rounded-full bg-gradient-to-br from-cobalt-300 to-cobalt-400 text-paper-50 hover:shadow-lg transition-all hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setCurrentTime(selectedTheater.duration);
                    if (synthRef.current) {
                      synthRef.current.cancel();
                    }
                    setIsPlaying(false);
                    markAudioTheaterPlayed(selectedTheater.id);
                  }}
                  className="p-3 rounded-full bg-paper-200 text-ink-200 hover:bg-paper-300 transition-all"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleToggleMute}
                  className="p-2 rounded-lg bg-paper-200 text-ink-200 hover:bg-paper-300 transition-all"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                {audioTheaterProgress[selectedTheater.id]?.isCompleted && (
                  <span className="inline-flex items-center gap-1 text-xs text-jade-300">
                    <Check className="w-4 h-4" />
                    已完成
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-paper-300 px-6 py-4 bg-paper-100">
              <h4 className="text-sm font-medium text-ink-300 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-300" />
                旁白诗句
              </h4>
              <div className="space-y-1">
                {selectedTheater.narratorPoemLines.map((line, idx) => (
                  <p key={idx} className="text-sm font-kai text-cinnabar-300">
                    「{line}」
                  </p>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedTheater.relatedPoemIds.map((poemId) => {
                  const poem = getPoemById(poemId);
                  return poem ? (
                    <span
                      key={poemId}
                      className="text-xs bg-cobalt-50 text-cobalt-300 px-2 py-1 rounded-full"
                    >
                      《{poem.title}》· {poem.author}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioTheaterPage;
