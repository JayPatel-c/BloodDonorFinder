"use client"

import { UserPlus, Search, Phone, ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Register",
    description: "Donors sign up with their blood group, location, and availability status to join our life-saving network.",
    color: "bg-primary/10 text-primary border-primary/20",
  },
  {
    icon: Search,
    step: "02",
    title: "Search",
    description: "Find compatible donors by blood group and location. Our smart filters ensure the fastest match possible.",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    icon: Phone,
    step: "03",
    title: "Connect",
    description: "Instantly access donor contact details and reach out for emergency blood support when every minute matters.",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
]

export function HowItWorks() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, index]))
          }
        },
        { threshold: 0.3 }
      )
      observer.observe(ref)
      return observer
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  return (
    <section className="border-t border-border bg-muted/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">How It Works</span>
          </div>
          <h2
            className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Three Simple Steps to Save a Life
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Our streamlined process ensures that finding a blood donor takes minutes, not hours.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((item, index) => (
            <div
              key={item.step}
              ref={(el) => { itemRefs.current[index] = el }}
              className={`relative transition-all duration-700 ${
                visibleItems.has(index) ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.04]">
                {/* Step number watermark */}
                <span
                  className="absolute top-4 right-6 text-7xl font-bold text-foreground/[0.03]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.step}
                </span>

                <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border ${item.color} transition-transform group-hover:scale-110`}>
                  <item.icon className="h-7 w-7" />
                </div>

                {index < steps.length - 1 && (
                  <ArrowRight className="absolute top-10 -right-7 hidden h-5 w-5 text-border md:block" />
                )}

                <h3
                  className="mt-6 text-xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
