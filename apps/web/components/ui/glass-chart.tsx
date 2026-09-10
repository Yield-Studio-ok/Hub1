"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GlassChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title?: string;
  loading?: boolean;
  error?: boolean;
}

export function GlassChart({ data, xKey, yKey, title, loading, error }: GlassChartProps) {
  if (loading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
        <div className="animate-pulse text-white/70">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
        <div className="text-red-400">Error al cargar los datos.</div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
      {title && <h3 className="text-lg font-semibold text-white/90 mb-4">{title}</h3>}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey={xKey}
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: "rgba(255,255,255,0.7)" }}
            />
            <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke="#8884d8"
              strokeWidth={3}
              dot={{ fill: "#8884d8", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "#8884d8" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
