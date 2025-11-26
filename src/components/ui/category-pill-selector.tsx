"use client";

import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
	id: number | string;
	name: string;
	icon?: string; // Emoji or icon name
}

interface CategoryPillSelectorProps {
	name: string;
	categories: Category[];
	label?: string;
	onAddCategory?: () => void;
	className?: string;
}

export function CategoryPillSelector({
	name,
	categories,
	label,
	onAddCategory,
	className,
}: CategoryPillSelectorProps) {
	const { watch, setValue, formState: { errors } } = useFormContext();
	const value = watch(name);
	const error = errors[name];

	const handleSelect = (categoryId: number | string) => {
		setValue(name, categoryId, { shouldValidate: true });
	};

	return (
		<div className={cn("py-4 -mx-4 px-4", className)}>
			{label && (
				<div className="text-sm font-medium text-muted-foreground mb-3">
					{label}
				</div>
			)}

			<div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar snap-x">
				{onAddCategory && (
					<Button
						type="button"
						variant="outline"
						size="icon"
						className="h-12 w-12 rounded-full shrink-0 border-dashed border-2"
						onClick={onAddCategory}
					>
						<Plus className="h-5 w-5" />
					</Button>
				)}

				{categories.map((category) => {
					const isSelected = value == category.id; // Loose equality for string/number match

					return (
						<button
							key={category.id}
							type="button"
							onClick={() => handleSelect(category.id)}
							className={cn(
								"flex items-center gap-2 px-4 h-12 rounded-full transition-all duration-200 snap-start shrink-0 border",
								isSelected
									? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
									: "bg-card hover:bg-accent hover:text-accent-foreground border-border"
							)}
						>
							<span className="text-lg">{category.icon || "🏷️"}</span>
							<span className={cn("font-medium", isSelected ? "text-primary-foreground" : "")}>
								{category.name}
							</span>
						</button>
					);
				})}
			</div>

			{error && (
				<p className="text-sm text-destructive mt-1">{error.message as string}</p>
			)}
		</div>
	);
}
