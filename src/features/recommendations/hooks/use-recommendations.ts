"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recommendationService } from "../services/recommendation.service";
import { toast } from "sonner";

const RECOMMENDATIONS_KEY = ["recommendations"];

export const useRecommendations = (userId?: string) => {
  return useQuery({
    queryKey: [...RECOMMENDATIONS_KEY, userId], // Include userId in cache key
    queryFn: () => recommendationService.getPending(userId),
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Poll every 5 minutes
    enabled: !!userId,
  });
};

export const useMarkAsViewed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => recommendationService.markAsViewed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECOMMENDATIONS_KEY });
    },
    onError: (error) => {
      console.error("Error marking recommendation as viewed:", error);
    },
  });
};

export const useMarkAsDismissed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => recommendationService.markAsDismissed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECOMMENDATIONS_KEY });
      toast.success("Recomendación descartada");
    },
    onError: (error) => {
      console.error("Error dismissing recommendation:", error);
      toast.error("Error al descartar la recomendación");
    },
  });
};

export const useMarkAsActed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => recommendationService.markAsActed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECOMMENDATIONS_KEY });
    },
    onError: (error) => {
      console.error("Error marking recommendation as acted:", error);
    },
  });
};
