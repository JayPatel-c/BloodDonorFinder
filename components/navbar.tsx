"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/find-donor", label: "Find Donor" },
  { href: "/register-donor", label: "Become Donor" },
  { href: "/hospital-signup", label: "Hospital Login" },
  { href: "/dashboard", label: "Dashboard" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-background/50 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:h-[68px] lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/25">
            <Heart className="h-4.5 w-4.5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            BloodLink
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <Link href="/admin">Admin</Link>
          </Button>
          <Button size="sm" className="rounded-lg gap-2 shadow-sm shadow-primary/20" asChild>
            <Link href="/register-donor">
              <Heart className="h-3.5 w-3.5" fill="currentColor" />
              Donate Now
            </Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2.5 border-b border-border p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                  <Heart className="h-4 w-4 text-primary-foreground" fill="currentColor" />
                </div>
                <span className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  BloodLink
                </span>
              </div>
              <nav className="flex flex-1 flex-col gap-1 p-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-border p-4">
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg" asChild>
                    <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>
                  </Button>
                  <Button size="sm" className="rounded-lg gap-2" asChild>
                    <Link href="/register-donor" onClick={() => setOpen(false)}>
                      <Heart className="h-3.5 w-3.5" fill="currentColor" />
                      Donate Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
