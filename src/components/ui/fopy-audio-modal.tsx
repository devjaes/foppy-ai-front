import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { FopyStates, type FopyState } from "./fopy-states";
import { cn } from "@/lib/utils";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import React from "react";

interface FopyAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAudioCaptured: (audioBlob: Blob) => void;
  isProcessing?: boolean;
}

const stateMessages = {
  idle: {
    title: "¿En qué puedo ayudarte?",
    description: "Presiona el botón y habla con naturalidad"
  },
  listening: {
    title: "Te escucho...",
    description: "Di algo como \"Gasté 25 dólares en comida\""
  },
  thinking: {
    title: "Procesando...",
    description: "Dame un momento para procesar tu mensaje"
  },
  celebrating: {
    title: "¡Excelente!",
    description: "He registrado la información correctamente"
  }
};

export function FopyAudioModal({ isOpen, onClose, onAudioCaptured, isProcessing = false }: FopyAudioModalProps) {
  const [fopyState, setFopyState] = useState<FopyState>("idle");
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setFopyState("listening");
    } catch (error) {
      console.error('Error al iniciar la grabación:', error);
      setFopyState("idle");
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await stopRecording();
      setFopyState("thinking");
      
      onAudioCaptured(audioBlob);
      
      // Dejamos que el efecto de isProcessing maneje la transición a "celebrating"
      // No regresamos automáticamente a "idle"
    } catch (error) {
      console.error('Error al detener la grabación:', error);
      setFopyState("idle");
    }
  };

  React.useEffect(() => {
    if (isProcessing) {
      setFopyState("thinking");
    } else if (fopyState === "thinking") {
      setFopyState("celebrating");
      // No volvemos a "idle" automáticamente - esto lo controlará el componente padre
    }
  }, [isProcessing, fopyState]);

  // Cuando se cierre el modal, volvemos a "idle"
  React.useEffect(() => {
    if (!isOpen) {
      // Pequeño delay para evitar parpadeos visuales
      setTimeout(() => {
        setFopyState("idle");
      }, 300);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="relative min-h-[500px] flex flex-col">
          <div className="flex-1 flex flex-col items-center pt-16 px-6">
            <div className="text-center space-y-2 mb-8">
              <p className="text-xl font-medium">
                {stateMessages[fopyState].title}
              </p>
              <p className="text-sm text-muted-foreground">
                {stateMessages[fopyState].description}
              </p>
            </div>

            <div className="z-10 flex flex-col items-center gap-4">
              {fopyState === "celebrating" ? (
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center animate-in zoom-in duration-300">
                  <Check className="w-10 h-10 text-white animate-in zoom-in duration-300" />
                </div>
              ) : fopyState === "thinking" ? (
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              ) : (
                <Button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={cn(
                    "w-20 h-20 rounded-full transition-all duration-300",
                    isRecording 
                      ? "bg-destructive hover:bg-destructive/90" 
                      : "bg-primary hover:bg-primary/90"
                  )}
                >
                  <Mic className={cn(
                    "w-8 h-8",
                    isRecording && "animate-pulse"
                  )} />
                </Button>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none">
            <FopyStates currentState={fopyState} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}