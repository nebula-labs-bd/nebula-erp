import { apiClient } from "../api/client";
import { endpoints } from "../api/endpoints";

import type { User } from "../auth/auth.types";

export function getCurrentUser() {
  return apiClient.get<User>(
    endpoints.auth.me,
  );
}