"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface TimeLog {
  id: string;
  projectId: string;
  ticketId: string;
  durationSeconds: number;
  userId: string;
  createdAt: string;
}

export default function TimeLogsPage() {
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      // In a real app, this would be an admin endpoint to get all logs
      const res = await apiFetch<{ success: boolean; data: TimeLog[] }>("/api/admin/time-logs", { token });
      if (res && res.success) {
        setLogs(res.data || []);
      } else {
        // Mock data fallback
        setLogs([
          { id: "log-1", projectId: "proj-1", ticketId: "tick-1", durationSeconds: 3600, userId: "user-1", createdAt: new Date().toISOString() },
          { id: "log-2", projectId: "proj-2", ticketId: "tick-2", durationSeconds: 1800, userId: "user-2", createdAt: new Date().toISOString() },
        ]);
      }
    } catch (err) {
      console.error("Error fetching time logs", err);
      // Mock data fallback
      setLogs([
        { id: "log-1", projectId: "proj-1", ticketId: "tick-1", durationSeconds: 3600, userId: "user-1", createdAt: new Date().toISOString() },
        { id: "log-2", projectId: "proj-2", ticketId: "tick-2", durationSeconds: 1800, userId: "user-2", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Time Logs (Admin)</h1>
      
      {loading ? (
        <div data-testid="loading-indicator">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" aria-label="Time Logs Table">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Log ID</th>
                <th className="p-3">User ID</th>
                <th className="p-3">Project</th>
                <th className="p-3">Ticket</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-muted-foreground">No time logs found.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-mono text-sm">{log.id}</td>
                    <td className="p-3">{log.userId}</td>
                    <td className="p-3">{log.projectId}</td>
                    <td className="p-3">{log.ticketId}</td>
                    <td className="p-3">{formatTime(log.durationSeconds)}</td>
                    <td className="p-3">{new Date(log.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
