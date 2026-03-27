import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HospitalSignupForm } from "@/components/hospital-signup-form"

export default function HospitalSignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="relative flex-1 bg-background overflow-hidden">
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

        <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-20">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Hospital Registration</p>
            <h1
              className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Register Your Hospital
            </h1>
            <p className="mt-3 text-muted-foreground">
              Join our network and access emergency blood donor services for your patients.
            </p>
          </div>
          <HospitalSignupForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
