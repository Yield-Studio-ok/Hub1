"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  FolderGit2,
  Database,
  Users,
  Activity,
  CheckCircle2,
  ExternalLink,
  Clock,
  PlayCircle,
  Plus,
  MoreVertical,
  Settings,
  CheckSquare,
  Terminal,
  Key,
  ServerCog,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// FAKE DATA FOR MOCKUP
const PROJECT = {
  id: "3",
  name: "Hub Yield Studio",
  type: "Web App",
  description:
    "Plataforma centralizada para la gestión de proyectos, leads y equipo de Yield Studio.",
  status: "Producción",
  github: "yield-studio/hub",
  url: "https://hub.yieldstudio.io",
  db_neon: "ep-rough-morning-9381.us-east-2.aws.neon.tech",
  lastDeploy: "Hace 2 horas",
};

const TEAM = [
  { id: 1, name: "Leandro Carrasco", role: "Lead Dev", initials: "LC" },
  { id: 2, name: "Admin Yield", role: "Manager", initials: "AY" },
];

const TICKETS = [
  { id: "YLD-42", title: "Refactor Dashboard UI", status: "In Progress", priority: "High" },
  { id: "YLD-41", title: "Setup Neon DB Connection", status: "Todo", priority: "Medium" },
  { id: "YLD-40", title: "Fix Floating Timer", status: "Done", priority: "Low" },
];

const ACTIVITY = [
  {
    id: 1,
    user: "Leandro Carrasco",
    action: "trabajó en",
    target: "YLD-42 (Refactor Dashboard UI)",
    time: "Hace 1 hora",
    duration: "1h 30m",
  },
  {
    id: 2,
    user: "Leandro Carrasco",
    action: "pusheó al repo",
    target: "develop",
    time: "Hace 2 horas",
  },
  { id: 3, user: "Admin Yield", action: "creó el proyecto", target: "", time: "El 2026-09-10" },
];

const MOCK_LOGS = `[14:22:11] Clonando repositorio yield-studio/hub (branch: main)...
[14:22:12] Clonado exitosamente en 1.2s
[14:22:13] Restaurando caché de pnpm (1.4 GB)...
[14:22:15] Instalando dependencias con pnpm i...
[14:22:20] Ejecutando pnpm build...
[14:22:22] next build --experimental-build-mode
[14:22:25] ✓ Compilando rutas usando Turbopack
[14:22:30] ✓ Generando páginas estáticas (5/5)
[14:22:32] ✓ Optimizando imágenes y assets
[14:22:35] Despliegue completado.
[14:22:36] Ready! Asignando dominio: hub.yieldstudio.io`;

const MOCK_ENV = [
  {
    key: "DATABASE_URL",
    value:
      "postgresql://neon_user:******@ep-rough-morning-9381.us-east-2.aws.neon.tech/main?sslmode=require",
    env: "Producción",
  },
  { key: "NEXT_PUBLIC_FIREBASE_API_KEY", value: "AIzaSyB_dummy_key_X1yZ2", env: "Ambos" },
  { key: "RESEND_API_KEY", value: "re_AbCdEfGhIjKlMnOp", env: "Producción" },
];

const MOCK_DNS = [
  { type: "A", name: "@", content: "76.76.21.21", ttl: "Automático" },
  { type: "CNAME", name: "www", content: "cname.vercel-dns.com", ttl: "Automático" },
];

