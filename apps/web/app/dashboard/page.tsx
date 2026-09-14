"use client";

import { GitCommit, Rocket, Clock } from "lucide-react";
import VpsStatusWidget from "../../components/dashboard/VpsStatusWidget";
import ActiveProjectsWidget from "../../components/dashboard/ActiveProjectsWidget";

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
        <VpsStatusWidget />

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

        <ActiveProjectsWidget />
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
