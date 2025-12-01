import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

interface PremiumFeatureAlertProps {
	feature?: string;
}

export function PremiumFeatureAlert({ feature = "esta función" }: PremiumFeatureAlertProps) {
	return (
		<Alert className="border-yellow-500/50 bg-yellow-500/10">
			<Lock className="h-4 w-4 text-yellow-600" />
			<AlertTitle className="text-yellow-600">Función Premium</AlertTitle>
			<AlertDescription className="text-yellow-600/80">
				{feature.charAt(0).toUpperCase() + feature.slice(1)} está{feature === "reportes" ? "n" : ""} disponible{feature === "reportes" ? "s" : ""} solo para usuarios con plan Plus.
				<Link href="/subscribe?planId=2" className="block mt-2">
					<Button variant="outline" size="sm" className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white">
						Actualizar a Plan Plus
					</Button>
				</Link>
			</AlertDescription>
		</Alert>
	);
}
