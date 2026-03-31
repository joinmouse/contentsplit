import { NextRequest, NextResponse } from "next/server";

// Stripe checkout session creation
// To enable real payments:
// 1. Set STRIPE_SECRET_KEY in .env.local
// 2. Create price IDs in Stripe Dashboard
// 3. Update PRICE_IDS below

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://recast-ai.vercel.app";

const PRICE_IDS: Record<string, string> = {
  Pro: process.env.STRIPE_PRICE_PRO || "",
  Team: process.env.STRIPE_PRICE_TEAM || "",
};

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // If Stripe is not configured, return a helpful message
    if (!STRIPE_SECRET_KEY || !PRICE_IDS[plan]) {
      return NextResponse.json({
        error: "Payment not yet configured. Join the waitlist to be notified when Pro is available.",
        waitlist: true,
      }, { status: 503 });
    }

    // Create Stripe Checkout Session
    const session = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "mode": "subscription",
        "payment_method_types[0]": "card",
        "line_items[0][price]": PRICE_IDS[plan],
        "line_items[0][quantity]": "1",
        "success_url": `${APP_URL}/pricing?success=true`,
        "cancel_url": `${APP_URL}/pricing?canceled=true`,
        "allow_promotion_codes": "true",
      }),
    });

    const data = await session.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ url: data.url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 500 },
    );
  }
}
