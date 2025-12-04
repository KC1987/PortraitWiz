import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  pricingBenefits,
  pricingCta,
  pricingHero,
  pricingMetadata,
  pricingFAQs,
  buildPricingSchema,
} from "@/lib/copy/pricing"
import { pricingPackages } from "@/lib/pricing-data"
import { getSiteUrl } from "@/lib/seo"
import TrustBadges from "@/components/TrustBadges"
import PricingCard from "./Card"

const siteUrl = getSiteUrl()
const pricingSchema = buildPricingSchema(siteUrl)

export const metadata: Metadata = {
  title: pricingMetadata.title,
  description: pricingMetadata.description,
  keywords: pricingMetadata.keywords,
  alternates: { canonical: `${siteUrl}/pricing` },
  openGraph: {
    type: "website",
    url: `${siteUrl}/pricing`,
    title: pricingMetadata.ogTitle,
    description: pricingMetadata.ogDescription,
    siteName: "Supershoot",
  },
  twitter: {
    card: "summary_large_image",
    title: pricingMetadata.ogTitle,
    description: pricingMetadata.ogDescription,
  },
}

export default function PricingPage() {
  return (
    <div className="bg-gradient-to-b from-background via-background to-muted/20 text-foreground">
      <main>
        <section className="border-b border-primary/10 bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container mx-auto px-4 py-16 text-center lg:py-20">
            <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              {pricingHero.heading}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
              {pricingHero.subheading}
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-muted-foreground">
              {pricingHero.lead}
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-sm text-muted-foreground">
              Need procurement support?{" "}
              <Link href="/contact" className="font-semibold text-primary hover:text-primary/80">
                Talk to our team
              </Link>{" "}
              about invoices, enterprise onboarding, or API integrations.
            </p>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-background">
          <div className="container mx-auto max-w-7xl px-4 py-16 md:py-20">
            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {pricingPackages.map((pkg) => (
                <div key={pkg.id} id={pkg.id} className="flex justify-center">
                  <PricingCard package={pkg} />
                </div>
              ))}
            </div>
            <div className="mt-12 space-y-4 text-center">
              <TrustBadges />
              <p className="text-sm text-muted-foreground">
                Secure Stripe checkout • Instant credit delivery • Credits never expire
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-muted/20">
          <div className="container mx-auto max-w-5xl px-4 py-16 md:py-20">
            <div className="grid gap-6 md:grid-cols-3">
              {pricingBenefits.map((benefit) => (
                <Card
                  key={benefit.title}
                  className="border border-primary/10 bg-background shadow-sm transition hover:shadow-md"
                >
                  <CardContent className="space-y-3 p-6">
                    <h2 className="text-xl font-semibold text-foreground">{benefit.title}</h2>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-background">
          <div className="container mx-auto max-w-4xl px-4 py-16 md:py-20">
            <div className="text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-muted-foreground">
                Answers to the top questions about Supershoot credits, billing, and usage.
              </p>
            </div>
            <dl className="mt-10 space-y-6">
              {pricingFAQs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-primary/10 bg-muted/20 p-6 shadow-sm"
                >
                  <dt className="text-lg font-semibold text-foreground">{faq.question}</dt>
                  <dd className="mt-3 text-sm text-muted-foreground">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="bg-muted/20">
          <div className="container mx-auto flex flex-col gap-6 px-4 py-16 text-center md:flex-row md:items-center md:justify-between md:text-left lg:py-20">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {pricingCta.heading}
              </h2>
              <p className="text-muted-foreground">{pricingCta.description}</p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href={pricingCta.primaryCta.href}>{pricingCta.primaryCta.label}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={pricingCta.secondaryCta.href}>{pricingCta.secondaryCta.label}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pricingSchema }} />
    </div>
  )
}
