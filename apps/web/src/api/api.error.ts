import type { ApiError } from "./api.types";

export function createApiError(
  error: unknown,
): ApiError {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "status" in error
  ) {
    return error as ApiError;
  }

  return {
    message: "Unknown API error",
    status: 500,
  };
}