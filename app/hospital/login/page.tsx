"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function HospitalLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const isFormValid = email && password

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="relative flex-1 overflow-hidden bg-background">
        {/* Background bubbles */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-background to-primary/[0.02]" />
        <div className="absolute top-16 right-12 h-40 w-40 rounded-full bg-primary/[0.07] blur-2xl" />
        <div className="absolute top-1/3 -left-10 h-32 w-32 rounded-full bg-primary/[0.06] blur-2xl" />
        <div className="absolute bottom-24 right-1/4 h-24 w-24 rounded-full bg-primary/[0.08] blur-2xl" />
        <div className="absolute bottom-1/3 left-1/3 h-16 w-16 rounded-full bg-primary/[0.05] blur-xl" />
        <div className="absolute top-1/2 right-1/3 h-20 w-20 rounded-full bg-primary/[0.06] blur-2xl" />

        <div className="relative mx-auto max-w-md px-4 py-16 lg:py-24">

          {/* Landing header */}
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Hospital Portal
            </p>
            <h1
              className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Secure Hospital Access
            </h1>
            <p className="mt-3 text-muted-foreground">
              Login to find donors and manage emergency blood requests.
            </p>
          </div>

          {/* Login card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Hospital Login</h2>
                <p className="text-sm text-muted-foreground">Secure access to hospital dashboard.</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="hospital@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
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
                disabled={!isFormValid}
                onClick={() => router.push("/hospital/dashboard")}
                className="rounded-xl shadow-sm shadow-primary/20 disabled:opacity-50"
              >
                Login to Dashboard
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/hospital-signup" className="font-medium text-primary">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}