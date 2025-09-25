"use client";

import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  text: string;
}
const InfoError = ({ text }: Props) => {
  const router = useRouter();
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-red-500 flex flex-col items-center gap-4">
        <Info className="h-12 w-12" />
        <p className="text-lg font-medium">{text}</p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    </div>
  );
};

export default InfoError;
