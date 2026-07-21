import { createApiError } from "./api.error";
import type {
  ApiError,
  ApiResponse,
} from "./api.types";

const API_URL = "http://localhost:3000/api";

async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    options,
  );

  if (!response.ok) {
    const error: ApiError = {
      message: "API request failed",
      status: response.status,
    };

    throw createApiError(error);
  }

  return response.json();
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  },
};