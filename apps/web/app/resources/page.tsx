"use client";

import { useState } from "react";
import { BookOpen, Copy, Check, Image, Code, Link as LinkIcon } from "lucide-react";

type ResourceType = "code_snippet" | "image_url" | "logo" | "link";

interface Resource {
  id: string;
  name: string;
  content: string;
  type: ResourceType;
  category: string;
}

const RESOURCE_TYPE_CONFIG: Record<
  ResourceType,
  { label: string; icon: typeof Code; color: string }
> = {
  code_snippet: { label: "Código", icon: Code, color: "text-green-400" },
  image_url: { label: "Imagen", icon: Image, color: "text-blue-400" },
  logo: { label: "Logo", icon: Image, color: "text-purple-400" },
  link: { label: "Enlace", icon: LinkIcon, color: "text-amber-400" },
};

// Mock resources — will be replaced by API data
const MOCK_RESOURCES: Resource[] = [
  {
    id: "1",
    name: "Color Primario",
    content: "#6366F1",
    type: "code_snippet",
    category: "Brand Kit",
  },
  {
    id: "2",
    name: "Font Import",
    content:
      '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");',
    type: "code_snippet",
    category: "Brand Kit",
  },
  {
    id: "3",
    name: "Logo Principal",
    content: "https://via.placeholder.com/200x60?text=YieldStudio",
    type: "logo",
    category: "Brand Kit",
  },
  {
    id: "4",
    name: "Documentación Next.js",
    content: "https://nextjs.org/docs",
    type: "link",
    category: "Docs",
  },
  {
    id: "5",
    name: "Tailwind Config Base",
    content: `module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        background: "#0F172A",
      },
    },
  },
};`,
    type: "code_snippet",
    category: "Snippets",
  },
];

export default function ResourcesPage() {
  const [resources] = useState<Resource[]>(MOCK_RESOURCES);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const categories = ["all", ...new Set(resources.map((r) => r.category))];

  const filtered =
    filterCategory === "all" ? resources : resources.filter((r) => r.category === filterCategory);

  async function handleCopy(id: string, content: string) {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-7 w-7 text-white/80" />
        <h1 className="text-2xl font-bold text-white">Recursos</h1>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              filterCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-white/60 hover:text-white border border-white/10"
            }`}
          >
            {cat === "all" ? "Todos" : cat}
          </button>
        ))}
      </div>

      {/* Resources List */}
      <div className="space-y-3">
        {filtered.map((resource) => {
          const config = RESOURCE_TYPE_CONFIG[resource.type];
          const TypeIcon = config.icon;
          const isCopied = copiedId === resource.id;

          return (
            <div
              key={resource.id}
              className="p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-white/20 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TypeIcon className={`h-4 w-4 ${config.color}`} />
                  <h3 className="text-sm font-semibold text-white">{resource.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-white/10 ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(resource.id, resource.content)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-md transition text-white/70 hover:text-white"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3 text-green-400" />
                      <span className="text-green-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              {resource.type === "code_snippet" ? (
                <pre className="mt-2 p-3 bg-black/30 rounded-lg text-xs text-green-300 font-mono overflow-x-auto">
                  {resource.content}
                </pre>
              ) : resource.type === "logo" || resource.type === "image_url" ? (
                <div className="mt-2 p-3 bg-black/30 rounded-lg flex items-center gap-3">
                  <img src={resource.content} alt={resource.name} className="h-10 object-contain" />
                  <span className="text-xs text-white/40 truncate">{resource.content}</span>
                </div>
              ) : (
                <a
                  href={resource.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-sm text-blue-400 hover:text-blue-300 underline truncate"
                >
                  {resource.content}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
