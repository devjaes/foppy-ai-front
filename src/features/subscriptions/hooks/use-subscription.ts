import { useQuery } from "@tanstack/react-query";
import { getSubscription } from "../services/subscription.service";

export const useSubscription = (userId: string | number | undefined) => {
  return useQuery({
    queryKey: ["subscription", userId],
    queryFn: () => getSubscription(Number(userId)),
    enabled: !!userId,
  });
};
