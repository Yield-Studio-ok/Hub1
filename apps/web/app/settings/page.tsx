"use client";

import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/components/theme-provider";
import {
  Settings,
  User,
  Sliders,
  Bell,
  ShieldCheck,
  Camera,
  Trash2,
  Check,
  CheckCircle2,
  Mail,
  Briefcase,
  AtSign,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Palette,
  Globe2,
  Clock,
  KeyRound,
  ShieldAlert,
  Smartphone,
  Info,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

type ThemeMode = "dark" | "light" | "system";
type AccentColor = "indigo" | "purple" | "cyan" | "emerald" | "rose";

export default function SettingsPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Perfil state
  const [fullName, setFullName] = useState(user?.displayName || "");
  const [username, setUsername] = useState("leancarr");
  const [email, setEmail] = useState(user?.email || "");
  const [jobTitle, setJobTitle] = useState("Lead Developer & Architect");
  const [bio, setBio] = useState(
    "Especialista en desarrollo frontend y arquitectura cloud moderna. Construyendo el futuro de Yield Studio Hub.",
  );
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Preferencias state
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState<AccentColor>("indigo");
  const [language, setLanguage] = useState("es");
  const [timezone, setTimezone] = useState("America/Argentina/Buenos_Aires");
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [preferencesSuccessMsg, setPreferencesSuccessMsg] = useState<string | null>(null);

  // Notificaciones state
  const [emailProjects, setEmailProjects] = useState(true);
  const [emailScrapers, setEmailScrapers] = useState(true);
  const [emailTeam, setEmailTeam] = useState(false);
  const [pushRealtime, setPushRealtime] = useState(true);
  const [pushSounds, setPushSounds] = useState(false);
  const [pushCloudflare, setPushCloudflare] = useState(true);
  const [notificationsSuccessMsg, setNotificationsSuccessMsg] = useState<string | null>(null);

  // Seguridad state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState<string | null>(null);

  // Derivar iniciales para el avatar
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w: string) => w[0].toUpperCase())
      .join("") || "YS";

  // Mock Avatar Upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl =
        typeof window !== "undefined" && typeof window.URL?.createObjectURL === "function"
          ? window.URL.createObjectURL(file)
          : "blob:mock-avatar";
      setAvatarUrl(fakeUrl);
      setProfileSuccessMsg("Foto de perfil actualizada correctamente.");
      setTimeout(() => setProfileSuccessMsg(null), 4000);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit Perfil
  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg("Perfil actualizado con éxito.");
    setTimeout(() => setProfileSuccessMsg(null), 4000);
  };

  // Submit Preferencias
  const handleSavePreferences = (e: FormEvent) => {
    e.preventDefault();
    setPreferencesSuccessMsg("Preferencias guardadas con éxito.");
    setTimeout(() => setPreferencesSuccessMsg(null), 4000);
  };

  // Submit Notificaciones
  const handleSaveNotifications = (e: FormEvent) => {
    e.preventDefault();
    setNotificationsSuccessMsg("Configuración de notificaciones actualizada.");
    setTimeout(() => setNotificationsSuccessMsg(null), 4000);
  };

  // Submit Seguridad
  const handleSaveSecurity = (e: FormEvent) => {
    e.preventDefault();
    setSecuritySuccessMsg("Contraseña y opciones de seguridad actualizadas.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSecuritySuccessMsg(null), 4000);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto font-sans relative">
      {/* Luces de fondo ambientales */}
      <div className="hidden" />
      <div className="hidden" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Encabezado Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Settings className="w-6 h-6" />
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                Configuración
              </h1>
            </div>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Gestiona tu perfil personal, preferencias de interfaz y notificaciones de tu
              organización.
            </p>
          </div>
        </div>

        {/* Estructura con Menú Lateral Interno / Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => typeof val === "string" && setActiveTab(val)}
          className="w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Menú de Categorías (Sidebar interno en Desktop / Segmented control en Mobile) */}
            <div className="lg:col-span-1 space-y-2">
              <div className="p-2 rounded-2xl bg-card border border-border backdrop-blur-md shadow-xl">
                <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 border-0 gap-1.5 items-stretch">
                  <TabsTrigger
                    value="profile"
                    className="w-full justify-start text-left px-4 py-3 rounded-xl gap-3 transition-all data-[active]:bg-primary/10 data-[active]:text-primary text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <User className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">Perfil</span>
                      <span className="text-[11px] text-muted-foreground font-normal">
                        Información y avatar
                      </span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="preferences"
                    className="w-full justify-start text-left px-4 py-3 rounded-xl gap-3 transition-all data-[active]:bg-primary/10 data-[active]:text-primary text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Sliders className="w-4 h-4 text-purple-400 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">Preferencias</span>
                      <span className="text-[11px] text-muted-foreground font-normal">
                        Tema, idioma y región
                      </span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="notifications"
                    className="w-full justify-start text-left px-4 py-3 rounded-xl gap-3 transition-all data-[active]:bg-primary/10 data-[active]:text-primary text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Bell className="w-4 h-4 text-pink-400 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">Notificaciones</span>
                      <span className="text-[11px] text-muted-foreground font-normal">
                        Alertas por email y app
                      </span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="security"
                    className="w-full justify-start text-left px-4 py-3 rounded-xl gap-3 transition-all data-[active]:bg-primary/10 data-[active]:text-primary text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">Seguridad</span>
                      <span className="text-[11px] text-muted-foreground font-normal">
                        Contraseñas y sesiones
                      </span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tarjeta de Resumen / Tip */}
              <div className="hidden lg:block p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Yield Studio Hub v1.0</span>
                </div>
                <p>
                  Las configuraciones se aplican en tiempo real en todos tus entornos conectados.
                </p>
              </div>
            </div>

            {/* Contenido de Cada Categoría */}
            <div className="lg:col-span-3">
              {/* ==================== TAB: PERFIL ==================== */}
              <TabsContent value="profile" className="space-y-6 m-0">
                <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border backdrop-blur-md shadow-xl space-y-8">
                  <div className="border-b border-border pb-5">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-400" />
                      Perfil de Usuario
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Personaliza tu identidad en la plataforma y mantén actualizada tu información
                      de contacto.
                    </p>
                  </div>

                  {/* Feedback Banner */}
                  {profileSuccessMsg && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-3 animate-in fade-in duration-300">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                      <span>{profileSuccessMsg}</span>
                    </div>
                  )}

                  {/* Sección de Foto de Perfil (Mock Uploader) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-xl bg-background/60 border border-white/5">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 ring-4 ring-indigo-500/20 shadow-xl relative flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="Avatar de usuario"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-foreground font-bold text-xl">{initials}</span>
                        )}
                      </div>
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-border" />
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-sm font-semibold text-foreground">Foto de Perfil</h3>
                      <p className="text-xs text-muted-foreground">
                        Sube una imagen cuadrada de al menos 400x400px. Formatos JPG, PNG o WebP.
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <input
                          ref={fileInputRef}
                          data-testid="avatar-upload-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Cambiar Foto
                        </button>

                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 text-xs font-semibold transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Eliminar Foto
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Formulario de Datos Personales */}
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Nombre Completo */}
                      <div>
                        <label
                          htmlFor="full-name"
                          className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"
                        >
                          Nombre Completo <span className="text-indigo-400">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground0" />
                          <input
                            id="full-name"
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ej. Leandro Carrasco"
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-foreground0 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all"
                          />
                        </div>
                      </div>

                      {/* Nombre de Usuario */}
                      <div>
                        <label
                          htmlFor="username"
                          className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"
                        >
                          Nombre de Usuario
                        </label>
                        <div className="relative">
                          <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground0" />
                          <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="usuario"
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-foreground0 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all font-mono"
                          />
                        </div>
                      </div>

                      {/* Correo Electrónico */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="email"
                            className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                          >
                            Correo Electrónico
                          </label>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            <Check className="w-3 h-3" /> Verificado
                          </span>
                        </div>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground0" />
                          <input
                            id="email"
                            type="email"
                            readOnly
                            value={email}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background/60 border border-white/5 text-muted-foreground cursor-not-allowed text-sm font-mono"
                          />
                        </div>
                      </div>

                      {/* Cargo o Rol */}
                      <div>
                        <label
                          htmlFor="job-title"
                          className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"
                        >
                          Cargo o Rol
                        </label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground0" />
                          <input
                            id="job-title"
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="Ej. Software Engineer"
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-foreground0 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Biografía */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="bio"
                          className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                        >
                          Biografía
                        </label>
                        <span className="text-xs text-foreground0 font-mono">{bio.length}/300</span>
                      </div>
                      <textarea
                        id="bio"
                        rows={3}
                        maxLength={300}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Escribe unas palabras sobre tu trayectoria y objetivos..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-foreground0 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all resize-none"
                      />
                    </div>

                    {/* Botón Guardar */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-foreground font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 text-sm cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              {/* ==================== TAB: PREFERENCIAS ==================== */}
              <TabsContent value="preferences" className="space-y-6 m-0">
                <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border backdrop-blur-md shadow-xl space-y-8">
                  <div className="border-b border-border pb-5">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-purple-400" />
                      Preferencias de la Interfaz
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configura el aspecto visual del panel, combinaciones de colores y adaptaciones
                      regionales.
                    </p>
                  </div>

                  {/* Feedback Banner */}
                  {preferencesSuccessMsg && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-3 animate-in fade-in duration-300">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                      <span>{preferencesSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSavePreferences} className="space-y-8">
                    {/* Selector de Tema Visual (Theme Preferences) */}
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Tema Visual
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Oscuro */}
                        <div
                          onClick={() => setTheme("dark")}
                          className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between gap-3 ${
                            theme === "dark"
                              ? "bg-background/90 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10"
                              : "bg-background/60 border-border hover:border-white/20 hover:bg-background/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Moon className="w-4 h-4 text-indigo-400" />
                              <span className="font-semibold text-sm text-foreground">
                                Oscuro (Dark)
                              </span>
                            </div>
                            {theme === "dark" && (
                              <span className="w-4 h-4 rounded-full bg-indigo-500 text-foreground flex items-center justify-center text-[10px]">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <div className="h-16 rounded-lg bg-background border border-border p-2 flex gap-1.5 overflow-hidden">
                            <div className="w-3 bg-background rounded-sm" />
                            <div className="flex-1 space-y-1">
                              <div className="h-2 w-12 bg-indigo-500/50 rounded-sm" />
                              <div className="h-2 w-full bg-background rounded-sm" />
                              <div className="h-2 w-3/4 bg-background/60 rounded-sm" />
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Sleek Slate 950 con acentos luminosos.
                          </p>
                        </div>

                        {/* Claro */}
                        <div
                          onClick={() => setTheme("light")}
                          className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between gap-3 ${
                            theme === "light"
                              ? "bg-background/90 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10"
                              : "bg-background/60 border-border hover:border-white/20 hover:bg-background/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sun className="w-4 h-4 text-amber-400" />
                              <span className="font-semibold text-sm text-foreground">
                                Claro (Light)
                              </span>
                            </div>
                            {theme === "light" && (
                              <span className="w-4 h-4 rounded-full bg-indigo-500 text-foreground flex items-center justify-center text-[10px]">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <div className="h-16 rounded-lg bg-background border border-border p-2 flex gap-1.5 overflow-hidden">
                            <div className="w-3 bg-background rounded-sm" />
                            <div className="flex-1 space-y-1">
                              <div className="h-2 w-12 bg-indigo-500 rounded-sm" />
                              <div className="h-2 w-full bg-background rounded-sm" />
                              <div className="h-2 w-3/4 bg-background/80 rounded-sm" />
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Alta luminosidad y contraste diurno.
                          </p>
                        </div>

                        {/* Sistema */}
                        <div
                          onClick={() => setTheme("system")}
                          className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between gap-3 ${
                            theme === "system"
                              ? "bg-background/90 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10"
                              : "bg-background/60 border-border hover:border-white/20 hover:bg-background/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Laptop className="w-4 h-4 text-cyan-400" />
                              <span className="font-semibold text-sm text-foreground">Sistema</span>
                            </div>
                            {theme === "system" && (
                              <span className="w-4 h-4 rounded-full bg-indigo-500 text-foreground flex items-center justify-center text-[10px]">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <div className="h-16 rounded-lg bg-gradient-to-r from-slate-950 to-slate-200 border border-border p-2 flex gap-1.5 overflow-hidden">
                            <div className="w-3 bg-indigo-500 rounded-sm" />
                            <div className="flex-1 space-y-1">
                              <div className="h-2 w-12 bg-white/40 rounded-sm" />
                              <div className="h-2 w-full bg-white/20 rounded-sm" />
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Sincroniza con el esquema del sistema operativo.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Color de Acento */}
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5 text-indigo-400" />
                        Color de Acento
                      </label>
                      <div className="flex items-center gap-3">
                        {[
                          { id: "indigo", bg: "bg-indigo-500" },
                          { id: "purple", bg: "bg-purple-500" },
                          { id: "cyan", bg: "bg-cyan-500" },
                          { id: "emerald", bg: "bg-emerald-500" },
                          { id: "rose", bg: "bg-rose-500" },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setAccentColor(c.id as AccentColor)}
                            className={`w-7 h-7 rounded-full ${c.bg} flex items-center justify-center transition-all cursor-pointer ${
                              accentColor === c.id
                                ? "ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110"
                                : "opacity-70 hover:opacity-100"
                            }`}
                          >
                            {accentColor === c.id && (
                              <Check className="w-3.5 h-3.5 text-foreground stroke-[3]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Región, Idioma y Zona Horaria */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                      <div>
                        <label
                          htmlFor="language-select"
                          className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"
                        >
                          Idioma de la Plataforma
                        </label>
                        <div className="relative">
                          <Globe2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground0" />
                          <select
                            id="language-select"
                            aria-label="Idioma de la plataforma"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          >
                            <option value="es" className="bg-background text-foreground">
                              Español (América Latina)
                            </option>
                            <option value="en" className="bg-background text-foreground">
                              English (United States)
                            </option>
                            <option value="pt" className="bg-background text-foreground">
                              Português (Brasil)
                            </option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="timezone-select"
                          className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"
                        >
                          Zona Horaria
                        </label>
                        <div className="relative">
                          <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground0" />
                          <select
                            id="timezone-select"
                            aria-label="Zona horaria"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          >
                            <option
                              value="America/Argentina/Buenos_Aires"
                              className="bg-background text-foreground"
                            >
                              America/Argentina/Buenos_Aires (UTC-3)
                            </option>
                            <option value="UTC" className="bg-background text-foreground">
                              UTC (Tiempo Universal Coordinado)
                            </option>
                            <option
                              value="America/Bogota"
                              className="bg-background text-foreground"
                            >
                              America/Bogota (UTC-5)
                            </option>
                            <option
                              value="America/New_York"
                              className="bg-background text-foreground"
                            >
                              America/New_York (UTC-4)
                            </option>
                            <option value="Europe/Madrid" className="bg-background text-foreground">
                              Europe/Madrid (UTC+1)
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Densidad de la interfaz */}
                    <div className="space-y-3 pt-2">
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Densidad del Layout
                      </label>
                      <div className="grid grid-cols-2 gap-4 max-w-md">
                        <button
                          type="button"
                          onClick={() => setDensity("comfortable")}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            density === "comfortable"
                              ? "bg-indigo-500/10 border-indigo-500/30 text-foreground"
                              : "bg-background/40 border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="font-semibold text-sm block">Cómoda</span>
                          <span className="text-[11px] text-muted-foreground">
                            Espaciado estándar
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDensity("compact")}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            density === "compact"
                              ? "bg-indigo-500/10 border-indigo-500/30 text-foreground"
                              : "bg-background/40 border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="font-semibold text-sm block">Compacta</span>
                          <span className="text-[11px] text-muted-foreground">
                            Mayor densidad de datos
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Botón Guardar */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-foreground font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 text-sm cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        Guardar Preferencias
                      </button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              {/* ==================== TAB: NOTIFICACIONES ==================== */}
              <TabsContent value="notifications" className="space-y-6 m-0">
                <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border backdrop-blur-md shadow-xl space-y-8">
                  <div className="border-b border-border pb-5">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Bell className="w-5 h-5 text-pink-400" />
                      Canales y Alertas
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Elige los eventos importantes sobre tus proyectos, scrapers y equipo que
                      deseas recibir.
                    </p>
                  </div>

                  {/* Feedback Banner */}
                  {notificationsSuccessMsg && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-3 animate-in fade-in duration-300">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                      <span>{notificationsSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveNotifications} className="space-y-8">
                    {/* Grupo: Correo Electrónico */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <Mail className="w-4 h-4 text-indigo-400" />
                        <span>Notificaciones por Correo</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-background/60 border border-white/5 gap-4">
                          <div className="space-y-0.5">
                            <span className="text-sm font-semibold text-foreground block">
                              Resumen semanal de proyectos
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Métricas consolidadas, entregas completadas y sprints activos.
                            </span>
                          </div>
                          <Switch
                            aria-label="Resumen semanal de proyectos"
                            checked={emailProjects}
                            onCheckedChange={setEmailProjects}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-background/60 border border-white/5 gap-4">
                          <div className="space-y-0.5">
                            <span className="text-sm font-semibold text-foreground block">
                              Alertas críticas de scrapers
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Aviso inmediato si una extracción programada falla o se interrumpe.
                            </span>
                          </div>
                          <Switch
                            aria-label="Alertas críticas de scrapers"
                            checked={emailScrapers}
                            onCheckedChange={setEmailScrapers}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-background/60 border border-white/5 gap-4">
                          <div className="space-y-0.5">
                            <span className="text-sm font-semibold text-foreground block">
                              Novedades del equipo
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Notificaciones cuando un nuevo miembro acepta una invitación.
                            </span>
                          </div>
                          <Switch
                            aria-label="Novedades del equipo"
                            checked={emailTeam}
                            onCheckedChange={setEmailTeam}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Grupo: En la Plataforma (In-App) */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <Smartphone className="w-4 h-4 text-purple-400" />
                        <span>Notificaciones en la Plataforma</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-background/60 border border-white/5 gap-4">
                          <div className="space-y-0.5">
                            <span className="text-sm font-semibold text-foreground block">
                              Alertas en tiempo real
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Banners y toasts interactivos dentro del panel de control.
                            </span>
                          </div>
                          <Switch
                            aria-label="Alertas en tiempo real"
                            checked={pushRealtime}
                            onCheckedChange={setPushRealtime}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-background/60 border border-white/5 gap-4">
                          <div className="space-y-0.5">
                            <span className="text-sm font-semibold text-foreground block">
                              Sonidos del sistema
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Efectos sonoros sutiles al finalizar temporizadores y tareas.
                            </span>
                          </div>
                          <Switch
                            aria-label="Sonidos del sistema"
                            checked={pushSounds}
                            onCheckedChange={setPushSounds}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-background/60 border border-white/5 gap-4">
                          <div className="space-y-0.5">
                            <span className="text-sm font-semibold text-foreground block">
                              Eventos de Cloudflare y DNS
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Registro y aviso de propagación de subdominios y certificados SSL.
                            </span>
                          </div>
                          <Switch
                            aria-label="Eventos de Cloudflare y DNS"
                            checked={pushCloudflare}
                            onCheckedChange={setPushCloudflare}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Botón Guardar */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-foreground font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 text-sm cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        Guardar Notificaciones
                      </button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              {/* ==================== TAB: SEGURIDAD ==================== */}
              <TabsContent value="security" className="space-y-6 m-0">
                <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border backdrop-blur-md shadow-xl space-y-8">
                  <div className="border-b border-border pb-5">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      Seguridad y Credenciales
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Administra tus contraseñas, autenticación de doble factor y sesiones activas.
                    </p>
                  </div>

                  {/* Feedback Banner */}
                  {securitySuccessMsg && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-3 animate-in fade-in duration-300">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                      <span>{securitySuccessMsg}</span>
                    </div>
                  )}

                  {/* Formulario de Cambio de Contraseña */}
                  <form onSubmit={handleSaveSecurity} className="space-y-5">
                    <div className="space-y-4 max-w-lg">
                      <div>
                        <label
                          htmlFor="current-password"
                          className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"
                        >
                          Contraseña Actual
                        </label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground0" />
                          <input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="new-password"
                          className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"
                        >
                          Nueva Contraseña
                        </label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground0" />
                          <input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="confirm-password"
                          className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider"
                        >
                          Confirmar Nueva Contraseña
                        </label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground0" />
                          <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-foreground font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 text-sm cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        Actualizar Contraseña
                      </button>
                    </div>
                  </form>

                  {/* 2FA y Sesiones Activas */}
                  <div className="pt-6 border-t border-border space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-indigo-400" />
                        Autenticación en Dos Pasos (2FA)
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Añade una capa extra de protección a tu cuenta mediante verificación de seis
                        dígitos.
                      </p>
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        2FA Activado mediante App de Autenticación
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Info className="w-4 h-4 text-muted-foreground" />
                        Sesiones Activas
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Dispositivos que han iniciado sesión recientemente en tu cuenta.
                      </p>
                      <div className="mt-3 p-3.5 rounded-xl bg-background/60 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Laptop className="w-5 h-5 text-indigo-400" />
                          <div>
                            <span className="text-sm font-medium text-foreground block">
                              Linux x86_64 — Chrome
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Buenos Aires, Argentina • Dirección IP: 181.47.xxx.xxx
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          Sesión Actual
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
