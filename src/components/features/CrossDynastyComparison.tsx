import { useState } from 'react';
import { GitCompare, X, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getDynastyById } from '@/data';
import type { DynastyComparison } from '@/types';

const CrossDynastyComparison = () => {
  const { comparisons } = useAppStore();
  const [selectedComparison, setSelectedComparison] = useState<DynastyComparison | null>(null);
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

  const dynastyA = selectedComparison ? getDynastyById(selectedComparison.dynastyAId) : null;
  const dynastyB = selectedComparison ? getDynastyById(selectedComparison.dynastyBId) : null;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cobalt-50 text-cobalt-300 rounded-full text-sm mb-6">
              <GitCompare className="w-4 h-4" />
              跨朝代对比
            </div>
            <h1 className="title-display text-4xl text-ink-400 mb-4">
              跨朝代对比
            </h1>
            <p className="text-ink-200 max-w-2xl mx-auto">
              不同朝代之间诗词意象的异同，揭示历史变迁中的文化密码
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {comparisons.map((comparison, index) => {
              const dynA = getDynastyById(comparison.dynastyAId);
              const dynB = getDynastyById(comparison.dynastyBId);
              if (!dynA || !dynB) return null;

              return (
                <div
                  key={comparison.id}
                  className={cn(
                    'card cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up',
                    selectedComparison?.id === comparison.id && 'ring-2 ring-cobalt-300/50'
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedComparison(comparison)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: dynA.color }}
                    />
                    <span className="text-ink-200">vs</span>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: dynB.color }}
                    />
                  </div>

                  <h3 className="title-display text-lg text-ink-400 mb-2">
                    {comparison.title}
                  </h3>

                  <p className="text-sm text-ink-200 leading-relaxed mb-4 line-clamp-2">
                    {comparison.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${dynA.color}15`, color: dynA.color }}
                      >
                        {dynA.name}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${dynB.color}15`, color: dynB.color }}
                      >
                        {dynB.name}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-100" />
                  </div>
                </div>
              );
            })}
          </div>

          {selectedComparison && dynastyA && dynastyB && (
            <div className="card animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: dynastyA.color }}
                    />
                    <span className="font-medium text-ink-300">{dynastyA.name}</span>
                  </div>
                  <span className="text-ink-100 text-lg">↔</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: dynastyB.color }}
                    />
                    <span className="font-medium text-ink-300">{dynastyB.name}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedComparison(null)}
                  className="p-2 rounded-lg bg-paper-200 text-ink-200 hover:bg-paper-300 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h2 className="title-display text-2xl text-ink-400 mb-3">
                {selectedComparison.title}
              </h2>
              <p className="text-sm text-ink-200 mb-6 leading-relaxed">
                {selectedComparison.description}
              </p>

              <div className="space-y-3">
                {selectedComparison.dimensions.map((dim, index) => {
                  const isExpanded = expandedDimension === dim.dimension;
                  return (
                    <div
                      key={index}
                      className={cn(
                        'rounded-xl border transition-all duration-300',
                        isExpanded ? 'border-cobalt-200 bg-cobalt-50/30' : 'border-paper-200 bg-paper-50'
                      )}
                    >
                      <button
                        className="w-full px-4 py-3 flex items-center justify-between text-left"
                        onClick={() => setExpandedDimension(isExpanded ? null : dim.dimension)}
                      >
                        <span className="font-medium text-ink-300 text-sm">
                          {dim.dimension}
                        </span>
                        <ChevronRight
                          className={cn(
                            'w-4 h-4 text-ink-100 transition-transform duration-300',
                            isExpanded && 'rotate-90'
                          )}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 animate-fade-in-up">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                              className="p-4 rounded-lg border-l-4"
                              style={{ borderColor: dynastyA.color, backgroundColor: `${dynastyA.color}08` }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ backgroundColor: dynastyA.color }}
                                />
                                <span
                                  className="text-xs font-medium"
                                  style={{ color: dynastyA.color }}
                                >
                                  {dynastyA.name}
                                </span>
                              </div>
                              <p className="text-sm text-ink-300 leading-relaxed">
                                {dim.dynastyAValue}
                              </p>
                            </div>

                            <div
                              className="p-4 rounded-lg border-l-4"
                              style={{ borderColor: dynastyB.color, backgroundColor: `${dynastyB.color}08` }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ backgroundColor: dynastyB.color }}
                                />
                                <span
                                  className="text-xs font-medium"
                                  style={{ color: dynastyB.color }}
                                >
                                  {dynastyB.name}
                                </span>
                              </div>
                              <p className="text-sm text-ink-300 leading-relaxed">
                                {dim.dynastyBValue}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-gold-50/50 rounded-xl border border-gold-100">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-gold-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gold-400 mb-1">对比结论</p>
                    <p className="text-sm text-ink-300 leading-relaxed">
                      {selectedComparison.conclusion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrossDynastyComparison;
