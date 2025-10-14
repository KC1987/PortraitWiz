interface PurchaseCreditsParams {
  packageId: string;
}

interface PurchaseCreditsResponse {
  url: string;
}

export async function purchaseCredits({
  packageId
}: PurchaseCreditsParams): Promise<PurchaseCreditsResponse> {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      packageId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create checkout session');
  }

  const data = await response.json();

  if (!data.url) {
    throw new Error('No checkout URL returned');
  }

  return { url: data.url };
}
