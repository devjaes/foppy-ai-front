import { cn } from "@/lib/utils";
import React from "react";

export function Grid({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid", className)} {...props}>
      {children}
    </div>
  );
}
