import type { Metadata } from "next"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  aboutMetadata,
  aboutHero,
  aboutWhy,
  aboutTechnology,
  aboutFeatures,
  aboutValues,
  aboutJourney,
  aboutIndustries,
  aboutArchitecture,
  aboutFaq,
  aboutAction,
  aboutSocialProof,
  aboutFooterCta,
  buildAboutSchema,
} from "@/lib/copy/about"
import { getSiteUrl } from "@/lib/seo"

const siteUrl = getSiteUrl()
const aboutSchema = buildAboutSchema(siteUrl)

export const metadata: Metadata = {
  title: aboutMetadata.title,
  description: aboutMetadata.description,
  keywords: aboutMetadata.keywords,
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    type: "website",
    url: `${siteUrl}/about`,
    title: aboutMetadata.ogTitle,
    description: aboutMetadata.ogDescription,
    siteName: "Supershoot",
  },
  twitter: {
    card: "summary_large_image",
    title: aboutMetadata.ogTitle,
    description: aboutMetadata.ogDescription,
  },
}

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-background via-background to-muted/20 text-foreground">
      <main>
        <section className="border-b border-primary/10 bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container mx-auto px-4 py-16 lg:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="outline" className="mb-4">
                Trusted by global teams
              </Badge>
              <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                {aboutHero.heading}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                <Link href="/" className="font-semibold text-primary hover:text-primary/80">
                  Supershoot
                </Link>{" "}
                is the leading{" "}
                <Link href="/" className="font-semibold text-primary hover:text-primary/80">
                  AI headshot generator
                </Link>{" "}
                trusted by over 50,000 professionals worldwide. Our platform combines advanced
                artificial intelligence with photography expertise to deliver studio-quality
                professional portraits in under 60 seconds—no photoshoot required.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href={aboutHero.primaryCta.href}>{aboutHero.primaryCta.label}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={aboutHero.secondaryCta.href}>{aboutHero.secondaryCta.label}</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
              {aboutHero.stats.map((stat) => (
                <Card
                  key={stat.label}
                  className="border border-primary/10 bg-background shadow-sm transition hover:shadow-md"
                >
                  <CardContent className="space-y-2 p-6">
                    <p className="text-2xl font-semibold text-foreground md:text-3xl">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-background">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {aboutWhy.title}
                </h2>
                <p className="mt-3 text-muted-foreground">{aboutWhy.introduction}</p>
              </div>
              <div className="rounded-3xl border border-primary/10 bg-muted/20 p-8 shadow-sm md:p-10">
                <h3 className="text-2xl font-semibold">{aboutWhy.subheading}</h3>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {aboutWhy.painPoints.map((item) => (
                    <div key={item.title} className="rounded-xl border border-primary/10 bg-background p-5">
                      <p className="text-base font-semibold text-foreground">{item.title}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-sm text-muted-foreground md:text-base">
                  {aboutWhy.solution} Explore{" "}
                  <Link href="/pricing" className="font-semibold text-primary hover:text-primary/80">
                    credit packages
                  </Link>{" "}
                  or{" "}
                  <Link href="/contact" className="font-semibold text-primary hover:text-primary/80">
                    contact our team
                  </Link>{" "}
                  to see how quickly you can refresh professional imagery.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-muted/20">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {aboutTechnology.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                {aboutTechnology.introduction}
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-5xl space-y-6">
              {aboutTechnology.steps.map((step) => (
                <Card
                  key={step.heading}
                  className="border border-primary/10 bg-background text-left shadow-sm transition hover:shadow-md"
                >
                  <CardContent className="space-y-4 p-6 md:p-8">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{step.heading}</h3>
                      <p className="mt-2 text-sm text-muted-foreground md:text-base">
                        {step.description}
                      </p>
                    </div>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground md:text-base">
                      {step.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-muted-foreground md:text-sm">
              Learn more about our{" "}
              <Link href="/privacy" className="font-medium text-primary hover:text-primary/80">
                privacy policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="font-medium text-primary hover:text-primary/80">
                terms of service
              </Link>{" "}
              to understand how Supershoot protects professional imagery.
            </p>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-background">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {aboutFeatures.title}
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              {aboutFeatures.sections.map((feature) => (
                <Card
                  key={feature.heading}
                  className="border border-primary/10 bg-muted/20 shadow-sm transition hover:shadow-md"
                >
                  <CardContent className="space-y-4 p-6 text-left">
                    <h3 className="text-xl font-semibold text-foreground">{feature.heading}</h3>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground md:text-base">
                      {feature.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-muted/20">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {aboutValues.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                These principles guide how we build features, support customers, and steward
                responsible AI headshot generation.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              {aboutValues.items.map((value) => (
                <Card
                  key={value.name}
                  className="border border-primary/10 bg-background shadow-sm transition hover:shadow-md"
                >
                  <CardContent className="space-y-3 p-6 text-left">
                    <h3 className="text-xl font-semibold text-foreground">{value.name}</h3>
                    <p className="text-sm text-muted-foreground md:text-base">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-background">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {aboutJourney.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                We evolve alongside our customers, prioritising reliability, security, and delightful
                user experiences.
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-4xl space-y-6">
              {aboutJourney.periods.map((period) => (
                <Card
                  key={period.year}
                  className="border border-primary/10 bg-muted/20 shadow-sm transition hover:shadow-md"
                >
                  <CardContent className="space-y-4 p-6 md:p-8">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <Badge variant="outline" className="w-fit">
                        {period.year}
                      </Badge>
                      <h3 className="text-xl font-semibold text-foreground">{period.heading}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground md:text-base">{period.description}</p>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground md:text-base">
                      {period.milestones.map((milestone) => (
                        <li key={milestone}>{milestone}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-muted/20">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {aboutIndustries.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                {aboutIndustries.introduction}
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-5xl space-y-6">
              {aboutIndustries.segments.map((segment) => (
                <Card
                  key={segment.name}
                  className="border border-primary/10 bg-background text-left shadow-sm transition hover:shadow-md"
                >
                  <CardContent className="space-y-4 p-6 md:p-8">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{segment.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground md:text-base">
                        {segment.description}
                      </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground md:text-base">Use cases</p>
                        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted-foreground md:text-base">
                          {segment.needs.map((need) => (
                            <li key={need}>{need}</li>
                          ))}
                        </ul>
                      </div>
                      {segment.reasons ? (
                        <div>
                          <p className="text-sm font-semibold text-foreground md:text-base">
                            Why teams choose Supershoot
                          </p>
                          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted-foreground md:text-base">
                            {segment.reasons.map((reason) => (
                              <li key={reason}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-background">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {aboutArchitecture.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                Built on modern infrastructure for technical buyers who need assurance around
                scalability, reliability, and compliance.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
              {aboutArchitecture.categories.map((category) => (
                <Card
                  key={category.name}
                  className="border border-primary/10 bg-muted/20 shadow-sm transition hover:shadow-md"
                >
                  <CardContent className="space-y-4 p-6 text-left">
                    <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground md:text-base">
                      {category.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-muted/20">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {aboutFaq.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                Have more questions?{" "}
                <Link href="/contact" className="font-semibold text-primary hover:text-primary/80">
                  Reach our support team
                </Link>{" "}
                for enterprise pricing, API access, or product deep dives.
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-4xl space-y-6">
              {aboutFaq.items.map((item) => (
                <Card
                  key={item.question}
                  className="border border-primary/10 bg-background shadow-sm transition hover:shadow-md"
                >
                  <CardContent className="space-y-3 p-6 text-left md:p-8">
                    <h3 className="text-lg font-semibold text-foreground md:text-xl">
                      {item.question}
                    </h3>
                    <p className="text-sm text-muted-foreground md:text-base">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-background">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {aboutAction.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                {aboutAction.description}
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-primary/10 bg-muted/20 p-8 shadow-sm md:p-10">
              <ol className="list-decimal space-y-3 pl-6 text-sm text-muted-foreground md:text-base">
                {aboutAction.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href={aboutAction.primaryCta.href}>{aboutAction.primaryCta.label}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={aboutAction.secondaryCta.href}>{aboutAction.secondaryCta.label}</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href={aboutAction.tertiaryCta.href}>{aboutAction.tertiaryCta.label}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-muted/20">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {aboutSocialProof.title}
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {aboutSocialProof.testimonials.map((testimonial) => (
                <Card
                  key={testimonial.name}
                  className="border border-primary/10 bg-background shadow-sm transition hover:shadow-md"
                >
                  <CardContent className="space-y-3 p-6 text-left">
                    <p className="text-sm text-muted-foreground md:text-base">
                      {testimonial.quote}
                    </p>
                    <div className="pt-2">
                      <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground md:text-sm">{testimonial.title}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-primary/10 bg-background p-8 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">Featured In</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground md:text-base">
                {aboutSocialProof.featuredIn.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-background">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div className="max-w-2xl space-y-4">
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {aboutFooterCta.title}
                </h2>
                <p className="text-muted-foreground">{aboutFooterCta.description}</p>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground md:text-base">
                  {aboutFooterCta.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href={aboutFooterCta.primaryCta.href}>{aboutFooterCta.primaryCta.label}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={aboutFooterCta.secondaryCta.href}>
                    {aboutFooterCta.secondaryCta.label}
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href={aboutFooterCta.tertiaryCta.href}>
                    {aboutFooterCta.tertiaryCta.label}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: aboutSchema }} />
    </div>
  )
}
