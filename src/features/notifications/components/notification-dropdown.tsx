"use client";

import React from "react";
import {
  BellIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  RocketLaunchIcon,
  CreditCardIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useNotificationOperations } from "../hooks/use-notification-operations";
import { NotificationType } from "../interfaces/notification.interface";
import { Loader2, TargetIcon } from "lucide-react";

export const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } =
    useNotificationOperations();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.GOAL:
        return <TargetIcon className="h-5 w-5 text-blue-500" />;
      case NotificationType.DEBT:
        return <CreditCardIcon className="h-5 w-5 text-red-500" />;
      case NotificationType.SUGGESTION:
        return <LightBulbIcon className="h-5 w-5 text-yellow-500" />;
      case NotificationType.WARNING:
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case NotificationType.CONGRATULATION:
        return <RocketLaunchIcon className="h-5 w-5 text-green-500" />;
      default:
        return <BellIcon className="h-5 w-5" />;
    }
  };

  const handleNotificationClick = (id: number) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllAsRead();
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Fecha desconocida";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] text-xs flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[350px]">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notificaciones</span>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="outline" className="ml-2">
                {unreadCount} sin leer
              </Badge>
            )}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={handleMarkAllAsRead}
              >
                <CheckIcon className="h-4 w-4 mr-1" />
                Marcar todo como leído
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <BellIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p>No hay notificaciones</p>
          </div>
        ) : (
          <ScrollArea className="h-[450px]">
            {notifications.map((notification) => (
              <div key={notification.id}>
                <DropdownMenuItem
                  className={cn(
                    "flex flex-col items-start py-3 cursor-pointer",
                    !notification.read && "bg-muted/50"
                  )}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      {notification.subtitle && (
                        <p className="text-xs text-muted-foreground">
                          {notification.subtitle}
                        </p>
                      )}
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {getTimeAgo(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <Separator />
              </div>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
