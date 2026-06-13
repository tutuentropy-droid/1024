import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppStore, UserProgress, QuizResult, Poem, DailyChallengeResult } from '@/types';
import { 
  dynasties, poems, events, getPoemById, getAllDynasties, 
  getPoemsByDynastyId, getSubPeriodsByDynastyId, 
  getPoemsBySubPeriodId, getPoemsByDifficulty, subPeriods,
  getAllSubPeriods, comparisons, generateDailyChallengeData
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

          return {
            userProgress: {
              ...state.userProgress,
              totalQuizzesTaken: state.userProgress.totalQuizzesTaken + 1,
              averageAccuracy,
              quizResults: allResults,
              currentDifficulty: newDifficulty,
            },
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
    }),
    {
      name: 'shishi-zhixue-storage',
      partialize: (state) => ({
        userProgress: state.userProgress,
        selectedDynastyId: state.selectedDynastyId,
        selectedPoemId: state.selectedPoemId,
      }),
    }
  )
);

export default useAppStore;
