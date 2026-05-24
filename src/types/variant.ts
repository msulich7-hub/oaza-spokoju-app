import type { Room, Setbacks } from "./project";

export type TransformType = "none" | "mirror-ew" | "mirror-ns" | "adapt-hikora";

export interface BuildingSize {
  widthWE: number;
  lengthNS: number;
}

export interface ReferenceLink {
  url: string;
  title?: string;
  description?: string;
  fetchedAt?: string;
}

export interface ExpertOpinion {
  expertId: string;
  score: number;
  summary: string;
  recommendations: string[];
  criticalChange?: string;
}

export type ExpertSessionMode = "single" | "debate" | "ideal";

export type ExpertDebateStance = "agree" | "disagree" | "question" | "proposal";

export interface ExpertDebateMessage {
  expertId: string;
  stance: ExpertDebateStance;
  text: string;
}

export interface ExpertDebateResult {
  expertIds: string[];
  messages: ExpertDebateMessage[];
  consensus?: string;
  disagreements: string[];
  verdict: string;
  averageScore: number;
}

export interface IdealProjectResult {
  recommendedVariantId: string;
  recommendedVariantName: string;
  score: number;
  rationale: string;
  expertSummaries: { expertId: string; pick: string; score: number }[];
  alternatives: { variantId: string; variantName: string; when: string }[];
  nextSteps: string[];
  rankings: { variantId: string; variantName: string; score: number }[];
}

export interface ProjectVariant {
  id: string;
  name: string;
  description: string;
  transform: TransformType;
  intent: string;
  referenceLinks: ReferenceLink[];
  buildingSize?: BuildingSize;
  setbacks?: Setbacks;
  roomsOverride?: {
    parter?: Room[];
    pietro?: Room[];
  };
  expertReviews?: ExpertOpinion[];
  createdAt: string;
  updatedAt: string;
  isBaseline?: boolean;
}

export interface LinkAnalysisResult {
  url: string;
  title: string;
  description: string;
  suggestedIntents: string[];
}
