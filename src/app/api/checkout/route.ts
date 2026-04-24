import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSettings, addBooking } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tourType, date, session, participants, name, email, phone, notes } = body;

    if (!tourType || !date || !session || !participants || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const settings = await getSettings();

    /* ── price calculation ── */
    let totalPrice = 0;
    if (tourType === "private") {
      const { basePrice, basePersons, additionalPersonPrice } = settings.pricing.private;
      totalPrice = basePrice + Math.max(0, participants - basePersons) * additionalPersonPrice;
    } else {
      totalPrice = settings.pricing.group.pricePerPerson * participants;
    }

    // `session` now holds the actual start time e.g. "12:00" (group) or a chosen private start.
    const sessLabel = tourType === "group"
      ? `${settings.sessions.groupDeparture.startTime}–${settings.sessions.groupDeparture.endTime}`
      : `starts ${session} · ~${settings.sessions.privateWindow.durationHours}h`;

    const bookingId = uuidv4();
    const baseUrl   = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    /* ── Stripe checkout ── */
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: `Ise Sacred Walk — ${tourType === "private" ? "Private" : "Group"} Tour`,
              description: `${date} · ${sessLabel} · ${participants} participant${participants > 1 ? "s" : ""}`,
              images: [],
            },
            unit_amount: totalPrice,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: { bookingId },
      success_url: `${baseUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/#booking`,
    });

    /* ── store pending booking ── */
    await addBooking({
      id:          bookingId,
      createdAt:   new Date().toISOString(),
      tourType,
      date,
      session,
      participants: Number(participants),
      totalPrice,
      status:      "pending",
      customer:    { name, email, phone: phone || "", notes: notes || "" },
      stripeSessionId: checkoutSession.id,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
