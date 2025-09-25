import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Send, X } from "lucide-react";
import { useState } from "react";

interface FopyChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessage: (message: string) => void;
}

export function FopyChatModal({ isOpen, onClose, onMessage }: FopyChatModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl">Fopy</DialogTitle>
            <p className="text-sm text-muted-foreground">Tu asistente financiero</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">F</span>
            </div>
            <div className="flex-1 bg-muted rounded-lg p-3">
              <p className="text-sm">¡Hola! Soy Fopy, tu asistente financiero. ¿En qué puedo ayudarte hoy?</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={isRecording ? "bg-destructive text-destructive-foreground" : ""}
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 