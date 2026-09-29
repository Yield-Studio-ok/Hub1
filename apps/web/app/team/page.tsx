"use client";

import { useState, useMemo, useEffect, useCallback, type FormEvent } from "react";
import {
  Users,
  UserPlus,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Mail,
  Shield,
  Code2,
  Palette,
  Cloud,
  Sparkles,
  RotateCcw,
  Clock,
  UserCheck,
  Compass,
  CheckCheck,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiFetch } from "@/lib/api";

export type TeamRole = "Admin" | "Developer" | "Designer" | "DevOps" | "QA" | "Product";
export type MemberStatus = "active" | "offline" | "pending";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: MemberStatus;
  avatar?: string;
  initials: string;
  joinedDate: string;
  lastActive: string;
}

interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: "mem-1",
    name: "Leandro Carrasco",
    email: "lean@yieldstudio.io",
    role: "Admin",
    status: "active",
    initials: "LC",
    joinedDate: "Enero 2025",
    lastActive: "Hace 2 min",
  },
  {
    id: "mem-2",
    name: "Sofia Chen",
    email: "sofia.chen@yieldstudio.io",
    role: "Developer",
    status: "active",
    initials: "SC",
    joinedDate: "Marzo 2025",
    lastActive: "Hace 15 min",
  },
  {
    id: "mem-3",
    name: "Lucas Gomez",
    email: "lucas.gomez@yieldstudio.io",
    role: "Designer",
    status: "active",
    initials: "LG",
    joinedDate: "Mayo 2025",
    lastActive: "Hace 1 hora",
  },
  {
    id: "mem-4",
    name: "Valentina Rossi",
    email: "valentina.rossi@yieldstudio.io",
    role: "DevOps",
    status: "active",
    initials: "VR",
    joinedDate: "Junio 2025",
    lastActive: "Ayer",
  },
  {
    id: "mem-5",
    name: "Mateo Diaz",
    email: "mateo.diaz@yieldstudio.io",
    role: "Developer",
    status: "offline",
    initials: "MD",
    joinedDate: "Julio 2025",
    lastActive: "Hace 2 días",
  },
  {
    id: "mem-6",
    name: "Camila Torres",
    email: "camila.torres@yieldstudio.io",
    role: "QA",
    status: "pending",
    initials: "CT",
    joinedDate: "Septiembre 2026",
    lastActive: "Pendiente",
  },
];

const ROLE_CONFIG: Record<
  TeamRole,
  { label: string; icon: typeof Shield; color: string; badge: string }
