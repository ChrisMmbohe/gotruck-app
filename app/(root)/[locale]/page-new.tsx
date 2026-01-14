import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { StatsBanner } from "@/components/landing/stats-banner";
import { Testimonials } from "@/components/landing/testimonials";
import { Resources } from "@/components/landing/resources";
import { CTASection } from "@/components/landing/cta-section";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

/**
 * GoTruck Home Page - EAC Freight Logistics Platform
 * 
 * Modern landing page inspired by leading global platforms:
 * - Samsara: AI-powered safety and fleet intelligence
 * - Motive: All-in-one fleet management with AI focus
 * - Geotab: Connected intelligence and telematics
 * - Uber Freight: Market insights and cost savings
 * - Flexport: End-to-end freight solutions
 * - CargoWise: Unified global logistics platform
 * 
 * EAC Customizations:
 * - Cross-border freight emphasis (Djibouti, Northern, Central corridors)
 * - Multi-currency support (KES, UGX, TZS)
 * - Customs and compliance automation
 * - Regional visuals and culturally resonant design
 * - Multilingual support (English, Swahili, French)
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header with locale switcher */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section - Bold value proposition with EAC focus */}
        <Hero />

        {/* Stats Banner - Platform impact metrics */}
        <StatsBanner />

        {/* Features Section - Comprehensive solution grid */}
        <Features />

        {/* Testimonials - EAC customer success stories */}
        <Testimonials />

        {/* Resources Section - Insights and market trends */}
        <Resources />

        {/* Final CTA - Conversion-focused call to action */}
        <CTASection />
      </main>

      {/* Footer - Comprehensive sitemap and regional info */}
      <Footer />
    </div>
  );
}
