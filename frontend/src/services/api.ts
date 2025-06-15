import axios from "axios";
import type {
  ApiResponse,
  CollectPeopleRequest,
  CollectResult,
  PendingProfilesStatus,
  DataStats,
  Insights,
} from "../types";

// API_BASE_URL agora é relativo por causa do proxy do Vite
const API_BASE_URL = "/api"; // Chamadas serão para /api/data/...

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para tratar erros de forma centralizada
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Erro da API:", error.response.data);
      return Promise.reject(error.response.data);
    }
    if (error.request) {
      console.error("Sem resposta da API:", error.request);
      return Promise.reject({
        success: false,
        error: "Servidor não respondeu. Verifique o backend.",
      });
    }

    console.error("Erro na configuração da requisição:", error.message);
    return Promise.reject({
      success: false,
      error: "Erro ao enviar requisição.",
    });
  },
);

export const torreApiService = {
  collectPeople: async (
    request: CollectPeopleRequest,
  ): Promise<ApiResponse<CollectResult>> => {
    const response = await apiClient.post("/data/collect/people", request);
    return response.data;
  },
  collectPendingProfiles: async (): Promise<ApiResponse<CollectResult>> => {
    const response = await apiClient.post("/data/collect/profiles/pending");
    return response.data;
  },
  getPendingProfilesStatus: async (): Promise<
    ApiResponse<PendingProfilesStatus>
  > => {
    const response = await apiClient.get("/data/profiles/pending/status");
    return response.data;
  },
  processProfiles: async (): Promise<ApiResponse<CollectResult>> => {
    const response = await apiClient.post("/data/process/profiles");
    return response.data;
  },
  getStats: async (): Promise<ApiResponse<DataStats>> => {
    const response = await apiClient.get("/data/stats");
    return response.data;
  },
  getInsights: async (): Promise<ApiResponse<Insights>> => {
    const response = await apiClient.get("/data/insights");
    return response.data;
  },
};

export default torreApiService;
