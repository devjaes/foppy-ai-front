import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="w-full bg-primary/5 rounded-lg p-8 text-center shadow-sm flex flex-col items-center justify-center space-y-4 my-8">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-500">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
