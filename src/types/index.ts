export interface DynastySubPeriod {
  id: string;
  dynastyId: string;
  name: string;
  startYear: number;
  endYear: number;
  description: string;
  poemIds: string[];
  eventIds: string[];
  keyFeatures: string[];
}

export interface Dynasty {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  description: string;
  color: string;
  capital: string;
  famousPoets: string[];
  keyEvents: string[];
  poemIds: string[];
  subPeriodIds?: string[];
}

export interface PoemLine {
  text: string;
  translation: string;
  annotation?: string;
}

export interface Poem {
  id: string;
  dynastyId: string;
  subPeriodId?: string;
  title: string;
  content: PoemLine[];
  famousLine: string;
  author: string;
  authorBio: string;
  background: string;
  historicalInsight: {
    politics?: string;
    economy?: string;
    society?: string;
    culture?: string;
    education?: string;
    philosophy?: string;
  };
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  fullTranslation?: string;
}

export interface HistoricalEvent {
  id: string;
  dynastyId: string;
  subPeriodId?: string;
  name: string;
  year: number;
  description: string;
  impact: string;
  relatedPoems?: string[];
}

export interface PoemProgress {
  poemId: string;
  isStudied: boolean;
  isFavorite: boolean;
  studyCount: number;
  lastStudyTime: number;
  correctCount?: number;
  wrongCount?: number;
}

export interface QuizResult {
  id: string;
  date: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  questionDetails: QuizQuestionDetail[];
  difficultyTrend?: {
    targetDifficulty: 'easy' | 'medium' | 'hard';
    adjusted: boolean;
  };
}

export interface QuizQuestionDetail {
  questionId: string;
  poemId: string;
  type: QuizQuestionType;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
}

export type QuizQuestionType = 
  | 'fill_blank'      
  | 'author_match'    
  | 'dynasty_match'   
  | 'history_understand'
  | 'subperiod_match'
  | 'translation_match';

export interface QuizQuestion {
  id: string;
  poemId: string;
  type: QuizQuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserProgress {
  id: string;
  lastStudyTime: number;
  totalPoemsStudied: number;
  totalQuizzesTaken: number;
  averageAccuracy: number;
  poemProgress: Record<string, PoemProgress>;
  quizResults: QuizResult[];
  currentDifficulty: 'easy' | 'medium' | 'hard';
  poemOrderPreference: string[];
  subPeriodProgress: Record<string, {
    subPeriodId: string;
    mastery: number;
    poemIds: string[];
  }>;
}

export interface AppState {
  dynasties: Dynasty[];
  poems: Poem[];
  events: HistoricalEvent[];
  subPeriods: DynastySubPeriod[];
  userProgress: UserProgress;
  selectedDynastyId: string | null;
  selectedPoemId: string | null;
}

export interface AppActions {
  selectDynasty: (id: string | null) => void;
  selectPoem: (id: string | null) => void;
  markPoemAsStudied: (poemId: string) => void;
  toggleFavorite: (poemId: string) => void;
  saveQuizResult: (result: Omit<QuizResult, 'id' | 'date'>) => void;
  getStudiedPoemIds: () => string[];
  getRecommendedPoem: () => Poem | null;
  adjustDifficulty: (accuracy: number) => 'easy' | 'medium' | 'hard';
  getOrderedPoems: () => Poem[];
  getSubPeriodsByDynastyId: (dynastyId: string) => DynastySubPeriod[];
  getPoemsBySubPeriodId: (subPeriodId: string) => Poem[];
  recordPoemAnswer: (poemId: string, isCorrect: boolean) => void;
}

export type AppStore = AppState & AppActions;
