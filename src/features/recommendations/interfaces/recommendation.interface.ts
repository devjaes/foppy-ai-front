export enum RecommendationType {
  SPENDING_ANALYSIS = "SPENDING_ANALYSIS",
  GOAL_OPTIMIZATION = "GOAL_OPTIMIZATION",
  BUDGET_SUGGESTION = "BUDGET_SUGGESTION",
  DEBT_REMINDER = "DEBT_REMINDER",
}

export enum RecommendationPriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum RecommendationStatus {
  PENDING = "PENDING",
  VIEWED = "VIEWED",
  DISMISSED = "DISMISSED",
  ACTED = "ACTED",
}

export interface QuickAction {
  label: string;
  path: string;
  prefilledData?: Record<string, unknown>;
}

export interface IRecommendation {
  id: number;
  type: RecommendationType;
  priority: RecommendationPriority;
  title: string;
  description: string;
  data?: unknown;
  actionable: boolean;
  actions?: QuickAction[];
  status: RecommendationStatus;
  createdAt: string;
  expiresAt?: string;
}

export const RECOMMENDATION_TYPE_LABELS: Record<RecommendationType, string> = {
  [RecommendationType.SPENDING_ANALYSIS]: "Análisis de Gastos",
  [RecommendationType.GOAL_OPTIMIZATION]: "Optimización de Metas",
  [RecommendationType.BUDGET_SUGGESTION]: "Sugerencia de Presupuesto",
  [RecommendationType.DEBT_REMINDER]: "Recordatorio de Deuda",
};

export const RECOMMENDATION_PRIORITY_LABELS: Record<
  RecommendationPriority,
  string
> = {
  [RecommendationPriority.HIGH]: "Alta",
  [RecommendationPriority.MEDIUM]: "Media",
  [RecommendationPriority.LOW]: "Baja",
};

export interface GetRecommendationsResponse {
  success: boolean;
  data: IRecommendation[];
  message?: string;
}

export interface UpdateRecommendationResponse {
  success: boolean;
  data: { success: boolean };
  message?: string;
}
