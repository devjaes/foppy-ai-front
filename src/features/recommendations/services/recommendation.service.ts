import AxiosClient from "@/core/infrastructure/http/axios-client";
import { IRecommendation } from "../interfaces/recommendation.interface";

export class RecommendationService {
  private static instance: RecommendationService;
  private axiosClient: AxiosClient;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }

  async getPending(userId?: string): Promise<IRecommendation[]> {
    try {
      const response = await this.axiosClient.get<IRecommendation[]>(
        "/recommendations",
        {
          params: {
            userId,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return [];
    }
  }

  async markAsViewed(id: number): Promise<void> {
    await this.axiosClient.patch<{ success: boolean }>(
      `/recommendations/${id}/view`
    );
  }

  async markAsDismissed(id: number): Promise<void> {
    await this.axiosClient.patch<{ success: boolean }>(
      `/recommendations/${id}/dismiss`
    );
  }

  async markAsActed(id: number): Promise<void> {
    await this.axiosClient.patch<{ success: boolean }>(
      `/recommendations/${id}/act`
    );
  }
}

export const recommendationService = RecommendationService.getInstance();