export default function ProjectDetailsPage({ params: _params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [infraTab, setInfraTab] = useState("logs");
  const [showEnvs, setShowEnvs] = useState<Record<string, boolean>>({});
  const [neonConsumption, setNeonConsumption] = useState<any>(null);

  useEffect(() => {
    async function fetchConsumption() {
      try {
        const res = await fetch(`http://localhost:4000/neon/projects/${PROJECT.id}/consumption`);
        if (res.ok) {
          const data = await res.json();
          setNeonConsumption(data);
        }
      } catch (err) {
        console.error("Failed to fetch Neon consumption", err);
      }
    }
    fetchConsumption();
  }, []);

  const toggleEnv = (key: string) => {
    setShowEnvs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto font-sans relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {PROJECT.name}
              </h1>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                {PROJECT.status}
              </span>
            </div>
            <p className="text-muted-foreground mt-1">{PROJECT.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Configuración
          </Button>
          <Button className="gap-2">
            <PlayCircle className="w-4 h-4" />
            Iniciar Trabajo
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="w-full flex justify-start">
          <TabsTrigger value="overview" className="h-9 px-6 gap-2">
            <Activity className="w-4 h-4" /> Resumen
          </TabsTrigger>
          <TabsTrigger value="tasks" className="h-9 px-6 gap-2">
            <CheckSquare className="w-4 h-4" /> Tareas (Plane)
          </TabsTrigger>
          <TabsTrigger value="infrastructure" className="h-9 px-6 gap-2">
            <Globe className="w-4 h-4" /> Infraestructura & Deploy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Infraestructura Rapida */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card
                className="p-5 bg-card border border-border shadow-sm flex flex-col justify-between cursor-pointer hover:border-primary/50 transition-colors group"
                onClick={() => {
                  setActiveTab("infrastructure");
                  setInfraTab("logs");
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-sm group-hover:text-foreground transition-colors">
                      Deploy Principal
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground break-all">{PROJECT.url}</h3>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Último deploy{" "}
                    {PROJECT.lastDeploy}
                  </span>
                  <a
                    href={PROJECT.url}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    Visitar <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>

              <Card className="p-5 bg-card border border-border shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <FolderGit2 className="w-5 h-5 text-foreground" />
                    <span className="font-medium text-sm">Repositorio GitHub</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{PROJECT.github}</h3>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Rama principal: <span className="font-medium text-foreground">develop</span>
                  </span>
                  <a
                    href={`https://github.com/${PROJECT.github}`}
                    target="_blank"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    Ver Repo <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>

              <Card
                className="p-5 bg-card border border-border shadow-sm flex flex-col justify-between sm:col-span-2 cursor-pointer hover:border-primary/50 transition-colors group"
                onClick={() => {
                  setActiveTab("infrastructure");
                  setInfraTab("env");
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                      <Database className="w-5 h-5 text-emerald-400" />
                      <span className="font-medium text-sm group-hover:text-foreground transition-colors">
                        Base de Datos (Neon Postgres)
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground font-mono bg-muted px-2 py-1 rounded inline-block">
                      {PROJECT.db_neon}
                    </h3>
                    {neonConsumption &&
                      neonConsumption.project &&
                      neonConsumption.project.consumption && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border text-xs text-muted-foreground grid grid-cols-2 gap-2">
                          <div>
                            <span className="block text-xs uppercase font-semibold text-foreground/70">
                              Storage
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {(
                                neonConsumption.project.consumption.data_storage_bytes_hour /
                                (1024 * 1024)
                              ).toFixed(2)}{" "}
                              MB
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs uppercase font-semibold text-foreground/70">
                              Compute
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {(
                                neonConsumption.project.consumption.compute_time_seconds / 3600
                              ).toFixed(2)}{" "}
                              hrs
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                  <Badge status="Conectado" />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                  <span>
                    Pooler Activo. Branch: <span className="font-medium text-foreground">main</span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("infrastructure");
                      setInfraTab("env");
                    }}
                  >
                    Configurar Variables
                  </Button>
                </div>
              </Card>
            </div>

            {/* Sidebar Overview */}
            <div className="space-y-6">
              {/* Miembros */}
              <Card className="p-5 bg-card border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" /> Equipo ({TEAM.length})
                  </h3>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {TEAM.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold border border-primary/30">
                        {member.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground leading-none">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Actividad Reciente */}
              <Card className="p-5 bg-card border border-border shadow-sm">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4" /> Actividad
                </h3>
                <div className="space-y-4">
                  {ACTIVITY.map((act) => (
                    <div
                      key={act.id}
                      className="relative pl-4 border-l-2 border-border last:border-l-transparent pb-1"
                    >
                      <div className="absolute w-2 h-2 bg-border rounded-full -left-[5px] top-1.5 ring-4 ring-card"></div>
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">{act.user}</span> {act.action}{" "}
                        <span className="font-medium text-primary">{act.target}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{act.time}</span>
                        {act.duration && (
                          <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">
                            {act.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <Card className="p-0 bg-card border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Integración con Plane
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Tickets y tareas activas para este proyecto.
                </p>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Nuevo Ticket
              </Button>
            </div>
            <div className="divide-y divide-border">
              {TICKETS.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-muted-foreground w-16">
                      {ticket.id}
                    </span>
                    <span className="text-sm font-medium text-foreground">{ticket.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-md border ${
                        ticket.status === "Done"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : ticket.status === "In Progress"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {ticket.status}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-md border ${
                        ticket.priority === "High"
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : ticket.priority === "Medium"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-0">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Infra Sidebar Navigation */}
            <div className="w-full md:w-64 shrink-0 space-y-1">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                Gestión
              </h3>
              <Button
                variant={infraTab === "logs" ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => setInfraTab("logs")}
              >
                <Terminal
                  className={`w-4 h-4 ${infraTab === "logs" ? "text-primary" : "text-muted-foreground"}`}
                />
                Logs del Deploy
              </Button>
              <Button
                variant={infraTab === "env" ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => setInfraTab("env")}
              >
                <Key
                  className={`w-4 h-4 ${infraTab === "env" ? "text-primary" : "text-muted-foreground"}`}
                />
                Variables de Entorno
              </Button>
              <Button
                variant={infraTab === "dns" ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => setInfraTab("dns")}
              >
                <ServerCog
                  className={`w-4 h-4 ${infraTab === "dns" ? "text-primary" : "text-muted-foreground"}`}
                />
                Dominios y DNS
              </Button>
            </div>

            {/* Infra Content Area */}
            <div className="flex-1 min-w-0">
              {/* === LOGS VIEW === */}
              {infraTab === "logs" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Logs de Producción</h2>
                      <p className="text-sm text-muted-foreground">
                        Mostrando el último despliegue (hace 2 horas)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="w-3.5 h-3.5" /> Re-deploy
                      </Button>
                    </div>
                  </div>

                  <div className="bg-[#0c0c0c] rounded-xl border border-border/40 overflow-hidden shadow-inner">
                    <div className="flex items-center px-4 py-2 border-b border-white/5 bg-[#141414]">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                      </div>
                      <span className="ml-4 text-xs font-mono text-white/40">
                        Terminal — yield-studio/hub
                      </span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <pre className="font-mono text-xs leading-loose text-gray-300 whitespace-pre">
                        {MOCK_LOGS.split("\n").map((line, i) => {
                          const isSuccess =
                            line.includes("✓") ||
                            line.includes("Ready") ||
                            line.includes("exitosamente");
                          const isWarning = line.includes("warn");
                          const isError = line.includes("error");
                          return (
                            <div
                              key={i}
                              className={`hover:bg-white/5 px-2 -mx-2 rounded ${
                                isSuccess
                                  ? "text-emerald-400"
                                  : isWarning
                                    ? "text-amber-400"
                                    : isError
                                      ? "text-red-400"
                                      : ""
                              }`}
                            >
                              {line}
                            </div>
                          );
                        })}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* === VARIABLES DE ENTORNO VIEW === */}
              {infraTab === "env" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Variables de Entorno</h2>
                      <p className="text-sm text-muted-foreground">
                        Configura las credenciales y secretos del proyecto.
                      </p>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" /> Agregar Variable
                    </Button>
                  </div>

                  <Card className="border border-border overflow-hidden">
                    <div className="divide-y divide-border">
                      {MOCK_ENV.map((env, i) => (
                        <div key={i} className="p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-sm font-semibold text-foreground">
                                  {env.key}
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                  {env.env}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <code className="text-xs bg-muted/50 p-1.5 rounded text-muted-foreground flex-1 truncate font-mono border border-border/50">
                                  {showEnvs[env.key]
                                    ? env.value
                                    : "••••••••••••••••••••••••••••••••"}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 shrink-0"
                                  onClick={() => toggleEnv(env.key)}
                                >
                                  {showEnvs[env.key] ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div className="flex items-center gap-2 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>
                      Cualquier cambio en las variables de entorno requiere un{" "}
                      <strong>nuevo despliegue</strong> para tener efecto en Producción.
                    </p>
                  </div>
                </div>
              )}

              {/* === DNS VIEW === */}
              {infraTab === "dns" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Dominios y DNS</h2>
                      <p className="text-sm text-muted-foreground">
                        Administra los dominios personalizados asociados.
                      </p>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" /> Agregar Dominio
                    </Button>
                  </div>

                  <Card className="p-5 border border-border">
                    <h3 className="font-semibold text-foreground mb-4">Dominio Principal</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div>
                        <span className="text-lg font-bold text-emerald-500">
                          hub.yieldstudio.io
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm text-emerald-500/80">
                            Configuración DNS Válida
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" className="bg-background/50">
                        Opciones
                      </Button>
                    </div>
                  </Card>

                  <Card className="border border-border overflow-hidden mt-6">
                    <div className="p-4 border-b border-border bg-muted/30">
                      <h3 className="font-semibold text-foreground">Registros DNS Requeridos</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Configura estos registros en tu proveedor de dominio (ej: Cloudflare,
                        GoDaddy).
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground text-xs uppercase font-semibold">
                          <tr>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Contenido (Valor)</th>
                            <th className="px-4 py-3">TTL</th>
                            <th className="px-4 py-3 text-right">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {MOCK_DNS.map((dns, i) => (
                            <tr key={i} className="hover:bg-muted/30">
                              <td className="px-4 py-3 font-mono font-bold">{dns.type}</td>
                              <td className="px-4 py-3 font-mono text-muted-foreground">
                                {dns.name}
                              </td>
                              <td className="px-4 py-3 font-mono truncate max-w-[200px]">
                                {dns.content}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">{dns.ttl}</td>
                              <td className="px-4 py-3 text-right">
                                <Button variant="ghost" size="sm" className="h-8">
                                  Copiar
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  return (
    <span className="px-2 py-1 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
      <CheckCircle2 className="w-3 h-3" />
      {status}
    </span>
  );
}
