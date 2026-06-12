import { useNavigate } from 'react-router-dom';
import { History, BookOpen, Brain, Award, ChevronRight, ScrollText, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store';
import { getAllPoems } from '@/data';
import { cn } from '@/lib/utils';

const HomePage = () => {
  const navigate = useNavigate();
  const { userProgress, getRecommendedPoem } = useAppStore();
  
  const allPoems = getAllPoems();
  const recommendedPoem = getRecommendedPoem();
  const studiedCount = userProgress.totalPoemsStudied;
  const totalCount = allPoems.length;
  const accuracy = userProgress.averageAccuracy * 100;

  const features = [
    {
      icon: History,
      title: '时间轴地图',
      description: '纵览中华五千年历史，每个朝代对应代表性诗词与历史事件，一目了然。',
      path: '/timeline',
      color: 'from-cinnabar-300 to-cinnabar-400',
      bgColor: 'bg-cinnabar-50',
      textColor: 'text-cinnabar-300',
    },
    {
      icon: BookOpen,
      title: '学习卡片',
      description: '翻转卡片学习诗词，正面是诗词名句，背面解读历史背景、制度与社会风貌。',
      path: recommendedPoem ? `/card/${recommendedPoem.id}` : '/timeline',
      color: 'from-cobalt-300 to-cobalt-400',
      bgColor: 'bg-cobalt-50',
      textColor: 'text-cobalt-300',
    },
    {
      icon: Brain,
      title: '智能测试',
      description: '根据已学内容随机出题，多种题型检验学习成果，即时反馈答案解析。',
      path: '/quiz',
      color: 'from-jade-300 to-jade-400',
      bgColor: 'bg-jade-50',
      textColor: 'text-jade-300',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-paper-100 via-paper-50 to-paper-100" />
        <div className="absolute inset-0 bg-ink-wash opacity-50" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 text-gold-300 rounded-full text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              以诗证史 · 以史解诗
            </div>
            
            <h1 className="title-display text-5xl md:text-7xl text-ink-400 mb-6 leading-tight">
              诗史智学
            </h1>
            
            <p className="text-xl md:text-2xl text-ink-200 mb-8 leading-relaxed max-w-2xl mx-auto">
              读一首诗，懂一段史
              <br />
              <span className="text-ink-100 text-lg">
                通过中国诗词串联历史知识，让学习变得有趣高效
              </span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => navigate('/timeline')}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                <ScrollText className="w-5 h-5" />
                开始学习
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/quiz')}
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                <Brain className="w-5 h-5" />
                智能测试
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
              <div className="p-4 bg-paper-50/80 rounded-xl border border-paper-200">
                <div className="text-3xl font-bold text-cinnabar-300 mb-1">
                  {totalCount}
                </div>
                <div className="text-xs text-ink-100">首诗词</div>
              </div>
              <div className="p-4 bg-paper-50/80 rounded-xl border border-paper-200">
                <div className="text-3xl font-bold text-cobalt-300 mb-1">
                  {studiedCount}
                </div>
                <div className="text-xs text-ink-100">已学习</div>
              </div>
              <div className="p-4 bg-paper-50/80 rounded-xl border border-paper-200">
                <div className="text-3xl font-bold text-jade-300 mb-1">
                  {accuracy.toFixed(0)}%
                </div>
                <div className="text-xs text-ink-100">正确率</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="title-display text-3xl text-ink-400 text-center mb-12">
            探索功能
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                  onClick={() => navigate(feature.path)}
                >
                  <div className="card h-full hover:-translate-y-2 transition-all duration-300">
                    <div className={cn(
                      'w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br',
                      feature.color
                    )}>
                      <Icon className="w-8 h-8 text-paper-50" />
                    </div>
                    
                    <h3 className="title-display text-xl text-ink-400 mb-3">
                      {feature.title}
                    </h3>
                    
                    <p className="text-sm text-ink-200 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    
                    <div className={cn(
                      'inline-flex items-center gap-2 text-sm font-medium transition-colors',
                      feature.textColor
                    )}>
                      立即体验
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {recommendedPoem && (
        <section className="py-16 bg-paper-50/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="title-display text-3xl text-ink-400 text-center mb-8">
                今日推荐
              </h2>
              
              <div 
                className="card cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => navigate(`/card/${recommendedPoem.id}`)}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="stamp text-xs">推荐学习</span>
                      <span className="text-xs text-ink-100">
                        {recommendedPoem.author}
                      </span>
                    </div>
                    
                    <h3 className="title-display text-2xl text-ink-400 mb-4">
                      《{recommendedPoem.title}》
                    </h3>
                    
                    <p className="poem-text text-lg text-ink-300 mb-4">
                      {recommendedPoem.famousLine}
                    </p>
                    
                    <p className="text-sm text-ink-100 line-clamp-2">
                      {recommendedPoem.background}
                    </p>
                  </div>
                  
                  <div className="flex md:flex-col items-center justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-paper-200 md:pl-6">
                    <button className="btn-primary px-6 py-2 text-sm inline-flex items-center gap-2">
                      开始学习
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {userProgress.quizResults.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="title-display text-3xl text-ink-400 text-center mb-8">
                最近成绩
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...userProgress.quizResults].reverse().slice(0, 3).map((result, index) => {
                  const accuracy = (result.correctAnswers / result.totalQuestions) * 100;
                  return (
                    <div
                      key={result.id}
                      className="card animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-ink-100">
                          {new Date(result.date).toLocaleDateString('zh-CN')}
                        </span>
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          accuracy >= 80 ? 'bg-jade-100' :
                          accuracy >= 60 ? 'bg-gold-100' :
                          'bg-cinnabar-100'
                        )}>
                          <Award className={cn(
                            'w-5 h-5',
                            accuracy >= 80 ? 'text-jade-300' :
                            accuracy >= 60 ? 'text-gold-300' :
                            'text-cinnabar-300'
                          )} />
                        </div>
                      </div>
                      
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-ink-400 mb-1">
                          {result.correctAnswers}/{result.totalQuestions}
                        </div>
                        <div className="text-sm text-ink-100">
                          正确率 {accuracy.toFixed(0)}%
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
              
              <div className="text-center mt-8">
                <button
                  onClick={() => navigate('/progress')}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  查看全部记录
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
