import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FloatingButtonProps {
  onClick: () => void;
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 group"
            variant="default"
          >
            <div className="relative">
              <Mic className="w-6 h-6 transition-transform group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-primary text-primary-foreground">
          <p className="font-medium">Habla con Fopy</p>
          <p className="text-xs opacity-80">Di algo como &quot;Gasté 25 dólares en comida&quot;</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 