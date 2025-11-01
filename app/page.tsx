import type { Metadata } from "next"
import Link from "next/link"

import ImageGen from "@/components/main/image-gen/image-gen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  faqContent,
  featureHighlights,
  heroContent,
  homepageMetadata,
  howItWorksContent,
  pricingPreviewContent,
  schemaOrgContent,
  socialProofContent,
  useCasesContent,
} from "@/lib/copy/homepage"
import { getSiteUrl } from "@/lib/seo"
import BeforeAfterCarousel from "@/components/main/BeforeAfterCarousel";
import Testimonials from "@/components/main/Testimonials";

const siteUrl = getSiteUrl()

const structuredData = JSON.stringify([schemaOrgContent.product, schemaOrgContent.faq])

export const metadata: Metadata = {
  title: homepageMetadata.title,
  description: homepageMetadata.description,
  keywords: homepageMetadata.keywords,
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: homepageMetadata.ogTitle,
    description: homepageMetadata.ogDescription,
    siteName: "PortraitWiz",
    images: [
      {
        url: `${siteUrl}/bg.jpg`,
        width: 1200,
        height: 630,
        alt: "Professional AI headshot example created by PortraitWiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homepageMetadata.ogTitle,
    description: homepageMetadata.ogDescription,
    images: [`${siteUrl}/bg.jpg`],
  },
}

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <main>
        <section
          id="generator"
          // className="border-b border-border"
        >
          {/*<div className="container mx-auto px-4">*/}
            <div className="flex justify-center items-center py-5 " >
              <h1 className="text-xl font-bold text-center">Generate professional looking portraits in 30 seconds</h1>
            </div>
              <ImageGen />
            <BeforeAfterCarousel />
            <div className="space-y-8 lg:space-y-10">
              <header className="space-y-6 text-center lg:text-left">
                {/*<Testimonials />*/}
                {/*<Badge className="bg-primary/10 text-primary hover:bg-primary/10">*/}
                {/*  {heroContent.trustSignals.rating}*/}
                {/*</Badge>*/}
                <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                  {heroContent.heading}
                </h1>
                <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl lg:mx-0">
                  {heroContent.subheading}
                </p>
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                  <Button size="lg" asChild>
                    <Link href={heroContent.primaryCta.href}>{heroContent.primaryCta.label}</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href={heroContent.secondaryCta.href}>{heroContent.secondaryCta.label}</Link>
                  </Button>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {heroContent.trustSignals.dataPoint}
                </p>
              </header>
            </div>
          {/*</div>*/}
        </section>

        <section className="border-b border-border">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto grid max-w-3xl gap-6 text-center">
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {socialProofContent.title}
                </h2>
                <p className="text-muted-foreground">{socialProofContent.description}</p>
              </div>
              <blockquote className="mx-auto max-w-2xl rounded-lg border border-border bg-muted p-6 text-left sm:p-8">
                <p className="text-lg font-medium leading-relaxed text-foreground">
                  {socialProofContent.testimonial.quote}
                </p>
                <footer className="mt-4 text-sm font-semibold text-muted-foreground">
                  {socialProofContent.testimonial.name} ·{" "}
                  {socialProofContent.testimonial.title}
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-muted">
          <div className="container mx-auto max-w-5xl px-4 py-16 md:py-20">
            <div className="space-y-8 text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {howItWorksContent.title}
              </h2>
              <ol className="grid gap-6 text-left sm:grid-cols-3">
                {howItWorksContent.steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="rounded-lg border border-border bg-background p-6"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                      {index + 1}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8">
              <header className="text-center">
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {featureHighlights.title}
                </h2>
              </header>
              <div className="grid gap-6 md:grid-cols-3">
                {featureHighlights.items.map((item) => (
                  <Card
                    key={item.title}
                    className="border border-border"
                  >
                    <CardContent className="space-y-4 p-6">
                      <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-muted">
          <div className="container mx-auto max-w-5xl px-4 py-16 md:py-20">
            <div className="grid gap-10 md:grid-cols-5 md:items-center">
              <div className="space-y-4 md:col-span-3">
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {pricingPreviewContent.title}
                </h2>
                <p className="text-muted-foreground">{pricingPreviewContent.description}</p>
                <Button size="lg" asChild>
                  <Link href={pricingPreviewContent.cta.href}>
                    {pricingPreviewContent.cta.label}
                  </Link>
                </Button>
              </div>
              <Card className="md:col-span-2 border border-border bg-background">
                <CardContent className="space-y-2 p-6 text-center">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                    Best Seller
                  </p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {pricingPreviewContent.highlight.name}
                  </h3>
                  <p className="text-4xl font-extrabold text-primary">
                    {pricingPreviewContent.highlight.price}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {pricingPreviewContent.highlight.details}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {useCasesContent.title}
              </h2>
              <p className="mt-3 text-muted-foreground">{useCasesContent.description}</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {useCasesContent.cases.map((useCase) => (
                <Card
                  key={useCase.title}
                  className="border border-border"
                >
                  <CardContent className="space-y-3 p-6">
                    <h3 className="text-xl font-semibold text-foreground">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-muted">
          <div className="container mx-auto max-w-5xl px-4 py-16 md:py-20">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {faqContent.title}
                </h2>
              </div>
              <dl className="space-y-4">
                {faqContent.items.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-lg border border-border bg-background p-6"
                  >
                    <dt className="text-lg font-semibold text-foreground">{faq.question}</dt>
                    <dd className="mt-3 text-sm text-muted-foreground">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background">
        <div className="container mx-auto flex flex-col gap-6 px-4 py-16 text-center md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Ready to get started?
            </h2>
            <p className="text-sm text-muted-foreground">
              Create professional headshots in Seconds.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="#generator">Generate Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      </footer>
    </div>
  )
}
