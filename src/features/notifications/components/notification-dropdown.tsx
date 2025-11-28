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
import { Loader2, TargetIcon, Sparkles } from "lucide-react";
import { useRecommendations } from "@/features/recommendations/hooks/use-recommendations";
import Link from "next/link";

export const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } =
    useNotificationOperations();
  
  const { data: recommendations = [], isLoading: isLoadingRecommendations } =
    useRecommendations();

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

  const totalCount = unreadCount + recommendations.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-6 w-6" />
          {totalCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] text-xs flex items-center justify-center">
              {totalCount > 99 ? "99+" : totalCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notificaciones y Recomendaciones</span>
          <div className="flex items-center gap-2">
            {totalCount > 0 && (
              <Badge variant="outline" className="ml-2">
                {totalCount} nuevas
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
                Marcar todo
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading || isLoadingRecommendations ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 && recommendations.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <BellIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p>No hay notificaciones</p>
          </div>
        ) : (
          <ScrollArea className="h-[450px]">
            {recommendations.length > 0 && (
              <>
                <div className="px-3 py-2 flex items-center gap-2 bg-blue-50 dark:bg-blue-950/20">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Recomendaciones para ti ({recommendations.length})
                  </span>
                </div>
                <div className="px-2 py-1">
                  <Link href="/management" className="block">
                    <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-3 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          {recommendations.length} nueva{recommendations.length !== 1 ? 's' : ''} recomendación{recommendations.length !== 1 ? 'es' : ''}
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                        Tenemos sugerencias personalizadas para mejorar tus finanzas
                      </p>
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Ver recomendaciones en Dashboard
                      </Button>
                    </div>
                  </Link>
                </div>
                <Separator className="my-2" />
              </>
            )}

            {notifications.length > 0 && (
              <>
                {recommendations.length > 0 && (
                  <div className="px-3 py-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Notificaciones ({notifications.length})
                    </span>
                  </div>
                )}
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
              </>
            )}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
