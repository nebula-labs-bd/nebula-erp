export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(
    "nebula_token",
  );

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}