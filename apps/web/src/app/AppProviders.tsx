import type { ReactNode } from "react";

import ThemeProvider from "../theme/ThemeProvider";
import AuthProvider from "./AuthProvider";
import QueryProvider from "./QueryProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          {children}
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}