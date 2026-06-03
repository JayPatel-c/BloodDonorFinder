"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

const compatibility: Record<string, { donateTo: string[]; receiveFrom: string[] }> = {
  "O-": { donateTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], receiveFrom: ["O-"] },
  "O+": { donateTo: ["O+", "A+", "B+", "AB+"], receiveFrom: ["O-", "O+"] },
  "A-": { donateTo: ["A-", "A+", "AB-", "AB+"], receiveFrom: ["O-", "A-"] },
  "A+": { donateTo: ["A+", "AB+"], receiveFrom: ["O-", "O+", "A-", "A+"] },
  "B-": { donateTo: ["B-", "B+", "AB-", "AB+"], receiveFrom: ["O-", "B-"] },
  "B+": { donateTo: ["B+", "AB+"], receiveFrom: ["O-", "O+", "B-", "B+"] },
  "AB-": { donateTo: ["AB-", "AB+"], receiveFrom: ["O-", "A-", "B-", "AB-"] },
  "AB+": { donateTo: ["AB+"], receiveFrom: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"] },
}

const bloodGroups = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]

export function BloodCompatibility() {
  const [selected, setSelected] = useState("O+")
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const data = compatibility[selected]

  return (
    <section ref={ref} className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left - image */}
          <div className={`transition-all duration-700 ${visible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}>
            <div className="relative overflow-hidden rounded-3xl">
              <Image
                src="/images/blood-donation-hero.png"
                alt="Blood donation illustration showing diverse volunteers at a modern medical center"
                width={600}
                height={400}
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </div>
          </div>

          {/* Right - compatibility checker */}
          <div className={`transition-all duration-700 delay-200 ${visible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Compatibility</span>
            </div>
            <h2
              className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Blood Group Compatibility Chart
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Select a blood group to see donation and receiving compatibility.
            </p>

            {/* Blood group selector */}
            <div className="mt-8 grid grid-cols-4 gap-2">
              {bloodGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setSelected(group)}
                  className={`flex items-center justify-center rounded-xl border p-3 text-sm font-bold transition-all ${
                    selected === group
                      ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105"
                      : "border-border text-foreground hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="mt-6 flex flex-col gap-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  {selected} can donate to
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.donateTo.map((g) => (
                    <span
                      key={g}
                      className="flex h-9 items-center justify-center rounded-lg bg-emerald-100 px-3 text-sm font-bold text-emerald-700"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  {selected} can receive from
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.receiveFrom.map((g) => (
                    <span
                      key={g}
                      className="flex h-9 items-center justify-center rounded-lg bg-sky-100 px-3 text-sm font-bold text-sky-700"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
