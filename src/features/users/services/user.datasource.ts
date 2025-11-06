import AxiosClient from "@/core/infrastructure/http/axios-client";
import {
  UserChangePassword,
  UserProfileResponse,
  UserUpdateProfile,
} from "../interfaces/user.interface";
import { IUserService } from "./user.service.interface";

export class UserService implements IUserService {
  private url: string = "users";
  private axiosClient: AxiosClient;
  private static instance: UserService;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): IUserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUserProfile(id: number): Promise<UserProfileResponse> {
    const { data } = await this.axiosClient.get<UserProfileResponse>(
      `${this.url}/${id}`
    );
    return data.data;
  }

  async updateUserProfile(
    id: number,
    updateData: UserUpdateProfile
  ): Promise<UserProfileResponse> {
    const { data } = await this.axiosClient.patch<UserProfileResponse>(
      `${this.url}/${id}`,
      updateData
    );
    return data.data;
  }

  async changePassword(
    id: number,
    passwordData: UserChangePassword
  ): Promise<void> {
    await this.axiosClient.patch<void>(`${this.url}/${id}`, {
      password: passwordData.newPassword,
    });
  }
}
