"use client";

import React, { useState, useEffect, useRef } from "react";
import { PlayIcon, PauseIcon, SquareIcon, ChevronUpIcon, TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
  const [isHovered, setIsHovered] = useState(false);

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

  const handlePause = () => setIsRunning(false);

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
      setSeconds(0);
      setSelectedTicket(null);
    } catch (err) {
      console.error("Failed to save worklog", err);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`flex items-center gap-3 p-1.5 shadow-2xl rounded-full border border-border/40 bg-background/80 backdrop-blur-xl transition-all duration-300 ease-in-out overflow-hidden ${!selectedTicket && !isHovered && seconds === 0 ? "w-14 h-14 justify-center" : "w-auto px-3 h-14"}`}
      >
        {!selectedTicket && !isHovered && seconds === 0 ? (
          <TimerIcon className="h-6 w-6 text-muted-foreground" />
        ) : (
          <>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    role="combobox"
                    className="h-10 px-3 rounded-full hover:bg-muted/50 border-0 max-w-[150px] sm:max-w-[200px]"
                    disabled={isRunning}
                  >
                    <span className="truncate text-sm font-medium">
                      {selectedTicket ? selectedTicket.name : "Seleccionar ticket..."}
                    </span>
                  </Button>
                }
              />
              <DropdownMenuContent className="w-64" side="top" align="start">
                {loadingTickets ? (
                  <div className="p-3 text-sm text-center text-muted-foreground">Cargando...</div>
                ) : tickets.length === 0 ? (
                  <div className="p-3 text-sm text-center text-muted-foreground">
                    No hay tickets
                  </div>
                ) : (
                  tickets.map((t) => (
                    <DropdownMenuItem
                      key={t.id}
                      onSelect={() => {
                        setSelectedTicket(t);
                        setIsOpen(false);
                      }}
                      className="cursor-pointer text-sm py-2"
                    >
                      {t.name}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-border/50 mx-1"></div>

            <div
              className={`font-mono text-lg tracking-tight font-medium w-[70px] text-center ${isRunning ? "text-primary" : "text-foreground"}`}
            >
              {formatTime(seconds)}
            </div>

            <div className="flex items-center gap-1.5 ml-1">
              {!isRunning ? (
                <Button
                  size="icon"
                  className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                  onClick={handlePlay}
                  disabled={!selectedTicket}
                >
                  <PlayIcon className="h-4 w-4 ml-0.5" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  className="h-9 w-9 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                  onClick={handlePause}
                >
                  <PauseIcon className="h-4 w-4" />
                </Button>
              )}

              <Button
                size="icon"
                variant="outline"
                className={`h-9 w-9 rounded-full border-border/50 ${!selectedTicket && seconds === 0 ? "opacity-50" : "hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"}`}
                onClick={handleStop}
                disabled={!selectedTicket && seconds === 0}
              >
                <SquareIcon className="h-3.5 w-3.5" fill="currentColor" />
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
