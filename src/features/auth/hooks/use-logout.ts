"use client";

import { useAuthOperations } from "./use-auth-operations";

export function useLogout() {
  const { logoutHandler } = useAuthOperations();
  const onLogout = async () => {
    await logoutHandler();
  };

  return { onLogout };
}
