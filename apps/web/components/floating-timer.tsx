"use client";

import React, { useState, useEffect, useRef } from "react";
import { PlayIcon, PauseIcon, SquareIcon, TimerIcon } from "lucide-react";
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

interface Project {
  id: string;
  name: string;
}

interface Ticket {
  id: string;
  name: string;
  project_id: string;
}

export function FloatingTimer() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  useEffect(() => {
    if (selectedProject) {
      fetchTickets(selectedProject.id);
    } else {
      setTickets([]);
      setSelectedTicket(null);
    }
  }, [selectedProject]);

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

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const token = await user?.getIdToken();
      // Mocked endpoint or actual endpoint
      const res = await apiFetch<{ success: boolean; data: Project[] }>("/api/plane/projects", {
        token,
      });
      if (res && res.success) {
        setProjects(res.data || []);
      } else {
        // Fallback mock
        setProjects([
          { id: "proj-1", name: "Mock Project 1" },
          { id: "proj-2", name: "Mock Project 2" },
        ]);
      }
    } catch (err) {
      console.error("Error fetching projects", err);
      setProjects([
        { id: "proj-1", name: "Mock Project 1" },
        { id: "proj-2", name: "Mock Project 2" },
      ]);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchTickets = async (projectId: string) => {
    try {
      setLoadingTickets(true);
      const token = await user?.getIdToken();
      const res = await apiFetch<{ success: boolean; data: Ticket[] }>(
        `/api/plane/tickets?projectId=${projectId}`,
        { token },
      );
      if (res && res.success) {
        setTickets(res.data || []);
      } else {
        // Fallback mock
        setTickets([{ id: "tick-1", name: "Mock Ticket 1", project_id: projectId }]);
      }
    } catch (err) {
      console.error("Error fetching tickets", err);
      setTickets([{ id: "tick-1", name: "Mock Ticket 1", project_id: projectId }]);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handlePlay = () => {
    if (!selectedTicket || !selectedProject) return;
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleStop = async () => {
    setIsRunning(false);
    if (!selectedTicket || !selectedProject || seconds === 0) {
      setSeconds(0);
      setSelectedTicket(null);
      setSelectedProject(null);
      return;
    }

    try {
      const token = await user?.getIdToken();
      await apiFetch("/api/plane/worklog", {
        method: "POST",
        token,
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          projectId: selectedProject.id,
          durationSeconds: seconds,
        }),
      });
      setSeconds(0);
      setSelectedTicket(null);
      setSelectedProject(null);
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

  const isIdle = !selectedTicket && !selectedProject && !isHovered && seconds === 0;

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`flex items-center gap-3 p-1.5 shadow-2xl rounded-full border border-border/40 bg-background/80 backdrop-blur-xl transition-all duration-300 ease-in-out overflow-hidden ${isIdle ? "w-14 h-14 justify-center" : "w-auto px-3 h-14"}`}
      >
        {isIdle ? (
          <TimerIcon className="h-6 w-6 text-muted-foreground" aria-label="Timer Icon" />
        ) : (
          <>
            {/* Project Select */}
            <DropdownMenu open={isProjectOpen} onOpenChange={setIsProjectOpen}>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    role="combobox"
                    aria-label="Select Project"
                    className="h-10 px-3 rounded-full hover:bg-muted/50 border-0 max-w-[150px]"
                    disabled={isRunning}
                  >
                    <span className="truncate text-sm font-medium">
                      {selectedProject ? selectedProject.name : "Select Project..."}
                    </span>
                  </Button>
                }
              />
              <DropdownMenuContent className="w-64" side="top" align="start">
                {loadingProjects ? (
                  <div className="p-3 text-sm text-center text-muted-foreground">Loading...</div>
                ) : projects.length === 0 ? (
                  <div className="p-3 text-sm text-center text-muted-foreground">No projects</div>
                ) : (
                  projects.map((p) => (
                    <DropdownMenuItem
                      key={p.id}
                      onSelect={() => {
                        setSelectedProject(p);
                        setIsProjectOpen(false);
                      }}
                      className="cursor-pointer text-sm py-2"
                    >
                      {p.name}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-border/50 mx-1"></div>

            {/* Ticket Select */}
            <DropdownMenu open={isTicketOpen} onOpenChange={setIsTicketOpen}>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    role="combobox"
                    aria-label="Select Ticket"
                    className="h-10 px-3 rounded-full hover:bg-muted/50 border-0 max-w-[150px]"
                    disabled={isRunning || !selectedProject}
                  >
                    <span className="truncate text-sm font-medium">
                      {selectedTicket ? selectedTicket.name : "Select Ticket..."}
                    </span>
                  </Button>
                }
              />
              <DropdownMenuContent className="w-64" side="top" align="start">
                {!selectedProject ? (
                  <div className="p-3 text-sm text-center text-muted-foreground">
                    Select a project first
                  </div>
                ) : loadingTickets ? (
                  <div className="p-3 text-sm text-center text-muted-foreground">Loading...</div>
                ) : tickets.length === 0 ? (
                  <div className="p-3 text-sm text-center text-muted-foreground">No tickets</div>
                ) : (
                  tickets.map((t) => (
                    <DropdownMenuItem
                      key={t.id}
                      onSelect={() => {
                        setSelectedTicket(t);
                        setIsTicketOpen(false);
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
                  aria-label="Play"
                  className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                  onClick={handlePlay}
                  disabled={!selectedTicket || !selectedProject}
                >
                  <PlayIcon className="h-4 w-4 ml-0.5" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  aria-label="Pause"
                  className="h-9 w-9 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                  onClick={handlePause}
                >
                  <PauseIcon className="h-4 w-4" />
                </Button>
              )}

              <Button
                size="icon"
                variant="outline"
                aria-label="Stop"
                className={`h-9 w-9 rounded-full border-border/50 ${!selectedTicket && !selectedProject && seconds === 0 ? "opacity-50" : "hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"}`}
                onClick={handleStop}
                disabled={!selectedTicket && !selectedProject && seconds === 0}
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
