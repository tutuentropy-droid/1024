import { useState, useMemo } from 'react';
import { Puzzle, Users, Trophy, Check, X, Zap, Crown } from 'lucide-react';
import { useAppStore } from '@/store';
import { getDynastyById } from '@/data';
import { cn } from '@/lib/utils';

const pieceTypeColors: Record<string, string> = {
  event: 'bg-amber-100 text-amber-700 border-amber-300',
  poet: 'bg-rose-100 text-rose-700 border-rose-300',
  poem: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  achievement: 'bg-purple-100 text-purple-700 border-purple-300',
};

const pieceTypeLabels: Record<string, string> = {
  event: '历史事件',
  poet: '代表诗人',
  poem: '经典诗句',
  achievement: '朝代成就',
};

const DynastyPuzzle = () => {
  const { 
    dynasties, 
    puzzles, 
    currentPuzzleId, 
    studyGroup,
    startPuzzle, 
    placePuzzlePiece,
    completePuzzle,
    generatePoster,
    selectPoster
  } = useAppStore();

  const [selectedDynastyId, setSelectedDynastyId] = useState<string>('tang');
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentPuzzle = useMemo(() => 
    puzzles.find(p => p.id === currentPuzzleId),
    [puzzles, currentPuzzleId]
  );

  const selectedDynasty = useMemo(() => 
    getDynastyById(selectedDynastyId),
    [selectedDynastyId]
  );

  const progress = useMemo(() => {
    if (!currentPuzzle) return 0;
    const placed = currentPuzzle.pieces.filter(p => p.isPlaced).length;
    return (placed / currentPuzzle.totalPieces) * 100;
  }, [currentPuzzle]);

  const handleStartPuzzle = () => {
    startPuzzle(selectedDynastyId);
  };

  const handleDragStart = (pieceId: string) => {
    setDraggedPiece(pieceId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (pieceId: string) => {
    if (draggedPiece && currentPuzzle && draggedPiece === pieceId) {
      placePuzzlePiece(currentPuzzle.id, pieceId, 'user-1');
      
      const puzzle = puzzles.find(p => p.id === currentPuzzleId);
      if (puzzle) {
        const placed = puzzle.pieces.filter(p => p.isPlaced).length;
        if (placed === puzzle.totalPieces - 1) {
          setTimeout(() => {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
          }, 500);
        }
      }
    }
    setDraggedPiece(null);
  };

  const handlePlacePiece = (pieceId: string) => {
    if (currentPuzzle) {
      placePuzzlePiece(currentPuzzle.id, pieceId, 'user-1');
      
      const puzzle = puzzles.find(p => p.id === currentPuzzleId);
      if (puzzle) {
        const placed = puzzle.pieces.filter(p => p.isPlaced).length;
        if (placed === puzzle.totalPieces - 1) {
          setTimeout(() => {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
          }, 500);
        }
      }
    }
  };

  const handleCompleteAndGeneratePoster = () => {
    if (currentPuzzle) {
      completePuzzle(currentPuzzle.id);
      generatePoster(currentPuzzle.dynastyId);
    }
  };

  const unplacedPieces = currentPuzzle?.pieces.filter(p => !p.isPlaced) || [];
  const placedPieces = currentPuzzle?.pieces.filter(p => p.isPlaced) || [];

  const getMemberById = (memberId: string) => {
    return studyGroup?.members.find(m => m.id === memberId);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm mb-4">
              <Puzzle className="w-4 h-4" />
              朝代拼图
            </div>
            <h1 className="title-display text-4xl text-ink-400 mb-3">
              共拼诗史 · 同筑华章
            </h1>
            <p className="text-ink-200 max-w-xl mx-auto">
              与小组成员协作，将散落的历史碎片拼成完整的朝代画卷
            </p>
          </div>

          {studyGroup && (
            <div className="card mb-6 animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="title-display text-lg text-ink-400 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cinnabar-300" />
                  {studyGroup.name}
                </h3>
                <span className="text-sm text-ink-100">
                  已完成 {studyGroup.completedPuzzles.length} 个拼图
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {studyGroup.members.map(member => (
                  <div 
                    key={member.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-paper-100"
                  >
                    <div className="relative">
                      <span className="text-xl">{member.avatar}</span>
                      {member.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-jade-400 rounded-full border-2 border-paper-50" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-300">{member.name}</p>
                      <p className="text-xs text-ink-100 flex items-center gap-1">
                        <Crown className="w-3 h-3 text-gold-400" />
                        {member.contribution} 贡献
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!currentPuzzle && (
            <div className="animate-fade-in-up">
              <div className="card mb-6">
                <h3 className="title-display text-lg text-ink-400 mb-4">
                  选择朝代开始拼图
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {dynasties.map(dynasty => (
                    <button
                      key={dynasty.id}
                      onClick={() => setSelectedDynastyId(dynasty.id)}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all duration-300 text-center',
                        selectedDynastyId === dynasty.id
                          ? 'border-cinnabar-300 bg-cinnabar-50'
                          : 'border-paper-200 bg-paper-50 hover:border-paper-300'
                      )}
                    >
                      <div 
                        className="w-8 h-8 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: dynasty.color }}
                      />
                      <p className="text-sm font-medium text-ink-300">{dynasty.name}</p>
                      <p className="text-xs text-ink-100 mt-1">
                        {dynasty.famousPoets.slice(0, 2).join('、')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDynasty && (
                <div className="card">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
                      style={{ backgroundColor: selectedDynasty.color + '20' }}
                    >
                      {selectedDynasty.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="title-display text-xl text-ink-400 mb-2">
                        {selectedDynasty.name}
                      </h4>
                      <p className="text-sm text-ink-200 mb-4">
                        {selectedDynasty.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedDynasty.famousPoets.map((poet, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 text-xs rounded-full"
                            style={{ 
                              backgroundColor: selectedDynasty.color + '15', 
                              color: selectedDynasty.color 
                            }}
                          >
                            {poet}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={handleStartPuzzle}
                        className="btn-primary inline-flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        开始拼图挑战
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentPuzzle && (
            <div className="animate-fade-in-up">
              <div className="card mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="title-display text-lg text-ink-400">
                      {currentPuzzle.name}
                    </h3>
                    <p className="text-sm text-ink-100">
                      已放置 {placedPieces.length}/{currentPuzzle.totalPieces} 块
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32">
                      <div className="h-2 bg-paper-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-purple-600">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div 
                  className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 p-4 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/30"
                  onDragOver={handleDragOver}
                >
                  {currentPuzzle.pieces.map((piece, index) => {
                    const placedBy = piece.placedBy ? getMemberById(piece.placedBy) : null;
                    return (
                      <div
                        key={piece.id}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(piece.id)}
                        onClick={() => !piece.isPlaced && handlePlacePiece(piece.id)}
                        className={cn(
                          'relative p-4 rounded-xl border-2 transition-all duration-300',
                          piece.isPlaced
                            ? cn(pieceTypeColors[piece.type], 'cursor-default')
                            : cn(
                                'bg-paper-50 border-paper-200 cursor-pointer hover:border-purple-400 hover:bg-purple-50',
                                draggedPiece === piece.id && 'ring-2 ring-purple-400 ring-offset-2'
                              ),
                          'animate-fade-in-up'
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {piece.isPlaced && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-jade-400 rounded-full flex items-center justify-center shadow-md">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <span className={cn(
                            'px-2 py-0.5 text-xs rounded-full flex-shrink-0',
                            piece.isPlaced ? 'bg-white/50' : 'bg-paper-200 text-ink-200'
                          )}>
                            {pieceTypeLabels[piece.type]}
                          </span>
                        </div>
                        <p className={cn(
                          'mt-2 text-sm font-medium',
                          piece.isPlaced ? '' : 'text-ink-300'
                        )}>
                          {piece.content}
                        </p>
                        {placedBy && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className="text-sm">{placedBy.avatar}</span>
                            <span className="text-xs opacity-75">{placedBy.name} 放置</span>
                          </div>
                        )}
                        {!piece.isPlaced && (
                          <p className="mt-2 text-xs text-ink-100">
                            点击放置或拖拽到拼图区
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {unplacedPieces.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-ink-200 mb-3 flex items-center gap-2">
                      <Puzzle className="w-4 h-4" />
                      待放置碎片（{unplacedPieces.length}）
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {unplacedPieces.map(piece => (
                        <div
                          key={piece.id}
                          draggable
                          onDragStart={() => handleDragStart(piece.id)}
                          onDragEnd={() => setDraggedPiece(null)}
                          onClick={() => handlePlacePiece(piece.id)}
                          className={cn(
                            'px-3 py-2 rounded-lg border cursor-move transition-all duration-200',
                            'bg-paper-50 border-paper-200 hover:border-purple-400 hover:shadow-md',
                            draggedPiece === piece.id && 'opacity-50 scale-105'
                          )}
                        >
                          <span className="text-xs text-ink-100 mr-2">
                            {pieceTypeLabels[piece.type]}
                          </span>
                          <span className="text-sm text-ink-300">{piece.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentPuzzle.isCompleted && (
                  <div className="mt-6 pt-6 border-t border-paper-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-gold-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-ink-400">拼图完成！</h4>
                          <p className="text-sm text-ink-100">
                            小组协作成功完成{currentPuzzle.name}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleCompleteAndGeneratePoster}
                        className="btn-primary inline-flex items-center gap-2"
                      >
                        生成知识海报
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => selectPoster(null)}
                  className="px-4 py-2 text-ink-200 hover:text-ink-300 transition-colors"
                >
                  返回选择朝代
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="title-display text-3xl text-gold-500 drop-shadow-lg">
              恭喜完成拼图！
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynastyPuzzle;
