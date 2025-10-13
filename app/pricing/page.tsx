import PricingCard from "./Card"
import { pricingPackages } from "@/lib/pricing-data"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-6 md:py-10">
        <div className="text-center max-w-3xl mx-auto mb-8">
          {/*<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">*/}
          {/*  Choose Your Perfect Plan*/}
          {/*</h1>*/}
          <p className="text-lg md:text-xl text-muted-foreground">
            Transform your photos into professional portraits. No subscriptions, no hidden fees.
            Pay once, use anytime.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-center">
          {pricingPackages.map((pkg) => (
            <div key={pkg.id} className="flex justify-center">
              <PricingCard package={pkg} />
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💯</span>
              <span>Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}