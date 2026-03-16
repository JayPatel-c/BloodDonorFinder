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
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden bg-primary py-24 lg:py-28">
      
      <div className="relative mx-auto max-w-7xl px-4 text-center lg:px-8">

        <div
          className={`transition-all duration-700 ${
            visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary-foreground/10">
            <Heart className="h-10 w-10 text-primary-foreground" />
          </div>

          <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
            Every Drop Counts.
            <br />
            Every Second Matters.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/75">
            Join thousands of donors and hospitals working together to ensure no patient is left without life-saving blood during emergencies.
          </p>
        </div>

        {/* Buttons */}
        <div
          className={`mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row transition-all duration-700 delay-200 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Donor Button */}
          <Button
            size="lg"
            className="
              gap-2 rounded-xl 
              bg-white text-primary border border-white
              hover:bg-white hover:text-primary hover:border-white
              active:bg-white focus:bg-white
            "
            asChild
          >
            <Link href="/register-donor">
              Register as Donor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          {/* Hospital Button */}
          <Button
            size="lg"
            className="
              gap-2 rounded-xl 
              bg-white text-primary border border-white
              hover:bg-white hover:text-primary hover:border-white
              active:bg-white focus:bg-white
            "
            asChild
          >
            <Link href="/hospital-signup">
              Hospital Registration
            </Link>
          </Button>
        </div>

        {/* Trust Bar */}
        <div
          className={`mx-auto mt-16 flex items-center justify-center gap-6 text-sm text-primary-foreground/60 transition-all duration-700 delay-400 ${
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