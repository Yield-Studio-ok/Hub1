"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) return null;

  return (
    <main>
      <h1>Login</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          try {
            await login(email, password);
          } catch {
            setError("Invalid credentials");
          }
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <p style={{ fontSize: 12, color: "#666", marginTop: 16 }}>
        Admin: admin@admin.com / admin123
        <br />
        User: user@user.com / user123
      </p>
    </main>
  );
}
