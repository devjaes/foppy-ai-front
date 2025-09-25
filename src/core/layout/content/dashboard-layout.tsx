"use client";

import { useSidebarToggle } from "@/core/hooks/use-sidebar-toggle";
import { useStore } from "@/core/hooks/use-store";
import { AudioRecorder } from "@/components/audio-recorder/audio-recorder";

import { cn } from "@/lib/utils";

import { Sidebar } from "../dashboard/sidebar/sidebar";

export default function DashboardPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

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
        <AudioRecorder />
      </main>
    </>
  );
}
