"use client";

import { GitCommit, Rocket, Activity, Clock, Server, Cpu, HardDrive } from "lucide-react";

// Placeholder data — will be replaced by real GitHub API data (Ticket 2.3)
const MOCK_COMMITS = [
  {
    id: "1",
    message: "feat: add project selector",
    repo: "Hub",
    author: "Lean",
    date: "hace 2 horas",
  },
  {
    id: "2",
    message: "fix: sidebar active state",
    repo: "Hub",
    author: "Lean",
    date: "hace 5 horas",
  },
  {
    id: "3",
    message: "chore: update dependencies",
    repo: "Turnero",
    author: "Lean",
    date: "hace 1 día",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto font-sans">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* VPS Widget - NUEVO */}
        <div className="p-5 bg-card rounded-2xl border border-border shadow-sm flex flex-col justify-between relative overflow-hidden group">
          {/* Luz de fondo decorativa */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -mr-10 -mt-10 pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-emerald-500" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                VPS Core
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-medium text-emerald-500">Online</span>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> CPU
                </span>
                <span className="text-foreground font-mono">12%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "12%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Activity className="w-3 h-3" /> RAM
                </span>
                <span className="text-foreground font-mono">4.2 / 8 GB</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "52%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <HardDrive className="w-3 h-3" /> Disco
                </span>
                <span className="text-foreground font-mono">45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 relative z-10 text-center border-t border-border pt-2">
            Esperando agente de telemetría (Epic 17)
          </p>
        </div>

        {/* Existing Widgets */}
        <div className="p-5 bg-card rounded-2xl border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <GitCommit className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Commits (7d)
            </h3>
          </div>
          <p className="text-4xl font-extrabold text-foreground">—</p>
          <p className="text-xs text-muted-foreground mt-2 border-t border-border/50 pt-2">
            Conectar API de GitHub
          </p>
        </div>

        <div className="p-5 bg-card rounded-2xl border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="h-5 w-5 text-purple-500" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Deploys (7d)
            </h3>
          </div>
          <p className="text-4xl font-extrabold text-foreground">—</p>
          <p className="text-xs text-muted-foreground mt-2 border-t border-border/50 pt-2">
            Conectar CI/CD
          </p>
        </div>

        <div className="p-5 bg-card rounded-2xl border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Proyectos Activos
            </h3>
          </div>
          <p className="text-4xl font-extrabold text-foreground">3</p>
          <p className="text-xs text-muted-foreground mt-2 border-t border-border/50 pt-2">
            Landing, E-commerce, Web App
          </p>
        </div>
      </div>

      {/* Recent Commits */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-bold text-foreground">Actividad Reciente</h2>
          </div>
        </div>

        <div className="space-y-4">
          {MOCK_COMMITS.map((commit) => (
            <div
              key={commit.id}
              className="flex items-start gap-4 p-4 bg-muted/40 hover:bg-muted rounded-xl transition-colors border border-transparent hover:border-border"
            >
              <div className="mt-1 p-2 bg-background rounded-lg border border-border shadow-sm">
                <GitCommit className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{commit.message}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground/80">{commit.repo}</span>
                  <span>•</span>
                  <span>{commit.author}</span>
                  <span>•</span>
                  <span>{commit.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            Los datos reales se mostrarán al conectar la API de GitHub (Ticket 2.3)
          </p>
        </div>
      </div>
    </div>
  );
}
