export const contactMetadata = {
  title: "Contact PortraitWiz Support | Talk to Our Team",
  description:
    "Reach the PortraitWiz team for sales, support, or partnership questions. Send us a message and receive expert guidance on AI headshot solutions.",
  keywords: [
    "contact PortraitWiz",
    "PortraitWiz support",
    "AI headshot help",
    "PortraitWiz sales",
    "PortraitWiz partnerships",
  ],
  ogTitle: "Contact PortraitWiz — We’re Ready to Help",
  ogDescription:
    "Need help with AI headshot credits, onboarding, or enterprise requests? Reach the PortraitWiz team directly.",
}

export const contactHero = {
  heading: "Let’s Create Professional Portraits Together",
  subheading:
    "Have a question about credits, onboarding, or partnerships? Share your details and a PortraitWiz specialist will respond within one business day.",
}

export const contactHighlights = [
  {
    title: "Sales & Partnerships",
    description: "Collaborate with us on custom credit bundles, reseller opportunities, or co-marketing programs.",
    icon: "🤝",
  },
  {
    title: "Product Support",
    description: "Get help with account access, credit usage, or technical questions about AI generation.",
    icon: "🛠️",
  },
  {
    title: "Security & Privacy",
    description: "Learn how PortraitWiz protects reference images with encryption and strict retention policies.",
    icon: "🔐",
  },
]

export const contactDetails = {
  email: "support@portraitwiz.com",
  phone: "+1 (415) 555-0199",
  addressLine1: "88 Market Street, Suite 1200",
  addressLine2: "San Francisco, CA 94105",
  responseTime: "Average response time: under 24 hours on business days.",
}

export function buildContactSchema(baseUrl: string) {
  const normalizedBase = baseUrl.replace(/\/$/, "")
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact PortraitWiz",
    description:
      "Connect with the PortraitWiz team for AI headshot support, enterprise pricing, and partnership inquiries.",
    url: `${normalizedBase}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "PortraitWiz",
      url: normalizedBase,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@portraitwiz.com",
          telephone: "+1-415-555-0199",
          areaServed: "US",
          availableLanguage: ["English"],
        },
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: "sales@portraitwiz.com",
          telephone: "+1-415-555-0199",
          areaServed: ["US", "Canada", "Europe"],
          availableLanguage: ["English"],
        },
      ],
    },
  })
}
