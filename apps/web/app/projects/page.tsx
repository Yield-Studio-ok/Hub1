"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Plus, Globe, ShoppingCart, Monitor } from "lucide-react";

type ProjectType = "LANDING_PAGE" | "ECOMMERCE" | "WEB_APP";

interface Project {
  id: string;
  name: string;
  type: ProjectType;
  createdAt: string;
}

const PROJECT_TYPE_CONFIG: Record<
  ProjectType,
  { label: string; icon: typeof Globe; color: string }
> = {
  LANDING_PAGE: { label: "Landing Page", icon: Globe, color: "text-blue-500" },
  ECOMMERCE: { label: "E-commerce", icon: ShoppingCart, color: "text-green-500" },
  WEB_APP: { label: "Web App", icon: Monitor, color: "text-purple-500" },
};

const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "Portfolio Lean", type: "LANDING_PAGE", createdAt: "2026-09-01" },
  { id: "2", name: "Tienda Online", type: "ECOMMERCE", createdAt: "2026-09-05" },
  { id: "3", name: "Hub Yield Studio", type: "WEB_APP", createdAt: "2026-09-10" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<ProjectType>("WEB_APP");

  function handleCreate() {
    if (!newName.trim()) return;
    const project: Project = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      type: newType,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProjects((prev) => [project, ...prev]);
    setNewName("");
    setNewType("WEB_APP");
    setShowModal(false);
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Briefcase className="h-7 w-7 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Proyectos</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition"
        >
          <Plus className="h-4 w-4" />
          Crear Proyecto
        </button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const config = PROJECT_TYPE_CONFIG[project.type];
          const TypeIcon = config.icon;
          return (
            <Link
              href={`/projects/${project.id}`}
              key={project.id}
              className="block p-5 bg-card text-card-foreground rounded-xl border border-border hover:border-border/80 transition shadow-sm cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <TypeIcon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full bg-muted ${config.color}`}>
                  {config.label}
                </span>
                <span className="text-xs text-muted-foreground">{project.createdAt}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border shadow-lg rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-card-foreground mb-4">Nuevo Proyecto</h2>

            <label className="block text-sm text-muted-foreground mb-1">Nombre</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Mi proyecto..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-4"
            />

            <label className="block text-sm text-muted-foreground mb-2">Tipo de Proyecto</label>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {(
                Object.entries(PROJECT_TYPE_CONFIG) as [
                  ProjectType,
                  (typeof PROJECT_TYPE_CONFIG)[ProjectType],
                ][]
              ).map(([type, config]) => {
                const TypeIcon = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setNewType(type)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition ${
                      newType === type
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <TypeIcon className={`h-5 w-5 ${newType === type ? config.color : ""}`} />
                    <span className="text-xs">{config.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg transition"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
