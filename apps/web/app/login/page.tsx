"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  User,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) return null;

  const handleQuickFill = (role: "admin" | "user") => {
    if (role === "admin") {
      setEmail("admin@admin.com");
      setPassword("admin123");
    } else {
      setEmail("user@user.com");
      setPassword("user123");
    }
    setError("");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-zinc-950 overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <Card className="relative w-full max-w-md bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
        {/* Top accent glow line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <CardHeader className="space-y-2 text-center pt-8 pb-4">
          <div className="flex justify-center mb-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-zinc-300">
                Yield Studio
              </span>
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100">
            Bienvenido al Hub
          </CardTitle>
          <CardDescription className="text-sm text-zinc-400">
            Ingresa tus credenciales para acceder a la plataforma centralizada
          </CardDescription>
        </CardHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setIsLoading(true);
            try {
              await login(email, password);
            } catch {
              setError("Credenciales incorrectas o servidor no disponible.");
              setIsLoading(false);
            }
          }}
        >
          <CardContent className="space-y-4 px-6 sm:px-8">
            {error && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-zinc-300 uppercase tracking-wider"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 h-11 bg-zinc-950/60 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 rounded-xl transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-medium text-zinc-300 uppercase tracking-wider"
              >
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 pr-10 h-11 bg-zinc-950/60 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 rounded-xl transition-all"
                />
                <button
                  type="button"
                  aria-label="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 px-6 sm:px-8 pb-8 pt-2">
            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 font-semibold shadow-lg shadow-zinc-100/10 hover:shadow-zinc-100/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Iniciando sesión...</span>
              ) : (
                <>
                  <span>Iniciar sesión</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {/* Quick-fill Dev Accounts */}
            <div className="w-full pt-3 border-t border-zinc-800/80">
              <p className="text-center text-xs text-zinc-500 mb-2.5 font-medium">
                Acceso rápido (Cuentas de prueba):
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill("admin")}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 text-xs text-zinc-300 hover:text-white transition-all font-medium group"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("user")}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 text-xs text-zinc-300 hover:text-white transition-all font-medium group"
                >
                  <User className="h-3.5 w-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>Developer</span>
                </button>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
