export interface BonusAnswer {
  levelId: string;
  levelTitle: string;
  question: string;
  answer: string;
  aiEvaluation: string | null; // populated later by AI
  answeredAt: unknown;
}
