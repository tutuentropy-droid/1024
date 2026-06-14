import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Clock, Trash2, ChevronRight, RefreshCw, Target, AlertTriangle,
  CheckCircle, Play, Brain, Layers, Sparkles, TrendingUp, Filter,
  ChevronDown, ChevronUp, Award, Lightbulb, History, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getPoemById, getDynastyById, getSubPeriodById, getSubPeriodsByDynastyId } from '@/data';
import { generateQuestions, checkAnswer } from '@/services/quizService';
import type { QuizQuestion, WrongQuestionGroup } from '@/types';

interface SubPeriodGroup {
  subPeriodId: string;
  name: string;
  startYear: number;
  endYear: number;
  questions: any[];
  wrongPoemIds: string[];
}

const WrongBookPage = () => {
  const navigate = useNavigate();
  const {
    wrongQuestions,
    dynasties,
    poems,
    getWrongQuestionGroups,
    getRecommendedPractice,
    removeWrongQuestion,
    saveQuizResult,
    addWrongQuestion,
    userProgress,
  } = useAppStore();

  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceDynastyId, setPracticeDynastyId] = useState<string | null>(null);
  const [practiceQuestions, setPracticeQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedDynastyFilter, setSelectedDynastyFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'time' | 'count' | 'period'>('time');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const wrongGroups = useMemo(() => getWrongQuestionGroups(), [wrongQuestions, getWrongQuestionGroups]);

  const filteredGroups = useMemo(() => {
    let result = wrongGroups;
    if (selectedDynastyFilter) {
      result = result.filter(g => g.dynastyId === selectedDynastyFilter);
    }
    if (sortBy === 'count') {
      result = [...result].sort((a, b) => b.questions.length - a.questions.length);
    }
    return result;
  }, [wrongGroups, selectedDynastyFilter, sortBy]);

  const getSubPeriodGroups = (group: WrongQuestionGroup): SubPeriodGroup[] => {
    const subPeriodMap: Record<string, SubPeriodGroup> = {};
    const subPeriods = getSubPeriodsByDynastyId(group.dynastyId);

    group.questions.forEach(q => {
      const poem = getPoemById(q.poemId);
      const spId = poem?.subPeriodId || 'uncategorized';
      if (!subPeriodMap[spId]) {
        const sp = subPeriods.find(s => s.id === spId);
        subPeriodMap[spId] = {
          subPeriodId: spId,
          name: sp?.name || '其他时期',
          startYear: sp?.startYear || 0,
          endYear: sp?.endYear || 0,
          questions: [],
          wrongPoemIds: [],
        };
      }
      subPeriodMap[spId].questions.push(q);
      if (!subPeriodMap[spId].wrongPoemIds.includes(q.poemId)) {
        subPeriodMap[spId].wrongPoemIds.push(q.poemId);
      }
    });

    return Object.values(subPeriodMap).sort((a, b) => a.startYear - b.startYear);
  };

  const startPractice = (dynastyId: string, subPeriodId?: string) => {
    let recommendedIds = getRecommendedPractice(dynastyId);

    if (subPeriodId && subPeriodId !== 'uncategorized') {
      const groupPoems = wrongGroups.find(g => g.dynastyId === dynastyId)?.questions
        .map(q => q.poemId) || [];
      const subPeriodPoems = poems
        .filter(p => p.subPeriodId === subPeriodId)
        .map(p => p.id);
      const allRelevant = [...new Set([...groupPoems.filter(pid => subPeriodPoems.includes(pid)), ...recommendedIds.filter(pid => {
        const p = getPoemById(pid);
        return p?.subPeriodId === subPeriodId;
      })])];
      if (allRelevant.length >= 2) recommendedIds = allRelevant;
    }

    const practicePoems = recommendedIds
      .map(id => getPoemById(id))
      .filter(Boolean);

    if (practicePoems.length === 0) return;

    const questions = generateQuestions(practicePoems as any[], dynasties, Math.min(5, practicePoems.length * 2));
    setPracticeQuestions(questions);
    setPracticeDynastyId(dynastyId);
    setCurrentQIndex(0);
    setAnswers({});
    setShowExplanation(false);
    setPracticeMode(true);
  };

  const handleAnswer = (answer: string) => {
    const currentQ = practiceQuestions[currentQIndex];
    if (!currentQ || answers[currentQ.id]) return;

    setAnswers(prev => ({ ...prev, [currentQ.id]: answer }));
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQIndex < practiceQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      finishPractice();
    }
  };

  const finishPractice = () => {
    const questionDetails = practiceQuestions.map(q => {
      const userAnswer = answers[q.id] || '';
      const isCorrect = checkAnswer(q, userAnswer);
      return {
        questionId: q.id,
        poemId: q.poemId,
        type: q.type,
        isCorrect,
        userAnswer,
        correctAnswer: q.correctAnswer,
      };
    });

    const correctCount = questionDetails.filter(d => d.isCorrect).length;

    questionDetails.forEach(detail => {
      if (!detail.isCorrect) {
        const poem = getPoemById(detail.poemId);
        addWrongQuestion({
          questionId: detail.questionId,
          poemId: detail.poemId,
          question: detail.questionId,
          userAnswer: detail.userAnswer,
          correctAnswer: detail.correctAnswer,
          dynastyId: poem?.dynastyId || '',
        });
      }
    });

    saveQuizResult({
      totalQuestions: practiceQuestions.length,
      correctAnswers: correctCount,
      timeSpent: 60,
      questionDetails,
    });

    setPracticeMode(false);
    setPracticeDynastyId(null);
  };

  const toggleGroupExpand = (dynastyId: string) => {
    setExpandedGroups(prev => ({ ...prev, [dynastyId]: !prev[dynastyId] }));
  };

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    filteredGroups.forEach(g => { initial[g.dynastyId] = true; });
    setExpandedGroups(initial);
  }, [filteredGroups.length]);

  const totalWrongInPeriods = useMemo(() => {
    const counts: Record<string, number> = {};
    wrongQuestions.forEach(q => {
      const poem = getPoemById(q.poemId);
      const spId = poem?.subPeriodId || 'uncategorized';
      counts[spId] = (counts[spId] || 0) + 1;
    });
    return counts;
  }, [wrongQuestions]);

  const dynastyWithWrongCounts = useMemo(() => {
    return dynasties
      .map(d => ({
        dynasty: d,
        count: wrongQuestions.filter(q => q.dynastyId === d.id).length
      }))
      .filter(x => x.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [dynasties, wrongQuestions]);

  const accuracyByDynasty = useMemo(() => {
    const stats: Record<string, { correct: number; total: number }> = {};
    Object.values(userProgress.poemProgress).forEach(pp => {
      const poem = getPoemById(pp.poemId);
      if (!poem) return;
      if (!stats[poem.dynastyId]) stats[poem.dynastyId] = { correct: 0, total: 0 };
      stats[poem.dynastyId].correct += pp.correctCount || 0;
      stats[poem.dynastyId].total += (pp.correctCount || 0) + (pp.wrongCount || 0);
    });
    return stats;
  }, [userProgress.poemProgress]);

  if (practiceMode && practiceQuestions.length > 0) {
    const currentQ = practiceQuestions[currentQIndex];
    const currentAnswer = answers[currentQ.id];
    const isCorrect = currentAnswer ? checkAnswer(currentQ, currentAnswer) : null;
    const poem = getPoemById(currentQ.poemId);
    const subPeriod = poem?.subPeriodId ? getSubPeriodById(poem.subPeriodId) : null;
    const dynasty = poem ? getDynastyById(poem.dynastyId) : null;

    const correctSoFar = practiceQuestions
      .filter((q, i) => i <= currentQIndex)
      .filter((q, i) => {
        const a = answers[q.id];
        return a && checkAnswer(q, a);
      }).length;

    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="title-display text-2xl text-ink-400">
                  针对性强化练习
                </h2>
                <p className="text-sm text-ink-200 mt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: dynasty?.color }}
                    />
                    {dynasty?.name}
                    {subPeriod && <span className="mx-1">·</span>}
                    {subPeriod?.name}
                  </span>
                  <span className="mx-2">同类诗词练习</span>
                </p>
              </div>
              <button
                onClick={() => { setPracticeMode(false); setPracticeDynastyId(null); }}
                className="p-2 rounded-lg text-ink-200 hover:text-cinnabar-300 hover:bg-cinnabar-50 transition-colors"
              >
                退出练习
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-ink-200 mb-2">
                <span>第 {currentQIndex + 1} / {practiceQuestions.length} 题</span>
                <span className="inline-flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-jade-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {correctSoFar}
                  </span>
                  <span className="inline-flex items-center gap-1 text-cinnabar-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {currentQIndex + 1 - correctSoFar}
                  </span>
                </span>
              </div>
              <div className="h-2.5 bg-paper-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-cinnabar-300 via-gold-300 to-cobalt-300 transition-all duration-700 ease-out rounded-full"
                  style={{ width: `${((currentQIndex + 1) / practiceQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="card p-8 shadow-lg">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="stamp text-xs px-2.5 py-1 inline-flex items-center gap-1 bg-gradient-to-r from-cobalt-50 to-cinnabar-50 border-cobalt-100 text-cobalt-400">
                    <Brain className="w-3 h-3" />
                    针对性强化
                  </span>
                  {poem && (
                    <span className="text-xs text-ink-100 bg-paper-100 px-2 py-1 rounded-full">
                      {poem.author}《{poem.title}》
                      {subPeriod && <span className="ml-1">· {subPeriod.name}</span>}
                    </span>
                  )}
                </div>
                <h3 className="text-xl text-ink-300 leading-relaxed whitespace-pre-line font-medium">
                  {currentQ.question}
                </h3>
              </div>

              {currentQ.type === 'fill_blank' ? (
                <div className="mb-6">
                  <input
                    type="text"
                    value={currentAnswer || ''}
                    onChange={e => !currentAnswer && setAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && !currentAnswer && handleAnswer(currentAnswer || '')}
                    disabled={!!currentAnswer}
                    placeholder="请输入你的答案..."
                    className={cn(
                      'w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 text-lg',
                      'bg-paper-50 text-ink-300 placeholder-ink-100',
                      'focus:outline-none focus:border-cobalt-300 focus:shadow-md focus:shadow-cobalt-100',
                      currentAnswer && isCorrect && 'border-jade-300 bg-jade-50',
                      currentAnswer && !isCorrect && 'border-cinnabar-300 bg-cinnabar-50'
                    )}
                  />
                  {!currentAnswer && (
                    <button
                      onClick={() => handleAnswer(answers[currentQ.id] || '')}
                      className="mt-4 btn-primary w-full py-3.5 rounded-xl text-lg"
                    >
                      提交答案
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {currentQ.options?.map((option, index) => {
                    const isSelected = currentAnswer === option;
                    const isCorrectOption = option === currentQ.correctAnswer;

                    let btnClass = 'border-paper-300 bg-paper-50 hover:border-cobalt-200 hover:bg-cobalt-50/70';
                    if (currentAnswer) {
                      if (isCorrectOption) {
                        btnClass = 'border-jade-300 bg-jade-50/80 text-jade-500 shadow-jade-100 shadow-sm';
                      } else if (isSelected && !isCorrectOption) {
                        btnClass = 'border-cinnabar-300 bg-cinnabar-50/80 text-cinnabar-500 shadow-cinnabar-100 shadow-sm';
                      } else {
                        btnClass = 'border-paper-200 bg-paper-50/50 text-ink-100';
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        disabled={!!currentAnswer}
                        className={cn(
                          'w-full p-4.5 rounded-xl border-2 text-left transition-all duration-300 flex items-center gap-4',
                          btnClass,
                          !currentAnswer && 'hover:shadow-md hover:-translate-y-0.5'
                        )}
                      >
                        <span className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200',
                          currentAnswer && isCorrectOption ? 'bg-jade-400 text-white shadow-sm' :
                          currentAnswer && isSelected && !isCorrectOption ? 'bg-cinnabar-400 text-white shadow-sm' :
                          'bg-gradient-to-br from-paper-100 to-paper-200 text-ink-200'
                        )}>
                          {currentAnswer && isCorrectOption ? <CheckCircle className="w-5 h-5" /> :
                           currentAnswer && isSelected && !isCorrectOption ? <AlertTriangle className="w-5 h-5" /> :
                           String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1 text-base leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {showExplanation && (
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
                    {isCorrect
                      ? <><CheckCircle className="w-5 h-5" />回答正确！继续保持！🎉</>
                      : <><AlertTriangle className="w-5 h-5" />回答错误，记住这次！</>
                    }
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-ink-200 mb-3">
                      <span className="font-medium">正确答案：</span>
                      <span className="text-jade-500 font-bold text-base">{currentQ.correctAnswer}</span>
                    </p>
                  )}
                  <p className="text-sm text-ink-300 leading-relaxed whitespace-pre-line">
                    <span className="font-medium text-ink-200">💡 解题思路：</span>
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {currentAnswer && (
                <button onClick={nextQuestion} className="btn-primary w-full py-3.5 rounded-xl text-lg shadow-lg shadow-cinnabar-200/30 hover:shadow-cinnabar-300/40 transition-shadow inline-flex items-center justify-center gap-2">
                  {currentQIndex < practiceQuestions.length - 1 ? (
                    <><span>下一题</span><ArrowRight className="w-5 h-5" /></>
                  ) : (
                    <><Award className="w-5 h-5" /><span>完成练习 · 查看成果</span></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-cinnabar-50 to-gold-50 rounded-full border border-cinnabar-100 mb-4">
              <Brain className="w-3.5 h-3.5 text-cinnabar-400" />
              <span className="text-xs text-ink-200">AI智能错题分析 · 个性化查漏补缺</span>
            </div>
            <h1 className="title-display text-4xl text-ink-400 mb-3">
              智能错题本
            </h1>
            <p className="text-ink-200 leading-relaxed max-w-2xl mx-auto">
              按历史时期智能分类，精准分析薄弱知识点，推荐同类诗词史练习，助你高效巩固
            </p>
          </div>

          {wrongQuestions.length === 0 ? (
            <div className="card text-center py-20 animate-fade-in-up overflow-hidden relative">
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-jade-200/40 to-transparent rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-jade-50 to-jade-100 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle className="w-12 h-12 text-jade-400" />
                </div>
                <h3 className="title-display text-3xl text-ink-300 mb-3">太棒了！</h3>
                <p className="text-ink-200 mb-8 max-w-md mx-auto leading-relaxed">
                  你的错题本空空如也，说明你对诗词史知识掌握得非常扎实！<br />
                  继续保持，挑战更多测试来检验学习成果吧！
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => navigate('/quiz')}
                    className="btn-primary inline-flex items-center gap-2.5 px-7 py-3 rounded-xl shadow-lg shadow-cinnabar-200/30"
                  >
                    <Play className="w-4.5 h-4.5" />
                    去做测试
                  </button>
                  <button
                    onClick={() => navigate('/card')}
                    className="btn-secondary inline-flex items-center gap-2.5 px-7 py-3 rounded-xl"
                  >
                    <BookOpen className="w-4.5 h-4.5" />
                    学习诗词
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="card p-5 relative overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cinnabar-100/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-cinnabar-50 to-cinnabar-100 rounded-xl flex items-center justify-center shadow-sm">
                      <AlertTriangle className="w-5 h-5 text-cinnabar-400" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-ink-400 mb-1">{wrongQuestions.length}</div>
                      <div className="text-xs text-ink-100">总错题数</div>
                    </div>
                  </div>
                </div>
                <div className="card p-5 relative overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gold-100/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl flex items-center justify-center shadow-sm">
                      <Layers className="w-5 h-5 text-gold-500" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-ink-400 mb-1">{wrongGroups.length}</div>
                      <div className="text-xs text-ink-100">涉及朝代</div>
                    </div>
                  </div>
                </div>
                <div className="card p-5 relative overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cobalt-100/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-cobalt-50 to-cobalt-100 rounded-xl flex items-center justify-center shadow-sm">
                      <BookOpen className="w-5 h-5 text-cobalt-400" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-ink-400 mb-1">
                        {[...new Set(wrongQuestions.map(q => q.poemId))].length}
                      </div>
                      <div className="text-xs text-ink-100">涉及诗词</div>
                    </div>
                  </div>
                </div>
                <div className="card p-5 relative overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-jade-100/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-jade-50 to-jade-100 rounded-xl flex items-center justify-center shadow-sm">
                      <Target className="w-5 h-5 text-jade-400" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-ink-400 mb-1">
                        {wrongGroups.reduce((sum, g) => sum + g.recommendedPoemIds.length, 0)}
                      </div>
                      <div className="text-xs text-ink-100">智能推荐</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '120ms' }}>
                <div className="flex items-center gap-2 text-sm text-ink-200">
                  <Filter className="w-4 h-4" />
                  朝代筛选：
                </div>
                <button
                  onClick={() => setSelectedDynastyFilter(null)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-sm transition-all duration-300',
                    !selectedDynastyFilter
                      ? 'bg-gradient-to-r from-cinnabar-300 to-cinnabar-400 text-paper-50 shadow-md'
                      : 'bg-paper-200 text-ink-200 hover:bg-paper-300'
                  )}
                >
                  全部朝代
                </button>
                {dynastyWithWrongCounts.map(item => (
                  <button
                    key={item.dynasty.id}
                    onClick={() => setSelectedDynastyFilter(
                      selectedDynastyFilter === item.dynasty.id ? null : item.dynasty.id
                    )}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-sm transition-all duration-300 inline-flex items-center gap-1.5',
                      selectedDynastyFilter === item.dynasty.id
                        ? 'text-paper-50 shadow-md'
                        : 'text-ink-200 hover:opacity-80'
                    )}
                    style={selectedDynastyFilter === item.dynasty.id
                      ? { backgroundColor: item.dynasty.color }
                      : { backgroundColor: `${item.dynasty.color}15`, color: item.dynasty.color }
                    }
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.dynasty.color }}
                    />
                    {item.dynasty.name}
                    <span className="text-xs opacity-80">({item.count})</span>
                  </button>
                ))}

                <div className="w-px h-6 bg-paper-300 mx-1" />

                <div className="flex items-center gap-2 text-sm text-ink-200 ml-auto">
                  <TrendingUp className="w-4 h-4" />
                  排序：
                </div>
                {[
                  { key: 'time' as const, label: '按朝代时间' },
                  { key: 'count' as const, label: '按错题数量' },
                ].map(s => (
                  <button
                    key={s.key}
                    onClick={() => setSortBy(s.key)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs transition-all duration-300',
                      sortBy === s.key
                        ? 'bg-ink-300 text-paper-50 shadow-sm'
                        : 'bg-paper-200 text-ink-200 hover:bg-paper-300'
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {filteredGroups.map((group, groupIndex) => {
                  const subPeriodGroups = getSubPeriodGroups(group);
                  const dynastyAccuracy = accuracyByDynasty[group.dynastyId];
                  const accuracyPercent = dynastyAccuracy?.total
                    ? Math.round((dynastyAccuracy.correct / dynastyAccuracy.total) * 100)
                    : null;
                  const isExpanded = expandedGroups[group.dynastyId] !== false;

                  return (
                    <div
                      key={group.dynastyId}
                      className="card overflow-hidden animate-fade-in-up shadow-sm hover:shadow-md transition-shadow"
                      style={{ animationDelay: `${(groupIndex + 2) * 80}ms` }}
                    >
                      <div
                        className="px-6 py-5 flex items-center justify-between cursor-pointer group"
                        style={{
                          background: `linear-gradient(135deg, ${group.dynastyColor}12 0%, ${group.dynastyColor}05 100%)`,
                          borderBottom: `2px solid ${group.dynastyColor}25`
                        }}
                        onClick={() => toggleGroupExpand(group.dynastyId)}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                            style={{
                              background: `linear-gradient(135deg, ${group.dynastyColor}, ${group.dynastyColor}dd)`
                            }}
                          >
                            <Layers className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-ink-300 text-lg">{group.dynastyName}</h3>
                              <span
                                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                                style={{ backgroundColor: `${group.dynastyColor}22`, color: group.dynastyColor }}
                              >
                                {group.questions.length} 道错题
                              </span>
                              {accuracyPercent !== null && (
                                <span className={cn(
                                  'text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1',
                                  accuracyPercent >= 70 ? 'bg-jade-50 text-jade-500' :
                                  accuracyPercent >= 50 ? 'bg-gold-50 text-gold-500' :
                                  'bg-cinnabar-50 text-cinnabar-500'
                                )}>
                                  <TrendingUp className="w-3 h-3" />
                                  正确率 {accuracyPercent}%
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-ink-100 inline-flex items-center gap-1.5">
                              <History className="w-3 h-3" />
                              {group.period}
                              <span className="mx-1">·</span>
                              {subPeriodGroups.length > 1 ? `${subPeriodGroups.length}个历史分期` : `${subPeriodGroups.length}个分期`}
                              <span className="mx-1">·</span>
                              {group.recommendedPoemIds.length} 道推荐练习
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); startPractice(group.dynastyId); }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg text-white"
                            style={{ backgroundColor: group.dynastyColor }}
                          >
                            <RefreshCw className="w-4 h-4" />
                            强化练习
                          </button>
                          {isExpanded
                            ? <ChevronUp className="w-5 h-5 text-ink-200 group-hover:text-ink-300 transition-colors" />
                            : <ChevronDown className="w-5 h-5 text-ink-200 group-hover:text-ink-300 transition-colors" />
                          }
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-6">
                          {subPeriodGroups.length > 1 && (
                            <div className="mb-6">
                              <h4 className="text-sm font-semibold text-ink-300 mb-3.5 flex items-center gap-2">
                                <Layers className="w-4 h-4" style={{ color: group.dynastyColor }} />
                                按历史时期分类
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {subPeriodGroups.map(spg => (
                                  <div
                                    key={spg.subPeriodId}
                                    className="p-4 rounded-xl bg-paper-50 border border-paper-200 hover:border-paper-300 transition-all hover:shadow-sm group"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h5 className="font-medium text-ink-300 text-sm">{spg.name}</h5>
                                        <p className="text-xs text-ink-100 mt-0.5">
                                          {spg.startYear > 0 ? spg.startYear : `公元前${Math.abs(spg.startYear)}`}
                                          {' - '}
                                          {spg.endYear > 0 ? spg.endYear : `公元前${Math.abs(spg.endYear)}`}年
                                        </p>
                                      </div>
                                      <span
                                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                        style={{ backgroundColor: `${group.dynastyColor}18`, color: group.dynastyColor }}
                                      >
                                        {spg.questions.length}题
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap mt-3">
                                      {spg.wrongPoemIds.slice(0, 3).map(pid => {
                                        const p = getPoemById(pid);
                                        return p ? (
                                          <span
                                            key={pid}
                                            className="text-xs px-1.5 py-0.5 bg-paper-100 text-ink-200 rounded"
                                          >
                                            《{p.title.length > 4 ? p.title.slice(0, 4) + '…' : p.title}》
                                          </span>
                                        ) : null;
                                      })}
                                      {spg.wrongPoemIds.length > 3 && (
                                        <span className="text-xs text-ink-100">
                                          +{spg.wrongPoemIds.length - 3}首
                                        </span>
                                      )}
                                    </div>
                                    {spg.wrongPoemIds.length >= 2 && (
                                      <button
                                        onClick={() => startPractice(group.dynastyId, spg.subPeriodId)}
                                        className="mt-3 w-full py-1.5 rounded-lg text-xs font-medium transition-all duration-200 group-hover:opacity-100 opacity-0 group-hover:bg-opacity-100"
                                        style={{ backgroundColor: `${group.dynastyColor}15`, color: group.dynastyColor }}
                                      >
                                        针对{spg.name}练习
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-ink-300 mb-3.5 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-cinnabar-400" />
                              错题列表（{group.questions.length}道）
                            </h4>
                            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-2">
                              {group.questions.map(q => {
                                const poem = getPoemById(q.poemId);
                                const subPeriod = poem?.subPeriodId ? getSubPeriodById(poem.subPeriodId) : null;
                                const prog = userProgress.poemProgress[q.poemId];
                                return (
                                  <div
                                    key={q.id}
                                    className="p-4 bg-gradient-to-br from-cinnabar-50/50 to-paper-50 rounded-xl border border-cinnabar-100/60 flex items-start justify-between gap-3 hover:shadow-sm transition-shadow"
                                  >
                                    <div className="flex-1 min-w-0">
                                      {poem && (
                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                          <p className="text-sm font-kai text-ink-300 font-medium">
                                            《{poem.title}》— {poem.author}
                                          </p>
                                          {subPeriod && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${group.dynastyColor}15`, color: group.dynastyColor }}>
                                              {subPeriod.name}
                                            </span>
                                          )}
                                          {prog && prog.wrongCount && prog.wrongCount > 1 && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cinnabar-100 text-cinnabar-400 font-medium">
                                              错{prog.wrongCount}次
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2.5 text-xs flex-wrap">
                                        <span className="px-2 py-0.5 bg-white/70 rounded border border-cinnabar-100 text-cinnabar-400 line-through decoration-cinnabar-300/50">
                                          ✗ {q.userAnswer || '未作答'}
                                        </span>
                                        <ChevronRight className="w-3 h-3 text-ink-100" />
                                        <span className="px-2 py-0.5 bg-jade-50 rounded border border-jade-100 text-jade-500 font-medium">
                                          ✓ {q.correctAnswer}
                                        </span>
                                      </div>
                                      {poem && (
                                        <button
                                          onClick={() => navigate(`/card/${poem.id}`)}
                                          className="mt-2 text-xs text-cobalt-400 hover:text-cobalt-500 inline-flex items-center gap-1 font-medium"
                                        >
                                          <BookOpen className="w-3 h-3" />
                                          复习《{poem.title}》原文
                                          <ChevronRight className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                      <button
                                        onClick={() => removeWrongQuestion(q.id)}
                                        className="p-2 rounded-lg hover:bg-cinnabar-100/60 transition-colors text-ink-100 hover:text-cinnabar-400"
                                        title="从错题本移除"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                      <span className="text-[10px] text-ink-100">
                                        {new Date(q.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {group.recommendedPoemIds.length > 0 && (
                            <div>
                              <div className="flex items-center justify-between mb-3.5">
                                <h4 className="text-sm font-semibold text-ink-300 flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-gold-500" />
                                  智能推荐同类诗词练习
                                  <span className="text-xs font-normal text-ink-100 ml-1">
                                    （基于标签、时期、难度匹配）
                                  </span>
                                </h4>
                                <button
                                  onClick={() => startPractice(group.dynastyId)}
                                  className="text-xs text-cobalt-400 hover:text-cobalt-500 inline-flex items-center gap-1 font-medium"
                                >
                                  <Target className="w-3.5 h-3.5" />
                                  立即开始全部练习
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {group.recommendedPoemIds.map(poemId => {
                                  const poem = getPoemById(poemId);
                                  if (!poem) return null;
                                  const sp = poem.subPeriodId ? getSubPeriodById(poem.subPeriodId) : null;
                                  const prog = userProgress.poemProgress[poemId];
                                  const hasStudied = prog?.isStudied;
                                  const wrongCount = prog?.wrongCount || 0;
                                  const isWeak = wrongCount >= 2;

                                  return (
                                    <button
                                      key={poemId}
                                      onClick={() => navigate(`/card/${poemId}`)}
                                      className={cn(
                                        'p-4.5 rounded-xl border-2 text-left transition-all duration-300 group',
                                        'hover:shadow-lg hover:-translate-y-0.5',
                                        isWeak
                                          ? 'bg-gradient-to-br from-cinnabar-50/60 to-paper-50 border-cinnabar-200/60 hover:border-cinnabar-300'
                                          : hasStudied
                                            ? 'bg-gradient-to-br from-jade-50/50 to-paper-50 border-jade-200/50 hover:border-jade-300'
                                            : 'bg-gradient-to-br from-cobalt-50/60 to-paper-50 border-cobalt-200/60 hover:border-cobalt-300'
                                      )}
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="font-kai text-base text-ink-300 group-hover:text-cinnabar-400 transition-colors font-medium">
                                            《{poem.title}》
                                          </span>
                                          {isWeak && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cinnabar-100 text-cinnabar-500 font-medium inline-flex items-center gap-0.5">
                                              <AlertTriangle className="w-2.5 h-2.5" />
                                              薄弱
                                            </span>
                                          )}
                                          {hasStudied && !isWeak && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-jade-100 text-jade-500 font-medium inline-flex items-center gap-0.5">
                                              <CheckCircle className="w-2.5 h-2.5" />
                                              已学
                                            </span>
                                          )}
                                          {!hasStudied && !isWeak && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cobalt-100 text-cobalt-500 font-medium">
                                              推荐
                                            </span>
                                          )}
                                        </div>
                                        <ChevronRight className={cn(
                                          'w-4 h-4 flex-shrink-0 transition-all duration-300 group-hover:translate-x-0.5',
                                          isWeak ? 'text-cinnabar-300' : hasStudied ? 'text-jade-400' : 'text-cobalt-400'
                                        )} />
                                      </div>
                                      <p className="text-xs text-ink-200 mb-2">
                                        {poem.author}
                                        <span className="mx-1">·</span>
                                        {group.dynastyName}
                                        {sp && <span className="mx-1">·</span>}
                                        {sp?.name}
                                      </p>
                                      <p className="text-xs text-cinnabar-400 font-kai mb-3 line-clamp-1 px-2 py-1 bg-cinnabar-50/50 rounded border border-cinnabar-100/50">
                                        「{poem.famousLine}」
                                      </p>
                                      <div className="flex gap-1 flex-wrap">
                                        {poem.tags.slice(0, 3).map(tag => (
                                          <span
                                            key={tag}
                                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                                            style={{ backgroundColor: `${group.dynastyColor}12`, color: group.dynastyColor }}
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                        <span className={cn(
                                          'text-[10px] px-1.5 py-0.5 rounded-full',
                                          poem.difficulty === 'easy' ? 'bg-jade-50 text-jade-500' :
                                          poem.difficulty === 'medium' ? 'bg-gold-50 text-gold-600' :
                                          'bg-cinnabar-50 text-cinnabar-500'
                                        )}>
                                          {poem.difficulty === 'easy' ? '简单' : poem.difficulty === 'medium' ? '中等' : '困难'}
                                        </span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WrongBookPage;
