import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppStore, UserProgress, QuizResult } from '@/types';
import { dynasties, poems, events, getPoemById, getAllDynasties, getPoemsByDynastyId } from '@/data';

const initialUserProgress: UserProgress = {
  id: 'user-1',
  lastStudyTime: 0,
  totalPoemsStudied: 0,
  totalQuizzesTaken: 0,
  averageAccuracy: 0,
  poemProgress: {},
  quizResults: [],
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      dynasties: getAllDynasties(),
      poems: poems,
      events: events,
      userProgress: initialUserProgress,
      selectedDynastyId: null,
      selectedPoemId: null,

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

          return {
            userProgress: {
              ...state.userProgress,
              totalQuizzesTaken: state.userProgress.totalQuizzesTaken + 1,
              averageAccuracy,
              quizResults: allResults,
            },
          };
        });
      },

      getStudiedPoemIds: () => {
        const state = get();
        return Object.values(state.userProgress.poemProgress)
          .filter(p => p.isStudied)
          .map(p => p.poemId);
      },

      getRecommendedPoem: () => {
        const state = get();
        const studiedIds = state.getStudiedPoemIds();
        const unstudiedPoems = state.poems.filter(p => !studiedIds.includes(p.id));
        
        if (unstudiedPoems.length === 0) {
          return state.poems[0] || null;
        }
        
        return unstudiedPoems[Math.floor(Math.random() * unstudiedPoems.length)];
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
