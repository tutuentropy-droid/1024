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
  completedDynasties: string[];
  dailyChallengeResults: DailyChallengeResult[];
}



export interface DynastyComparisonDimension {
  dimension: string;
  dynastyAValue: string;
  dynastyBValue: string;
}

export interface DynastyComparison {
  id: string;
  dynastyAId: string;
  dynastyBId: string;
  title: string;
  description: string;
  dimensions: DynastyComparisonDimension[];
  conclusion: string;
}

export interface DailyChallengeItem {
  poemId: string;
  famousLine: string;
  dynastyId: string;
  dynastyName: string;
  startYear: number;
  order: number;
}

export interface DailyChallenge {
  date: string;
  items: DailyChallengeItem[];
  correctOrder: number[];
  knowledgePoints: string[];
}

export interface DailyChallengeResult {
  date: string;
  isCorrect: boolean;
  userOrder: number[];
  unlockedKnowledge: string[];
}

export interface VirtualPoet {
  id: string;
  name: string;
  styleName: string;
  avatar: string;
  dynastyId: string;
  bio: string;
  personality: string;
  famousWorks: string[];
  catchphrases: string[];
}

export interface SocialComment {
  id: string;
  poetId: string;
  content: string;
  timestamp: number;
}

export interface SocialPost {
  id: string;
  poetId: string;
  content: string;
  timestamp: number;
  likes: number;
  likedByUser: boolean;
  comments: SocialComment[];
  tags?: string[];
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
}

export interface PuzzlePiece {
  id: string;
  dynastyId: string;
  position: number;
  content: string;
  type: 'event' | 'poet' | 'poem' | 'achievement';
  isPlaced: boolean;
  placedBy?: string;
}

export interface Puzzle {
  id: string;
  dynastyId: string;
  name: string;
  pieces: PuzzlePiece[];
  totalPieces: number;
  isCompleted: boolean;
  completedAt?: number;
}

export interface PosterSection {
  id: string;
  type: 'title' | 'timeline' | 'poems' | 'events' | 'poets' | 'stats';
  title: string;
  content: string;
}

export interface Poster {
  id: string;
  dynastyId: string;
  title: string;
  subtitle: string;
  sections: PosterSection[];
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  createdAt: number;
  isGenerated: boolean;
}

export interface NoteItem {
  id: string;
  poemId?: string;
  content: string;
  createdAt: number;
  dynastyId?: string;
}

export interface WrongQuestion {
  id: string;
  questionId: string;
  poemId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  dynastyId: string;
  createdAt: number;
}

export interface PoemQuote {
  id: string;
  poemId: string;
  line: string;
  author: string;
  dynastyId: string;
  note?: string;
}

export interface Almanac {
  id: string;
  dynastyId: string;
  dynastyName: string;
  period: string;
  notes: NoteItem[];
  wrongQuestions: WrongQuestion[];
  poemQuotes: PoemQuote[];
  stats: {
    poemsStudied: number;
    quizzesTaken: number;
    averageAccuracy: number;
    studyTime: number;
  };
  generatedAt: number;
  isDownloaded: boolean;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  contribution: number;
  isOnline: boolean;
  lastActive: number;
}

export interface StudyGroup {
  id: string;
  name: string;
  members: GroupMember[];
  currentPuzzleId: string | null;
  completedPuzzles: string[];
  createdAt: number;
}

export interface AIImage {
  id: string;
  poemId: string;
  imageUrl: string;
  prompt: string;
  style: 'ink' | 'watercolor' | 'oil' | 'anime' | 'realistic';
  createdAt: number;
  isFavorite?: boolean;
}

