import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrors } from "@/lib/get-errors";

export interface ResponseAPI<T> {
  status?: string;
  success: boolean;
  message: string;
  data: T;
  errors: string[] | string | null;
}

class AxiosClient {
  private axiosInstance: AxiosInstance;
  private static axiosClient: AxiosClient;

  private static readonly baseUrl: string =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://car-rental-latest-sjbv.onrender.com";

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: AxiosClient.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const session = await getSession();
        if (session) {
          config.headers.Authorization = `Bearer ${session.user.accessToken}`;
        }

        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (typeof window !== "undefined") {
          const message = error?.response?.data?.message;
          const errors = error?.response?.data?.errors;

          toast.error(message, {
            description: getErrors(errors),
          });
        } else {
          console.error(error?.response?.data);
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AxiosClient {
    if (!this.axiosClient) {
      this.axiosClient = new AxiosClient();
    }
    return this.axiosClient;
  }

  getUri(config?: AxiosRequestConfig): string {
    return this.axiosInstance.getUri(config);
  }

  request<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    config: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.request(config);
  }

  get<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.get(url, config);
  }

  delete<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.delete(url, config);
  }

  head<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.head(url, config);
  }

  options<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.options(url, config);
  }

  post<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.post(url, data, config);
  }

  put<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.put(url, data, config);
  }

  patch<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.patch(url, data, config);
  }

  postForm<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.postForm(url, data, config);
  }

  putForm<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.putForm(url, data, config);
  }

  patchForm<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.patchForm(url, data, config);
  }
}

export default AxiosClient;
