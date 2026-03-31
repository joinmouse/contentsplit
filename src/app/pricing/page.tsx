"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PricingPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 56 }}>
        <section style={{ padding: "clamp(60px, 8vw, 100px) 0" }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="label">Pricing</span>
              <h1 className="heading-xl" style={{ marginTop: 8, marginBottom: 12 }}>Pay per use. No subscription.</h1>
              <p className="text-body" style={{ maxWidth: 500, margin: "0 auto" }}>
                Powered by the x402 protocol — pay $0.01 USDC per generation directly from your wallet. No sign-up, no monthly fees.
              </p>
            </div>

            {/* Single pricing card */}
            <div className="card" style={{ padding: "40px 32px", maxWidth: 480, margin: "0 auto", border: "2px solid var(--accent)", textAlign: "center" }}>
              <div style={{
                display: "inline-block", padding: "4px 16px", borderRadius: 20,
                background: "var(--accent)", color: "#fff", fontSize: 11,
                fontWeight: 700, letterSpacing: "0.03em", marginBottom: 20,
              }}>
                x402 PROTOCOL
              </div>

              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 56, fontWeight: 800, color: "var(--text-1)" }}>$0.01</span>
                <span style={{ fontSize: 16, color: "var(--text-4)" }}> USDC / generation</span>
              </div>

              <ul style={{ listStyle: "none", padding: 0, marginBottom: 32, textAlign: "left", maxWidth: 320, margin: "0 auto 32px" }}>
                {[
                  "All 4 platform formats included",
                  "URL & text input",
                  "Unlimited usage — pay as you go",
                  "No account or sign-up needed",
                  "Pay with any EVM wallet",
                  "Instant USDC settlement on Base",
                  "No monthly commitment",
                ].map((f) => (
                  <li key={f} style={{
                    fontSize: 14, color: "var(--text-3)", padding: "8px 0",
                    display: "flex", alignItems: "flex-start", gap: 10,
                  }}>
                    <span style={{ color: "var(--success)", fontSize: 14, marginTop: 2, flexShrink: 0 }}>&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="/#try" className="btn-primary" style={{ width: "100%", padding: "14px 24px", display: "block", textDecoration: "none" }}>
                Start Generating &rarr;
              </a>
            </div>

            {/* How x402 works */}
            <div style={{ marginTop: 64, textAlign: "center" }}>
              <h2 className="heading-md" style={{ marginBottom: 32 }}>How x402 payment works</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
                {[
                  { step: "1", title: "Click Generate", desc: "Submit your content. The API returns HTTP 402 with payment details." },
                  { step: "2", title: "Approve $0.01", desc: "Your wallet signs a $0.01 USDC transfer. No ETH gas needed (EIP-3009)." },
                  { step: "3", title: "Get Results", desc: "Payment is verified on-chain. Content is generated and returned instantly." },
                ].map((s) => (
                  <div key={s.step}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, background: "var(--accent-bg)",
                      color: "var(--accent-text)", fontSize: 18, fontWeight: 800,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 12px", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                    }}>
                      {s.step}
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: "var(--text-1)" }}>{s.title}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-promo PayGate402 */}
            <div className="card" style={{ marginTop: 48, padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>
                  Want x402 payments for your own API?
                </p>
                <p style={{ fontSize: 13, color: "var(--text-3)" }}>
                  Recast is powered by PayGate402 — add USDC micropayments to any API with one line of code.
                </p>
              </div>
              <a href="https://paygate402.vercel.app" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ whiteSpace: "nowrap" }}>
                Visit PayGate402 &rarr;
              </a>
            </div>

            <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-4)", marginTop: 24 }}>
              Payments settle on Base Sepolia testnet. Use testnet USDC from a faucet.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
