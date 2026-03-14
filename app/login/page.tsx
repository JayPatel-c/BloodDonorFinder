"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Building2, ShieldCheck, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react"
import { loginDonor, loginHospital, loginAdmin, saveAuth } from "@/lib/api"

const tabs = [
  { id: "donor", label: "Donor", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10", accent: "border-rose-500" },
  { id: "hospital", label: "Hospital", icon: Building2, color: "text-sky-500", bg: "bg-sky-500/10", accent: "border-sky-500" },
  { id: "admin", label: "Admin", icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-500/10", accent: "border-amber-500" },
] as const

type TabId = (typeof tabs)[number]["id"]

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>("donor")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const currentTab = tabs.find((t) => t.id === activeTab)!

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      let data
      if (activeTab === "donor") {
        data = await loginDonor(email, password)
      } else if (activeTab === "hospital") {
        data = await loginHospital(email, password)
      } else {
        data = await loginAdmin(email, password)
      }
      saveAuth(data)
      router.push(activeTab === "admin" ? "/admin/dashboard" : "/dashboard")
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
              <Heart className="h-6 w-6 text-primary-foreground" fill="currentColor" />
            </div>
            <h1
              className="text-2xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Welcome Back
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Sign in to your BloodLink account</p>
          </div>

          {/* Tab switcher */}
          <div className="mb-6 flex gap-1.5 rounded-2xl border border-border bg-muted/50 p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setError("")
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-card shadow-sm " + tab.color
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/[0.03]">
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={`Enter your ${activeTab} email`}
                  className="rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="rounded-xl pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="h-11 rounded-xl gap-2 shadow-sm shadow-primary/20">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    Sign In as {currentTab.label}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {activeTab === "donor" && (
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/register-donor" className="font-semibold text-primary hover:underline">
                  Register as Donor
                </Link>
              </p>
            )}
            {activeTab === "hospital" && (
              <p>
                Need hospital access?{" "}
                <Link href="/hospital-signup" className="font-semibold text-primary hover:underline">
                  Register Hospital
                </Link>
              </p>
            )}
            {activeTab === "admin" && (
              <p className="text-xs text-muted-foreground">Admin access is restricted to authorized personnel only.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
