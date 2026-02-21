import Link from "next/link"
import { Heart, Phone, Mail, AlertCircle } from "lucide-react"

const quickLinks = [
  { href: "/find-donor", label: "Find Donor" },
  { href: "/register-donor", label: "Become a Donor" },
  { href: "/hospital-signup", label: "Hospital Registration" },
  { href: "/dashboard", label: "Dashboard" },
]

const supportLinks = [
  { href: "#", label: "About Us" },
  { href: "#", label: "Contact" },
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/25">
                <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                BloodLink
              </span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              A healthcare information system leveraging technology to save lives and transform emergency medical response.
            </p>
            <div className="mt-6 flex gap-3">
              {["Fb", "Tw", "In", "Yt"].map((s) => (
                <div
                  key={s}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-xs font-bold text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-foreground">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-foreground">Support</h3>
            <ul className="flex flex-col gap-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-foreground">Emergency Contact</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">24/7 Helpline</p>
                  <p className="text-sm font-semibold text-foreground">1800-XXX-XXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email Support</p>
                  <p className="text-sm font-semibold text-foreground">help@bloodlink.org</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <AlertCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Blood Emergency</p>
                  <p className="text-sm font-semibold text-foreground">108</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          {/* <p className="text-sm text-muted-foreground">
            Blood Donor Finder - 24CE078, 24CE081, 24CE082, 24CE085
          </p>
          <p className="text-sm text-muted-foreground">
            Dhruvin Patel, Jay Patel, Jenil Patel, Krish Patel
          </p> */}
        </div>
      </div>
    </footer>
  )
}
