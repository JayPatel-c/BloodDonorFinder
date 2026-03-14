"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Search,
  User,
  LogOut,
  Heart,
  Clock,
  MapPin,
  Droplets,
  Phone,
  Mail,
  Menu,
  X,
  Edit3,
  CheckCircle,
  Calendar,
} from "lucide-react"
import { getAuth, clearAuth } from "@/lib/api"

const API_BASE_URL = "http://localhost:8000"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Search, label: "Find Donors", id: "find" },
  { icon: User, label: "My Profile", id: "profile" },
]

interface DonorProfile {
  id: number
  full_name: string
  email: string
  phone: string
  blood_group: string
  age: number
  gender: string
  city: string
  address: string | null
  last_donation_date: string | null
  is_available: boolean
  medical_conditions: string | null
  weight: number | null
  created_at: string
}

export function DonorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [profile, setProfile] = useState<DonorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const auth = getAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token")
        const res = await fetch(`${API_BASE_URL}/api/donors/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          setProfile(await res.json())
        }
      } catch (err) {
        console.error("Failed to fetch profile", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = () => {
    clearAuth()
    router.push("/")
  }

  const userName = auth?.user_name || "Donor"
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-card transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[68px] items-center justify-between border-b border-border px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/25">
              <Heart className="h-4 w-4 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              BloodLink
            </span>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Menu</p>
          <div className="flex flex-col gap-0.5">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "find") {
                    router.push("/find-donor")
                    return
                  }
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
                {activeTab === item.id && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </nav>

        <div className="border-t border-border p-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-[68px] items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Welcome, {userName}!
              </h1>
              <p className="text-xs text-muted-foreground">Manage your donor profile and find donors</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20">
              {userInitial}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeTab === "dashboard" && (
            <div>
              {/* Quick actions */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/find-donor" className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.03]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-105">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Find Donors</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Search for blood donors by blood group, city, and availability</p>
                </Link>
                <button onClick={() => setActiveTab("profile")} className="group rounded-2xl border border-border bg-card p-6 text-left transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.03]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 transition-transform group-hover:scale-105">
                    <User className="h-5 w-5 text-sky-600" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>My Profile</h3>
                  <p className="mt-1 text-sm text-muted-foreground">View and update your donor profile information</p>
                </button>
                <div className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.03]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 transition-transform group-hover:scale-105">
                    <Droplets className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                    {profile?.is_available ? "Available to Donate" : "Not Available"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {profile?.is_available
                      ? "You're currently visible to people searching for donors"
                      : "Update your profile to mark yourself as available"}
                  </p>
                </div>
              </div>

              {/* Profile Summary */}
              {profile && (
                <div className="mt-6 rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                      Profile Summary
                    </h2>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                      <Droplets className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Blood Group</p>
                        <p className="text-lg font-bold text-foreground">{profile.blood_group}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                      <MapPin className="h-5 w-5 text-sky-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">City</p>
                        <p className="text-sm font-semibold text-foreground">{profile.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                      <Calendar className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">Last Donation</p>
                        <p className="text-sm font-semibold text-foreground">
                          {profile.last_donation_date
                            ? new Date(profile.last_donation_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : "No donations yet"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                      <CheckCircle className={`h-5 w-5 ${profile.is_available ? "text-emerald-600" : "text-muted-foreground"}`} />
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <Badge className={profile.is_available ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10" : "bg-muted text-muted-foreground hover:bg-muted"}>
                          {profile.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="mt-6 flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div>
              <h2 className="mb-5 text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                My Profile
              </h2>
              {profile ? (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-4 border-b border-border pb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-sm shadow-primary/20">
                      {profile.full_name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{profile.full_name}</h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{profile.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{profile.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {[
                      { label: "Blood Group", value: profile.blood_group, icon: Droplets },
                      { label: "Age", value: `${profile.age} years`, icon: User },
                      { label: "Gender", value: profile.gender, icon: User },
                      { label: "City", value: profile.city, icon: MapPin },
                      { label: "Weight", value: profile.weight ? `${profile.weight} kg` : "Not specified", icon: User },
                      { label: "Availability", value: profile.is_available ? "Available" : "Not available", icon: CheckCircle },
                      { label: "Last Donation", value: profile.last_donation_date ? new Date(profile.last_donation_date).toLocaleDateString("en-IN") : "No donations yet", icon: Calendar },
                      { label: "Registered", value: new Date(profile.created_at).toLocaleDateString("en-IN"), icon: Clock },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border p-4">
                        <item.icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="text-sm font-semibold text-foreground">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {profile.medical_conditions && (
                    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-950/30">
                      <p className="text-xs font-semibold text-amber-600">Medical Conditions</p>
                      <p className="mt-1 text-sm text-foreground">{profile.medical_conditions}</p>
                    </div>
                  )}
                </div>
              ) : loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Unable to load profile.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
