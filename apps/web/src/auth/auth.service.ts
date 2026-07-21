import type { LoginCredentials, User } from "./auth.types";

const demoUser: User = {
  id: "1",
  name: "Admin User",
  email: "admin@nebula.local",
  role: "admin",
};

export async function login(
  credentials: LoginCredentials,
): Promise<User | null> {
  if (
    credentials.email === "admin@nebula.local" &&
    credentials.password === "admin"
  ) {
    return demoUser;
  }

  return null;
}

export async function logout() {
  return true;
}