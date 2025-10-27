import { pricingPackages } from "@/lib/pricing-data"

export const pricingMetadata = {
  title: "PortraitWiz Pricing | Flexible AI Headshot Credits",
  description:
    "Choose the PortraitWiz credit pack that fits your team. Buy AI headshot credits in bulk, access studio-quality portraits instantly, and never worry about subscription fees.",
  keywords: [
    "AI headshot pricing",
    "PortraitWiz credits",
    "buy AI portraits",
    "professional headshot cost",
    "AI photography pricing",
  ],
  ogTitle: "PortraitWiz Pricing — Flexible AI Headshot Credits",
  ogDescription:
    "Purchase AI headshot credits that never expire. Perfect for individuals, teams, and enterprises that need polished portraits on demand.",
}

export const pricingHero = {
  heading: "Choose the Credit Pack Built for Your Workflow",
  subheading:
    "PortraitWiz credits never expire, so you can generate professional AI headshots whenever hiring, fundraising, or rebranding demands it.",
  lead: "Every credit delivers a studio-quality portrait sized for LinkedIn, sales decks, and investor updates.",
}

export const pricingBenefits = [
  {
    title: "Credits That Never Expire",
    description:
      "Use your AI headshot credits whenever the team needs updated portraits—no forced monthly subscription or surprise renewal.",
  },
  {
    title: "Enterprise-Ready Security",
    description:
      "Uploads stay encrypted, never leave our secure pipeline, and are automatically discarded after each generation.",
  },
  {
    title: "High-Volume Support",
    description:
      "Need hundreds of portraits? PortraitWiz scales with bulk credit packs, webhook integrations, and concierge support for people teams.",
  },
]

export const pricingFAQs = [
  {
    question: "Do credits expire or require a subscription?",
    answer:
      "Credits never expire. Purchase the amount you need today and redeem them any time your team requires new headshots.",
  },
  {
    question: "What image formats do I receive?",
    answer:
      "Each generation includes a high-resolution PNG optimized for LinkedIn, resume portals, and presentation decks.",
  },
  {
    question: "Can I purchase credits for my entire company?",
    answer:
      "Yes. Choose from pre-built packs or contact us for enterprise bundles, usage dashboards, and invoicing support.",
  },
  {
    question: "What if the portrait doesn’t match my expectations?",
    answer:
      "Regenerate with different outfits or backgrounds at no extra charge. For persistent issues, our team will review credits within seven days.",
  },
]

export const pricingCta = {
  heading: "Need a Custom Credit Package?",
  description:
    "Whether you’re onboarding a new cohort or refreshing executive portraits, our team can tailor a plan with concierge support.",
  primaryCta: { label: "Talk to Sales", href: "/contact" },
  secondaryCta: { label: "Generate a Headshot", href: "/#generator" },
}

export function buildPricingSchema(baseUrl: string) {
  const normalizedBase = baseUrl.replace(/\/$/, "")
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: "PortraitWiz Credits",
    description:
      "PortraitWiz offers flexible AI headshot credit packs that create studio-quality portraits from your reference photos.",
    brand: { "@type": "Brand", name: "PortraitWiz" },
    offers: pricingPackages.map((pkg) => ({
      "@type": "Offer",
      sku: pkg.id,
      name: pkg.name,
      price: (pkg.price / 100).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${normalizedBase}/pricing#${pkg.id}`,
    })),
  })
}
