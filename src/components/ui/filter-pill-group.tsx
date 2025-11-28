"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FilterOption {
	value: string | number;
	label: string;
	icon?: React.ReactNode;
}

interface FilterPillGroupProps {
	options: FilterOption[];
	value?: string | number;
	onChange: (value: string | number) => void;
	placeholder?: string;
	className?: string;
	variant?: "default" | "outline" | "ghost";
}

export function FilterPillGroup({
	options,
	value,
	onChange,
	placeholder = "Select",
	className,
	variant = "outline",
}: FilterPillGroupProps) {
	const selectedOption = options.find((opt) => opt.value === value);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className={cn(
						"flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
						"border border-border/50 hover:bg-accent hover:text-accent-foreground",
						value ? "bg-accent/50 text-accent-foreground" : "bg-transparent text-muted-foreground",
						className
					)}
				>
					{selectedOption?.icon && <span className="mr-1">{selectedOption.icon}</span>}
					{selectedOption?.label || placeholder}
					<ChevronDown className="h-3 w-3 opacity-50 ml-1" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[200px]">
				{options.map((option) => (
					<DropdownMenuItem
						key={option.value}
						onSelect={() => onChange(option.value)}
						className={cn(
							"flex items-center gap-2 cursor-pointer",
							value === option.value && "bg-accent text-accent-foreground"
						)}
					>
						{option.icon}
						{option.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
