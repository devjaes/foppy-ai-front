"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Plan } from "@/features/plans/types/plan";
import { getPlans } from "@/features/plans/services/plans.service";
import { Check, Loader2, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function PlansSection() {
	const [plans, setPlans] = useState<Plan[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { data: session, status } = useSession();
	const router = useRouter();

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
						name: "Básico",
						description: "Perfecto para comenzar con la gestión financiera inteligente",
						price: "3.99",
						frequency: "mensual",
						features: ["Entrada de voz", "Acceso ilimitado a IA", "Soporte básico", "Acceso a la app móvil", "Informes exportables"],
					},
					{
						id: 2,
						name: "Premium",
						description: "Para usuarios avanzados que quieren insights avanzados y soporte prioritario",
						price: "9.99",
						frequency: "mensual",
						features: ["Entrada de voz", "Acceso ilimitado a IA", "Recomendaciones avanzadas", "Informes detallados", "Soporte prioritario", "Categorías personalizadas", "Alertas de presupuesto", "Sincronización multi-dispositivo"],
					},
				]);
				setError("Could not load plans from server. Showing demo data.");
			} finally {
				setLoading(false);
			}
		};

		fetchPlans();
	}, []);

	const handlePlanSelection = (planId: number) => {
		// Check if user is authenticated
		if (status === "unauthenticated") {
			// Redirect to login with return URL
			router.push(`/login?callbackUrl=/subscribe?planId=${planId}`);
		} else if (status === "authenticated") {
			// User is authenticated, go to subscribe page
			router.push(`/subscribe?planId=${planId}`);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center py-20">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<section id="plans" className="py-20 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
			{/* Background decoration */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-gradient-to-l from-pink-500/5 to-blue-500/5 rounded-full blur-3xl" />
			</div>

			<div className="container px-4 md:px-6 relative z-10">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-pink-600 mb-4">
						Elige tu Plan
					</h2>
					<p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
						Descubre la potencialidad completa de tu gestión financiera con nuestros planes personalizados. Comienza gratis por 14 días, sin tarjeta de crédito.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
					{plans.map((plan) => (
						<Card
							key={plan.id}
							className={cn(
								"relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group",
								plan.name === "Plus"
									? "border-primary shadow-xl bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5"
									: "border-border hover:border-primary/50"
							)}
						>
							{plan.name === "Plus" && (
								<div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground px-4 py-1.5 text-sm font-bold rounded-bl-lg shadow-lg">
									⭐ MÁS POPULAR
								</div>
							)}

							<CardHeader className="pb-8 pt-8">
								<CardTitle className="text-3xl font-bold mb-2">{plan.name}</CardTitle>
								<CardDescription className="text-base">{plan.description}</CardDescription>
							</CardHeader>

							<CardContent className="space-y-6">
								<div className="mb-8">
									<div className="flex items-baseline gap-2">
										<span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
											${plan.price}
										</span>
										<span className="text-muted-foreground text-lg">/{plan.frequency}</span>
									</div>
									<p className="text-sm text-muted-foreground mt-2">14-día de prueba gratuita incluida</p>
								</div>

								<div className="space-y-1 mb-4">
									<h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
										Qué se incluye:
									</h4>
									<ul className="space-y-3">
										{plan.features.map((feature, index) => (
											<li key={index} className="flex items-start gap-3 group/item">
												<div className="mt-0.5">
													<Check className="h-5 w-5 text-green-500 flex-shrink-0" />
												</div>
												<span className="text-sm leading-relaxed">{feature}</span>
											</li>
										))}
									</ul>
								</div>
							</CardContent>

							<CardFooter className="pt-6 pb-8">
								<Button
									className={cn(
										"w-full text-base py-6 rounded-xl transition-all duration-300 group-hover:scale-105",
										plan.name === "Plus"
											? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl"
											: "bg-primary hover:bg-primary/90"
									)}
									onClick={() => handlePlanSelection(plan.id)}
								>
									{status === "authenticated" ? "Suscríbete ahora" : "Comienza ahora"}
									<ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>

				{/* Feature comparison table */}
				<div className="max-w-4xl mx-auto mt-20">
					<h3 className="text-2xl font-bold text-center mb-8">Comparar planes</h3>
					<div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
						<div className="grid grid-cols-3 gap-4 p-6 bg-secondary/20 border-b border-border">
							<div className="font-semibold">Características</div>
							<div className="font-semibold text-center">Básico</div>
							<div className="font-semibold text-center">Premium</div>
						</div>

						{[
							{ name: "Entrada de voz", basic: true, plus: true },
							{ name: "Aplicación móvil", basic: true, plus: true },
							{ name: "Informes avanzados", basic: false, plus: true },
							{ name: "Categorías personalizadas", basic: false, plus: true },
							{ name: "Alertas de presupuesto", basic: false, plus: true },
							{ name: "Soporte prioritario", basic: false, plus: true },
						].map((feature, idx) => (
							<div
								key={idx}
								className={cn(
									"grid grid-cols-3 gap-4 p-6 border-b border-border last:border-b-0",
									idx % 2 === 0 ? "bg-secondary/5" : ""
								)}
							>
								<div className="flex items-center gap-2">
									<span>{feature.name}</span>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												<Info className="h-4 w-4 text-muted-foreground" />
											</TooltipTrigger>
											<TooltipContent>
												<p className="max-w-xs">Aprende más sobre {feature.name}</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
								<div className="flex justify-center">
									{feature.basic ? (
										<Check className="h-5 w-5 text-green-500" />
									) : (
										<span className="text-muted-foreground">—</span>
									)}
								</div>
								<div className="flex justify-center">
									{feature.plus ? (
										<Check className="h-5 w-5 text-green-500" />
									) : (
										<span className="text-muted-foreground">—</span>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* FAQ Section */}
				<div className="max-w-3xl mx-auto mt-20">
					<h3 className="text-2xl font-bold text-center mb-8">Preguntas frecuentes</h3>
					<div className="space-y-4">
						{[
							{
								q: "¿Puedo cambiar de plan?",
								a: "¡Sí! Puedes subir o bajar de plan en cualquier momento. Los cambios surgen inmediatamente."
							},
							{
								q: "¿Hay una prueba gratuita?",
								a: "¡Sí! Todos los planes vienen con una prueba gratuita de 14 días. No es necesario tarjeta de crédito."
							},
							{
								q: "¿Qué métodos de pago aceptas?",
								a: "Aceptamos todas las tarjetas de crédito, débito y PayPal."
							},
							{
								q: "¿Puedo cancelar en cualquier momento?",
								a: "¡Sí! Puedes cancelar tu suscripción en cualquier momento. No preguntas."
							}
						].map((faq, idx) => (
							<Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
								<CardHeader>
									<CardTitle className="text-lg">{faq.q}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground">{faq.a}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

