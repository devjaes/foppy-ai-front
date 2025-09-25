import { useMutation, useQuery } from "@tanstack/react-query";
import { GOALS_KEYS } from "../constants/goals-keys";
import { GoalService } from "../services/goal.datasource";
import { GoalCreate, GoalUpdate } from "../interfaces/ goals.interface";
import queryClient from "@/core/infrastructure/react-query/query-client";
import { useRouter } from "next/navigation";

const goalService = GoalService.getInstance();

export const useFindAllGoals = () => {
  return useQuery({
    queryKey: GOALS_KEYS.GOALS,
    queryFn: () => goalService.getGoals(),
  });
};

export const useFindGoalById = (id: string) => {
  return useQuery({
    queryKey: GOALS_KEYS.GOAL(id),
    queryFn: () => goalService.getGoal(Number(id)),
    enabled: !!id,
  });
};

export const useFindGoalUsersById = (id: string) => {
  return useQuery({
    queryKey: GOALS_KEYS.GOAL_USERS(id),
    queryFn: () => goalService.getUserGoals(Number(id)),
    enabled: !!id,
  });
};

export const useFindSharedGoalUsersById = (id: string) => {
  return useQuery({
    queryKey: GOALS_KEYS.SHARED_GOAL_USERS(id),
    queryFn: () => goalService.getSharedGoals(Number(id)),
    enabled: !!id,
  });
};

export const useCreateGoal = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (goal: GoalCreate) => goalService.createGoal(goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.GOALS });
      router.push("/management/goals");
    },
  });
};

export const useUpdateGoal = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({ id, goal }: { id: number; goal: GoalUpdate }) =>
      goalService.updateGoal(id, goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.GOALS });
      router.push("/management/goals");
    },
  });
};

export const useDeleteGoal = () => {
  return useMutation({
    mutationFn: (id: number) => goalService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.GOALS });
    },
  });
};

export const useUpdateGoalProgress = () => {
  return useMutation({
    mutationFn: ({
      goalId,
      userId,
      amount,
    }: {
      goalId: number;
      userId: number;
      amount: number;
    }) => goalService.updateGoalProgress(goalId, userId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.GOALS });
    },
  });
};

export const useCreateGoalContribution = () => {
  return useMutation({
    mutationFn: ({
      goalId,
      userId,
      amount,
      paymentMethodId,
      description,
    }: {
      goalId: number;
      userId: number;
      amount: number;
      paymentMethodId?: number;
      description?: string;
    }) =>
      goalService.createGoalContribution(
        goalId,
        userId,
        amount,
        paymentMethodId,
        description
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.GOALS });
    },
  });
};

export const useFindGoalContributions = (goalId: string) => {
  return useQuery({
    queryKey: GOALS_KEYS.GOAL_CONTRIBUTIONS(goalId),
    queryFn: () => goalService.getGoalContributions(Number(goalId)),
    enabled: !!goalId,
  });
};

export const useDeleteGoalContribution = () => {
  return useMutation({
    mutationFn: (id: number) => goalService.deleteGoalContribution(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.GOALS });
    },
  });
};

export const useFindGoalTransactions = (goalId: string) => {
  return useQuery({
    queryKey: GOALS_KEYS.GOAL_TRANSACTIONS(goalId),
    queryFn: () => goalService.getGoalTransactions(Number(goalId)),
    enabled: !!goalId,
  });
};
