import { NextRequest, NextResponse } from "next/server";

// Lemon Squeezy Checkout API
// Docs: https://docs.lemonsqueezy.com/api/checkouts/create-checkout
//
// Setup:
// 1. Register at https://lemonsqueezy.com
// 2. Create a Store
// 3. Create Products: "Recast Pro" ($9/mo) and "Recast Team" ($29/mo)
// 4. Get your API key, Store ID, and Variant IDs
// 5. Add them to Vercel environment variables

const LS_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LS_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://recast-ai.vercel.app";

// Variant IDs for each plan (get from Lemon Squeezy dashboard)
const VARIANT_IDS: Record<string, string> = {
  Pro: process.env.LEMONSQUEEZY_VARIANT_PRO || "",
  Team: process.env.LEMONSQUEEZY_VARIANT_TEAM || "",
};

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = (await req.json()) as { plan: string; email?: string };

    if (!plan || !VARIANT_IDS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // If Lemon Squeezy is not configured, return helpful message
    if (!LS_API_KEY || !LS_STORE_ID || !VARIANT_IDS[plan]) {
      return NextResponse.json({
        error: "Payment is being set up. Join the waitlist to be notified when Pro launches!",
        waitlist: true,
      }, { status: 503 });
    }

    // Create Lemon Squeezy Checkout Session
    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LS_API_KEY}`,
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: email || undefined,
              custom: { source: "recast-app" },
            },
            product_options: {
              redirect_url: `${APP_URL}/pricing?success=true`,
            },
          },
          relationships: {
            store: {
              data: { type: "stores", id: LS_STORE_ID },
            },
            variant: {
              data: { type: "variants", id: VARIANT_IDS[plan] },
            },
          },
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errMsg = data?.errors?.[0]?.detail || "Checkout creation failed";
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }

    const checkoutUrl = data?.data?.attributes?.url;
    if (!checkoutUrl) {
      return NextResponse.json({ error: "No checkout URL returned" }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 500 },
    );
  }
}
