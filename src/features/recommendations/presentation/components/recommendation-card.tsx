"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, AlertCircle, Lightbulb, Target, CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IRecommendation,
  RecommendationType,
  RecommendationPriority,
  RECOMMENDATION_TYPE_LABELS,
  RECOMMENDATION_PRIORITY_LABELS,
  QuickAction,
} from "../../interfaces/recommendation.interface";
import {
  useMarkAsViewed,
  useMarkAsDismissed,
  useMarkAsActed,
} from "../../hooks/use-recommendations";

interface RecommendationCardProps {
  recommendation: IRecommendation;
}

const getTypeIcon = (type: RecommendationType) => {
  switch (type) {
    case RecommendationType.SPENDING_ANALYSIS:
      return <AlertCircle className="h-5 w-5" />;
    case RecommendationType.GOAL_OPTIMIZATION:
      return <Target className="h-5 w-5" />;
    case RecommendationType.BUDGET_SUGGESTION:
      return <Lightbulb className="h-5 w-5" />;
    case RecommendationType.DEBT_REMINDER:
      return <CreditCard className="h-5 w-5" />;
    default:
      return <Lightbulb className="h-5 w-5" />;
  }
};

const getPriorityColor = (priority: RecommendationPriority) => {
  switch (priority) {
    case RecommendationPriority.HIGH:
      return "destructive";
    case RecommendationPriority.MEDIUM:
      return "default";
    case RecommendationPriority.LOW:
      return "secondary";
    default:
      return "default";
  }
};

export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const router = useRouter();
  const markViewed = useMarkAsViewed();
  const markDismissed = useMarkAsDismissed();
  const markActed = useMarkAsActed();

  useEffect(() => {
    if (recommendation.status === "PENDING") {
      markViewed.mutate(recommendation.id);
    }
  }, [recommendation.id, recommendation.status, markViewed]);

  const handleQuickAction = (action: QuickAction) => {
    markActed.mutate(recommendation.id);

    if (action.prefilledData) {
      localStorage.setItem(
        "recommendationAction",
        JSON.stringify(action.prefilledData)
      );
    }

    router.push(action.path);
  };

  const handleDismiss = () => {
    markDismissed.mutate(recommendation.id);
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">{getTypeIcon(recommendation.type)}</div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline">
                  {RECOMMENDATION_TYPE_LABELS[recommendation.type]}
                </Badge>
                <Badge variant={getPriorityColor(recommendation.priority)}>
                  {RECOMMENDATION_PRIORITY_LABELS[recommendation.priority]}
                </Badge>
              </div>
              <CardTitle className="text-lg">
                {recommendation.title}
              </CardTitle>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-8 w-8 shrink-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Descartar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-base">
          {recommendation.description}
        </CardDescription>

        {recommendation.actionable && recommendation.actions && (
          <div className="flex flex-wrap gap-2 pt-2">
            {recommendation.actions.map((action, idx) => (
              <Button
                key={idx}
                onClick={() => handleQuickAction(action)}
                variant={idx === 0 ? "default" : "outline"}
                size="sm"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
