import { Login, Register, AuthResponse } from "../interfaces/auth.interface";
import AxiosClient from "@/core/infrastructure/http/axios-client";
import { EmailGender } from "../interfaces/email-gender.interface";
import { Recovery } from "../interfaces/recovery.interface";

interface IAuthService {
  login(user: Login): Promise<AuthResponse>;
  register(user: Register): Promise<AuthResponse>;
  logout(): Promise<void>;
  forgotPassword(email: EmailGender): Promise<string>;
  resetPassword(user: Recovery): Promise<string>;
}

export class AuthService implements IAuthService {
  private url: string = "auth";
  private axiosCLient: AxiosClient;
  private static instance: AuthService;

  private constructor() {
    this.axiosCLient = AxiosClient.getInstance();
  }

  async forgotPassword(email: EmailGender): Promise<string> {
    const { data } = await this.axiosCLient.post<{ message: string }>(
      `${this.url}/forgot-password`,
      email
    );
    return data.message;
  }

  async resetPassword(recovery: Recovery): Promise<string> {
    const { data } = await this.axiosCLient.post<{ message: string }>(
      `${this.url}/reset-password`,
      {
        token: recovery.resetPasswordToken,
        password: recovery.password,
      }
    );
    return data.message;
  }

  public static getInstance(): IAuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(user: Login): Promise<AuthResponse> {
    const { data } = await this.axiosCLient.post<AuthResponse>(
      `${this.url}/login`,
      user
    );

    return data.data;
  }

  async register(user: Register): Promise<AuthResponse> {
    const { data } = await this.axiosCLient.post<AuthResponse>(
      `${this.url}/register`,
      user
    );

    return data.data;
  }

  async logout(): Promise<void> {
    await this.axiosCLient.delete(`${this.url}/logout`);
  }
}
