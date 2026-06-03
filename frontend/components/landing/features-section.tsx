"use client"

import { Database, Search, Phone, Clock, ShieldCheck, MapPin } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const features = [
  {
    icon: Database,
    title: "Centralized Database",
    description: "Comprehensive donor profiles stored securely, accessible 24/7 for instant retrieval during emergencies.",
    accent: "group-hover:bg-primary/15 bg-primary/10 text-primary",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Advanced filters by blood group, location, and availability ensure the perfect match in seconds.",
    accent: "group-hover:bg-emerald-500/15 bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: Phone,
    title: "Instant Contact",
    description: "Direct access to verified donor contact details eliminates delays in critical situations.",
    accent: "group-hover:bg-sky-500/15 bg-sky-500/10 text-sky-600",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Round-the-clock system access ensures help is always available when emergencies strike.",
    accent: "group-hover:bg-amber-500/15 bg-amber-500/10 text-amber-600",
  },
  {
    icon: ShieldCheck,
    title: "Verified Donors",
    description: "All donor profiles are validated and verified for accurate medical and personal information.",
    accent: "group-hover:bg-primary/15 bg-primary/10 text-primary",
  },
  {
    icon: MapPin,
    title: "Location-Based",
    description: "Geographic filtering finds the nearest available donors, minimizing critical transport time.",
    accent: "group-hover:bg-teal-500/15 bg-teal-500/10 text-teal-600",
  },
]

export function FeaturesSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Features</span>
          </div>
          <h2
            className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Built for Life-Saving Speed
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Every feature is designed to reduce response time and connect patients with donors as fast as possible.
          </p>
        </div>

        <div ref={ref} className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all duration-500 hover:border-primary/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/[0.04] ${
                visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: visible ? `${index * 80}ms` : "0ms" }}
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-primary/[0.03] transition-transform group-hover:scale-150" />

              <div className={`relative flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${feature.accent}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3
                className="relative mt-5 text-lg font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {feature.title}
              </h3>
              <p className="relative mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
