export const USER_KEYS = {
  USERS: ["users"] as const,
  USER: (id: string) => ["users", id] as const,
  USER_PROFILE: (id: string) => ["users", id, "profile"] as const,
};
