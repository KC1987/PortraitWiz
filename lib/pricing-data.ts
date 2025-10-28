export interface PricingPackage {
  id: string;
  name: string;
  credits: number;
  price: number; // in cents
  features: string[];
  popular?: boolean;
  badge?: string;
}

export const pricingPackages: PricingPackage[] = [
  {
    id: "package-50",
    name: "Starter",
    credits: 50,
    price: 1999,
    features: [
      "50 portrait credits",
      "Instant delivery",
      "Premium backgrounds",
      "HD resolution",
    ],
  },
  {
    id: "package-150",
    name: "Popular",
    credits: 150,
    price: 4499,
    popular: true,
    badge: "Best Value",
    features: [
      "150 portrait credits",
      "Instant delivery",
      "Premium backgrounds",
      "HD resolution",
      "Priority support",
    ],
  },
  {
    id: "package-250",
    name: "Professional",
    credits: 250,
    price: 6999,
    features: [
      "250 portrait credits",
      "Instant delivery",
      "Premium backgrounds",
      "HD resolution",
      "Priority support",
    ],
  },
  // {
  //   id: "package-test",
  //   name: "Test",
  //   credits: 100,
  //   price: 70,
  //   features: [
  //     "TEST PACKAGE"
  //   ],
  // },
];

/**
 * Helper to format price in cents to dollar string
 */
export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}

/**
 * Calculate price per credit
 */
export function pricePerCredit(priceInCents: number, credits: number): string {
  const perCredit = priceInCents / credits / 100;
  return `$${perCredit.toFixed(2)}`;
}
