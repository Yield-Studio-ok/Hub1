"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { parseEnvFile, ParsedEnvVar } from "@/lib/env-parser";
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  GitMerge,
  Replace,
} from "lucide-react";

export interface EnvVariable {
  key: string;
  value: string;
  env?: string;
}

export type ResolutionMode = "merge" | "overwrite";

export interface EnvDropzoneModalProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  existingVars?: EnvVariable[];
  onApply: (variables: ParsedEnvVar[], mode: ResolutionMode) => void;
}

export function EnvDropzoneModal({
  open,
  isOpen,
  onOpenChange,
  onClose,
  existingVars = [],
  onApply,
}: EnvDropzoneModalProps) {
  const isModalOpen = open !== undefined ? open : (isOpen ?? false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedVars, setParsedVars] = useState<ParsedEnvVar[]>([]);
  const [mode, setMode] = useState<ResolutionMode>("merge");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClose = () => {
    onOpenChange?.(false);
    onClose?.();
  };

  const handleClear = () => {
    setFileName(null);
    setParsedVars([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processFile = async (file: File) => {
    try {
      setFileName(file.name);
      let content = "";
      if (typeof file.text === "function") {
        content = await file.text();
      } else {
        content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.addEventListener("load", () => resolve(reader.result as string));
          reader.addEventListener("error", () => reject(reader.error));
          reader.readAsText(file);
        });
      }
      const vars = parseEnvFile(content);
      setParsedVars(vars);
    } catch (err) {
      console.error("Error reading .env file:", err);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const existingKeys = new Set(existingVars.map((v) => v.key));
  const conflictingKeys = parsedVars.filter((v) => existingKeys.has(v.key));

  const handleConfirm = () => {
    if (parsedVars.length === 0) return;
    onApply(parsedVars, mode);
    handleClose();
    handleClear();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <UploadCloud className="w-5 h-5 text-primary" />
            Importar Variables de Entorno
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Carga un archivo .env, .env.local o .env.production para sincronizar las variables del
            proyecto.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Dropzone Area */}
          {!fileName ? (
            <div
              data-testid="env-dropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-border/80 hover:border-primary/50 hover:bg-muted/30 bg-muted/10"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Arrastra y suelta tu archivo .env aquí, o haz clic para explorar
                </p>
                <p className="text-xs text-muted-foreground">
                  Compatible con .env, .env.local, .env.development, .env.production
                </p>
              </div>
              <input
                ref={fileInputRef}
                data-testid="env-file-input"
                type="file"
                className="hidden"
                accept=".env,.env.*,text/plain"
                onChange={handleFileInputChange}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-mono">{fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {parsedVars.length} variable{parsedVars.length === 1 ? "" : "s"} detectada
                    {parsedVars.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 gap-1.5 h-8 px-2.5"
                onClick={handleClear}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Cambiar archivo
              </Button>
            </div>
          )}

          {/* Conflict Alert */}
          {conflictingKeys.length > 0 && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">
                  {conflictingKeys.length} conflicto{conflictingKeys.length === 1 ? "" : "s"}{" "}
                  detectado{conflictingKeys.length === 1 ? "" : "s"}:
                </span>{" "}
                Las variables ({conflictingKeys.map((c) => c.key).join(", ")}) ya existen en este
                proyecto. Elige cómo deseas resolverlos a continuación.
              </div>
            </div>
          )}

          {/* Mode Selector */}
          {parsedVars.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Estrategia de Resolución
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode("merge")}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    mode === "merge"
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <GitMerge className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                  <div>
                    <div className="text-sm font-semibold">Combinar (Merge)</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Añade nuevas variables y actualiza existentes en conflicto, conservando las ya
                      configuradas.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("overwrite")}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    mode === "overwrite"
                      ? "border-destructive bg-destructive/10 text-foreground"
                      : "border-border hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <Replace className="w-5 h-5 mt-0.5 text-destructive shrink-0" />
                  <div>
                    <div className="text-sm font-semibold">Reemplazar (Overwrite)</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Reemplaza todas las variables actuales por las del archivo subido.
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Preview Table */}
          {parsedVars.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Previsualización de Variables ({parsedVars.length})
              </label>
              <div className="border border-border rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0">
                    <TableRow>
                      <TableHead className="w-1/3">Variable</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead className="w-28 text-right">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedVars.map((v, i) => {
                      const hasConflict = existingKeys.has(v.key);
                      return (
                        <TableRow key={i}>
                          <TableCell className="font-mono text-xs font-semibold text-foreground">
                            {v.key}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[200px]">
                            {v.value.length > 30 ? `${v.value.slice(0, 30)}...` : v.value || '""'}
                          </TableCell>
                          <TableCell className="text-right">
                            {hasConflict ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                                <AlertTriangle className="w-3 h-3" /> Conflicto
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" /> Nueva
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-border flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={parsedVars.length === 0} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Aplicar Variables {parsedVars.length > 0 && `(${parsedVars.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
