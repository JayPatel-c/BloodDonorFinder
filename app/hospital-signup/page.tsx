import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HospitalSignupForm } from "@/components/hospital-signup-form"

export default function HospitalSignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-20">
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
