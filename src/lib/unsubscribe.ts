import queryClient from "@/core/infrastructure/react-query/query-client";

export const unsubscribe = async (querys: string[]) => {
  await queryClient.cancelQueries({
    queryKey: querys,
  });
};
