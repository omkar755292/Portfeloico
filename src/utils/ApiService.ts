import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { API } from "./Api";

class ApiService {
  private service: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: any[] = [];

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

    this.service.interceptors.response.use(this.handleSuccess, async (error: AxiosError) => {
      const originalRequest = error.config!;

      // If error is not 401 or request has already been retried
      if (error.response?.status !== 401 || (originalRequest as any)._retry) {
        return Promise.reject(error);
      }

      if (this.isRefreshing) {
        return new Promise((resolve) => {
          this.failedQueue.push({ resolve, reject: (err: any) => Promise.reject(err) });
        })
          .then((token) => {
            return this.service(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      (originalRequest as any)._retry = true;
      this.isRefreshing = true;

      return new Promise((resolve, reject) => {
        this.service
          .post(API.auth.refreshToken)
          .then(() => {
            this.processQueue(null);
            resolve(this.service(originalRequest));
          })
          .catch((err) => {
            this.processQueue(err);
            reject(err);
          })
          .finally(() => {
            this.isRefreshing = false;
          });
      });
    });
  }

  private processQueue(error: any) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve();
      }
    });
    this.failedQueue = [];
  }

  private handleSuccess<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  private async handleError(error: AxiosError) {
    if (error.response?.status === 401) {
      // Redirect to login if refresh token fails
      this.redirectTo("/");
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

  public delete<T>(url: string) {
    return this.service.delete<T>(url);
  }
}

export default new ApiService();
