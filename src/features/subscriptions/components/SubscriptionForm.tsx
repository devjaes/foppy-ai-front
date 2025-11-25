"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard } from "lucide-react";
import { createSubscription } from "../services/subscription.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SubscriptionFormProps {
	planId: number;
	planName: string;
	price: string;
	userId?: number; // Optional, if we have it
}

export function SubscriptionForm({ planId, planName, price, userId }: SubscriptionFormProps) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Simulate payment processing
		await new Promise((resolve) => setTimeout(resolve, 1500));

		try {
			if (userId) {
				await createSubscription(userId, planId);
				toast.success("Subscription successful!");
				router.push("/management/dashboard"); // Redirect to dashboard
			} else {
				// If no user, maybe redirect to login or show success for demo
				toast.success("Payment successful! Please login to complete setup.");
				router.push("/login");
			}
		} catch (error) {
			console.error("Subscription error:", error);
			toast.error("Failed to process subscription. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>Subscribe to {planName}</CardTitle>
				<CardDescription>Complete your subscription for ${price}/month</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubscribe}>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="card-number">Card Number</Label>
						<div className="relative">
							<CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input id="card-number" placeholder="0000 0000 0000 0000" className="pl-9" required />
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="expiry">Expiry Date</Label>
							<Input id="expiry" placeholder="MM/YY" required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="cvc">CVC</Label>
							<Input id="cvc" placeholder="123" required />
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="name">Cardholder Name</Label>
						<Input id="name" placeholder="John Doe" required />
					</div>
				</CardContent>
				<CardFooter>
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Processing...
							</>
						) : (
							`Pay $${price}`
						)}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
