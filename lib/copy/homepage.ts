export const homepageMetadata = {
  title: "PortraitWiz | AI Professional Headshots in Minutes",
  description:
    "Generate polished AI professional headshots, LinkedIn photos, and corporate portraits in under 60 seconds. PortraitWiz delivers studio lighting, premium backgrounds, and privacy-first processing for teams and individuals.",
  keywords: [
    "AI headshot generator",
    "AI professional portraits",
    "LinkedIn headshot",
    "corporate portrait AI",
    "studio quality profile photo",
  ],
  ogTitle: "PortraitWiz — AI Professional Headshots in Minutes",
  ogDescription:
    "Transform casual selfies into studio-quality headshots with AI. Upload up to 4 reference images and receive polished portraits instantly.",
}

export const heroContent = {
  heading: "AI Professional Headshots in Minutes",
  subheading:
    "Create brand-ready portraits without booking a photographer. PortraitWiz transforms your reference photos into polished, studio-quality headshots that impress hiring managers, clients, and investors.",
  primaryCta: { label: "Start Generating", href: "#generator" },
  secondaryCta: { label: "See Pricing", href: "/pricing" },
  trustSignals: {
    rating: "4.9/5 rating from 50,000+ professionals",
    dataPoint: "30-second average turnaround",
  },
}

export const socialProofContent = {
  title: "Trusted by Modern Professionals",
  description:
    "Founders, remote teams, and job seekers rely on PortraitWiz to refresh their brand across LinkedIn, résumés, and pitch decks.",
  logos: ["Atlas HR", "LaunchPad VC", "RemoteWave", "CloudStride", "Northline Tech"],
  testimonial: {
    quote:
      "“PortraitWiz gave our entire leadership team professional LinkedIn headshots in under an hour. The lighting and wardrobe presets look like a studio session.”",
    name: "Morgan Shaw",
    title: "Chief People Officer, Atlas HR",
  },
}

export const howItWorksContent = {
  title: "Create Studio-Quality Portraits in Three Steps",
  steps: [
    {
      title: "Upload your references",
      description:
        "Drag and drop up to four high-resolution photos. We support PNG and JPEG files up to 5MB each and never save them to disk.",
    },
    {
      title: "Pick the perfect look",
      description:
        "Choose curated outfits, lighting presets, and background settings crafted for corporate, creative, and speaking engagements.",
    },
    {
      title: "Generate and download",
      description:
        "Our AI renders a polished portrait in less than a minute and gives you a ready-to-share PNG sized for LinkedIn and applicant tracking systems.",
    },
  ],
}

export const featureHighlights = {
  title: "Why PortraitWiz Outperforms DIY Photo Shoots",
  items: [
    {
      title: "Studio Lighting Presets",
      description:
        "Every portrait is tuned with directional key lighting, depth-enhancing shadows, and color grading that flatters a variety of skin tones.",
    },
    {
      title: "Privacy-First Processing",
      description:
        "Reference images are encrypted in transit, processed instantly, and discarded. PortraitWiz never trains models on your likeness.",
    },
    {
      title: "Corporate-Ready Formats",
      description:
        "Download portrait-ready PNG files that meet LinkedIn, corporate directory, and investor deck specifications without extra editing.",
    },
  ],
}

export const pricingPreviewContent = {
  title: "Flexible Credit Packs for Every Team",
  description:
    "Purchase credits only when you need them. Credits never expire and can be used across individuals, teams, or department-wide refreshes.",
  highlight: {
    name: "Professional Pack",
    price: "$19",
    details: "Includes 10 credits — enough for polished portraits across platforms.",
  },
  cta: { label: "Explore Pricing", href: "/pricing" },
}

export const useCasesContent = {
  title: "Tailored for Founders, Teams, and Job Seekers",
  description:
    "PortraitWiz supports professionals across industries with presets designed for LinkedIn, sales decks, speaking engagements, and corporate directories.",
  cases: [
    {
      title: "Tech Founders",
      description:
        "Land investor meetings with confident, on-brand portraits for pitch decks and PR features.",
    },
    {
      title: "People & HR Teams",
      description:
        "Refresh employee directories and onboarding portals with consistent headshots for hybrid and remote teams.",
    },
    {
      title: "Job Seekers",
      description:
        "Stand out on LinkedIn and résumé portals with crisp portraits optimized for recruiters’ ATS previews.",
    },
    {
      title: "Sales & Customer Success",
      description:
        "Upgrade your client-facing presence with approachable, trustworthy photos for email signatures and slide decks.",
    },
  ],
}

export const faqContent = {
  title: "Frequently Asked Questions",
  items: [
    {
      question: "How long does it take to generate a portrait?",
      answer:
        "Most AI portraits are ready in 30–60 seconds thanks to our optimized OpenAI and Gemini pipelines. High-volume queues may take slightly longer during peak demand.",
    },
    {
      question: "Do you store or reuse my reference photos?",
      answer:
        "No. PortraitWiz processes your images securely, never trains on them, and deletes references immediately after generation completes.",
    },
    {
      question: "What file types and sizes are supported?",
      answer:
        "Upload PNG or JPEG files up to 5MB each. We recommend clear, well-lit photos captured at eye level for the best results.",
    },
    {
      question: "Can I use these portraits commercially?",
      answer:
        "Yes, you retain full commercial usage rights for marketing, advertising, and corporate materials generated through PortraitWiz.",
    },
    {
      question: "What happens if I’m not satisfied?",
      answer:
        "If a generation misses the mark, regenerate with different settings or contact support within 7 days for a credit review.",
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
