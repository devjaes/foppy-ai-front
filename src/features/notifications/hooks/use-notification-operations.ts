"use client";

import { useCallback } from "react";
import { useNotifications } from "@/core/providers/notifications.provider";

export function useNotificationOperations() {
  const {
    notifications,
    markAsRead: markAsReadContext,
    markAllAsRead: markAllAsReadContext,
    loading,
    refreshNotifications,
  } = useNotifications();

  // Obtener notificaciones no leídas
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter((notification) => !notification.read);
  }, [notifications]);

  // Marcar notificación como leída
  const markAsRead = useCallback(
    async (id: number) => {
      await markAsReadContext(id);
    },
    [markAsReadContext]
  );

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = useCallback(async () => {
    await markAllAsReadContext();
  }, [markAllAsReadContext]);

  // Recargar manualmente las notificaciones
  const refresh = useCallback(async () => {
    await refreshNotifications();
  }, [refreshNotifications]);

  return {
    notifications,
    unreadNotifications: getUnreadNotifications(),
    unreadCount: getUnreadNotifications().length,
    loading,
    markAsRead,
    markAllAsRead,
    refresh,
  };
}
