export type ChapterStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ChapterProgressInfo {
  chapterId: string;
  chapterIndex: number;
  completedStepCount: number;
  totalStepCount: number;
  status: ChapterStatus;
  lastStepIndex?: number;
}

export interface UserTutorialProgress {
  currentChapterId: string;
  currentStepId: string;
  currentStepIndex: number;
  completedSteps: number[]; // Array of step indices
  lastAccessedAt: number;
  chapterProgresses: Record<string, ChapterProgressInfo>;
}

export type CheatSheetCategory =
  | 'KEYWORDS'
  | 'FOCUS_CARDS'
  | 'CYCLE_FLOW'
  | 'EVALUATION_PHASE'
  | 'COMBAT_SUMMARY';

export interface CheatSheetStep {
  stepNumber: number;
  title: string;
  description: string;
  warning?: string;
  tip?: string;
}

export interface CheatSheetItem {
  id: string;
  category: CheatSheetCategory;
  titleKo: string;
  titleEn: string;
  summaryKo: string;
  steps?: CheatSheetStep[];
  relatedKeywords?: string[];
}

export interface FuzzyMatchResult<T> {
  item: T;
  score: number;
  matchedField: 'titleKo' | 'titleEn' | 'summaryKo' | 'keyword' | 'jamo';
}

export interface TabletopSettings {
  wakeLockActive: boolean;
  wakeLockSupported: boolean;
  quickRefOpen: boolean;
  combatSimOpen: boolean;
}
