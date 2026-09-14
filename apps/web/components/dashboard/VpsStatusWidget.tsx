"use client";

import React, { useEffect, useState } from "react";
import { Server, Cpu, Activity } from "lucide-react";

interface VpsStatus {
  cpuUsage: number;
  freeRam: number;
  topProcesses: {
    name: string;
    cpu: number;
    mem: number;
  }[];
}

export default function VpsStatusWidget() {
  const [status, setStatus] = useState<VpsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/infra/vps-status");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setStatus(data);
        setError(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !status) {
    return (
      <div className="p-5 bg-card rounded-2xl border border-border shadow-sm flex flex-col justify-between relative overflow-hidden group min-h-[220px] animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-5 bg-muted rounded-full"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
        <div className="space-y-4">
          <div className="h-3 w-full bg-muted rounded"></div>
          <div className="h-3 w-full bg-muted rounded"></div>
          <div className="h-3 w-full bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="p-5 bg-card rounded-2xl border border-border shadow-sm flex flex-col justify-between relative overflow-hidden group min-h-[220px]">
        <div className="flex items-center gap-3 mb-4">
          <Server className="h-5 w-5 text-red-500" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            VPS Core
          </h3>
        </div>
        <p className="text-sm text-red-500">Error al cargar datos.</p>
      </div>
    );
  }

  // Assumes total RAM is around 4096MB just for display if we don't fetch it,
  // but let's just show free RAM.
  const totalRam = 4096; // We can adjust this or fetch total RAM from API
  const usedRam = totalRam - (status?.freeRam || 0);
  const ramPercent = Math.round((usedRam / totalRam) * 100);

  return (
    <div className="p-5 bg-card rounded-2xl border border-border shadow-sm flex flex-col justify-between relative overflow-hidden group min-h-[220px]">
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
            <span className="text-foreground font-mono">{status?.cpuUsage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(status?.cpuUsage || 0, 100)}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Activity className="w-3 h-3" /> RAM Libre
            </span>
            <span className="text-foreground font-mono">{status?.freeRam} MB</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            {/* Just a visual bar for RAM */}
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${ramPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-2 border-t border-border relative z-10">
        <h4 className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
          Top Procesos
        </h4>
        <div className="space-y-1">
          {status?.topProcesses.slice(0, 3).map((proc, i) => (
            <div key={i} className="flex justify-between text-[10px]">
              <span className="text-foreground">{proc.name}</span>
              <span className="text-muted-foreground">{proc.cpu.toFixed(1)}% CPU</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
