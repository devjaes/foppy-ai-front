import { Skeleton } from "@/components/ui/skeleton";

const LoadingInput = () => {
  return (
    <div className="w-full space-y-1">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

export default LoadingInput;
