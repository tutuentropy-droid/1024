import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Clock, Target, BookOpen, Heart, Check, ChevronRight, TrendingUp, Calendar, Trophy, Star, Zap } from 'lucide-react';
import { useAppStore } from '@/store';
import { getPoemById, getDynastyByPoemId, getAllPoems, getPoemsByDynastyId } from '@/data';
import { cn } from '@/lib/utils';

const RingChart = ({ percentage, size = 160, strokeWidth = 12, color = '#C41E3A' }: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8DFCE"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-ink-400">{percentage.toFixed(0)}%</span>
        <span className="text-xs text-ink-100">历史覆盖</span>
      </div>
    </div>
  );
};

const DynastyTrophy = ({ dynastyId, isCompleted, progress, total }: {
  dynastyId: string;
  isCompleted: boolean;
  progress: number;
  total: number;
}) => {
  const { dynasties } = useAppStore();
  const dynasty = dynasties.find(d => d.id === dynastyId);
  if (!dynasty) return null;

  const percentage = total > 0 ? (progress / total) * 100 : 0;

  return (
    <div className={cn(
      'relative p-4 rounded-xl border-2 transition-all duration-300',
      isCompleted
        ? 'bg-gradient-to-br from-gold-50 to-gold-100 border-gold-300 shadow-md'
        : percentage > 0
          ? 'bg-paper-50 border-paper-200'
          : 'bg-paper-50/60 border-paper-200/60'
    )}>
      {isCompleted && (
        <div className="absolute -top-2 -right-2">
          <div className="w-7 h-7 bg-gold-300 rounded-full flex items-center justify-center shadow-md">
            <Trophy className="w-4 h-4 text-paper-50" />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: dynasty.color }}
        />
        <span className="font-medium text-ink-300 text-sm">{dynasty.name}</span>
        {isCompleted && (
          <span className="stamp text-xs bg-gold-300 text-paper-50 border-gold-300" style={{ transform: 'rotate(-2deg)' }}>
            已完成
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-2 bg-paper-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${percentage}%`,
              backgroundColor: isCompleted ? '#DAA520' : dynasty.color,
            }}
          />
        </div>
        <span className="text-xs text-ink-100 flex-shrink-0">
          {progress}/{total}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {dynasty.famousPoets.slice(0, 3).map((poet, i) => (
          <span
            key={i}
            className="text-xs px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: `${dynasty.color}15`,
              color: dynasty.color,
            }}
          >
            {poet}
          </span>
        ))}
      </div>
    </div>
  );
};

const ProgressPage = () => {
  const navigate = useNavigate();
  const { userProgress, dynasties, getDynastyCompletionStats, markDynastyCompleted } = useAppStore();
  
  const allPoems = getAllPoems();
  const studiedPoems = Object.values(userProgress.poemProgress)
    .filter(p => p.isStudied)
    .map(p => ({ ...p, poem: getPoemById(p.poemId) }))
    .filter(p => p.poem);

  const favoritePoems = Object.values(userProgress.poemProgress)
    .filter(p => p.isFavorite)
    .map(p => ({ ...p, poem: getPoemById(p.poemId) }))
    .filter(p => p.poem);

  const totalStudied = studiedPoems.length;
  const totalPoems = allPoems.length;
  const progressPercent = totalPoems > 0 ? (totalStudied / totalPoems) * 100 : 0;

  const completionStats = getDynastyCompletionStats();

  const dynastyProgress = useMemo(() => {
    return dynasties.map(dynasty => {
      const dynastyPoems = getPoemsByDynastyId(dynasty.id);
      const studied = dynastyPoems.filter(p => userProgress.poemProgress[p.id]?.isStudied).length;
      const isComplete = studied === dynastyPoems.length && dynastyPoems.length > 0;
      return {
        dynastyId: dynasty.id,
        total: dynastyPoems.length,
        studied,
        isComplete,
      };
    });
  }, [dynasties, userProgress.poemProgress]);

  const stats = useMemo(() => {
    const results = userProgress.quizResults;
    if (results.length === 0) {
      return {
        totalQuizzes: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        averageAccuracy: 0,
        averageTime: 0,
      };
    }
    
    const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
    const totalCorrect = results.reduce((sum, r) => sum + r.correctAnswers, 0);
    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);
    
    return {
      totalQuizzes: results.length,
      totalQuestions,
      totalCorrect,
      averageAccuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
      averageTime: results.length > 0 ? totalTime / results.length : 0,
    };
  }, [userProgress.quizResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="title-display text-4xl text-ink-400 mb-4">
              学习仪表盘
            </h1>
            <p className="text-ink-200">
              查看你的学习进度和历史覆盖情况
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              <div className="w-12 h-12 mx-auto mb-3 bg-cinnabar-50 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-cinnabar-300" />
              </div>
              <div className="text-3xl font-bold text-ink-400 mb-1">
                {totalStudied}/{totalPoems}
              </div>
              <div className="text-xs text-ink-100">已学诗词</div>
            </div>
            
            <div className="card text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="w-12 h-12 mx-auto mb-3 bg-cobalt-50 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-cobalt-300" />
              </div>
              <div className="text-3xl font-bold text-ink-400 mb-1">
                {stats.totalQuizzes}
              </div>
              <div className="text-xs text-ink-100">测试次数</div>
            </div>
            
            <div className="card text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 mx-auto mb-3 bg-jade-50 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-jade-300" />
              </div>
              <div className="text-3xl font-bold text-ink-400 mb-1">
                {stats.averageAccuracy.toFixed(0)}%
              </div>
              <div className="text-xs text-ink-100">平均正确率</div>
            </div>
            
            <div className="card text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="w-12 h-12 mx-auto mb-3 bg-gold-50 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-gold-300" />
              </div>
              <div className="text-3xl font-bold text-ink-400 mb-1">
                {completionStats.completed}/{completionStats.total}
              </div>
              <div className="text-xs text-ink-100">完成朝代</div>
            </div>
          </div>

          <div className="card mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <h2 className="text-lg font-medium text-ink-300 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cinnabar-300" />
              历史覆盖概览
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <RingChart percentage={progressPercent} />
              <div className="flex-1 w-full">
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-ink-200">诗词学习进度</span>
                    <span className="text-ink-300 font-medium">{progressPercent.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-paper-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cinnabar-300 to-gold-300 transition-all duration-1000"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-ink-200">朝代完成度</span>
                    <span className="text-ink-300 font-medium">{completionStats.percentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 bg-paper-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-300 to-gold-400 transition-all duration-1000"
                      style={{ width: `${completionStats.percentage}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-ink-200">测试平均正确率</span>
                    <span className="text-ink-300 font-medium">{stats.averageAccuracy.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 bg-paper-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-jade-300 to-jade-400 transition-all duration-1000"
                      style={{ width: `${stats.averageAccuracy}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-ink-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-cinnabar-300" />
                    诗词
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-gold-300" />
                    朝代
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-jade-300" />
                    测试
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <h2 className="text-lg font-medium text-ink-300 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold-300" />
              朝代成就
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dynastyProgress.map((dp) => (
                <DynastyTrophy
                  key={dp.dynastyId}
                  dynastyId={dp.dynastyId}
                  isCompleted={dp.isComplete}
                  progress={dp.studied}
                  total={dp.total}
                />
              ))}
            </div>
          </div>

          {userProgress.dailyChallengeResults.length > 0 && (
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '550ms' }}>
              <h2 className="text-lg font-medium text-ink-300 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-gold-300" />
                每日挑战记录 ({userProgress.dailyChallengeResults.length})
              </h2>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (27 - i));
                  const dateStr = date.toISOString().split('T')[0];
                  const result = userProgress.dailyChallengeResults.find(r => r.date === dateStr);
                  return (
                    <div
                      key={dateStr}
                      className={cn(
                        'aspect-square rounded-md flex items-center justify-center',
                        result
                          ? result.isCorrect
                            ? 'bg-jade-300'
                            : 'bg-cinnabar-200'
                          : 'bg-paper-200'
                      )}
                      title={dateStr}
                    >
                      {result && (
                        result.isCorrect
                          ? <Star className="w-3 h-3 text-white" />
                          : <span className="text-xs text-cinnabar-400">✗</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="card mb-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <h2 className="text-lg font-medium text-ink-300 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cinnabar-300" />
              学习进度
            </h2>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-ink-200">整体进度</span>
              <span className="text-ink-300 font-medium">{progressPercent.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-paper-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cinnabar-300 to-gold-300 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {studiedPoems.length > 0 && (
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
              <h2 className="text-lg font-medium text-ink-300 mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-jade-300" />
                已学诗词 ({studiedPoems.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {studiedPoems.map((item, index) => {
                  const dynasty = item.poem ? getDynastyByPoemId(item.poem.id) : null;
                  return (
                    <div
                      key={item.poemId}
                      className="p-4 bg-paper-50 rounded-xl border border-paper-200 hover:border-cobalt-200 transition-colors cursor-pointer"
                      onClick={() => navigate(`/card/${item.poemId}`)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-kai text-ink-300">
                            《{item.poem?.title}》
                          </h3>
                          <p className="text-xs text-ink-100">
                            {item.poem?.author} · {dynasty?.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {item.isFavorite && (
                            <Heart className="w-4 h-4 text-cinnabar-300 fill-current" />
                          )}
                          <Check className="w-4 h-4 text-jade-300" />
                        </div>
                      </div>
                      <p className="text-xs text-ink-100">
                        学习 {item.studyCount} 次 · 最后学习 {formatDate(item.lastStudyTime)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {favoritePoems.length > 0 && (
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
              <h2 className="text-lg font-medium text-ink-300 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-cinnabar-300" />
                我的收藏 ({favoritePoems.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {favoritePoems.map((item) => {
                  const dynasty = item.poem ? getDynastyByPoemId(item.poem.id) : null;
                  return (
                    <div
                      key={item.poemId}
                      className="p-4 bg-cinnabar-50/50 rounded-xl border border-cinnabar-100 hover:border-cinnabar-200 transition-colors cursor-pointer"
                      onClick={() => navigate(`/card/${item.poemId}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-kai text-ink-300">
                            《{item.poem?.title}》
                          </h3>
                          <p className="text-xs text-ink-100">
                            {item.poem?.author} · {dynasty?.name}
                          </p>
                        </div>
                        <Heart className="w-4 h-4 text-cinnabar-300 fill-current" />
                      </div>
                      <p className="text-sm text-ink-200 line-clamp-1">
                        {item.poem?.famousLine}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {userProgress.quizResults.length > 0 && (
            <div className="animate-fade-in-up" style={{ animationDelay: '900ms' }}>
              <h2 className="text-lg font-medium text-ink-300 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cobalt-300" />
                测试记录
              </h2>
              <div className="space-y-3">
                {[...userProgress.quizResults].reverse().map((result, index) => {
                  const accuracy = (result.correctAnswers / result.totalQuestions) * 100;
                  return (
                    <div
                      key={result.id}
                      className="card hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center',
                            accuracy >= 80 ? 'bg-jade-100' :
                            accuracy >= 60 ? 'bg-gold-100' :
                            'bg-cinnabar-100'
                          )}>
                            <Award className={cn(
                              'w-6 h-6',
                              accuracy >= 80 ? 'text-jade-300' :
                              accuracy >= 60 ? 'text-gold-300' :
                              'text-cinnabar-300'
                            )} />
                          </div>
                          <div>
                            <p className="font-medium text-ink-300">
                              第 {userProgress.quizResults.length - index} 次测试
                            </p>
                            <p className="text-xs text-ink-100">
                              {formatDate(result.date)} · 用时 {formatTime(result.timeSpent)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-ink-400">
                            {result.correctAnswers}/{result.totalQuestions}
                          </p>
                          <p className="text-xs text-ink-100">
                            正确率 {accuracy.toFixed(0)}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="h-2 bg-paper-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all duration-500',
                            accuracy >= 80 ? 'bg-gradient-to-r from-jade-300 to-jade-400' :
                            accuracy >= 60 ? 'bg-gradient-to-r from-gold-300 to-gold-400' :
                            'bg-gradient-to-r from-cinnabar-300 to-cinnabar-400'
                          )}
                          style={{ width: `${accuracy}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {studiedPoems.length === 0 && userProgress.quizResults.length === 0 && (
            <div className="card text-center py-16 animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-6 bg-paper-200 rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-ink-100" />
              </div>
              <h3 className="title-display text-xl text-ink-300 mb-2">
                还没有学习记录
              </h3>
              <p className="text-ink-100 mb-6 max-w-sm mx-auto">
                开始你的诗词历史学习之旅吧！从时间轴开始，探索每个朝代的诗词文化。
              </p>
              <button
                onClick={() => navigate('/timeline')}
                className="btn-primary inline-flex items-center gap-2"
              >
                开始学习
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
