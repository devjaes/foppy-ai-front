import { useSession } from "next-auth/react";
import { useSubscription } from "./use-subscription";

/**
 * Hook to check if user has a premium plan (non-basic plan)
 * @returns Object with subscription info and premium status
 */
export const usePremiumCheck = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: response, isLoading } = useSubscription(userId);
  const subscription = response?.data;

  const hasLitePlan = subscription?.plan?.name?.toLowerCase().includes('lite');
  const hasPremiumAccess = !hasLitePlan && !!subscription;

  return {
    subscription,
    hasBasicPlan: hasLitePlan,
    hasPremiumAccess,
    isLoading,
    userId,
  };
};
