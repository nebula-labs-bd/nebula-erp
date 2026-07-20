import type { ReactNode } from "react";

import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[var(--nebula-background)]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}