"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Try it out, no credit card needed",
    features: ["3 generations per day", "All 4 platforms", "URL & text input", "One-click copy"],
    cta: "Current Plan",
    disabled: true,
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    desc: "For creators who repurpose regularly",
    features: [
      "Unlimited generations",
      "All 4 platforms",
      "Priority processing",
      "Custom brand voice (coming soon)",
      "Bulk processing (coming soon)",
      "API access (coming soon)",
    ],
    cta: "Upgrade to Pro",
    disabled: false,
    highlight: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    desc: "For agencies and marketing teams",
    features: [
      "Everything in Pro",
      "5 team members",
      "Shared brand presets",
      "Analytics dashboard",
      "Priority support",
      "Custom integrations",
    ],
    cta: "Contact Us",
    disabled: false,
    highlight: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    if (plan === "Team") {
      window.location.href = "mailto:hello@recast-ai.com?subject=Team Plan Inquiry";
      return;
    }
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout unavailable. Please try again later.");
      }
    } catch {
      alert("Checkout unavailable. Please try again later.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Header />
      <main style={{ paddingTop: 56 }}>
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0" }}>
          <div className="container" style={{ maxWidth: 960 }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="label">Pricing</span>
              <h1 className="heading-xl" style={{ marginTop: 8, marginBottom: 12 }}>Simple, transparent pricing</h1>
              <p className="text-body">Start free. Upgrade when you need more.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {PLANS.map((p) => (
                <div key={p.name} className="card" style={{
                  padding: "32px 24px",
                  border: p.highlight ? "2px solid var(--accent)" : undefined,
                  position: "relative",
                }}>
                  {p.highlight && (
                    <div style={{
                      position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                      padding: "4px 16px", borderRadius: 20, background: "var(--accent)",
                      color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.03em",
                    }}>
                      POPULAR
                    </div>
                  )}

                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-4)", marginBottom: 16 }}>{p.desc}</p>

                  <div style={{ marginBottom: 20 }}>
                    <span style={{ fontSize: 40, fontWeight: 800, color: "var(--text-1)" }}>{p.price}</span>
                    <span style={{ fontSize: 14, color: "var(--text-4)" }}>{p.period}</span>
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, marginBottom: 24 }}>
                    {p.features.map((f) => (
                      <li key={f} style={{
                        fontSize: 14, color: "var(--text-3)", padding: "6px 0",
                        display: "flex", alignItems: "center", gap: 8,
                      }}>
                        <span style={{ color: "var(--success)", fontSize: 14 }}>&#10003;</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleCheckout(p.name)}
                    disabled={p.disabled || loading === p.name}
                    className={p.highlight ? "btn-primary" : "btn-secondary"}
                    style={{ width: "100%", padding: "12px 24px" }}
                  >
                    {loading === p.name ? "Loading..." : p.cta}
                  </button>
                </div>
              ))}
            </div>

            <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-4)", marginTop: 24 }}>
              All plans include a 7-day money-back guarantee. No questions asked.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
