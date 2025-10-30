export const homepageMetadata = {
  title: "PortraitWiz | AI Professional Headshots in Minutes",
  description:
    "Transform your photos into professional headshots with AI. Studio-quality results in under 60 seconds.",
  keywords: [
    "AI headshot generator",
    "AI professional portraits",
    "LinkedIn headshot",
    "corporate portrait AI",
    "studio quality profile photo",
  ],
  ogTitle: "PortraitWiz — AI Professional Headshots in Minutes",
  ogDescription:
    "Transform your photos into studio-quality headshots with AI. Upload up to 4 images and get professional results instantly.",
}

export const heroContent = {
  heading: "AI Professional Headshots in Minutes",
  subheading:
    "Transform your photos into studio-quality headshots. No photographer needed.",
  primaryCta: { label: "Start Generating", href: "#generator" },
  secondaryCta: { label: "See Pricing", href: "/pricing" },
  trustSignals: {
    rating: "4.9/5 rating from 50,000+ professionals",
    dataPoint: "30-second average turnaround",
  },
}

export const socialProofContent = {
  title: "Trusted by Professionals Worldwide",
  description:
    "Used by founders, teams, and job seekers to create polished headshots for LinkedIn, résumés, and presentations.",
  logos: [],
  testimonial: {
    quote:
      "PortraitWiz gave our team professional headshots in under an hour. The quality looks like a real photo studio.",
    name: "Morgan S.",
    title: "HR Leader",
  },
}

export const howItWorksContent = {
  title: "How It Works",
  steps: [
    {
      title: "Upload Photos",
      description:
        "Upload up to 4 reference photos. PNG or JPEG, up to 10MB each. We never save them.",
    },
    {
      title: "Choose Style",
      description:
        "Select from curated outfit, lighting, and background options.",
    },
    {
      title: "Download",
      description:
        "Get your professional headshot in under a minute, ready for LinkedIn and more.",
    },
  ],
}

export const featureHighlights = {
  title: "Professional Results, Instantly",
  items: [
    {
      title: "Studio-Quality Lighting",
      description:
        "Professional lighting and color grading optimized for headshots.",
    },
    {
      title: "Privacy First",
      description:
        "Your photos are processed instantly and immediately deleted. Never stored or used for training.",
    },
    {
      title: "Ready to Use",
      description:
        "High-quality PNG files optimized for LinkedIn, websites, and presentations.",
    },
  ],
}

export const pricingPreviewContent = {
  title: "Simple Credit-Based Pricing",
  description:
    "Buy credits as you need them. No subscriptions. Credits never expire.",
  highlight: {
    name: "Popular",
    price: "$44.99",
    details: "150 credits • Best value",
  },
  cta: { label: "View All Plans", href: "/pricing" },
}

export const useCasesContent = {
  title: "Perfect for Any Professional",
  description:
    "Create professional headshots for LinkedIn, websites, presentations, and more.",
  cases: [
    {
      title: "Job Seekers",
      description:
        "Stand out with professional headshots for LinkedIn and résumés.",
    },
    {
      title: "Teams & Companies",
      description:
        "Create consistent headshots for your entire team quickly and affordably.",
    },
    {
      title: "Entrepreneurs",
      description:
        "Professional portraits for pitch decks, websites, and media.",
    },
  ],
}

export const faqContent = {
  title: "Frequently Asked Questions",
  items: [
    {
      question: "How long does it take?",
      answer:
        "Most portraits are ready in 30-60 seconds.",
    },
    {
      question: "Do you store my photos?",
      answer:
        "No. Your photos are processed instantly and deleted immediately. We never store or train on your images.",
    },
    {
      question: "What file types are supported?",
      answer:
        "PNG or JPEG files up to 10MB each. For best results, use clear, well-lit photos.",
    },
    {
      question: "Can I use these commercially?",
      answer:
        "Yes, you have full commercial rights to all generated portraits.",
    },
    {
      question: "What if I'm not satisfied?",
      answer:
        "Try generating again with different settings, or contact support for assistance.",
    },
  ],
}

export const schemaOrgContent = {
  product: {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "PortraitWiz",
    description:
      "PortraitWiz is an AI headshot generator that transforms reference photos into professional portraits sized for LinkedIn and corporate branding.",
    brand: { "@type": "Brand", name: "PortraitWiz" },
    offers: {
      "@type": "Offer",
      price: "19",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: "https://www.portraitwiz.com/pricing",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "50000",
    },
  },
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How long does it take to generate a portrait?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Most AI portraits are ready in 30–60 seconds, even during peak demand windows.",
        },
      },
      {
        "@type": "Question",
        name: "Do you store or reuse my reference photos?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "PortraitWiz processes images securely and discards references immediately after the portrait is generated.",
        },
      },
      {
        "@type": "Question",
        name: "What file types and sizes are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Upload PNG or JPEG files up to 5MB each for best results.",
        },
      },
    ],
  },
}
