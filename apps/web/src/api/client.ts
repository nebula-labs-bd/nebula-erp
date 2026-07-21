import { apiConfig } from "./api.config";
import { createApiError } from "./api.error";
import { getAuthHeaders } from "./auth.interceptor";

import type {
  ApiError,
  ApiResponse,
} from "./api.types";

async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const headers = new Headers();

    Object.entries(apiConfig.headers).forEach(
      ([key, value]) => {
        headers.set(key, value);
      },
    );

    Object.entries(getAuthHeaders()).forEach(
      ([key, value]) => {
        headers.set(key, value);
      },
    );

    if (options?.headers) {
      const extraHeaders = new Headers(
        options.headers,
      );

      extraHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    const response = await fetch(
      `${apiConfig.baseUrl}${endpoint}`,
      {
        ...options,
        headers,
      },
    );

    if (!response.ok) {
      const error: ApiError = {
        message: "API request failed",
        status: response.status,
      };

      throw error;
    }

    return response.json();
  } catch (error) {
    throw createApiError(error);
  }
}

export const apiClient = {
  get<T>(endpoint: string) {
    return request<T>(endpoint);
  },

  post<T>(
    endpoint: string,
    body: unknown,
  ) {
    return request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};