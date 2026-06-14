import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  AppStore, UserProgress, QuizResult, Poem, DailyChallengeResult,
  VirtualPoet, SocialPost, ChatMessage, Puzzle, Poster, Almanac,
  NoteItem, WrongQuestion, PoemQuote, StudyGroup, PuzzlePiece,
  AIImage, AudioTheaterProgress, AdventureProgress, AdventureScene,
  VoiceLearnCard, WrongQuestionGroup
} from '@/types';
import { 
  dynasties, poems, events, getPoemById, getAllDynasties, 
  getPoemsByDynastyId, getSubPeriodsByDynastyId, 
  getPoemsBySubPeriodId, getPoemsByDifficulty, subPeriods,
  getAllSubPeriods, comparisons, generateDailyChallengeData,
  virtualPoets, socialPosts, getVirtualPoetById,
  getAllAudioTheaters, getAudioTheaterById, getAllAdventures, getAdventureById,
  getAllGeoLocations, getGeoLocationsByDynastyId
} from '@/data';

const initialUserProgress: UserProgress = {
  id: 'user-1',
  lastStudyTime: 0,
  totalPoemsStudied: 0,
  totalQuizzesTaken: 0,
  averageAccuracy: 0,
  poemProgress: {},
  quizResults: [],
  currentDifficulty: 'easy',
  poemOrderPreference: [],
  subPeriodProgress: {},
  completedDynasties: [],
  dailyChallengeResults: [],
};

const initialStudyGroup: StudyGroup = {
  id: 'group-1',
  name: '诗史共学小组',
  members: [
    { id: 'user-1', name: '我', avatar: '👤', contribution: 0, isOnline: true, lastActive: Date.now() },
    { id: 'member-1', name: '诗友小明', avatar: '🧑', contribution: 3, isOnline: true, lastActive: Date.now() },
    { id: 'member-2', name: '词客小红', avatar: '👩', contribution: 5, isOnline: false, lastActive: Date.now() - 3600000 },
    { id: 'member-3', name: '史学者阿华', avatar: '👨', contribution: 2, isOnline: true, lastActive: Date.now() },
    { id: 'member-4', name: '文青小雅', avatar: '👧', contribution: 4, isOnline: false, lastActive: Date.now() - 7200000 },
  ],
  currentPuzzleId: null,
  completedPuzzles: [],
  createdAt: Date.now(),
};

