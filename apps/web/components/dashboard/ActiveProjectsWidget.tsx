import React, { useEffect, useState } from "react";
import { fetchActiveProjects, ProjectIntegration } from "../../lib/api/projects";
import { Activity, GitCommit, Rocket } from "lucide-react";

export default function ActiveProjectsWidget() {
  const [projects, setProjects] = useState<ProjectIntegration[] | null>(null);

  useEffect(() => {
    fetchActiveProjects().then(setProjects);
  }, []);

  if (!projects) {
    return (
      <div
        data-testid="projects-skeleton"
        className="p-5 bg-card rounded-2xl border border-border shadow-sm flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex items-center gap-3 mb-2">
          <Activity className="h-5 w-5 text-amber-500 animate-pulse" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Proyectos Activos
          </h3>
        </div>
        <div className="h-8 bg-muted rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-card rounded-2xl border border-border shadow-sm flex flex-col justify-between row-span-2">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="h-5 w-5 text-amber-500" />
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Proyectos Activos ({projects.length})
        </h3>
      </div>
      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="flex flex-col bg-muted/30 p-3 rounded-lg border border-border">
            <span className="font-bold text-foreground text-sm mb-1">{p.name}</span>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <GitCommit className="w-3 h-3" /> {p.latestRelease}
              </span>
              <span className="flex items-center gap-1">
                <Rocket className="w-3 h-3" /> {p.deployStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
