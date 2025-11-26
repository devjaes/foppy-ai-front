"use client";

import { useSearchParams } from "next/navigation";
import { SubscriptionForm } from "@/features/subscriptions/components/SubscriptionForm";
import { useEffect, useState } from "react";
import { Plan } from "@/features/plans/types/plan";
import { getPlans } from "@/features/plans/services/plans.service";
import { Loader2 } from "lucide-react";

export default function SubscribePage() {
	const searchParams = useSearchParams();
	const planId = searchParams.get("planId");
	const [plan, setPlan] = useState<Plan | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPlan = async () => {
			if (!planId) return;
			try {
				const plans = await getPlans();
				const found = plans.find((p) => p.id === Number(planId));
				setPlan(found || null);
			} catch (err) {
				console.error("Error fetching plan:", err);
				// Fallback for demo
				if (planId === "1") {
					setPlan({ id: 1, name: "Basic", price: "9.99", frequency: "monthly", description: "", features: [] });
				} else if (planId === "2") {
					setPlan({ id: 2, name: "Plus", price: "19.99", frequency: "monthly", description: "", features: [] });
				}
			} finally {
				setLoading(false);
			}
		};

		fetchPlan();
	}, [planId]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (!plan) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<p>Plan not found</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background flex items-center justify-center p-4">
			<SubscriptionForm
				planId={plan.id}
				planName={plan.name}
				price={plan.price}
				frequency={plan.frequency}
			/>
		</div>
	);
}

