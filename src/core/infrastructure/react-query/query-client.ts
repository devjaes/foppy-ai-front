"use client";

import { QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: Infinity,
    },
  },
});

export default queryClient;
