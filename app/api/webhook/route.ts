import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import {createClient} from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    // Lazy-load Stripe to avoid build-time initialization errors
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return NextResponse.json({error: 'Server configuration error'}, {status: 500});
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json({error: 'Server configuration error'}, {status: 500});
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({error: 'Missing signature'}, {status: 400});
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signature verification failed';
      console.error('Webhook signature verification failed:', message);
      return NextResponse.json({error: 'Invalid signature'}, {status: 400});
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Get session details
      const {id, customer_email, metadata} = session;

      // TODO: Add credits to user in your database
      // Example:
      // await db.users.update({
      //   where: { email: customer_email },
      //   data: { credits: { increment: metadata.credits } }
      // });

      console.log('Payment successful:', {
        sessionId: id,
        userId: metadata?.userId,
        packageId: metadata?.packageId,
        email: customer_email,
        credits: metadata?.credits,
      });

      // Here you would update your database
      // await allocateTokensToUser(customer_email, metadata.credits);

      const supabase = await createClient();
      const { error: rpcError } = await supabase.rpc('increment_credits', {
        user_id: metadata?.userId,
        amount: Number(metadata?.credits),
      });

      if (rpcError) {
        console.error('Failed to increment credits:', rpcError);
      }
    }

    return NextResponse.json({received: true});
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      {error: 'Webhook handler failed'},
      {status: 500}
    );
  }
}