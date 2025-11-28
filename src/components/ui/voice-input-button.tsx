"use client";

import { useState } from "react";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AudioService } from "@/features/audio/services/audio.service";
import { toast } from "sonner";
import { FopyAudioModal } from "@/components/ui/fopy-audio-modal";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";

interface VoiceInputButtonProps {
	className?: string;
	onSuccess?: (data: any) => void;
	variant?: "floating" | "inline";
	/** If true, will populate the form fields instead of navigating */
	populateForm?: boolean;
}

export function VoiceInputButton({
	className,
	onSuccess,
	variant = "floating",
	populateForm = true
}: VoiceInputButtonProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const router = useRouter();
	const audioService = AudioService.getInstance();

	// Try to get form context, but don't fail if it doesn't exist
	let formContext: ReturnType<typeof useFormContext> | null = null;
	try {
		formContext = useFormContext();
	} catch (e) {
		// Not in a form context, that's ok
	}

	const handleAudioCaptured = async (audioBlob: Blob) => {
		try {
			setIsProcessing(true);
			const response = await audioService.sendAudio(audioBlob);

			toast.success("Audio procesado con éxito");

			setIsProcessing(false);

			if (response.formData?.schema) {
				// If we have form context and should populate, do so
				if (populateForm && formContext) {
					const schema = response.formData.schema;

					// Populate all fields from the schema
					Object.entries(schema).forEach(([key, value]) => {
						if (value !== null && value !== undefined) {
							// Special handling for dates
							if (key.includes('date') || key === 'month') {
								formContext!.setValue(key, new Date(value as string), { shouldValidate: true });
							} else {
								formContext!.setValue(key, value, { shouldValidate: true });
							}
						}
					});

					toast.success("Campos completados automáticamente");

					if (onSuccess) {
						onSuccess(schema);
					}

					setTimeout(() => setIsModalOpen(false), 1500);
				} else {
					// Navigate to create page with data
					const { path, schema } = response.formData;
					setTimeout(() => {
						setIsModalOpen(false);
						router.push(`/management/${path}/create?data=${encodeURIComponent(JSON.stringify(schema))}`);
					}, 1000);
				}
			} else {
				setTimeout(() => setIsModalOpen(false), 1000);
			}
		} catch (error) {
			console.error("Error al procesar el audio:", error);
			toast.error("Error al procesar el audio");
			setIsProcessing(false);
			setTimeout(() => setIsModalOpen(false), 1000);
		}
	};

	if (variant === "inline") {
		return (
			<>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className={cn("rounded-full hover:bg-primary/10 hover:text-primary", className)}
					onClick={() => setIsModalOpen(true)}
				>
					<Mic className="h-5 w-5" />
				</Button>

				<FopyAudioModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onAudioCaptured={handleAudioCaptured}
					isProcessing={isProcessing}
				/>
			</>
		);
	}

	return (
		<>
			<Button
				type="button"
				size="icon"
				className={cn(
					"fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 animate-fade-in",
					"bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300",
					className
				)}
				onClick={() => setIsModalOpen(true)}
			>
				<Mic className="h-6 w-6" />
			</Button>

			<FopyAudioModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onAudioCaptured={handleAudioCaptured}
				isProcessing={isProcessing}
			/>
		</>
	);
}
