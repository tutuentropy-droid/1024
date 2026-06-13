import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, Check, X, Clock, Target, Award, BookOpen, ChevronRight, Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { generateQuestions, checkAnswer, getQuestionTypeLabel } from '@/services/quizService';
import { getPoemById } from '@/data';
import type { QuizQuestion, QuizQuestionDetail } from '@/types';

interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Record<string, string>;
  showResult: boolean;
  isFinished: boolean;
  startTime: number;
  questionDetails: QuizQuestionDetail[];
}

const initialState: QuizState = {
  questions: [],
  currentIndex: 0,
  answers: {},
  showResult: false,
  isFinished: false,
  startTime: 0,
  questionDetails: [],
};

const QuizModule = () => {
  const navigate = useNavigate();
  const { dynasties, poems, userProgress, getStudiedPoemIds, saveQuizResult } = useAppStore();
  
  const [state, setState] = useState<QuizState>(initialState);
  const [fillBlankInput, setFillBlankInput] = useState('');
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const studiedPoemIds = getStudiedPoemIds();
  const availablePoems = studiedPoemIds.length > 0
    ? poems.filter(p => studiedPoemIds.includes(p.id))
    : poems.slice(0, 5);

  const currentQuestion = state.questions[state.currentIndex];
  const currentAnswer = currentQuestion ? state.answers[currentQuestion.id] : null;
  const isCorrect = currentQuestion && currentAnswer
    ? checkAnswer(currentQuestion, currentAnswer)
    : null;

  const startQuiz = useCallback(() => {
    const currentDifficulty = userProgress.currentDifficulty;
    const questions = generateQuestions(availablePoems, dynasties, 5, currentDifficulty);
    setState({
      ...initialState,
      questions,
      startTime: Date.now(),
    });
    setFillBlankInput('');
    setShowExplanation(false);
  }, [availablePoems, dynasties, userProgress.currentDifficulty]);

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || currentAnswer) return;

    const correct = checkAnswer(currentQuestion, answer);
    
    if (!correct) {
      setShakeId(currentQuestion.id);
      setTimeout(() => setShakeId(null), 300);
    }

    const detail: QuizQuestionDetail = {
      questionId: currentQuestion.id,
      poemId: currentQuestion.poemId,
      type: currentQuestion.type,
      isCorrect: correct,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
    };

    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: answer,
      },
      showResult: true,
      questionDetails: [...prev.questionDetails, detail],
    }));

    setShowExplanation(true);
  };

  const handleFillBlankSubmit = () => {
    if (fillBlankInput.trim()) {
      handleAnswer(fillBlankInput.trim());
    }
  };

  const nextQuestion = () => {
    if (state.currentIndex < state.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        showResult: false,
      }));
      setFillBlankInput('');
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - state.startTime) / 1000);
    const correctCount = state.questionDetails.filter(d => d.isCorrect).length;

    saveQuizResult({
      totalQuestions: state.questions.length,
      correctAnswers: correctCount,
      timeSpent,
      questionDetails: state.questionDetails,
    });

    setState(prev => ({
      ...prev,
      isFinished: true,
    }));
  };

  const restartQuiz = () => {
    setState(initialState);
    setFillBlankInput('');
    setShowExplanation(false);
  };

  const correctCount = state.questionDetails.filter(d => d.isCorrect).length;
  const accuracy = state.questions.length > 0 ? (correctCount / state.questions.length) * 100 : 0;
  const poem = currentQuestion ? getPoemById(currentQuestion.poemId) : null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-jade-300 bg-jade-50';
      case 'medium': return 'text-gold-300 bg-gold-50';
      case 'hard': return 'text-cinnabar-300 bg-cinnabar-50';
      default: return 'text-ink-200 bg-paper-100';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return difficulty;
    }
  };

  if (state.questions.length === 0 && !state.isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="card text-center py-12 animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cobalt-300 to-cobalt-400 rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-paper-50" />
          </div>
          
          <h2 className="title-display text-3xl text-ink-400 mb-4">
            智能测试
          </h2>
          
          <p className="text-ink-200 mb-6 max-w-md mx-auto">
            根据你已学习的诗词内容，系统将随机生成题目进行测试。
            {studiedPoemIds.length === 0 ? (
              <span className="block text-cinnabar-300 mt-2">
                你还没有学习任何诗词，将使用示例题目进行测试。
              </span>
            ) : (
              <span className="block text-jade-300 mt-2">
                已学习 {studiedPoemIds.length} 首诗词，将从中随机出题。
              </span>
            )}
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-8 text-sm text-ink-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-jade-300" />
                填空题
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cobalt-300" />
                选择题
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold-300" />
                历史理解
              </div>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="btn-primary inline-flex items-center gap-2 text-lg"
          >
            <Play className="w-5 h-5" />
            开始测试
          </button>
        </div>
      </div>
    );
  }

  if (state.isFinished) {
    const timeSpent = state.questionDetails.length > 0
      ? state.questionDetails.reduce((sum, d) => {
          const result = userProgress.quizResults[userProgress.quizResults.length - 1];
          return result ? result.timeSpent : 0;
        }, 0)
      : 0;

    const newDifficulty = userProgress.currentDifficulty;
    const difficultyChanged = userProgress.quizResults.length > 1;

    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="card text-center py-12 animate-fade-in-up">
          <div className={cn(
            'w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center',
            accuracy >= 80 ? 'bg-gradient-to-br from-jade-300 to-jade-400' :
            accuracy >= 60 ? 'bg-gradient-to-br from-gold-300 to-gold-400' :
            'bg-gradient-to-br from-cinnabar-300 to-cinnabar-400'
          )}>
            <Award className="w-12 h-12 text-paper-50" />
          </div>
          
          <h2 className="title-display text-3xl text-ink-400 mb-2">
            测试完成！
          </h2>
          
          <p className="text-ink-200 mb-6">
            {accuracy >= 80 ? '太棒了！你对诗词历史的掌握非常好！' :
             accuracy >= 60 ? '不错！继续努力，你会做得更好！' :
             '加油！多学习几首诗词再来挑战吧！'}
          </p>

          {difficultyChanged && (
            <div className={cn(
              'mb-6 p-4 rounded-xl mx-auto max-w-md animate-fade-in-up',
              'border-2',
              newDifficulty === 'hard' ? 'bg-cinnabar-50 border-cinnabar-200' :
              newDifficulty === 'medium' ? 'bg-gold-50 border-gold-200' :
              'bg-jade-50 border-jade-200'
            )}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className={cn(
                  'w-5 h-5',
                  newDifficulty === 'hard' ? 'text-cinnabar-400' :
                  newDifficulty === 'medium' ? 'text-gold-400' :
                  'text-jade-400'
                )} />
                <span className={cn(
                  'font-medium',
                  newDifficulty === 'hard' ? 'text-cinnabar-400' :
                  newDifficulty === 'medium' ? 'text-gold-400' :
                  'text-jade-400'
                )}>
                  智能难度调整
                </span>
              </div>
              <p className="text-sm text-ink-300">
                根据你的测试表现，系统已将学习难度调整为：
                <span className={cn(
                  'font-bold ml-1',
                  newDifficulty === 'hard' ? 'text-cinnabar-400' :
                  newDifficulty === 'medium' ? 'text-gold-400' :
                  'text-jade-400'
                )}>
                  {newDifficulty === 'hard' ? '困难' : newDifficulty === 'medium' ? '中等' : '简单'}
                </span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            <div className="p-4 bg-paper-100 rounded-xl">
              <div className="text-3xl font-bold text-cobalt-300 mb-1">
                {state.questions.length}
              </div>
              <div className="text-xs text-ink-100">总题数</div>
            </div>
            <div className="p-4 bg-paper-100 rounded-xl">
              <div className="text-3xl font-bold text-jade-300 mb-1">
                {correctCount}
              </div>
              <div className="text-xs text-ink-100">正确</div>
            </div>
            <div className="p-4 bg-paper-100 rounded-xl">
              <div className="text-3xl font-bold text-cinnabar-300 mb-1">
                {accuracy.toFixed(0)}%
              </div>
              <div className="text-xs text-ink-100">正确率</div>
            </div>
          </div>

          <div className="space-y-3 mb-8 max-w-md mx-auto">
            <h3 className="text-sm font-medium text-ink-300 text-left">答题详情</h3>
            {state.questionDetails.map((detail, index) => {
              const q = state.questions.find(q => q.id === detail.questionId);
              const p = q ? getPoemById(q.poemId) : null;
              return (
                <div
                  key={detail.questionId}
                  className={cn(
                    'p-3 rounded-lg text-left flex items-start gap-3',
                    detail.isCorrect ? 'bg-jade-50' : 'bg-cinnabar-50'
                  )}
                >
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                    detail.isCorrect ? 'bg-jade-300' : 'bg-cinnabar-300'
                  )}>
                    {detail.isCorrect ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-300">
                      {index + 1}. {p ? `《${p.title}》` : '题目'}
                    </p>
                    <p className="text-xs text-ink-100 mt-0.5">
                      {getQuestionTypeLabel(detail.type)}
                    </p>
                    {!detail.isCorrect && (
                      <p className="text-xs text-cinnabar-300 mt-1">
                        正确答案：{detail.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={restartQuiz}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              重新测试
            </button>
            <button
              onClick={() => navigate('/timeline')}
              className="btn-primary inline-flex items-center gap-2"
            >
              继续学习
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-ink-200">
            <Target className="w-4 h-4" />
            第 {state.currentIndex + 1} / {state.questions.length} 题
          </div>
          <span className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            getDifficultyColor(currentQuestion.difficulty)
          )}>
            {getDifficultyLabel(currentQuestion.difficulty)}
          </span>
        </div>
        <div className="h-2 bg-paper-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cinnabar-300 to-gold-300 transition-all duration-500"
            style={{ width: `${((state.currentIndex + 1) / state.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div
        className={cn(
          'card transition-all duration-300',
          shakeId === currentQuestion.id && 'animate-shake'
        )}
      >
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="stamp text-xs">
              {getQuestionTypeLabel(currentQuestion.type)}
            </span>
            {poem && (
              <span className="text-xs text-ink-100">
                出自：{poem.author}《{poem.title}》
              </span>
            )}
          </div>
          
          <h3 className="text-lg text-ink-300 leading-relaxed whitespace-pre-line">
            {currentQuestion.question}
          </h3>
        </div>

        {currentQuestion.type === 'fill_blank' ? (
          <div className="mb-6">
            <input
              type="text"
              value={fillBlankInput}
              onChange={(e) => setFillBlankInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFillBlankSubmit()}
              disabled={!!currentAnswer}
              placeholder="请输入答案..."
              className={cn(
                'w-full px-4 py-3 rounded-lg border-2 transition-all duration-300',
                'bg-paper-50 text-ink-300 placeholder-ink-100',
                'focus:outline-none focus:border-cobalt-300',
                currentAnswer && isCorrect && 'border-jade-300 bg-jade-50',
                currentAnswer && !isCorrect && 'border-cinnabar-300 bg-cinnabar-50'
              )}
            />
            {!currentAnswer && (
              <button
                onClick={handleFillBlankSubmit}
                disabled={!fillBlankInput.trim()}
                className="mt-3 btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交答案
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {currentQuestion.options?.map((option, index) => {
              const isSelected = currentAnswer === option;
              const isCorrectOption = option === currentQuestion.correctAnswer;
              
              let buttonClass = 'border-paper-300 bg-paper-50 hover:border-cobalt-200 hover:bg-cobalt-50';
              
              if (currentAnswer) {
                if (isCorrectOption) {
                  buttonClass = 'border-jade-300 bg-jade-50 text-jade-300';
                } else if (isSelected && !isCorrectOption) {
                  buttonClass = 'border-cinnabar-300 bg-cinnabar-50 text-cinnabar-300';
                } else {
                  buttonClass = 'border-paper-200 bg-paper-50/50 text-ink-100';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={!!currentAnswer}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 text-left transition-all duration-300',
                    'flex items-center gap-3',
                    buttonClass,
                    !currentAnswer && 'hover:shadow-md'
                  )}
                >
                  <span className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    currentAnswer && isCorrectOption ? 'bg-jade-300 text-white' :
                    currentAnswer && isSelected && !isCorrectOption ? 'bg-cinnabar-300 text-white' :
                    'bg-paper-200 text-ink-200'
                  )}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {currentAnswer && isCorrectOption && (
                    <Check className="w-5 h-5 text-jade-300" />
                  )}
                  {currentAnswer && isSelected && !isCorrectOption && (
                    <X className="w-5 h-5 text-cinnabar-300" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {showExplanation && (
          <div className={cn(
            'p-4 rounded-xl animate-fade-in-up',
            isCorrect ? 'bg-jade-50 border border-jade-100' : 'bg-cinnabar-50 border border-cinnabar-100'
          )}>
            <div className="flex items-start gap-3">
              <Lightbulb className={cn(
                'w-5 h-5 flex-shrink-0 mt-0.5',
                isCorrect ? 'text-jade-300' : 'text-cinnabar-300'
              )} />
              <div>
                <p className={cn(
                  'text-sm font-medium mb-2',
                  isCorrect ? 'text-jade-300' : 'text-cinnabar-300'
                )}>
                  {isCorrect ? '回答正确！' : '回答错误'}
                </p>
                <p className="text-sm text-ink-200 whitespace-pre-line leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {state.showResult && (
          <button
            onClick={nextQuestion}
            className="mt-6 btn-primary w-full inline-flex items-center justify-center gap-2"
          >
            {state.currentIndex < state.questions.length - 1 ? (
              <>
                下一题
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                查看结果
                <Award className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizModule;
