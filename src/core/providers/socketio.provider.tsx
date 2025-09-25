"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
import {
  INotification,
  NotificationType,
} from "@/features/notifications/interfaces/notification.interface";
import { NotificationService } from "@/features/notifications/services/notification.datasource";

interface SocketIOContextType {
  isConnected: boolean;
  notifications: INotification[];
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loading: boolean;
}

const SocketIOContext = createContext<SocketIOContextType>({
  isConnected: false,
  notifications: [],
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  loading: false,
});

export const useSocketIO = () => useContext(SocketIOContext);

interface SocketIOProviderProps {
  children: React.ReactNode;
}

export const SocketIOProvider: React.FC<SocketIOProviderProps> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar notificaciones iniciales
  useEffect(() => {
    const loadInitialNotifications = async () => {
      if (status === "authenticated") {
        try {
          setLoading(true);
          const notificationService = NotificationService.getInstance();
          const initialNotifications =
            await notificationService.getNotifications();
          setNotifications(initialNotifications);
        } catch (error) {
          console.error("Error cargando notificaciones iniciales:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadInitialNotifications();
  }, [status]);

  // Configurar Socket.IO
  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      // Crear conexión Socket.IO
      const socketUrl =
        process.env.NEXT_PUBLIC_SOCKETIO_URL || "http://localhost:3005";
      const socketInstance = io(socketUrl, {
        transports: ["websocket"],
        autoConnect: true,
      });

      // Configurar manejadores de eventos
      socketInstance.on("connect", () => {
        console.log("Socket.IO connected");

        // Autenticar al usuario
        socketInstance.emit("authenticate", session.user.accessToken);
      });

      socketInstance.on("authenticated", (data) => {
        console.log("Socket.IO authenticated:", data);
        setIsConnected(true);
      });

      socketInstance.on("auth_error", (error) => {
        console.error("Socket.IO authentication error:", error);
        setIsConnected(false);
      });

      socketInstance.on("notification", (message) => {
        if (message.type === "notification") {
          const newNotification = message.data;

          // Mostrar un toast con el tipo de notificación adecuado
          switch (newNotification.type) {
            case NotificationType.WARNING:
              toast.warning(newNotification.title, {
                description: newNotification.message,
                duration: 5000,
              });
              break;
            case NotificationType.SUGGESTION:
              toast.info(newNotification.title, {
                description: newNotification.message,
                duration: 5000,
              });
              break;
            case NotificationType.CONGRATULATION:
              toast.success(newNotification.title, {
                description: newNotification.message,
                duration: 5000,
              });
              break;
            default:
              toast(newNotification.title, {
                description: newNotification.message,
                duration: 5000,
              });
          }

          // Actualizar el estado con la nueva notificación
          setNotifications((prev) => [newNotification, ...prev]);
        }
      });

      socketInstance.on("disconnect", () => {
        console.log("Socket.IO disconnected");
        setIsConnected(false);
      });

      socketInstance.on("error", (error) => {
        console.error("Socket.IO error:", error);
        setIsConnected(false);
      });

      setSocket(socketInstance);

      // Limpiar al desmontar
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [session, status]);

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
      console.error("Error marcando notificación como leída:", error);
    }
  };

  // Función para marcar todas las notificaciones como leídas
  const markAllAsRead = async () => {
    try {
      const notificationService = NotificationService.getInstance();
      if (!session?.user?.id) return;
      await notificationService.markAllAsRead(Number(session?.user?.id));

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error(
        "Error marcando todas las notificaciones como leídas:",
        error
      );
    }
  };

  return (
    <SocketIOContext.Provider
      value={{
        isConnected,
        notifications,
        markAsRead,
        markAllAsRead,
        loading,
      }}
    >
      {children}
    </SocketIOContext.Provider>
  );
};
