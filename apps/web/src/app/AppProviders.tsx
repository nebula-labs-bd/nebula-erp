import type { ReactNode } from "react";

import AuthProvider from "./AuthProvider";
import QueryProvider from "./QueryProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <AuthProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </AuthProvider>
  );
}