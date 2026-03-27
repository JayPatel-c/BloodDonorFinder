"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function DonorLoginPage() {
  const router = useRouter()
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

  const isFormValid = email && password

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/donor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
      } else {
        sessionStorage.setItem("donorToken", data.token);
        sessionStorage.setItem("donorUser", JSON.stringify(data.user));
        // Clear old shared keys to avoid cross-tab session overwrite.
        localStorage.removeItem("donorToken");
        localStorage.removeItem("donorUser");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/donor/dashboard");
      }
    } catch (err) {
      setError("Network error. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="relative flex-1 overflow-hidden bg-background">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full bg-primary/[0.03]" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/4 rounded-full bg-primary/[0.02]" />
        </div>

        {/* Floating blood cells decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse rounded-full bg-primary/[0.06]"
              style={{
                width: `${20 + i * 15}px`,
                height: `${20 + i * 15}px`,
                top: `${15 + i * 18}%`,
                left: `${5 + i * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-md px-4 py-16 lg:py-24">

          {/* Landing header */}
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Donor Portal
            </p>
            <h1
              className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Welcome Back, Hero
            </h1>
            <p className="mt-3 text-muted-foreground">
              Login to manage your donations and respond to emergencies.
            </p>
          </div>

          {/* Login card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Donor Login</h2>
                <p className="text-sm text-muted-foreground">Access your donor dashboard securely.</p>
              </div>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              
              {error && (
                <div ref={errorRef} tabIndex={-1} className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive outline-none">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="donor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="rounded-xl shadow-sm shadow-primary/20 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login to Dashboard"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register-donor" className="font-medium text-primary">
                  Register here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}