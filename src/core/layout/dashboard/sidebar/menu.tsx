"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

import { CollapseMenuButton } from "./collapse-menu-button";
import { getAllMenuList } from "@/lib/menu-list";
import { useSubscription } from "@/features/subscriptions/hooks/use-subscription";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: response } = useSubscription(userId);
  const subscription = response?.data;

  const menuList = getAllMenuList(pathname, subscription);

  return (
    <nav className="h-full w-full">
      <ul className="flex flex-col items-start space-y-1 px-2">
        {menuList.map(({ groupLabel, menus }, index) => (
          <li className={cn("w-full", groupLabel ? "pt-2" : "")} key={index}>
            {(isOpen && groupLabel) || isOpen === undefined ? (
              <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">
                {groupLabel}
              </p>
            ) : !isOpen && isOpen !== undefined && groupLabel ? (
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger className="w-full">
                    <div className="flex w-full items-center justify-center">
                      <Ellipsis className="h-5 w-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{groupLabel}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <p className="pb-2"></p>
            )}
            {menus.map(
              ({ href, label, icon: Icon, active, submenus }, index) =>
                submenus.length === 0 ? (
                  <div className="w-full" key={index}>
                    <TooltipProvider disableHoverableContent>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={active ? "secondary" : "ghost"}
                            className={cn(
                              "mb-1 h-10 w-full justify-start transition-all duration-200 ease-in-out relative overflow-hidden",
                              active
                                ? "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                            asChild
                          >
                            <Link href={href}>
                              {active && (
                                <span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full" />
                              )}
                              <span
                                className={cn(isOpen === false ? "" : "mr-4", active ? "text-primary" : "")}
                              >
                                <Icon size={18} />
                              </span>
                              <p
                                className={cn(
                                  "max-w-[200px] truncate",
                                  isOpen === false
                                    ? "-translate-x-96 opacity-0"
                                    : "translate-x-0 opacity-100"
                                )}
                              >
                                {label}
                              </p>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        {isOpen === false && (
                          <TooltipContent side="right">
                            {label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div className="w-full" key={index}>
                    <CollapseMenuButton
                      icon={Icon}
                      label={label}
                      active={active}
                      submenus={submenus}
                      isOpen={isOpen}
                    />
                  </div>
                )
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
