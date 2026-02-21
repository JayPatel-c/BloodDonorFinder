"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Heart, Building2, ArrowRight, Droplets } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1500
          const start = Date.now()
          const animate = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full bg-primary/[0.03]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/4 rounded-full bg-primary/[0.02]" />
      </div>

      {/* Floating blood cells decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse rounded-full bg-primary/[0.06]"
            style={{
              width: `${20 + i * 15}px`,
              height: `${20 + i * 15}px`,
              top: `${15 + i * 18}%`,
              left: `${5 + i * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-36">
        <div
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Pill badge */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-5 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            <span className="text-sm font-medium text-primary">Emergency Blood Support System</span>
          </div>

          <h1
            className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Find Blood Donors
            <span className="relative inline-block text-primary">
              {" "}In Minutes
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M1 5.5C47 2 153 2 199 5.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary/40" />
              </svg>
            </span>
          </h1>

          <p
            className={`mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground transition-all delay-200 duration-700 md:text-xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            Every second counts during medical emergencies. Our platform connects patients with compatible blood donors instantly, saving precious lives when it matters most.
          </p>

          {/* Search bar */}
          <div
            className={`mx-auto mt-12 max-w-2xl transition-all delay-300 duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-xl shadow-primary/[0.04] sm:flex-row">
              <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 sm:w-44">
                <Droplets className="h-4 w-4 shrink-0 text-primary" />
                <Select>
                  <SelectTrigger className="border-0 bg-transparent px-0 shadow-none focus:ring-0">
                    <SelectValue placeholder="Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="h-8 w-px self-center bg-border hidden sm:block" />

              <Input
                placeholder="Enter your city or area..."
                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
              />

              <Button size="lg" className="gap-2 rounded-xl px-6" asChild>
                <Link href="/find-donor">
                  <Search className="h-4 w-4" />
                  Search Donors
                </Link>
              </Button>
            </div>
          </div>

          {/* CTA buttons */}
          <div
            className={`mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row transition-all delay-[400ms] duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <Button variant="outline" size="lg" className="gap-2 rounded-xl border-primary/20 hover:bg-primary/5" asChild>
              <Link href="/register-donor">
                <Heart className="h-4 w-4 text-primary" />
                Become a Donor
              </Link>
            </Button>
            <Button variant="ghost" size="lg" className="gap-2" asChild>
              <Link href="/hospital-signup">
                <Building2 className="h-4 w-4" />
                Hospital Register
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div
          className={`mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4 transition-all delay-500 duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {[
            { value: 10000, suffix: "+", label: "Registered Donors", icon: "heart" },
            { value: 500, suffix: "+", label: "Hospitals Connected", icon: "building" },
            { value: 24, suffix: "/7", label: "Availability", icon: "clock" },
            { value: 50, suffix: "%", label: "Faster Response", icon: "trending" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-center transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.04]"
            >
              <div className="absolute inset-0 bg-primary/[0.02] opacity-0 transition-opacity group-hover:opacity-100" />
              <p
                className="relative text-3xl font-bold text-primary md:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="relative mt-1.5 text-xs font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