const generateAIRResponse = (poet: VirtualPoet, userMessage: string): string => {
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('介绍') || lowerMsg.includes('你是谁') || lowerMsg.includes('自我介绍')) {
    return `某乃${poet.name}，字${poet.styleName.includes('居士') ? '' : '子美'}。${poet.bio.slice(0, 80)}。\n\n不知阁下欲与吾谈诗论道，还是询问生平？`;
  }
  
  if (lowerMsg.includes('时代') || lowerMsg.includes('背景') || lowerMsg.includes('朝代')) {
    const dynasty = dynasties.find(d => d.id === poet.dynastyId);
    return `吾生于${dynasty?.name || '那个'}时代，${dynasty?.description.slice(0, 60)}。\n\n彼时${poet.personality.slice(0, 40)}，故吾诗文中多有此时代之印记。`;
  }
  
  if (lowerMsg.includes('诗') || lowerMsg.includes('作品') || lowerMsg.includes('名句')) {
    const work = poet.famousWorks[Math.floor(Math.random() * poet.famousWorks.length)];
    const catchphrase = poet.catchphrases[Math.floor(Math.random() * poet.catchphrases.length)];
    return `吾之诗作，以${work}为代表。其中「${catchphrase}」一句，最为世人传诵。\n\n不知阁下钟爱吾哪首诗作？`;
  }
  
  if (lowerMsg.includes('杜甫') || lowerMsg.includes('子美')) {
    return `子美乃吾挚友！其诗沉郁顿挫，忧国忧民，实乃诗中圣哲。「安得广厦千万间，大庇天下寒士俱欢颜」，真乃仁人心声！`;
  }
  
  if (lowerMsg.includes('苏轼') || lowerMsg.includes('东坡')) {
    return `苏子瞻才情横溢，豁达乐观，虽屡遭贬谪而不改其志。「但愿人长久，千里共婵娟」，真乃千古绝唱！`;
  }
  
  if (lowerMsg.includes('朋友') || lowerMsg.includes('交友') || lowerMsg.includes('友人')) {
    return `吾生平交友广泛，与子美、摩诘、乐天等皆为好友。闲暇时，我们常把酒言欢，吟诗作文，好不惬意！`;
  }
  
  if (lowerMsg.includes('酒') || lowerMsg.includes('饮') || lowerMsg.includes('醉')) {
    return `「人生得意须尽欢，莫使金樽空对月！」酒乃吾诗中之友，醉时文思泉涌，佳句迭出。「举杯邀明月，对影成三人」，此乃吾独酌之乐也！`;
  }
  
  const randomCatchphrase = poet.catchphrases[Math.floor(Math.random() * poet.catchphrases.length)];
  
  const responses = [
    `阁下所言甚是！某以为，「${randomCatchphrase}」。不知阁下以为然否？`,
    `此问甚妙！某常言：「${randomCatchphrase}」。人生天地间，当有此等胸襟！`,
    `哈哈，与阁下言谈甚欢！某有一言相赠：「${randomCatchphrase}」。愿与君共勉！`,
    `读万卷书，行万里路。某平生游历四方，所见所闻，尽付诗文。「${randomCatchphrase}」，此乃某之心得也！`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      dynasties: getAllDynasties(),
      poems: poems,
      events: events,
      subPeriods: getAllSubPeriods(),
      comparisons: comparisons,
      userProgress: initialUserProgress,
      selectedDynastyId: null,
      selectedPoemId: null,
      dailyChallenge: null,
      virtualPoets: virtualPoets,
      socialPosts: socialPosts,
      chatMessages: {},
      selectedPoetId: null,
      puzzles: [],
      currentPuzzleId: null,
      posters: [],
      currentPosterId: null,
      almanacs: [],
      notes: [],
      wrongQuestions: [],
      poemQuotes: [],
      studyGroup: initialStudyGroup,
      aiImages: [],
      currentGeneratingImage: false,
      audioTheaters: getAllAudioTheaters(),
      audioTheaterProgress: {},
      currentAudioTheaterId: null,
      adventures: getAllAdventures(),
      currentAdventure: null,
      selectedAdventureId: null,
      geoLocations: getAllGeoLocations(),
      selectedMapLocationId: null,
      voiceLearnSession: null,

      selectDynasty: (id: string | null) => {
        set({ selectedDynastyId: id });
        if (id) {
          const dynastyPoems = getPoemsByDynastyId(id);
          if (dynastyPoems.length > 0 && !get().selectedPoemId) {
            set({ selectedPoemId: dynastyPoems[0].id });
          }
        }
      },

      selectPoem: (id: string | null) => {
        set({ selectedPoemId: id });
      },

      markPoemAsStudied: (poemId: string) => {
        set((state) => {
          const existingProgress = state.userProgress.poemProgress[poemId];
          const now = Date.now();
          
          const newPoemProgress = {
            ...state.userProgress.poemProgress,
            [poemId]: {
              poemId,
              isStudied: true,
              isFavorite: existingProgress?.isFavorite || false,
              studyCount: (existingProgress?.studyCount || 0) + 1,
              lastStudyTime: now,
              correctCount: existingProgress?.correctCount || 0,
              wrongCount: existingProgress?.wrongCount || 0,
            },
          };

          const studiedCount = Object.values(newPoemProgress).filter(p => p.isStudied).length;

          return {
            userProgress: {
              ...state.userProgress,
              lastStudyTime: now,
              totalPoemsStudied: studiedCount,
              poemProgress: newPoemProgress,
            },
          };
        });
      },

      toggleFavorite: (poemId: string) => {
        set((state) => {
          const existingProgress = state.userProgress.poemProgress[poemId];
          const now = Date.now();

          return {
            userProgress: {
              ...state.userProgress,
              poemProgress: {
                ...state.userProgress.poemProgress,
                [poemId]: {
                  poemId,
                  isStudied: existingProgress?.isStudied || false,
                  isFavorite: !existingProgress?.isFavorite,
                  studyCount: existingProgress?.studyCount || 0,
                  lastStudyTime: existingProgress?.lastStudyTime || now,
                  correctCount: existingProgress?.correctCount || 0,
                  wrongCount: existingProgress?.wrongCount || 0,
                },
              },
            },
          };
        });
      },

      recordPoemAnswer: (poemId: string, isCorrect: boolean) => {
        set((state) => {
          const existingProgress = state.userProgress.poemProgress[poemId];
          const now = Date.now();

          return {
            userProgress: {
              ...state.userProgress,
              poemProgress: {
                ...state.userProgress.poemProgress,
                [poemId]: {
                  poemId,
                  isStudied: existingProgress?.isStudied || true,
                  isFavorite: existingProgress?.isFavorite || false,
                  studyCount: existingProgress?.studyCount || 1,
                  lastStudyTime: now,
                  correctCount: (existingProgress?.correctCount || 0) + (isCorrect ? 1 : 0),
                  wrongCount: (existingProgress?.wrongCount || 0) + (isCorrect ? 0 : 1),
                },
              },
            },
          };
        });
      },

      saveQuizResult: (result: Omit<QuizResult, 'id' | 'date'>) => {
        set((state) => {
          const newResult: QuizResult = {
            ...result,
            id: `quiz-${Date.now()}`,
            date: Date.now(),
          };

          const allResults = [...state.userProgress.quizResults, newResult];
          const totalCorrect = allResults.reduce((sum, r) => sum + r.correctAnswers, 0);
          const totalQuestions = allResults.reduce((sum, r) => sum + r.totalQuestions, 0);
          const averageAccuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;

          const newDifficulty = state.adjustDifficulty(averageAccuracy);

          result.questionDetails.forEach(detail => {
            if (!detail.isCorrect) {
              const poem = getPoemById(detail.poemId);
              const wrongQ: WrongQuestion = {
                id: `wrong-${Date.now()}-${detail.questionId}`,
                questionId: detail.questionId,
                poemId: detail.poemId,
                question: detail.questionId,
                userAnswer: detail.userAnswer,
                correctAnswer: detail.correctAnswer,
                dynastyId: poem?.dynastyId || '',
                createdAt: Date.now(),
              };
              state.wrongQuestions.push(wrongQ);
            }
          });

          return {
            userProgress: {
              ...state.userProgress,
              totalQuizzesTaken: state.userProgress.totalQuizzesTaken + 1,
              averageAccuracy,
              quizResults: allResults,
              currentDifficulty: newDifficulty,
            },
            wrongQuestions: [...state.wrongQuestions],
          };
        });
      },

      adjustDifficulty: (accuracy: number): 'easy' | 'medium' | 'hard' => {
        if (accuracy >= 0.85) return 'hard';
        if (accuracy >= 0.6) return 'medium';
        return 'easy';
      },

      getStudiedPoemIds: () => {
        const state = get();
        return Object.values(state.userProgress.poemProgress)
          .filter(p => p.isStudied)
          .map(p => p.poemId);
      },

      getRecommendedPoem: () => {
        const state = get();
        const orderedPoems = state.getOrderedPoems();
        const studiedIds = state.getStudiedPoemIds();
        const unstudiedPoems = orderedPoems.filter(p => !studiedIds.includes(p.id));
        
        if (unstudiedPoems.length === 0) {
          return orderedPoems[0] || null;
        }
        
        return unstudiedPoems[0];
      },

      getOrderedPoems: (): Poem[] => {
        const state = get();
        const currentDifficulty = state.userProgress.currentDifficulty;
        const allPoems = [...state.poems];
        
        const difficultyOrder: Record<string, number> = {
          easy: 0,
          medium: 1,
          hard: 2,
        };

        const userPreference = state.userProgress.poemOrderPreference;
        
        if (userPreference.length > 0) {
          const preferredPoems = userPreference
            .map(id => allPoems.find(p => p.id === id))
            .filter((p): p is Poem => p !== undefined);
          const otherPoems = allPoems.filter(p => !userPreference.includes(p.id));
          return [...preferredPoems, ...otherPoems];
        }

        return allPoems.sort((a, b) => {
          const aDifficulty = difficultyOrder[a.difficulty] || 1;
          const bDifficulty = difficultyOrder[b.difficulty] || 1;
          const currentDiffOrder = difficultyOrder[currentDifficulty] || 1;
          
          const aDiff = Math.abs(aDifficulty - currentDiffOrder);
          const bDiff = Math.abs(bDifficulty - currentDiffOrder);
          
          if (aDiff !== bDiff) return aDiff - bDiff;
          return aDifficulty - bDifficulty;
        });
      },

      getSubPeriodsByDynastyId: (dynastyId: string) => {
        return getSubPeriodsByDynastyId(dynastyId);
      },

      getPoemsBySubPeriodId: (subPeriodId: string) => {
        return getPoemsBySubPeriodId(subPeriodId);
      },

      markDynastyCompleted: (dynastyId: string) => {
        set((state) => {
          if (state.userProgress.completedDynasties.includes(dynastyId)) return state;
          return {
            userProgress: {
              ...state.userProgress,
              completedDynasties: [...state.userProgress.completedDynasties, dynastyId],
            },
          };
        });
      },

      saveDailyChallengeResult: (result: DailyChallengeResult) => {
        set((state) => {
          const existing = state.userProgress.dailyChallengeResults.find(r => r.date === result.date);
          if (existing) return state;
          return {
            userProgress: {
              ...state.userProgress,
              dailyChallengeResults: [...state.userProgress.dailyChallengeResults, result],
            },
          };
        });
      },

      generateDailyChallenge: () => {
        const challenge = generateDailyChallengeData();
        set({ dailyChallenge: challenge });
      },

      getDynastyCompletionStats: () => {
        const state = get();
        const allDynastyIds = state.dynasties.map(d => d.id);
        const completed = state.userProgress.completedDynasties.length;
        const total = allDynastyIds.length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        return { completed, total, percentage };
      },

      selectPoet: (poetId: string | null) => {
        set({ selectedPoetId: poetId });
        
        if (poetId) {
          const state = get();
          const existingMessages = state.chatMessages[poetId];
          if (!existingMessages || existingMessages.length === 0) {
            const poet = getVirtualPoetById(poetId);
            if (poet) {
              const greeting: ChatMessage = {
                id: `msg-${Date.now()}`,
                content: `某乃${poet.name}，字${poet.styleName}。不知阁下来访，有何见教？`,
                isUser: false,
                timestamp: Date.now(),
              };
              set({
                chatMessages: {
                  ...state.chatMessages,
                  [poetId]: [greeting],
                },
              });
            }
          }
        }
      },

      likeSocialPost: (postId: string) => {
        set((state) => {
          const updatedPosts = state.socialPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                likedByUser: !post.likedByUser,
                likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
              };
            }
            return post;
          });
          return { socialPosts: updatedPosts };
        });
      },

      commentSocialPost: (postId: string, poetId: string, content: string) => {
        set((state) => {
          const updatedPosts = state.socialPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: `comment-${Date.now()}`,
                    poetId,
                    content,
                    timestamp: Date.now(),
                  },
                ],
              };
            }
            return post;
          });
          return { socialPosts: updatedPosts };
        });
      },

      sendChatMessage: (poetId: string, content: string) => {
        set((state) => {
          const userMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            content,
            isUser: true,
            timestamp: Date.now(),
          };

          const existingMessages = state.chatMessages[poetId] || [];
          const updatedMessages = [...existingMessages, userMessage];

          const poet = getVirtualPoetById(poetId);
          if (poet) {
            setTimeout(() => {
              const aiResponse = generateAIRResponse(poet, content);
              const aiMessage: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                content: aiResponse,
                isUser: false,
                timestamp: Date.now(),
              };
              
              set((state) => ({
                chatMessages: {
                  ...state.chatMessages,
                  [poetId]: [...(state.chatMessages[poetId] || []), aiMessage],
                },
              }));
            }, 1000 + Math.random() * 1000);
          }

          return {
            chatMessages: {
              ...state.chatMessages,
              [poetId]: updatedMessages,
            },
          };
        });
      },

      startPuzzle: (dynastyId: string) => {
        set((state) => {
          const dynasty = state.dynasties.find(d => d.id === dynastyId);
          if (!dynasty) return state;

          const existingPuzzle = state.puzzles.find(p => p.dynastyId === dynastyId);
          if (existingPuzzle) {
            return { currentPuzzleId: existingPuzzle.id };
          }

          const dynastyEvents = events.filter(e => e.dynastyId === dynastyId);
          const dynastyPoets = virtualPoets.filter(p => p.dynastyId === dynastyId);
          const dynastyPoems = poems.filter(p => p.dynastyId === dynastyId);

          const pieces: PuzzlePiece[] = [];
          let position = 0;

          dynastyEvents.slice(0, 3).forEach(event => {
            pieces.push({
              id: `piece-event-${event.id}`,
              dynastyId,
              position: position++,
              content: event.name,
              type: 'event',
              isPlaced: false,
            });
          });

          dynastyPoets.slice(0, 3).forEach(poet => {
            pieces.push({
              id: `piece-poet-${poet.id}`,
              dynastyId,
              position: position++,
              content: poet.name,
              type: 'poet',
              isPlaced: false,
            });
          });

          dynastyPoems.slice(0, 2).forEach(poem => {
            pieces.push({
              id: `piece-poem-${poem.id}`,
              dynastyId,
              position: position++,
              content: poem.famousLine,
              type: 'poem',
              isPlaced: false,
            });
          });

          pieces.push({
            id: `piece-achievement-${dynastyId}`,
            dynastyId,
            position: position++,
            content: dynasty.keyEvents[0] || '盛世',
            type: 'achievement',
            isPlaced: false,
          });

          const newPuzzle: Puzzle = {
            id: `puzzle-${dynastyId}-${Date.now()}`,
            dynastyId,
            name: `${dynasty.name}拼图`,
            pieces,
            totalPieces: pieces.length,
            isCompleted: false,
          };

          return {
            puzzles: [...state.puzzles, newPuzzle],
            currentPuzzleId: newPuzzle.id,
          };
        });
      },

      placePuzzlePiece: (puzzleId: string, pieceId: string, memberId: string) => {
        set((state) => {
          const updatedPuzzles = state.puzzles.map(puzzle => {
            if (puzzle.id === puzzleId) {
              const updatedPieces = puzzle.pieces.map(piece => {
                if (piece.id === pieceId && !piece.isPlaced) {
                  return { ...piece, isPlaced: true, placedBy: memberId };
                }
                return piece;
              });

              const allPlaced = updatedPieces.every(p => p.isPlaced);

              return {
                ...puzzle,
                pieces: updatedPieces,
                isCompleted: allPlaced,
                completedAt: allPlaced ? Date.now() : undefined,
              };
            }
            return puzzle;
          });

          const updatedGroup = state.studyGroup ? {
            ...state.studyGroup,
            members: state.studyGroup.members.map(member => {
              if (member.id === memberId) {
                return { ...member, contribution: member.contribution + 1 };
              }
              return member;
            }),
          } : state.studyGroup;

          return { puzzles: updatedPuzzles, studyGroup: updatedGroup };
        });
      },

      completePuzzle: (puzzleId: string) => {
        set((state) => {
          const updatedPuzzles = state.puzzles.map(puzzle => {
            if (puzzle.id === puzzleId) {
              return { ...puzzle, isCompleted: true, completedAt: Date.now() };
            }
            return puzzle;
          });

          const puzzle = state.puzzles.find(p => p.id === puzzleId);
          const updatedGroup = state.studyGroup && puzzle ? {
            ...state.studyGroup,
            completedPuzzles: [...state.studyGroup.completedPuzzles, puzzleId],
            currentPuzzleId: null,
          } : state.studyGroup;

          return { puzzles: updatedPuzzles, studyGroup: updatedGroup };
        });
      },

      generatePoster: (dynastyId: string) => {
        set((state) => {
          const dynasty = state.dynasties.find(d => d.id === dynastyId);
          if (!dynasty) return state;

          const dynastyPoems = poems.filter(p => p.dynastyId === dynastyId);
          const dynastyEvents = events.filter(e => e.dynastyId === dynastyId);
          const dynastyPoets = virtualPoets.filter(p => p.dynastyId === dynastyId);

          const colorSchemes: Record<string, { bg: string; text: string; accent: string }> = {
            tang: { bg: '#FFF5F5', text: '#742A2A', accent: '#C41E3A' },
            song: { bg: '#F0F7FF', text: '#1E3A5F', accent: '#2B5C8A' },
            han: { bg: '#F0F4F8', text: '#1A365D', accent: '#6B95BC' },
            yuan: { bg: '#FAF7F2', text: '#5C4A3D', accent: '#C7B594' },
            ming: { bg: '#FFF8F0', text: '#7A5C2E', accent: '#FFC97D' },
            qing: { bg: '#FFF5F5', text: '#742A2A', accent: '#E89AA6' },
            nanbeichao: { bg: '#F0FFF4', text: '#1A4731', accent: '#2E8B57' },
          };

          const colors = colorSchemes[dynastyId] || colorSchemes.tang;

          const timelineContent = dynastyEvents
            .slice(0, 4)
            .map(e => `${e.year}年：${e.name}`)
            .join('\n');

          const poemsContent = dynastyPoems
            .slice(0, 3)
            .map(p => `《${p.title}》- ${p.author}\n「${p.famousLine}」`)
            .join('\n\n');

          const poetsContent = dynastyPoets
            .slice(0, 4)
            .map(p => `${p.name}（${p.styleName}）`)
            .join('、');

          const studiedCount = dynastyPoems.filter(
            p => state.userProgress.poemProgress[p.id]?.isStudied
          ).length;

          const newPoster: Poster = {
            id: `poster-${dynastyId}-${Date.now()}`,
            dynastyId,
            title: `${dynasty.name}知识海报`,
            subtitle: `${dynasty.startYear > 0 ? '公元' : '公元前'}${Math.abs(dynasty.startYear)}年 - ${dynasty.endYear > 0 ? '公元' : '公元前'}${Math.abs(dynasty.endYear)}年`,
            sections: [
              { id: 's1', type: 'title', title: '朝代简介', content: dynasty.description },
              { id: 's2', type: 'timeline', title: '重要事件', content: timelineContent },
              { id: 's3', type: 'poems', title: '经典诗词', content: poemsContent },
              { id: 's4', type: 'poets', title: '代表诗人', content: poetsContent },
              { id: 's5', type: 'stats', title: '学习统计', content: `已学诗词：${studiedCount}/${dynastyPoems.length}首\n都城：${dynasty.capital}` },
            ],
            backgroundColor: colors.bg,
            textColor: colors.text,
            accentColor: colors.accent,
            createdAt: Date.now(),
            isGenerated: true,
          };

          return {
            posters: [...state.posters, newPoster],
            currentPosterId: newPoster.id,
          };
        });
      },

      selectPoster: (posterId: string | null) => {
        set({ currentPosterId: posterId });
      },

      addNote: (note: Omit<NoteItem, 'id' | 'createdAt'>) => {
        set((state) => {
          const newNote: NoteItem = {
            ...note,
            id: `note-${Date.now()}`,
            createdAt: Date.now(),
          };
          return { notes: [...state.notes, newNote] };
        });
      },

      addWrongQuestion: (question: Omit<WrongQuestion, 'id' | 'createdAt'>) => {
        set((state) => {
          const newQuestion: WrongQuestion = {
            ...question,
            id: `wrong-${Date.now()}`,
            createdAt: Date.now(),
          };
          return { wrongQuestions: [...state.wrongQuestions, newQuestion] };
        });
      },

      addPoemQuote: (quote: Omit<PoemQuote, 'id'>) => {
        set((state) => {
          const newQuote: PoemQuote = {
            ...quote,
            id: `quote-${Date.now()}`,
          };
          return { poemQuotes: [...state.poemQuotes, newQuote] };
        });
      },

      generateAlmanac: (dynastyId: string) => {
        set((state) => {
          const dynasty = state.dynasties.find(d => d.id === dynastyId);
          if (!dynasty) return state;

          const dynastyNotes = state.notes.filter(n => n.dynastyId === dynastyId);
          const dynastyWrongQuestions = state.wrongQuestions.filter(q => q.dynastyId === dynastyId);
          
          const dynastyPoemIds = poems.filter(p => p.dynastyId === dynastyId).map(p => p.id);
          const dynastyPoemQuotes = state.poemQuotes.filter(q => dynastyPoemIds.includes(q.poemId));
          
          const dynastyPoems = poems.filter(p => p.dynastyId === dynastyId);
          const studiedPoems = dynastyPoems.filter(
            p => state.userProgress.poemProgress[p.id]?.isStudied
          );

          const quizzesForDynasty = state.userProgress.quizResults.filter(r => {
            return r.questionDetails.some(d => dynastyPoemIds.includes(d.poemId));
          });

          const totalQuestions = quizzesForDynasty.reduce((sum, r) => sum + r.totalQuestions, 0);
          const totalCorrect = quizzesForDynasty.reduce((sum, r) => sum + r.correctAnswers, 0);

          const formatYear = (year: number) => 
            year > 0 ? `公元${year}年` : `公元前${Math.abs(year)}年`;

          const newAlmanac: Almanac = {
            id: `almanac-${dynastyId}-${Date.now()}`,
            dynastyId,
            dynastyName: dynasty.name,
            period: `${formatYear(dynasty.startYear)} - ${formatYear(dynasty.endYear)}`,
            notes: dynastyNotes,
            wrongQuestions: dynastyWrongQuestions,
            poemQuotes: dynastyPoemQuotes,
            stats: {
              poemsStudied: studiedPoems.length,
              quizzesTaken: quizzesForDynasty.length,
              averageAccuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
              studyTime: quizzesForDynasty.reduce((sum, r) => sum + r.timeSpent, 0),
            },
            generatedAt: Date.now(),
            isDownloaded: false,
          };

          return { almanacs: [...state.almanacs, newAlmanac] };
        });
      },

      markAlmanacDownloaded: (almanacId: string) => {
        set((state) => {
          const updatedAlmanacs = state.almanacs.map(almanac => {
            if (almanac.id === almanacId) {
              return { ...almanac, isDownloaded: true };
            }
            return almanac;
          });
          return { almanacs: updatedAlmanacs };
        });
      },

      joinStudyGroup: (groupId: string) => {
        set({ studyGroup: initialStudyGroup });
      },

      leaveStudyGroup: () => {
        set({ studyGroup: null });
      },

      generateAIImage: async (poemId: string, style: AIImage['style'] = 'ink') => {
        const poem = getPoemById(poemId);
        if (!poem) return;

        set({ currentGeneratingImage: true });

        const dynasty = dynasties.find(d => d.id === poem.dynastyId);
        const dynastyName = dynasty?.name || '中国古代';
        
        const stylePrompts: Record<AIImage['style'], string> = {
          ink: 'traditional Chinese ink wash painting style, minimalist, elegant, black and white with subtle colors',
          watercolor: 'watercolor painting style, soft colors, dreamy atmosphere, artistic brushstrokes',
          oil: 'oil painting style, rich colors, dramatic lighting, classical art',
          anime: 'anime style, vibrant colors, detailed illustration, modern aesthetic',
          realistic: 'photorealistic style, highly detailed, historical accuracy, cinematic lighting'
        };

        const prompt = `${poem.famousLine} - A scene from ${dynastyName} China, depicting the mood and atmosphere of the poem "${poem.title}" by ${poem.author}. ${stylePrompts[style]}. Historical scene, ancient Chinese architecture, traditional clothing, the essence of classical Chinese poetry.`;

        const imageSize = 'landscape_16_9';
        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=${imageSize}`;

        await new Promise(resolve => setTimeout(resolve, 1500));

        const newImage: AIImage = {
          id: `ai-image-${poemId}-${Date.now()}`,
          poemId,
          imageUrl,
          prompt,
          style,
          createdAt: Date.now(),
          isFavorite: false
        };

        set((state) => ({
          aiImages: [...state.aiImages, newImage],
          currentGeneratingImage: false
        }));
      },

      toggleAIImageFavorite: (imageId: string) => {
        set((state) => ({
          aiImages: state.aiImages.map(img => 
            img.id === imageId ? { ...img, isFavorite: !img.isFavorite } : img
          )
        }));
      },

      getAIImagesByPoemId: (poemId: string) => {
        return get().aiImages.filter(img => img.poemId === poemId);
      },

      selectAudioTheater: (theaterId: string | null) => {
        set({ currentAudioTheaterId: theaterId });
      },

      markAudioTheaterPlayed: (theaterId: string) => {
        set((state) => {
          const existing = state.audioTheaterProgress[theaterId];
          return {
            audioTheaterProgress: {
              ...state.audioTheaterProgress,
              [theaterId]: {
                theaterId,
                isCompleted: true,
                lastPlayedAt: Date.now(),
                playCount: (existing?.playCount || 0) + 1
              }
            }
          };
        });
      },

      startAdventure: (adventureId: string) => {
        const adventure = getAdventureById(adventureId);
        if (!adventure) return;

        const progress: AdventureProgress = {
          adventureId,
          currentSceneId: adventure.startSceneId,
          visitedSceneIds: [adventure.startSceneId],
          choicesMade: {},
          score: 0,
          isCompleted: false,
          poemsUnlocked: []
        };

        set({ currentAdventure: progress, selectedAdventureId: adventureId });
      },

      makeAdventureChoice: (sceneId: string, choiceId: string) => {
        set((state) => {
          if (!state.currentAdventure) return state;

          const adventure = getAdventureById(state.currentAdventure.adventureId);
          if (!adventure) return state;

          const scene = adventure.scenes[sceneId];
          if (!scene) return state;

          const choice = scene.choices.find(c => c.id === choiceId);
          if (!choice) return state;

          const isSuccess = choice.consequence.type === 'success';
          const scoreDelta = isSuccess ? 100 : choice.consequence.type === 'neutral' ? 50 : 0;

          const newPoemsUnlocked = choice.consequence.poemReveal 
            ? [...state.currentAdventure.poemsUnlocked, choice.consequence.poemReveal.poemId]
            : state.currentAdventure.poemsUnlocked;

          const isCompleted = choice.consequence.nextSceneId === null || 
            (choice.consequence.nextSceneId && choice.consequence.nextSceneId.includes('good'));

          const nextSceneId = choice.consequence.nextSceneId;

          return {
            currentAdventure: {
              ...state.currentAdventure,
              currentSceneId: nextSceneId || state.currentAdventure.currentSceneId,
              visitedSceneIds: nextSceneId && !state.currentAdventure.visitedSceneIds.includes(nextSceneId)
                ? [...state.currentAdventure.visitedSceneIds, nextSceneId]
                : state.currentAdventure.visitedSceneIds,
              choicesMade: {
                ...state.currentAdventure.choicesMade,
                [sceneId]: choiceId
              },
              score: state.currentAdventure.score + scoreDelta,
              isCompleted: isCompleted || state.currentAdventure.isCompleted,
              completedAt: isCompleted ? Date.now() : undefined,
              poemsUnlocked: [...new Set(newPoemsUnlocked)]
            }
          };
        });
      },

      resetAdventure: () => {
        set({ currentAdventure: null });
      },

      selectAdventure: (adventureId: string | null) => {
        set({ selectedAdventureId: adventureId });
      },

      selectMapLocation: (locationId: string | null) => {
        set({ selectedMapLocationId: locationId });
      },

      startVoiceLearnSession: (query: string) => {
        const state = get();
        const lowerQuery = query.toLowerCase();
        const cards: VoiceLearnCard[] = [];

        const matchedDynasty = state.dynasties.find(d =>
          d.name.includes(query) || lowerQuery.includes(d.id)
        );

        if (matchedDynasty) {
          const dynastyPoems = poems.filter(p => p.dynastyId === matchedDynasty.id);
          const dynastyEvents = events.filter(e => e.dynastyId === matchedDynasty.id);

          cards.push({
            id: `vc-dynasty-${matchedDynasty.id}`,
            type: 'dynasty',
            dynastyId: matchedDynasty.id,
            title: matchedDynasty.name,
            content: matchedDynasty.description,
            year: matchedDynasty.startYear,
            audioText: `${matchedDynasty.name}，${matchedDynasty.description}`,
          });

          dynastyEvents.slice(0, 3).forEach(event => {
            cards.push({
              id: `vc-event-${event.id}`,
              type: 'event',
              dynastyId: matchedDynasty.id,
              title: event.name,
              content: event.description,
              year: event.year,
              audioText: `${event.name}，${event.description}。其影响是：${event.impact}`,
            });
          });

          dynastyPoems.slice(0, 5).forEach(poem => {
            cards.push({
              id: `vc-poem-${poem.id}`,
              type: 'poem',
              dynastyId: matchedDynasty.id,
              title: `《${poem.title}》— ${poem.author}`,
              content: poem.famousLine,
              famousLine: poem.famousLine,
              audioText: `${poem.author}的《${poem.title}》，名句：${poem.famousLine}。背景：${poem.background}`,
            });
          });
        } else {
          const matchedPoems = state.poems.filter(p =>
            p.title.includes(query) ||
            p.author.includes(query) ||
            p.famousLine.includes(query) ||
            p.content.some(line => line.text.includes(query))
          );

          if (matchedPoems.length > 0) {
            matchedPoems.slice(0, 8).forEach(poem => {
              const dynasty = state.dynasties.find(d => d.id === poem.dynastyId);
              cards.push({
                id: `vc-poem-${poem.id}`,
                type: 'poem',
                dynastyId: poem.dynastyId,
                title: `《${poem.title}》— ${poem.author}`,
                content: poem.famousLine,
                famousLine: poem.famousLine,
                audioText: `${dynasty?.name || ''}诗人${poem.author}的《${poem.title}》，名句：${poem.famousLine}。${poem.background}`,
              });
            });
          } else {
            state.dynasties.forEach(dynasty => {
              cards.push({
                id: `vc-dynasty-${dynasty.id}`,
                type: 'dynasty',
                dynastyId: dynasty.id,
                title: dynasty.name,
                content: dynasty.description,
                year: dynasty.startYear,
                audioText: `${dynasty.name}，${dynasty.description}`,
              });
            });
          }
        }

        const testQuestions = cards
          .filter(c => c.type === 'poem' || c.type === 'event')
          .slice(0, 5)
          .map(c => c.id);

        set({
          voiceLearnSession: {
            id: `vls-${Date.now()}`,
            query,
            cards,
            currentCardIndex: 0,
            isPlaying: false,
            startedAt: Date.now(),
            testStarted: false,
            testQuestions,
            testAnswers: {},
          },
        });
      },

      advanceVoiceCard: () => {
        set((state) => {
          if (!state.voiceLearnSession) return state;
          const nextIndex = state.voiceLearnSession.currentCardIndex + 1;
          if (nextIndex >= state.voiceLearnSession.cards.length) return state;
          return {
            voiceLearnSession: {
              ...state.voiceLearnSession,
              currentCardIndex: nextIndex,
            },
          };
        });
      },

      toggleVoicePlayback: () => {
        set((state) => {
          if (!state.voiceLearnSession) return state;
          return {
            voiceLearnSession: {
              ...state.voiceLearnSession,
              isPlaying: !state.voiceLearnSession.isPlaying,
            },
          };
        });
      },

      startVoiceTest: () => {
        set((state) => {
          if (!state.voiceLearnSession) return state;
          return {
            voiceLearnSession: {
              ...state.voiceLearnSession,
              testStarted: true,
            },
          };
        });
      },

      answerVoiceTest: (questionId: string, answer: string) => {
        set((state) => {
          if (!state.voiceLearnSession) return state;
          return {
            voiceLearnSession: {
              ...state.voiceLearnSession,
              testAnswers: {
                ...state.voiceLearnSession.testAnswers,
                [questionId]: answer,
              },
            },
          };
        });
      },

      endVoiceLearnSession: () => {
        set({ voiceLearnSession: null });
      },

      getWrongQuestionGroups: (): WrongQuestionGroup[] => {
        const state = get();
        const groups: Record<string, WrongQuestionGroup & { subPeriodGroups?: Record<string, { name: string; questions: typeof state.wrongQuestions }> }> = {};

        state.wrongQuestions.forEach(q => {
          if (!groups[q.dynastyId]) {
            const dynasty = state.dynasties.find(d => d.id === q.dynastyId);
            if (!dynasty) return;
            const fmt = (y: number) => y < 0 ? `公元前${Math.abs(y)}年` : `公元${y}年`;
            groups[q.dynastyId] = {
              dynastyId: q.dynastyId,
              dynastyName: dynasty.name,
              dynastyColor: dynasty.color,
              period: `${fmt(dynasty.startYear)} - ${fmt(dynasty.endYear)}`,
              questions: [],
              recommendedPoemIds: [],
              subPeriodGroups: {},
            };
          }
          groups[q.dynastyId].questions.push(q);

          const poem = getPoemById(q.poemId);
          if (poem?.subPeriodId && groups[q.dynastyId].subPeriodGroups) {
            const subPeriod = subPeriods.find(sp => sp.id === poem.subPeriodId);
            if (subPeriod) {
              if (!groups[q.dynastyId].subPeriodGroups![poem.subPeriodId]) {
                groups[q.dynastyId].subPeriodGroups![poem.subPeriodId] = {
                  name: subPeriod.name,
                  questions: [],
                };
              }
              groups[q.dynastyId].subPeriodGroups![poem.subPeriodId].questions.push(q);
            }
          }
        });

        Object.keys(groups).forEach(dynastyId => {
          const group = groups[dynastyId];
          const wrongPoemIds = [...new Set(group.questions.map(q => q.poemId))];
          const dynastyPoems = poems.filter(p => p.dynastyId === dynastyId);
          const wrongPoemTags = wrongPoemIds
            .map(pid => poems.find(p => p.id === pid))
            .filter(Boolean)
            .flatMap(p => p!.tags);
          const wrongSubPeriodIds = [...new Set(
            wrongPoemIds
              .map(pid => poems.find(p => p.id === pid)?.subPeriodId)
              .filter(Boolean)
          )] as string[];
          const wrongQuestionTypes = [...new Set(group.questions.map(q => {
            const poem = getPoemById(q.poemId);
            return poem?.difficulty || 'medium';
          }))];

          const scoredRecommendations = dynastyPoems
            .filter(p => !wrongPoemIds.includes(p.id))
            .map(p => {
              let score = 0;
              const matchingTags = p.tags.filter(t => wrongPoemTags.includes(t)).length;
              score += matchingTags * 10;
              if (wrongSubPeriodIds.includes(p.subPeriodId || '')) score += 15;
              if (wrongQuestionTypes.includes(p.difficulty)) score += 8;
              score += (state.userProgress.poemProgress[p.id]?.wrongCount || 0) * 5;
              score -= (state.userProgress.poemProgress[p.id]?.correctCount || 0) * 2;
              return { poem: p, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 4);

          const highlyRecommended = scoredRecommendations.filter(sr => sr.score > 0).map(sr => sr.poem.id);
          const fallbackCount = 4 - highlyRecommended.length;
          const fallback = dynastyPoems
            .filter(p => !wrongPoemIds.includes(p.id) && !highlyRecommended.includes(p.id))
            .slice(0, fallbackCount)
            .map(p => p.id);

          group.recommendedPoemIds = [...highlyRecommended, ...fallback];
        });

        return Object.values(groups).sort((a, b) => {
          const dynastyA = state.dynasties.find(d => d.id === a.dynastyId);
          const dynastyB = state.dynasties.find(d => d.id === b.dynastyId);
          return (dynastyA?.startYear || 0) - (dynastyB?.startYear || 0);
        });
      },

      getRecommendedPractice: (dynastyId: string): string[] => {
        const state = get();
        const dynastyWrongPoemIds = [...new Set(
          state.wrongQuestions
            .filter(q => q.dynastyId === dynastyId)
            .map(q => q.poemId)
        )];
        const dynastyPoems = poems.filter(p => p.dynastyId === dynastyId);
        const wrongTags = dynastyWrongPoemIds
          .map(pid => poems.find(p => p.id === pid))
          .filter(Boolean)
          .flatMap(p => p!.tags);

        return dynastyPoems
          .filter(p => {
            if (dynastyWrongPoemIds.includes(p.id)) return true;
            return p.tags.some(t => wrongTags.includes(t));
          })
          .slice(0, 5)
          .map(p => p.id);
      },

      removeWrongQuestion: (questionId: string) => {
        set((state) => ({
          wrongQuestions: state.wrongQuestions.filter(q => q.id !== questionId),
        }));
      },
    }),
    {
      name: 'shishi-zhixue-storage',
      partialize: (state) => ({
        userProgress: state.userProgress,
        selectedDynastyId: state.selectedDynastyId,
        selectedPoemId: state.selectedPoemId,
        chatMessages: state.chatMessages,
        puzzles: state.puzzles,
        posters: state.posters,
        almanacs: state.almanacs,
        notes: state.notes,
        wrongQuestions: state.wrongQuestions,
        poemQuotes: state.poemQuotes,
        socialPosts: state.socialPosts,
        studyGroup: state.studyGroup,
        aiImages: state.aiImages,
        audioTheaterProgress: state.audioTheaterProgress,
        currentAdventure: state.currentAdventure,
        selectedAdventureId: state.selectedAdventureId,
        currentAudioTheaterId: state.currentAudioTheaterId,
        selectedMapLocationId: state.selectedMapLocationId,
      }),
    }
  )
);

export default useAppStore;
