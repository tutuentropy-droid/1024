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
}

export interface Poem {
  id: string;
  dynastyId: string;
  title: string;
  content: string[];
  famousLine: string;
  author: string;
  authorBio: string;
  background: string;
  historicalInsight: {
    politics?: string;
    economy?: string;
    society?: string;
    culture?: string;
  };
  tags: string[];
}

export interface HistoricalEvent {
  id: string;
  dynastyId: string;
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
}

export interface QuizResult {
  id: string;
  date: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  questionDetails: QuizQuestionDetail[];
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
  | 'history_understand';

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
}

export interface AppState {
  dynasties: Dynasty[];
  poems: Poem[];
  events: HistoricalEvent[];
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
}

export type AppStore = AppState & AppActions;
