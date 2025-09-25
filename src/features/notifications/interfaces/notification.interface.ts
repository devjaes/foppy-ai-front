export enum NotificationType {
  GOAL = "GOAL",
  DEBT = "DEBT",
  SUGGESTION = "SUGGESTION",
  WARNING = "WARNING",
  CONGRATULATION = "CONGRATULATION",
}

export interface INotification {
  id: number;
  userId: number;
  title: string;
  subtitle?: string | null;
  message: string;
  read: boolean;
  type: NotificationType;
  created_at: string;
  expiresAt?: string | null;
}
