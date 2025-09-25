import AxiosClient from "../infrastructure/http/axios-client";

export type DataResponse<T> = {
  [K: string]: T;
};

export abstract class BaseHttpService<T, CreateParams, UpdateParams> {
  protected http: AxiosClient;
  protected abstract baseUrl: string;
  protected abstract singleResponseKey: string;
  protected abstract pluralResponseKey: string;

  constructor() {
    this.http = AxiosClient.getInstance();
  }

  static getInstance<
    T,
    CreateParams,
    UpdateParams,
    S extends BaseHttpService<T, CreateParams, UpdateParams>
  >(this: new () => S): S {
    return new this();
  }

  async getById(id: number): Promise<T> {
    const url = `${this.baseUrl}/${id}`;
    const { data } = await this.http.get<DataResponse<T>>(url);
    return data.data[this.singleResponseKey];
  }

  async getAll(): Promise<T[]> {
    const { data } = await this.http.get<DataResponse<T[]>>(this.baseUrl);
    console.log(data);
    return data.data[this.pluralResponseKey];
  }

  async create(params: CreateParams): Promise<T> {
    const { data } = await this.http.post<DataResponse<T>>(
      this.baseUrl,
      params
    );
    return data.data[this.singleResponseKey];
  }

  async update(id: number, params: UpdateParams): Promise<T> {
    const url = `${this.baseUrl}/${id}`;
    const { data } = await this.http.patch<DataResponse<T>>(url, params);
    return data.data[this.singleResponseKey];
  }

  async delete(id: number): Promise<boolean> {
    const url = `${this.baseUrl}/${id}`;
    const { data } = await this.http.delete(url);
    return data.success;
  }
}
