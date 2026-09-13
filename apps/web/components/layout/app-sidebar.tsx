"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Settings, Users, Briefcase, Search, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/hooks/use-role";

interface NavItem {
  title: string;
  url: string;
  icon: typeof Home;
  requiresScraper?: boolean;
}

const items: NavItem[] = [
  { title: "Inicio", url: "/dashboard", icon: Home },
  { title: "Proyectos", url: "/projects", icon: Briefcase },
  { title: "Scraper", url: "/scraper", icon: Search, requiresScraper: true },
  { title: "Recursos", url: "/resources", icon: BookOpen },
  { title: "Equipo", url: "/team", icon: Users },
  { title: "Configuración", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { canAccessScraper } = useRole();

  const visibleItems = items.filter((item) => !item.requiresScraper || canAccessScraper);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    render={<Link href={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
