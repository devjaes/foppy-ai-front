import queryClient from "@/core/infrastructure/react-query/query-client";

export const invalidateQuery = (query: string[]) => {
  queryClient.invalidateQueries({ queryKey: query });
};
