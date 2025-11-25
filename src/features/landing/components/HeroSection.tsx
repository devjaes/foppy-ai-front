import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
	return (
		<section className="relative py-20 md:py-32 overflow-hidden bg-background">
			<div className="container px-4 md:px-6 relative z-10">
				<div className="flex flex-col items-center text-center space-y-8">
					<div className="space-y-4 max-w-3xl">
						<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-600 animate-gradient-x">
							Master Your Finances with AI
						</h1>
						<p className="mx-auto text-xl text-muted-foreground max-w-[700px]">
							Effortlessly track, analyze, and optimize your spending with our intelligent financial assistant. Voice entry, smart insights, and more.
						</p>
					</div>
					<div className="flex flex-col sm:flex-row gap-4">
						<Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
							<Link href="#plans">Get Started</Link>
						</Button>
						<Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full" asChild>
							<Link href="/login">Log In</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* Background decoration */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl -z-10" />
		</section>
	);
}
