"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { GlassChart } from "@/components/ui/glass-chart";

interface DailySignup {
  date: string;
  count: number;
}

interface DashboardMetrics {
  totalUsers: number;
  newUsersLast7Days: number;
  usersPerDay: DailySignup[];
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const token = await user?.getIdToken();
        const data = await apiFetch<DashboardMetrics>("/metrics", { token });
        setMetrics(data);
      } catch (err) {
        console.error("Failed to load metrics", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadMetrics();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white/90">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-500 transition border border-red-400/50"
          >
            Logout
          </button>
        </div>

        <p className="mb-8 text-slate-300">
          Bienvenido, <span className="font-semibold text-white">{user?.email}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
            <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-2">
              Total Users
            </h3>
            <p className="text-4xl font-bold text-white">{loading ? "-" : metrics?.totalUsers}</p>
          </div>
          <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
            <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-2">
              New Users (Last 7 Days)
            </h3>
            <p className="text-4xl font-bold text-white">
              {loading ? "-" : metrics?.newUsersLast7Days}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <GlassChart
            title="Nuevos Usuarios por Día"
            data={metrics?.usersPerDay || []}
            xKey="date"
            yKey="count"
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
