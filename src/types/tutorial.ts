export type CalloutType = 'tip' | 'warning' | 'important' | 'note' | 'example';

export interface Callout {
  type: CalloutType;
  content: string; // May include markdown and {{glossary:key|text}}
}

export interface Hint {
  summary: string;
  content: string;
}

export interface QuizOption {
  value: string;
  text: string;
  label?: string;
  isCorrect?: boolean;
}

export interface Quiz {
  question: string;
  options: QuizOption[];
  explanation?: string;
  correctAnswer?: string;
}

export interface DiagramNode {
  id: string;
  step: string;
  title: string;
  desc: string;
}

export interface Diagram {
  title: string;
  nodes: DiagramNode[];
}

export interface StepMedia {
  src: string;
  caption?: string;
}

export interface Step {
  id: string; // e.g., "step-1"
  index: number; // 0-based
  layerIndex: number;
  layerTitle: string;
  layerTitleEn?: string;
  title: string;
  titleEn?: string;
  counterText: string;
  timeLeft: string;
  textBlocks: string[]; // HTML or markdown paragraphs with {{glossary:key|term}}
  callouts?: Callout[];
  hints?: Hint[];
  quiz?: Quiz;
  diagram?: Diagram;
  images?: StepMedia[];
}

export interface Layer {
  index: number;
  id: string;
  title: string;
  titleEn: string;
  stepCount: number;
  estimatedMinutes: number;
  stepStartIndex: number;
  stepEndIndex: number;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  termEn: string;
  definition: string;
  related: { id: string; term: string }[];
}

export interface TutorialState {
  currentStepIndex: number;
  completedSteps: number[]; // Array of completed step indices
  theme: 'dark' | 'light';
}
