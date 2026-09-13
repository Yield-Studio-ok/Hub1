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

interface Lead {
  id: string;
  name: string;
  address: string;
  website: string | null;
  mapsUrl: string;
  rating?: number;
}

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

    // Mock API call — to be replaced with actual Puppeteer/Places API call
    setTimeout(() => {
      setResults([
        {
          id: "1",
          name: "Pizzería Don Carlos",
          address: locationName
            ? `Av. Principal 123, ${locationName}`
            : "Av. Corrientes 1234, CABA",
          website: null,
          mapsUrl: "https://maps.google.com/?q=Pizzeria+Don+Carlos",
          rating: 4.5,
        },
        {
          id: "2",
          name: "La Farola de Cabildo",
          address: "Av. Cabildo 2500, CABA",
          website: "https://lafarola.com",
          mapsUrl: "https://maps.google.com/?q=La+Farola",
          rating: 4.0,
        },
        {
          id: "3",
          name: "Empanadas El Noble",
          address: "Santa Fe 3200, CABA",
          website: null,
          mapsUrl: "https://maps.google.com/?q=El+Noble",
          rating: 3.8,
        },
      ]);
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto font-sans">
      <div className="mb-8 flex items-center gap-3">
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

                    {/* Overlay target interactivo */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="relative flex items-center justify-center">
                        <div
                          className="absolute w-32 h-32 bg-primary/20 rounded-full animate-pulse border border-primary/50"
                          style={{ transform: `scale(${radius / 5})` }}
                        ></div>
                        <Crosshair className="h-8 w-8 text-primary drop-shadow-md" />
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
              Resultados <span className="text-primary">({results.length})</span>
            </h2>
          </div>

          {results.length === 0 && !loading ? (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No se encontraron leads</h3>
              <p className="text-muted-foreground mt-1">
                Intentá ampliar el radio o cambiar el término de búsqueda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-card rounded-2xl border border-border p-5 hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {lead.name}
                    </h3>
                    {lead.rating && (
                      <span className="bg-amber-500/10 text-amber-500 text-xs font-bold px-2 py-1 rounded-md border border-amber-500/20">
                        ★ {lead.rating}
                      </span>
                    )}
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
                          className="text-blue-400 hover:text-blue-300 hover:underline line-clamp-1"
                        >
                          {lead.website}
                        </a>
                      ) : (
                        <span className="text-destructive font-medium bg-destructive/10 px-2 py-0.5 rounded border border-destructive/20">
                          Sin sitio web
                        </span>
                      )}
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
