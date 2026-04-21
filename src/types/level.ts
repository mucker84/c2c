export interface Question {
  q: string;
  a: string[];
  correct: number;
  hint?: string;
}

export interface LevelContent {
  glitch: string;
  fullText: string;
  logicBonus?: string;
}

export interface Level {
  id: string;
  sector: string;
  title: string;
  coordinates?: string;
  content: LevelContent;
  questions: Question[];
}

export type LevelState = "locked" | "available" | "completed";
