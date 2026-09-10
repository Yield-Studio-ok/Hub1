"use client";

import { useAuth } from "@/lib/auth-context";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FloatingTimer } from "@/components/floating-timer";
import React from "react";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <PageHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
          <FloatingTimer />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
