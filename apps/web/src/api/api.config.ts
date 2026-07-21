import { env } from "../config/env";

export const apiConfig = {
  baseUrl: env.apiUrl,

  headers: {
    "Content-Type": "application/json",
  },
};