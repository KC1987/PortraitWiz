import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import {createClient} from "@/utils/supabase/server";

// @ts-expect-error - STRIPE_SECRET_KEY is loaded from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

type PackageId = "package-50" | "package-150" | "package-250";

export async function POST(req: Request) {

  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  try {
    const body = await req.json();
    const { packageId } = body as { packageId: PackageId };

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const packages: Record<PackageId, { price: number; credits: number }> = {
      "package-50": { price: 1999, credits: 50 },
      "package-150": { price: 4499, credits: 150 },
      "package-250": { price: 6999, credits: 250 },
    };


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${packageId} Package`,
              description: `Purchase ${packageId}`,
            },
            unit_amount: packages[packageId].price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: user.email,
      metadata: {
        userId: user.id,
        packageId,
        credits: packages[packageId].credits,

      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
    });

    return NextResponse.json({url: session.url});
  } catch (error: unknown) {
    console.error('Stripe error:', error);
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      {error: message},
      {status: 500}
    );
  }
}