import AxiosClient from "@/core/infrastructure/http/axios-client";
import axios from "axios";
import {
  Report,
  ReportRequest,
  ReportType,
  ReportFormat,
} from "../interfaces/reports.interface";

interface IReportService {
  generateReport(reportRequest: ReportRequest): Promise<Report>;
  getReport(id: string): Promise<Report>;
  deleteReport(id: string): Promise<void>;
  downloadReport(id: string): Promise<Blob>;
}

export class ReportService implements IReportService {
  private url: string = "reports";
  private axiosClient: AxiosClient;
  private static instance: ReportService;

  private constructor() {
    this.axiosClient = AxiosClient.getInstance();
  }

  public static getInstance(): IReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  async generateReport(reportRequest: ReportRequest): Promise<Report> {
    const { data } = await this.axiosClient.post<Report>(
      this.url,
      reportRequest
    );
    return data.data;
  }

  async getReport(id: string): Promise<Report> {
    try {
      // Primero intentamos obtener los metadatos del reporte
      const { data } = await this.axiosClient.get<Report>(`${this.url}/${id}`);
      return data.data;
    } catch (error) {
      // Si el error es porque la respuesta es un archivo binario, redirigimos a la descarga
      if (axios.isAxiosError(error) && error.response) {
        const contentType = error.response.headers["content-type"];
        if (
          contentType &&
          (contentType.includes("application/pdf") ||
            contentType.includes("application/vnd.openxmlformats"))
        ) {
          // Es un archivo binario, devolvemos un objeto que indique que necesita descarga
          return {
            id,
            type: ReportType.GOALS_BY_CATEGORY, // Usamos un tipo por defecto
            format: contentType.includes("application/pdf")
              ? ReportFormat.PDF
              : ReportFormat.EXCEL,
            createdAt: new Date().toISOString(),
            expiresAt: new Date().toISOString(),
            needsDownload: true,
          };
        }
      }
      throw error;
    }
  }

  async deleteReport(id: string): Promise<void> {
    await this.axiosClient.delete(`${this.url}/${id}`);
  }

  // Método para descargar un reporte en formato no JSON
  async downloadReport(id: string): Promise<Blob> {
    // Usamos axios directamente para manejar la respuesta como blob
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
    const token = localStorage.getItem("token") || "";

    const response = await axios.get(`${baseURL}/${this.url}/${id}`, {
      responseType: "blob",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return response.data;
  }
}
