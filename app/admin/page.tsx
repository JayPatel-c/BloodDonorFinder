"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AdminPanel } from "@/components/admin-panel"
import { AdminLoginForm } from "@/components/admin-login-form"

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="relative flex-1 overflow-hidden bg-background">
        {/* Background bubbles */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-background to-primary/[0.02]" />
        <div className="absolute top-16 right-12 h-40 w-40 rounded-full bg-primary/[0.07] blur-2xl" />
        <div className="absolute top-1/3 -left-10 h-32 w-32 rounded-full bg-primary/[0.06] blur-2xl" />
        <div className="absolute bottom-24 right-1/4 h-24 w-24 rounded-full bg-primary/[0.08] blur-2xl" />
        <div className="absolute bottom-1/3 left-1/3 h-16 w-16 rounded-full bg-primary/[0.05] blur-xl" />
        <div className="absolute top-1/2 right-1/3 h-20 w-20 rounded-full bg-primary/[0.06] blur-2xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-20">

          {!isLoggedIn ? (
            <>
              <div className="mb-10 text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Admin Portal
                </p>
                <h1
                  className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Secure Admin Access
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Login to manage donors and system records.
                </p>
              </div>

              <AdminLoginForm onLogin={() => setIsLoggedIn(true)} />
            </>
          ) : (
            <AdminPanel />
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}