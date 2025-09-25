"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  INotification,
  NotificationType,
} from "@/features/notifications/interfaces/notification.interface";
import { NotificationService } from "@/features/notifications/services/notification.datasource";

interface NotificationContextType {
  notifications: INotification[];
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  loading: false,
  refreshNotifications: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { status, data } = useSession();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastNotificationId, setLastNotificationId] = useState<number | null>(
    null
  );

  // Función para cargar notificaciones
  const loadNotifications = async () => {
    if (status !== "authenticated") return;

    try {
      setLoading(true);
      const notificationService = NotificationService.getInstance();
      const fetchedNotifications = await notificationService.getNotifications();

      setNotifications(fetchedNotifications);

      // Comprueba si hay alguna notificación nueva para mostrar toast
      if (fetchedNotifications.length > 0) {
        const lastFetchedId = fetchedNotifications[0]?.id || null;

        if (
          lastNotificationId !== null &&
          lastFetchedId !== null &&
          lastFetchedId > lastNotificationId
        ) {
          // Buscar notificaciones nuevas (ids mayores que el último conocido)
          const newNotifications = fetchedNotifications.filter(
            (notification) =>
              lastNotificationId !== null &&
              notification.id > lastNotificationId
          );

          // Mostrar toast para cada nueva notificación
          newNotifications.forEach((notification) => {
            // Mostrar un toast con el tipo de notificación adecuado
            switch (notification.type) {
              case NotificationType.WARNING:
                toast.warning(notification.title, {
                  description: notification.message,
                  duration: 5000,
                });
                break;
              case NotificationType.SUGGESTION:
                toast.info(notification.title, {
                  description: notification.message,
                  duration: 5000,
                });
                break;
              case NotificationType.CONGRATULATION:
                toast.success(notification.title, {
                  description: notification.message,
                  duration: 5000,
                });
                break;
              default:
                toast(notification.title, {
                  description: notification.message,
                  duration: 5000,
                });
            }
          });
        }

        setLastNotificationId(lastFetchedId);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar notificaciones iniciales
  useEffect(() => {
    loadNotifications();
  }, [status]);

  // Configurar polling para verificar notificaciones nuevas cada 30 segundos
  useEffect(() => {
    if (status !== "authenticated") return;

    const pollingInterval = setInterval(() => {
      loadNotifications();
    }, 30000); // 30 segundos

    return () => clearInterval(pollingInterval);
  }, [status, lastNotificationId]);

  // Función para marcar una notificación como leída
  const markAsRead = async (notificationId: number) => {
    try {
      const notificationService = NotificationService.getInstance();
      await notificationService.markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Función para marcar todas las notificaciones como leídas
  const markAllAsRead = async () => {
    try {
      const notificationService = NotificationService.getInstance();
      if (!data?.user?.id) return;
      await notificationService.markAllAsRead(Number(data?.user?.id));

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Función para recargar manualmente las notificaciones
  const refreshNotifications = async () => {
    await loadNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        markAllAsRead,
        loading,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
