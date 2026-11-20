"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Loader2,
  Globe,
  Building,
  Crosshair,
  Map as MapIcon,
  SlidersHorizontal,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScraperQuickGuide } from "@/components/scraper-quick-guide";
import { searchLeads, Lead } from "@/lib/scraper";

export default function ScraperPage() {
  const [query, setQuery] = useState("");
  const [locationName, setLocationName] = useState("");
  const [radius, setRadius] = useState(5);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Lead[]>([]);
  const [searched, setSearched] = useState(false);
  const [onlySolidLeads, setOnlySolidLeads] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !locationName.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const data = await searchLeads({
        query,
        location: locationName,
        radiusKm: radius,
        onlyWithoutWebsite: onlySolidLeads,
      });
      setResults(data);
    } catch (err) {
      console.error("Error searching leads:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const displayedResults = onlySolidLeads ? results.filter((lead) => !lead.website) : results;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto font-sans">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Search className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Buscador de Leads</h1>
            <p className="text-muted-foreground mt-1">
              Extrae prospectos directamente desde Google Maps.
            </p>
          </div>
        </div>
        <ScraperQuickGuide />
      </div>

      <form
        onSubmit={handleSearch}
        className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              ¿Qué estás buscando?
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: Pizzerías, Inmobiliarias, Gimnasios..."
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Zona de búsqueda (Google Maps)
            </label>
            <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
              <DialogTrigger>
                <div className="relative cursor-pointer group">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground flex items-center justify-between group-hover:border-primary/50 transition-all">
                    <span className={locationName ? "text-foreground" : "text-muted-foreground"}>
                      {locationName ? `${locationName} (${radius}km)` : "Seleccionar en el mapa..."}
                    </span>
                    <MapIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-card border-border">
                <DialogHeader className="p-6 pb-2">
                  <DialogTitle className="text-xl">Seleccionar Zona en Google Maps</DialogTitle>
                </DialogHeader>

                <div className="p-6 pt-0 space-y-4">
                  {/* Buscador de mapa interno */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Buscar ciudad o barrio..."
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                    />
                    <Button variant="secondary" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Falso mapa interactivo (Placeholder visual) */}
                  <div className="relative w-full h-[350px] rounded-xl overflow-hidden border border-border bg-muted">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${locationName || "Buenos Aires"}&t=&z=${14 - Math.floor(radius / 10)}&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>

                    {/* Overlay target interactivo: Neon Radar HUD */}
                    <div
                      data-testid="radar-hud"
                      className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
                    >
                      <div
                        className="relative flex items-center justify-center transition-all duration-300 ease-out"
                        style={{
                          width: `${Math.min(290, Math.max(80, Math.round(75 + (radius / 50) * 215)))}px`,
                          height: `${Math.min(290, Math.max(80, Math.round(75 + (radius / 50) * 215)))}px`,
                        }}
                      >
                        {/* Ambient Neon Radar Glow & Wave */}
                        <div className="absolute inset-0 rounded-full bg-emerald-500/15 border-2 border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.5),inset_0_0_20px_rgba(52,211,153,0.25)] animate-pulse" />

                        {/* Concentric inner range ring (50%) */}
                        <div className="absolute w-1/2 h-1/2 rounded-full border border-dashed border-emerald-400/60" />

                        {/* Crosshair Axes */}
                        <div className="absolute w-full h-[1px] bg-emerald-400/40" />
                        <div className="absolute h-full w-[1px] bg-emerald-400/40" />

                        {/* Center Beacon & Crosshair */}
                        <div className="relative z-10 flex items-center justify-center">
                          <span className="absolute h-4 w-4 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_12px_#34d399]" />
                          <Crosshair className="absolute h-8 w-8 text-emerald-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]" />
                        </div>

                        {/* Dynamic Floating Distance Badge */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-zinc-950/90 text-emerald-300 border border-emerald-400/80 rounded-full font-mono text-[11px] font-bold tracking-wider shadow-xl flex items-center gap-1.5 backdrop-blur-md whitespace-nowrap">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {radius} km
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Radio de búsqueda slider */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                        <SlidersHorizontal className="h-4 w-4" />
                        Radio de búsqueda
                      </label>
                      <span className="text-sm font-bold text-primary">{radius} km</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={radius}
                      onChange={(e) => setRadius(parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>

                <DialogFooter className="p-4 bg-muted/50 border-t border-border flex justify-between sm:justify-between items-center">
                  <p className="text-xs text-muted-foreground px-2">
                    Mové el mapa para ajustar el centro de búsqueda.
                  </p>
                  <Button onClick={() => setIsMapOpen(false)} disabled={!locationName}>
                    Confirmar Zona
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-border/50">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={onlySolidLeads}
                onChange={(e) => setOnlySolidLeads(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-10 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              Solo negocios sin página web (Alta prioridad)
            </span>
          </label>

          <Button
            onClick={handleSearch}
            disabled={loading || !query.trim() || !locationName.trim()}
            className="w-full sm:w-auto px-8 h-11 text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Scrapeando zona...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Iniciar Búsqueda
              </>
            )}
          </Button>
        </div>
      </form>

      {/* RESULTADOS */}
      {searched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Resultados <span className="text-primary">({displayedResults.length})</span>
            </h2>
          </div>

          {displayedResults.length === 0 && !loading ? (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No se encontraron leads</h3>
              <p className="text-muted-foreground mt-1">
                Intentá ampliar el radio o cambiar el término de búsqueda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedResults.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-card rounded-2xl border border-border p-5 hover:border-primary/50 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {lead.name}
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {!lead.website && (
                          <span className="bg-emerald-500/10 text-emerald-400 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Sólido
                          </span>
                        )}
                        {lead.rating && (
                          <span className="bg-amber-500/10 text-amber-500 text-xs font-bold px-2 py-0.5 rounded-md border border-amber-500/20">
                            ★ {lead.rating}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{lead.address}</span>
                      </div>

                      <div className="flex items-start gap-2.5 text-sm">
                        <Globe className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                        {lead.website ? (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 hover:underline line-clamp-1 flex items-center gap-1"
                          >
                            <span>{lead.website}</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-destructive font-medium bg-destructive/10 px-2 py-0.5 rounded border border-destructive/20">
                            Sin sitio web
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <a
                      href={lead.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-muted hover:bg-primary/10 text-foreground hover:text-primary rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-primary/30"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver en Google Maps
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
