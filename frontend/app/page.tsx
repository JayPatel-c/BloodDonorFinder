import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturesSection } from "@/components/landing/features-section"
import { ImpactSection } from "@/components/landing/impact-section"
import { BloodCompatibility } from "@/components/landing/blood-compatibility"
import { CtaSection } from "@/components/landing/cta-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <BloodCompatibility />
        <ImpactSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
