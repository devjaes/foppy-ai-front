import {
  Category,
  CategoryCreate,
  CategoryUpdate,
} from "../interfaces/categories.interface";
import AxiosClient from "@/core/infrastructure/http/axios-client";

interface ICategoryService {
  getCategories(): Promise<Category[]>;
  createCategory(category: CategoryCreate): Promise<Category>;
  getCategory(id: number): Promise<Category>;
  updateCategory(id: number, category: CategoryUpdate): Promise<Category>;
  deleteCategory(id: number): Promise<{ deleted: boolean }>;
}

export class CategoryService implements ICategoryService {
  private url: string = "categories";
  private axiosClient: AxiosClient;
  private static instance: CategoryService;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): ICategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  async getCategories(): Promise<Category[]> {
    const { data } = await this.axiosClient.get<Category[]>(this.url);
    return data.data;
  }

  async createCategory(category: CategoryCreate): Promise<Category> {
    const { data } = await this.axiosClient.post<Category>(this.url, category);
    return data.data;
  }

  async getCategory(id: number): Promise<Category> {
    const { data } = await this.axiosClient.get<Category>(`${this.url}/${id}`);
    return data.data;
  }

  async updateCategory(
    id: number,
    category: CategoryUpdate
  ): Promise<Category> {
    const { data } = await this.axiosClient.patch<Category>(
      `${this.url}/${id}`,
      category
    );
    return data.data;
  }

  async deleteCategory(id: number): Promise<{ deleted: boolean }> {
    const { data } = await this.axiosClient.delete<{ deleted: boolean }>(
      `${this.url}/${id}`
    );
    return data.data;
  }
}
