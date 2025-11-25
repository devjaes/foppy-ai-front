"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "../hooks/use-subscription";
import { Loader2, Calendar, CreditCard, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SubscriptionStatusProps {
	userId: string | number | undefined;
}

export function SubscriptionStatus({ userId }: SubscriptionStatusProps) {
	const { data: response, isLoading } = useSubscription(userId);
	const subscription = response?.data;

	if (isLoading) {
		return (
			<Card>
				<CardContent className="flex justify-center items-center py-6">
					<Loader2 className="h-6 w-6 animate-spin" />
				</CardContent>
			</Card>
		);
	}

	if (!subscription) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center">
						<CreditCard className="mr-2 h-4 w-4" />
						Suscripción
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground mb-4">No tienes una suscripción activa.</p>
					<Button asChild>
						<Link href="/#plans">Ver Planes</Link>
					</Button>
				</CardContent>
			</Card>
		);
	}

	// Mock plan name based on planId if not populated
	const planName = subscription.planId === 1 ? "Basic" : subscription.planId === 2 ? "Plus" : "Unknown";

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg flex items-center">
					<CreditCard className="mr-2 h-4 w-4" />
					Tu Suscripción
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-between items-center">
					<div>
						<p className="font-semibold text-lg">{planName} Plan</p>
						<div className="flex items-center text-sm text-green-600">
							<CheckCircle className="h-3 w-3 mr-1" />
							{subscription.status}
						</div>
					</div>
					<Button variant="outline" size="sm" asChild>
						<Link href="/#plans">Cambiar Plan</Link>
					</Button>
				</div>

				<div className="pt-4 border-t">
					<div className="flex items-center text-sm text-muted-foreground">
						<Calendar className="h-4 w-4 mr-2" />
						Próximo pago:
					</div>
					<p className="font-medium mt-1">
						{format(new Date(subscription.nextPaymentDate), "dd 'de' MMMM, yyyy")}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
