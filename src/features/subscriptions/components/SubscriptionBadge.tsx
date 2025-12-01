"use client";

import { useSession } from "next-auth/react";
import { useSubscription } from "../hooks/use-subscription";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { differenceInDays } from "date-fns";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionBadgeProps {
	isOpen: boolean | undefined;
}

export function SubscriptionBadge({ isOpen }: SubscriptionBadgeProps) {
	const { data: session } = useSession();
	const userId = session?.user?.id;
	const { data: response, isLoading } = useSubscription(userId);
	const subscription = response?.data;

	if (isLoading || !subscription) return null;

	const planName = subscription.plan?.name || "Plan";
	const isDemo = planName.toLowerCase().includes("demo");
	const endDate = new Date(subscription.endDate);
	const daysRemaining = differenceInDays(endDate, new Date());
	const totalDays = subscription.plan?.durationDays || 15;
	const progress = Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100));

	if (!isOpen) {
		return null;
	}

	return (
		<div className="mt-auto pt-4">
			<div className={cn(
				"rounded-xl p-4 border transition-all duration-300",
				isDemo
					? "bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20"
					: "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/10"
			)}>
				<div className="flex items-center gap-2 mb-3">
					<div className={cn(
						"p-1.5 rounded-md",
						isDemo ? "bg-yellow-500/20 text-yellow-600" : "bg-primary/20 text-primary"
					)}>
						<Sparkles className="h-4 w-4" />
					</div>
					<span className="font-semibold text-sm truncate">{planName}</span>
				</div>

				{isDemo ? (
					<div className="space-y-3">
						<div className="space-y-1">
							<div className="flex justify-between text-xs font-medium">
								<span className="text-muted-foreground">Prueba</span>
								<span className="text-yellow-600">{Math.max(0, daysRemaining)} días</span>
							</div>
							<Progress value={progress} className="h-1.5 bg-yellow-500/10" indicatorClassName="bg-yellow-500" />
						</div>
						<Button size="sm" className="w-full h-8 text-xs bg-yellow-600 hover:bg-yellow-700 text-white border-0" asChild>
							<Link href="/#plans">
								Ver Planes
							</Link>
						</Button>
					</div>
				) : (
					<div className="text-xs text-muted-foreground">
						Tu plan está activo y funcionando correctamente.
					</div>
				)}
			</div>
		</div>
	);
}
