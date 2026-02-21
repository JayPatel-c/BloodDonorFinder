"use client"

import { Button } from "@/components/ui/button"
import { Heart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export function CtaSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden bg-primary py-24 lg:py-28">
      {/* Decorative patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/5" />
        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-primary-foreground/5" />
        <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/3" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 text-center lg:px-8">
        <div
          className={`transition-all duration-700 ${
            visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary-foreground/10 ring-8 ring-primary-foreground/5">
            <Heart className="h-10 w-10 text-primary-foreground" />
          </div>

          <h2
            className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Every Drop Counts.
            <br />
            Every Second Matters.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/75">
            Join thousands of donors and hospitals working together to ensure no patient is left without life-saving blood during emergencies.
          </p>
        </div>

        <div
          className={`mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row transition-all duration-700 delay-200 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <Button
            size="lg"
            className="gap-2 rounded-xl bg-primary-foreground text-primary shadow-lg shadow-foreground/10 hover:bg-primary-foreground/90"
            asChild
          >
            <Link href="/register-donor">
              Register as Donor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 rounded-xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link href="/hospital-signup">Hospital Registration</Link>
          </Button>
        </div>

        {/* Trust bar */}
        <div
          className={`mx-auto mt-16 flex max-w-lg flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-primary-foreground/50 transition-all duration-700 delay-400 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span>Trusted by 500+ hospitals</span>
          <span className="hidden sm:inline">|</span>
          <span>10,000+ verified donors</span>
          <span className="hidden sm:inline">|</span>
          <span>24/7 support</span>
        </div>
      </div>
    </section>
  )
}
