"use client";

import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";

interface TapToInputProps {
	name: string;
	label: string;
	placeholder?: string;
	type?: "text" | "number" | "date";
	className?: string;
	formatValue?: (value: any) => string;
}

export function TapToInput({
	name,
	label,
	placeholder,
	type = "text",
	className,
	formatValue,
}: TapToInputProps) {
	const { register, watch, setValue, formState: { errors } } = useFormContext();
	const [isOpen, setIsOpen] = useState(false);
	const value = watch(name);
	const inputRef = useRef<HTMLInputElement>(null);
	const error = errors[name];

	// Focus input when dialog opens
	useEffect(() => {
		if (isOpen && type !== "date") {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	}, [isOpen, type]);

	const displayValue = () => {
		if (!value) return null;

		if (formatValue) return formatValue(value);

		if (type === "date") {
			try {
				return format(new Date(value), "dd 'de' MMMM, yyyy", { locale: es });
			} catch (e) {
				return value;
			}
		}

		return value;
	};

	const handleSave = () => {
		setIsOpen(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSave();
		}
	};

	return (
		<>
			<div
				onClick={() => setIsOpen(true)}
				className={cn(
					"group cursor-pointer py-4 transition-all duration-200 hover:bg-[hsl(var(--tap-input-hover))] rounded-xl px-4 -mx-4",
					className
				)}
			>
				<div className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-primary transition-colors">
					{label}
				</div>
				<div className={cn(
					"text-2xl font-semibold break-words",
					!value && "text-muted-foreground/40 italic"
				)}>
					{displayValue() || placeholder || "Toca para escribir..."}
				</div>
				{error && (
					<p className="text-sm text-destructive mt-1">{error.message as string}</p>
				)}
			</div>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="sm:max-w-md top-[30%] translate-y-[-30%]">
					<DialogHeader>
						<DialogTitle>{label}</DialogTitle>
					</DialogHeader>

					<div className="py-4">
						{type === "date" ? (
							<div className="flex justify-center">
								<Calendar
									mode="single"
									selected={value ? new Date(value) : undefined}
									onSelect={(date) => {
										setValue(name, date, { shouldValidate: true });
										setIsOpen(false);
									}}
									initialFocus
								/>
							</div>
						) : (
							<Input
								{...register(name, { valueAsNumber: type === "number" })}
								ref={(e) => {
									// React Hook Form ref
									register(name).ref(e);
									// Local ref for focus
									// @ts-ignore
									inputRef.current = e;
								}}
								type={type}
								className="text-lg py-6"
								placeholder={placeholder}
								onKeyDown={handleKeyDown}
								autoComplete="off"
							/>
						)}
					</div>

					{type !== "date" && (
						<div className="flex justify-end">
							<Button onClick={handleSave}>Aceptar</Button>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
