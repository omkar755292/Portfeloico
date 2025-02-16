import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { API } from "./Api";

class ApiService {
  private service: AxiosInstance;

  constructor() {
    this.service = axios.create({
      baseURL: API.baseUrl,
      withCredentials: true,
    });

    axiosRetry(this.service, {
      retries: 0,
      retryDelay: (retryCount) => retryCount * 200,
      retryCondition: (error: AxiosError) => {
        return error.response?.status! >= 500 || !error.response;
      },
    });

    this.service.interceptors.response.use(this.handleSuccess, (error: AxiosError) =>
      this.handleError(error)
    );
  }

  private handleSuccess<T>(response: AxiosResponse<T>): AxiosResponse<T> {
    return response;
  }

  private async handleError(error: AxiosError) {
    if (error.response?.status === 401) {
      console.log("Api error", error);
    }
    return Promise.reject(error);
  }

  public redirectTo(url: string) {
    window.location.href = url;
  }

  public get<T>(url: string, params?: object) {
    return this.service.get<T>(url, { params });
  }

  public post<T>(url: string, data?: object) {
    return this.service.post<T>(url, data);
  }

  public put<T>(url: string, data?: object) {
    return this.service.put<T>(url, data);
  }

  public patch<T>(url: string, data?: object) {
    return this.service.patch<T>(url, data);
  }

  public delete<T>(url: string) {
    return this.service.delete<T>(url);
  }

  public setToken(token: string) {
    this.service.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }
}

export default new ApiService();
