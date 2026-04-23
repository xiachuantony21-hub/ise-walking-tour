import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateBookingStatus } from "@/lib/data";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    updateBookingStatus(session.id, "paid");
    console.log(`[webhook] Booking paid: ${session.id}`);
  }

  return NextResponse.json({ received: true });
}
