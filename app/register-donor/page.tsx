import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DonorRegistrationForm } from "@/components/donor-registration-form"

export default function RegisterDonorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="relative flex-1 bg-background overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-background to-primary/[0.02]" />
        <div className="absolute -top-24 right-1/4 h-64 w-64 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-56 w-56 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-primary/[0.03] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-20">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Donor Registration</p>
            <h1
              className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Become a Life Saver
            </h1>
            <p className="mt-3 text-muted-foreground">
              Fill in your details to join our network of verified blood donors.
            </p>
          </div>
          <DonorRegistrationForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
