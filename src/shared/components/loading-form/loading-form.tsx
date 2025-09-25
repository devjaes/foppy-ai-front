import { Skeleton } from "@/components/ui/skeleton";
import LoadingInput from "./loading-input";

interface LoadingFormVehicleProps {
  text?: string;
  quantityInputs?: number;
}
const LoadingForm = ({
  text = "Cargando formulario...",

  quantityInputs = 6,
}: LoadingFormVehicleProps) => {
  return (
    <div className="flex flex-col w-full max-w-xl items-center mx-auto gap-4">
      <h2>{text}</h2>
      {Array.from({ length: quantityInputs }).map((_, index) => (
        <LoadingInput key={index} />
      ))}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
};

export default LoadingForm;
