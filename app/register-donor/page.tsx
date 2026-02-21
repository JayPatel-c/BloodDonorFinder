import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DonorRegistrationForm } from "@/components/donor-registration-form"

export default function RegisterDonorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-20">
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
