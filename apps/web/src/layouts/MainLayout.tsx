import type { ReactNode } from "react";

import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { SidebarProvider } from "../components/sidebar/SidebarContext";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[var(--nebula-background)]">
        <Sidebar />

        {/* Content area: sidebar is static on desktop (part of flex flow),
            and a fixed drawer on mobile, so no offset padding is needed. */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />

          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}