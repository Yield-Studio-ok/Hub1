"use client";

import { GitCommit, Rocket, Activity, Clock } from "lucide-react";

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
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <GitCommit className="h-5 w-5 text-blue-400" />
            <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider">
              Commits (7d)
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">—</p>
          <p className="text-xs text-white/40 mt-1">Conectar API de GitHub</p>
        </div>

        <div className="p-5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="h-5 w-5 text-green-400" />
            <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider">
              Deploys (7d)
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">—</p>
          <p className="text-xs text-white/40 mt-1">Conectar CI/CD</p>
        </div>

        <div className="p-5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-purple-400" />
            <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider">
              Proyectos Activos
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">3</p>
          <p className="text-xs text-white/40 mt-1">Landing, E-commerce, Web App</p>
        </div>
      </div>

      {/* Recent Commits */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Actividad Reciente</h2>
        </div>
        <div className="space-y-3">
          {MOCK_COMMITS.map((commit) => (
            <div key={commit.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <GitCommit className="h-4 w-4 text-blue-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{commit.message}</p>
                <p className="text-xs text-white/40">
                  {commit.repo} · {commit.author} · {commit.date}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-white/30 mt-4">
          Los datos reales se mostrarán al conectar la API de GitHub (Ticket 2.3)
        </p>
      </div>
    </div>
  );
}
