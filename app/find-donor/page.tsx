import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DonorSearch } from "@/components/donor-search"

export default function FindDonorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Find Donor</p>
            <h1
              className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Search Blood Donors
            </h1>
            <p className="mt-2 text-muted-foreground">
              Find compatible blood donors near you. Filter by blood group, location, and availability.
            </p>
          </div>
          <DonorSearch />
        </div>
      </main>
      <Footer />
    </div>
  )
}
