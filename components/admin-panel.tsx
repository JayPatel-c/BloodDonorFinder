"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Users,
  Building2,
  BarChart3,
  ShieldAlert,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  Droplets,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  LogOut,
} from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Users, label: "Manage Donors", id: "donors" },
  { icon: Building2, label: "Approve Hospitals", id: "hospitals" },
  { icon: FileText, label: "Reports", id: "reports" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: ShieldAlert, label: "Block Users", id: "block" },
]

const mockDonors = [
  { id: 1, name: "Rahul Sharma", blood: "O+", city: "Ahmedabad", status: "verified", date: "2025-12-01" },
  { id: 2, name: "Priya Patel", blood: "A+", city: "Surat", status: "verified", date: "2025-11-28" },
  { id: 3, name: "Amit Desai", blood: "B-", city: "Vadodara", status: "pending", date: "2025-12-10" },
  { id: 4, name: "Neha Joshi", blood: "AB+", city: "Rajkot", status: "verified", date: "2025-11-15" },
  { id: 5, name: "Vijay Kumar", blood: "O-", city: "Gandhinagar", status: "blocked", date: "2025-10-20" },
]

const mockHospitals = [
  { id: 1, name: "City General Hospital", type: "Government", city: "Ahmedabad", status: "approved", date: "2025-11-01" },
  { id: 2, name: "Sunshine Medical Center", type: "Private", city: "Surat", status: "pending", date: "2025-12-08" },
  { id: 3, name: "Red Cross Blood Bank", type: "Blood Bank", city: "Vadodara", status: "approved", date: "2025-10-15" },
  { id: 4, name: "Lifepoint Hospital", type: "Private", city: "Rajkot", status: "pending", date: "2025-12-12" },
]

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
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
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                BloodLink
              </span>
              <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider hover:bg-primary/10 px-1.5 py-0">
                Admin
              </Badge>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Navigation</p>
          <div className="flex flex-col gap-0.5">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
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
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-[68px] items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-xl pl-9"
              />
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Users, label: "Total Donors", value: "12,847", change: "+245 this month", accent: "bg-primary/10 text-primary" },
                  { icon: Building2, label: "Hospitals", value: "523", change: "+12 pending", accent: "bg-sky-500/10 text-sky-600" },
                  { icon: Droplets, label: "Donations", value: "3,456", change: "+89 this week", accent: "bg-emerald-500/10 text-emerald-600" },
                  { icon: Activity, label: "Active Requests", value: "34", change: "8 urgent", accent: "bg-amber-500/10 text-amber-600" },
                ].map((stat) => (
                  <div key={stat.label} className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.03]">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.accent} transition-transform group-hover:scale-105`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="mt-4 text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-xs font-medium text-primary">{stat.change}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Recent Donors */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                      Recent Donors
                    </h2>
                  </div>
                  <div className="mt-5 flex flex-col gap-2.5">
                    {mockDonors.slice(0, 4).map((donor) => (
                      <div key={donor.id} className="flex items-center justify-between rounded-xl border border-border p-3.5 transition-colors hover:bg-accent/50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground">
                            {donor.blood}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{donor.name}</p>
                            <p className="text-xs text-muted-foreground">{donor.city}</p>
                          </div>
                        </div>
                        <StatusBadge status={donor.status} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Hospitals */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                      <Building2 className="h-4 w-4 text-amber-600" />
                    </div>
                    <h2 className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                      Pending Approvals
                    </h2>
                  </div>
                  <div className="mt-5 flex flex-col gap-2.5">
                    {mockHospitals.filter(h => h.status === "pending").map((hospital) => (
                      <div key={hospital.id} className="flex items-center justify-between rounded-xl border border-border p-3.5 transition-colors hover:bg-accent/50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{hospital.name}</p>
                            <p className="text-xs text-muted-foreground">{hospital.type} - {hospital.city}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manage Donors */}
          {activeTab === "donors" && (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Manage Donors
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search donors..." className="w-60 rounded-xl pl-9" />
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Blood Group</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">City</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Registered</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockDonors.map((donor) => (
                        <tr key={donor.id} className="border-b border-border last:border-0 transition-colors hover:bg-accent/50">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                                {donor.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <span className="text-sm font-medium text-foreground">{donor.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex h-7 w-9 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                              {donor.blood}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">{donor.city}</td>
                          <td className="px-5 py-4"><StatusBadge status={donor.status} /></td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {new Date(donor.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-5 py-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Approve Hospitals */}
          {activeTab === "hospitals" && (
            <div>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Hospital Approvals
                </h2>
              </div>
              <Tabs defaultValue="pending">
                <TabsList className="rounded-xl">
                  <TabsTrigger value="pending" className="rounded-lg">Pending</TabsTrigger>
                  <TabsTrigger value="approved" className="rounded-lg">Approved</TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="mt-5">
                  <div className="flex flex-col gap-4">
                    {mockHospitals.filter(h => h.status === "pending").map((hospital) => (
                      <div key={hospital.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{hospital.name}</p>
                            <p className="text-sm text-muted-foreground">{hospital.type} - {hospital.city}</p>
                            <p className="text-xs text-muted-foreground">Applied: {new Date(hospital.date).toLocaleDateString("en-IN")}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="gap-1.5 rounded-xl shadow-sm shadow-primary/20">
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1.5 rounded-xl text-primary hover:bg-primary/5 hover:text-primary">
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="approved" className="mt-5">
                  <div className="flex flex-col gap-4">
                    {mockHospitals.filter(h => h.status === "approved").map((hospital) => (
                      <div key={hospital.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
                            <Building2 className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{hospital.name}</p>
                            <p className="text-sm text-muted-foreground">{hospital.type} - {hospital.city}</p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 gap-1 rounded-lg">
                          <CheckCircle className="h-3 w-3" />
                          Approved
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Reports */}
          {activeTab === "reports" && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <FileText className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="mt-5 text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Reports Module</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">Generate and export detailed reports on donors, donations, and hospital activity.</p>
            </div>
          )}

          {/* Analytics */}
          {activeTab === "analytics" && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <BarChart3 className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="mt-5 text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Analytics Dashboard</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">View donation trends, regional statistics, and system performance metrics.</p>
            </div>
          )}

          {/* Block Users */}
          {activeTab === "block" && (
            <div>
              <h2 className="mb-5 text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Blocked Users
              </h2>
              <div className="flex flex-col gap-3">
                {mockDonors.filter(d => d.status === "blocked").map((donor) => (
                  <div key={donor.id} className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/[0.02] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                        {donor.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{donor.name}</p>
                        <p className="text-xs text-muted-foreground">{donor.blood} - {donor.city}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-xl">Unblock</Button>
                  </div>
                ))}
                {mockDonors.filter(d => d.status === "blocked").length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                      <ShieldAlert className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-foreground">No blocked users</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "verified":
    case "approved":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 gap-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider">
          <CheckCircle className="h-3 w-3" />
          {status === "verified" ? "Verified" : "Approved"}
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/10 gap-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      )
    case "blocked":
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/10 gap-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider">
          <XCircle className="h-3 w-3" />
          Blocked
        </Badge>
      )
    default:
      return null
  }
}
