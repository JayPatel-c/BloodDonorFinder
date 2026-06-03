"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingDown, Clock, Users, HeartPulse, Quote } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const impacts = [
  {
    icon: TrendingDown,
    value: "50%",
    label: "Response Time Reduced",
    description: "Emergency donor search time cut in half",
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    value: "100+",
    label: "Lives Saved Annually",
    description: "Potential impact per city per year",
    accent: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "System Availability",
    description: "Round-the-clock access to donor database",
    accent: "bg-sky-500/10 text-sky-600",
  },
  {
    icon: HeartPulse,
    value: "8",
    label: "Blood Groups Covered",
    description: "Complete blood type classification support",
    accent: "bg-amber-500/10 text-amber-600",
  },
]

const testimonials = [
  {
    quote: "BloodLink helped us find a rare B- donor within 20 minutes during an emergency surgery. The platform is truly life-saving.",
    name: "Dr. Meera Patel",
    role: "Chief Surgeon, City Hospital",
  },
  {
    quote: "As a regular donor, I love how easy the platform makes it to be notified and respond to emergency requests nearby.",
    name: "Rahul Sharma",
    role: "Regular Blood Donor",
  },
]

export function ImpactSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="border-t border-border bg-muted/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left - content */}
          <div className={`transition-all duration-700 ${visible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Impact</span>
            </div>
            <h2
              className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Transforming Emergency Healthcare Response
            </h2>
            <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
              Blood Donor Finder bridges the critical gap between medical emergencies and timely intervention, making life-saving resources accessible to everyone.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 rounded-xl" asChild>
                <Link href="/register-donor">
                  Join as Donor
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-xl border-primary/20 hover:bg-primary/5" asChild>
                <Link href="/find-donor">Find a Donor</Link>
              </Button>
            </div>

            {/* Testimonials */}
            <div className="mt-12 flex flex-col gap-4">
              {testimonials.map((t) => (
                <div key={t.name} className="relative rounded-xl border border-border bg-card p-5">
                  <Quote className="absolute top-4 right-4 h-6 w-6 text-primary/10" />
                  <p className="text-sm leading-relaxed text-muted-foreground italic">
                    {`"${t.quote}"`}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - stats grid */}
          <div className={`grid gap-4 sm:grid-cols-2 transition-all duration-700 delay-200 ${visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}>
            {impacts.map((impact, index) => (
              <div
                key={impact.label}
                className={`group rounded-2xl border border-border bg-card p-7 transition-all duration-500 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.04] ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: visible ? `${300 + index * 100}ms` : "0ms" }}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${impact.accent} transition-transform group-hover:scale-110`}>
                  <impact.icon className="h-6 w-6" />
                </div>
                <p
                  className="mt-4 text-4xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {impact.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{impact.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{impact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
