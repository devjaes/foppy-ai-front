"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, TrendingUp, Shield, Zap, Users, Star } from "lucide-react";
import { useSession } from "next-auth/react";

export function HeroSection() {
	const { data: session } = useSession();
	return (
		<section className="relative py-20 md:py-32 overflow-hidden bg-background justify-center">
			{/* Animated background elements */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl animate-float" />
				<div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-tl from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-float-delayed" />
			</div>

			<div className="container max-w-7xl px-4 md:px-8 lg:px-12 relative z-10">
				<div className="flex flex-col items-center text-center space-y-12">
					{/* Main content */}
					<div className="space-y-7 max-w-5xl">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4 animate-fade-in">
							<Sparkles className="h-4 w-4" />
							<span>Inteligencia Artificial para Finanzas</span>
						</div>

						<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-600 animate-gradient-x">
							Toma el control total de tus finanzas con IA
						</h1>

						<p className="mx-auto text-xl md:text-2xl text-muted-foreground max-w-[800px] leading-relaxed">
							Rastrea, analiza y optimiza tus gastos sin esfuerzo con nuestro asistente financiero inteligente. Entrada de voz, análisis inteligentes y recomendaciones personalizadas.
						</p>
					</div>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
						<Button
							size="lg"
							className="text-lg px-10 py-7 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
							asChild
						>
							<Link href="#plans">
								Empieza gratis
								<Zap className="ml-2 h-5 w-5" />
							</Link>
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="text-lg px-10 py-7 rounded-full border-2 hover:bg-primary/5 transition-all duration-300 hover:scale-105"
							asChild
						>
							<Link href={session ? "/management" : "/login"}>
								{session ? "Ir al Dashboard" : "Inicia Sesión"}
							</Link>
						</Button>
					</div>

					{/* Feature highlights */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl mt-16">
						<div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 group">
							<div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
								<Sparkles className="h-6 w-6 text-primary" />
							</div>
							<h3 className="font-semibold text-lg">Inteligencia Artificial</h3>
							<p className="text-sm text-muted-foreground text-center">Recomendaciones inteligentes impulsadas por IA</p>
						</div>

						<div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 hover:scale-105 group">
							<div className="p-3 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
								<TrendingUp className="h-6 w-6 text-blue-500" />
							</div>
							<h3 className="font-semibold text-lg">Rastreo en tiempo real</h3>
							<p className="text-sm text-muted-foreground text-center">Monitorea tus finanzas en tiempo real</p>
						</div>

						<div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/10 hover:border-green-500/30 transition-all duration-300 hover:scale-105 group">
							<div className="p-3 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
								<Shield className="h-6 w-6 text-green-500" />
							</div>
							<h3 className="font-semibold text-lg">Seguridad de banco</h3>
							<p className="text-sm text-muted-foreground text-center">Tu datos son encriptados y protegidos</p>
						</div>

						<div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:scale-105 group">
							<div className="p-3 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
								<Zap className="h-6 w-6 text-orange-500" />
							</div>
							<h3 className="font-semibold text-lg">Entrada de voz</h3>
							<p className="text-sm text-muted-foreground text-center">Agrega transacciones con solo tu voz</p>
						</div>
					</div>

					{/* Social proof */}
					<div className="flex flex-col sm:flex-row items-center gap-8 pt-8 border-t border-border/50 w-full max-w-3xl">
						<div className="flex items-center gap-2">
							<Users className="h-5 w-5 text-primary" />
							<span className="text-sm text-muted-foreground">
								<span className="font-bold text-foreground">10,000+</span> usuarios activos
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="flex">
								{[...Array(5)].map((_, i) => (
									<Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
								))}
							</div>
							<span className="text-sm text-muted-foreground">
								<span className="font-bold text-foreground">4.9/5</span> calificación
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Shield className="h-5 w-5 text-green-500" />
							<span className="text-sm text-muted-foreground">
								<span className="font-bold text-foreground">100%</span> seguro
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
