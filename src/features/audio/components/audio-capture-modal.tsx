'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";

interface AudioCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAudioCaptured: (audioBlob: Blob) => void;
}

export function AudioCaptureModal({ isOpen, onClose, onAudioCaptured }: AudioCaptureModalProps) {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      console.error('Error al iniciar la grabación:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await stopRecording();
      onAudioCaptured(audioBlob);
    } catch (error) {
      console.error('Error al detener la grabación:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Grabar Audio</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="text-sm text-gray-500">
            {isRecording ? "Grabando..." : "Presiona el botón para comenzar a grabar"}
          </div>
          <Button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            variant={isRecording ? "destructive" : "default"}
            className="w-16 h-16 rounded-full"
          >
            {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 