"use client";

import React, { useState, useEffect, useRef } from "react";
import { PlayIcon, PauseIcon, SquareIcon, ChevronUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Ticket {
  id: string;
  name: string;
  project_id: string;
  project?: {
    id: string;
    name: string;
  };
}

export function FloatingTimer() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Use a ref for the interval to be able to clear it
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);
      const token = await user?.getIdToken();
      const res = await apiFetch<{ success: boolean; data: Ticket[] }>("/api/plane/tickets", {
        token,
      });
      if (res.success) {
        setTickets(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching tickets", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handlePlay = () => {
    if (!selectedTicket) return;
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = async () => {
    setIsRunning(false);
    if (!selectedTicket || seconds === 0) {
      setSeconds(0);
      setSelectedTicket(null);
      return;
    }

    try {
      const token = await user?.getIdToken();
      await apiFetch("/api/plane/worklog", {
        method: "POST",
        token,
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          projectId: selectedTicket.project_id || selectedTicket.project?.id,
          durationSeconds: seconds,
        }),
      });
      // Reset after successful save
      setSeconds(0);
      setSelectedTicket(null);
    } catch (err) {
      console.error("Failed to save worklog", err);
      // Optional: show toast
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="flex flex-col p-4 shadow-lg w-72 bg-background border-border">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold">Timer</span>
          <div className="text-xl font-mono">{formatTime(seconds)}</div>
        </div>

        <div className="mb-4">
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOpen}
                  className="w-full justify-between truncate"
                  disabled={isRunning}
                >
                  {selectedTicket ? (
                    <span className="truncate block overflow-hidden">{selectedTicket.name}</span>
                  ) : (
                    "Seleccionar ticket..."
                  )}
                  <ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              }
            />
            <DropdownMenuContent className="w-64 max-h-[300px]" side="top">
              {loadingTickets ? (
                <div className="p-2 text-sm text-center text-muted-foreground">Cargando...</div>
              ) : tickets.length === 0 ? (
                <div className="p-2 text-sm text-center text-muted-foreground">No hay tickets</div>
              ) : (
                tickets.map((t) => (
                  <DropdownMenuItem
                    key={t.id}
                    onSelect={() => {
                      setSelectedTicket(t);
                      setIsOpen(false);
                    }}
                    className="truncate"
                  >
                    {t.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-center gap-2">
          {!isRunning ? (
            <Button
              size="icon"
              variant="primary"
              onClick={handlePlay}
              disabled={!selectedTicket}
              title="Iniciar timer"
            >
              <PlayIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="icon" variant="secondary" onClick={handlePause} title="Pausar timer">
              <PauseIcon className="h-4 w-4" />
            </Button>
          )}

          <Button
            size="icon"
            variant="destructive"
            onClick={handleStop}
            disabled={!selectedTicket && seconds === 0}
            title="Detener y guardar"
          >
            <SquareIcon className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
