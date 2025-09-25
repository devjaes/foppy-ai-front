import { useState } from "react";
import { FloatingButton } from "@/components/ui/floating-button";
import { FopyAudioModal } from "@/components/ui/fopy-audio-modal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AudioService } from "@/features/audio/services/audio.service";

export function AudioRecorder() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const audioService = AudioService.getInstance();

  const handleAudioCaptured = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      const response = await audioService.sendAudio(audioBlob);

      toast.success("Audio procesado con éxito", {
        description: "Tu audio ha sido procesado correctamente"
      });

      console.log(response);

      // Aquí ya tenemos los datos del formulario, pero NO navegamos inmediatamente
      setIsProcessing(false); // Detener proceso - cambiará a estado de celebración

      // Esperamos 2.5 segundos para que se vea bien el estado de celebración
      if (response.formData) {
        const { path, schema } = response.formData;
        setTimeout(() => {
          // Cierra el modal después de mostrar el estado de celebración
          setIsModalOpen(false);
          // Luego navega a la página del formulario
          router.push(`/management/${path}/create?data=${encodeURIComponent(JSON.stringify(schema))}`);
        }, 1000); // 2.5 segundos de celebración antes de navegar
      } else {
        // Si no hay datos de formulario, simplemente cerramos el modal después de la celebración
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Error al procesar el audio:", error);
      toast.error("Error al procesar el audio", {
        description: "Por favor, intenta nuevamente más tarde"
      });
      setIsProcessing(false);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    }
  };

  return (
    <>
      <FloatingButton onClick={() => setIsModalOpen(true)} />
      <FopyAudioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAudioCaptured={handleAudioCaptured}
        isProcessing={isProcessing}
      />
    </>
  );
}