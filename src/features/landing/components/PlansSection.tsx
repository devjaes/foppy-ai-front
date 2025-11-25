"use client";

import { useEffect, useState } from "react";
import { Plan } from "@/features/plans/types/plan";
import { getPlans } from "@/features/plans/services/plans.service";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PlansSection() {
	const [plans, setPlans] = useState<Plan[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPlans = async () => {
			try {
				const data = await getPlans();
				setPlans(data);
			} catch (err) {
				console.error("Error fetching plans:", err);
				// Fallback data for demo if API fails (e.g. DB down)
				setPlans([
					{
						id: 1,
						name: "Basic",
						description: "Perfect for getting started",
						price: "9.99",
						frequency: "monthly",
						features: ["Voice info entry", "Unlimited AI access", "Basic support"],
					},
					{
						id: 2,
						name: "Plus",
						description: "For power users who want more",
						price: "19.99",
						frequency: "monthly",
						features: ["Voice info entry", "Unlimited AI access", "Advanced Recommendations", "Detailed Reports", "Priority support"],
					},
				]);
				setError("Could not load plans from server. Showing demo data.");
			} finally {
				setLoading(false);
			}
		};

		fetchPlans();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center py-20">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<section className="py-20 bg-gradient-to-b from-background to-secondary/20">
			<div className="container px-4 md:px-6">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
						Choose Your Plan
					</h2>
					<p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
						Unlock the full potential of your financial management with our tailored plans.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
					{plans.map((plan) => (
						<Card
							key={plan.id}
							className={cn(
								"relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
								plan.name === "Plus" ? "border-primary shadow-lg bg-primary/5" : "border-border"
							)}
						>
							{plan.name === "Plus" && (
								<div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
									POPULAR
								</div>
							)}
							<CardHeader>
								<CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
								<CardDescription>{plan.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="mb-6">
									<span className="text-4xl font-bold">${plan.price}</span>
									<span className="text-muted-foreground">/{plan.frequency}</span>
								</div>
								<ul className="space-y-3">
									{plan.features.map((feature, index) => (
										<li key={index} className="flex items-center gap-2">
											<Check className="h-5 w-5 text-green-500 flex-shrink-0" />
											<span className="text-sm">{feature}</span>
										</li>
									))}
								</ul>
							</CardContent>
							<CardFooter>
								<Button
									className={cn("w-full", plan.name === "Plus" ? "bg-primary hover:bg-primary/90" : "")}
									variant={plan.name === "Plus" ? "default" : "outline"}
									onClick={() => window.location.href = `/subscribe?planId=${plan.id}`}
								>
									Get Started
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
