import Link from "next/link";

import { useSidebarToggle } from "@/core/hooks/use-sidebar-toggle";
import { useStore } from "@/core/hooks/use-store";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { Menu } from "./menu";
import { SidebarToggle } from "./sidebar-toggle";
import Image from "next/image";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            "mb-1 transition-transform duration-300 ease-in-out",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              priority
              alt="FoppyAI Logo"
              width={40}
              height={40}
            />
            <h1
              className={cn(
                "whitespace-nowrap text-lg font-bold transition-[transform,opacity,display] duration-300 ease-in-out",
                sidebar?.isOpen === false
                  ? "hidden -translate-x-96 opacity-0"
                  : "translate-x-0 opacity-100"
              )}
            >
              <div className="flex flex-col items-center justify-center">
                <Image
                  src="/images/logoOL.png"
                  priority
                  alt="FoppyAI"
                  width={90}
                  height={80}
                />
                <p className="text-xs font-light text-black dark:text-white">
                  Smart Finance
                </p>
              </div>
            </h1>
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
