"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, Shield, Lock, Check } from "lucide-react";
import { createSubscription } from "../services/subscription.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SubscriptionFormProps {
	planId: number;
	planName: string;
	price: string;
	userId?: number; // Optional, if we have it
}

export function SubscriptionForm({ planId, planName, price, userId }: SubscriptionFormProps) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { data: session, status } = useSession();

	// Use session user ID if available, otherwise use provided userId
	const effectiveUserId = session?.user?.id ? Number(session.user.id) : userId;

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();

		// Check if user is authenticated
		if (status === "unauthenticated") {
			toast.error("Please log in to subscribe");
			router.push("/login");
			return;
		}

		setLoading(true);

		// Simulate payment processing
		await new Promise((resolve) => setTimeout(resolve, 1500));

		try {
			if (effectiveUserId) {
				await createSubscription(effectiveUserId, planId);
				toast.success("🎉 Subscription successful! Welcome aboard!");
				router.push("/management/dashboard"); // Redirect to dashboard
			} else {
				// If no user, redirect to login
				toast.error("Please log in to complete subscription");
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
		<div className="w-full max-w-5xl mx-auto">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Payment Form */}
				<Card className="border-2 shadow-xl">
					<CardHeader className="space-y-1 pb-6">
						<CardTitle className="text-2xl">Payment Details</CardTitle>
						<CardDescription>Complete your subscription securely</CardDescription>
					</CardHeader>
					<form onSubmit={handleSubscribe}>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="card-number">Card Number</Label>
								<div className="relative">
									<CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
									<Input
										id="card-number"
										placeholder="1234 5678 9012 3456"
										className="pl-10 h-12 text-base"
										required
									/>
								</div>
								<div className="flex gap-2 mt-2">
									<img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-8" />
									<img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-8" />
									<img src="https://img.icons8.com/color/48/amex.png" alt="Amex" className="h-8" />
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="expiry">Expiry Date</Label>
									<Input
										id="expiry"
										placeholder="MM/YY"
										className="h-12 text-base"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="cvc">CVC</Label>
									<Input
										id="cvc"
										placeholder="123"
										className="h-12 text-base"
										maxLength={3}
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="name">Cardholder Name</Label>
								<Input
									id="name"
									placeholder="John Doe"
									className="h-12 text-base"
									required
								/>
							</div>

							{/* Security badges */}
							<div className="flex items-center gap-4 pt-4 border-t">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Shield className="h-5 w-5 text-green-500" />
									<span>SSL Encrypted</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Lock className="h-5 w-5 text-green-500" />
									<span>Secure Payment</span>
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col gap-4 pt-6">
							<Button
								type="submit"
								className="w-full h-12 text-base bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all"
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Processing Payment...
									</>
								) : (
									`Pay $${price}`
								)}
							</Button>
							<p className="text-xs text-center text-muted-foreground">
								By confirming your subscription, you agree to our Terms of Service
							</p>
						</CardFooter>
					</form>
				</Card>

				{/* Order Summary */}
				<div className="space-y-6">
					<Card className="border-2 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
						<CardHeader>
							<CardTitle className="text-2xl">Order Summary</CardTitle>
							<CardDescription>Review your subscription details</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between pb-4 border-b">
									<div>
										<h3 className="font-semibold text-lg">{planName} Plan</h3>
										<p className="text-sm text-muted-foreground">Monthly subscription</p>
									</div>
									<div className="text-right">
										<p className="text-2xl font-bold">${price}</p>
										<p className="text-sm text-muted-foreground">/month</p>
									</div>
								</div>

								<div className="space-y-3">
									<h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
										What's included:
									</h4>
									{planName === "Plus" ? (
										<ul className="space-y-2">
											{[
												"Voice info entry",
												"Unlimited AI access",
												"Advanced Recommendations",
												"Detailed Reports",
												"Priority support",
												"Custom categories",
												"Budget alerts",
												"Multi-device sync"
											].map((feature, idx) => (
												<li key={idx} className="flex items-start gap-2">
													<Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
													<span className="text-sm">{feature}</span>
												</li>
											))}
										</ul>
									) : (
										<ul className="space-y-2">
											{[
												"Voice info entry",
												"Unlimited AI access",
												"Basic support",
												"Mobile app access",
												"Export reports"
											].map((feature, idx) => (
												<li key={idx} className="flex items-start gap-2">
													<Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
													<span className="text-sm">{feature}</span>
												</li>
											))}
										</ul>
									)}
								</div>

								<div className="pt-4 border-t space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Subtotal</span>
										<span>${price}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">14-day free trial</span>
										<span className="text-green-500 font-semibold">-${price}</span>
									</div>
									<div className="flex justify-between text-lg font-bold pt-2 border-t">
										<span>Due today</span>
										<span>$0.00</span>
									</div>
									<p className="text-xs text-muted-foreground pt-2">
										You won't be charged until your trial ends on{" "}
										{new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Trust indicators */}
					<Card className="border-2">
						<CardContent className="pt-6">
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<Shield className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<h4 className="font-semibold">Secure & Encrypted</h4>
										<p className="text-sm text-muted-foreground">
											Your payment information is encrypted and secure
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<h4 className="font-semibold">Cancel Anytime</h4>
										<p className="text-sm text-muted-foreground">
											No commitments. Cancel your subscription anytime
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Lock className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<h4 className="font-semibold">Money-Back Guarantee</h4>
										<p className="text-sm text-muted-foreground">
											Full refund within 30 days if you're not satisfied
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