> = {
  Admin: {
    label: "Admin",
    icon: Shield,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    badge: "border-purple-500/30 text-purple-300 bg-purple-500/10",
  },
  Developer: {
    label: "Developer",
    icon: Code2,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    badge: "border-blue-500/30 text-blue-300 bg-blue-500/10",
  },
  Designer: {
    label: "Designer",
    icon: Palette,
    color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    badge: "border-pink-500/30 text-pink-300 bg-pink-500/10",
  },
  DevOps: {
    label: "DevOps",
    icon: Cloud,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    badge: "border-amber-500/30 text-amber-300 bg-amber-500/10",
  },
  QA: {
    label: "QA",
    icon: CheckCheck,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    badge: "border-emerald-500/30 text-emerald-300 bg-emerald-500/10",
  },
  Product: {
    label: "Product",
    icon: Compass,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    badge: "border-cyan-500/30 text-cyan-300 bg-cyan-500/10",
  },
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Form state for inviting new member
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<TeamRole>("Developer");

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Carga inicial GET /api/team con fallback a INITIAL_MEMBERS
  useEffect(() => {
    let isMounted = true;

    async function loadMembers() {
      try {
        const res = await apiFetch<any>("/api/team");
        if (!isMounted) return;

        const rawList = Array.isArray(res) ? res : res?.data || res?.members || [];
        if (rawList && rawList.length > 0) {
          const normalized: TeamMember[] = rawList.map((m: any, idx: number) => {
            const name = m.name || "Miembro";
            const initials =
              m.initials ||
              name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((w: string) => w[0].toUpperCase())
                .join("") ||
              "YM";

            return {
              id: m.id || `mem-${idx + 1}`,
              name,
              email: m.email || "sin-email@yieldstudio.io",
              role: (m.role as TeamRole) || "Developer",
              status: (m.status as MemberStatus) || "active",
              avatar: m.avatar,
              initials,
              joinedDate: m.joinedDate || "Enero 2025",
              lastActive: m.lastActive || "Justo ahora",
            };
          });
          setMembers(normalized);
        } else {
          setMembers(INITIAL_MEMBERS);
        }
      } catch (err) {
        console.warn(
          "Fallo o endpoint no disponible en GET /api/team, usando INITIAL_MEMBERS:",
          err,
        );
        if (isMounted) {
          setMembers(INITIAL_MEMBERS);
        }
      }
    }

    loadMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q);

      const matchesRole = selectedRole === "all" || member.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, selectedRole]);

  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.status === "active").length;
    const admins = members.filter((m) => m.role === "Admin").length;
    const pending = members.filter((m) => m.status === "pending").length;
    return { total, active, admins, pending };
  }, [members]);

  // POST /api/team: Invitar nuevo miembro
  const handleInviteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const derivedName = newName.trim()
      ? newName.trim()
      : newEmail
          .split("@")[0]
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

    const initials =
      derivedName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("") || "YM";

    const payload = {
      name: derivedName,
      email: newEmail.trim().toLowerCase(),
      role: newRole,
    };

    try {
      const res = await apiFetch<any>("/api/team", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const created = res?.data || res;
      const newMember: TeamMember = {
        id: created?.id || `mem-${Date.now()}`,
        name: created?.name || derivedName,
        email: created?.email || payload.email,
        role: created?.role || newRole,
        status: created?.status || "active",
        avatar: created?.avatar,
        initials: created?.initials || initials,
        joinedDate: created?.joinedDate || "Justo ahora",
        lastActive: created?.lastActive || "Justo ahora",
      };

      setMembers((prev) => [newMember, ...prev]);
      setNewEmail("");
      setNewName("");
      setNewRole("Developer");
      setIsInviteOpen(false);
      showToast(`Invitación enviada a ${newMember.email} con éxito`, "success");
    } catch (err) {
      console.error("Error al invitar miembro:", err);
      // Fallback local en desarrollo
      const fallbackMember: TeamMember = {
        id: `mem-${Date.now()}`,
        name: derivedName,
        email: payload.email,
        role: newRole,
        status: "active",
        initials,
        joinedDate: "Justo ahora",
        lastActive: "Justo ahora",
      };
      setMembers((prev) => [fallbackMember, ...prev]);
      setNewEmail("");
      setNewName("");
      setNewRole("Developer");
      setIsInviteOpen(false);
      showToast(`Invitación enviada a ${fallbackMember.email} (modo offline)`, "success");
    }
  };

  // PATCH /api/team/:id: Editar rol
  const handleRoleChange = async (memberId: string, role: TeamRole) => {
    const prevMembers = [...members];
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role } : m)));

    try {
      await apiFetch(`/api/team/${memberId}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      showToast("Rol actualizado con éxito", "success");
    } catch (err) {
      console.error("Error actualizando rol:", err);
      setMembers(prevMembers);
      showToast("Error al actualizar el rol", "error");
    }
  };

  // PATCH /api/team/:id: Alternar estado ('active' | 'offline' | 'pending')
  const handleToggleStatus = async (member: TeamMember) => {
    const statusCycle: MemberStatus[] = ["active", "offline", "pending"];
    const currentIndex = statusCycle.indexOf(member.status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

    const prevMembers = [...members];
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, status: nextStatus } : m)));

    try {
      await apiFetch(`/api/team/${member.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      showToast("Estado actualizado con éxito", "success");
    } catch (err) {
      console.error("Error actualizando estado:", err);
      setMembers(prevMembers);
      showToast("Error al actualizar el estado", "error");
    }
  };

  // DELETE /api/team/:id: Eliminar miembro
  const handleDeleteMember = async (memberId: string, memberName?: string) => {
    const prevMembers = [...members];
    setMembers((prev) => prev.filter((m) => m.id !== memberId));

    try {
      await apiFetch(`/api/team/${memberId}`, {
        method: "DELETE",
      });
      showToast(
        memberName ? `Miembro ${memberName} eliminado con éxito` : "Miembro eliminado con éxito",
        "success",
      );
    } catch (err) {
      console.error("Error al eliminar miembro:", err);
      setMembers(prevMembers);
      showToast("Error al eliminar el miembro", "error");
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRole("all");
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto font-sans relative">
      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="alert"
              className="pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/95 border border-white/10 backdrop-blur-md shadow-2xl text-foreground text-sm animate-in fade-in slide-in-from-bottom-5 duration-300"
            >
              <div className="flex items-center gap-2.5">
                {toast.type === "success" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {toast.type === "error" && (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                {toast.type === "info" && <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />}
                <span className="font-medium text-xs sm:text-sm">{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Cerrar notificación"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Luces de fondo sutiles con glassmorphism */}
      <div className="hidden" />
      <div className="hidden" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Header con Título, Subtítulo y Botón de Invitar Miembro */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Users className="w-6 h-6" />
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Equipo</h1>
            </div>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Gestión de miembros, asignación de roles y control de accesos a la organización.
            </p>
          </div>

          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-foreground font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 text-sm cursor-pointer">
              <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300 text-foreground" />
              Invitar Miembro
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <DialogTitle>Invitar Nuevo Miembro</DialogTitle>
                </div>
                <DialogDescription>
                  Envía una invitación por correo electrónico para sumarse al equipo de Yield Studio
                  Hub.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleInviteSubmit} className="space-y-4 my-2">
                <div>
                  <label
                    htmlFor="invite-email"
                    className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"
                  >
                    Correo Electrónico <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    id="invite-email"
                    type="email"
                    required
                    placeholder="ejemplo@yieldstudio.io"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="invite-name"
                    className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"
                  >
                    Nombre Completo (Opcional)
                  </label>
                  <input
                    id="invite-name"
                    type="text"
                    placeholder="Ej. Valentina Rossi"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="invite-role"
                    className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"
                  >
                    Rol en el Equipo <span className="text-indigo-400">*</span>
                  </label>
                  <select
                    id="invite-role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as TeamRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="Admin" className="bg-slate-900 text-foreground">
                      Admin — Acceso total y gestión de facturación
                    </option>
                    <option value="Developer" className="bg-slate-900 text-foreground">
                      Developer — Acceso a repositorios, scrapers y despliegues
                    </option>
                    <option value="Designer" className="bg-slate-900 text-foreground">
                      Designer — Acceso a recursos de diseño y componentes UI
                    </option>
                    <option value="DevOps" className="bg-slate-900 text-foreground">
                      DevOps — Infraestructura Cloud, dominios y pipelines
                    </option>
                    <option value="QA" className="bg-slate-900 text-foreground">
                      QA — Pruebas automatizadas y validación de calidad
                    </option>
                    <option value="Product" className="bg-slate-900 text-foreground">
                      Product — Métricas, roadmaps y gestión de producto
                    </option>
                  </select>
                </div>

                <DialogFooter>
                  <DialogClose className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground text-sm font-medium transition-colors cursor-pointer">
                    Cancelar
                  </DialogClose>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-foreground font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    Enviar Invitación
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tarjetas de Métricas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border backdrop-blur-md shadow-xl flex items-center gap-4 hover:border-white/20 transition-colors">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Total Miembros
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">{stats.total}</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border backdrop-blur-md shadow-xl flex items-center gap-4 hover:border-white/20 transition-colors">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Miembros Activos
                </p>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">{stats.active}</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border backdrop-blur-md shadow-xl flex items-center gap-4 hover:border-white/20 transition-colors">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Administradores
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">{stats.admins}</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border backdrop-blur-md shadow-xl flex items-center gap-4 hover:border-white/20 transition-colors">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Invitaciones
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">{stats.pending}</h3>
            </div>
          </div>
        </div>

        {/* Barra de Filtros, Búsqueda y Selector de Modo de Vista */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border backdrop-blur-md shadow-xl">
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
            {/* Buscador */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o rol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all"
              />
            </div>

            {/* Filtros por Rol */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {["all", "Admin", "Developer", "Designer", "DevOps", "QA"].map((role) => {
                const isSelected = selectedRole === role;
                const label = role === "all" ? "Todos" : role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? "bg-indigo-500 text-foreground shadow-md shadow-indigo-500/20"
                        : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selector de Modo de Vista (Tabla o Cuadrícula) */}
          <div className="flex items-center gap-1 self-end sm:self-auto bg-background/60 p-1 rounded-xl border border-border">
            <button
              type="button"
              aria-label="Vista tabla"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-white/10 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Vista cuadrícula"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white/10 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenido Principal: Lista de Miembros (Tabla o Grid) */}
        {filteredMembers.length === 0 ? (
          /* Estado Vacío */
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-border backdrop-blur-md shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">No se encontraron miembros</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm mx-auto">
                No hay ningún miembro que coincida con los criterios de búsqueda o filtros
                seleccionados.
              </p>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpiar búsqueda
            </button>
          </div>
        ) : viewMode === "table" ? (
          /* Vista de Tabla (Sleek Table) */
          <div className="rounded-2xl border border-border overflow-hidden bg-white/[0.02] backdrop-blur-md shadow-2xl">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-white/[0.02]">
                  <TableHead className="py-3.5 px-6">Miembro</TableHead>
                  <TableHead className="py-3.5 px-6">Correo Electrónico</TableHead>
                  <TableHead className="py-3.5 px-6">Rol</TableHead>
                  <TableHead className="py-3.5 px-6">Estado</TableHead>
                  <TableHead className="py-3.5 px-6">Última Actividad</TableHead>
                  <TableHead className="py-3.5 px-6 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => {
                  const roleConfig = ROLE_CONFIG[member.role] || ROLE_CONFIG.Developer;

                  return (
                    <TableRow key={member.id} className="hover:bg-card transition-colors group">
                      {/* Miembro: Avatar + Nombre */}
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar
                            size="default"
                            className="border border-border ring-1 ring-white/10"
                          >
                            {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300 font-bold text-xs">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-semibold text-foreground group-hover:text-indigo-400 transition-colors block">
                              {member.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Miembro desde {member.joinedDate}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="py-4 px-6">
                        <span className="text-sm text-muted-foreground font-mono flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          {member.email}
                        </span>
                      </TableCell>

                      {/* Rol editable con selector Dark Glassmorphism */}
                      <TableCell className="py-4 px-6">
                        <div className="relative inline-flex items-center">
                          <select
                            aria-label={`Cambiar rol de ${member.name}`}
                            value={member.role}
                            onChange={(e) =>
                              handleRoleChange(member.id, e.target.value as TeamRole)
                            }
                            className={`appearance-none inline-flex items-center gap-1.5 pl-3 pr-7 py-1 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all ${roleConfig.color} bg-slate-900/60 hover:bg-slate-900/90`}
                          >
                            <option value="Admin" className="bg-slate-900 text-foreground">
                              Admin
                            </option>
                            <option value="Developer" className="bg-slate-900 text-foreground">
                              Developer
                            </option>
                            <option value="Designer" className="bg-slate-900 text-foreground">
                              Designer
                            </option>
                            <option value="DevOps" className="bg-slate-900 text-foreground">
                              DevOps
                            </option>
                            <option value="QA" className="bg-slate-900 text-foreground">
                              QA
                            </option>
                            <option value="Product" className="bg-slate-900 text-foreground">
                              Product
                            </option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-2 pointer-events-none text-muted-foreground opacity-60" />
                        </div>
                      </TableCell>

                      {/* Estado alternable ('active' | 'offline' | 'pending') */}
                      <TableCell className="py-4 px-6">
                        <button
                          type="button"
                          aria-label={`Alternar estado de ${member.name}`}
                          title={`Estado actual: ${member.status}. Haz clic para alternar.`}
                          onClick={() => handleToggleStatus(member)}
                          className="group/btn inline-flex items-center cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                        >
                          {member.status === "active" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover/btn:border-emerald-500/40">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                              </span>
                              Activo
                            </span>
                          ) : member.status === "offline" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-muted-foreground border border-slate-500/20 group-hover/btn:border-slate-500/40">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                              Inactivo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover/btn:border-amber-500/40">
                              <Clock className="w-3 h-3" />
                              Pendiente
                            </span>
                          )}
                        </button>
                      </TableCell>

                      {/* Última Actividad */}
                      <TableCell className="py-4 px-6 text-xs text-muted-foreground font-mono">
                        {member.lastActive}
                      </TableCell>

                      {/* Acciones: Botón Eliminar */}
                      <TableCell className="py-4 px-6 text-right">
                        <button
                          type="button"
                          aria-label={`Eliminar a ${member.name}`}
                          title="Eliminar miembro"
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          /* Vista de Cuadrícula (Grid) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => {
              const roleConfig = ROLE_CONFIG[member.role] || ROLE_CONFIG.Developer;

              return (
                <div
                  key={member.id}
                  className="group relative flex flex-col justify-between p-6 rounded-2xl bg-card hover:bg-white/[0.05] border border-border hover:border-white/20 backdrop-blur-md shadow-xl transition-all duration-300"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar size="lg" className="border border-border ring-1 ring-white/10">
                          {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300 font-bold text-sm">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-base font-bold text-foreground group-hover:text-indigo-400 transition-colors">
                            {member.name}
                          </h2>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono mt-0.5">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            {member.email}
                          </span>
                        </div>
                      </div>

                      {/* Badge/Button de Estado Interactivo */}
                      <button
                        type="button"
                        aria-label={`Alternar estado de ${member.name}`}
                        title={`Estado actual: ${member.status}. Haz clic para alternar.`}
                        onClick={() => handleToggleStatus(member)}
                        className="group/btn inline-flex items-center cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                      >
                        {member.status === "active" ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover/btn:border-emerald-500/40">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            Activo
                          </span>
                        ) : member.status === "offline" ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-muted-foreground border border-slate-500/20 group-hover/btn:border-slate-500/40">
                            Inactivo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover/btn:border-amber-500/40">
                            Pendiente
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Footer: Rol editable + Última Actividad + Botón Eliminar */}
                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <div className="relative inline-flex items-center">
                      <select
                        aria-label={`Cambiar rol de ${member.name}`}
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value as TeamRole)}
                        className={`appearance-none inline-flex items-center gap-1.5 pl-2.5 pr-6 py-0.5 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all ${roleConfig.color} bg-slate-900/60 hover:bg-slate-900/90`}
                      >
                        <option value="Admin" className="bg-slate-900 text-foreground">
                          Admin
                        </option>
                        <option value="Developer" className="bg-slate-900 text-foreground">
                          Developer
                        </option>
                        <option value="Designer" className="bg-slate-900 text-foreground">
                          Designer
                        </option>
                        <option value="DevOps" className="bg-slate-900 text-foreground">
                          DevOps
                        </option>
                        <option value="QA" className="bg-slate-900 text-foreground">
                          QA
                        </option>
                        <option value="Product" className="bg-slate-900 text-foreground">
                          Product
                        </option>
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-1.5 pointer-events-none text-muted-foreground opacity-60" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-muted-foreground text-[11px]">
                        {member.lastActive}
                      </span>
                      <button
                        type="button"
                        aria-label={`Eliminar a ${member.name}`}
                        title="Eliminar miembro"
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
