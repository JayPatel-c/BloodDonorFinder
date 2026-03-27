"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff } from "lucide-react"

export function AdminLoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setRawError] = useState("")
  const [loading, setLoading] = useState(false)
  const errorRef = useRef<HTMLDivElement>(null)

  const setError = (msg: string) => {
    setRawError(msg);
    setTimeout(() => {
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        errorRef.current.focus({ preventScroll: true });
      }
    }, 50);
  };

  const router = useRouter()
  
  const isFormValid = email && password

  const handleLogin = async () => {
    if (!isFormValid) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        if (onLogin) onLogin();
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError("Network error. Backend server might not be running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Admin Login
          </h2>
          <p className="text-sm text-muted-foreground">
            Access admin dashboard securely.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        
        {error && (
          <div ref={errorRef} tabIndex={-1} className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive text-center outline-none">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            className="rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="rounded-xl pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

<Button
  disabled={!isFormValid || loading}
  onClick={handleLogin}
  className="rounded-xl shadow-sm shadow-primary/20 disabled:opacity-50"
>
  {loading ? "Logging in..." : "Login as Admin"}
</Button>
      </div>
    </div>
  )
}