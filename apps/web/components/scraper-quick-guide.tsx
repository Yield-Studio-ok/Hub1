"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Search,
  ShieldCheck,
  ExternalLink,
  Lightbulb,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  MapPin,
  Building2,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScraperQuickGuideProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

interface StepItem {
  id: string;
  number: string;
  title: string;
  badge: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  summary: string;
  details: React.ReactNode;
}

const GUIDE_STEPS: StepItem[] = [
  {
    id: "step-1",
    number: "01",
    title: "Búsqueda por rubro y localidad",
    badge: "Filtro inicial",
    icon: Search,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    summary: "Ingreso de nichos comerciales y radio de búsqueda geográfica.",
    details: (
      <div className="space-y-3 text-sm text-slate-300">
        <p>
          Ingresa palabras clave específicas para el rubro comercial que deseas prospectar (por
          ejemplo:{" "}
          <span className="text-cyan-300 font-mono text-xs bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
            Pizzerías
          </span>
          ,{" "}
          <span className="text-cyan-300 font-mono text-xs bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
            Inmobiliarias
          </span>
          ,{" "}
          <span className="text-cyan-300 font-mono text-xs bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
            Gimnasios
          </span>{" "}
          o{" "}
          <span className="text-cyan-300 font-mono text-xs bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
            Clínicas estéticas
          </span>
          ).
        </p>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            Configuración del alcance geográfico
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Haz clic en <strong className="text-slate-200">Zona de búsqueda</strong> para fijar la
            ciudad o barrio y regular el <strong>radio de búsqueda</strong> (entre 1 km y 25 km). Un
            radio de 3 a 5 km suele brindar los comercios más relevantes sin duplicar resultados.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "step-2",
    number: "02",
    title: "Doble Validación de Leads",
    badge: "Filtro de oro",
    icon: ShieldCheck,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    summary: "Explicación del filtro 'Solo Leads Sólidos' (detección de comercios sin web).",
    details: (
      <div className="space-y-3 text-sm text-slate-300">
        <p>
          El filtro <strong className="text-emerald-300">Solo Leads Sólidos</strong> es la
          herramienta clave para prospección comercial de alto impacto.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Negocios sin sitio web
            </div>
            <p className="text-xs text-slate-400">
              Prioriza aquellos comercios que tienen presencia activa y clientes en Google Maps pero
              aún están <strong>sin sitio web</strong>.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              Alta intención de compra
            </div>
            <p className="text-xs text-slate-400">
              Son prospectos con máxima tasa de conversión para servicios de diseño web,
              automatización y branding digital.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "step-3",
    number: "03",
    title: "Acción comercial",
    badge: "Conversión",
    icon: ExternalLink,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    summary: "Apertura en Google Maps, validación de datos y prospección directa.",
    details: (
      <div className="space-y-3 text-sm text-slate-300">
        <p>Una vez extraídos los resultados, ejecuta tu embudo comercial en tres pasos rápidos:</p>
        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
          <li>
            <strong className="text-slate-100">Abrir en Google Maps:</strong> Haz clic en el botón
            de mapa para inspeccionar la ficha, fotos recientes, horarios y valoraciones reales.
          </li>
          <li>
            <strong className="text-slate-100">Validar teléfono y datos:</strong> Comprueba si
            tienen canal de WhatsApp Business o contacto telefónico directo.
          </li>
          <li>
            <strong className="text-slate-100">Contactar y prospectar:</strong> Prepara un pitch
            personalizado señalando una oportunidad concreta (por ejemplo: crear su catálogo digital
            o su landing page con botón de WhatsApp).
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: "step-4",
    number: "04",
    title: "Consejos y mejores prácticas",
    badge: "Estrategia",
    icon: Lightbulb,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    summary: "Mejores prácticas de scraping, segmentación y optimización de conversión.",
    details: (
      <div className="space-y-2.5 text-xs text-slate-300">
        <p className="text-slate-400">
          Sigue estas <strong className="text-slate-200">mejores prácticas</strong> para obtener los
          mejores resultados de scraping:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/40 border border-white/5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Segmentación zonal moderada:</span>{" "}
              Prefiere búsquedas en radios de 3 a 5 km por localidad para capturar comercios
              hiperlocales sin perder densidad.
            </div>
          </li>
          <li className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/40 border border-white/5">
            <Filter className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Prioriza negocios con reseñas:</span>{" "}
              Los comercios con 10 o más opiniones aseguran tracción comercial real y capacidad de
              inversión.
            </div>
          </li>
          <li className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/40 border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Demo previo al contacto:</span>{" "}
              Acercarse con un prototipo visual o auditoría rápida aumenta la respuesta favorable en
              un 300%.
            </div>
          </li>
        </ul>
      </div>
    ),
  },
];

export function ScraperQuickGuide({
  open,
  defaultOpen = false,
  onOpenChange,
  trigger,
}: ScraperQuickGuideProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isModalOpen = isControlled ? open : internalOpen;

  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({
    "step-1": true,
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger>{trigger}</DialogTrigger>
      ) : trigger !== null ? (
        <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/60 border border-white/10 hover:bg-slate-800/80 hover:border-cyan-500/30 text-slate-200 hover:text-white px-3.5 py-2 text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Guía Rápida</span>
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-slate-900/95 border-white/10 text-slate-100 shadow-2xl backdrop-blur-2xl rounded-2xl">
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10">
          <DialogHeader className="gap-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Guía Rápida del Scraper
                  <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Lead Finder
                  </span>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400 mt-0.5">
                  Aprende a buscar nichos, validar leads sólidos y ejecutar acciones comerciales con
                  Yield Studio.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Steps Accordion */}
        <div className="p-6 space-y-3">
          {GUIDE_STEPS.map((step) => {
            const isExpanded = !!expandedSteps[step.id];
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className={cn(
                  "rounded-xl border transition-all duration-200 overflow-hidden",
                  isExpanded
                    ? "bg-slate-950/70 border-white/15 shadow-md"
                    : "bg-slate-950/30 border-white/5 hover:border-white/10 hover:bg-slate-950/50",
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center justify-between p-4 text-left cursor-pointer gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 transition-transform duration-200",
                        step.iconBg,
                        isExpanded ? "scale-105" : "opacity-80",
                      )}
                    >
                      <StepIcon className={cn("w-4 h-4", step.iconColor)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {step.number}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-100">{step.title}</h4>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5 hidden sm:inline-block">
                          {step.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{step.summary}</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200",
                      isExpanded && "rotate-180 text-cyan-400",
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-white/5 animate-in fade-in-50 duration-200">
                    {step.details}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <DialogFooter className="p-4 sm:p-6 border-t border-white/10 bg-slate-950/40 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500 hidden sm:block">
            Tip: Puedes consultar esta guía en cualquier momento desde el buscador.
          </p>
          <Button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-cyan-500/20 px-5 text-sm cursor-pointer"
          >
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
