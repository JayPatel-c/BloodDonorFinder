"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LayoutDashboard,
  Search,
  AlertTriangle,
  Droplets,
  User,
  LogOut,
  Heart,
  Users,
  Clock,
  Activity,
  ChevronRight,
  Menu,
  X,
  Bell,
  TrendingUp,
  Zap,
} from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Search, label: "Search Donor", active: false },
  { icon: AlertTriangle, label: "Emergency Request", active: false },
  { icon: Droplets, label: "Blood Inventory", active: false },
  { icon: User, label: "Profile", active: false },
]

const recentActivity = [
  { type: "request", message: "Emergency request sent for O+ blood", time: "2 mins ago", status: "pending" },
  { type: "match", message: "Donor Rahul Sharma matched for A+ request", time: "15 mins ago", status: "matched" },
  { type: "complete", message: "Blood unit received from Priya Patel", time: "1 hour ago", status: "completed" },
  { type: "request", message: "Emergency request sent for B- blood", time: "3 hours ago", status: "pending" },
  { type: "complete", message: "Donation session completed with 5 donors", time: "5 hours ago", status: "completed" },
]

const bloodInventory = [
  { group: "A+", units: 24, capacity: 50 },
  { group: "A-", units: 8, capacity: 30 },
  { group: "B+", units: 32, capacity: 50 },
  { group: "B-", units: 5, capacity: 30 },
  { group: "AB+", units: 12, capacity: 30 },
  { group: "AB-", units: 3, capacity: 20 },
  { group: "O+", units: 45, capacity: 60 },
  { group: "O-", units: 7, capacity: 40 },
]

export function HospitalDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
                key={item.label}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  item.active
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
                {item.active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </nav>

        <div className="border-t border-border p-3">
          <div className="mb-3 rounded-xl bg-primary/5 p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Emergency?</p>
                <p className="text-[10px] text-muted-foreground">Send urgent request</p>
              </div>
            </div>
          </div>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
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
              <h1
                className="text-lg font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Hospital Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">City General Hospital, Ahmedabad</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20">
              CG
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, label: "Total Donors Nearby", value: "1,247", change: "+12%", accent: "bg-primary/10 text-primary" },
              { icon: AlertTriangle, label: "Emergency Requests", value: "8", change: "Active", accent: "bg-amber-500/10 text-amber-600" },
              { icon: Droplets, label: "Blood Units Available", value: "136", change: "In Stock", accent: "bg-emerald-500/10 text-emerald-600" },
              { icon: Activity, label: "Response Rate", value: "94%", change: "+3%", accent: "bg-sky-500/10 text-sky-600" },
            ].map((stat) => (
              <div key={stat.label} className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.03]">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.accent} transition-transform group-hover:scale-105`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </span>
                </div>
                <p
                  className="mt-4 text-3xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Blood Inventory */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Droplets className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                    Blood Inventory
                  </h2>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary hover:text-primary">
                  View All <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                {bloodInventory.map((item) => {
                  const percentage = (item.units / item.capacity) * 100
                  const isLow = percentage < 25
                  const isCritical = percentage < 15
                  return (
                    <div key={item.group} className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                        isCritical
                          ? "bg-primary/10 text-primary"
                          : isLow
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-emerald-500/10 text-emerald-600"
                      }`}>
                        {item.group}
                      </div>
                      <div className="flex-1">
                        <Progress value={percentage} className="h-2" />
                      </div>
                      <span className={`min-w-[48px] text-right text-xs font-semibold ${
                        isCritical ? "text-primary" : isLow ? "text-amber-600" : "text-foreground"
                      }`}>
                        {item.units}/{item.capacity}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                    Recent Activity
                  </h2>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary hover:text-primary">
                  View All <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              <div className="mt-5 flex flex-col gap-2.5">
                {recentActivity.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-border p-3.5 transition-colors hover:bg-accent/50"
                  >
                    <div
                      className={`mt-1 flex h-2.5 w-2.5 shrink-0 rounded-full ${
                        item.status === "completed"
                          ? "bg-emerald-500"
                          : item.status === "matched"
                          ? "bg-primary"
                          : "bg-amber-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{item.message}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider ${
                        item.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10"
                          : item.status === "matched"
                          ? "bg-primary/10 text-primary hover:bg-primary/10"
                          : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
