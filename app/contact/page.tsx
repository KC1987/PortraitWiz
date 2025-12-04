import type { Metadata } from "next"

import Link from "next/link"

import ContactForm from "./contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { contactHero, contactMetadata, buildContactSchema } from "@/lib/copy/contact"

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.supershoot.co").replace(
  /\/$/,
  "",
)
const contactSchema = buildContactSchema(siteUrl)

export const metadata: Metadata = {
  title: contactMetadata.title,
  description: contactMetadata.description,
  keywords: contactMetadata.keywords,
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    type: "website",
    url: `${siteUrl}/contact`,
    title: contactMetadata.ogTitle,
    description: contactMetadata.ogDescription,
    siteName: "Supershoot",
  },
  twitter: {
    card: "summary_large_image",
    title: contactMetadata.ogTitle,
    description: contactMetadata.ogDescription,
  },
}

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-background via-background to-muted/20 text-foreground">
      <main>
        <section className="border-b border-primary/10 bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container mx-auto max-w-3xl px-4 py-16 text-center lg:py-20">
            <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              {contactHero.heading}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              {contactHero.subheading}
              {" "}
              Prefer to explore credit options first?{" "}
              <Link href="/pricing" className="font-semibold text-primary hover:text-primary/80">
                Review our pricing
              </Link>{" "}
              before you reach out.
            </p>
          </div>
        </section>

        <section className="border-b border-primary/10 bg-background">
          <div className="container mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 py-16 text-center md:py-20">
            <Card className="w-full border border-primary/10 bg-background shadow-xl">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Send us a message
                </h2>
                <p className="mt-2 text-sm text-muted-foreground md:text-base">
                  Share project details, account questions, or partnership ideas. A specialist will
                  respond with next steps.
                </p>
                <ContactForm className="mt-8" />
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground md:text-base">
              Prefer email? Reach us at{" "}
              <a
                href="mailto:support@supershoot.co"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                support@supershoot.co
              </a>{" "}
              and we&apos;ll respond within one business day.
            </p>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: contactSchema }} />
    </div>
  )
}
