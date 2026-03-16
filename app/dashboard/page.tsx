"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import {
  Heart,
  Building2,
  ShieldCheck,
  ArrowRight,
  Users,
  Activity,
  Droplets,
  Clock,
  Bell,
  Search,
  FileText,
  BarChart3,
  UserCheck,
  AlertTriangle,
  Stethoscope,
  CircleCheck,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

/* ──────────────────── Animated counter hook ──────────────────── */
function useAnimatedCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

/* ──────────────────── Data ──────────────────── */

const stats = [
  { label: "Active Donors", value: 2480, icon: Users, suffix: "+" },
  { label: "Partner Hospitals", value: 156, icon: Building2, suffix: "" },
  { label: "Lives Saved", value: 8320, icon: Heart, suffix: "+" },
  { label: "Avg Response Time", value: 12, icon: Clock, suffix: " min" },
]

const roleCards = [
  {
    title: "Donor Dashboard",
    description:
      "Manage your profile, track donations, and respond to emergency blood requests in real time.",
    icon: Heart,
    href: "/donor/login",
    gradient: "from-red-500/15 via-rose-500/10 to-pink-500/5",
    iconBg: "bg-red-500/12",
    iconColor: "text-red-500",
    borderHover: "hover:border-red-500/30",
    btnClass: "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20",
    features: [
      { icon: UserCheck, text: "Profile & eligibility status" },
      { icon: Bell, text: "Real-time emergency alerts" },
      { icon: FileText, text: "Donation history & certificates" },
      { icon: Activity, text: "Health & donation tracker" },
    ],
  },
  {
    title: "Hospital Dashboard",
    description:
      "Search verified donors, send emergency requests, and manage critical blood requirements efficiently.",
    icon: Building2,
    href: "/hospital/login",
    gradient: "from-blue-500/15 via-sky-500/10 to-cyan-500/5",
    iconBg: "bg-blue-500/12",
    iconColor: "text-blue-500",
    borderHover: "hover:border-blue-500/30",
    btnClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20",
    features: [
      { icon: Search, text: "Search verified donors nearby" },
      { icon: AlertTriangle, text: "Send emergency blood requests" },
      { icon: Stethoscope, text: "Manage blood inventory" },
      { icon: BarChart3, text: "Analytics & usage reports" },
    ],
  },
  {
    title: "Admin Dashboard",
    description:
      "Verify donors, monitor system activity, manage hospitals, and ensure healthcare data accuracy.",
    icon: ShieldCheck,
    href: "/admin",
    features: [
      { icon: CircleCheck, text: "Verify & approve donors" },
      { icon: Building2, text: "Hospital management" },
      { icon: Activity, text: "Real-time system monitoring" },
      { icon: BarChart3, text: "Platform-wide analytics" },
    ],
  },
]

/* ──────────────────── Stat Card ──────────────────── */
function StatCard({ stat }: { stat: (typeof stats)[0] }) {
  const { count, ref } = useAnimatedCounter(stat.value)
  const Icon = stat.icon

  return (
    <div
      ref={ref}
      className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.04]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p
          className="text-2xl font-bold text-foreground md:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {count.toLocaleString()}
          {stat.suffix}
        </p>
        <p className="mt-1 text-xs font-medium text-muted-foreground">
          {stat.label}
        </p>
      </div>
    </div>
  )
}

/* ──────────────────── Page ──────────────────── */

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero Section ─────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-background to-primary/[0.04]" />
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/[0.06] blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/[0.05] blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />

          <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-lg shadow-primary/10">
                <Droplets className="h-8 w-8 text-primary animate-pulse" />
              </div>

              <h1
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Welcome to Your{" "}
                <span className="bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg leading-relaxed">
                Access your personalized portal to manage donations, respond to
                emergencies, and coordinate healthcare — all from one place.
              </p>
            </div>
          </div>
        </section>

        {/* ── Stats Bar ───────────────────────────────────── */}
        <section className="border-b border-border bg-card/50">
          <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {stats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Role Cards ──────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-16 md:py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center" style={{ marginBottom: "24px" }}>
            <h2
              className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Choose Your Portal
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Select the dashboard that matches your role to get started.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {roleCards.map((card) => {
              const Icon = card.icon
              return (
                <Card
                  key={card.title}
                  className="group h-full rounded-2xl border-border transition-all hover:shadow-md hover:shadow-primary/[0.05] hover:border-primary/20"
                >
                  <CardContent className="h-full p-8 flex flex-col gap-6">
                    {/* Icon + title */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3
                          className="text-xl font-semibold text-foreground"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {card.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    {/* Feature list */}
                    <ul className="grid gap-2.5">
                      {card.features.map((feat) => {
                        const FeatIcon = feat.icon
                        return (
                          <li
                            key={feat.text}
                            className="flex items-center gap-3 text-sm text-muted-foreground"
                          >
                            <FeatIcon className="h-4 w-4 shrink-0 text-primary" />
                            {feat.text}
                          </li>
                        )
                      })}
                    </ul>

                    {/* CTA Button */}
                    <Button asChild className="mt-auto rounded-lg gap-2">
                      <Link href={card.href}>
                        Access Dashboard
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}