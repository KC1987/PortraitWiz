import {NextResponse} from "next/server";


export async function POST(req:Request) {


  try {
    const payload = await req.json();

    console.log("Webhook Status: ", payload.status);
    console.log("Webhook Received: ", payload);

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.log("Webhook Error: ", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}