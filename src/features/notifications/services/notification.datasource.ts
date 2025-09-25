import AxiosClient from "@/core/infrastructure/http/axios-client";
import { INotification } from "../interfaces/notification.interface";

export class NotificationService {
  private static instance: NotificationService;
  private axiosClient: AxiosClient;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Obtiene todas las notificaciones del usuario
   */
  async getNotifications(): Promise<INotification[]> {
    try {
      const response = await this.axiosClient.get<INotification[]>(
        "/notifications"
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  /**
   * Marca una notificación como leída
   * @param id ID de la notificación
   */
  async markAsRead(id: number): Promise<void> {
    await this.axiosClient.patch<void>(`/notifications/${id}/read`);
  }

  /**
   * Marca todas las notificaciones como leídas
   */
  async markAllAsRead(userId: number): Promise<void> {
    await this.axiosClient.patch<void>(
      `/users/${userId}/notifications/read-all`
    );
  }
}
