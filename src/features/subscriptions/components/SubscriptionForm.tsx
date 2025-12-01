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
	frequency: string;
	userId?: number; // Optional, if we have it
}

export function SubscriptionForm({ planId, planName, price, frequency, userId }: SubscriptionFormProps) {
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
				await createSubscription(effectiveUserId, planId, frequency);
				toast.success("🎉 Subscription successful! Welcome aboard!");
				router.push("/management"); // Redirect to dashboard
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
						<CardTitle className="text-2xl">Detalles del pago</CardTitle>
						<CardDescription>Completa tu suscripción de manera segura</CardDescription>
					</CardHeader>
					<form onSubmit={handleSubscribe}>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="card-number">Número de tarjeta</Label>
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
									<Label htmlFor="expiry">Fecha de expiración</Label>
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
								<Label htmlFor="name">Nombre del titular</Label>
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
									<span>SSL Encriptado</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Lock className="h-5 w-5 text-green-500" />
									<span>Pago Seguro</span>
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
										Procesando pago...
									</>
								) : (
									`Pagar $${price}`
								)}
							</Button>
							<p className="text-xs text-center text-muted-foreground">
								Al confirmar tu suscripción, aceptas nuestros Términos de Servicio
							</p>
						</CardFooter>
					</form>
				</Card>

				{/* Order Summary */}
				<div className="space-y-6">
					<Card className="border-2 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
						<CardHeader>
							<CardTitle className="text-2xl">Detalle de la orden</CardTitle>
							<CardDescription>Revisa los detalles de tu suscripción</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between pb-4 border-b">
									<div>
										<h3 className="font-semibold text-lg">{planName} Plan</h3>
										<p className="text-sm text-muted-foreground">Suscripción mensual</p>
									</div>
									<div className="text-right">
										<p className="text-2xl font-bold">${price}</p>
										<p className="text-sm text-muted-foreground">/mes</p>
									</div>
								</div>

								<div className="space-y-3">
									<h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
										Incluye	:
									</h4>
									{planName === "Plus" ? (
										<ul className="space-y-2">
											{[
												"Entrada de voz",
												"Recomendaciones avanzadas",
												"Informes detallados",
												"Soporte prioritario",
												"Categorías personalizadas",
												"Alertas de presupuesto",
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
												"Entrada de voz impulsada por IA",
												"Soporte básico",
												"Acceso a presupuestos, reportes y categorías",
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
										<span className="text-muted-foreground">Prueba gratuita de 14 días</span>
										<span className="text-green-500 font-semibold">-${price}</span>
									</div>
									<div className="flex justify-between text-lg font-bold pt-2 border-t">
										<span>Deuda total</span>
										<span>$0.00</span>
									</div>
									<p className="text-xs text-muted-foreground pt-2">
										No serás cobrado hasta que tu prueba gratuita termine el{" "}
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
										<h4 className="font-semibold">Seguro & Encriptado</h4>
										<p className="text-sm text-muted-foreground">
											Tu información de pago está encriptada y segura
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<h4 className="font-semibold">Cancelar en cualquier momento</h4>
										<p className="text-sm text-muted-foreground">
											No compromisos. Cancelar tu suscripción en cualquier momento
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Lock className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
									<div>
										<h4 className="font-semibold">Garantía de devolución de dinero</h4>
										<p className="text-sm text-muted-foreground">
											Devolución total dentro de 30 días si no estás satisfecho
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

