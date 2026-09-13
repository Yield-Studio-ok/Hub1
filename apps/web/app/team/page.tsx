"use client";

import { useState, useMemo, type FormEvent } from "react";
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
  MoreVertical,
  Clock,
  UserCheck,
  Compass,
  CheckCheck,
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

  // Form state for inviting new member
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<TeamRole>("Developer");

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

  const handleInviteMember = (e: FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const derivedName = newName.trim()
      ? newName.trim()
      : newEmail
          .split("@")[0]
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

    const initials = derivedName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");

    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      name: derivedName,
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      status: "active",
      initials: initials || "YM",
      joinedDate: "Justo ahora",
      lastActive: "Justo ahora",
    };

    setMembers([newMember, ...members]);
    setNewEmail("");
    setNewName("");
    setNewRole("Developer");
    setIsInviteOpen(false);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRole("all");
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto font-sans relative">
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

              <form onSubmit={handleInviteMember} className="space-y-4 my-2">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-foreground0 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm transition-all"
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
                    className="w-full px-3.5 py-2 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-foreground0 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm transition-all"
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
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-foreground0 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all"
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
                  const RoleIcon = roleConfig.icon;

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
                          <Mail className="w-3.5 h-3.5 text-foreground0" />
                          {member.email}
                        </span>
                      </TableCell>

                      {/* Rol */}
                      <TableCell className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${roleConfig.color}`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          {member.role}
                        </span>
                      </TableCell>

                      {/* Estado */}
                      <TableCell className="py-4 px-6">
                        {member.status === "active" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            Activo
                          </span>
                        ) : member.status === "offline" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-muted-foreground border border-slate-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                            Inactivo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </span>
                        )}
                      </TableCell>

                      {/* Última Actividad */}
                      <TableCell className="py-4 px-6 text-xs text-muted-foreground font-mono">
                        {member.lastActive}
                      </TableCell>

                      {/* Acciones */}
                      <TableCell className="py-4 px-6 text-right">
                        <button
                          type="button"
                          title="Opciones de miembro"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-foreground text-muted-foreground border border-border transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
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
              const RoleIcon = roleConfig.icon;

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
                            <Mail className="w-3 h-3 text-foreground0" />
                            {member.email}
                          </span>
                        </div>
                      </div>

                      {/* Badge de Estado */}
                      {member.status === "active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          Activo
                        </span>
                      ) : member.status === "offline" ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-muted-foreground border border-slate-500/20">
                          Inactivo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Pendiente
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${roleConfig.color}`}
                    >
                      <RoleIcon className="w-3 h-3" />
                      {member.role}
                    </span>

                    <span className="font-mono text-muted-foreground text-[11px]">
                      {member.lastActive}
                    </span>
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
