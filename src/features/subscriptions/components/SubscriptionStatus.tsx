"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "../hooks/use-subscription";
import { Loader2, Calendar, CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

	const planName = subscription.plan?.name || "Desconocido";
	const isDemo = planName.toLowerCase() === "demo";
	const endDate = new Date(subscription.endDate);
	const daysRemaining = differenceInDays(endDate, new Date());
	const isActive = subscription.active && daysRemaining >= 0;

	// Map display names
	const displayName = isDemo ? "Prueba Gratuita" : planName === "lite" ? "Básico" : planName === "plus" ? "Plus" : planName;

	return (
		<Card className={cn("border-l-4", isDemo ? "border-l-yellow-500" : "border-l-green-500")}>
			<CardHeader className="pb-2">
				<CardTitle className="text-lg flex items-center justify-between">
					<div className="flex items-center">
						<CreditCard className="mr-2 h-4 w-4" />
						Tu Suscripción
					</div>
					{isDemo && (
						<span className="text-xs font-normal px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full flex items-center">
							<Clock className="w-3 h-3 mr-1" />
							Trial
						</span>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-between items-start">
					<div>
						<p className="font-bold text-xl">{displayName}</p>
						<div className={cn("flex items-center text-sm mt-1", isActive ? "text-green-600" : "text-red-600")}>
							{isActive ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
							{isActive ? "Activa" : "Expirada"}
						</div>
					</div>
					{isDemo && (
						<div className="text-right">
							<p className="text-2xl font-bold text-primary">{Math.max(0, daysRemaining)}</p>
							<p className="text-xs text-muted-foreground">días restantes</p>
						</div>
					)}
				</div>

				<div className="pt-4 border-t space-y-3">
					<div className="flex justify-between items-center text-sm">
						<div className="flex items-center text-muted-foreground">
							<Calendar className="h-4 w-4 mr-2" />
							{isDemo ? "Expira el:" : "Próximo pago:"}
						</div>
						<span className="font-medium">
							{format(endDate, "dd 'de' MMMM, yyyy", { locale: es })}
						</span>
					</div>

					{isDemo && (
						<Button className="w-full mt-2" size="sm" asChild>
							<Link href="/subscribe?planId=2">Actualizar Plan</Link>
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
