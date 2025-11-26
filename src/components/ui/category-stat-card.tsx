import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format-currency";

interface CategoryStatCardProps {
	icon: string;
	name: string;
	count: number;
	amount?: number;
	onClick?: () => void;
	className?: string;
	isActive?: boolean;
}

export function CategoryStatCard({
	icon,
	name,
	count,
	amount,
	onClick,
	className,
	isActive,
}: CategoryStatCardProps) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"flex flex-col items-center justify-center p-3 rounded-2xl min-w-[80px] transition-all duration-200",
				"bg-card border border-border/50 hover:bg-accent/50",
				isActive && "bg-accent border-primary/20 ring-1 ring-primary/20",
				className
			)}
		>
			<div className="text-2xl mb-1">{icon}</div>
			<div className="text-xs font-medium text-muted-foreground truncate w-full text-center mb-1">
				{name}
			</div>
			<div className="flex items-center gap-1">
				<span className={cn(
					"text-sm font-bold",
					count > 0 ? "text-foreground" : "text-muted-foreground"
				)}>
					{count}
				</span>
			</div>
			{amount !== undefined && amount > 0 && (
				<div className="text-[10px] text-muted-foreground mt-1">
					{formatCurrency(amount)}
				</div>
			)}
		</button>
	);
}