export interface AudioTheater {
  id: string;
  eventId: string;
  dynastyId: string;
  title: string;
  description: string;
  duration: number;
  narratorPoemLines: string[];
  storyContent: string;
  backgroundMusic: string;
  relatedPoemIds: string[];
  year: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AudioTheaterProgress {
  theaterId: string;
  isCompleted: boolean;
  lastPlayedAt: number;
  playCount: number;
}

export interface AdventureScene {
  id: string;
  title: string;
  description: string;
  narrative: string;
  imagePrompt?: string;
  choices: AdventureChoice[];
}

export interface AdventureChoice {
  id: string;
  text: string;
  requiredPoemKnowledge?: {
    poemId?: string;
    famousLine?: string;
    hint?: string;
  };
  consequence: {
    type: 'success' | 'failure' | 'neutral';
    nextSceneId: string | null;
    message: string;
    poemReveal?: {
      poemId: string;
      famousLine: string;
      explanation: string;
    };
  };
}

export interface Adventure {
  id: string;
  title: string;
  dynastyId: string;
  description: string;
  startSceneId: string;
  scenes: Record<string, AdventureScene>;
  historicalEventId: string;
  year: number;
  difficulty: 'easy' | 'medium' | 'hard';
  requiredPoemIds: string[];
}

export interface AdventureProgress {
  adventureId: string;
  currentSceneId: string;
  visitedSceneIds: string[];
  choicesMade: Record<string, string>;
  score: number;
  isCompleted: boolean;
  completedAt?: number;
  poemsUnlocked: string[];
}

export interface GeoLocation {
  id: string;
  name: string;
  modernName: string;
  x: number;
  y: number;
  dynastyId: string;
  poemIds: string[];
  eventIds: string[];
  description: string;
}

export interface PoetryMapMarker {
  locationId: string;
  x: number;
  y: number;
  dynastyId: string;
  label: string;
  poemCount: number;
}

export interface VoiceLearnCard {
  id: string;
  type: 'dynasty' | 'poem' | 'event';
  dynastyId: string;
  title: string;
  content: string;
  famousLine?: string;
  year?: number;
  audioText: string;
}

export interface VoiceLearnSession {
  id: string;
  query: string;
  cards: VoiceLearnCard[];
  currentCardIndex: number;
  isPlaying: boolean;
  startedAt: number;
  testStarted: boolean;
  testQuestions: string[];
  testAnswers: Record<string, string>;
}

export interface WrongQuestionGroup {
  dynastyId: string;
  dynastyName: string;
  dynastyColor: string;
  period: string;
  questions: WrongQuestion[];
  recommendedPoemIds: string[];
}

export interface AppState {
  dynasties: Dynasty[];
  poems: Poem[];
  events: HistoricalEvent[];
  subPeriods: DynastySubPeriod[];
  comparisons: DynastyComparison[];
  geoLocations: GeoLocation[];
  userProgress: UserProgress;
  selectedDynastyId: string | null;
  selectedPoemId: string | null;
  dailyChallenge: DailyChallenge | null;
  virtualPoets: VirtualPoet[];
  socialPosts: SocialPost[];
  chatMessages: Record<string, ChatMessage[]>;
  selectedPoetId: string | null;
  puzzles: Puzzle[];
  currentPuzzleId: string | null;
  posters: Poster[];
  currentPosterId: string | null;
  almanacs: Almanac[];
  notes: NoteItem[];
  wrongQuestions: WrongQuestion[];
  poemQuotes: PoemQuote[];
  studyGroup: StudyGroup | null;
  aiImages: AIImage[];
  currentGeneratingImage: boolean;
  audioTheaters: AudioTheater[];
  audioTheaterProgress: Record<string, AudioTheaterProgress>;
  currentAudioTheaterId: string | null;
  adventures: Adventure[];
  currentAdventure: AdventureProgress | null;
  selectedAdventureId: string | null;
  voiceLearnSession: VoiceLearnSession | null;
  selectedMapLocationId: string | null;
  timeCapsules: TimeCapsule[];
  selectedTimeCapsuleId: string | null;
  studyBuddy: StudyBuddy;
  studyBuddyMessages: StudyBuddyMessage[];
  isStudyBuddyOpen: boolean;
  dailyPoemHistory: DailyPoemHistory | null;
  dailyPoemHistoryList: DailyPoemHistory[];
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
  markDynastyCompleted: (dynastyId: string) => void;
  saveDailyChallengeResult: (result: DailyChallengeResult) => void;
  generateDailyChallenge: () => void;
  getDynastyCompletionStats: () => { completed: number; total: number; percentage: number; };
  selectPoet: (poetId: string | null) => void;
  likeSocialPost: (postId: string) => void;
  commentSocialPost: (postId: string, poetId: string, content: string) => void;
  sendChatMessage: (poetId: string, content: string) => void;
  startPuzzle: (dynastyId: string) => void;
  placePuzzlePiece: (puzzleId: string, pieceId: string, memberId: string) => void;
  completePuzzle: (puzzleId: string) => void;
  generatePoster: (dynastyId: string) => void;
  selectPoster: (posterId: string | null) => void;
  addNote: (note: Omit<NoteItem, 'id' | 'createdAt'>) => void;
  addWrongQuestion: (question: Omit<WrongQuestion, 'id' | 'createdAt'>) => void;
  addPoemQuote: (quote: Omit<PoemQuote, 'id'>) => void;
  generateAlmanac: (dynastyId: string) => void;
  markAlmanacDownloaded: (almanacId: string) => void;
  joinStudyGroup: (groupId: string) => void;
  leaveStudyGroup: () => void;
  generateAIImage: (poemId: string, style?: AIImage['style']) => Promise<void>;
  toggleAIImageFavorite: (imageId: string) => void;
  getAIImagesByPoemId: (poemId: string) => AIImage[];
  selectAudioTheater: (theaterId: string | null) => void;
  markAudioTheaterPlayed: (theaterId: string) => void;
  startAdventure: (adventureId: string) => void;
  makeAdventureChoice: (sceneId: string, choiceId: string) => void;
  resetAdventure: () => void;
  selectAdventure: (adventureId: string | null) => void;
  selectMapLocation: (locationId: string | null) => void;
  startVoiceLearnSession: (query: string) => void;
  advanceVoiceCard: () => void;
  toggleVoicePlayback: () => void;
  startVoiceTest: () => void;
  answerVoiceTest: (questionId: string, answer: string) => void;
  endVoiceLearnSession: () => void;
  getWrongQuestionGroups: () => WrongQuestionGroup[];
  getRecommendedPractice: (dynastyId: string) => string[];
  removeWrongQuestion: (questionId: string) => void;
  createTimeCapsule: (targetType: 'poet' | 'event', targetId: string, userPrediction: string) => void;
  selectTimeCapsule: (id: string | null) => void;
  deleteTimeCapsule: (id: string) => void;
  getTimeCapsulesByDynasty: (dynastyId: string) => TimeCapsule[];
  toggleStudyBuddy: () => void;
  sendStudyBuddyMessage: (content: string) => void;
  getStudyBuddyDifficulty: () => 'easy' | 'medium' | 'hard';
  adjustStudyBuddyPersonality: () => void;
  generateDailyPoemHistory: () => void;
  markDailyPoemAsRead: (date: string) => void;
  toggleDailyPoemFavorite: (date: string) => void;
  getDailyPoemHistoryByDate: (date: string) => DailyPoemHistory | undefined;
}

export interface TimeCapsule {
  id: string;
  targetType: 'poet' | 'event';
  targetId: string;
  targetName: string;
  userPrediction: string;
  aiAnalysis: string;
  comparisonPoints: string[];
  historicalAccuracy: number;
  creativityScore: number;
  createdAt: number;
  dynastyId: string;
  tags: string[];
}

export interface StudyBuddy {
  id: string;
  name: string;
  avatar: string;
  personality: 'encouraging' | 'challenging' | 'playful' | 'scholarly';
  level: number;
  experience: number;
  totalQuestions: number;
  correctAnswers: number;
  currentStreak: number;
  longestStreak: number;
  unlockedBadges: string[];
  lastInteraction: number;
}

export interface StudyBuddyMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  type: 'greeting' | 'question' | 'hint' | 'encouragement' | 'summary' | 'feedback';
  difficulty?: 'easy' | 'medium' | 'hard';
  relatedPoemId?: string;
}

export interface DailyPoemHistory {
  date: string;
  poemId: string;
  poemTitle: string;
  poemAuthor: string;
  poemContent: string;
  dynastyName: string;
  dynastyId: string;
  historicalBackground: string;
  microLesson: {
    title: string;
    duration: number;
    summary: string;
    keyPoints: string[];
    quizQuestion: string;
    quizOptions: string[];
    correctAnswerIndex: number;
    explanation: string;
  };
  animationScenes: AnimationScene[];
  isRead: boolean;
  isFavorite: boolean;
}

export interface AnimationScene {
  id: string;
  order: number;
  title: string;
  description: string;
  visualPrompt: string;
  narration: string;
  duration: number;
  poemLine?: string;
}

export type AppStore = AppState & AppActions;
