import Image from "next/image";
import { cn } from "@/lib/utils";

export type FopyState = "idle" | "listening" | "thinking" | "celebrating";

interface FopyStatesProps {
  currentState: FopyState;
  className?: string;
}

export function FopyStates({ currentState, className }: FopyStatesProps) {
  return (
    <div className={cn("relative w-64 h-64", className)}>
      <Image
        src="/images/fopy-hd.png"
        alt="Fopy"
        width={256}
        height={256}
        className={cn(
          "absolute bottom-0 left-0 transition-opacity duration-300",
          currentState === "idle" ? "opacity-100" : "opacity-0"
        )}
      />
      <Image
        src="/images/fopy-listening.png"
        alt="Fopy escuchando"
        width={256}
        height={256}
        className={cn(
          "absolute bottom-0 left-0 transition-opacity duration-300",
          currentState === "listening" ? "opacity-100" : "opacity-0"
        )}
      />
      <Image
        src="/images/fopy-thinking.png"
        alt="Fopy pensando"
        width={256}
        height={256}
        className={cn(
          "absolute bottom-0 left-0 transition-opacity duration-300",
          currentState === "thinking" ? "opacity-100" : "opacity-0"
        )}
      />
      <Image
        src="/images/fopy-celebrating.png"
        alt="Fopy celebrando"
        width={256}
        height={256}
        className={cn(
          "absolute bottom-0 left-0 transition-opacity duration-300",
          currentState === "celebrating" ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
} 