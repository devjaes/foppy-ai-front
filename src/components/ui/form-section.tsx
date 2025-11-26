import { cn } from "@/lib/utils";

interface FormSectionProps {
	children: React.ReactNode;
	className?: string;
	title?: string;
}

export function FormSection({ children, className, title }: FormSectionProps) {
	return (
		<div className={cn("space-y-6 w-full", className)}>
			{title && (
				<h3 className="text-lg font-semibold tracking-tight mb-4">{title}</h3>
			)}
			<div className="space-y-2 divide-y divide-border/40">
				{children}
			</div>
		</div>
	);
}
