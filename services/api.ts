import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import * as tokenService from "./token";
import { refreshAccessToken } from "./auth";

// Set up API configuration
const API_URL =
  Constants.expoConfig?.extra?.apiUrl || "http://192.168.178.67:3001/v1";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if we're currently refreshing the token
let isRefreshing = false;
// Store pending requests
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

// Extend the AxiosRequestConfig type to include our custom properties
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Process the failed queue
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add request interceptor to include auth token and handle expiry
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Check if token is expired before making the request
      const isExpired = await tokenService.isTokenExpired();

      if (isExpired) {
        const newTokens = await refreshAccessToken();
        if (newTokens) {
          config.headers.Authorization = `Bearer ${newTokens.access.token}`;
        } else {
          throw new Error("Token refresh failed");
        }
      } else {
        const token = await tokenService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error in request interceptor:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newTokens = await refreshAccessToken();
        if (newTokens) {
          // Update the request with new token
          originalRequest.headers.Authorization = `Bearer ${newTokens.access.token}`;

          // Process any queued requests
          processQueue(null, newTokens.access.token);

          // Retry the original request
          return apiClient(originalRequest);
        } else {
          processQueue(new Error("Token refresh failed"));
          return Promise.reject(new Error("Token refresh failed"));
        }
      } catch (refreshError) {
        processQueue(refreshError as Error);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
