import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import {createClient} from "@/utils/supabase/server";

// @ts-expect-error
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;


export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
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
        credits: metadata.credits,
      });

      // Here you would update your database
      // await allocateTokensToUser(customer_email, metadata.credits);

      const supabase = await createClient();
      const {error} = await supabase.rpc('increment_credits', {
        user_id: metadata.userId,
        amount: Number(metadata.credits),
      });

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