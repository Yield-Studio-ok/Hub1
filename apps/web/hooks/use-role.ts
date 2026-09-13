"use client";

import { useAuth } from "@/lib/auth-context";
import { useMemo } from "react";

export type AppRole = "FOUNDER" | "PM" | "DEVELOPER";

interface RolePermissions {
  canDeployToProd: boolean;
  canAccessScraper: boolean;
  canManageTeam: boolean;
  canDeleteProjects: boolean;
  role: AppRole;
}

const ROLE_PERMISSIONS: Record<AppRole, Omit<RolePermissions, "role">> = {
  FOUNDER: {
    canDeployToProd: true,
    canAccessScraper: true,
    canManageTeam: true,
    canDeleteProjects: true,
  },
  PM: {
    canDeployToProd: true,
    canAccessScraper: false,
    canManageTeam: true,
    canDeleteProjects: false,
  },
  DEVELOPER: {
    canDeployToProd: false,
    canAccessScraper: false,
    canManageTeam: false,
    canDeleteProjects: false,
  },
};

export function useRole(): RolePermissions {
  const { user } = useAuth();

  return useMemo(() => {
    // Default to DEVELOPER if no role info available
    const role: AppRole = ((user as any)?.role as AppRole) || "DEVELOPER";
    return {
      ...ROLE_PERMISSIONS[role],
      role,
    };
  }, [user]);
}
