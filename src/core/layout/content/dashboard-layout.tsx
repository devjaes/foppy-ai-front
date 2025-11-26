"use client";

import { useSidebarToggle } from "@/core/hooks/use-sidebar-toggle";
import { useStore } from "@/core/hooks/use-store";

import { cn } from "@/lib/utils";

import { Sidebar } from "../dashboard/sidebar/sidebar";
import { useEffect } from "react";

export default function DashboardPanelLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  useEffect(() => {
    if (title) {
      document.title = `FoppyAI - ${title}`;
    }
  }, [title]);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "transition-[margin-left] duration-300 ease-in-out",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        {children}
      </main>
    </>
  );
}
