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

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-20">

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