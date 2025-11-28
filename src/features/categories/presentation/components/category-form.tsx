"use client";

import { useCategoryForm } from "../../hooks/use-category-form";
import { FormProvider } from "react-hook-form";
import { Save, ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Category } from "../../interfaces/categories.interface";
import { TapToInput } from "@/components/ui/tap-to-input";

interface CategoryFormProps {
	category?: Category;
}

export default function CategoryForm({ category }: CategoryFormProps) {
	const { form, onSubmit, onCancel, isSubmitting } = useCategoryForm({
		category,
	});

	return (
		<FormProvider {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col w-full max-w-2xl mx-auto pb-24 relative min-h-[80vh]"
			>
				{/* Header Actions */}
				<div className="flex justify-between items-center mb-6">
					<Button
						onClick={onCancel}
						type="button"
						variant="ghost"
						size="icon"
						className="rounded-full hover:bg-accent"
					>
						<ArrowLeft className="h-6 w-6" />
					</Button>
					<div className="text-lg font-medium">
						{category ? "Editar Categoría" : "Nueva Categoría"}
					</div>
					<div className="w-10" /> {/* Spacer for centering */}
				</div>

				<div className="space-y-8 px-4 mt-8">
					{/* Icon Input - Centered and Large */}
					<div className="flex justify-center mb-8">
						<div className="relative">
							<TapToInput
								name="icon"
								label="Icono"
								placeholder="📁"
								className="text-6xl text-center w-24 h-24 flex items-center justify-center bg-accent/20 rounded-full"
							/>
							<div className="absolute -bottom-2 w-full text-center text-xs text-muted-foreground">
								Toca para cambiar
							</div>
						</div>
					</div>

					{/* Name Input */}
					<TapToInput
						name="name"
						label="Nombre de la Categoría"
						placeholder="Ej. Comida, Transporte"
						className="text-3xl font-bold text-center"
					/>

					{/* Description Input */}
					<TapToInput
						name="description"
						label="Descripción (Opcional)"
						placeholder="Breve descripción..."
						className="text-xl text-muted-foreground text-center"
					/>
				</div>

				{/* Floating Save Button */}
				<Button
					disabled={isSubmitting}
					type="submit"
					size="icon"
					className="fixed bottom-6 right-24 h-14 w-14 rounded-full shadow-lg z-40 bg-primary hover:bg-primary/90 text-primary-foreground animate-fade-in"
				>
					{isSubmitting ? <LoadingSpinner className="text-white" /> : <Save className="h-6 w-6" />}
				</Button>
			</form>
		</FormProvider>
	);
}
