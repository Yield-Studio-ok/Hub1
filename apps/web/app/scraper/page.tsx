"use client";

import { useState } from "react";
import { Search, MapPin, Loader2, Globe, Building } from "lucide-react";

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
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Lead[]>([]);
  const [searched, setSearched] = useState(false);
  const [onlySolidLeads, setOnlySolidLeads] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !location.trim()) return;

    setLoading(true);
    setSearched(true);

    // Mock API call — to be replaced with actual Puppeteer/Places API call
    setTimeout(() => {
      setResults([
        {
          id: "1",
          name: "Pizzería Don Carlos",
          address: "Av. Corrientes 1234, CABA",
          website: null,
          mapsUrl: "https://maps.google.com/?q=Pizzeria+Don+Carlos",
          rating: 4.5,
        },
        {
          id: "2",
          name: "Café Martínez Centro",
          address: "Florida 400, CABA",
          website: "https://cafemartinez.com",
          mapsUrl: "https://maps.google.com/?q=Cafe+Martinez",
          rating: 4.2,
        },
        {
          id: "3",
          name: "Ferretería La Tuerca",
          address: "San Martín 555, CABA",
          website: null,
          mapsUrl: "https://maps.google.com/?q=Ferreteria+La+Tuerca",
          rating: 3.8,
        },
      ]);
      setLoading(false);
    }, 1500);
  };

  const filteredResults = onlySolidLeads ? results.filter((r) => !r.website) : results;

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <Search className="h-7 w-7 text-white/80" />
        <h1 className="text-2xl font-bold text-white">Buscador de Leads (Maps)</h1>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 mb-8 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Rubro o Negocio</label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: Pizzerías, Ferreterías..."
                className="w-full pl-10 pr-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Ubicación</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Palermo, CABA"
                className="w-full pl-10 pr-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-white/80">
            <input
              type="checkbox"
              checked={onlySolidLeads}
              onChange={(e) => setOnlySolidLeads(e.target.checked)}
              className="rounded bg-black/20 border-white/20 text-blue-500 focus:ring-blue-500"
            />
            Doble Validación: Mostrar solo Leads Sólidos (Sin Web)
          </label>
          <button
            type="submit"
            disabled={loading || !query.trim() || !location.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Buscar Leads
          </button>
        </div>
      </form>

      {/* Results */}
      {searched && (
        <div className="space-y-4 max-w-4xl">
          <h2 className="text-lg font-semibold text-white mb-4">
            Resultados para "{query}" en "{location}"
          </h2>

          {loading ? (
            <div className="flex items-center justify-center p-12 text-white/50">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((lead) => (
              <div
                key={lead.id}
                className="p-5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-white/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {lead.name}
                    {lead.rating && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                        ★ {lead.rating}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-white/60 mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {lead.address}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {lead.website ? (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition"
                    >
                      <Globe className="h-4 w-4" />
                      Web
                    </a>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 text-sm rounded-lg">
                      Sin Web
                    </span>
                  )}
                  <a
                    href={lead.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-sm rounded-lg transition"
                  >
                    <MapPin className="h-4 w-4" />
                    Maps
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-12 text-white/50 bg-white/5 rounded-xl border border-white/10">
              No se encontraron resultados.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
